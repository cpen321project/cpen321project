package com.example.findyourpeers;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

public class EditProfile extends AppCompatActivity {

    private EditText displayName;
    public String userID;
    public String username;
    public String displayNameStr;
    public String coopStatus;
    public String yearStanding;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_profile);

        Intent intentEditProfile = getIntent();
        userID = intentEditProfile.getExtras().getString("userID");
        username = intentEditProfile.getExtras().getString("username");

        displayName = (EditText) findViewById(R.id.display_name_input_edit);

        Spinner coopSpinner = (Spinner) findViewById(R.id.spinner_coop_edit);
        ArrayAdapter<CharSequence> coopAdapter = ArrayAdapter.createFromResource(this, R.array.coop_status, android.R.layout.simple_spinner_item);
        coopAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        coopSpinner.setAdapter(coopAdapter);
        coopSpinner.setOnItemSelectedListener(new EditProfile.CoopSpinnerClassEdit());

        Spinner yearSpinner = (Spinner) findViewById(R.id.spinner_yearstanding_edit);
        ArrayAdapter<CharSequence> yearAdapter = ArrayAdapter.createFromResource(this, R.array.year_standing, android.R.layout.simple_spinner_item);
        yearAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        yearSpinner.setAdapter(yearAdapter);
        yearSpinner.setOnItemSelectedListener(new EditProfile.YearSpinnerClassEdit());



        Button saveButton = findViewById(R.id.save_button);
        saveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                displayNameStr = displayName.getText().toString();
                if (displayNameStr.isEmpty() && coopStatus.isEmpty() && yearStanding.isEmpty()) {
                    Toast.makeText(EditProfile.this, "Please enter all values", Toast.LENGTH_SHORT).show();
                    return;
                }
                // calling a method to post the data and passing our name and job.
                putDataUsingVolley(displayNameStr, coopStatus, yearStanding);
            }
        });


    }

    private void putDataUsingVolley(String name, String coop, String yearstand) {
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());


//        PushNotificationService.krleTest("lauda");


        JSONObject updatedprofile = new JSONObject();
        try {
            //input your API parameters
            updatedprofile.put("displayName",name);
            updatedprofile.put("coopStatus", coop);
            updatedprofile.put("yearStanding", yearstand);
            //updatedprofile.put("userID", userID);
            updatedprofile.put("username", username);
            updatedprofile.put("jwt", LoginPage.accessToken);

        } catch (JSONException e) {
            e.printStackTrace();
        }
        // Enter the correct url for your api service site
        String url = "http://10.0.2.2:3010/editprofile";
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.PUT, url, updatedprofile,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Toast.makeText(EditProfile.this, "Profile edited", Toast.LENGTH_SHORT).show();
                        Intent profileIntent = new Intent(EditProfile.this, ProfilePage.class);
                        profileIntent.putExtra("userID", userID);
                        profileIntent.putExtra("username", username);
                        startActivity(profileIntent);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(EditProfile.this, "Unable to edit profile", Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue.add(jsonObjectRequest);


    }

    private class CoopSpinnerClassEdit implements AdapterView.OnItemSelectedListener {
        public void onItemSelected(AdapterView<?> parent, View v, int position, long id)
        {
            coopStatus = parent.getItemAtPosition(position).toString();
        }

        @Override
        public void onNothingSelected(AdapterView<?> parent) {
            // do nothing
        }
    }

    private class YearSpinnerClassEdit implements AdapterView.OnItemSelectedListener {
        public void onItemSelected(AdapterView<?> parent, View v, int position, long id)
        {
            yearStanding = parent.getItemAtPosition(position).toString();
        }

        @Override
        public void onNothingSelected(AdapterView<?> parent) {
            // do nothing
        }
    }
}