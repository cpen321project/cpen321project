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
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ListView;
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

import java.util.ArrayList;

public class ForumQuestionsPage extends AppCompatActivity {
    final String TAG = "ForumQuestionsPage";
    LinearLayout questionList;

    String userID;
    String displayName;
    ArrayList<String> courseList;
    String accessToken = LoginPage.accessToken;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forum_questions_page);

        questionList = findViewById(R.id.question_list_linearLayout);

        userID = getIntent().getExtras().getString("userID");
        displayName = getIntent().getExtras().getString("displayName");
        displayName = getIntent().getExtras().getString("displayName");
        courseList = (ArrayList<String>) getIntent().getSerializableExtra("courseList");

        BottomNavigationView bottomNavigationView = findViewById(R.id.bottom_navigation);
        bottomNavigationView.setOnItemSelectedListener(new BottomNavigationView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                switch (item.getItemId()) {
                    case R.id.my_profile:
                        Intent displayProfileBackIntent = new Intent(ForumQuestionsPage.this, ProfilePage.class);
                        displayProfileBackIntent.putExtra("userID", userID);
                        startActivity(displayProfileBackIntent);
                        return true;
                    case R.id.browse_courses:
                        Intent browseCourseIntent =
                                new Intent(ForumQuestionsPage.this, BrowseCourse.class);
                        browseCourseIntent.putExtra("userID", userID);
                        browseCourseIntent.putExtra("displayName", displayName);
                        browseCourseIntent.putExtra("courseList", courseList);
                        startActivity(browseCourseIntent);
                        return true;
                    case R.id.qa_forum:
                        return true;
                    default: return false;
                }
            }
        });

        makeGetAllQuestionsRequest(accessToken);

        ImageButton helpBtn = (ImageButton) findViewById(R.id.help_button);
        helpBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AlertDialog.Builder builder = new AlertDialog.Builder(ForumQuestionsPage.this);
                builder.setCancelable(true);
                builder.setTitle("How to use the Q&A Forum");
                builder.setMessage("The Q&A Forum is used for general questions not specific to " +
                        "any particular courses. Before posting a new question, please filter the" +
                        " list of questions by topic to see if your question has been asked before.");
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

        ImageButton filterBtn = (ImageButton) findViewById(R.id.filter_button);
        filterBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final String[] topicToFilterBy = new String[1];
                CharSequence[] topicFilters = {"all", "admissions", "coop", "graduation", "social",
                        "other", "only questions I've asked"};

                AlertDialog.Builder builder = new AlertDialog.Builder(ForumQuestionsPage.this);
                builder.setCancelable(true);
                builder.setTitle("Filter by topic:");
                builder.setSingleChoiceItems(topicFilters, -1, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        ListView topicList = ((AlertDialog) dialog).getListView();
                        if (topicList.getCheckedItemCount() > 0) {
                            Object checkedItem = topicList.getAdapter()
                                    .getItem(topicList.getCheckedItemPosition());
                            Log.d(TAG, "checkedItem: " + checkedItem);
                            topicToFilterBy[0] = (String) checkedItem;
                            Log.d(TAG, "topicToFilterBy[0]: " + topicToFilterBy[0]);
                        }
                    }
                });
                builder.setPositiveButton("Filter",
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                if (topicToFilterBy[0] == null) {
                                    // user clicked button without choosing anything
                                    return;
                                } else if (topicToFilterBy[0].equals("all")) {
                                    makeGetAllQuestionsRequest(accessToken);
                                } else if (topicToFilterBy[0].equals("only questions I've asked")) {
                                    makeGetOnlyUserQuestionsRequest(accessToken);
                                } else {
                                    makeGetQuestionsByTopicRequest(topicToFilterBy[0], accessToken);
                                }
                            }
                        });
                builder.setNegativeButton("Cancel", null);
                AlertDialog dialog = builder.create();
                dialog.show();
            }
        });

        LayoutInflater inflater = LayoutInflater.from(this);
        final View postQuestionDialogView =
                inflater.inflate(R.layout.post_question_dialog_layout, null, false);

        final EditText questionContentET =
                (EditText) postQuestionDialogView.findViewById(R.id.questionContent_editText);
        final Spinner topicSpinner =
                (Spinner) postQuestionDialogView.findViewById(R.id.topic_spinner);
        final CheckBox anonCheckBox =
                (CheckBox) postQuestionDialogView.findViewById(R.id.anon_checkBox);

        final String[] topicOptions =
                {"select a topic", "admissions", "coop", "graduation", "social", "other"};

        ArrayAdapter<String> adapter = new ArrayAdapter<String>(ForumQuestionsPage.this,
                android.R.layout.simple_spinner_item, topicOptions);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        topicSpinner.setAdapter(adapter);

        Button postQuestionBtn = (Button) findViewById(R.id.post_question_button);
        postQuestionBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AlertDialog.Builder builder = new AlertDialog.Builder(ForumQuestionsPage.this);
                builder.setCancelable(true);
                builder.setTitle("Post a question");
                if (postQuestionDialogView.getParent() != null) {
                    ((ViewGroup)postQuestionDialogView.getParent()).removeView(postQuestionDialogView);
                }
                builder.setView(postQuestionDialogView);
                builder.setPositiveButton("Post question",
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                // get questionContent
                                String questionContent = questionContentET.getText().toString();
                                Log.d(TAG, "questionContent: " + questionContent);

                                if (questionContent.equals("")) {
                                    Log.d(TAG, "questionContent is empty");
                                    Toast.makeText(ForumQuestionsPage.this,
                                            "Cannot post empty question.", Toast.LENGTH_SHORT).show();

                                    // make the fields the default again
                                    questionContentET.setText("");
                                    topicSpinner.setSelection(0); // doesn't do it
                                    anonCheckBox.setChecked(false);

                                    return;
                                }

                                // get selected topic
                                topicSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                                    @Override
                                    public void onItemSelected(AdapterView<?> parent, View view,
                                                               int position, long id) {
                                        String selectedTopic = (String) parent.getItemAtPosition(position);
                                        Log.d(TAG, "selected topic: " + selectedTopic);

                                        if (selectedTopic.equals("select a topic")) {
                                            // user did not choose a topic. "select a topic" is the default
                                            Log.d(TAG, "onItemSelected: No topic selected");
                                            Toast.makeText(ForumQuestionsPage.this,
                                                    "Please select a topic before posting a question.",
                                                    Toast.LENGTH_SHORT).show();

                                            anonCheckBox.setChecked(false);
                                            return;
                                        }
                                    }
                                    @Override
                                    public void onNothingSelected(AdapterView<?> parent) {
                                        // do nothing
                                    }
                                });

                                String selectedTopic = (String) topicSpinner.getSelectedItem();
                                if (selectedTopic.equals("select a topic")) {
                                    // user did not choose a topic. "select a topic" is the default
                                    Log.d(TAG, "selected topic outside of onItemSelected: " + selectedTopic);
                                    Toast.makeText(ForumQuestionsPage.this,
                                            "Please select a topic.",
                                            Toast.LENGTH_SHORT).show();

                                    questionContentET.setText("");
                                    topicSpinner.setSelection(0); // doesn't do it
                                    anonCheckBox.setChecked(false);

                                    return;
                                }

                                Boolean isAskedAnonymously = false;
                                // get anon checkBox
                                if (anonCheckBox.isChecked()) {
                                    Log.d(TAG, "anonCheckBox.isChecked(): " + anonCheckBox.isChecked());
                                    isAskedAnonymously = true;
                                }

                                questionContentET.setText("");
                                topicSpinner.setSelection(0);
                                anonCheckBox.setChecked(false);

                                makePostQuestionRequest(selectedTopic, userID, displayName,
                                        questionContent, isAskedAnonymously, accessToken);
                            }
                        });
                builder.setNegativeButton("Cancel", null);

                AlertDialog dialog = builder.create();
                dialog.show();
            }
        });
    }

    private void makePostQuestionRequest(String selectedTopic, String userID, String userName,
                                         String questionContent, Boolean isAskedAnonymously,
                                         String accessToken) {
        JSONObject questionToPost = new JSONObject();
        try {
            questionToPost.put("topic", selectedTopic);
            questionToPost.put("askerID", userID);
            questionToPost.put("askerName", userName);
            questionToPost.put("questionContent", questionContent);
            questionToPost.put("isAskedAnonymously", isAskedAnonymously);
            questionToPost.put("jwt", accessToken);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        Log.d(TAG, "-----------------------");
        Log.d(TAG, selectedTopic);
        Log.d(TAG, userID);
        Log.d(TAG, userName);
        Log.d(TAG, questionContent);
        Log.d(TAG, isAskedAnonymously.toString());
        Log.d(TAG, accessToken);
        Log.d(TAG, "-----------------------");

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = "http://10.0.2.2:3010/postQuestion/";

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, questionToPost,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        // JSONException: Value Question of type java.lang.String cannot be converted to JSONObject
                        // fix: make sure the backend endpoint returns json not string
                        // see postQuestion on backend for fix
                        Toast.makeText(ForumQuestionsPage.this, "Question posted",
                                Toast.LENGTH_SHORT).show();

                        questionList.removeAllViews();
                        makeGetAllQuestionsRequest(accessToken);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "postQuestion error: " + error.getMessage());
                Toast.makeText(ForumQuestionsPage.this, "Failed to post question",
                        Toast.LENGTH_SHORT).show();
            }
        });
        requestQueue.add(jsonObjectRequest);
    }

    private void makeGetOnlyUserQuestionsRequest(String accessToken) {
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = "http://10.0.2.2:3010/getAllQuestionsFromAUser/" + userID + "/" + accessToken;

        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url,
                null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        questionList.removeAllViews();

                        Log.d(TAG, "response: " + response);
                        for (int i = 0; i < response.length(); i++) {
                            try {
                                JSONObject nextQuestion = response.getJSONObject(i);
                                Log.d(TAG, "nextQuestion: " + nextQuestion);

                                String questionID = nextQuestion.getString("_id");
                                String topic = nextQuestion.getString("topic");
                                String askerName = nextQuestion.getString("askerName");
                                String questionContent = nextQuestion.getString("questionContent");
                                Boolean isAskedAnonymously = nextQuestion.getBoolean("isAskedAnonymously");

                                Log.d(TAG, "questionID: " + questionID);
                                Log.d(TAG, "isAskedAnonymously: " + isAskedAnonymously);

                                addQuestionToView(questionID, topic, askerName, questionContent, isAskedAnonymously);

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
                        Toast.makeText(ForumQuestionsPage.this,
                                "Error fetching questions", Toast.LENGTH_LONG).show();
                    }
                }
        );
        requestQueue.add(jsonArrayRequest);
    }

    private void makeGetAllQuestionsRequest(String accessToken) {
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = "http://10.0.2.2:3010/getAllQuestions/" + userID + "/" + accessToken;

        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url,
                null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        questionList.removeAllViews();

                        Log.d(TAG, "response: " + response);
                        for (int i = 0; i < response.length(); i++) {
                            try {
                                JSONObject nextQuestion = response.getJSONObject(i);
                                Log.d(TAG, "nextQuestion: " + nextQuestion);

                                String questionID = nextQuestion.getString("_id");
                                String topic = nextQuestion.getString("topic");
                                String askerName = nextQuestion.getString("askerName");
                                String questionContent = nextQuestion.getString("questionContent");
                                Boolean isAskedAnonymously = nextQuestion.getBoolean("isAskedAnonymously");

                                Log.d(TAG, "questionID: " + questionID);
                                Log.d(TAG, "isAskedAnonymously: " + isAskedAnonymously);

                                addQuestionToView(questionID, topic, askerName, questionContent, isAskedAnonymously);

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
                        Toast.makeText(ForumQuestionsPage.this,
                                "Error fetching questions", Toast.LENGTH_LONG).show();
                    }
                }
        );
        requestQueue.add(jsonArrayRequest);
    }

    private void makeGetQuestionsByTopicRequest(String topic, String accessToken) {
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = "http://10.0.2.2:3010/getAllQuestionsForATopic/" + topic
                + "/" + userID + "/" + accessToken;

        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url,
                null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        questionList.removeAllViews();

                        Log.d(TAG, "response: " + response);
                        for (int i = 0; i < response.length(); i++) {
                            try {
                                JSONObject nextQuestion = response.getJSONObject(i);
                                Log.d(TAG, "nextQuestion: " + nextQuestion);

                                String questionID = nextQuestion.getString("_id");
                                String topic = nextQuestion.getString("topic");
                                String askerName = nextQuestion.getString("askerName");
                                String questionContent = nextQuestion.getString("questionContent");
                                Boolean isAskedAnonymously = nextQuestion.getBoolean("isAskedAnonymously");

                                Log.d(TAG, "questionID: " + questionID);
                                Log.d(TAG, "isAskedAnonymously: " + isAskedAnonymously);

                                addQuestionToView(questionID, topic, askerName, questionContent, isAskedAnonymously);

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
                        Toast.makeText(ForumQuestionsPage.this,
                                "Error fetching questions", Toast.LENGTH_LONG).show();
                    }
                }
        );
        requestQueue.add(jsonArrayRequest);
    }

    private void addQuestionToView(String questionID, String topic, String askerName,
                                   String questionContent, Boolean isAskedAnonymously) {
        final View questionView = getLayoutInflater()
                .inflate(R.layout.question_layout, null, false);

        LinearLayout qContainer = (LinearLayout) questionView.findViewById(R.id.question_container);
        qContainer.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent viewAnswersIntent =
                        new Intent(ForumQuestionsPage.this, ForumAnswersPage.class);
                viewAnswersIntent.putExtra("userID", userID);
                viewAnswersIntent.putExtra("userName", displayName);
                viewAnswersIntent.putExtra("topic", topic);
                viewAnswersIntent.putExtra("questionContent", questionContent);
                viewAnswersIntent.putExtra("askerName", askerName);
                viewAnswersIntent.putExtra("questionID", questionID);
                viewAnswersIntent.putExtra("isAskedAnonymously", isAskedAnonymously);
                startActivity(viewAnswersIntent);
            }
        });

        TextView topicTV = (TextView) questionView.findViewById(R.id.topic_textView);
        topicTV.setText("#" + topic);

        TextView askerNameTV = (TextView) questionView.findViewById(R.id.askerName_textView);
        String nameToDisplay = "nameToDisplayDefaultValue";
        if (isAskedAnonymously) {
            nameToDisplay = "anonymous";
        } else {
            nameToDisplay = askerName;
        }
        askerNameTV.setText(nameToDisplay);

        TextView questionContentTV =
                (TextView) questionView.findViewById(R.id.questionContent_textView);
        questionContentTV.setText(questionContent);

        questionList.addView(questionView);
    }

}