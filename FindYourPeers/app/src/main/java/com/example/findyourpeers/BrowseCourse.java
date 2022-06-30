package com.example.findyourpeers;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.ImageView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class BrowseCourse extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_browse_course);

        AutoCompleteTextView actvCourse = findViewById(R.id.autocompletecourse);
        ImageView dropDownButton = findViewById(R.id.dropdown_button);
        actvCourse.setThreshold(6);
        ArrayList<String> courseList = new ArrayList<>();
        String urlname = "https://ubcexplorer.io/getAllCourses";
        JsonArrayRequest requestname = new JsonArrayRequest(Request.Method.GET, urlname, null, new Response.Listener<JSONArray>() {
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
                Toast.makeText(BrowseCourse.this, "Something went wrong in getting data", Toast.LENGTH_SHORT).show();
            }
        }
        );
        BrowseCourseSingleton.getInstance(BrowseCourse.this).addToRequestQueue(requestname);

        ArrayAdapter<String> adapterCourse = new ArrayAdapter<String>(this, android.R.layout.simple_dropdown_item_1line, courseList);
        actvCourse.setAdapter(adapterCourse);

        dropDownButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                actvCourse.showDropDown();
            }
        });


    }
}