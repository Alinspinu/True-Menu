import { Injectable } from '@angular/core';
// import { io } from 'socket.io-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebRTCService {
  private socket: any;
  private getUpdatedOrderIdSubject = new Subject<any>();
  constructor() {
    // this.socket = io('https://live669-0bac3349fa62.herokuapp.com');

    // this.socket.on('updatedOrderId', (data: any) => {
    //   console.log(data)
    //   this.getUpdatedOrderIdSubject.next(data);
    // });
  }

  sendOrderId(data: any) {
    this.socket.emit('orderId', data);
  }


  getUpdatedOrderId(){
    return this.getUpdatedOrderIdSubject.asObservable();
  }


}
