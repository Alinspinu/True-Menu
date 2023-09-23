import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { CartService } from './cart.service';
import { Cart } from './cart.model';
import { Subscription } from 'rxjs';
import { TabsService } from '../tabs/tabs.service';
import { Preferences } from '@capacitor/preferences'
import { ActionSheetService } from '../shared/action-sheet.service';
import { RegisterPage } from '../auth/register/register.page';
import { AuthPage } from '../auth/auth.page';
import User from '../auth/user.model';
import { AuthService } from '../auth/auth.service';
import { TabHeaderPage } from '../content/tab-header/tab-header.page';
import { TipsPage } from './tips/tips.page';
import { CashBackPage } from './cash-back/cash-back.page';
import { Router } from '@angular/router';
import { showToast } from '../shared/utils/toast-controller';
import { TimerPage } from '../shared/timer/timer.page';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TimerPage, TabHeaderPage]
})
export class CartPage implements OnInit, OnDestroy {

  enableOrder: boolean = false
  checkedTerms: boolean = false
  maxTable: number = 99
  tips: boolean = false;
  showCashBack: boolean = false;
  user!: User;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isDarkMode!: boolean;
  emptyBasket: boolean = true;
  isLoading: boolean = false;
  inputValue!: number;
  cart!: Cart;
  tipsValue!: number;
  productValue!: number;
  cartSubscription!: Subscription;
  userSub!: Subscription;
  admin!: Subscription;
  authSub!: Subscription;
  toGo: boolean = false;
  pickUp: boolean = false;
  // categoryIndex!: String;


  constructor(
    private cartService: CartService,
    private tabSrv: TabsService,
    private toastCtrl: ToastController,
    private authSrv: AuthService,
    private router: Router,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    ) { }

  ngOnInit() {
    this.getCart();
    this.getUser();
    this.detectColorScheme();
  };

  goToProductView(id: string){
    const catProdIndex = this.tabSrv.getProductIndex(id)
    if(catProdIndex !== -1) {
      this.router.navigateByUrl('tabs/product-content/' + id + '/' + catProdIndex)
    } else {
      const productId = this.tabSrv.getProductId(id)
      if(productId !== -1) {
        const productIndex = this.tabSrv.getProductIndex(productId)
          if(productIndex !== -1) {
            this.router.navigateByUrl('tabs/product-content/' + productId + '/' + productIndex)
          }
      }
    }
  }



  saveCart(){
    this.cart.masa = this.inputValue;
    this.cart.pickUp = this.pickUp;
    this.cart.toGo = this.toGo;
    if(!this.cart.tips){
      this.cart.tips = 0;
    }
    if(this.user) {
      if(this.user._id.length){
        this.cart.userId = this.user._id;
      }
    }
    const cart = JSON.stringify(this.cart);
    Preferences.set({key: 'cart', value: cart});
  }

  goTerms(){
    this.router.navigateByUrl('/terms')
  }

  onInputChange(event: any) {
    const value = event.target.value;
    const stringValue = value.toString()
    if(stringValue.length > 2){
      this.inputValue = parseFloat(stringValue.substring(0,2))
    }
    if(value && this.checkedTerms){
      this.enableOrder = true
    } else if(this.isLoggedIn && value) {
      this.enableOrder = true
    } else {
      this.enableOrder = false
    }
  };


  checked(event: any){
    if(this.inputValue && event.detail.checked || this.pickUp && event.detail.checked){
      this.enableOrder = true
      this.checkedTerms = true
    } else if(event.detail.checked){
      this.checkedTerms = true
    } else {
      this.enableOrder = false
      this.checkedTerms = false
    }
  }

  selectPickUp(event: any) {
    if(event.detail.checked && this.checkedTerms){
      this.pickUp = true;
      this.inputValue = 0
      this.enableOrder = true
    } else if(event.detail.checked && !this.isLoggedIn) {
      this.pickUp = true
      this.inputValue = 0
    } else if(event.detail.checked && this.isLoggedIn){
      this.pickUp = true;
      this.inputValue = 0
      this.enableOrder = true
      console.log(this.enableOrder)
    } else {
      this.pickUp = false;
      this.enableOrder = false
    }
  }

  selectToGo(event: any) {
    if(event.detail.checked){
      this.toGo = true;
    } else {
      this.toGo = false;
    }
  }

  saveData(userId: string, userCashBackBefore: number, cartCashBack: number){
      const data = JSON.stringify({
        userId,
        userCashBackBefore,
        cartCashBack
      })
      Preferences.set({key: 'data', value: data});
  }

  getCart(){
    this.isLoading = true;
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      if(cart){
        cart.subscribe(cart => {
          this.cart = cart;
          this.isLoading = false;
          this.cart.total = this.totalProduct() + this.cart.tips - this.cart.cashBack;
          this.emptyBasket = this.cart.productCount !== 0 ? false : true;
          this.tips = this.cart.tips > 0 ? true : false;
          this.showCashBack = this.cart.cashBack > 0 ? true : false;
        });
      } else{
        this.isLoading = false;
      };

    });
  };


  getUser(){
    this.userSub = this.authSrv.user$.subscribe(res => {
      if(res){
        res.subscribe(userData => {
            this.user = userData;
            this.isLoggedIn = this.user.status === 'active' ? true : false;
            this.isAdmin = this.user.admin === 1 ? true : false;
        });
      };
    });
    };


  async getToken() {
    this.checkProductsAvalability();
  };

  checkProductsAvalability(){
    this.isLoading = true;
    let idProd = [];
    let idSub = [];
    for(let product of this.cart.products){
      if(product.name.includes('-')){
        idSub.push(product._id);
      } else {
        idProd.push(product._id);
      };
    };
    this.cartService.checkAvailable(idSub, idProd).subscribe(res => {
      if(res.message === 'All good'){
        if(this.user._id.length){
          return this.cartService.checkUserCashBack(this.cart.cashBack, this.user._id, this.cart.total).subscribe(res => {
            if(res.message === 'All good'){
              this.saveData(res.userId, res.userCashBackBefore, res.cartCashBack);
              return this.cartService.getToken(this.cart.total).subscribe(res=>{
                const orderCode = res.orderCode.toString()
                this.saveCart();
                setTimeout(()=>{
                  this.isLoading = false;
                }, 2000)
                window.location.href = 	`https://www.vivapayments.com/web/checkout?ref=${orderCode}&color=f3d4b5`;
              })
            } else if(res.message === 'Value 0') {
              this.saveCart();
              return window.location.href = `https://true-meniu.web.app/success?user=${res.userId}&ucbb=${res.userCashBackBefore}&ccb=${res.cartCashBack}`;
            } else {
              this.isLoading = false;
              return showToast(this.toastCtrl, res.message, 4000);
            };
          });
        } else {
          return this.cartService.getToken(this.cart.total).subscribe(res=>{
            this.saveCart();
            const orderCode = res.orderCode.toString()
            setTimeout(()=>{
              this.isLoading = false;
            }, 2000)
            return window.location.href = `https://www.vivapayments.com/web/checkout?ref=${orderCode}&color=f3d4b5`;
          });
        };
      } else {
        showToast(this.toastCtrl, res.message, 5000);
        return this.isLoading = false;
      };
    });
  };


  onSignIn(){
    this.saveCart();
    this.actionSheet.openAuth(AuthPage);
  };

  onRegister(){
    this.saveCart();
    this.actionSheet.openAuth(RegisterPage);
  };



  totalProduct(){
    let total = 0;
    for (let product of this.cart.products){
      total += product.total;
    };
    this.cart.totalProducts = total;
    return this.productValue = total;

}

add(index: number, name: string, category: string, sub: boolean){
    this.cartService.addOne(index);
    if(sub){
     const names =  name.split('-');
     const prodName = names[0];
     const subName = names[1];
     this.tabSrv.addSub(subName, prodName, category);
    } else {
      this.tabSrv.addProd(category, name);
    };
};

red(index: number, name: string, category: string, sub: boolean){
  const rem = false;
  this.cartService.redOne(index);
  if(sub){
    const names =  name.split('-');
    const prodName = names[0];
    const subName = names[1];
    this.tabSrv.redSub(subName, prodName, category, rem);
   } else {
     this.tabSrv.redProd(category, name, rem);
   };
};

remove(index: number, qty: number, name: string, category: string, sub: boolean){
  const rem = true;
  this.cartService.removeProduct(index, qty);
  if(sub){
    const names =  name.split('-');
    const prodName = names[0];
    const subName = names[1];
    this.tabSrv.redSub(subName, prodName, category, rem);
  } else {
    this.tabSrv.redProd(category, name, rem);
  };
};




  detectColorScheme() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = darkModeMediaQuery.matches;
    darkModeMediaQuery.addListener((event) => {
      this.isDarkMode = event.matches;
    });
  };



  cashBackModal(){
    this.actionSheet.openModal(CashBackPage, {ing: [], mode: '', ingId: ''});
  };

  tipsModal(){
    this.actionSheet.openModal(TipsPage, {ing: [], mode: '', ingId: ''});
  };


  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.userSub.unsubscribe();
    this.admin.unsubscribe();
  };

}

