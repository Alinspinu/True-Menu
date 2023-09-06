import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { CapitalizePipe } from 'src/app/shared/capitalize.pipe';

@Component({
  selector: 'app-email-sent',
  templateUrl: './email-sent.page.html',
  styleUrls: ['./email-sent.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class EmailSentPage implements OnInit {

  name!: string;
  email!: string;
  message!: string;
  text!: string;

  constructor() { }

  ngOnInit() {
    this.getTempData();
  }

  getTempData(){
    Preferences.get({key: 'tempUserData'}).then(data => {
      if(data.value) {
       const userData = JSON.parse(data.value);
       this.name = userData.name;
       this.email = userData.email;
       if(userData.message){
         this.message = userData.message;
         this.text = userData.text;
       };
      };
    });
  };



}
