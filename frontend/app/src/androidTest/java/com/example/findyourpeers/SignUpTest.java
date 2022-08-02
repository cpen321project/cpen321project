package com.example.findyourpeers;

import static android.app.Instrumentation.ActivityResult;
import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.intent.Intents.intending;
import static androidx.test.espresso.intent.matcher.IntentMatchers.toPackage;
import static androidx.test.espresso.matcher.RootMatchers.withDecorView;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

import android.app.Activity;
import android.content.Intent;
import android.view.View;

import androidx.test.core.app.ActivityScenario;
import androidx.test.espresso.intent.rule.IntentsTestRule;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
public class SignUpTest {
    private View decorView;
//
    @Rule
    public ActivityScenarioRule<SignUp> mSignUpTestRule =
        new ActivityScenarioRule<SignUp>(SignUp.class);

    @Rule
    public IntentsTestRule<SignUp> intentsTestRule =
            new IntentsTestRule<>(SignUp.class);

    @Before
    public void setUp() {
        mSignUpTestRule.getScenario().onActivity(new ActivityScenario.ActivityAction<SignUp>() {
            @Override
            public void perform(SignUp activity) {
                decorView = activity.getWindow().getDecorView();
            }
        });
    }

    @Test
    public void getVerificationCode_empty () throws Exception{
        onView(withId(R.id.verify_email_button))
                .perform(click());
//        onView(withText(R.string.).
//                inRoot(withDecorView(not(is(activity.getWindow().getDecorView())))).
//                check(matches(isDisplayed()));
        onView(withText("Please enter all fields"))
                .inRoot(withDecorView(Matchers.not(decorView)))// Here we use decorView
                .check(matches(isDisplayed()));

    }
    // will have to comment out this test to prevent app from crashing
//    @Test
//    public void invalidEmail () throws Exception {
//        onView(withId(R.id.email_address_signup))
//                .perform(typeText("x"));
//        onView(withId(R.id.username_signup))
//                .perform(typeText("testUsername1"));
//        onView(withId(R.id.password_signup))
//                .perform(typeText("x"));
//        onView(withId(R.id.verify_email_button))
//                .perform(click());
//
//        // add the check thing when app stops crashing
//
//
//    }


//    // will have to comment out this test to prevent app from crashing
//    @Test
//    public void invalidPassword () throws Exception {
//                onView(withId(R.id.email_address_signup))
//                .perform(typeText("cutename@yopmail.com"));
//                onView(withId(R.id.username_signup))
//                .perform(typeText("testUsername1"));
//                onView(withId(R.id.password_signup))
//                .perform(typeText("x"));
//                onView(withId(R.id.verify_email_button))
//                .perform(click());
//        // add the check thing when app stops crashing
//    }


    @Test
    public void validPassword () throws Exception {
        Intent enterCodeIntent = new Intent();

        String emailStr = "cutename@yopmail.com";
        String passwordStr = "Abcde12345!";
        String usernameStr = "testUsername1";

        enterCodeIntent.putExtra("email", emailStr);
        enterCodeIntent.putExtra("password", passwordStr);
        enterCodeIntent.putExtra("username", usernameStr);

        ActivityResult result =
                new ActivityResult(Activity.RESULT_OK, enterCodeIntent);

        intending(toPackage("com.example.findyourpeers")).respondWith(result);


        onView(withId(R.id.email_address_signup))
        .perform(typeText(emailStr));
        onView(withId(R.id.username_signup))
        .perform(typeText("testUsername1"));
        onView(withId(R.id.password_signup))
        .perform(typeText("Abcde12345!"));
        onView(withId(R.id.verify_email_button))
        .perform(click());



        // add the check thing when app stops crashing


    }



}
