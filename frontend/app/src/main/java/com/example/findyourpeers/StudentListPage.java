package com.example.findyourpeers;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class StudentListPage extends AppCompatActivity {
    final private String TAG = "StudentListPage";
    public LinearLayout layoutStudentButton;
    String displayName;
    String userID;
    String currentUserDisplayName;
    String currentUserID;
    TextView titleCourse;
    ArrayList<String> courseList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_student_list_page);

        Intent intentStudentList = getIntent();
        currentUserID = intentStudentList.getExtras().getString("currentUserID");
        String courseName = intentStudentList.getExtras().getString("courseName");
        currentUserDisplayName = intentStudentList.getExtras().getString("displayName");
        courseList = (ArrayList<String>) intentStudentList.getSerializableExtra("courseList");

        layoutStudentButton = findViewById(R.id.layout_student_list);
        String coursenameNoSpace = courseName.replaceAll(" ", "");
        titleCourse = findViewById(R.id.student_list_title);
        titleCourse.setText(courseName);

        BottomNavigationView bottomNavigationView = findViewById(R.id.bottom_navigation);
        bottomNavigationView.setOnItemSelectedListener(new BottomNavigationView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                switch (item.getItemId()) {
                    case R.id.my_profile:
                        Intent displayProfileBackIntent =
                                new Intent(StudentListPage.this, ProfilePage.class);
                        displayProfileBackIntent.putExtra("userID", currentUserID);
                        startActivity(displayProfileBackIntent);
                        return true;
                    case R.id.browse_courses:
                        Intent browseCourseIntent =
                                new Intent(StudentListPage.this, BrowseCourse.class);
                        browseCourseIntent.putExtra("userID", currentUserID);
                        browseCourseIntent.putExtra("displayName", currentUserDisplayName);
                        browseCourseIntent.putExtra("courseList", courseList);
                        startActivity(browseCourseIntent);
                        return true;
                    case R.id.qa_forum:
                        Intent forumQuestionPageIntent =
                                new Intent(StudentListPage.this, ForumQuestionsPage.class);
                        forumQuestionPageIntent.putExtra("userID", currentUserID);
                        forumQuestionPageIntent.putExtra("displayName", currentUserDisplayName);
                        forumQuestionPageIntent.putExtra("courseList", courseList);
                        startActivity(forumQuestionPageIntent);
                        return true;
                    default:
                        return false;
                }
            }
        });

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String urlStudentList = Urls.URL + "getstudentlist/"
                + coursenameNoSpace + "/" + LoginPage.accessToken + "/" + currentUserID;

        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, urlStudentList,
                null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        try {
                            for (int i = 0; i < response.length(); i++) {
                                JSONObject otherstudent = response.getJSONObject(i);

                                // Get the current student (json object) data
                                displayName = otherstudent.getString("displayName");
                                userID = otherstudent.getString("userID");
                                addStudentButton(displayName, userID);
                            }

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        String errorString = new String(error.networkResponse.data);
                        Log.d(TAG, "getstudentlist errorString: " + errorString);
                        if (errorString.equals("Token not validated")) {
                            Toast.makeText(StudentListPage.this,
                                    "Session expired, you will be redirected to login",
                                    Toast.LENGTH_LONG).show();
                            Intent loginIntent =
                                    new Intent(StudentListPage.this, LoginPage.class);
                            startActivity((loginIntent));
                        } else {
                            Toast.makeText(StudentListPage.this,
                                    "getstudentlist error: " + error, Toast.LENGTH_LONG).show();
                        }
                    }
                }
        );

        requestQueue.add(jsonArrayRequest);
    }

    private void addStudentButton(String displayName, String userID) {
        final View studentButtonView = getLayoutInflater()
                .inflate(R.layout.studentname_button_layout, null, false);

        TextView studentName = (TextView) studentButtonView.findViewById(R.id.text_username);
        studentName.setText(displayName);
        studentName.setTag("button-" + displayName);
        studentName.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent viewStudentIntent =
                        new Intent(StudentListPage.this, ViewOtherProfile.class);
                viewStudentIntent.putExtra("currentUserID", currentUserID);
                viewStudentIntent.putExtra("userID", userID);
                viewStudentIntent.putExtra("currentUserDisplayName", currentUserDisplayName);
                viewStudentIntent.putExtra("courseList", courseList);
                startActivity(viewStudentIntent);
            }
        });

        layoutStudentButton.addView(studentButtonView);
    }
}