import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CartService } from '../cart.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import User from 'src/app/auth/user.model';
import { Cart } from '../cart.model';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';

@Component({
  selector: 'app-cash-back',
  templateUrl: './cash-back.page.html',
  styleUrls: ['./cash-back.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CashBackPage implements OnInit, OnDestroy {

  userSub!: Subscription;
  userSub2!: Subscription;
  cartSub!: Subscription;
  cashBackValue: number = 0;
  newCashBackValue: number = this.cashBackValue
  user!: User;
  cart!: Cart;

  constructor(
    private authSrv: AuthService,
    private cdRef: ChangeDetectorRef,
    private cartSrv: CartService,
    ) { }

  ngOnInit() {
    this.getCart();
    this.getCashBack();
  }

  getCart(){
    this.cartSub = this.cartSrv.cartSend$.subscribe(res => {
      if(res){
          this.cart = res;
      };
    });
  };

  getCashBack(){
    this.userSub = this.authSrv.user$.subscribe(user => {
          if(user) {
           this.userSub2 = user.subscribe(userData => {
             if(this.cart.total < userData.cashBack){
               this.user = userData;
               this.cashBackValue = this.cart.total;
               this.newCashBackValue = this.cart.total
              } else {
                this.user = userData;
                this.cashBackValue = userData.cashBack;
                this.newCashBackValue = userData.cashBack;
              };
            });
          };
        });
};


change(value: any){
  this.cdRef.detectChanges();
  this.newCashBackValue = value > this.cashBackValue ? this.cashBackValue : value;
}

triggerEscape(){
  triggerEscapeKeyPress()
}

  useCashBack(){
    if(this.newCashBackValue === undefined){
      this.cartSrv.updateCashBack(this.cashBackValue);
      this.user.cashBack = this.user.cashBack - this.cashBackValue;
      this.authSrv.updateCaskBack(this.user);
    } else{
      this.cartSrv.updateCashBack(this.newCashBackValue);
      this.user.cashBack = this.user.cashBack - this.newCashBackValue;
      this.authSrv.updateCaskBack(this.user);
    }
    triggerEscapeKeyPress();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.userSub2.unsubscribe();
    this.cartSub.unsubscribe();
  };

};
