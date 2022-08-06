package com.example.findyourpeers;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withTagValue;

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
public class GetStudentsTests {
    Instrumentation instr = InstrumentationRegistry.getInstrumentation();
    UiDevice device = UiDevice.getInstance(instr);

    @Rule
    public ActivityScenarioRule<LoginPage> mGetStudentsTest =
            new ActivityScenarioRule<LoginPage>(LoginPage.class);

    @Test
    public void getStudentTest() throws Exception {

        onView(withId(R.id.username_login))
                .perform(typeText("flyinghamster"));
        onView(withId(R.id.password_login))
                .perform(typeText("Rilto123!"));
        onView(withId(R.id.button_login))
                .perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/coursename_buttons_layout")), 6000);
        onView(allOf(withTagValue(is((Object) "button-BMEG 250")), isDisplayed())).perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/studentname_button_layout")), 5000);
        device.pressBack();
        onView(allOf(withTagValue(is((Object) "button-ACAM 250")), isDisplayed())).perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/studentname_button_layout")), 5000);
        onView(allOf(withTagValue(is((Object) "button-Hamtaro Apple")), isDisplayed())).perform(click());
        device.wait(Until.findObject(By.res("com.example.findyourpeers:id/otherDisplayNameTV")), 5000);

    }
}
