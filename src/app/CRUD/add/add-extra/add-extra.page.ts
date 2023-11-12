import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';

interface Data {
  ing: {
    _id: string,
    qty: number
  }[],
  mode: string,
  ingId: string,
  prodData: {_id: string, index: number}
}

@Component({
  selector: 'app-add-extra',
  templateUrl: './add-extra.page.html',
  styleUrls: ['./add-extra.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class AddExtraPage implements OnInit {

  @Input() data!: Data
  baseUrl: string = 'http://localhost:8080/api-true/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/api-true/';
  form!: FormGroup;
  coffee: boolean = false
  constructor(
    private modalCtrl: ModalController,
  ) { }


  ngOnInit() {
   this.setForm()
   console.log(this.data)
  }




  cancel(){
    triggerEscapeKeyPress()
  }

  setForm(){
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      qty: new FormControl(null, {
        updateOn: 'change',
      }),
      um: new FormControl(null, {
        updateOn: 'change',
      }),

    });
  }

  confirm(){
    const topping = {
      name: this.form.value.name,
      price: this.form.value.price,
      qty: this.form.value.qty,
      um: this.form.value.um,
    }
    console.log(topping)
    this.modalCtrl.dismiss({topping: topping})
  }

}
