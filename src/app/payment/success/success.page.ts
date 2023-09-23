import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences'
import { Cart } from 'src/app/cart/cart.model';
import { HttpClient } from '@angular/common/http';
import { LogoPagePage } from 'src/app/shared/logo-page/logo-page.page';
import { AuthService } from 'src/app/auth/auth.service';
import { CartService } from 'src/app/cart/cart.service';
import { FailurePage } from '../failure/failure.page';
import { TimerPage } from 'src/app/shared/timer/timer.page';

interface Order {
  masa: number,
  productCount: number,
  total: number,
  products: OrderProduct[]
}

interface OrderProduct {
  name: string,
  quantity: number,
  price: number,
  total: number,
}


@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, LogoPagePage, FailurePage, TimerPage]
})



export class SuccessPage implements OnInit {

  error: boolean = false;
  baseUrl: string = 'http://localhost:8080/api-true/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/api-true/';
  herokuUrl: string = 'https://www.cafetish.com/api/';
  isLoading: boolean = true;
  transactionId!: string;
  orderTime: number = 0
  cart!: Cart;
  order!: Order;
  errorMessage: string = "Ceva nu a mers cum trebuie!";
  orderNumber: number = 0


  constructor(
    private http: HttpClient,
    private authServ: AuthService,
    private crtSrv: CartService,
    ) { }

  ngOnInit() {
    this.getTuuid();
  }

  getTuuid(){
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const userId = params.get('user');
    const ucbb = params.get('ucbb');
    const ccb = params.get('ccb');
    const tuuid = params.get('t');
    const s = params.get('s');
    const lang = params.get('lang');
    const eventId = params.get('eventId');
    const eci = params.get('eci');
    if(userId && ucbb && ccb){
      this.crtSrv.checkUser(userId, +ccb, +ucbb).subscribe(res => {

        if(res.message === "User verified"){
            this.getCart();
        } else {
          this.errorMessage = 'Eroare la verificarea datelor de comandă '+res.message;
          this.error = true;
        };
      });
    } else if(tuuid && s && lang && eventId && eci) {
      Preferences.get({key: 'data'}).then((data) => {
        if(data.value){
          const parsedData = JSON.parse(data.value);
          this.crtSrv.checkUser(parsedData.userId, +parsedData.cartCashBack, +parsedData.userCashBackBefore).subscribe(res => {
            if(res.message === "User verified"){
              this.getCart();
          } else {
            this.isLoading = false
            this.errorMessage = 'Eroare la verificarea datelor de comandă '+res.message;
            this.error = true;
          };
          });
        } else {
          this.getCart();
        };
      });
    } else {
      this.isLoading = false
      this.errorMessage = 'Nu ai ce cauta aici, mergi înapoi la magazin! :)';
      this.error = true;
    };
  };


  getCart() {
    const cart = Preferences.get({ key: 'cart' }).then(res => {
      if (res.value) {
        const cartObject: Cart = JSON.parse(res.value);
        console.log(cartObject)
        this.createOrder(cartObject);
      } else { console.log('No cart Found')};
    });
  };

  createOrder(cart: Cart) {
    const cartProducts = cart.products;
    let products = [];
    for (let product of cartProducts) {
      const orderProduct = {
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        total: product.total,
      }
      products.push(orderProduct);
    }
    if(cart.userId.length){
      const order = {
        masa: cart.masa,
        toGo: cart.toGo,
        pickUp: cart.pickUp,
        productCount: cart.productCount,
        tips: cart.tips,
        totalProducts: cart.totalProducts,
        cashBack: cart.cashBack,
        total: cart.total,
        products: products,
        user: cart.userId,
      };
     return this.saveOrder(order)
    } else {
      const order = {
        masa: cart.masa,
        toGo: cart.toGo,
        pickUp: cart.pickUp,
        productCount: cart.productCount,
        tips: cart.tips,
        totalProducts: cart.totalProducts,
        cashBack: cart.cashBack,
        total: cart.total,
        products: products,
      };
      return this.saveOrder(order);
    };
  };

  saveOrder(order: Order) {
    this.http.post<any>(`${this.newUrl}save-order`, order).subscribe(res => {
      if(res.message === 'Order Saved Without a user'){
        this.getTime(res.orderId)
        this.orderNumber = res.orderIndex
        Preferences.remove({key: 'cart'});
      } else {
        console.log(res)
        this.orderNumber = res.orderIndex
        this.authServ.updateCaskBack(res.user);
        this.getTime(res.orderId)
        Preferences.remove({key: 'cart'});
        Preferences.remove({key: 'data'});
        Preferences.set({key: 'authData', value: JSON.stringify(res.user)});
        };
    });
  };

getTime(orderId: string){
  setTimeout(()=>{
    this.http.get<any>(`${this.newUrl}get-time?orderId=${orderId}`).subscribe(res => {
      this.orderTime = res.completetime / 1000 / 60
      this.isLoading = false
    })
  }, 24000)

}

}
