import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { DatePickerPage } from 'src/app/shared/date-picker/date-picker.page';
import { BackOfficeService } from '../back-office.service';
import { Day } from './cash-register.model';
import {CapitalizePipe} from '../../../shared/capitalize.pipe'
import { showToast } from 'src/app/shared/utils/toast-controller';
import { TabHeaderPage } from '../../tab-header/tab-header.page';

@Component({
  selector: 'app-cash-register',
  templateUrl: './cash-register.page.html',
  styleUrls: ['./cash-register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe, TabHeaderPage]
})
export class CashRegisterPage implements OnInit {

  documents: any[] = [];
  page = 1;

  date!: string
  day!: Day;
  formatedDate!: string

  constructor(
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private backOfficeSrv: BackOfficeService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    // this.getDateNow()
    this.loadDocuments()
  }



loadDocuments(event?: any) {
  this.backOfficeSrv.getDocuments(this.page).subscribe((response) => {
    // Append new documents to the existing list

    this.documents = [...this.documents, ...response.documents];
    console.log(this.documents)
    if (event) {
      event.target.complete();
    }
  });
}

loadMore(event: any) {
  this.page++;
  this.loadDocuments(event);
}


formatDate(inputDate: string): string {
  const date = new Date(inputDate);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear().toString();

  return `${day}.${month}.${year}`;
}

round(num: number){
  return Math.round(num * 100) / 100;
}


//   getDateNow(){
//     const date = new Date().toISOString()
//     this.getDay(date)
//   }


//  async openDatePiker(){
//    this.date = await this.actionSheet.openAuth(DatePickerPage)
//    if(this.date !== "cancel"){
//      this.getDay(this.date)
//    }
//   }


// getDay(date: string){
//   this.backOfficeSrv.fetchData(date).subscribe(response => {
//     if(response){
//       this.day = response.regPopDay
//       this.formatedDate = this.formatDate(this.day.date)
//       console.log(response, this.day)
//     }
//   }, (error) => {
//     if(error.status === 404){
//       showToast(this.toastCtrl, 'No Records Found', 4000)
//     }
//   })
// }

}
