import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, NavParams, ToastController } from '@ionic/angular';
import User from '../../auth/user.model';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { Category, Product, SubProduct } from '../../CRUD/add/category.model';
import { TabsService } from '../../tabs/tabs.service';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { ParringProductPage } from '../../CRUD/add/parring-product/parring-product.page';
import { HttpClient } from '@angular/common/http';
import { showToast, triggerEscapeKeyPress } from '../../shared/utils/toast-controller';
import { CartService } from '../../cart/cart.service';
import { Router } from '@angular/router';
import { ProductContentService } from './product-content.service';
import { CartProduct, Ing, Topping } from 'src/app/cart/cart.model';
import { environment } from 'src/environments/environment';
import { PickOptionPage } from 'src/app/shared/pick-option/pick-option.page';
import { calcProductDiscount } from 'src/app/shared/utils/functions';


interface Response {
  message: string,
  updatedProduct: Product
}
interface Result {
  energy: {kJ: number, kcal: number},
  carbs: { all: number, sugar: number },
  fat: { all: number, satAcids: number },
  salts: number,
  protein: number,
  additives: {name: string, _id: string}[],
  allergens: {name: string, _id: string}[]
}

@Component({
  selector: 'app-product-content',
  templateUrl: './product-content.page.html',
  styleUrls: ['./product-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ParringProductPage]
})
export class ProductContentPage implements OnInit, OnDestroy {
  emptyResult: Result = {
    energy: {kJ: 0, kcal: 0},
    carbs: { all: 0, sugar: 0 },
    fat: { all: 0, satAcids: 0 },
    salts: 0,
    protein: 0,
    additives: [],
    allergens: []
  }

  user!: User;
  isLoggedIn: boolean = false;
  backTab: string = '';
  isAdmin: boolean = false;
  userSub!: Subscription;
  paramSubs!: Subscription;
  product!: Product;
  productId: string = '';
  imagePath: string = '';
  productIndex!: number;
  tabSubs!: Subscription;
  category!: Category[];
  pickOption: string = '';
  description: string[] = []
  additives: string = '';
  catIndex!: number;
  blackList: string[] = [];
  blackListSub!: Subscription;

  preOrder: boolean = false


  constructor(
    private authSrv: AuthService,
    private tabsServ: TabsService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private alertController: AlertController,
    private http: HttpClient,
    private tabSrv: TabsService,
    private toastCtrl: ToastController,
    private cartService: CartService,
    private router: Router,
    private productSrv: ProductContentService,
    private productService: ProductContentService
    ) { }

  ngOnInit() {
    this.setProductIdandIndex();
    this.fetchCategory();
    this.getBlackList();
     this.getUser()
     this.calcProdNutrition()
     this.splitDescription()
     this.setImageCroppingSettings();
     this.getBackTab();
     this.product ? this.setPickOption(this.product.category.name) : null
     console.log(this.product)

  }

 getBlackList(){
  this.blackListSub = this.productSrv.blackListSend$.subscribe(response => {
    response === undefined ? this.blackList= [] : this.blackList = response
  })
 }

  splitDescription(){
    if(this.product && this.product.longDescription){
      this.description = this.product.longDescription.split('#s#')
    }
  }

  ngOnDestroy(): void {
    this.tabSubs.unsubscribe();
  }

  setProductIdandIndex(){
    const strings = window.location.href.split('/')
    this.productId = strings[5]
    this.productIndex = parseFloat(strings[6])
  }

  async showActions(){
    const data = await this.actionSheet.showAdd(this.getProductIngredients());
    if(data){
      if(data.topping){
        this.productService.addProductTopping(data.topping, this.productId).subscribe(res => {
          if(res){
            console.log(res)
            this.tabSrv.onProductEdit(res, this.catIndex)
          }
        })
      } else if(!data.name && !data.topping){
        this.productService.addIngredients(data, this.productId).subscribe()
      } else {
        this.productService.addProductIngredient(data.ingredients, data.name).subscribe()
      }
    }
  }

  getProductIngredients(){
   let ings: {_id: string, qty: number}[] = []
    this.product.ingredients.forEach(el => {
      const ing = {
        _id: el.ingredient._id,
        qty: el.quantity
      }
      ings.push(ing)
    })
    return {ing: ings, mode:'', ingId: ''}
  }

  calcProdNutrition(){
    if(this.product && this.product.ingredients.length > 0){
      const productQuantity = parseFloat(this.product.qty.replace(/g|ml/g, ''))
      const prefixes = ['energy', 'carbs', 'fat', 'salts', 'protein']
      const result = this.product.ingredients.reduce<Result>((acc, obj) => {
        Object.keys(obj.ingredient).forEach(key => {
          if (prefixes.some(prefix => key.startsWith(prefix))) {
            if (typeof (obj.ingredient as any)[key] === 'object') {
              Object.keys((obj.ingredient as any)[key]).forEach(subKey => {
                (acc as any)[key] = (acc as any)[key] || {};
                (acc as any)[key][subKey] = this.round((((acc as any)[key][subKey] || 0) + ((obj.ingredient as any)[key][subKey] * (obj.quantity / 100)))/(productQuantity/100));
              });
            } else {
              (acc as any)[key] = this.round((((acc as any)[key] || 0) + ((obj.ingredient as any)[key] * (obj.quantity / 100)))/(productQuantity/100));
            }
          } else if((Array.isArray((obj.ingredient as any)[key]))) {
            (acc as any)[key] = (acc as any)[key] || [];
            (obj.ingredient as any)[key].forEach((item: any) => {
                const index = (acc as any)[key].findIndex((obj:any) => obj.name === item.name)
                if (index === -1 && item.name.length > 1) {
                    (acc as any)[key].push(item);
                }
            });
          }
        });
        return acc;
      }, this.emptyResult);
      this.product.nutrition.energy = result.energy;
      this.product.nutrition.carbs = result.carbs;
      this.product.nutrition.fat = result.fat;
      this.product.nutrition.salts = result.salts;
      this.product.nutrition.protein = result.protein;
      this.product.allergens = result.allergens;
      this.product.additives = result.additives;
      this.additives = result.additives.map(obj => obj.name).join('/')
    }
  }




  fetchCategory(){
    this.tabSubs = this.tabsServ.categorySend$.subscribe(res => {
      this.category = res
      for(let i = 0; i < res.length; i++ ){
        if(res[i].product[this.productIndex] && (res[i].product[this.productIndex]._id === this.productId)){
          this.catIndex = i
          console.log(res[i].product[this.productIndex])
          return this.product = res[i].product[this.productIndex]
        } else {
          continue
        }
    }
    return
    })
  }

  setPickOption(name: string){
    switch(name){
      case "BLACK COFFEE":
        console.log('hit cafea')
        this.pickOption = "Cafeaua";
        break;
      case "WITH MILK":
        this.pickOption = "Cafeaua";
        break;
      default: this.pickOption = "o Opțiune";
    }
  }

  goToCoffee(subName: string){
    switch(subName){
      case "True Blend":
        this.router.navigate(['tabs/product-content/64e1089a7b76ae5db7fec5d7/0']);
        break;
      case "Columbia Jairo Peach":
        this.router.navigate(['tabs/product-content/64e1170581decdf638c719a1/6']);
        break;
      case "Papua Noua Guinee":
        this.router.navigate(['tabs/product-content/64e110f681decdf638c71989/3']) ;
        break;
      case "NIcaragua Buena Vista":
        this.router.navigate(['tabs/product-content/65b7736a70a5951d38f682d7/1']) ;
        break;
      case "Columbia Jairo Litch":
        this.router.navigate(['tabs/product-content/65c8d1e7fe71e9cf259265e5/2']) ;
        break;
      case "Etiopia Dimtu":
        this.router.navigate(['tabs/product-content/65b7754170a5951d38f69730/5']) ;
        break;
      case "Decofeinizat":
        this.router.navigate(['tabs/product-content/650495786f57ad612744c3a3/7']);
        break;
      case "Etiopia Gargary":
        this.router.navigate(['tabs/product-content/64e119cb81decdf638c719a6/5'])
    }
  }

  navigateParProduct(productId: string, catId: string){
    const catIndex = this.category.findIndex(obj=> obj._id === catId);
    console.log(catIndex, this.category)
    const prodIndex = this.category[catIndex].product.findIndex(obj=> obj._id === productId);
    this.router.navigate(['tabs/product-content/'+ productId + '/' + prodIndex])
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

    async saveProdToCart(product: Product, index: number){
      let payToGo = false
      const categoryToCheck = ['BREAKFAST ALL DAY', 'SALATE SI APERITIV', 'PASTE ȘI RISOTTO', 'CARTOFI CRISPERS', 'TOAST & MUFFIN', 'DESERT', 'MAIN COURSE'];
      if (categoryToCheck.some(prefix => product.category.name === prefix)){
        payToGo = true
      }
      let price: number = product.price;
      let cartProdName: string = product.name;
      let ings: Ing[] = product.ings
      if(product.subProducts.length){
        const result = await this.actionSheet.openTwoOp(PickOptionPage, product.subProducts, true)
          if(result){
            ings = result.ings
            price  = result.price
            cartProdName = product.name + '-' + result.name;
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
          toppings: options,
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
        };
          if(index !== -1){
            this.product.paring[index].quantity++
          }
        this.cartService.saveCartProduct(calcProductDiscount(cartProduct, this.user.discount));
        this.tabSrv.addProd(product.category._id, product.name, this.preOrder);
    };

    getBackTab(){
      if(this.product && this.product.category._id.length)
      this.backTab = this.product.category._id
    }

    setImageCroppingSettings(): string {
      if(this.product){
      const url = this.product.image.path
      const segments = url.split('/');
      const uploadIndex = segments.indexOf('upload');
      if (uploadIndex === -1) {
        return this.imagePath = url;
      };
      const transformation = `c_crop,w_555,h_888,x_0,y_55`;
      segments.splice(uploadIndex + 1, 0, transformation);
      return this.imagePath = segments.join('/');
    }
    return ''
    };

    addProduct(id: string){
      this.actionSheet.openEdit(ParringProductPage, id, 0, 0 )
    };

  onDelete(productToBeRemovedId: string){
    const data = {
      productToBeRemovedId,
      productToRemoveFromId: this.productId
    }
    return this.http.post<Response>(`${environment.BASE_URL}product/remove-paring-product`, data).subscribe(response => {
      const catIndex = this.tabSrv.getCatIndex(this.productId)
      this.tabSrv.onProductEdit(response.updatedProduct, catIndex)
      showToast(this.toastCtrl, response.message, 3000)
      triggerEscapeKeyPress()
    })
  }

  async presentAlert(name: string, productToBeRemovedId: string) {
  const alert = await this.alertController.create({
    header: 'Șterge',
    message: `Ești sigur că vrei să ștergi ${name}?`,
    buttons: [
      {
        text: 'Renunță',
        role: 'cancel'
      },
      {
        text: 'Șterge',
        role: 'confirm',
        handler: () => {
          this.onDelete(productToBeRemovedId);
        },
      },
    ]
  });
  await alert.present();
}

 round(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}


}
