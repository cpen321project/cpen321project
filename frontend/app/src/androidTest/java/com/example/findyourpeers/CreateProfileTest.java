package com.example.findyourpeers;


import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import org.junit.Rule;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
public class CreateProfileTest {

    @Rule
    public ActivityScenarioRule<CreateProfile> mCreateProfileTest =
            new ActivityScenarioRule<CreateProfile>(CreateProfile.class);

    

}
