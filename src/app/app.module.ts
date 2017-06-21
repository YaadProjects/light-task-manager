import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthProvider } from '../providers/auth/auth';
import { TeamProvider } from '../providers/team/team';

export const firebaseConfig = {
  apiKey: "AIzaSyCHIj-MsPhduun2E9l4BE2CUNzcBHG2MJk",
  authDomain: "new-project-manager.firebaseapp.com",
  databaseURL: "https://new-project-manager.firebaseio.com",
  projectId: "new-project-manager",
  storageBucket: "new-project-manager.appspot.com",
  messagingSenderId: "996575338215"
};


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    TeamProvider
  ]
})
export class AppModule {}
