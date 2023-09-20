import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { Category, Product } from '../category.model';
import { HttpClient } from '@angular/common/http';
import { TabsService } from 'src/app/tabs/tabs.service';
import {showToast} from '../../../shared/utils/toast-controller'

interface Response{
  message: string,

}

@Component({
  selector: 'app-add-ingredient',
  templateUrl: './add-ingredient.page.html',
  styleUrls: ['./add-ingredient.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddIngredientPage implements OnInit {
  baseUrl: string = 'http://localhost:8080/nutrition/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/nutrition/';
  isLoading = false;
  category!: Category;
  form!: FormGroup;


  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private tabSrv: TabsService
  ) {
  }

  ngOnInit() {
    this.setupForm();
  };

  setupForm() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      labelInfo: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      allergens: new FormControl(null, {
        updateOn: 'change',
      }),
      kcal: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      allFat: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      satAcids: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      allCarbs: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      sugars: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      salt: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      additives: new FormControl(null, {
        updateOn: 'change',
      }),
      protein: new FormControl(null, {
        updateOn: 'change',
      }),
      image: new FormControl(null),
    });
  };




  confirm(){
    this.isLoading = true;
    if(this.form.valid){
      const allergens = this.form.value.allergens.split('/').map((word: string) => ({name: word}))
      const additives = this.form.value.additives.split('/').map((word: string) => ({name: word}))

      const data = {
        name: this.form.value.name,
        labelInfo: this.form.value.labelInfo,
        allergens: allergens,
        additives: additives,
        energy: {
          kJ: Math.round((this.form.value.kcal * 4.184) *100) /100 ,
          kcal: this.form.value.kcal
        },
        fat: {
          all: this.form.value.allFat,
          sat: this.form.value.satAcids
        },
        carbs: {
          all: this.form.value.allCarbs,
          sugar: this.form.value.sugars
        },
        salts: this.form.value.salt,
        protein: this.form.value.protein
      }
      return this.http.post<Response>(`${this.baseUrl}ing-add`, data).subscribe((res)=>{
        showToast(this.toastCtrl, res.message, 3000);
        this.form.reset()
        this.isLoading = false;

      });
    } else{
      this.isLoading = false;
      return
    }
  }


  cancel(){
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
