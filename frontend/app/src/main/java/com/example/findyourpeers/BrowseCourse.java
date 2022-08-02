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
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;


public class BrowseCourse extends AppCompatActivity {

    public String userID;
    public String displayName;
    public LinearLayout layoutCourseList;
    private ArrayList<String> studentCourseList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_browse_course);
        Intent intentCourse = getIntent();
        userID = intentCourse.getExtras().getString("userID");
        displayName = intentCourse.getExtras().getString("displayName");
        studentCourseList = (ArrayList<String>) intentCourse.getSerializableExtra("courselist");

        //AutoCompleteTextView actvCourse = (AutoCompleteTextView) findViewById(R.id.autocompletecourse);
        EditText etCourse = (EditText) findViewById(R.id.edit_text_course);
        ImageView searchButton = findViewById(R.id.dropdown_button);
        Button browseMoreButton = findViewById(R.id.browsemore_button);
        Button getProfileBackBtn = findViewById(R.id.get_back_profile_button);
        layoutCourseList = findViewById(R.id.layout_courses_browse);

        ArrayList<String> courseList = new ArrayList<>();

        // set up bottom navigation bar
        BottomNavigationView bottomNavigationView = findViewById(R.id.bottom_navigation);
        bottomNavigationView.setOnItemSelectedListener(new BottomNavigationView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {

                switch (item.getItemId()) {
                    case R.id.my_profile:
                        Intent displayProfileBackIntent = new Intent(BrowseCourse.this, ProfilePage.class);
                        displayProfileBackIntent.putExtra("userID", userID);
                        startActivity(displayProfileBackIntent);
                        return true;
                    case R.id.browse_courses:
                        return true;
                    case R.id.qa_forum:
                        Intent forumQuestionPageIntent =
                                new Intent(BrowseCourse.this, ForumQuestionsPage.class);
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

        searchButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                layoutCourseList.removeAllViews();
                courseList.removeAll(courseList);
                String userInputCourse = etCourse.getText().toString();
                String userInputCourseNoSpace = userInputCourse.replaceAll(" ", "%20");
                RequestQueue requestQueue = Volley.newRequestQueue(BrowseCourse.this);
                String urlcourse = "https://ubcexplorer.io/searchAny/" + userInputCourseNoSpace;
                JsonArrayRequest requestCourse = new JsonArrayRequest(Request.Method.GET, urlcourse, null, new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        try {
                            for (int i = 0; i < response.length(); i++) {
                                JSONObject jsonObject = response.getJSONObject(i);
                                String coursename = jsonObject.getString("code");
                                courseList.add(coursename);
                                addToCourseList(coursename);
                            }

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        if (error.networkResponse != null) {
                            try {
                                Toast.makeText(BrowseCourse.this,
                                        "Error searching for courses", Toast.LENGTH_SHORT).show();
                                String body = new String(error.networkResponse.data, "UTF-8");
                                Log.d("Browse Course", "error: " + body);
                            } catch (UnsupportedEncodingException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                }
                );
                //BrowseCourseSingleton.getInstance(BrowseCourse.this).addToRequestQueue(requestCourse);
                requestQueue.add(requestCourse);

            }
        });

        browseMoreButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent browseMoreIntent = new Intent(BrowseCourse.this, BrowseMoreCourse.class);
                browseMoreIntent.putExtra("userID", userID);
                browseMoreIntent.putExtra("displayName", displayName);
                browseMoreIntent.putExtra("courselist", studentCourseList);
                startActivity(browseMoreIntent);
            }
        });

        getProfileBackBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent displayProfileBackIntent = new Intent(BrowseCourse.this, ProfilePage.class);
                displayProfileBackIntent.putExtra("userID", userID);
                startActivity(displayProfileBackIntent);
            }
        });

    }

    private void addToCourseList(String inputCoursename) {
        TextView coursenameTV = new TextView(BrowseCourse.this);
        coursenameTV.setText(inputCoursename);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
        );
        coursenameTV.setLayoutParams(params);
        coursenameTV.setTextColor(Color.parseColor("#002145"));
        coursenameTV.setTextSize(TypedValue.COMPLEX_UNIT_SP, 17);
        coursenameTV.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AlertDialog.Builder builder = new AlertDialog.Builder(BrowseCourse.this);
                builder.setCancelable(true);
                builder.setTitle("Add Course Confirmation");
                builder.setMessage("Are you sure to add " + inputCoursename + " to your course list?");
                builder.setPositiveButton("Add Course",
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                if (studentCourseList.contains(inputCoursename)) {
                                    Toast.makeText(BrowseCourse.this, "Course has been added before", Toast.LENGTH_SHORT).show();
                                } else if (inputCoursename == null) {
                                    Toast.makeText(BrowseCourse.this, "Course name invalid, please select from the list only", Toast.LENGTH_SHORT).show();
                                } else {
                                    addCourseToUser(inputCoursename);
                                    addUserToCourse(inputCoursename, displayName);
                                    studentCourseList.add(inputCoursename);
                                    Toast.makeText(BrowseCourse.this, "Course added", Toast.LENGTH_SHORT).show();
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
        layoutCourseList.addView(coursenameTV);
    }

    private void addUserToCourse(String coursename, String displayName) {
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
        String urlUserToCourse = "http://34.130.14.116:3010/addusertocourse";
        JsonObjectRequest jsonObjectRequest2 = new JsonObjectRequest(Request.Method.POST, urlUserToCourse, usertoadd,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Toast.makeText(BrowseCourse.this, "User added to course", Toast.LENGTH_SHORT).show();
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("BrowseCourse", "addusertocourse error: " + error.getMessage());
//                Toast.makeText(BrowseCourse.this, "user side failed", Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue.add(jsonObjectRequest2);
    }


    private void addCourseToUser(String coursename) {
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
        String urlCourseToUser = "http://34.130.14.116:3010/addcoursetouser";
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, urlCourseToUser, coursetoadd,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Toast.makeText(BrowseCourse.this, "Course added to user", Toast.LENGTH_SHORT).show();
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("BrowseCourse", "addcoursetouser error: " + error.getMessage());
                Toast.makeText(BrowseCourse.this, "course side failed", Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue.add(jsonObjectRequest);
    }


}