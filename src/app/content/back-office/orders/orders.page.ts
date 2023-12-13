import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrdersService } from './ordes.service';
import { Order } from 'src/app/cart/cart.model';
import { TabHeaderPage } from '../../tab-header/tab-header.page';
import { Subscription } from 'rxjs';
import { CapitalizePipe } from 'src/app/shared/capitalize.pipe';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { TimePickerPage } from 'src/app/shared/time-picker/time-picker.page';
import { emptyOrder } from './empty-order';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TabHeaderPage, CapitalizePipe]
})
export class OrdersPage implements OnInit, OnDestroy {

  intervalId!: any
  endTime: string = ''
  orderArr: Order[] = []
  order: Order = emptyOrder;
  notification!: any
  orderSub!: Subscription
  private audioPlayer!: HTMLAudioElement;

  constructor(
   @Inject(OrdersService) private ordersSrv: OrdersService,
   @Inject(ActionSheetService) private actionSheet: ActionSheetService,
  ) {
    this.audioPlayer = new Audio('/assets/audio/ding.mp3')
  }



  ngOnInit() {
    this.ordersSrv.requestPermission()
    this.getOrder()
    this.getOrdersAtRefresh()
  }


 getOrdersAtRefresh(){
  this.ordersSrv.getOrdersFromDb().subscribe(response => {
    this.orderArr = response
  })
 }


  ngOnDestroy(): void {
    if(this.orderSub){
      this.orderSub.unsubscribe()
    }
  }


  showOrder(index: number){
    const order = this.orderArr[index]
    order.show ? order.show = false : order.show = true
  }

  getOrder(){
   this.orderSub = this.ordersSrv.getMessage().subscribe((message: any) => {
    console.log(message)
      this.audioPlayer.play()
      this.order = JSON.parse(message.data.data)
      this.order.show = true
      if(message.notification && message.notification.title){
        this.notification = {
          body: message.notification.body,
          icon: message.notification.image,
        }
        new Notification(message.notification.title, this.notification)
      }
      if(this.order.status.length){
        // console.log('inside get Order', this.order)
        // console.log('inside get OrderArr', this.orderArr)
        this.orderArr.push(this.order)
        this.intervalId = setInterval(() => {
          this.order.pending = false
          setTimeout(() => {
              this.order.pending = true
            }, 1000); // Hide the div after 1 second
        }, 1500);
          this.audioPlayer.play();
          this.audioPlayer.addEventListener('ended', () => {
              this.audioPlayer.currentTime = 0;
              this.audioPlayer.play();
          });


        //   let hitOnTime = true;
        // setTimeout(()=>{
        //     hitOnTime = false
        //     console.log('inside timeout', hitOnTime)
        // }, 18000)
      }
    })
  }





  getHours(timestamp: string){
  let date = new Date(timestamp);
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`
  }



  calcEndTime(startTime: any, givenTime: any) {
    const endTimeMiliseconds = new Date(startTime).getTime() + givenTime
    const date = new Date(endTimeMiliseconds)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const endTime = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
    return endTime;
}



  async giveTime(orderIndex: number){
    clearInterval(this.intervalId)
    this.audioPlayer.pause();
    let order = this.orderArr[orderIndex];
    console.log('order completeTime', order.completetime)
      if(order.completetime !== 2){
        order = this.calcTimeToSend(order);
      }
    if(order.completetime === 0){
      order.completetime = await this.actionSheet.openAuth(TimePickerPage);
      order.endTime = this.calcEndTime(order.createdAt, order.completetime);
      this.ordersSrv.setOrderTime(order._id, order.completetime);
      order.pending = false;
    } else if( order.completetime > 1){
      this.ordersSrv.orderDone(order._id).subscribe(response => {
        console.log(response)
      });
      this.orderArr.splice(orderIndex, 1);
    } else{
      order.endTime = this.calcEndTime(order.createdAt, order.completetime);
      this.ordersSrv.endPending(order._id).subscribe(response => {
        console.log(response)
      });
      order.completetime = 2;
      order.pending = false;
  }
  }

  calcTimeToSend(order: Order){
    const savedTime = new Date(order.createdAt).getTime();
    const endTime = new Date(Date.now()).getTime();
    if((endTime - savedTime) > 18000){
      order.completetime = 1;
    };
    return order;
  };


   animation(order: Order){
     //SET INTERVAL FOR ANIMATION
     const intervalId = setInterval(() => {
       setTimeout(() => {
           order.pending = false
       }, 1000); // Hide the div after 1 second
      }, 1500);

    this.audioPlayer.addEventListener('ended', () => {
       this.audioPlayer.currentTime = 0;
       this.audioPlayer.play();
   });

   this.audioPlayer.play();

   let hitOnTime = true;

   setTimeout(()=>{
       hitOnTime = false
       console.log('inside timeout', hitOnTime)
   }, 18000)
   }




};

