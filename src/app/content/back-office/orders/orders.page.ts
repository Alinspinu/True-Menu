import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrdersService } from './ordes.service';
import { Order } from 'src/app/cart/cart.model';
import { TabHeaderPage } from '../../tab-header/tab-header.page';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TabHeaderPage]
})
export class OrdersPage implements OnInit, OnDestroy {

  emptyOrder: Order = {
    _id: '',
    total: 0,
    products: [],
    masa: 0,
    cashBack: 0,
    productCount: 0,
    tips: 0,
    totalProducts: 0,
    toGo: false,
    pickUp: false,
    userName: '',
    userTel: '',
    cif: '',
    payOnline: false,
    payOnSite: false,
    paymentMethod: '',
    completetime: 0,
    discount: 0,
    status: '',
    masaRest: {_id: '', index: 0, bills:[]}
  };
  orderArr: Order[] = []
  order: Order = this.emptyOrder;
  notification!: any
  orderSub!: Subscription
  private audioPlayer!: HTMLAudioElement;

  constructor(
   @Inject(OrdersService) private ordersSrv: OrdersService
  ) {
    this.audioPlayer = new Audio('/assets/audio/ding.mp3')
  }



  ngOnInit() {
    this.ordersSrv.requestPermission()
    this.getOrder()
  }


  getBackGroundNot(){
    // In your Angular component
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', event => {
          // Handle the incoming data
          console.log(event.data);
      });
  }

  }

  ngOnDestroy(): void {
    if(this.orderSub){
      this.orderSub.unsubscribe()
    }
  }

  getOrder(){
   this.orderSub = this.ordersSrv.getMessage().subscribe((message: any) => {
      this.audioPlayer.play()
      this.order = JSON.parse(message.data.data)
      if(message.notification && message.notification.title){
        this.notification = {
          body: message.notification.body,
          icon: message.notification.image,
        }
        new Notification(message.notification.title, this.notification)
      }
      if(this.order.status.length){
        this.orderArr.push(this.order)
        console.log(this.orderArr)
      }
    })
  }



}
