import { Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { TabsService } from '../../tabs/tabs.service';
import { Category, Product} from '../../CRUD/add/category.model';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { RouterModule } from '@angular/router';
import { CartService } from '../../cart/cart.service';
import { Cart, CartProduct, Ing, Topping } from '../../cart/cart.model';
import { Subscription } from 'rxjs';
import User from '../../auth/user.model';
import { AuthService } from '../../auth/auth.service';
import { EditProductComponent } from '../../CRUD/edit/edit-product/edit-product.component';
import { EditSubProductComponent } from '../../CRUD/edit/edit-sub-product/edit-sub-product.component';
import { CapitalizePipe } from '../../shared/capitalize.pipe';
import { ProductContentService } from '../product-content/product-content.service';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import { PickOptionPage } from 'src/app/shared/pick-option/pick-option.page';
import { calcProductDiscount, round } from 'src/app/shared/utils/functions';









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
  hideProduct: boolean = false;
  blackList: string[] = [];
  blackListSub!: Subscription;

  preOrder: boolean = false

  constructor(
    private tabSrv: TabsService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private productSrv: ProductContentService,
    private cartService: CartService,
    private authSrv: AuthService,
  ) {}



  ngOnInit() {
    this.fetchCategory();
    this.getBlackList()
    this.getCart();
    this.getUser();
    this.detectColorScheme();
  };


  getBlackList(){
    this.blackListSub = this.productSrv.blackListSend$.subscribe(response => {
       response === undefined ? this.blackList= [] : this.blackList = response
    })
   }


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
        const products = cat.product;
        this.products = [...products]
        this.backTab = cat.mainCat;
        const ambIndex = this.products.findIndex(prod => prod.name == "Ambalaj")
        if(ambIndex != -1) {
          this.products.splice(ambIndex,1)
        }
      };
    });
  };


  getCurrentTab() {
    const currentTab = window.location.href;
    const indexTab = currentTab.lastIndexOf('/');
    const tab = currentTab.slice(indexTab +1);
    return this.currentTab = tab;
  };


 async saveProdToCart(product: Product){
    let payToGo = false
    const categoryToCheck = ['BREAKFAST ALL DAY', 'SALATE SI APERITIV', 'PASTE ȘI RISOTTO', 'CARTOFI CRISPERS', 'TOAST & MUFFIN', 'DESERT', "MAIN COURSE"];
    if (categoryToCheck.some(prefix => product.category.name === prefix)){
      payToGo = true
    }
    let price: number = product.price;
    let cartProdName: string = product.name;
    let ings: Ing[] = product.ings
    let subProductId = ''
    if(product.subProducts.length){
      const result = await this.actionSheet.openTwoOp(PickOptionPage, product.subProducts, true)
        if(result){
          ings = result.ings
          price  = result.price
          cartProdName = product.name + '-' + result.name;
          subProductId = result._id
        } else {
         return triggerEscapeKeyPress()
        }
    }
    let options: Topping[] = []
    let optionPrice: number = 0;
    let pickedToppings: Topping[] = [];
    if(product.toppings.length){
      const itemsToSort = [...product.toppings]
      let allOptions = itemsToSort.sort((a, b) => a.price - b.price)
      allOptions.forEach(option => {
        if(!option.name.startsWith('To')){
          options.push(option)
        }
      })
    }
    if(options.length){
        const extra = await this.actionSheet.openTwoOp(PickOptionPage, options, false)
          if(extra) {
             pickedToppings = extra
             pickedToppings.forEach(el => {
              optionPrice += el.price
             })
      }
      }
      let totalPrice = price + optionPrice
      const cartProduct: CartProduct = {
        name: cartProdName,
        price: totalPrice,
        quantity: 1,
        _id: product._id,
        total: totalPrice,
        imgPath: product.image.path,
        category: product.category._id,
        sub: false,
        toppings: pickedToppings,
        payToGo,
        preOrder: false,
        ings: ings,
        mainCat: product.mainCat,
        newEntry: true,
        printer: product.printer,
        sentToPrint: true,
        imgUrl: product.image.path,
        discount: 0,
        tva: product.tva,
        dep: product.dep,
        qty: product.qty,
        sgrTax: product.sgrTax,
        subProductId,
        productId: product._id
      };
      this.cartService.saveCartProduct(calcProductDiscount(cartProduct, this.user.discount));
      this.tabSrv.addProd(product.category._id, product.name, this.preOrder);
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
