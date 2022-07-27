package com.example.findyourpeers;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

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
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;

import org.json.JSONException;
import org.json.JSONObject;

public class LoginPage extends AppCompatActivity {

    private EditText unameET;
    private EditText passwordET;
    public static String userID;
    public static String accessToken;
    public String token;
    final static String TAG = "LoginPage";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login_page);

        unameET= findViewById(R.id.username_login);
        passwordET= findViewById(R.id.password_login);

        Button loginBtn = findViewById(R.id.button_login);
        loginBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String unameStr= unameET.getText().toString();
                String passwordStr = passwordET.getText().toString();
                postLoginData(unameStr,passwordStr);

            }
        });


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


    }

    private void postLoginData(String unameStr, String passwordStr) {
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        JSONObject loginData = new JSONObject();
        try {
            //input your API parameters
            loginData.put("username",unameStr);
            loginData.put("password",passwordStr);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        // Enter the correct url for your api service site
        String url = Urls.URL + "login";
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, loginData,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        String success;
                        String result;
                        try{
                            success = response.getString("success");
                            Log.d("LoginPage", "success? : "+success);
                            if(success.equals("false")){
                                result = response.getString("result");
                                Toast.makeText(LoginPage.this, result, Toast.LENGTH_SHORT).show();
                            }else{
                                JSONObject successResult = response.getJSONObject("result");
                                accessToken = successResult.getString("accessToken");
                                Toast.makeText(LoginPage.this, "Login success", Toast.LENGTH_SHORT).show();
                                Intent viewProfileIntent = new Intent(LoginPage.this, ProfilePage.class);
                                Log.d("accessToken", successResult.getString("accessToken"));
                                Log.d("UserId", successResult.getString("userID"));
                                //userID = unameStr;
                                userID = successResult.getString("userID");
                                viewProfileIntent.putExtra("userID", successResult.getString("userID"));
                                viewProfileIntent.putExtra("username", unameStr);
                                Log.d("accessToken", successResult.getString("accessToken"));
                                postDataUsingVolley(userID);
                                startActivity(viewProfileIntent);
                            }
                        }catch(JSONException e){
                            e.printStackTrace();
                        }

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(LoginPage.this, "Login failed", Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue.add(jsonObjectRequest);
    }
    private void postDataUsingVolley(String userID) {
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());

        JSONObject newToken = new JSONObject();
        try {
            //input your API parameters
            newToken.put("userID", userID);
            newToken.put("registrationToken", token);
            newToken.put("jwt", LoginPage.accessToken);
            Log.d(TAG, "trying to post the regToken");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        // Enter the correct url for your api service site
        String url = Urls.URL +  "newRegistrationToken";
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, newToken,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
//                        Toast.makeText(CreateProfile.this, "Profile created", Toast.LENGTH_SHORT).show();
                        Log.d(TAG, "successfully updated token for firebase");
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "Was not able to update firebase token on backend");
            }
        });
        requestQueue.add(jsonObjectRequest);

    }

}