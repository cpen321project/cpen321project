package com.example.findyourpeers;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

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

    final static String TAG = "LoginPage";
    public static String userID;
    public static String username;
    public static String accessToken;
    public String token;
    private EditText unameET;
    private EditText passwordET;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login_page);

        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(new OnCompleteListener<String>() {
                    @Override
                    public void onComplete(@NonNull Task<String> task) {
                        if (!task.isSuccessful()) {
                            Log.w(TAG, "Fetching FCM registration token failed",
                                    task.getException());
                            return;
                        } else {
                            token = task.getResult().toString();
                            Log.d(TAG, token);
//                            postDataUsingVolley(userID);
                        }
                    }
                });


        unameET = findViewById(R.id.username_login);
        passwordET = findViewById(R.id.password_login);

        Button loginBtn = findViewById(R.id.button_login);
        loginBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String unameStr = unameET.getText().toString();
                String passwordStr = passwordET.getText().toString();
                postLoginData(unameStr, passwordStr);

            }
        });
    }

    private void postLoginData(String unameStr, String passwordStr) {
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        JSONObject loginData = new JSONObject();
        try {
            loginData.put("username", unameStr);
            loginData.put("password", passwordStr);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        String url = Urls.URL + "login";
        JsonObjectRequest jsonObjectRequest =
                new JsonObjectRequest(Request.Method.POST, url, loginData,
                        new Response.Listener<JSONObject>() {
                            @Override
                            public void onResponse(JSONObject response) {
                                try {
                                    JSONObject successResult = response.getJSONObject("result");
                                    accessToken = successResult.getString("accessToken");
                                    userID = successResult.getString("userID");
                                    Log.d("accessToken", accessToken);
                                    Log.d("UserId", userID);

                                    Toast.makeText(LoginPage.this, "Login success",
                                            Toast.LENGTH_SHORT).show();

                                    postDataUsingVolley(userID);

                                    Intent viewProfileIntent = new
                                            Intent(LoginPage.this, ProfilePage.class);
                                    viewProfileIntent.putExtra("userID", userID);
                                    startActivity(viewProfileIntent);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }

                            }
                        }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.d(TAG, "Login VolleyError error: " + error);
                        String errorResponse = new String(error.networkResponse.data);
                        String errorString = "Login failed"; // default error message
                        try {
                            JSONObject errorJSON = new JSONObject(errorResponse);
                            errorString = errorJSON.getString("result");
                            Log.d(TAG, "login errorString: " + errorString);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        Toast.makeText(LoginPage.this,
                                errorString, Toast.LENGTH_SHORT).show();
                    }
                });
        requestQueue.add(jsonObjectRequest);
    }

    public void postDataUsingVolley(String userID) {
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());

        JSONObject newToken = new JSONObject();
        try {
            newToken.put("userID", userID);
            newToken.put("registrationToken", token);
            newToken.put("jwt", LoginPage.accessToken);
            Log.d(TAG, "trying to post the regToken");
            Log.d(TAG, userID);
            Log.d(TAG, token);
            Log.d(TAG, LoginPage.accessToken);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        String url = Urls.URL + "newRegistrationToken";
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, newToken,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
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