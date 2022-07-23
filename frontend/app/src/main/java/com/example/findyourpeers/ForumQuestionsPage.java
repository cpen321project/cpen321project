package com.example.findyourpeers;

import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ForumQuestionsPage extends AppCompatActivity {
    final String TAG = "ForumQuestionsPage";
    LinearLayout questionList;
    String userID = "johnID";
    String accessToken = "placeholderJWT";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forum_questions_page);

        questionList = findViewById(R.id.question_list_linearLayout);

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
                CharSequence[] topics = {"all", "admissions", "coop", "graduation", "social", "other"};

                AlertDialog.Builder builder = new AlertDialog.Builder(ForumQuestionsPage.this);
                builder.setCancelable(true);
                builder.setTitle("Filter by topic:");
                builder.setSingleChoiceItems(topics, -1, new DialogInterface.OnClickListener() {
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

        Button postQuestionBtn = (Button) findViewById(R.id.post_question_button);
        postQuestionBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AlertDialog.Builder builder = new AlertDialog.Builder(ForumQuestionsPage.this);
                builder.setCancelable(true);
                builder.setTitle("Post a question:");
                builder.setMessage("change this part to take user input and choose topic from drop down?");
                builder.setPositiveButton("Post question",
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                //do nothing
                            }
                        });
                builder.setNegativeButton("Cancel", null);

                AlertDialog dialog = builder.create();
                dialog.show();
            }
        });
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
                viewAnswersIntent.putExtra("currentUserID", userID);
                viewAnswersIntent.putExtra("questionID", questionID);
                ;
                startActivity(viewAnswersIntent);
            }
        });

        TextView topicTV = (TextView) questionView.findViewById(R.id.topic_textView);
        topicTV.setText("#" + topic);

        TextView askerNameTV = (TextView) questionView.findViewById(R.id.askerName_textView);
        String nameToDisplay;
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