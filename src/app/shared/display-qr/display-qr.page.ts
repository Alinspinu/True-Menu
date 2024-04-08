import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { CapitalizePipe } from '../capitalize.pipe';

@Component({
  selector: 'app-display-qr',
  templateUrl: './display-qr.page.html',
  styleUrls: ['./display-qr.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class DisplayQrPage implements OnInit {

  data!: any

  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController
  ) { }


  close(){
    this.modalCtrl.dismiss()
  }


  ngOnInit() {
    this.data = this.navPar.get('data')
  }

}
