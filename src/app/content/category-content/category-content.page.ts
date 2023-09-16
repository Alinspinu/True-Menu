import { Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabsService } from '../../tabs/tabs.service';
import { Category, Product} from '../../CRUD/add/category.model';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { RouterModule } from '@angular/router';
import { CartService } from '../../cart/cart.service';
import { Cart } from '../../cart/cart.model';
import { Subscription } from 'rxjs';
import User from '../../auth/user.model';
import { AuthService } from '../../auth/auth.service';
import { EditProductComponent } from '../../CRUD/edit/edit-product/edit-product.component';
import { EditSubProductComponent } from '../../CRUD/edit/edit-sub-product/edit-sub-product.component';
import { CapitalizePipe } from '../../shared/capitalize.pipe';



@Component({
  selector: 'app-category-content',
  templateUrl: './category-content.page.html',
  styleUrls: ['./category-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, CapitalizePipe]
})
export class CategoryContentPage implements OnInit, OnDestroy {
  isSmall: boolean = false
  user!: User;
  backTab: string = 'food';
  cartSubscription!: Subscription;
  tabSubscription!: Subscription;
  userSub!: Subscription;
  admin!:Subscription;
  authSub!: Subscription;
  cart!: Cart;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isDarkMode!: boolean;
  socialUrl!: string;
  currentTab!: string;
  products!: Product[];
  categories!: Category[];
  categoryName!: string

  constructor(
    private tabSrv: TabsService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private cartService: CartService,
    private authSrv: AuthService,

  ) {}



  ngOnInit() {
    this.fetchCategory();
    this.getCart();
    this.getUser();
    this.detectColorScheme();
  };

  // setIsSmall(){
  //   this.pr
  // }

  getCart(){
    this.cartSubscription = this.cartService.cartSend$.subscribe(cart => {
      this.cart = cart;
    });
  };




  fetchCategory(){
  this.getCurrentTab();
   this.tabSubscription = this.tabSrv.categorySend$.subscribe(res => {
    this.categories = res;
      const cat = res.find(cat => cat._id === this.currentTab );
      if(cat){
        this.categoryName = cat.name;
        this.products = cat.product;
        this.backTab = cat.mainCat;
      };
    });
  };


  getCurrentTab() {
    const currentTab = window.location.href;
    const indexTab = currentTab.lastIndexOf('/');
    const tab = currentTab.slice(indexTab +1);
    return this.currentTab = tab;
  };

  saveToCart(product: any, prodInd: number){
    const name = this.products[prodInd].name + '-' + product.name;
    const cartProduct = {
      name: name,
      price: product.price,
      quantity: 1,
      _id: product._id,
      total: product.price,
      imgPath: this.products[prodInd].image.path,
      category: product.product.category._id,
      sub: true,
    };
    this.cartService.saveCartProduct(cartProduct);
    this.tabSrv.addSub(product.name, product.product.name, product.product.category);
  };

  saveProdToCart(product: Product){
    const cartProduct = {
      name: product.name,
      price: product.price,
      quantity: 1,
      _id: product._id,
      total: product.price,
      imgPath: product.image.path,
      category: product.category._id,
      sub: false,
    };
    this.cartService.saveCartProduct(cartProduct);
    this.tabSrv.addProd(product.category._id, product.name);
  };


getUser(){
    this.userSub = this.authSrv.user$.subscribe((res: any ) => {
      if(res){
        res.subscribe((userData: any) => {
            this.user = userData;
            this.isLoggedIn = this.user.name === '' ? false : true;
            this.isAdmin = this.user.admin === 1 ? true : false;
        });
      };
    });
    };


  showActions(){
    this.actionSheet.showSubProduct();
  };




  ngOnDestroy(): void {
    this.tabSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  };

  activateProduct(id: string, index: number, subIndex: number){
    this.tabSrv.changeProdStatus('activate', id).subscribe(res=> {
      if(subIndex === 99){
        this.products[index].available = true;
      } else {
        this.products[index].subProducts[subIndex].available = true;
      };
    });
  };

  deactivateProduct(id: string, index: number, subIndex: number){
    this.tabSrv.changeProdStatus('deactivate', id).subscribe(res => {
      if(subIndex === 99){
        this.products[index].available = false;
      } else {
        this.products[index].subProducts[subIndex].available = false;
      };
    });
  };

  detectColorScheme() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = darkModeMediaQuery.matches;
    darkModeMediaQuery.addListener((event) => {
      this.isDarkMode = event.matches;
    });
  };

  editSub(id: string, prodIndex: number, subIndex: number ){
    const catName = this.products[prodIndex].category.name;
    const catIndex = this.categories.findIndex(obj => obj.name === catName);
    if(catIndex !== -1){
      this.actionSheet.openEdit(EditSubProductComponent, id, catIndex, prodIndex);
    } else {
          const catId: any = this.products[prodIndex].category;
          const catInd = this.categories.findIndex(obj => obj._id === catId);
          if(catInd !== -1){
            this.actionSheet.openEdit(EditProductComponent, id, catInd, prodIndex);
          };
    };
  };

   editProd(id: string, prodIndex: number ){
      const catName = this.products[prodIndex].category.name;
       const catIndex = this.categories.findIndex(obj => obj.name === catName);
       if(catIndex !== -1){
         this.actionSheet.openEdit(EditProductComponent, id, catIndex, prodIndex);
        } else {
          const catId: any = this.products[prodIndex].category;
          const catInd = this.categories.findIndex(obj => obj._id === catId);
          if(catInd !== -1){
            this.actionSheet.openEdit(EditProductComponent, id, catInd, prodIndex);
          };
       };
  };

};
