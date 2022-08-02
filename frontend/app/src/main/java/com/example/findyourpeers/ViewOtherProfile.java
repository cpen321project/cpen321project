package com.example.findyourpeers;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
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
import com.example.findyourpeers.LoginPage;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class ViewOtherProfile extends AppCompatActivity {

    public LinearLayout layoutCourseOther;
    ArrayList<String> courseList;
    private TextView otherDisplayNameTV;
    private TextView otherCoopTV;
    private TextView otherYearTV;
    private String otherdisplayname;
    private int isBlocked = 0;
    private boolean otherUserIsBlockedAlready = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_other_profile);

        Intent intentProfileOther = getIntent();
        String userID = intentProfileOther.getExtras().getString("userID");
        String currentUserID = intentProfileOther.getExtras().getString("currentUserID");
        courseList = (ArrayList<String>) intentProfileOther.getSerializableExtra("courseList");

        String currentUserDisplayName = intentProfileOther.getExtras().
                getString("currentUserDisplayName");

        otherDisplayNameTV = findViewById(R.id.other_display_name);
        otherCoopTV = findViewById(R.id.other_coop_status);
        otherYearTV = findViewById(R.id.other_year_standing);

        layoutCourseOther = findViewById(R.id.other_courses_taken_layout);

        BottomNavigationView bottomNavigationView = findViewById(R.id.bottom_navigation);
        bottomNavigationView.setOnItemSelectedListener(new BottomNavigationView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {

                switch (item.getItemId()) {
                    case R.id.my_profile:
                        Intent displayProfileBackIntent = new Intent(ViewOtherProfile.this, ProfilePage.class);
                        displayProfileBackIntent.putExtra("userID", currentUserID);
                        startActivity(displayProfileBackIntent);
                        return true;
                    case R.id.browse_courses:
                        Intent browseCourseIntent =
                                new Intent(ViewOtherProfile.this, BrowseCourse.class);
                        browseCourseIntent.putExtra("userID", currentUserID);
                        browseCourseIntent.putExtra("displayName", currentUserDisplayName);
                        browseCourseIntent.putExtra("courseList", courseList);
                        startActivity(browseCourseIntent);
                        return true;
                    case R.id.qa_forum:
                        Intent forumQuestionPageIntent =
                                new Intent(ViewOtherProfile.this, ForumQuestionsPage.class);
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
        String urlOther = Urls.URL + "getuserprofile/"
                + userID + "/" + currentUserID + "/" + LoginPage.accessToken;

        // Initialize a new JsonArrayRequest instance
        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, urlOther,
                null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        // Do something with response
                        // Process the JSON
                        try {
                            // Get current json object
                            JSONObject student = response.getJSONObject(0);

                            // Get the current student (json object) data
                            otherdisplayname = student.getString("displayName");
                            String othercoopstatus = student.getString("coopStatus");
                            String otheryearstanding = student.getString("yearStanding");
                            JSONArray coursesJSONArray = student.getJSONArray("courselist");
                            JSONArray blockedUsersJSONArray = student.getJSONArray("blockedUsers");
                            // check if this other user has blocked the current user
                            for (int i = 0; i < blockedUsersJSONArray.length(); i++) {
                                if (blockedUsersJSONArray.getString(i).equals(currentUserID)) {
                                    isBlocked = 1; // true
                                }
                            }

                            if (coursesJSONArray != null) {
                                for (int i = 0; i < coursesJSONArray.length(); i++) {
                                    //courseArrayList.add(coursesJSONArray.getString(i));
                                    String courseNameSingle = coursesJSONArray.getString(i);
                                    viewCourseButton(courseNameSingle);
                                }
                            }

                            // Display the formatted json data in text view
                            otherDisplayNameTV.setText(otherdisplayname);

                            if (othercoopstatus.equals("Yes")) {
                                otherCoopTV.setText("I am in Co-op");
                            } else {
                                otherCoopTV.setText("I am not in Co-op, studying only");
                            }
                            otherYearTV.setText("I am in year " + otheryearstanding);


                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // Do something when error occurred
                        Toast.makeText(ViewOtherProfile.this, "Something went wrong in getting data", Toast.LENGTH_SHORT).show();
                    }
                }
        );

        // Add JsonArrayRequest to the RequestQueue
        requestQueue.add(jsonArrayRequest);

        Button messageButton = findViewById(R.id.button_message);
        messageButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                messageButtonFcn(currentUserDisplayName, otherdisplayname, isBlocked, currentUserID, userID);
            }
        });

        Button blockButton = findViewById(R.id.button_block);
        blockButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                blockButtonfcn(currentUserID, userID, requestQueue);
            }
        });

    }

    private void blockButtonfcn(String currentUserID, String userID, RequestQueue requestQueue1) {
        if (currentUserID.equals(userID)) {
            Toast.makeText(ViewOtherProfile.this, "You cannot block yourself",
                    Toast.LENGTH_SHORT).show();
        } else {
            String urlCurrentUser = Urls.URL + "getuserprofile/"
                    + "0" + "/" + currentUserID + "/" + LoginPage.accessToken;

            JsonArrayRequest jsonArrayRequest2 =
                    new JsonArrayRequest(Request.Method.GET, urlCurrentUser, null,
                            new Response.Listener<JSONArray>() {
                                @Override
                                public void onResponse(JSONArray response) {
                                    try {
                                        JSONObject student = response.getJSONObject(0);

                                        JSONArray blockedUsers =
                                                student.getJSONArray("blockedUsers");

                                        // check current user already blocked the other user
                                        for (int i = 0; i < blockedUsers.length(); i++) {
                                            if (blockedUsers.getString(i).equals(userID)) {
                                                otherUserIsBlockedAlready = true;
                                                break;
                                            }
                                        }

                                        if (otherUserIsBlockedAlready) {
                                            Toast.makeText(ViewOtherProfile.this,
                                                    "You have already blocked this user.",
                                                    Toast.LENGTH_SHORT).show();
                                        } else {
                                            makeBlockUserRequest(currentUserID, userID, requestQueue1);
                                        }
                                    } catch (JSONException e) {
                                        e.printStackTrace();
                                    }
                                }
                            },
                            new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {
                                    Toast.makeText(ViewOtherProfile.this,
                                            "Request error: unable to block user", Toast.LENGTH_SHORT).show();
                                }
                            }
                    );
            requestQueue1.add(jsonArrayRequest2);

        }

    }

    private void messageButtonFcn(String currentUserDisplayName1, String otherdisplayname1, int isBlocked, String currentUserID, String userID) {
        Intent privateChatIntent = new Intent(ViewOtherProfile.this,
                PrivateChatActivity.class);
        Log.d("ViewOtherProfile", "currentUserDisplayName: " + currentUserDisplayName1);
        Log.d("ViewOtherProfile", "otherdisplayname: " + otherdisplayname1);
        if (currentUserDisplayName1.equals(otherdisplayname1)) {
            Toast.makeText(ViewOtherProfile.this, "You cannot message yourself",
                    Toast.LENGTH_SHORT).show();
        } else {
            privateChatIntent.putExtra("senderName", currentUserDisplayName1);
            privateChatIntent.putExtra("receiverName", otherdisplayname1);
            privateChatIntent.putExtra("isBlocked", isBlocked);
            privateChatIntent.putExtra("currentUserID", currentUserID);
            privateChatIntent.putExtra("userID", userID);

            startActivity(privateChatIntent);
        }
    }

    private void viewCourseButton(String courseNameSingle) {
        TextView othercoursenameTV = new TextView(ViewOtherProfile.this);
        othercoursenameTV.setText(courseNameSingle);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
        );
        othercoursenameTV.setLayoutParams(params);
        othercoursenameTV.setTextColor(Color.parseColor("#002145"));
        othercoursenameTV.setGravity(Gravity.CENTER);
        othercoursenameTV.setTextSize(TypedValue.COMPLEX_UNIT_SP, 17);
        layoutCourseOther.addView(othercoursenameTV);
    }

    private void makeBlockUserRequest(String currentUserID, String userID, RequestQueue requestQueue) {
        String url = Urls.URL + "block";
        JSONObject blockObj = new JSONObject();
        try {
            //input your API parameters
            blockObj.put("userID", currentUserID);
            blockObj.put("jwt", LoginPage.accessToken);
            blockObj.put("blockedUserAdd", userID);//the other user's id
            blockObj.put("jwt", LoginPage.accessToken);
            Log.d("viewOtherProfile:block", "userID: " + currentUserID);
            Log.d("viewOtherProfile:block", "blockedUserAdd: " + userID);


        } catch (JSONException e) {
            e.printStackTrace();
        }
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST,
                url, blockObj,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Toast.makeText(ViewOtherProfile.this,
                                "You will no longer receive messages from this user.",
                                Toast.LENGTH_LONG).show();
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(ViewOtherProfile.this,
                        "Error: failed to block", Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue.add(jsonObjectRequest);
    }

}