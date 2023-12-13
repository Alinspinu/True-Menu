import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take, tap } from "rxjs";
import { Ingredient } from "src/app/CRUD/add/category.model";

import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Order } from "src/app/cart/cart.model";


@Injectable({providedIn: 'root'})



export class OrdersService{
  baseUrl: string = 'http://localhost:8080/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/';


  constructor(
    private http: HttpClient,
    private afMessaging: AngularFireMessaging,
    ){
    }


    getMessage(){
       return this.afMessaging.messages.pipe(tap(res => {
        // console.log('service', res)
       }))
    }


    requestPermission() {
      this.afMessaging.requestToken
        .subscribe(token => {
          if(token){
            console.log(token)
            this.openConnection(token).subscribe(response => {
              console.log(response)
            }
            )
          }
        }
        );
    }

    getOrdersFromDb(){
      return this.http.get<Order[]>(`${this.newUrl}orders/get-order`)
    }

    openConnection(token: string){
      return this.http.get(`${this.baseUrl}message/send-msg?token=${token}`)
    }

    orderDone(id: string) {
      return this.http.get(`${this.baseUrl}orders/order-done?cmdId=${id}`)
    }

    setOrderTime(id: string, time: number){
      return this.http.get(`${this.newUrl}orders/set-order-time?orderId=${id}&time=${time}`).subscribe()
    }

    endPending(id: string){
      return this.http.get(`${this.baseUrl}orders/order-pending?id=${id}`)
    }

    getFinishedOrders(){
      return this.http.get<Order[]>(`${this.newUrl}orders/finished-orders`)
    }


    // requestPermissions() {
    //   return new Promise<string>((resolve, reject) => {
    //     if ('Notification' in window) {
    //       console.log('exist')
    //       if (Notification.permission === 'granted') {
    //         console.log('avem voie')
    //         resolve('granted');
    //       } else {
    //         Notification.requestPermission()
    //           .then((permission) => {
    //             resolve(permission);
    //           })
    //           .catch((error) => {
    //             reject(error);
    //           });
    //       }
    //     } else {
    //       reject('Notification API not available in this browser.');
    //     }
    //   });
    // }


}
