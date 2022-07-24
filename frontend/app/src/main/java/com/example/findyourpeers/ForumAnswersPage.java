package com.example.findyourpeers;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.Spinner;
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

public class ForumAnswersPage extends AppCompatActivity {
    String accessToken = "placeholderJWT"; // set to LoginPage.accessToken when cognito fixed
    String TAG = "ForumAnswersPage";
    LinearLayout answerList;
    TextView noAnswersLabel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forum_answers_page);

        answerList = (LinearLayout) findViewById(R.id.answer_list_linearLayout);
        noAnswersLabel = (TextView) findViewById(R.id.no_answers_label_textView);

        // for the current user
        String answererID = getIntent().getExtras().getString("userID");
        String answererName = getIntent().getExtras().getString("userName");
        // for the question
        String topic = getIntent().getExtras().getString("topic");
        String questionContent = getIntent().getExtras().getString("questionContent");
        String askerName = getIntent().getExtras().getString("askerName");
        String questionID = getIntent().getExtras().getString("questionID");

        TextView topicTV = (TextView) findViewById(R.id.topic_textView);
        TextView questionContentTV = (TextView) findViewById(R.id.questionContent_textView);
        TextView askerNameTV = (TextView) findViewById(R.id.askerName_textView);

        topicTV.setText("#" + topic);
        askerNameTV.setText(askerName);
        questionContentTV.setText(questionContent);

        BottomNavigationView bottomNavigationView = findViewById(R.id.bottom_navigation);
        bottomNavigationView.setOnItemSelectedListener(new BottomNavigationView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                switch (item.getItemId()) {
                    case R.id.my_profile:
//                        Intent displayProfileBackIntent = new Intent(ForumAnswersPage.this, ProfilePage.class);
//                        displayProfileBackIntent.putExtra("userID", answererID);
//                        startActivity(displayProfileBackIntent);
                        return true;
                    case R.id.browse_courses:
//                        Intent browseCourseIntent =
//                                new Intent(ForumAnswersPage.this, BrowseCourse.class);
//                        browseCourseIntent.putExtra("userID", answererID);
//                        browseCourseIntent.putExtra("displayName", answererName);
//                        browseCourseIntent.putExtra("courseList", studentCourseList); // need to fix this
//                        startActivity(browseCourseIntent);
                        return true;
                    case R.id.qa_forum:
                        return true;
                    default: return false;
                }
            }
        });

        makeGetAllAnswersForAQuestionRequest(questionID, answererID, accessToken);

        LayoutInflater inflater = LayoutInflater.from(this);
        final View postAnswerDialogView =
                inflater.inflate(R.layout.post_answer_dialog_layout, null, false);
        final EditText answerContentET =
                (EditText) postAnswerDialogView.findViewById(R.id.answerContent_editText);
        final CheckBox anonCheckBox =
                (CheckBox) postAnswerDialogView.findViewById(R.id.anon_checkBox);

        Button postAnswerBtn = (Button) findViewById(R.id.post_answer_button);
        postAnswerBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AlertDialog.Builder builder = new AlertDialog.Builder(ForumAnswersPage.this);
                builder.setCancelable(true);
                builder.setTitle("Post an answer");
                if (postAnswerDialogView.getParent() != null) {
                    ((ViewGroup)postAnswerDialogView.getParent()).removeView(postAnswerDialogView);
                }
                builder.setView(postAnswerDialogView);
                builder.setPositiveButton("Post answer",
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                // get answerContent
                                String answerContent = answerContentET.getText().toString();
                                Log.d(TAG, "answerContent: " + answerContent);

                                if (answerContent.equals("")) {
                                    Log.d(TAG, "answerContent is empty");
                                    Toast.makeText(ForumAnswersPage.this,
                                            "Cannot post empty answer.", Toast.LENGTH_SHORT).show();

                                    // make the fields the default again
                                    answerContentET.setText("");
                                    anonCheckBox.setChecked(false);
                                    return;
                                }

                                Boolean isAnsweredAnonymously = false;
                                // get anon checkBox
                                if (anonCheckBox.isChecked()) {
                                    Log.d(TAG, "anonCheckBox.isChecked(): " + anonCheckBox.isChecked());
                                    isAnsweredAnonymously = true;
                                }

                                answerContentET.setText("");
                                anonCheckBox.setChecked(false);

                                makePostAnswerRequest(questionID, topic, answererID, answererName,
                                        answerContent, isAnsweredAnonymously, accessToken);
                            }
                        });
                builder.setNegativeButton("Cancel", null);

                AlertDialog dialog = builder.create();
                dialog.show();
            }
        });

        ImageButton helpBtn = (ImageButton) findViewById(R.id.help_button);
        helpBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AlertDialog.Builder builder = new AlertDialog.Builder(ForumAnswersPage.this);
                builder.setCancelable(true);
                builder.setTitle("Answer guidelines");
                builder.setMessage("Please read the posted answers before adding a new answer to avoid duplicates.");
                builder.setPositiveButton("OK",
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                //do nothing
                            }
                        });
                AlertDialog dialog = builder.create();
                dialog.show();
            }
        });
    }

    private void makePostAnswerRequest(String questionID, String topic, String answererID,
                                       String answererName, String answerContent,
                                       Boolean isAnsweredAnonymously, String accessToken) {
        JSONObject answerToPost = new JSONObject();
        try {
            answerToPost.put("questionID", questionID);
            answerToPost.put("topic", topic);
            answerToPost.put("answererID", answererID);
            answerToPost.put("answererName", answererName);
            answerToPost.put("answerContent", answerContent);
            answerToPost.put("isAnsweredAnonymously", isAnsweredAnonymously);
            answerToPost.put("jwt", accessToken);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        Log.d(TAG, "-----------------------");
        Log.d(TAG, questionID);
        Log.d(TAG, topic);
        Log.d(TAG, answererID);
        Log.d(TAG, answererName);
        Log.d(TAG, answerContent);
        Log.d(TAG, isAnsweredAnonymously.toString());
        Log.d(TAG, accessToken);
        Log.d(TAG, "-----------------------");

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = "http://10.0.2.2:3010/postAnswer/";

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, answerToPost,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        // JSONException: Value Question of type java.lang.String cannot be converted to JSONObject
                        // fix: make sure the backend endpoint returns json not string
                        // see postQuestion on backend for fix
                        Toast.makeText(ForumAnswersPage.this, "Answer posted",
                                Toast.LENGTH_SHORT).show();

                        answerList.removeAllViews();
                        makeGetAllAnswersForAQuestionRequest(questionID, answererID, accessToken);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "postAnswer error: " + error.getMessage());
                Toast.makeText(ForumAnswersPage.this, "Failed to post answer",
                        Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue.add(jsonObjectRequest);
    }

    private void makeGetAllAnswersForAQuestionRequest(String questionID, String userID, String accessToken) {
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = "http://10.0.2.2:3010/getAllAnswersForAQuestion/"
                + questionID + "/" + userID + "/" + accessToken;

        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url,
                null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        answerList.removeAllViews();

                        Log.d(TAG, "response: " + response);
                        if (response.isNull(0)) {
                            Log.d(TAG, "No answers for this question");
                            noAnswersLabel.setVisibility(View.VISIBLE);
                            return;
                        }
                        noAnswersLabel.setVisibility(View.INVISIBLE);
                        for (int i = 0; i < response.length(); i++) {
                            try {
                                JSONObject nextAnswer = response.getJSONObject(i);
                                Log.d(TAG, "nextAnswer: " + nextAnswer);

                                String topic = nextAnswer.getString("topic");
                                String answererName = nextAnswer.getString("answererName");
                                String answerContent = nextAnswer.getString("answerContent");
                                Boolean isAnsweredAnonymously = nextAnswer.getBoolean("isAnsweredAnonymously");

                                Log.d(TAG, "isAnsweredAnonymously: " + isAnsweredAnonymously);

                                addAnswerToView(answererName, answerContent, isAnsweredAnonymously);
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.d(TAG, "error: " + error);
                        Toast.makeText(ForumAnswersPage.this,
                                "Error fetching answers", Toast.LENGTH_SHORT).show();
                    }
                }
        );
        requestQueue.add(jsonArrayRequest);
    }

    private void addAnswerToView(String answererName, String answerContent, Boolean isAnsweredAnonymously) {
        final View answerView = getLayoutInflater()
                .inflate(R.layout.answer_layout, null, false);

        TextView answererNameTV = (TextView) answerView.findViewById(R.id.answererName_textView);
        TextView answerContentTV =
                (TextView) answerView.findViewById(R.id.answerContent_textView);
        String nameToDisplay = "nameToDisplayDefaultValue";

        if (isAnsweredAnonymously) {
            nameToDisplay = "anonymous";
        } else {
            nameToDisplay = answererName;
        }

        answererNameTV.setText(nameToDisplay);
        answerContentTV.setText(answerContent);

        answerList.addView(answerView);
    }
}