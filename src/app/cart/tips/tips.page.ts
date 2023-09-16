import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabHeaderPage } from 'src/app/content/tab-header/tab-header.page';
import { CartService } from '../cart.service';
import { triggerEscapeKeyPress } from '../../shared/utils/toast-controller';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TabHeaderPage]
})
export class TipsPage implements OnInit {
  tipsValue: number = 0

  constructor(private cartSrv: CartService) { }

  addTips(){
    this.cartSrv.addTips(this.tipsValue);
    triggerEscapeKeyPress();
  }
  triggerEscape(){
    triggerEscapeKeyPress();
  }


  ngOnInit() {
  }

}
