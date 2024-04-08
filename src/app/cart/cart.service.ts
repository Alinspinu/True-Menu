import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";
import { ToastController } from "@ionic/angular";
import { BehaviorSubject,  from,  map,  Observable} from "rxjs";
import { environment } from "src/environments/environment";
import { showToast } from "../shared/utils/toast-controller";
import { Cart, CartProduct, Topping } from "./cart.model";

interface cash{
  message: string,
  userId: string,
  userCashBackBefore: number,
  cartCashBack: number,
}


@Injectable({providedIn: 'root'})

export class CartService{

  private cartState!: BehaviorSubject<Cart>;
  public cartSend$!: Observable<Cart>;
  emptyCart: Cart = {
    _id: '',
    total: 0,
    products: [],
    masa: 0,
    cashBack: 0,
    productCount: 0,
    tips: 0,
    totalProducts: 0,
    userId: '',
    toGo: false,
    pickUp: false,
    userName: '',
    userTel: '',
    preOrderPickUpDate: '',
    discount: 0,
  };
  cart: Cart = this.emptyCart;


  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    ){
    this.cartState = new BehaviorSubject<Cart>(this.emptyCart);
    this.cartSend$ = this.cartState.asObservable();
  };


  saveCartProduct(product: CartProduct){
    const orderType = this.cart.products[0]
    if(orderType){
      if(product.preOrder === orderType.preOrder){
        this.cart.productCount++
        const existingProduct = this.cart.products.find((p: CartProduct) =>(p.name === product.name) && this.arraysAreEqual(p.toppings, product.toppings));
        if (existingProduct) {
          existingProduct.quantity = product.quantity + existingProduct.quantity;
          existingProduct.total = (existingProduct.quantity) * existingProduct.price;
          existingProduct.discount += product.discount;
        } else {
          this.cart.products.push(product);
        }
        this.cartState.next(this.cart);
      } else{
        showToast(this.toastCtrl, 'Nu poti avea pe o nota produse date spre precomandă și produse din meniu! Dă două comenzi diferite!', 5000)
      }
    } else {
      console.log(this.cart.products[0])
      this.cart.productCount++
      const existingProduct = this.cart.products.find((p: CartProduct) =>(p.name === product.name) && this.arraysAreEqual(p.toppings, product.toppings));
      if (existingProduct) {
        existingProduct.quantity = product.quantity + existingProduct.quantity;
        existingProduct.total = (existingProduct.quantity) * existingProduct.price;
      } else {
        this.cart.products.push(product);
      }
      this.cartState.next(this.cart);

    }
  };

  removeCartProd(product: CartProduct){
    this.cart.productCount--
    const productIndex = this.cart.products.findIndex((p: CartProduct) => p.name === product.name);
    this.redOne(productIndex)
  }

  removeAmbalaj(product: CartProduct){
    const productIndex = this.cart.products.findIndex((p: CartProduct) => p.name === product.name);
    console.log(this.cart.productCount)
    this.removeProduct(productIndex, product.quantity)
  }

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

checkAvailable(subId: string[], prodId: string[], toppings: string[]){
  return this.http.post<{message: string}>(`${environment.BASE_URL}product/check-product`,{subProdId: subId, prodId: prodId, toppings: toppings, loc: environment.LOC});
};

getToken(total: number) {
return this.http.get<{orderCode: string}>(`${environment.BASE_URL}pay/get-token?total=${total}`);
};


checkUserCashBack(cashBack: number, userId: string, cartTotal: number){
  const body = {
    cartCashBack: cashBack,
    userId: userId,
    cartTotal: cartTotal,
  }
  return this.http.post<cash>(`${environment.BASE_URL}pay/check-cash`, body);
};

checkUser(userId: string, ccb: number, ucbb: number) {
  return this.http.get<{message: string}>(`${environment.BASE_URL}pay/check-user?user=${userId}&ucbb=${ucbb}&ccb=${ccb}`);
};

updateCashBack(cash: number){
  this.cart.cashBack = this.cart.cashBack + cash;
  this.cartState.next(this.cart);
}

addTips(tips: number){
  this.cart.tips = tips;
  this.cartState.next(this.cart);
};


arraysAreEqual = (arr1: Topping[], arr2: Topping[]) => arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);

};


