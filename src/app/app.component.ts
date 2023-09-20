import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { TabsService } from './tabs/tabs.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],


})
export class AppComponent  implements OnInit{
  facebookUrl!: string;
  newWindow!: string;
  isLoadding: boolean = false;

  constructor(private router: Router, private platform: Platform, private tabSrv: TabsService) {}

  openFacebookPage() {
    window.open(this.facebookUrl, this.newWindow);
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
    this.tabSrv.fetchCategories().subscribe();
  }


  initializeApp(){
    this.platform.ready().then(()=>{
      if(Capacitor.isPluginAvailable('SplashScreen')){
        SplashScreen.hide();
    }});
  };
  ngOnInit(): void {
    this.initializeApp();
    this.setUrl();
    this.fetchData();
  };
};
