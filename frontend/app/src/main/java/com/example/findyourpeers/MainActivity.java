package com.example.findyourpeers;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {

    private Button signUpButton;
    private TextView testText;
    final static String TAG = "MainActivity";
    public String token;
    private final ActivityResultLauncher<String> requestPermissionLauncher =
            registerForActivityResult(new ActivityResultContracts.RequestPermission(), isGranted -> {
                if (isGranted) {
                    // FCM SDK (and your app) can post notifications.
                } else {
                    // TODO: Inform user that that your app will not show notifications.
                }
            });


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        //testText = findViewById(R.id.testText);
        //testText.setText("empty");

        // Initialize a new RequestQueue instance
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String urltest = "http://10.0.2.2:3010/getuserprofile/test2";

        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(new OnCompleteListener<String>() {
                    @Override
                    public void onComplete(@NonNull Task<String> task) {
                        if (!task.isSuccessful()) {
                            Log.w(TAG, "Fetching FCM registration token failed", task.getException());
                            return;
                        }

                        // Get new FCM registration token
                        token = task.getResult().toString();

                        // Log and toast
//                        String msg = getString(R.string.msg_token_fmt, token);
                        Log.d(TAG, token);
//                        Toast.makeText(com.example.findyourpeers.MainActivity.this, msg, Toast.LENGTH_SHORT).show();
                    }
                });

        // Initialize a new JsonArrayRequest instance
      /*  JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(
                Request.Method.GET, urltest,
                null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        // Do something with response
                        //mTextView.setText(response.toString());

                        // Process the JSON
                        try{
                            // Loop through the array elements
                            for(int i=0;i<response.length();i++){
                                // Get current json object
                                JSONObject student = response.getJSONObject(i);

                                // Get the current student (json object) data
                                String displayname = student.getString("displayName");
                                String userID = student.getString("userID");

                                // Display the formatted json data in text view
                                testText.setText(displayname +" userID" + userID);
                            }
                        }catch (JSONException e){
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener(){
                    @Override
                    public void onErrorResponse(VolleyError error){
                        // Do something when error occurred
                        Toast.makeText(MainActivity.this, "Something went wrong in getting data", Toast.LENGTH_SHORT).show();
                    }
                }
        );

        // Add JsonArrayRequest to the RequestQueue
        requestQueue.add(jsonArrayRequest);*/

        signUpButton = findViewById(R.id.signup_button);
        signUpButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent createProfileIntent = new Intent(MainActivity.this, CreateProfile.class);
                startActivity(createProfileIntent);
            }
        });

    }
}