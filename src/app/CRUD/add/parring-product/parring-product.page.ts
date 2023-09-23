import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, NavParams, ToastController } from '@ionic/angular';
import { TabsService } from '../../../tabs/tabs.service';
import { Product } from '../category.model';
import { HttpClient } from '@angular/common/http';
import { showToast, triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';

interface RespData{
  message: string,
  updatedProduct: Product
}

@Component({
  selector: 'app-parring-product',
  templateUrl: './parring-product.page.html',
  styleUrls: ['./parring-product.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ParringProductPage implements OnInit {

  baseUrl: string = 'http://localhost:8080/api-true/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/api-true/';

  products!: Product[]
  searchTerm: string = '';
  filteredItems!: Product[]
  productId!: string

  constructor(
    private toastCtrl: ToastController,
    private tabSrv: TabsService,
    private alertController: AlertController,
    private navParams: NavParams,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.productId = this.navParams.get('id')
    this.products = this.tabSrv.getAllProducts()
    this.filteredItems = this.sortedProducts()
  }

  sortedProducts(){
   return this.products.slice().sort((a,b)=> a.name.localeCompare(b.name))
  }

  filterItems() {
    this.filteredItems = this.sortedProducts().filter(product => {
      return product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

cancel(){

}
onConfirm(id: string){
  const data = {
    productToEditId: this.productId,
    productToPushId: id,
  }
  this.http.post<RespData>(`${this.baseUrl}add-paring-product`, data).subscribe(response => {
    const catIndex = this.tabSrv.getCatIndex(this.productId)
    this.tabSrv.onProductEdit(response.updatedProduct, catIndex)
    showToast(this.toastCtrl, response.message, 3000)
    triggerEscapeKeyPress()
  })
}


async presentAlert(name: string, id: string) {
  const alert = await this.alertController.create({
    header: 'Adaugă',
    subHeader: name,
    // message: 'This is an alert message.',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Add',
        role: 'confirm',
        handler: () => {
          this.onConfirm(id);
        },
      },
    ]
  });
  await alert.present();
}
}
