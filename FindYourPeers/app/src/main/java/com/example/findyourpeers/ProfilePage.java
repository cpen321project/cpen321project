package com.example.findyourpeers;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.Button;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

public class ProfilePage extends AppCompatActivity {

    private TextView displaynameTV, coopTV, yearTV;
    private Button findCourseBtn;
    private String displayname, yearstanding, coopstatus;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile_page);
        Intent intentProfile = getIntent();
        String userID = intentProfile.getExtras().getString("userID");

        displaynameTV = findViewById(R.id.textView_displayname);
        coopTV = findViewById(R.id.textview_coop);
        yearTV = findViewById(R.id.textView_yearstanding);


        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String urltest = "http://10.0.2.2:8081/getuserprofile/"+userID;

        // Initialize a new JsonArrayRequest instance
        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, urltest,
                null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        // Do something with response
                        //mTextView.setText(response.toString());

                        // Process the JSON
                        try{
                                // Get current json object
                                JSONObject student = response.getJSONObject(0);

                                // Get the current student (json object) data
                                displayname = student.getString("displayName");
                                coopstatus = student.getString("coopStatus");
                                yearstanding = student.getString("yearStanding");

                                // Display the formatted json data in text view
                                displaynameTV.setText("Display name: " + displayname);

                                if(coopstatus.equals("Yes")){
                                    coopTV.setText("I am in Co-op");
                                }else{
                                    coopTV.setText("I am not in Co-op, studying only");
                                }
                                yearTV.setText("I am in year " + yearstanding);
                        }catch (JSONException e){
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener(){
                    @Override
                    public void onErrorResponse(VolleyError error){
                        // Do something when error occurred
                        Toast.makeText(ProfilePage.this, "Something went wrong in getting data", Toast.LENGTH_SHORT).show();
                    }
                }
        );

        // Add JsonArrayRequest to the RequestQueue
        requestQueue.add(jsonArrayRequest);

        findCourseBtn = (Button) findViewById(R.id.find_course_button);
        findCourseBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent browseCourseIntent = new Intent(ProfilePage.this, BrowseCourse.class);
                browseCourseIntent.putExtra("userID", userID);
                browseCourseIntent.putExtra("displayName", displayname);
                startActivity(browseCourseIntent);
            }
        });
    }
}