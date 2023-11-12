import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ProductContentService } from 'src/app/content/product-content/product-content.service';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';

@Component({
  selector: 'app-black-list',
  templateUrl: './black-list.page.html',
  styleUrls: ['./black-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class BlackListPage implements OnInit {

  topping: string = ''
  toppingsList: string[] =[];
  listToShow: string[] = [];

  baseUrl: string = 'http://localhost:8080/api-true/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/api-true/';

  constructor(
    private prodServ: ProductContentService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.prodServ.fetchBlackList().subscribe(res=> {
      this.toppingsList = res
    })
  }



  update(){
    const listToSend = this.toppingsList.map(str => str.trim().replace(/\s+/g, '').toLowerCase())
    this.modalCtrl.dismiss(listToSend)
  }

  removeTopping(i: number){
    this.toppingsList.splice(i, 1)
  }

  addToList(){
    if(this.topping.length){
      this.toppingsList.push(this.topping);
      this.topping = '';
    }
  }




}
