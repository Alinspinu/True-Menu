import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { TabsService } from 'src/app/tabs/tabs.service';
import { Product, SubProduct } from '../category.model';
import { SpinnerPage } from '../../../shared/spinner/spinner.page';
import { showToast } from '../../../shared/utils/toast-controller';

interface Response {
  message: string,
  subProduct: SubProduct
}

@Component({
  selector: 'app-add-subproduct',
  templateUrl: './add-subproduct.page.html',
  styleUrls: ['./add-subproduct.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, SpinnerPage]
})
export class AddSubproductPage implements OnInit {
  currentTab!: string;
  currentCategory!: string;
  products!: Product[];
  baseUrl: string = 'http://localhost:8080/api-true/';
  baseUrlHeroku: string = 'https://www.cafetish.com/api/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/api-true/';
  isLoading = false;
  form!: FormGroup;
  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private tabServ: TabsService,
  ) { }


  confirm(){
    this.isLoading = true;
    if(this.form.valid){
      const subProdData = {
        id: this.form.value.product,
        name: this.form.value.name,
        price: this.form.value.price,
        order: this.form.value.order,
      };
     return this.http.post<Response>(`${this.newUrl}sub-prod-add`, subProdData).subscribe((res)=>{
      this.tabServ.onSubProductAdd(res.subProduct);
      showToast(this.toastCtrl, res.message, 3000);
      this.isLoading = false;
        return this.cancel();
     })
    } else{
      this.isLoading = false;
      return this.cancel();
    }
  }

  ngOnInit() {
    this.getCurrentTab();
    this.getCategory();
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
    });
  };

  getCategory(){
   const category = this.tabServ.getCategory(this.currentTab);
   if(category){
     this.products = category.product;
   };
  };

  cancel(){
    return this.modalCtrl.dismiss(null, 'cancel');
  };

  getCurrentTab() {
    const currentTab = window.location.href;
    const indexTab = currentTab.lastIndexOf('/');
    const tab = currentTab.slice(indexTab +1);
    return this.currentTab = tab;
  };

}
