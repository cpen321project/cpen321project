package com.example.findyourpeers;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class BrowseMoreCourse extends AppCompatActivity {

    public LinearLayout layoutBMC;
    private ArrayList<String> studentCourseList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_browse_more_course);

        Intent intentBrowseMore = getIntent();
        String userID = intentBrowseMore.getExtras().getString("userID");
        String displayName = intentBrowseMore.getExtras().getString("displayName");
        studentCourseList = (ArrayList<String>) intentBrowseMore.getSerializableExtra("courselist");

        layoutBMC = findViewById(R.id.layout_browse_more_course);

        BottomNavigationView bottomNavigationView = findViewById(R.id.bottom_navigation);
        bottomNavigationView.setOnItemSelectedListener(new BottomNavigationView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {

                switch (item.getItemId()) {
                    case R.id.my_profile:
                        Intent displayProfileBackIntent = new Intent(BrowseMoreCourse.this, ProfilePage.class);
                        displayProfileBackIntent.putExtra("userID", userID);
                        startActivity(displayProfileBackIntent);
                        return true;
                    case R.id.browse_courses:
                        Intent browseCourseIntent =
                                new Intent(BrowseMoreCourse.this, BrowseCourse.class);
                        browseCourseIntent.putExtra("userID", userID);
                        browseCourseIntent.putExtra("displayName", displayName);
                        browseCourseIntent.putExtra("courseList", studentCourseList);
                        startActivity(browseCourseIntent);
                        return true;
                    case R.id.qa_forum:
                        Intent forumQuestionPageIntent =
                                new Intent(BrowseMoreCourse.this, ForumQuestionsPage.class);
                        forumQuestionPageIntent.putExtra("userID", userID);
                        forumQuestionPageIntent.putExtra("displayName", displayName);
                        forumQuestionPageIntent.putExtra("courseList", studentCourseList);
                        startActivity(forumQuestionPageIntent);
                        return true;
                    default:
                        return false;
                }
            }
        });

        Toast.makeText(BrowseMoreCourse.this,
                "Loading courses...", Toast.LENGTH_LONG).show();

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String urlcourse = "https://ubcexplorer.io/getAllCourses";

        // Initialize a new JsonArrayRequest instance
        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, urlcourse,
                null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        // Process the JSON
                        try {
                            for (int i = 0; i < response.length(); i++) {
                                JSONObject jsonObject = response.getJSONObject(i);
                                String coursename = jsonObject.getString("code");
                                allCourseButton(coursename, userID, displayName);
                            }

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // Do something when error occurred
                        Toast.makeText(BrowseMoreCourse.this, "Something went wrong in getting data", Toast.LENGTH_SHORT).show();
                    }
                }
        );

        // Add JsonArrayRequest to the RequestQueue
        requestQueue.add(jsonArrayRequest);
    }

    private void allCourseButton(String coursename, String userID, String displayName) {
        TextView allcourseTV = new TextView(BrowseMoreCourse.this);
        allcourseTV.setText(coursename);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
        );
        allcourseTV.setLayoutParams(params);
        allcourseTV.setTextColor(Color.parseColor("#002145"));
        allcourseTV.setGravity(Gravity.CENTER);
        allcourseTV.setTextSize(TypedValue.COMPLEX_UNIT_SP, 17);
        allcourseTV.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AlertDialog.Builder builder = new AlertDialog.Builder(BrowseMoreCourse.this);
                builder.setCancelable(true);
                builder.setTitle("Add Course Confirmation");
                builder.setMessage("Are you sure you want to add " + coursename + " to your course list?");
                builder.setPositiveButton("Add Course",
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                if (studentCourseList.contains(coursename)) {
                                    Toast.makeText(BrowseMoreCourse.this, "Course has been added before", Toast.LENGTH_SHORT).show();
                                } else if (coursename == null) {
                                    Toast.makeText(BrowseMoreCourse.this, "Course name invalid, please select from the list only", Toast.LENGTH_SHORT).show();
                                } else {
                                    addCourseToUserBMC(coursename, userID);
                                    addUserToCourseBMC(coursename, displayName, userID);
                                    studentCourseList.add(coursename);
                                    Toast.makeText(BrowseMoreCourse.this, "Course added", Toast.LENGTH_SHORT).show();
                                }
                            }
                        });
                builder.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        //do nothing
                    }
                });

                AlertDialog dialog = builder.create();
                dialog.show();

            }
        });

        layoutBMC.addView(allcourseTV);

    }

    private void addUserToCourseBMC(String coursename, String displayName, String userID) {
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        JSONObject usertoadd = new JSONObject();
        try {
            //input your API parameters
            usertoadd.put("coursename", coursename);
            usertoadd.put("userID", userID);
            usertoadd.put("displayName", displayName);
            usertoadd.put("jwt", LoginPage.accessToken);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        // Enter the correct url for your api service site
        String urlUserToCourse = Urls.URL + "addusertocourse";
        JsonObjectRequest jsonObjectRequest2 = new JsonObjectRequest(Request.Method.POST, urlUserToCourse, usertoadd,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Toast.makeText(BrowseMoreCourse.this, "User added to course", Toast.LENGTH_SHORT).show();
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                String errorString = "";
                if (error.networkResponse != null) {
                    errorString = new String(error.networkResponse.data);
                } else {
                    errorString = error.toString();
                }
                Log.d("BrowseMoreCourse", "addusertocourse errorString: " + errorString);
                if (errorString.equals("Token not validated")) {
                    Toast.makeText(BrowseMoreCourse.this,
                            "Session expired, you will be redirected to login", Toast.LENGTH_LONG).show();
                    Intent loginIntent = new Intent(BrowseMoreCourse.this, LoginPage.class);
                    startActivity((loginIntent));
                } else {
                    Toast.makeText(BrowseMoreCourse.this,
                            "addusertocourse error: " + errorString, Toast.LENGTH_LONG).show();
                }
            }
        });
        requestQueue.add(jsonObjectRequest2);
    }

    private void addCourseToUserBMC(String coursename, String userID) {
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        JSONObject coursetoadd = new JSONObject();
        try {
            //input your API parameters
            coursetoadd.put("coursename", coursename);
            coursetoadd.put("userID", userID);
            coursetoadd.put("jwt", LoginPage.accessToken);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        // Enter the correct url for your api service site
        String urlCourseToUser = Urls.URL + "addcoursetouser";
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, urlCourseToUser, coursetoadd,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Toast.makeText(BrowseMoreCourse.this, "Course added to user", Toast.LENGTH_SHORT).show();
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                String errorString = new String(error.networkResponse.data);
                Log.d("BrowseMoreCourse", "addcoursetouser errorString: " + errorString);
                if (errorString.equals("Token not validated")) {
                    Toast.makeText(BrowseMoreCourse.this,
                            "Session expired, you will be redirected to login", Toast.LENGTH_LONG).show();
                    Intent loginIntent = new Intent(BrowseMoreCourse.this, LoginPage.class);
                    startActivity((loginIntent));
                } else {
                    Toast.makeText(BrowseMoreCourse.this,
                            "addcoursetouser error", Toast.LENGTH_LONG).show();
                }
            }
        });
        requestQueue.add(jsonObjectRequest);
    }
}