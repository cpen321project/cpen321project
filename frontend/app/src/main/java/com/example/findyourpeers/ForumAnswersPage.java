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
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageButton;
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

import java.util.ArrayList;

public class ForumAnswersPage extends AppCompatActivity {
    final String TAG = "ForumAnswersPage";
    String accessToken = LoginPage.accessToken;
    LinearLayout answerList;
    TextView noAnswersLabel;
    String userID;

    String topic;
    String questionContent;
    String askerName;
    String questionID;
    Boolean isAskedAnonymously;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forum_answers_page);

        answerList = (LinearLayout) findViewById(R.id.answer_list_linearLayout);
        noAnswersLabel = (TextView) findViewById(R.id.no_answers_label_textView);

        // for the current user
        userID = getIntent().getExtras().getString("userID");
        String displayName = getIntent().getExtras().getString("displayName");
        ArrayList<String> courseList =
                (ArrayList<String>) getIntent().getSerializableExtra("courseList");

        // for the question
        topic = getIntent().getExtras().getString("topic");
        questionContent = getIntent().getExtras().getString("questionContent");
        askerName = getIntent().getExtras().getString("askerName");
        questionID = getIntent().getExtras().getString("questionID");
        isAskedAnonymously = getIntent().getExtras().getBoolean("isAskedAnonymously");

        TextView topicTV = (TextView) findViewById(R.id.topic_textView);
        TextView questionContentTV = (TextView) findViewById(R.id.questionContent_textView);
        TextView askerNameTV = (TextView) findViewById(R.id.askerName_textView);

        topicTV.setText("#" + topic);

        if (isAskedAnonymously) {
            askerNameTV.setText("anonymous");
        } else {
            askerNameTV.setText(askerName);
        }

        questionContentTV.setText(questionContent);

        BottomNavigationView bottomNavigationView = findViewById(R.id.bottom_navigation);
        bottomNavigationView.setOnItemSelectedListener(new BottomNavigationView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                switch (item.getItemId()) {
                    case R.id.my_profile:
                        Intent displayProfileBackIntent = new Intent(ForumAnswersPage.this, ProfilePage.class);
                        displayProfileBackIntent.putExtra("userID", userID);
                        startActivity(displayProfileBackIntent);
                        return true;
                    case R.id.browse_courses:
                        Intent browseCourseIntent =
                                new Intent(ForumAnswersPage.this, BrowseCourse.class);
                        browseCourseIntent.putExtra("userID", userID);
                        browseCourseIntent.putExtra("displayName", displayName);
                        browseCourseIntent.putExtra("courseList", courseList);
                        startActivity(browseCourseIntent);
                        return true;
                    case R.id.qa_forum:
                        Intent forumQuestionPageIntent =
                                new Intent(ForumAnswersPage.this, ForumQuestionsPage.class);
                        forumQuestionPageIntent.putExtra("userID", userID);
                        forumQuestionPageIntent.putExtra("displayName", displayName);
                        forumQuestionPageIntent.putExtra("courseList", courseList);
                        startActivity(forumQuestionPageIntent);
                        return true;
                    default:
                        return false;
                }
            }
        });

        makeGetAllAnswersForAQuestionRequest(questionID, userID, accessToken);

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
                    ((ViewGroup) postAnswerDialogView.getParent()).removeView(postAnswerDialogView);
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

                                makePostAnswerRequest(questionID, topic, userID, displayName,
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
        String url = Urls.URL + "postAnswer/";

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, answerToPost,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
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
        String url = Urls.URL + "getAllAnswersForAQuestion/"
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

                                String answerID = nextAnswer.getString("_id");
                                String answererID = nextAnswer.getString("answererID");
                                String answererName = nextAnswer.getString("answererName");
                                String answerContent = nextAnswer.getString("answerContent");
                                Boolean isAnsweredAnonymously = nextAnswer.getBoolean("isAnsweredAnonymously");

                                Log.d(TAG, "isAnsweredAnonymously: " + isAnsweredAnonymously);

                                addAnswerToView(answerID, answererID, answererName, answerContent,
                                        isAnsweredAnonymously);
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

    private void addAnswerToView(String answerID, String answererID, String answererName,
                                 String answerContent, Boolean isAnsweredAnonymously) {
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

        LayoutInflater inflater = LayoutInflater.from(this);
        final View editAnswerDialogView =
                inflater.inflate(R.layout.edit_dialog_layout, null, false);
        final EditText answerContentET =
                (EditText) editAnswerDialogView.findViewById(R.id.editInput_editText);
        TextView editLabel = (TextView) answerView.findViewById(R.id.edit_textView);

        if (answererID.equals(userID)) {
            editLabel.setVisibility(View.VISIBLE);
            answerContentET.setText(answerContent);
        } else {
            editLabel.setVisibility(View.INVISIBLE);
        }

        editLabel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(TAG, "Trying to edit answer");
                AlertDialog.Builder builder = new AlertDialog.Builder(ForumAnswersPage.this);
                builder.setCancelable(true);
                builder.setTitle("Edit answer");
                if (editAnswerDialogView.getParent() != null) {
                    ((ViewGroup) editAnswerDialogView.getParent()).removeView(editAnswerDialogView);
                }
                builder.setView(editAnswerDialogView);
                builder.setPositiveButton("Edit answer",
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                String answerContent = answerContentET.getText().toString();
                                Log.d(TAG, "edited answerContent: " + answerContent);

                                if (answerContent.equals("")) {
                                    Log.d(TAG, "answerContent is empty");
                                    Toast.makeText(ForumAnswersPage.this,
                                            "Cannot post empty answer.", Toast.LENGTH_SHORT).show();

                                    // make the fields the default again
                                    answerContentET.setText("");
                                    return;
                                }

                                answerContentET.setText("");

                                makeEditAnswerRequest(answerID, answererID, answererName,
                                        answerContent, accessToken);
                            }
                        });
                builder.setNegativeButton("Cancel", null);

                AlertDialog dialog = builder.create();
                dialog.show();
            }
        });

        answererNameTV.setText(nameToDisplay);
        answerContentTV.setText(answerContent);

        answerList.addView(answerView);
    }

    private void makeEditAnswerRequest(String answerID, String answererID, String answererName,
                                       String answerContent, String accessToken) {
        JSONObject answerToEdit = new JSONObject();
        try {
            answerToEdit.put("answerID", answerID);
            answerToEdit.put("answererID", answererID);
            answerToEdit.put("answererName", answererName);
            answerToEdit.put("answerContent", answerContent);
            answerToEdit.put("jwt", accessToken);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        Log.d(TAG, "-----------------------");
        Log.d(TAG, answerID);
        Log.d(TAG, answererID);
        Log.d(TAG, answererName);
        Log.d(TAG, answerContent);
        Log.d(TAG, accessToken);
        Log.d(TAG, "-----------------------");

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = Urls.URL + "editAnswer/";

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.PUT, url, answerToEdit,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.d(TAG, "editAnswer successfully");
                        Toast.makeText(ForumAnswersPage.this, "Answer edited",
                                Toast.LENGTH_SHORT).show();

                        answerList.removeAllViews();
                        makeGetAllAnswersForAQuestionRequest(questionID, userID, accessToken);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "editAnswer error: " + error.getMessage());
                Toast.makeText(ForumAnswersPage.this, "Failed to edit answer",
                        Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue.add(jsonObjectRequest);
    }
}