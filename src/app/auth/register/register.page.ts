import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Cart } from 'src/app/cart/cart.model';
import { showToast, triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {

  checkedTerms: boolean = false;
  enableRegister: boolean = false;
  baseUrl: string = 'http://localhost:8080/api/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/api-true/';
  isLoading = false;
  form!: FormGroup;
  showPassword = false;
  iconName: string = 'eye-off-outline';
  passwordControl!: AbstractControl | any;
  confirmPasswordControl!: AbstractControl | any;
  cart: string = '';

  constructor(
  private authService: AuthService,
  private router: Router,
  private fb: FormBuilder,
  private toastCtrl: ToastController,
  ) {
    this.form = fb.group({
      email: fb.control('', [Validators.required]),
      name: fb.control('', [Validators.required]),
      password: fb.control('', [Validators.required]),
      confirmPassword: fb.control('', [Validators.required]),
    });

    this.passwordControl = this.form.get('password');
    this.confirmPasswordControl = this.form.get('confirmPassword');
    this.form.addValidators(
      this.createCompareValidator(this.passwordControl, this.confirmPasswordControl));
   };


     validateForm() {
      this.form.reset();
      const passwordControl = this.form.get('password');
      const confirmPasswordControl = this.form.get('confirmPassword');
      const usernameControl = this.form.get('name');

      if (passwordControl && confirmPasswordControl && usernameControl) {

        confirmPasswordControl.setValidators(Validators.required);
        passwordControl.setValidators(Validators.required);
        usernameControl.setValidators(Validators.required);

        confirmPasswordControl.updateValueAndValidity();
        passwordControl.updateValueAndValidity();
        usernameControl.updateValueAndValidity();
      }
      if(this.form.valid && this.checkedTerms){
        this.enableRegister = true
      } else {
        this.enableRegister = false
      }
    }


  ngOnInit() {
    this.validateForm();
  };

  triggerEscape(){
    triggerEscapeKeyPress()
  }

  togglePassword(){
    this.showPassword = !this.showPassword;
    this.iconName = this.showPassword ? 'eye-outline' : 'eye-off-outline';
  };

  getInputType() {
    return this.showPassword ? 'text' : 'password';
  };

  onSubmit(){
   Preferences.get({key: 'cart'}).then(res => {
    if(res.value){
      this.cart = res.value;
    };
   });

    const name = this.form.value.name;
    const password = this.form.value.password;
    const email = this.form.value.email;
    const confirmPassword = this.form.value.confirmPassword;
    this.authService.onRegister(name, email, password, confirmPassword, this.cart).subscribe(res => {
      if(res.message === "Email sent") {
        const data = JSON.stringify({
          name: name,
          email: email,
          id: res.id,
        })
        Preferences.set({key: 'tempUserData', value: data });
        this.router.navigate(['/email-sent']);
        triggerEscapeKeyPress();
      } else if(res.message === 'This email allrady exist'){
        this.router.navigate(['/tabs/cart']);
        showToast(this.toastCtrl, res.message, 3000);
        triggerEscapeKeyPress();
      } else if(res.message === 'Error sending email'){
        const data = JSON.stringify({
          name: name,
          email: email,
          id: res.id,
        });
        Preferences.set({key: 'tempUserData', value: data });
        this.router.navigate(['/email-error']);
        triggerEscapeKeyPress();
      };
    });

  };

  goTerms(){
    this.router.navigateByUrl('/terms')
    triggerEscapeKeyPress()
  }

  checked(event: any){
    if(this.form.valid && event.detail.checked){
      this.enableRegister = true
      this.checkedTerms = true
    } else if(event.detail.checked){
      this.checkedTerms = true
    } else {
      this.enableRegister= false
      this.checkedTerms = false
    }
  }

  createCompareValidator(control: AbstractControl, controlTwo: AbstractControl) {
    return () => {
    if (control.value !== controlTwo.value)
      return { match_error: 'Value does not match' };
    return null;
  };

};
};
