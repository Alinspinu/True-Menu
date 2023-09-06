import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { showToast } from 'src/app/shared/utils/toast-controller';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ResetPasswordPage implements OnInit {
  form!: FormGroup;
  showPassword: boolean = false;
  iconName: string = 'eye-off-outline';
  passwordControl!: AbstractControl | any;
  confirmPasswordControl!: AbstractControl | any;
  userId: string = '';

  constructor(
    private fb: FormBuilder,
    private authSrv: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
  ) {
    this.form = fb.group({
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


    if (passwordControl && confirmPasswordControl) {
      // Perform operations using the form controls
      // For example, set validators and update validity
      confirmPasswordControl.setValidators(Validators.required);
      passwordControl.setValidators(Validators.required);

      confirmPasswordControl.updateValueAndValidity();
      passwordControl.updateValueAndValidity();

    }
  }

  ngOnInit() {
    this.validateForm();
  };

  onSubmit(){
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const token = params.get('token');
    const password = this.form.value.password;
    const confirmPassword = this.form.value.confirmPassword;
    if(token){
      this.authSrv.resetPassword(token, password, confirmPassword).subscribe(res => {
        if(res){
          this.router.navigate(['/tabs/cart']);
          showToast(this.toastCtrl, 'Parola a fost schimbată cu succes!', 4000 );
        }
      }, error =>{
        console.log('Error', error);
        showToast(this.toastCtrl, error.message, 4000 );
      });
    };
  };

  togglePassword(){
    this.showPassword = !this.showPassword;
    this.iconName = this.showPassword ? 'eye-outline' : 'eye-off-outline';
  };

  getInputType() {
    return this.showPassword ? 'text' : 'password';
  }


  createCompareValidator(control: AbstractControl, controlTwo: AbstractControl) {
    return () => {
    if (control.value !== controlTwo.value)
      return { match_error: 'Value does not match' };
    return null;
  };
};

};
