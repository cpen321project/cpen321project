package com.example.findyourpeers;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.intent.Intents.intended;
import static androidx.test.espresso.intent.Intents.intending;
import static androidx.test.espresso.intent.matcher.IntentMatchers.anyIntent;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasComponent;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static org.hamcrest.core.AllOf.allOf;
import static org.junit.Assert.assertTrue;

import android.app.Activity;
import android.app.Instrumentation;
import android.content.Intent;
import android.view.View;

import androidx.test.espresso.intent.rule.IntentsTestRule;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
public class ProfilePageTest {
    private View decorView;
//    Intent ProfilePageIntent = new Intent();
//
//    browseCourseIntent.putExtra("userID", "userID");
//    browseCourseIntent.putExtra("displayName", "displayName");
//    browseCourseIntent.putExtra("courselist", "courseListAL");



    @Rule
    public ActivityScenarioRule<ProfilePage> mProfilePageTest =
            new ActivityScenarioRule<ProfilePage>(ProfilePage.class);
//
    @Rule
    public IntentsTestRule<ProfilePage> intentsTestRule =
            new IntentsTestRule<>(ProfilePage.class);

//    @Before
//    public void setUp() {
//        mProfilePageTest.getScenario().onActivity(new ActivityScenario.ActivityAction<ProfilePage>() {
//            @Override
//            public void perform(SignUp activity) {
//                decorView = activity.getWindow().getDecorView();
//            }
//            @Override
//
//        });
//    }

    @Test
    public void BrowseCourseTest() {
        Intent intent = new Intent();
        Instrumentation.ActivityResult result =
                new Instrumentation.ActivityResult(Activity.RESULT_OK, intent);

        Instrumentation.ActivityMonitor am = new Instrumentation.ActivityMonitor("BrowseCourse", null, true);
        InstrumentationRegistry.getInstrumentation().addMonitor(am);
//        onView(withId(R.id.view_id_to_perform_clicking)).check(matches(isDisplayed())).perform(click());
        assertTrue(InstrumentationRegistry.getInstrumentation().checkMonitorHit(am, 1));
//
//        browseCourseIntent.putExtra("userID", "userID");
//        browseCourseIntent.putExtra("displayName", "displayName");
//        browseCourseIntent.putExtra("courselist", "courseListAL");
        intending(anyIntent()).respondWith(result);
        onView(withId(R.id.find_course_button))
                .perform(click());


//
        intended(allOf(hasComponent(BrowseCourse.class.getName())));
    }

}
