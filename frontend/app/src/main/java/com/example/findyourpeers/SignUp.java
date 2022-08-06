package com.example.findyourpeers;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;


public class SignUp extends AppCompatActivity {

    private EditText emailSU;
    private EditText usernameSU;
    private EditText passwordSU;
    private static String TAG = "SignUp";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up);

        emailSU = (EditText) findViewById(R.id.email_address_signup);
        usernameSU = (EditText) findViewById(R.id.username_signup);
        passwordSU = (EditText) findViewById(R.id.password_signup);

        Button getCodeBtn = findViewById(R.id.verify_email_button);
        getCodeBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String emailStr = emailSU.getText().toString();
                String usernameStr = usernameSU.getText().toString();
                String passwordStr = passwordSU.getText().toString();

                if (emailStr.isEmpty() || usernameStr.isEmpty() || passwordStr.isEmpty()) {
                    Toast.makeText(SignUp.this, "Please enter all fields", Toast.LENGTH_SHORT).show();
                    return;
                }

                postSignUpData(emailStr, usernameStr, passwordStr);

            }
        });


    }

    private void postSignUpData(String emailStr, String usernameStr, String passwordStr) {
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        JSONObject signUpData = new JSONObject();
        try {
            //input your API parameters
            signUpData.put("email",emailStr);
            signUpData.put("password",passwordStr);
            signUpData.put("username", usernameStr);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        // Enter the correct url for your api service site
        String url = Urls.URL + "signup";
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, signUpData,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        String success;
                        String result;
                        try {
                            success = response.getString("success");
                            result = response.getString("result");
                            Log.d("SignUp", "success? : "+success);
                            if (success.equals("false")) {
                                Toast.makeText(SignUp.this, result, Toast.LENGTH_LONG).show();
                            } else {
                                Toast.makeText(SignUp.this, "Credentials sent successfully", Toast.LENGTH_SHORT).show();
                                Intent enterCodeIntent = new Intent(SignUp.this, EnterCode.class);
                                enterCodeIntent.putExtra("email", emailStr);
                                enterCodeIntent.putExtra("password", passwordStr);
                                enterCodeIntent.putExtra("username", usernameStr);
                                enterCodeIntent.putExtra("userID", result);
                                startActivity(enterCodeIntent);
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "Signup VolleyError error: " + error);
                String errorResponse = new String(error.networkResponse.data);
                String errorString = "Sending credentials failed"; // default error message
                try {
                    JSONObject errorJSON = new JSONObject(errorResponse);
                    errorString = errorJSON.getString("result");
                    Log.d(TAG, "Signup errorString: " + errorString);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                Toast.makeText(SignUp.this,
                        errorString, Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue.add(jsonObjectRequest);
    }
}