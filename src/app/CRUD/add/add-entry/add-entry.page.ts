import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { DatePickerPage } from 'src/app/shared/date-picker/date-picker.page';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { AuthService } from 'src/app/auth/auth.service';
import User from 'src/app/auth/user.model';

// interface Data {
//   ing: {
//     _id: string,
//     qty: number
//   }[],
//   mode: string,
//   ingId: string,
// }

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.page.html',
  styleUrls: ['./add-entry.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class AddEntryPage implements OnInit {
  form!: FormGroup;
  coffee: boolean = false
  date!: any
  user!: User

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private usrSrv: AuthService,
  ) { }


  ngOnInit() {
   this.setForm()
   this.getUser()
  //  console.log(this.data)
  }


  cancel(){
    triggerEscapeKeyPress()
  }

  getUser(){
    this.usrSrv.user$.subscribe(response => {
      if(response){
        response.subscribe(user => {
          if(user){
            this.user = user
          }
        })
      }
    })
  }

  setForm(){
    this.form = new FormGroup({
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      typeOfEntry: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),

    });
  }

  confirm(){
    console.log('hit function')
    if(this.form.valid && this.date){
      const entry = {
        tip: this.form.value.typeOfEntry,
        date: this.date,
        description: this.form.value.description,
        amount: this.form.value.price,
        locatie: this.user.locatie,
      }
      this.http.post(`${environment.BASE_URL}register/add-entry`, entry).subscribe(response => {
        this.modalCtrl.dismiss(response)
      })
    }
  }

  async openDateModal(){
    const response = await this.actionSheet.openAuth(DatePickerPage)
    if(response){
      this.date = response
    }

  }
  formatDate(date: any){
    return formatedDateToShow(date).split('ora')[0]
  }



}
