import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BackOfficeService } from '../back-office.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { DatePickerPage } from 'src/app/shared/date-picker/date-picker.page';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import User from 'src/app/auth/user.model';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ReportsPage implements OnInit {
    documents!: any
    startDate!: string
    endDate!: string
    title: string = ''

    user!: User
    firstSub!: Subscription
    secondSub!: Subscription


  constructor(
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private backOfficeService: BackOfficeService,
    private authSrv: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getUser()
  }

  getUser(){
    this.firstSub = this.authSrv.user$.subscribe(response => {
      this.secondSub = response.subscribe(user => {
         if(user){
           this.user = user
         } else {
           this.router.navigateByUrl('/auth')
         }
       })
     })
   }


getDocuments(){
  this.backOfficeService.getDocsByTimeInterval(this.startDate, this.endDate, this.user.locatie).subscribe(response => {
    const url = window.URL.createObjectURL(response);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Registru de casa perioada ${this.formatDate(this.startDate)}--${this.formatDate(this.endDate)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  })
}


async pickDate(time: string){
  if(time === 'start'){
   const startDate = await this.actionSheet.selectDate(DatePickerPage, false)
   this.startDate = startDate
  }else{
    const endDate = await this.actionSheet.selectDate(DatePickerPage, false)
    this.endDate = endDate
}

}

formatDate(inputDate: string): string {
  const date = new Date(inputDate);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear().toString();
  return `${day}.${month}.${year}`;
}

}
