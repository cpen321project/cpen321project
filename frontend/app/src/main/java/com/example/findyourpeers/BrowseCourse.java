package com.example.findyourpeers;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.ImageView;
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
    public ArrayList<String> studentCourseList;
    private String inputCourseFinal;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_browse_course);
        Intent intentCourse = getIntent();
        userID = intentCourse.getExtras().getString("userID");
        displayName = intentCourse.getExtras().getString("displayName");
        studentCourseList = (ArrayList<String>) intentCourse.getSerializableExtra("courselist");

        AutoCompleteTextView actvCourse = (AutoCompleteTextView) findViewById(R.id.autocompletecourse);
        ImageView dropDownButton = findViewById(R.id.dropdown_button);
        Button addCourseButton = findViewById(R.id.addcourse_button);
        Button getProfileBackBtn = findViewById(R.id.get_back_profile_button);

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
                }
                return false;
            }
        });

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String urlcourse = "https://ubcexplorer.io/getAllCourses";
        JsonArrayRequest requestCourse = new JsonArrayRequest(Request.Method.GET, urlcourse, null, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                try {
                    for(int i=0; i< response.length(); i++){
                        JSONObject jsonObject = response.getJSONObject(i);
                        String coursename = jsonObject.getString("code");
                        courseList.add(coursename);
                    }

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                if(error.networkResponse.data!=null) {
                    try {
                        String body = new String(error.networkResponse.data,"UTF-8");
                        Log.d("Browse Course", body);
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        );
        //BrowseCourseSingleton.getInstance(BrowseCourse.this).addToRequestQueue(requestCourse);
        requestQueue.add(requestCourse);

        ArrayAdapter<String> adapterCourse = new ArrayAdapter<String>(this, android.R.layout.simple_dropdown_item_1line, courseList);
        actvCourse.setAdapter(adapterCourse);
        actvCourse.setThreshold(1);

        dropDownButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                actvCourse.showDropDown();
            }
        });

        //String inputCourseFinal; //keep track!
        actvCourse.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                inputCourseFinal = adapterCourse.getItem(position).toString();
            }
        });
/**
 * Unset the var whenever the user types. Validation will
 * then fail. This is how we enforce selecting from the list.
 */
        actvCourse.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                inputCourseFinal = null;
            }
            @Override
            public void afterTextChanged(Editable s) {}
        });

        addCourseButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //String inputCourse = actvCourse.getText().toString();
                String inputCourse = inputCourseFinal;
                if(studentCourseList.contains(inputCourse)){
                    Toast.makeText(BrowseCourse.this, "Course has been added before", Toast.LENGTH_SHORT).show();
                }else if(inputCourse==null) {
                    Toast.makeText(BrowseCourse.this, "Course name invalid, please select from the list only", Toast.LENGTH_SHORT).show();
                }else{
                    addCourseToUser(inputCourse);
                    addUserToCourse(inputCourse,displayName);
                    studentCourseList.add(inputCourse);
                    Toast.makeText(BrowseCourse.this, "Course added", Toast.LENGTH_SHORT).show();
                }

//                if(courseList.contains(inputCourse)){
//
//                    addCourseToUser(inputCourse);
//                    addUserToCourse(inputCourse,displayName);
//
//                }else{
//                    Toast.makeText(BrowseCourse.this, "No such course available", Toast.LENGTH_SHORT).show();
//                }
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

    private void addUserToCourse(String coursename, String displayName) {
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        JSONObject usertoadd = new JSONObject();
        try {
            //input your API parameters
            usertoadd.put("coursename",coursename);
            usertoadd.put("userID",userID);
            usertoadd.put("displayName", displayName);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        // Enter the correct url for your api service site
        String urlUserToCourse = "http://10.0.2.2:3010/addusertocourse";
        JsonObjectRequest jsonObjectRequest2 = new JsonObjectRequest(Request.Method.POST, urlUserToCourse, usertoadd,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Toast.makeText(BrowseCourse.this, "User added to course", Toast.LENGTH_SHORT).show();
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(BrowseCourse.this, "user side failed", Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue.add(jsonObjectRequest2);
    }


    private void addCourseToUser(String coursename) {
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        JSONObject coursetoadd = new JSONObject();
        try {
            //input your API parameters
            coursetoadd.put("coursename",coursename);
            coursetoadd.put("userID",userID);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        // Enter the correct url for your api service site
        String urlCourseToUser = "http://10.0.2.2:3010/addcoursetouser";
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, urlCourseToUser, coursetoadd,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Toast.makeText(BrowseCourse.this, "Course added to user", Toast.LENGTH_SHORT).show();
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(BrowseCourse.this, "course side failed", Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue.add(jsonObjectRequest);
    }


}