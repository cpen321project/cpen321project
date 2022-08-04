package com.example.findyourpeers;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
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


public class CreateProfile extends AppCompatActivity {

    final static String TAG = "CreateProfile";
    public static String usernameStr;
    public String userID;
    public String displayNameStr;
    public String coopStatus;
    public String yearStanding;
    public String token;
    private EditText displayName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {


        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_profile);

        Intent intentCode = getIntent();
        usernameStr = intentCode.getExtras().getString("username");
        userID = intentCode.getExtras().getString("userID");

        displayName = (EditText) findViewById(R.id.display_name_input);

        Spinner coopSpinner = (Spinner) findViewById(R.id.spinner_coop);
        ArrayAdapter<CharSequence> coopAdapter = ArrayAdapter.createFromResource(this,
                R.array.coop_status, android.R.layout.simple_spinner_item);
        coopAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        coopSpinner.setAdapter(coopAdapter);
        coopSpinner.setOnItemSelectedListener(new CoopSpinnerClass());

        Spinner yearSpinner = (Spinner) findViewById(R.id.spinner_yearstanding);
        ArrayAdapter<CharSequence> yearAdapter = ArrayAdapter.createFromResource(this,
                R.array.year_standing, android.R.layout.simple_spinner_item);
        yearAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        yearSpinner.setAdapter(yearAdapter);
        yearSpinner.setOnItemSelectedListener(new YearSpinnerClass());

        Button registerButton = findViewById(R.id.register_button);
        registerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                displayNameStr = displayName.getText().toString();
                if (displayNameStr.isEmpty() && coopStatus.isEmpty() && yearStanding.isEmpty()) {
                    Toast.makeText(CreateProfile.this, "Please enter both the values",
                            Toast.LENGTH_SHORT).show();
                    return;
                }
                // calling a method to post the data and passing our name and job.
                postDataUsingVolley(displayNameStr, coopStatus, yearStanding);
            }
        });


        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(new OnCompleteListener<String>() {
                    @Override
                    public void onComplete(@NonNull Task<String> task) {
                        if (!task.isSuccessful()) {
                            Log.w(TAG, "Fetching FCM registration token failed",
                                    task.getException());
                            return;
                        }

                        // Get new FCM registration token
                        token = task.getResult().toString();

                        Log.d(TAG, token);
                    }
                });

    }

    private void postDataUsingVolley(String name, String coop, String yearstand) {
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        String NotificationPreference = "Yes";
//        PushNotificationService.krleTest("lauda");

        JSONObject newprofile = new JSONObject();
        try {
            //input your API parameters
            newprofile.put("displayName", name);
            newprofile.put("coopStatus", coop);
            newprofile.put("yearStanding", yearstand);
            newprofile.put("userID", userID);
            newprofile.put("registrationToken", token);
            newprofile.put("notifyMe", NotificationPreference);

        } catch (JSONException e) {
            e.printStackTrace();
        }
        String url = Urls.URL + "createprofile";
        JsonObjectRequest jsonObjectRequest =
                new JsonObjectRequest(Request.Method.POST, url, newprofile,
                        new Response.Listener<JSONObject>() {
                            @Override
                            public void onResponse(JSONObject response) {
                                Toast.makeText(CreateProfile.this, "Profile created",
                                        Toast.LENGTH_SHORT).show();
                                Intent loginIntent = new Intent(CreateProfile.this, LoginPage.class);
                                startActivity(loginIntent);
                            }
                        }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(CreateProfile.this, "Sign up failed", Toast.LENGTH_SHORT).show();
                    }
                });
        requestQueue.add(jsonObjectRequest);
    }

    private class CoopSpinnerClass implements AdapterView.OnItemSelectedListener {
        public void onItemSelected(AdapterView<?> parent, View v, int position, long id) {
            coopStatus = parent.getItemAtPosition(position).toString();
        }

        @Override
        public void onNothingSelected(AdapterView<?> parent) {
            // do nothing
        }
    }

    private class YearSpinnerClass implements AdapterView.OnItemSelectedListener {
        public void onItemSelected(AdapterView<?> parent, View v, int position, long id) {
            yearStanding = parent.getItemAtPosition(position).toString();
        }

        @Override
        public void onNothingSelected(AdapterView<?> parent) {
            // do nothing
        }
    }

}