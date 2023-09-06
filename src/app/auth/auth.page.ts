import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';

import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Preferences } from '@capacitor/preferences';
import { showToast, triggerEscapeKeyPress } from '../shared/utils/toast-controller';


export interface AuthResData {
  token: string,
  name: string,
};



@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AuthPage implements OnInit {

  baseUrl: string = 'http://localhost:8080/api/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/api-true/';
  isLoading = false;
  form!: FormGroup;
  showPassword = false;
  iconName: string = 'eye-off-outline';
  tab!: string;
  resetPassword: boolean = false;
  resetPasswordMode: boolean = false;
  emailValue!: string;
  validEmail: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) { }


  triggerEscape(){
    triggerEscapeKeyPress()
  }
  getCurrentTab() {
    const currentTab = window.location.href;
    const indexTab = currentTab.lastIndexOf('/');
    const tab = currentTab.slice(indexTab +1);
    return this.tab = tab;
  }

  togglePassword(){
    this.showPassword = !this.showPassword;
    this.iconName = this.showPassword ? 'eye-outline' : 'eye-off-outline';
  }

  getInputType() {
    return this.showPassword ? 'text' : 'password';
  }



  ngOnInit() {
    this.getCurrentTab();
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
    });
  };

  onSubmit(){
    const name = this.form.value.name;
    const password = this.form.value.password;
    this.authService.onLogin(name, password).subscribe(res => {
      if(res.message === 'Email sent'){
        const data = JSON.stringify({
          name: res.user.name,
          email: res.user.email,
          id: res.user.id,
          message: 'Adresa de email nu a fost verificată!',
          text: 'confirmare',
        });
        Preferences.set({key: 'tempUserData', value: data });
        this.router.navigateByUrl('/email-sent');
        triggerEscapeKeyPress();
      } else {
        triggerEscapeKeyPress();
        this.router.navigateByUrl(`/tabs/${this.tab}`);
      }
    }, error => {
      if(error.status === 401){
        showToast(this.toastCtrl, 'Nume sau parola incorectă!', 5000);
        setTimeout(() => {
          this.resetPassword = true;
        }, 600);
      };
    });

  };

  onResetPassword(){
    this.resetPasswordMode = true;
  }


  isEmailValid(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  validateEmail(){
    this.isEmailValid(this.emailValue) ? this.validEmail = true : this.validEmail = false;
  }

  sendNewPassword(){
    this.authService.sendResetEmail(this.emailValue).subscribe(res => {
      if(res){
        const data = JSON.stringify({
          name: res.user.name,
          email: res.user.email,
          id: res.user.id,
          message: 'Resetare Parola',
          text: 'resetare a parolei',
        })
        Preferences.set({key: 'tempUserData', value: data });
        this.router.navigateByUrl('/email-sent');
        triggerEscapeKeyPress();
      }
    }, error => {
      console.log('error', error);
      if(error.status === 404){
        showToast(this.toastCtrl, error.error.message, 4000 );
      };
    });
  };
};
