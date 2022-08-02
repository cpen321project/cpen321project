package com.example.findyourpeers;


import static android.service.autofill.Validators.not;
import static androidx.test.espresso.Espresso.onData;
import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.closeSoftKeyboard;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.RootMatchers.withDecorView;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withContentDescription;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withParent;
import static androidx.test.espresso.matcher.ViewMatchers.withTagValue;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.anything;
import static org.hamcrest.Matchers.is;

import android.app.Instrumentation;
import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.test.core.app.ActivityScenario;
import androidx.test.espresso.DataInteraction;
import androidx.test.espresso.ViewInteraction;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.rule.ActivityTestRule;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.Until;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.hamcrest.core.AllOf;
import org.hamcrest.core.Is;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@LargeTest
@RunWith(AndroidJUnit4.class)
public class CreateProfileTest {




    @Rule
                public ActivityTestRule<CreateProfile> mActivityRule =
                        new ActivityTestRule<CreateProfile>(CreateProfile.class) {
                            @Override
                            protected Intent getActivityIntent() {
                                Context targetContext = InstrumentationRegistry.getInstrumentation().getTargetContext();
                                Intent result = new Intent(targetContext, CreateProfile.class);
                                result.putExtra("username", "john");
                                result.putExtra("userID", "827105fd-c6f8-4bf8-a2a2-a1dc683ddcc9");
                                return result;
                            }
                        };


                @Test
    public void createProfileTest() throws InterruptedException {
        ViewInteraction appCompatEditText5 = onView(
                allOf(withId(R.id.display_name_input),
                        childAtPosition(
                                childAtPosition(
                                        withId(android.R.id.content),
                                        0),
                                1),
                        isDisplayed()));
        appCompatEditText5.perform(replaceText(""), closeSoftKeyboard());

        ViewInteraction materialButton4 = onView(
                allOf(withId(R.id.register_button), withText("Register"),
                        childAtPosition(
                                childAtPosition(
                                        withId(android.R.id.content),
                                        0),
                                6),
                        isDisplayed()));
        materialButton4.perform(click());

//        Thread.sleep(1000);
//                    onView(withText("Sign up failed"))
//                            .inRoot(withDecorView(not(decorView)))// Here we use decorView
//                            .check(matches(isDisplayed()))

        onView(withText("Sign up failed")).inRoot(new ToastMatcher())
                .check(matches(isDisplayed()));

        ViewInteraction appCompatEditText6 = onView(
                allOf(withId(R.id.display_name_input),
                        childAtPosition(
                                childAtPosition(
                                        withId(android.R.id.content),
                                        0),
                                1),
                        isDisplayed()));
        appCompatEditText6.perform(replaceText("John"), closeSoftKeyboard());

        ViewInteraction materialButton5 = onView(
                allOf(withId(R.id.register_button), withText("Register"),
                        childAtPosition(
                                childAtPosition(
                                        withId(android.R.id.content),
                                        0),
                                6),
                        isDisplayed()));
        materialButton5.perform(click());

        Thread.sleep(2000);

        ViewInteraction appCompatEditText7 = onView(
                allOf(withId(R.id.username_login),
                        childAtPosition(
                                childAtPosition(
                                        withId(android.R.id.content),
                                        0),
                                1),
                        isDisplayed()));
        appCompatEditText7.perform(replaceText("john"), closeSoftKeyboard());

        ViewInteraction appCompatEditText8 = onView(
                allOf(withId(R.id.password_login),
                        childAtPosition(
                                childAtPosition(
                                        withId(android.R.id.content),
                                        0),
                                2),
                        isDisplayed()));
        appCompatEditText8.perform(replaceText("John123??"), closeSoftKeyboard());

        ViewInteraction materialButton6 = onView(
                allOf(withId(R.id.button_login), withText("Login"),
                        childAtPosition(
                                childAtPosition(
                                        withId(android.R.id.content),
                                        0),
                                3),
                        isDisplayed()));
        materialButton6.perform(click());

                    Thread.sleep(3000);

                    ViewInteraction textView = onView(
                allOf(withId(R.id.textView_displayname), withText("Display name: John"),
                        withParent(withParent(withId(android.R.id.content))),
                        isDisplayed()));
        textView.check(matches(withText("Display name: John")));

        ViewInteraction textView2 = onView(
                allOf(withId(R.id.textView_yearstanding), withText("I am in year 1"),
                        withParent(withParent(withId(android.R.id.content))),
                        isDisplayed()));
        textView2.check(matches(withText("I am in year 1")));

        ViewInteraction textView3 = onView(
                allOf(withId(R.id.textview_coop), withText("I am in Co-op"),
                        withParent(withParent(withId(android.R.id.content))),
                        isDisplayed()));
        textView3.check(matches(withText("I am in Co-op")));
    }

    private static Matcher<View> childAtPosition(
            final Matcher<View> parentMatcher, final int position) {

        return new TypeSafeMatcher<View>() {
            @Override
            public void describeTo(Description description) {
                description.appendText("Child at position " + position + " in parent ");
                parentMatcher.describeTo(description);
            }

            @Override
            public boolean matchesSafely(View view) {
                ViewParent parent = view.getParent();
                return parent instanceof ViewGroup && parentMatcher.matches(parent)
                        && view.equals(((ViewGroup) parent).getChildAt(position));
            }
        };
    }
}
