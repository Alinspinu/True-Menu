import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences'
import { Cart } from 'src/app/cart/cart.model';
import { HttpClient } from '@angular/common/http';
import { LogoPagePage } from 'src/app/shared/logo-page/logo-page.page';
import { AuthService } from 'src/app/auth/auth.service';
import { CartService } from 'src/app/cart/cart.service';
import { FailurePage } from '../failure/failure.page';
import { TimerPage } from 'src/app/shared/timer/timer.page';
import { environment } from 'src/environments/environment';
import { WebRTCService } from 'src/app/shared/webRTC.service';

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

  isLoading: boolean = true;
  transactionId!: string;
  orderTime: number = 0
  cart!: Cart;
  order!: Order;
  errorMessage: string = "Ceva nu a mers cum trebuie!";
  orderNumber: number = 0;
  payOnSite: boolean = false;
  payOnline: boolean = false;
  onlineOrder: boolean = true
  preOrder: boolean = false;
  pickUpDate: string = ''
  production: boolean = true

  constructor(
    private http: HttpClient,
    private authServ: AuthService,
    private crtSrv: CartService,
    private webRTC: WebRTCService,
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
    const payOnSite = params.get('pay-on');
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
              this.payOnline = true
              this.getCart();
          } else {
            this.isLoading = false
            this.errorMessage = 'Eroare la verificarea datelor de comandă '+res.message;
            this.error = true;
          };
          });
        } else {
          this.payOnline = true
          this.getCart();
        };
      });
    } else if(userId && payOnSite === userId){
      this.payOnSite = true
      this.getCart()
    } else {
      // this.getCart();
      // this.payOnline = true
      this.isLoading = false
      this.errorMessage = 'Nu ai ce cauta aici, mergi înapoi la magazin! :)';
      this.error = true;
    };
  };


  getCart() {
    const cart = Preferences.get({ key: 'cart' }).then(res => {
      if (res.value) {
        const cartObject: Cart = JSON.parse(res.value);
        this.preOrder = cartObject.products[0].preOrder
        this.createOrder(cartObject);
      } else { console.log('No cart Found')};
    });
  };

  createOrder(cart: Cart) {
    const cartProducts = cart.products;
    this.production = cart.products[0].preOrder
    let products = [];
    if(cart.userId.length){
      const order = {
        masa: 54,
        name: cart.userName,
        production: this.production,
        toGo: cart.toGo,
        pickUp: cart.pickUp,
        productCount: cart.productCount,
        tips: cart.tips,
        totalProducts: cart.totalProducts,
        cashBack: cart.cashBack,
        total: cart.total,
        products: cart.products,
        user: cart.userId,
        payOnSite: this.payOnSite,
        payOnline: this.payOnline,
        onlineOrder: this.onlineOrder,
        locatie: environment.LOC,
        clientInfo: {
          name: cart.userName,
          telephone: cart.userTel,
          userId: cart.userId
        },
        payment: {
          cash: 0,
          card: 0,
          viva: 0,
          voucher: 0,
          online: 0,
        },
        discount: cart.discount,
        preOrderPickUpDate: cart.preOrderPickUpDate,
        preOrder: true
      };
     return this.saveOrder(order)
    } else {
      const order = {
        masa: 54,
        name: 'Neînregistrat',
        production: this.production,
        toGo: cart.toGo,
        pickUp: cart.pickUp,
        productCount: cart.productCount,
        tips: cart.tips,
        user: 'john doe',
        onlineOrder: this.onlineOrder,
        totalProducts: cart.totalProducts,
        cashBack: cart.cashBack,
        total: cart.total,
        products: cart.products,
        payOnSite: this.payOnSite,
        payOnline: this.payOnline,
        locatie: environment.LOC,
        clientInfo: {
          name: 'Neînregistrat',
          telephone: 'Neînregistrat',
        },
        payment: {
          cash: 0,
          card: 0,
          viva: 0,
          voucher: 0,
          online: 0,
        },
        discount: cart.discount,
        preOrderPickUpDate: cart.preOrderPickUpDate,
        preOrder: true
      };
      return this.saveOrder(order);
    };
  };

  saveOrder(order: any) {
    this.http.post<any>(`${environment.BASE_URL}orders/save-order`, {order, adminEmail: environment.ADMIN_EMAIL, loc: environment.LOC}).subscribe(res => {
      if(res.message === 'Order Saved Without a user'){
        this.getTime(res.orderId)
        this.pickUpDate = this.formatedDateToShow(res.preOrderPickUpDate)
        this.orderNumber = res.orderIndex
        this.webRTC.sendOrderId(res.orderId)
        Preferences.remove({key: 'cart'});
      } else {
        this.pickUpDate = this.formatedDateToShow(res.preOrderPickUpDate)
        this.orderNumber = res.orderIndex
        this.authServ.updateCaskBack(res.user);
        this.webRTC.sendOrderId(res.orderId)
        this.getTime(res.orderId)
        Preferences.remove({key: 'cart'});
        Preferences.remove({key: 'data'});
        Preferences.set({key: 'authData', value: JSON.stringify(res.user)});
        };
    });
  };

getTime(orderId: string){
  if(!this.preOrder){
    setTimeout(()=>{
      this.http.get<any>(`${environment.BASE_URL}orders/get-time?orderId=${orderId}`).subscribe(res => {
        this.orderTime = res.completetime / 1000 / 60
        this.isLoading = false
      })
    }, 24000)
  } else{
    this.isLoading = false
  }
}

formatedDateToShow(date: string){
  if(date.length){
    const inputDate = new Date(date);
    const monthNames = [
      "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
      "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
    ];
    return `${inputDate.getDate().toString().padStart(2, '0')}-${monthNames[inputDate.getMonth()]}-${inputDate.getFullYear()}`
  } else {
    return ''
  }
  }

}
