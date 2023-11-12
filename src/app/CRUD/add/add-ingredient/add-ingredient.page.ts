import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { Category, Ingredient, Product } from '../category.model';
import { HttpClient } from '@angular/common/http';
import { TabsService } from 'src/app/tabs/tabs.service';
import {showToast, triggerEscapeKeyPress} from '../../../shared/utils/toast-controller'
import { RecipeIngredientService } from '../recipe-ingredient/recipe-ingredient.service';
import { Subscription } from 'rxjs';

interface Response{
  message: string,
}
interface Data{
  ing: {
    _id: string,
    qty: number
  }[],
  mode: string
  ingId: string
}

@Component({
  selector: 'app-add-ingredient',
  templateUrl: './add-ingredient.page.html',
  styleUrls: ['./add-ingredient.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddIngredientPage implements OnInit, OnDestroy {

  @Input() data!: Data
  baseUrl: string = 'http://localhost:8080/nutrition/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/nutrition/';
  isLoading = false;
  ingredientSub!: Subscription
  category!: Category;
  form!: FormGroup;
  onEdit: boolean = false
  title: string = "Add Ingredient"
  ingredient!: Ingredient;


  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private ingSrv: RecipeIngredientService,
    private tabSrv: TabsService
  ) {
  }

  ngOnInit() {
    this.setMode()
    this.setupForm();
    console.log(this.ingredient)
  };

  ngOnDestroy(): void {
    if(this.ingredientSub){
      this.ingredientSub.unsubscribe()
    }
  }
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
    });
    if(this.data.mode === "on-edit"){
      const additives = this.ingredient.additives.map(obj => obj.name).join('/')
      const allergens = this.ingredient.allergens.map(obj => obj.name).join('/')
    this.form.get('name')?.setValue(this.ingredient.name);
    this.form.get('labelInfo')?.setValue(this.ingredient.labelInfo);
    this.form.get('additives')?.setValue(additives);
    this.form.get('allergens')?.setValue(allergens);
    this.form.get('kcal')?.setValue(this.ingredient.energy.kcal);
    this.form.get('allFat')?.setValue(this.ingredient.fat.all);
    this.form.get('satAcids')?.setValue(this.ingredient.fat.satAcids);
    this.form.get('allCarbs')?.setValue(this.ingredient.carbs.all);
    this.form.get('sugars')?.setValue(this.ingredient.carbs.sugar);
    this.form.get('salt')?.setValue(this.ingredient.salts);
    this.form.get('protein')?.setValue(this.ingredient.protein);
    }
  };

  setMode(){
    if(this.data.mode === 'on-edit'){
      this.onEdit = true
      this.title = "Edit Ingredient"
      this.getIngredient()
    }
  }

  getIngredient(){
   this.ingredientSub =  this.ingSrv.ingSend$.subscribe(response => {
      const ingIndex = response.findIndex(obj=>obj._id === this.data.ingId)
      this.ingredient = response[ingIndex]
    })
  }

  confirm(){
    this.isLoading = true;
    if(this.form.valid){
      if(!this.form.value.allergens){
        this.form.value.allergens = '';
      }
      if(!this.form.value.additives){
        this.form.value.additives = '';
      }
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
          satAcids: this.form.value.satAcids
        },
        carbs: {
          all: this.form.value.allCarbs,
          sugar: this.form.value.sugars
        },
        salts: this.form.value.salt,
        protein: this.form.value.protein
      }
      if(this.data.mode === "on-edit"){
        return this.http.put<Response>(`${this.newUrl}ing-add?id=${this.data.ingId}`, data).subscribe(response => {
          showToast(this.toastCtrl, response.message, 3000);
          this.isLoading = false;
          this.cancel()
        })
      } else {
        return this.http.post<Response>(`${this.newUrl}ing-add`, data).subscribe((res)=>{
          showToast(this.toastCtrl, res.message, 3000);
          this.form.reset()
          this.isLoading = false;
        });
      }
    } else{
      this.isLoading = false;
      return
    }
  }


  cancel(){
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
