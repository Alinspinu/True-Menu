import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonDatetime, IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.page.html',
  styleUrls: ['./date-picker.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DatePickerPage implements OnInit {

  selectedDate!: string;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  onCancel(){
    this.modalCtrl.dismiss('cancel')
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    this.modalCtrl.dismiss(this.selectedDate);
  }
}
