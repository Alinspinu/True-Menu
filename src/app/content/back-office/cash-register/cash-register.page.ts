import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
import { AuthService } from 'src/app/auth/auth.service';
import User from 'src/app/auth/user.model';
import { Router } from '@angular/router';
import {  Subscription } from 'rxjs';

@Component({
  selector: 'app-cash-register',
  templateUrl: './cash-register.page.html',
  styleUrls: ['./cash-register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe, TabHeaderPage]
})
export class CashRegisterPage implements OnInit, OnDestroy {

  documents: any[] = [];
  page = 1;

  date!: string
  day!: Day;
  formatedDate!: string
  user!: User
  firstSub!: Subscription
  secondSub!: Subscription

  constructor(
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private backOfficeSrv: BackOfficeService,
    private toastCtrl: ToastController,
    private authSrv: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    // this.getDateNow()
    this.getUser()
  }

  ngOnDestroy(): void {
    if(this.firstSub){
      this.firstSub.unsubscribe()
    }
    if(this.secondSub) {
      this.secondSub.unsubscribe()
    }
  }

  reciveEntry(ev: any){
    console.log(ev)
    const dayIndex = this.documents.findIndex(el => el.date === ev.date)
    this.documents[dayIndex] = ev
  }


  getUser(){
   this.firstSub = this.authSrv.user$.subscribe(response => {
     this.secondSub = response.subscribe(user => {
        if(user){
          this.user = user
          this.loadDocuments()
        } else {
          this.router.navigateByUrl('/auth')
        }
      })
    })
  }


loadDocuments(event?: any) {
  this.backOfficeSrv.getDocuments(this.page, this.user.locatie).subscribe((response) => {
    // Append new documents to the existing list
    this.documents = [...this.documents, ...response.documents];
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

deleteEntry(id: string, index: number, dayIndex: number){
  const dateToCompare = new Date().setUTCHours(0,0,0,0)
  const day = this.documents[dayIndex];
  const dayDate = new Date(day.date).setUTCHours(0,0,0,0)
  if(dayDate === dateToCompare){
    this.backOfficeSrv.deleteEntry(id).subscribe(response => {
      showToast(this.toastCtrl, response.message, 3000);
      const entry = day.entry[index];
      day.cashOut = day.cashOut - entry.amount
      day.entry.splice(index, 1);
    })
  } else {
    showToast(this.toastCtrl, 'Poți șterge doar intrările din ziua curentă!', 4000)
  }
}

round(num: number){
  return Math.round(num * 100) / 100;
}

}
