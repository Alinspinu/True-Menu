import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabHeaderPage } from '../../tab-header/tab-header.page';
import { CapitalizePipe } from 'src/app/shared/capitalize.pipe';
import { Order } from 'src/app/cart/cart.model';
import { OrdersService } from '../orders/ordes.service';


@Component({
  selector: 'app-finshed-orders',
  templateUrl: './finshed-orders.page.html',
  styleUrls: ['./finshed-orders.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TabHeaderPage, CapitalizePipe]
})
export class FinshedOrdersPage implements OnInit {

  orderArr: Order[] = []

  constructor(
    private orderSrv: OrdersService
  ) { }

  ngOnInit() {
    this.getOrders()
  }

  showOrder(index: number){
    const order = this.orderArr[index]
    order.show ? order.show = false : order.show = true
  }

  getOrders(){
    this.orderSrv.getFinishedOrders().subscribe(response => {
      this.orderArr = response
      console.log(this.orderArr)
    }
    )
  }

  getHours(timestamp: string){
    let date = new Date(timestamp);
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`
    }
}
