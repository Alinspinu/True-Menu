import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";
import { BehaviorSubject,  from,  map,  Observable} from "rxjs";
import { TabsService } from "../tabs/tabs.service";
import { Cart, CartProduct } from "./cart.model";

interface cash{
  message: string,
  userId: string,
  userCashBackBefore: number,
  cartCashBack: number,
}


@Injectable({providedIn: 'root'})

export class CartService{
  baseUrl: string = 'http://localhost:8080/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/';

  private cartState!: BehaviorSubject<Cart>;
  public cartSend$!: Observable<Cart>;
  emptyCart: Cart = {_id: '', total: 0, products: [], masa: 0, cashBack: 0, productCount: 0, tips: 0, totalProducts: 0, userId: '', toGo: false, pickUp: false};
  cart: Cart = this.emptyCart;


  constructor(
    private http: HttpClient,
    private tabsSrv: TabsService,
    ){
    this.cartState = new BehaviorSubject<Cart>(this.emptyCart);
    this.cartSend$ = this.cartState.asObservable();
  };


  saveCartProduct(product: CartProduct){
    this.cart.productCount++
    const existingProduct = this.cart.products.find((p: CartProduct) => p.name === product.name);
    if (existingProduct) {
      existingProduct.quantity = product.quantity + existingProduct.quantity;
      existingProduct.total = (existingProduct.quantity) * existingProduct.price;
    } else {
      this.cart.products.push(product);
    }
    this.cartState.next(this.cart);
  };

  get cart$(){
  return from(Preferences.get({key: 'cart'})).pipe(map(data=> {
    if(data.value){
      const cart = JSON.parse(data.value);
      this.cart = cart;
      this.cartState.next(this.cart);
      return this.cartState.asObservable();
    } else {
      this.cartState.next(this.cart);
      return this.cartState.asObservable();
    };
  }));
  };

  removeCart(){
    Preferences.remove({key: 'cart'});
    this.cartState.next(this.emptyCart);
    this.cart = this.emptyCart;
  }

  addOne(index: number){
    this.cart.products[index].quantity++;
    this.cart.productCount++;
    this.cart.products[index].total = this.cart.products[index].quantity * this.cart.products[index].price;
    this.cartState.next(this.cart);
  }

  redOne(index: number){
    this.cart.products[index].quantity--;
    this.cart.productCount--;
    this.cart.products[index].total = this.cart.products[index].quantity * this.cart.products[index].price;
    if(this.cart.products[index].quantity === 0) {
      this.cart.products.splice(index, 1);
    };
    if(this.cart.productCount === 0){
      Preferences.remove({key: 'cart'})
    }
    this.cartState.next(this.cart);
  };

  removeProduct(index: number, qty: number){
    this.cart.products.splice(index, 1);
    this.cart.productCount = this.cart.productCount - qty;
    if(this.cart.productCount === 0){
      Preferences.remove({key: 'cart'})
    }
    this.cartState.next(this.cart);
};

checkAvailable(subId: string[], prodId: string[]){
  return this.http.post<{message: string}>(`${this.newUrl}api-true/check-product`,{subProdId: subId, prodId: prodId});
};

getToken(total: number) {
return this.http.get<{orderCode: string}>(`${this.newUrl}pay/get-token?total=${total}`);
};


checkUserCashBack(cashBack: number, userId: string, cartTotal: number){
  const body = {
    cartCashBack: cashBack,
    userId: userId,
    cartTotal: cartTotal,
  }
  return this.http.post<cash>(`${this.newUrl}pay/check-cash`, body);
};

checkUser(userId: string, ccb: number, ucbb: number) {
  return this.http.get<{message: string}>(`${this.newUrl}pay/check-user?user=${userId}&ucbb=${ucbb}&ccb=${ccb}`);
};

updateCashBack(cash: number){
  this.cart.cashBack = this.cart.cashBack + cash;
  this.cartState.next(this.cart);
}

addTips(tips: number){
  this.cart.tips = tips;
  this.cartState.next(this.cart);
  console.log(this.cart)
};

};


