import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { TabsService } from './tabs/tabs.service';
import { ProductContentService } from './content/product-content/product-content.service';
import { AuthService } from './auth/auth.service';
import User from './auth/user.model';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],


})
export class AppComponent  implements OnInit, OnDestroy{
  user!: User
  facebookUrl!: string;
  newWindow!: string;
  isLoadding: boolean = false;
  userSub!: Subscription
  secondUserSub!: Subscription

  constructor(
    private router: Router,
    private authSrv: AuthService,
    private platform: Platform,
    private tabSrv: TabsService,
    private prodSrv: ProductContentService
    ) {}

  openFacebookPage() {
    window.open(this.facebookUrl, this.newWindow);
  }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe()
    }
    if(this.secondUserSub){
      this.secondUserSub.unsubscribe()
    }
  }

  getUser(){
    this.userSub = this.authSrv.user$.subscribe(response=> {
      this.secondUserSub = response.subscribe(user => {
        this.user = user

      })
    })
  }

  setUrl(){
    if(this.platform.is('mobile') && this.platform.is('ios')){
      this.facebookUrl = 'fb://profile/116327678118088';
      this.newWindow = '';
    } else if(this.platform.is('mobile') && this.platform.is('android')){
      this.facebookUrl = 'fb://page/116327678118088';
      this.newWindow = '';
    } else if(this.platform.is('desktop')){
      this.facebookUrl = 'https://www.faceboock.com/truefinecoffee';
      this.newWindow = '_blank';
    };

  };

  fetchData(){
    this.tabSrv.fetchCategories(environment.LOC).subscribe();
    this.prodSrv.fetchBlackList().subscribe()
  }


  initializeApp(){
    this.platform.ready().then(()=>{
      if(Capacitor.isPluginAvailable('SplashScreen')){
        SplashScreen.hide();
    }});
  };
  ngOnInit(): void {
    this.initializeApp();
    this.getUser()
    this.setUrl();
    // this.registrateServiceWorker();
    this.hideSplashScreen();
    this.fetchData();
  };



  hideSplashScreen(){
    setTimeout(() => {
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.style.display = 'none';
      }
    },4000)
  }

  registrateServiceWorker(){
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(registration => {
          console.log('Service Worker Registered', registration);
        })
        .catch(err => {
          console.error('Service Worker Registration Failed', err);
        });
    }
  }
};
