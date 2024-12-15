import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging'
import { FIREBASE_OPTIONS } from '@angular/fire/compat'
import { FCM } from '@ionic-native/fcm/ngx'


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { LogoPagePage } from './shared/logo-page/logo-page.page';
import { environment } from 'src/environments/environment';
import { AuthInterceptorService } from './auth/auth-interceptor.service';






@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    LogoPagePage,
    AngularFireMessagingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    HttpClient,
    FCM,
    {provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig},
  ],
  bootstrap: [AppComponent],

})
export class AppModule {}
