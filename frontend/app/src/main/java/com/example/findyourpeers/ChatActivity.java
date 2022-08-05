package com.example.findyourpeers;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

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

public class ChatActivity extends AppCompatActivity {
    final String TAG = "ChatActivity";
    public RecyclerView myRecyclerView;
    public List<Message> MessageList;
    public ChatBoxAdapter chatBoxAdapter;
    public EditText messageTxt;
    public Button send;
    private Socket socket;
    private String Nickname;
    private String groupID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        Nickname = getIntent().getExtras().getString("displayname");
        groupID = getIntent().getExtras().getString("coursename");
        String userID = getIntent().getExtras().getString("userID");

        SecretKey key = null;
        try {
            key = CryptoUtils.generateSecretKeyBasedonChatId(groupID, "3");
        } catch (InvalidKeySpecException | NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        //https://medium.com/@mohamedaymen.ourabi11/creating-a-realtime-chat-app-with-android-nodejs-and-socket-io-1050bc20c70

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

        // Instantiate the RequestQueue.
        RequestQueue queue = Volley.newRequestQueue(this);
        String url = Urls.URL + "getConversationByGroupID/" + groupID + "/"
                + userID + "/" + LoginPage.accessToken;

        // Request a string response from the provided URL.
        SecretKey finalKey = key;
        JsonArrayRequest jsonArrayRequest =
                new JsonArrayRequest(Request.Method.GET, url, null,
                        new Response.Listener<JSONArray>() {
                            @Override
                            public void onResponse(JSONArray response) {
//                        Log.d("ChatActivity", "Response: " + response);
                                JSONArray msgsArray = new JSONArray();
                                msgsArray = response;

                                for (int i = 0; i < msgsArray.length(); i++) {
                                    try {
                                        JSONObject msg = msgsArray.getJSONObject(i);
                                        Log.d(TAG, "next msg: " + msg);

                                        String nickname = msg.getString("senderName");
                                        String message = msg.getString("messageContent");
                                        Log.d(TAG, "nickname: " + nickname);
                                        Log.d(TAG, "message: " + message);

                                        String decryptedMsg = CryptoUtils.decrypt(message, finalKey);

                                        Message m = new Message(nickname, decryptedMsg);
                                        MessageList.add(m);
                                    } catch (JSONException | NoSuchPaddingException | UnsupportedEncodingException | IllegalBlockSizeException | NoSuchAlgorithmException | BadPaddingException | InvalidKeyException e) {
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
                        Log.d(TAG, "Volley request error");
                    }
                });

        queue.add(jsonArrayRequest);

        // connect socket client to the server
        try {
            socket = IO.socket(Urls.URL);

            socket.connect();

            socket.emit("joinGroupChat", groupID, userID, LoginPage.accessToken);
            Log.d(TAG, "Joining group chat: " + groupID);

        } catch (URISyntaxException e) {
            e.printStackTrace();
            Log.d(TAG, "Error connect to socket");
        }

        // send message action
        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (messageTxt.getText().toString().isEmpty()) {
                    Toast.makeText(ChatActivity.this,
                            "Cannot send empty message", Toast.LENGTH_SHORT).show();
                } else {
                    String encryptedMsg = null;
                    try {
                        encryptedMsg = CryptoUtils.encrypt(messageTxt.getText().toString(), finalKey);
                    } catch (InvalidKeyException | IllegalBlockSizeException | BadPaddingException | NoSuchAlgorithmException | NoSuchPaddingException | UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                    socket.emit("groupMessage",
                            groupID,
                            userID,
                            Nickname,
                            encryptedMsg);

                    messageTxt.setText("");

                    Log.d(TAG, "Message emitted to server");
                }
            }
        });

        socket.on("groupMessage", new Emitter.Listener() {
            @Override
            public void call(final Object... args) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        JSONObject data = (JSONObject) args[0];
                        try {
                            String nickname = data.getString("senderNickname");
                            String message = data.getString("message");

                            String decryptedMsg = CryptoUtils.decrypt(message, finalKey);

                            Message m = new Message(nickname, decryptedMsg);
                            MessageList.add(m);

                        } catch (JSONException | NoSuchPaddingException | UnsupportedEncodingException | NoSuchAlgorithmException | IllegalBlockSizeException | InvalidKeyException | BadPaddingException e) {
                            e.printStackTrace();
                        }
                        // add the new updated list to the adapter
                        // notify the adapter to update the recycler view
                        // set the adapter for the recycler view
                        chatBoxAdapter = new ChatBoxAdapter(MessageList);
                        chatBoxAdapter.notifyDataSetChanged();
                        myRecyclerView.setAdapter(chatBoxAdapter);
                    }
                });
            }
        });
    }
}