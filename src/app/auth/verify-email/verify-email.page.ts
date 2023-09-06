import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import User from '../user.model';
import { LogoPagePage } from 'src/app/shared/logo-page/logo-page.page';
import { CapitalizePipe } from 'src/app/shared/capitalize.pipe';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, LogoPagePage, CapitalizePipe]
})
export class VerifyEmailPage implements OnInit {
  user!:User;
  error!: boolean;
  isLoading: boolean = false;
  constructor(private authSrv: AuthService, private router: Router) { }

  ngOnInit() {
    this.verifyToken();
  };

verifyToken(){
  this.isLoading = true;
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');
  if(token){
    this.authSrv.verifyToken(token).subscribe((res: User) => {
      if(res.status === "active"){
        this.user = res;
        this.error = false;
        this.isLoading = false;
      } else if(res.status === "inactive") {
        this.error = true;
      }
    }, (error: any)=> {
      this.error = true;
      this.isLoading = false;
        console.log(error.status);
    });
  };
};



backToCart(){
this.router.navigate(['/tabs/cart']);
};

};
