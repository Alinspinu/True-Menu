import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { Category, Product } from '../../add/category.model';
import { ImagePickerComponent } from '../../../shared/image-picker/image-picker.component';
import { LogoPagePage } from '../../../shared/logo-page/logo-page.page';
import { base64toBlob } from '../../../shared/utils/base64toBlob';
import { showToast, triggerEscapeKeyPress } from '../../../shared/utils/toast-controller';
import { TabsService } from '../../../tabs/tabs.service';

interface RespData{
  message: string,
  product: Product
}

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, ImagePickerComponent, FormsModule, LogoPagePage]
})
export class EditProductComponent  implements OnInit {


  currentCategory!: string;
  baseUrl: string = 'http://localhost:8080/api-true/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/api-true/';
  isLoading = false;
  categories!: Category[];
  form!: FormGroup;
  product!: Product;
  productId!: string;
  categoryIndex!: number;
  prodIndex!: number;


  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private http: HttpClient,
    private tabSrv: TabsService,
  ) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.categoryIndex = +this.navParams.get('catIndex');
    this.productId = this.navParams.get('id');
    this.prodIndex = +this.navParams.get('prodIndex');
    this.getProduct();
    this.getCategories();
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
      category: new FormControl(null, {
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

      image: new FormControl(null),
    });
    this.form.get('name')?.setValue(this.product.name);
    this.form.get('price')?.setValue(this.product.price);
    this.form.get('description')?.setValue(this.product.description);
    this.form.get('qty')?.setValue(this.product.qty);
    this.form.get('category')?.setValue(this.product.category._id);
    this.form.get('order')?.setValue(this.product.order);
    this.form.get('longDescription')?.setValue(this.product.longDescription);
  };



  confirm(){
    this.isLoading = true;
    if(this.form.valid){
      const prodData = new FormData();
      prodData.append('price', this.form.value.price);
      prodData.append('name', this.form.value.name);
      prodData.append('qty', this.form.value.qty);
      prodData.append('image', this.form.value.image);
      prodData.append('description', this.form.value.description);
      prodData.append('category', this.form.value.category);
      prodData.append('id', this.productId);
      prodData.append('order', this.form.value.order);
      prodData.append('longDescription', this.form.value.longDescription);
     return this.http.put<RespData>(`${this.newUrl}product`, prodData).subscribe((res)=>{
      this.tabSrv.onProductEdit(res.product, this.categoryIndex);
      showToast(this.toastCtrl, res.message, 3000);
      this.isLoading = false;
        return this.cancel();
     });
    } else{
      this.isLoading = false;
      return this.cancel();
    };
  };

  cancel(){
    return this.modalCtrl.dismiss(null, 'cancel');
  };


  getProduct(){
   const product = this.tabSrv.getProduct(this.productId, this.categoryIndex);
   if(product){
     this.product = product;
   };
  };

  getCategories(){
    this.tabSrv.categorySend$.subscribe(categories => {
      if(categories){
        const categoriesToSort = [...categories];
        this.categories = categoriesToSort.sort((a, b) => a.name.localeCompare(b.name));
      };
      this.isLoading = false;
    });
  };

  onImagePicked(imageData: string | File){
    let imageFile;
    if(typeof imageData === 'string'){
      try{
      imageFile = base64toBlob(
      imageData.replace(/^data:image\/(png|jpe?g|gif|webp);base64,/, ''),
      'image/jpeg'
      );
      } catch (error) {
        console.log(error);
      };
    } else {
      imageFile = imageData;
    };
    this.form.patchValue({image: imageFile});
  };

  onDelete(){
    this.http.delete<{message: string}>(`${this.newUrl}product?id=${this.productId}`).subscribe(res => {
      this.tabSrv.prodDelete(this.categoryIndex, this.prodIndex);
      triggerEscapeKeyPress();
      showToast(this.toastCtrl, res.message, 3000);
    }, error => {
      console.log(error);
      showToast(this.toastCtrl, error.error.message, 3000);
      triggerEscapeKeyPress();
    });
  };

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.onDelete();
      },
    },
  ];

};
