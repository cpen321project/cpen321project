package com.example.findyourpeers;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.ArrayList;
import java.util.List;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class PrivateChatActivity extends AppCompatActivity {
    public RecyclerView myRecyclerView;
    public List<Message> MessageList;
    public ChatBoxAdapter chatBoxAdapter;
    public EditText messageTxt;
    public Button send;
    private Socket socket;
    private String senderName;
    private String receiverName;
    private String senderID;
    private String receiverID;
    // 1 = receiver has blocked sender
    private int isBlocked;// = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        //https://medium.com/@mohamedaymen.ourabi11/creating-a-realtime-chat-app-with-android-nodejs-and-socket-io-1050bc20c70

        Intent privateChatIntent = getIntent();
        isBlocked = privateChatIntent.getExtras().getInt("isBlocked");

        receiverName = privateChatIntent.getExtras().getString("receiverName");
        senderName = privateChatIntent.getExtras().getString("senderName");
        Log.d("PrivateChatActivity", "senderName: " + senderName);
        Log.d("PrivateChatActivity", "receiverName: " + receiverName);

        receiverID = privateChatIntent.getExtras().getString("userID");
        senderID = privateChatIntent.getExtras().getString("currentUserID");

        messageTxt = (EditText) findViewById(R.id.message);
        send = (Button) findViewById(R.id.send);

        MessageList = new ArrayList<>();
        myRecyclerView = (RecyclerView) findViewById(R.id.messagelist);
        LinearLayoutManager mLayoutManager =
                new LinearLayoutManager(getApplicationContext());
        myRecyclerView.setLayoutManager(mLayoutManager);
        mLayoutManager.setStackFromEnd(true);
        myRecyclerView.setItemAnimator(new DefaultItemAnimator());
        myRecyclerView.setAdapter(chatBoxAdapter);

        RequestQueue queue = Volley.newRequestQueue(this);
        String url = Urls.URL + "getPrivateConversationByUserIDs/"
                + senderID + "/" + receiverID + "/" + LoginPage.accessToken;
        JsonArrayRequest jsonArrayRequest =
                new JsonArrayRequest(Request.Method.GET, url, null,
                        new Response.Listener<JSONArray>() {
                            @Override
                            public void onResponse(JSONArray response) {
                                SecretKey key = null;
                                try {
                                    key = Crypto.generateSecretKeyBasedonChatId(senderID + receiverID, "3");
                                } catch (InvalidKeySpecException | NoSuchAlgorithmException e) {
                                    e.printStackTrace();
                                }

                                JSONArray msgsArray = new JSONArray();
                                msgsArray = response;//.getJSONArray("retrievedMsgs");
                                for (int i = 0; i < msgsArray.length(); i++) {
                                    try {
                                        JSONObject msg = msgsArray.getJSONObject(i);

                                        String nickname = msg.getString("senderName");
                                        String message = msg.getString("messageContent");
                                        Log.d("PrivateChatActivity", "message: " + message);
                                        String decryptedMsg = Crypto.decrypt(message, key);

                                        Message m = new Message(nickname, decryptedMsg);
                                        MessageList.add(m);
                                    } catch (JSONException | NoSuchPaddingException | UnsupportedEncodingException | IllegalBlockSizeException | BadPaddingException | NoSuchAlgorithmException | InvalidKeyException e) {
                                        e.printStackTrace();
                                    }
                                }
                                // notify adapter dataset changed
                                chatBoxAdapter = new ChatBoxAdapter(MessageList);
                                chatBoxAdapter.notifyDataSetChanged();
                                myRecyclerView.setAdapter(chatBoxAdapter);

                            }
                        }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.d("PrivateChatActivity", "Volley request error");
                    }
                });

        // Add the request to the RequestQueue.
        queue.add(jsonArrayRequest);

        // connect socket client to the server
        try {
            socket = IO.socket(Urls.URL);

            socket.connect();

            socket.emit("joinPrivateChat", senderName, senderID, LoginPage.accessToken);
            Log.d("PrivateChatActivity", "Joining private chat: " + senderName);

        } catch (URISyntaxException e) {
            e.printStackTrace();
            Log.d("PrivateChatActivity", "Error connect to socket");
        }

        // send message action
        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (messageTxt.getText().toString().isEmpty()) {
                    Toast.makeText(PrivateChatActivity.this,
                            "Cannot send empty message", Toast.LENGTH_SHORT).show();
                } else if (isBlocked == 1) {
                    Toast.makeText(PrivateChatActivity.this,
                            "Blocked", Toast.LENGTH_SHORT).show();
                } else {
                    String encryptedMsg = null;
                    SecretKey key = null;
                    try {
                        key = Crypto.generateSecretKeyBasedonChatId(receiverID + senderID, "3");
                    } catch (InvalidKeySpecException | NoSuchAlgorithmException e) {
                        e.printStackTrace();
                    }
                    try {
                        encryptedMsg = Crypto.encrypt(messageTxt.getText().toString(), key);
                    } catch (InvalidKeyException | IllegalBlockSizeException | BadPaddingException | NoSuchPaddingException | NoSuchAlgorithmException | UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }

                    socket.emit("privateMessage",
                            senderID,
                            receiverID,
                            encryptedMsg,
                            isBlocked);

                    String nickname = senderName;
                    String message = messageTxt.getText().toString();

                    Message m = new Message(nickname, message);
                    MessageList.add(m);

                    chatBoxAdapter = new ChatBoxAdapter(MessageList);
                    chatBoxAdapter.notifyDataSetChanged();
                    myRecyclerView.setAdapter(chatBoxAdapter);

                    messageTxt.setText("");

                    Log.d("PrivateChatActivity", "Message emitted to server");
                }
            }
        });

        socket.on("privateMessage", new Emitter.Listener() {
            @Override
            public void call(final Object... args) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        JSONObject data = (JSONObject) args[0];
                        SecretKey key = null;
                        try {
                            key = Crypto.generateSecretKeyBasedonChatId(senderID + receiverID, "3");
                        } catch (InvalidKeySpecException | NoSuchAlgorithmException e) {
                            e.printStackTrace();
                        }
                        try {
                            String nickname = data.getString("senderNickname");

                            // only show the message if we're currently talking to that person
                            if (nickname.equals(receiverName)) {
                                String message = data.getString("message");
                                String decryptedMsg = Crypto.decrypt(message, key);

                                Message m = new Message(nickname, decryptedMsg);
                                MessageList.add(m);

                                // add the new updated list to the adapter
                                // notify the adapter to update the recycler view
                                // set the adapter for the recycler view
                                chatBoxAdapter = new ChatBoxAdapter(MessageList);
                                chatBoxAdapter.notifyDataSetChanged();
                                myRecyclerView.setAdapter(chatBoxAdapter);
                            }
                        } catch (JSONException | NoSuchPaddingException | UnsupportedEncodingException | IllegalBlockSizeException | NoSuchAlgorithmException | BadPaddingException | InvalidKeyException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }
        });
    }
}