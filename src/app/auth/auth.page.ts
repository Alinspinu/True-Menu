import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';

import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Preferences } from '@capacitor/preferences';
import { showToast, triggerEscapeKeyPress } from '../shared/utils/toast-controller';
import { ActionSheetService } from '../shared/action-sheet.service';
import { RegisterPage } from './register/register.page';
import { environment } from 'src/environments/environment';


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
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
  ) { }


  triggerEscape(){
    this.modalCtrl.dismiss()
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
      email: new FormControl(null, {
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
    const email = this.form.value.email;
    const password = this.form.value.password;
    this.authService.onLogin(email, password).subscribe(res => {
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
        this.modalCtrl.dismiss()
        // triggerEscapeKeyPress();
      } else {
        this.modalCtrl.dismiss()
        this.router.navigateByUrl(`/tabs/${this.tab}`);
      }
    }, error => {
      if(error.status === 401){
        showToast(this.toastCtrl, error.error.message, 5000);
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
        this.modalCtrl.dismiss()
      }
    }, error => {
      console.log('error', error);
      if(error.status === 404){
        showToast(this.toastCtrl, error.error.message, 4000 );
      };
    });
  };


  onRegister(){
    this.modalCtrl.dismiss()
    this.actionSheet.openAuth(RegisterPage);
  };
};
