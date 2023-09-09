import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, NavParams } from '@ionic/angular';
import User from '../auth/user.model';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Product } from '../CRUD/add/category.model';
import { TabsService } from '../tabs/tabs.service';
import { ActionSheetService } from '../shared/action-sheet.service';
import { ParringProductPage } from '../CRUD/add/parring-product/parring-product.page';

@Component({
  selector: 'app-product-content',
  templateUrl: './product-content.page.html',
  styleUrls: ['./product-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ParringProductPage]
})
export class ProductContentPage implements OnInit {

  user!: User;
  isLoggedIn: boolean = false;
  backTab: string = '';
  isAdmin: boolean = false;
  userSub!: Subscription;
  product!: Product;
  productId: string = '';
  imagePath: string = '';
  productIndex!: number;
  tabSubs!: Subscription;

  constructor(
    private authSrv: AuthService,
    private tabsServ: TabsService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    ) { }

  ngOnInit() {
    this.getUser();
    this.getProductId();
    this.getProductIndex();
    this.fetchCategory()
    this.setImageCroppingSettings()
    this.getBackTab();
  }

  getProductIndex() {
    const currentTab = window.location.href;
    const indexTab = currentTab.lastIndexOf('/');
    const tab = currentTab.slice(indexTab +1);
    return this.productIndex = parseFloat(tab);
  };

  getProductId() {
    const url = window.location.href;
    const segments = url.split('/');
    return this.productId = segments[segments.length - 2];
  }

  fetchCategory(){
    this.tabSubs = this.tabsServ.categorySend$.subscribe(res => {
      for(let i = 0; i < res.length; i++ ){
        if(res[i].product[this.productIndex] && (res[i].product[this.productIndex]._id === this.productId)){
          return this.product = res[i].product[this.productIndex]
        } else {
          continue
        }
    }
    return
    })
  }


  getUser(){
    this.userSub = this.authSrv.user$.subscribe((res: any ) => {
      if(res){
        res.subscribe((userData: any) => {
            this.user = userData;
            this.isLoggedIn = this.user.status === 'active' ? true : false;
            this.isAdmin = this.user.admin === 1 ? true : false;
        });
      };
    });
    };


    getBackTab(){
      if(this.product.category._id.length)
      this.backTab = this.product.category._id
    }

    setImageCroppingSettings(): string {
      const url = this.product.image.path
      const segments = url.split('/');
      const uploadIndex = segments.indexOf('upload');
      if (uploadIndex === -1) {
        return this.imagePath = url;
      };
      const transformation = `c_crop,w_555,h_888,x_0,y_55`;
      segments.splice(uploadIndex + 1, 0, transformation);
      return this.imagePath = segments.join('/');
    };

    addProduct(id: string){
      console.log('click')
      this.actionSheet.openEdit(ParringProductPage, id, 0, 0 )
    };

    // onDelete(){
    //   this.http.delete<{message: string}>(`${this.newUrl}product?id=${this.productId}`).subscribe(res => {
    //     this.tabSrv.prodDelete(this.categoryIndex, this.prodIndex);
    //     triggerEscapeKeyPress();
    //     showToast(this.toastCtrl, res.message, 3000);
    //   }, error => {
    //     console.log(error);
    //     showToast(this.toastCtrl, error.error.message, 3000);
    //     triggerEscapeKeyPress();
    //   });
    // };

}
