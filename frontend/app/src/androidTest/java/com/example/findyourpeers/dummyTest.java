package com.example.findyourpeers;


import androidx.test.espresso.DataInteraction;
import androidx.test.espresso.ViewInteraction;
import androidx.test.filters.LargeTest;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import static androidx.test.InstrumentationRegistry.getInstrumentation;
import static androidx.test.espresso.Espresso.onData;
import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.Espresso.pressBack;
import static androidx.test.espresso.Espresso.openActionBarOverflowOrOptionsMenu;
import static androidx.test.espresso.action.ViewActions.*;
import static androidx.test.espresso.assertion.ViewAssertions.*;
import static androidx.test.espresso.matcher.ViewMatchers.*;

import com.example.findyourpeers.R;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.hamcrest.core.IsInstanceOf;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.anything;
import static org.hamcrest.Matchers.is;

@LargeTest
@RunWith(AndroidJUnit4.class)
public class dummyTest {

    @Rule
    public ActivityScenarioRule<MainActivity> mActivityScenarioRule =
            new ActivityScenarioRule<>(MainActivity.class);

    @Test
    public void dummyTest() {
        ViewInteraction materialButton = onView(
allOf(withId(R.id.signup_button), withText("Sign Up"),
childAtPosition(
childAtPosition(
withId(android.R.id.content),
0),
2),
isDisplayed()));
        materialButton.perform(click());
        
        ViewInteraction appCompatEditText = onView(
allOf(withId(R.id.email_address_signup),
childAtPosition(
childAtPosition(
withId(android.R.id.content),
0),
1),
isDisplayed()));
        appCompatEditText.perform(replaceText("nancynagy66@gmail.com"), closeSoftKeyboard());
        
        ViewInteraction appCompatEditText2 = onView(
allOf(withId(R.id.username_signup),
childAtPosition(
childAtPosition(
withId(android.R.id.content),
0),
2),
isDisplayed()));
        appCompatEditText2.perform(click());
        
        ViewInteraction appCompatEditText3 = onView(
allOf(withId(R.id.username_signup),
childAtPosition(
childAtPosition(
withId(android.R.id.content),
0),
2),
isDisplayed()));
        appCompatEditText3.perform(replaceText("hulio"), closeSoftKeyboard());
        
        ViewInteraction appCompatEditText4 = onView(
allOf(withId(R.id.password_signup),
childAtPosition(
childAtPosition(
withId(android.R.id.content),
0),
4),
isDisplayed()));
        appCompatEditText4.perform(replaceText("Nancy123??"), closeSoftKeyboard());
        
        ViewInteraction materialButton2 = onView(
allOf(withId(R.id.verify_email_button), withText("Get Verification Code"),
childAtPosition(
childAtPosition(
withId(android.R.id.content),
0),
5),
isDisplayed()));
        materialButton2.perform(click());
        
        ViewInteraction appCompatEditText5 = onView(
allOf(withId(R.id.verification_code),
childAtPosition(
childAtPosition(
withId(android.R.id.content),
0),
1),
isDisplayed()));
        appCompatEditText5.perform(replaceText("658770"), closeSoftKeyboard());
        
        ViewInteraction materialButton3 = onView(
allOf(withId(R.id.verify_code_button), withText("Verify My Code"),
childAtPosition(
childAtPosition(
withId(android.R.id.content),
0),
2),
isDisplayed()));
        materialButton3.perform(click());
        
        ViewInteraction textView = onView(
allOf(withId(R.id.create_profile_title), withText("Create Profile"),
withParent(withParent(withId(android.R.id.content))),
isDisplayed()));
        textView.check(matches(withText("Create Profile")));
        
        ViewInteraction editText = onView(
allOf(withId(R.id.display_name_input), withText("Display Name"),
withParent(withParent(withId(android.R.id.content))),
isDisplayed()));
        editText.check(matches(withText("Display Name")));
        
        ViewInteraction textView2 = onView(
allOf(withId(R.id.title_yearstanding), withText("Year Standing"),
withParent(withParent(withId(android.R.id.content))),
isDisplayed()));
        textView2.check(matches(withText("Year Standing")));
        
        ViewInteraction spinner = onView(
allOf(withId(R.id.spinner_yearstanding), withContentDescription("Year Standing"),
withParent(withParent(withId(android.R.id.content))),
isDisplayed()));
        spinner.check(matches(isDisplayed()));
        
        ViewInteraction textView3 = onView(
allOf(withId(android.R.id.text1), withText("1"),
withParent(allOf(withId(R.id.spinner_yearstanding), withContentDescription("Year Standing"),
withParent(IsInstanceOf.<View>instanceOf(android.widget.RelativeLayout.class)))),
isDisplayed()));
        textView3.check(matches(withText("1")));
        
        ViewInteraction textView4 = onView(
allOf(withId(R.id.title_coop), withText("Currently on Co-op"),
withParent(withParent(withId(android.R.id.content))),
isDisplayed()));
        textView4.check(matches(withText("Currently on Co-op")));
        
        ViewInteraction spinner2 = onView(
allOf(withId(R.id.spinner_coop), withContentDescription("Currently on Co-op"),
withParent(withParent(withId(android.R.id.content))),
isDisplayed()));
        spinner2.check(matches(isDisplayed()));
        
        ViewInteraction textView5 = onView(
allOf(withId(android.R.id.text1), withText("Yes"),
withParent(allOf(withId(R.id.spinner_coop), withContentDescription("Currently on Co-op"),
withParent(IsInstanceOf.<View>instanceOf(android.widget.RelativeLayout.class)))),
isDisplayed()));
        textView5.check(matches(withText("Yes")));
        
        ViewInteraction button = onView(
allOf(withId(R.id.register_button), withText("REGISTER"),
withParent(withParent(withId(android.R.id.content))),
isDisplayed()));
        button.check(matches(isDisplayed()));
        
        ViewInteraction textView6 = onView(
allOf(withId(android.R.id.text1), withText("Yes"),
withParent(allOf(withId(R.id.spinner_coop), withContentDescription("Currently on Co-op"),
withParent(IsInstanceOf.<View>instanceOf(android.widget.RelativeLayout.class)))),
isDisplayed()));
        textView6.check(matches(withText("Yes")));
        
        ViewInteraction materialButton4 = onView(
allOf(withId(R.id.register_button), withText("Register"),
childAtPosition(
childAtPosition(
withId(android.R.id.content),
0),
6),
isDisplayed()));
        materialButton4.perform(click());
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
                        && view.equals(((ViewGroup)parent).getChildAt(position));
            }
        };
    }
    }
