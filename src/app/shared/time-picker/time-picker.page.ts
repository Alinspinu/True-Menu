import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.page.html',
  styleUrls: ['./time-picker.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TimePickerPage implements OnInit {

    time: number[] = [5,10,15,20,25,30,35,40]
  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  pickTime(time: number){
    this.modalCtrl.dismiss(time * 60 * 1000 )
  }

}
