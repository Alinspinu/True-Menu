import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import { HttpClient } from '@angular/common/http';

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

  baseUrl: string = 'http://localhost:8080/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/';
  form!: FormGroup;
  coffee: boolean = false


  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
  ) { }


  ngOnInit() {
   this.setForm()
  //  console.log(this.data)
  }


  cancel(){
    triggerEscapeKeyPress()
  }

  setForm(){
    this.form = new FormGroup({
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      date: new FormControl(null, {
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
    if(this.form.valid){
      const entry = {
        tip: this.form.value.typeOfEntry,
        date: this.form.value.date,
        description: this.form.value.description,
        amount: this.form.value.price,
      }
      this.http.post(`${this.newUrl}register/add-entry`, entry).subscribe(response => {
        this.modalCtrl.dismiss(response)
      })
      console.log(this.form)
    }
  }


}
