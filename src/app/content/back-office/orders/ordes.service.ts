import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take, tap } from "rxjs";
import { Ingredient } from "src/app/CRUD/add/category.model";

import { AngularFireMessaging } from '@angular/fire/compat/messaging';


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
        console.log('service', res)
       }))
    }

    getMsg(){
      this.afMessaging.onMessage(function(payload){
        console.log(payload)
      })
    }

    requestPermission() {
      this.afMessaging.requestToken
        .subscribe(token => {
          if(token){
            this.openConnection(token).subscribe()
          }
        }
        );
    }

    openConnection(token: string){
      return this.http.get(`${this.baseUrl}message/send-msg?token=${token}`)
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
