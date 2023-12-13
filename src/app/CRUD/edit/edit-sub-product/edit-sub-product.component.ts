import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { Product, SubProduct } from '../../add/category.model';
import { LogoPagePage } from '../../../shared/logo-page/logo-page.page';
import { showToast, triggerEscapeKeyPress } from '../../../shared/utils/toast-controller';
import { TabsService } from '../../../tabs/tabs.service';

interface RespData{
  message: string,
  subProd: SubProduct
};

@Component({
  selector: 'app-edit-sub-product',
  templateUrl: './edit-sub-product.component.html',
  styleUrls: ['./edit-sub-product.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, LogoPagePage]
})
export class EditSubProductComponent  implements OnInit {

  subProduct!: SubProduct;
  categoryIndex!: number;
  subProdId!: string;
  prodIndex!: number;
  currentTab!: string;
  currentCategory!: string;
  products!: Product[];
  baseUrl: string = 'http://localhost:8080/api-true/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/api-true/';
  isLoading = false;
  form!: FormGroup;
  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private tabServ: TabsService,
    private navParams: NavParams,
  ) { }



  ngOnInit() {
    this.categoryIndex = +this.navParams.get('catIndex');
    this.subProdId = this.navParams.get('id');
    this.prodIndex = +this.navParams.get('prodIndex');
    this.getCurrentTab();
    this.getSubProduct();
    this.getProducts();
    this.setUpForm();
  };


  setUpForm(){
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      product: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      order: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
    })
    this.form.get('name')?.setValue(this.subProduct.name);
    this.form.get('price')?.setValue(this.subProduct.price);
    this.form.get('product')?.setValue(this.subProduct.product._id);
    this.form.get('order')?.setValue(this.subProduct.order);
  };

  confirm(){
    this.isLoading = true;
    if(this.form.valid){
      const subProdData = {
        id: this.subProduct._id,
        name: this.form.value.name,
        price: this.form.value.price,
        prodId: this.form.value.product,
        order: this.form.value.order,
      };
     return this.http.put<RespData>(`${this.newUrl}sub-product`, subProdData).subscribe((res)=>{
      this.tabServ.onSubProductEdit(res.subProd, this.categoryIndex, this.prodIndex);
      showToast(this.toastCtrl, res.message, 3000);
      this.isLoading = false;
        return this.cancel();
     }, error => {
      console.log(error.error.message);
      showToast(this.toastCtrl, error.error.message, 3000);
     })
    } else{
      this.isLoading = false;
      return this.cancel();
    };
  };

  onDelete(){
    this.http.delete<{message: string}>(`${this.newUrl}sub-product?id=${this.subProduct._id}`).subscribe(res => {
      this.tabServ.subDelete(this.subProdId, this.categoryIndex, this.prodIndex);
      triggerEscapeKeyPress();
      showToast(this.toastCtrl, res.message, 3000);
    }, error => {
      console.log(error);
      showToast(this.toastCtrl, error.error.message, 3000);
      triggerEscapeKeyPress();
    });
  };

  getProducts(){
    this.tabServ.categorySend$.subscribe(categories => {
     let products: Product[] = [];
     for(let category of categories) {
      for(let product of category.product){
        products.push(product);
      };
     };
     if(products.length){
      this.products = products.sort((a, b) => a.name.localeCompare(b.name));
     };
    });
  };


  getSubProduct(){
   const subProd = this.tabServ.getSubProduct(this.subProdId, this.categoryIndex, this.prodIndex);
   if(subProd){
    this.subProduct = subProd;
   };
  };

  cancel(){
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  getCurrentTab() {
    const currentTab = window.location.href;
    const indexTab = currentTab.lastIndexOf('/');
    const tab = currentTab.slice(indexTab +1);
    return this.currentTab = tab;
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
}
