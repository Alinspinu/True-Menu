import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-email-error',
  templateUrl: './email-error.page.html',
  styleUrls: ['./email-error.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EmailErrorPage implements OnInit {

  name!: string;
  email!: string;

  constructor() { };

  ngOnInit() {
    this.getTempData();
  }

  getTempData(){
    Preferences.get({key: 'tempUserData'}).then(data => {
      if(data.value) {
       const userData = JSON.parse(data.value);
       this.name = userData.name;
       this.email = userData.email;
      };
    });
  };

}
