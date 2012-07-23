package com.example.testphonegap;

import org.apache.cordova.DroidGap;

import android.os.Bundle;
import android.view.Menu;
import android.view.WindowManager;

public class MainActivity extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, 
                WindowManager.LayoutParams.FLAG_FULLSCREEN | 
                WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
    }
   
}
