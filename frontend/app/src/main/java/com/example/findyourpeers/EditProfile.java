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

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

public class EditProfile extends AppCompatActivity {

    public String userID;
    public String displayNameStr;
    public String coopStatus;
    public String yearStanding;
    public String notificationPreference;
    private EditText displayName;
    private static final String TAG = "EditProfile";
//    private ArrayList<String> studentCourseList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_profile);

        Intent intentEditProfile = getIntent();
        userID = intentEditProfile.getExtras().getString("userID");
//        studentCourseList =
//                (ArrayList<String>) intentEditProfile.getSerializableExtra("courselist");

        displayName = (EditText) findViewById(R.id.display_name_input_edit);

        Spinner coopSpinner = (Spinner) findViewById(R.id.spinner_coop_edit);
        ArrayAdapter<CharSequence> coopAdapter = ArrayAdapter.createFromResource(this,
                R.array.coop_status, android.R.layout.simple_spinner_item);
        coopAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        coopSpinner.setAdapter(coopAdapter);
        coopSpinner.setOnItemSelectedListener(new EditProfile.CoopSpinnerClassEdit());

        Spinner yearSpinner = (Spinner) findViewById(R.id.spinner_yearstanding_edit);
        ArrayAdapter<CharSequence> yearAdapter = ArrayAdapter.createFromResource(this,
                R.array.year_standing, android.R.layout.simple_spinner_item);
        yearAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        yearSpinner.setAdapter(yearAdapter);
        yearSpinner.setOnItemSelectedListener(new EditProfile.YearSpinnerClassEdit());

        Spinner notificationSpinner = (Spinner) findViewById(R.id.notificationPreferenceSpinner);
        ArrayAdapter<CharSequence> notificationAdapter = ArrayAdapter.createFromResource(this, R.array.notification_preferences, android.R.layout.simple_spinner_item);
        notificationAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        notificationSpinner.setAdapter(notificationAdapter);
        notificationSpinner.setOnItemSelectedListener(new EditProfile.NotificationSpinnerClassEdit());

        Button saveButton = findViewById(R.id.save_button);
        saveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                displayNameStr = displayName.getText().toString();
                if (displayNameStr.isEmpty() && coopStatus.isEmpty() && yearStanding.isEmpty()) {
                    Toast.makeText(EditProfile.this, "Please enter all values",
                            Toast.LENGTH_SHORT).show();
                    return;
                }
                // calling a method to post the data and passing our name and job.
                putDataUsingVolley(displayNameStr, coopStatus, yearStanding);
            }
        });
    }



    private void putDataUsingVolley(String name, String coop, String yearstand) {
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        JSONObject updatedprofile = new JSONObject();
        try {
            updatedprofile.put("displayName", name);
            updatedprofile.put("coopStatus", coop);
            updatedprofile.put("yearStanding", yearstand);
            updatedprofile.put("userID", userID);
            updatedprofile.put("jwt", LoginPage.accessToken);
            updatedprofile.put("notifyMe", notificationPreference);

        } catch (JSONException e) {
            e.printStackTrace();
        }
        String url = Urls.URL + "editprofile";
        JsonObjectRequest jsonObjectRequest =
                new JsonObjectRequest(Request.Method.PUT, url, updatedprofile,
                        new Response.Listener<JSONObject>() {
                            @Override
                            public void onResponse(JSONObject response) {
                                Toast.makeText(EditProfile.this, "Profile edited",
                                        Toast.LENGTH_SHORT).show();
                                Intent profileIntent =
                                        new Intent(EditProfile.this, ProfilePage.class);
                                profileIntent.putExtra("userID", userID);
                                startActivity(profileIntent);
                            }
                        }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        String errorString = new String(error.networkResponse.data);
                        Log.d("EditProfile", "editprofile errorString: " + errorString);
                        if (errorString.equals("Token not validated")) {
                            Toast.makeText(EditProfile.this,
                                    "Session expired, you will be redirected to login",
                                    Toast.LENGTH_LONG).show();
                            Intent loginIntent =
                                    new Intent(EditProfile.this, LoginPage.class);
                            startActivity((loginIntent));
                        } else {
                            Toast.makeText(EditProfile.this, "Unable to edit profile",
                                    Toast.LENGTH_SHORT).show();
                        }
                    }
                });
        requestQueue.add(jsonObjectRequest);
    }

    private class CoopSpinnerClassEdit implements AdapterView.OnItemSelectedListener {
        public void onItemSelected(AdapterView<?> parent, View v, int position, long id) {
            coopStatus = parent.getItemAtPosition(position).toString();
        }

        @Override
        public void onNothingSelected(AdapterView<?> parent) {
            // do nothing
        }
    }

    private class YearSpinnerClassEdit implements AdapterView.OnItemSelectedListener {
        public void onItemSelected(AdapterView<?> parent, View v, int position, long id) {
            yearStanding = parent.getItemAtPosition(position).toString();
        }

        @Override
        public void onNothingSelected(AdapterView<?> parent) {
            // do nothing
        }
    }

    public class NotificationSpinnerClassEdit implements AdapterView.OnItemSelectedListener {
        @Override
        public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
            notificationPreference = parent.getItemAtPosition(position).toString();
            Log.d(TAG, "notification preference: " + notificationPreference);
        }

        @Override
        public void onNothingSelected(AdapterView<?> parent) {
            // do nothing
        }
    }
}