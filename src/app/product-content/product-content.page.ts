import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import User from '../auth/user.model';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Product } from '../CRUD/add/category.model';
import { TabsService } from '../tabs/tabs.service';

@Component({
  selector: 'app-product-content',
  templateUrl: './product-content.page.html',
  styleUrls: ['./product-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
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

  constructor(
    private authSrv: AuthService,
    private tabsServ: TabsService,
    ) { }

  ngOnInit() {
    this.getUser();
    this.getProductId();
    this.getProductIndex();
    this.getProduct();
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

    getProduct(){
      this.product = this.tabsServ.getProd(this.productId, this.productIndex)
      console.log(this.product)
      const url = this.product.image.path
      this.imagePath = this.addCroppingSettings(url, 555, 888, 0, 55)
    }

    getBackTab(){
      if(this.product.category._id.length)
      this.backTab = this.product.category._id
    }

    addCroppingSettings(url: string, width: number, height: number, x: number, y: number): string {
      const segments = url.split('/');
      const uploadIndex = segments.indexOf('upload');
      if (uploadIndex === -1) {
        return url;
      }
      const transformation = `c_crop,w_${width},h_${height},x_${x},y_${y}`;
      segments.splice(uploadIndex + 1, 0, transformation);
      return segments.join('/');
    }
}
