package com.example.findyourpeers;


import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withTagValue;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

import static org.hamcrest.core.AllOf.allOf;
import static org.hamcrest.core.Is.is;

import android.app.Instrumentation;

import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.Until;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
public class BrowseCourseTest {
    Instrumentation instr = InstrumentationRegistry.getInstrumentation();
    UiDevice device = UiDevice.getInstance(instr);
    @Rule
    public ActivityScenarioRule<LoginPage> mBrowseCourseTest =
            new ActivityScenarioRule<LoginPage>(LoginPage.class);
//    @Before
//    public void idleIt(){
//        IdlingRegistry.getInstance().register();
//    }

    @Test
    public void browseCoursePageTest() throws Exception {

        onView(withId(R.id.username_login))
                .perform(typeText("cutenames"));
        onView(withId(R.id.password_login))
                .perform(typeText("Dhir123!"));
        onView(withId(R.id.button_login))
                .perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/find_course_button")),5000);

        onView(withId(R.id.find_course_button))
                .perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/edit_text_course")),1000);
        onView(withId(R.id.edit_text_course))
                .perform(typeText("CPSC 22"));
        onView(withId(R.id.dropdown_button))
                .perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/coursenameTV")),3000);
        onView(withId(R.id.layout_courses_browse))
                .perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/coursenameTV")),3000);
        onView(withText("Add Course")).perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/coursenameTV")),3000);

    }

    @Test
    public void browseCoursePageCancelTest() throws Exception {

        onView(withId(R.id.username_login))
                .perform(typeText("cutenames"));
        onView(withId(R.id.password_login))
                .perform(typeText("Dhir123!"));
        onView(withId(R.id.button_login))
                .perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/find_course_button")),5000);

        onView(withId(R.id.find_course_button))
                .perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/edit_text_course")),1000);
        onView(withId(R.id.edit_text_course))
                .perform(typeText("CPSC 22"));
        onView(withId(R.id.dropdown_button))
                .perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/coursenameTV")),3000);
        onView(withId(R.id.layout_courses_browse))
                .perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/coursenameTV")),1000);
        onView(withText("Cancel")).perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/coursenameTV")),3000);

    }

    @Test
    public void browseCourseRandomText() throws Exception {

        onView(withId(R.id.username_login))
                .perform(typeText("cutenames"));
        onView(withId(R.id.password_login))
                .perform(typeText("Dhir123!"));
        onView(withId(R.id.button_login))
                .perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/find_course_button")),5000);

        onView(withId(R.id.find_course_button))
                .perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/edit_text_course")),1000);
        onView(withId(R.id.edit_text_course))
                .perform(typeText("XYZ "));
        onView(withId(R.id.dropdown_button))
                .perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/coursenameTV")),3000);
        device.pressBack();
//        onView(withId(R.id.layout_courses_browse))
//                .perform(click());
//        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/coursenameTV")),3000);
//        onView(withText("Cancel")).perform(click());
//        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/coursenameTV")),3000);
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/my_profile")),1000);
        onView(withId(R.id.my_profile))
                .perform(click());
//        onView(withText("My Profile")).perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/coursenameTV")),4000);
        onView(allOf(withTagValue(is((Object) "cross-CPSC 221")), isDisplayed())).perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/coursenameTV")),3000);

    }

}
