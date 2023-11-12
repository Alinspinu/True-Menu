import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BackOfficeService } from '../back-office.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { DatePickerPage } from 'src/app/shared/date-picker/date-picker.page';



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


  constructor(
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private backOfficeService: BackOfficeService,
  ) { }

  ngOnInit() {

  }

getDocuments(){
  this.backOfficeService.getDocsByTimeInterval(this.startDate, this.endDate).subscribe(res => {
    console.log(res)
  })
}


async pickDate(time: string){
  if(time === 'start'){
   const startDate = await this.actionSheet.openAuth(DatePickerPage)
   this.startDate = startDate
   console.log(startDate.split('T')[0])
  }else{
    const endDate = await this.actionSheet.openAuth(DatePickerPage)
    this.endDate = endDate
    console.log(endDate)
  }
}




}
