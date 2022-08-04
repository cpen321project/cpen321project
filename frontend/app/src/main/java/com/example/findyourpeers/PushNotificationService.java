package com.example.findyourpeers;

import android.app.Notification;
import android.app.NotificationManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import static com.example.findyourpeers.MainActivity.FCM_CHANNEL_ID;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;


import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import org.json.JSONException;
import org.json.JSONObject;

public class PushNotificationService extends FirebaseMessagingService {

    final static String TAG = "pushNotification";


    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);
        postDataUsingVolley(token);
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        super.onMessageReceived(message);

        if (message.getNotification() != null) {
            String title = message.getNotification().getTitle();
            String body = message.getNotification().getBody();
            Notification notification = new NotificationCompat.Builder(this, FCM_CHANNEL_ID)
                    .setSmallIcon(R.drawable.chat_drawable)
                    .setContentTitle(title)
                    .setContentText(body)
                    .setPriority(5)
                    .build();

            NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            manager.notify(1002, notification);


            Log.d(TAG, "message received");
        }

//        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, getString(R.string.))
//
//                .setContentTitle("Notification Title")
//                .setContentText("This is text, that will be shown as part of notification")
//                .setStyle(new NotificationCompat.BigTextStyle().bigText("This is text, that will be shown as part of notification"))
//                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
//                .setContentIntent(pendingIntent)
//                .setChannelId(getString(R.string.NEWS_CHANNEL_ID))
//                .setAutoCancel(true);
//
//        NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(this);
//        notificationManagerCompat.notify(getResources().getInteger(R.integer.notificationId), builder.build());
    }

    public void postDataUsingVolley(String token) {
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());

        JSONObject newToken = new JSONObject();
        try {
            newToken.put("userID", LoginPage.userID);
            newToken.put("registrationToken", token);
            newToken.put("jwt", LoginPage.accessToken);
            Log.d(TAG, "trying to post the regToken");
            Log.d(TAG, LoginPage.userID);
            Log.d(TAG, token);
            Log.d(TAG, LoginPage.accessToken);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        String url = Urls.URL + "newRegistrationToken";
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, newToken,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
//                        Toast.makeText(CreateProfile.this, "Profile created", Toast.LENGTH_SHORT).show();
                        Log.d(TAG, "successfully updated token for firebase");
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "Was not able to update firebase token on backend");
            }
        });
        requestQueue.add(jsonObjectRequest);

    }
}





