package com.example.findyourpeers;


import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.matcher.ViewMatchers.withId;

import android.app.Instrumentation;

import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.UiDevice;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
public class BrowseCourseTest {

    @Rule
    public ActivityScenarioRule<BrowseCourse> mBrowseCourseTest =
            new ActivityScenarioRule<BrowseCourse>(BrowseCourse.class);
//    @Before
//    public void idleIt(){
//        IdlingRegistry.getInstance().register();
//    }

    @Test
    public void typeCourseName() throws Exception {
        Instrumentation instr = InstrumentationRegistry.getInstrumentation();
        UiDevice device = UiDevice.getInstance(instr);
        onView(withId(R.id.edit_text_course))
                .perform(typeText("CPEN 32"));
        onView(withId(R.id.dropdown_button))
                .perform(click());
        device.waitForIdle();




    }

}
