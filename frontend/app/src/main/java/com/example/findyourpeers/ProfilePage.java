package com.example.findyourpeers;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.Button;

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

public class ProfilePage extends AppCompatActivity {
    public LinearLayout layoutCourseButton;
    private TextView displayNameTV;
    private TextView coopTV;
    private TextView yearTV;
    private String displayName;
    private ArrayList<String> courseListAL;
    final private String TAG = "ProfilePage";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile_page);
        Intent intentProfile = getIntent();
        String userID = intentProfile.getExtras().getString("userID");
        String accessToken = LoginPage.accessToken;
        Log.d(TAG, "accessToken in ProfilePage: " +  accessToken);

        courseListAL = new ArrayList<>();

        layoutCourseButton = findViewById(R.id.layout_button_list);

        displayNameTV = findViewById(R.id.textView_displayname);
        coopTV = findViewById(R.id.textview_coop);
        yearTV = findViewById(R.id.textView_yearstanding);

        // set up bottom navigation bar
        BottomNavigationView bottomNavigationView = findViewById(R.id.bottom_navigation);
        bottomNavigationView.setOnItemSelectedListener(new BottomNavigationView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {

                switch (item.getItemId()) {
                    case R.id.my_profile:
                        return true;
                    case R.id.browse_courses:
                        Intent browseCourseIntent =
                                new Intent(ProfilePage.this, BrowseCourse.class);
                        browseCourseIntent.putExtra("userID", userID);
                        browseCourseIntent.putExtra("displayName", displayName);
                        browseCourseIntent.putExtra("courselist", courseListAL);
                        startActivity(browseCourseIntent);
                        return true;
                    case R.id.qa_forum:
                        Intent forumQuestionPageIntent =
                                new Intent(ProfilePage.this, ForumQuestionsPage.class);
                        forumQuestionPageIntent.putExtra("userID", userID);
                        forumQuestionPageIntent.putExtra("displayName", displayName);
                        forumQuestionPageIntent.putExtra("courseList", courseListAL);
                        startActivity(forumQuestionPageIntent);
                        return true;
                    default: return false;
                }
            }
        });

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String urltest = "http://10.0.2.2:3010/getuserprofile/"
                + "0" + "/" + userID + "/" + accessToken;

        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, urltest,
                null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        try {
                            JSONObject student = response.getJSONObject(0);

                            displayName = student.getString("displayName");
                            String coopstatus = student.getString("coopStatus");
                            String yearstanding = student.getString("yearStanding");
                            JSONArray coursesJSONArray = student.getJSONArray("courselist");

                            if (coursesJSONArray != null) {
                                for (int i = 0; i < coursesJSONArray.length(); i++) {
                                    //courseArrayList.add(coursesJSONArray.getString(i));
                                    String courseNameSingle = coursesJSONArray.getString(i);
                                    addCourseButton(courseNameSingle, userID);
                                    courseListAL.add(courseNameSingle);
                                }
                            }

                            // Display the formatted json data in text view
                            displayNameTV.setText("Display name: " + displayName);

                            if (coopstatus.equals("Yes")) {
                                coopTV.setText("I am in Co-op");
                            } else {
                                coopTV.setText("I am not in Co-op, studying only");
                            }
                            yearTV.setText("I am in year " + yearstanding);

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(ProfilePage.this,
                                "Session expired, you will be redirected to login", Toast.LENGTH_LONG).show();
                        Intent loginIntent = new Intent(ProfilePage.this, LoginPage.class);
                        startActivity((loginIntent));
                    }
                }
        );

        requestQueue.add(jsonArrayRequest);

        TextView blockedUsersTextView = (TextView) findViewById(R.id.blocked_users_textView);
        blockedUsersTextView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent seeBlockedUsersIntent =
                        new Intent(ProfilePage.this, BlockedUsersPage.class);
                seeBlockedUsersIntent.putExtra("userID", userID);
                seeBlockedUsersIntent.putExtra("displayName", displayName);
                startActivity(seeBlockedUsersIntent);
            }
        });

        Button findCourseBtn = (Button) findViewById(R.id.find_course_button);
        findCourseBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent browseCourseIntent = new Intent(ProfilePage.this, BrowseCourse.class);
                browseCourseIntent.putExtra("userID", userID);
                browseCourseIntent.putExtra("displayName", displayName);
                browseCourseIntent.putExtra("courselist", courseListAL);
                startActivity(browseCourseIntent);
            }
        });
    }

    private void addCourseButton(String courseNameSingle, String userID) {
        final View courseButtonView = getLayoutInflater().inflate(R.layout.coursename_buttons_layout, null, false);

        Button courseBtn = (Button) courseButtonView.findViewById(R.id.coursename_button);
        courseBtn.setText(courseNameSingle);
        courseBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent viewStudentIntent = new Intent(ProfilePage.this, StudentListPage.class);
                viewStudentIntent.putExtra("currentUserID", userID);
                viewStudentIntent.putExtra("courseName", courseNameSingle);
                viewStudentIntent.putExtra("displayName", displayName);
                viewStudentIntent.putExtra("courseList", courseListAL);
                startActivity(viewStudentIntent);
            }
        });

        ImageView chatBtn = (ImageView) courseButtonView.findViewById(R.id.group_chat_button);
        chatBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent chatIntent = new Intent(ProfilePage.this, ChatActivity.class);
                chatIntent.putExtra("coursename", courseNameSingle);
                chatIntent.putExtra("userID", userID); //userID
                chatIntent.putExtra("displayname", displayName); //nickname
                startActivity(chatIntent);

            }
        });

        ImageView delCourseBtn = (ImageView) courseButtonView.findViewById(R.id.delete_course_button);
        delCourseBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                deleteCoursefromUser(courseNameSingle, userID);
                deleteUserfromCourse(courseNameSingle, userID);
                removeView(courseButtonView);
            }
        });

        layoutCourseButton.addView(courseButtonView);
    }

    private void removeView(View courseButtonView) {
        layoutCourseButton.removeView(courseButtonView);
    }

    private void deleteUserfromCourse(String courseNameSingle, String userID) {
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        String coursenameNoSpace = courseNameSingle.replaceAll(" ", "");

        // Enter the correct url for your api service site
        String urlUserToCourse = "http://10.0.2.2:3010/deleteuserfromcourse" + "/" + userID + "/" + coursenameNoSpace + "/" +LoginPage.accessToken;

        StringRequest deleteRequest = new StringRequest(Request.Method.DELETE, urlUserToCourse,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        // response
                        Toast.makeText(ProfilePage.this, "user deleted from course", Toast.LENGTH_SHORT).show();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // error.
                        Toast.makeText(ProfilePage.this,
                                "Session expired, you will be redirected to login", Toast.LENGTH_LONG).show();
                        Intent loginIntent = new Intent(ProfilePage.this, LoginPage.class);
                        startActivity((loginIntent));
                    }
                }
        );
        requestQueue.add(deleteRequest);
    }

    private void deleteCoursefromUser(String courseNameSingle, String userID) {
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        JSONObject courseDelete = new JSONObject();
        try {
            //input your API parameters
            courseDelete.put("coursename", courseNameSingle);
            courseDelete.put("userID", userID);
            courseDelete.put("jwt", LoginPage.accessToken);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        String url = "http://10.0.2.2:3010/deletecoursefromuser";
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, courseDelete,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Toast.makeText(ProfilePage.this, "Course deleted from user", Toast.LENGTH_SHORT).show();
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(ProfilePage.this,
                        "Session expired, you will be redirected to login", Toast.LENGTH_LONG).show();
                Intent loginIntent = new Intent(ProfilePage.this, LoginPage.class);
                startActivity((loginIntent));
            }
        });
        requestQueue.add(jsonObjectRequest);
    }
}