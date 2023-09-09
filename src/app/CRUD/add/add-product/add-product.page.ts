import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { ImagePickerComponent } from '../../../shared/image-picker/image-picker.component';
import { base64toBlob } from '../../../shared/utils/base64toBlob';
import { Category, Product } from '../category.model';
import { HttpClient } from '@angular/common/http';
import { TabsService } from 'src/app/tabs/tabs.service';
import { LogoPagePage } from 'src/app/shared/logo-page/logo-page.page';
import {showToast} from '../../../shared/utils/toast-controller'

interface Response{
  message: string,
  product: Product
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, ImagePickerComponent, FormsModule, LogoPagePage ]
})
export class AddProductPage implements OnInit {

  dynamicControlKeys: {name: string, price: string}[] = [];
  dynamicInputCounter: number = 1;
  currentCategory!: string;
  baseUrl: string = 'http://localhost:8080/api-true/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/api-true/';
  isLoading = false;
  category!: Category;
  form!: FormGroup;
  product: Product;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private http: HttpClient,
    private tabSrv: TabsService
  ) {
    this.product = this.navParams.get('product');
  }

  ngOnInit() {
    this.getCurrentTab();
    this.setupForm();
  };

  setupForm() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
        qty: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      order: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      longDescription: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      allergens: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      kJ: new FormControl(null, {
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
        validators: [Validators.required]
      }),
      image: new FormControl(null),
    });
  };



  getCurrentTab() {
    const currentTab = window.location.href;
    const indexTab = currentTab.lastIndexOf('/');
    const tab = currentTab.slice(indexTab +1);
    return this.currentCategory = tab;
  }

  confirm(){
    this.isLoading = true;
    if(this.form.valid){
      const nutrition = {
        energy: {
          kJ: this.form.value.kJ,
          kcal: Math.round((this.form.value.kJ / 4.184) * 100)/100
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
        additives: this.form.value.additives
      }
      const allergens = this.form.value.allergens.split('/').map((word: string) => ({name: word}))
      const prodData = new FormData();
      prodData.append('price', this.form.value.price);
      prodData.append('name', this.form.value.name);
      prodData.append('qty', this.form.value.qty);
      prodData.append('image', this.form.value.image);
      prodData.append('order', this.form.value.order);
      prodData.append('category', this.currentCategory);
      prodData.append('description', this.form.value.description);
      prodData.append('longDescription', this.form.value.longDescription);
      prodData.append('strNutrition',  JSON.stringify(nutrition));
      prodData.append('strAllergens', JSON.stringify(allergens));
      return this.http.post<Response>(`${this.baseUrl}prod-add`, prodData).subscribe((res)=>{
        this.tabSrv.onProductAdd(res.product);
        showToast(this.toastCtrl, res.message, 3000);
        this.isLoading = false;
        return this.cancel();
      });
    } else{
      this.isLoading = false;
      return this.cancel();
    }
  }


  cancel(){
    return this.modalCtrl.dismiss(null, 'cancel');
  }


  onImagePicked(imageData: string | File){
    let imageFile;
    if(typeof imageData === 'string'){
      try{
        imageFile = base64toBlob(
          imageData.replace(/^data:image\/(png|jpe?g|gif|webp);base64,/, ''),
          'image/jpeg'
          );
          console.log()
      } catch (error) {
        console.log(error);
      };
    } else {
      imageFile = imageData;
    };
    this.form.patchValue({image: imageFile});
  }


}

