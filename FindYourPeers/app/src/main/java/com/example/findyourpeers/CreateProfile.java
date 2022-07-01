package com.example.findyourpeers;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Spinner;
import android.widget.Button;

public class CreateProfile extends AppCompatActivity {

    private EditText displayName;
    private Spinner coopSpinner, yearSpinner;
    private Button registerButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_profile);

        displayName = findViewById(R.id.display_name_input);

        coopSpinner = findViewById(R.id.spinner_coop);
        ArrayAdapter<CharSequence> coopAdapter = ArrayAdapter.createFromResource(this, R.array.coop_status, android.R.layout.simple_spinner_item);
        coopAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        coopSpinner.setAdapter(coopAdapter);

        yearSpinner = findViewById(R.id.spinner_yearstanding);
        ArrayAdapter<CharSequence> yearAdapter = ArrayAdapter.createFromResource(this, R.array.year_standing, android.R.layout.simple_spinner_item);
        yearAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        yearSpinner.setAdapter(yearAdapter);

        registerButton = findViewById(R.id.register_button);
        registerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent browseCourseIntent = new Intent(CreateProfile.this, BrowseCourse.class);
                startActivity(browseCourseIntent);
            }
        });

    }
}