import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take, tap} from "rxjs";
import { Category, Product} from "../CRUD/add/category.model";
import { Preferences } from "@capacitor/preferences";
import { CartService } from "../cart/cart.service";
import { CartProduct } from "../cart/cart.model";
import { environment } from "src/environments/environment";
import { calcProductDiscount } from "../shared/utils/functions";

@Injectable({providedIn: 'root'})

export class TabsService{
  currentCategory!: string;
  tab: string = 'food';
  emptyCategory: Category = {_id: '', mainCat: '', name: '', product: [], image: {path: '', filename:''}, order: 0}
  emptyProduct: Product = {
    _id: '',
    name: '',
    qty: '',
    price: 0,
    order: 0,
    description: '',
    quantity: 0,
    image: {path: '', filename: ''},
    subProducts: [],
    category: this.emptyCategory,
    available: false,
    longDescription: '',
    ingredients: [],
    tva: '',
    mainCat: '',
    printer: '',
    nutrition: {
      energy:{kJ: 0, kcal: 0},
      fat: {all: 0, satAcids: 0},
      carbs: {all: 0, sugar: 0},
      salts: 0,
      protein: 0,
    },
    additives: [],
    preOrderPrice: 0,
    preOrder: false,
    allergens: [],
    paring: [],
    toppings: [],
    ings: [],
    dep: '',
    sgrTax: false,
  }
  private categoryState!: BehaviorSubject<Category[]>;
  public categorySend$!: Observable<Category[]>;
  category: Category[] = [this.emptyCategory];


  constructor(
    private http: HttpClient,
    private crtSrv: CartService,
    ){
    this.categoryState = new BehaviorSubject<Category[]>([this.emptyCategory]);
    this.categorySend$ =  this.categoryState.asObservable();
  }


  fetchCategories(locatie: string){
    Preferences.get({key: 'categories'}).then(data => {
      if(data.value){
        const cats = JSON.parse(data.value)
        this.category = this.sortData(cats)
        console.log(this.category)
        this.categoryState.next([...this.category])
      }
    })
    const headers = new HttpHeaders().set("ngrok-skip-browser-warning", "420");
    return this.http.get<Category[]>(`${environment.BASE_URL}cat/get-cats?loc=${locatie}`, {headers}).pipe(take(1), tap(res => {
      this.category = this.sortData(res)
      const data = JSON.stringify(this.category)
      Preferences.set({key: "categories", value: data })
      this.categoryState.next([...this.category]);
    }));


};

getAmbalaj(qty: number, discount: any){
    const categoryIndex = this.category.findIndex(index => index.name == 'MERCH');
    const productIndex = this.category[categoryIndex].product.findIndex(index => index.name == "Ambalaj")
    const product = this.category[categoryIndex].product[productIndex]
    let preOrder
    if(product.preOrder === undefined){
        preOrder = false
    } else {
      preOrder = product.preOrder
    }
    const cartAmbalaj = {
      name: product.name,
      price: product.price,
      quantity: 1 * qty,
      _id: product._id,
      total: product.price * qty,
      imgPath: product.image.path,
      category: product.category._id,
      sub: false,
      toppings: [],
      payToGo: false,
      preOrder: preOrder,
      ings: [],
      mainCat:'',
      newEntry: true,
      printer: 'kitchen',
      sentToPrint: true,
      imgUrl: product.image.path,
      discount: 0,
      tva: 19,
      dep: product.dep,
      qty: '',
      sgrTax: false,

    };
    return calcProductDiscount(cartAmbalaj, discount)
}

changeProdStatus(status: string, id: string){
  return this.http.post(`${environment.BASE_URL}product/change-status`, {stat: status, id: id});
};


  addSub(subName: string, prodName: string, categoryId: string){
     this.category.map(obj => {
      if(obj['_id'] === categoryId){
           obj.product.map(obj=> {
            if(obj['name'] === prodName){
               obj.subProducts.map(obj => {
                if(obj['name'] === subName){
                 obj.quantity++;
                };
              });
            };
          });
      };
    });
  };

  addProd(categoryId: string, prodName: string, preOrder: boolean){
    let firstProduct!: CartProduct
    this.crtSrv.cartSend$.subscribe(res => {
      // console.log(res.products[0])
      firstProduct = res.products[0]
    })
    console.log(firstProduct, preOrder)
    if(firstProduct){
      if(firstProduct.preOrder === preOrder){
        this.category.map(obj => {
          if(obj['_id'] === categoryId){
               obj.product.map(obj=> {
                if(obj['name'] === prodName){
                  obj.quantity++;
                };
              });
          };
        });
      } else{
        return
      }
    } else{
      this.category.map(obj => {
        if(obj['_id'] === categoryId){
             obj.product.map(obj=> {
              if(obj['name'] === prodName){
                obj.quantity++;
              };
            });
        };
      });
    }

  };

  redSub(subName: string, prodName: string, categoryId: string, rem: boolean){
    this.category.map(obj => {
     if(obj['_id'] === categoryId){
          obj.product.map(obj=> {
           if(obj['name'] === prodName){
              obj.subProducts.map(obj => {
               if(obj['name'] === subName){
                obj.quantity--
                if(rem){
                  obj.quantity = 0;
                };
               };
             });
           };
         });
     };
   });
 };

 redProd(categoryId: string, prodName: string, rem: boolean){
  this.category.map(obj => {
    if(obj['_id'] === categoryId){
         obj.product.map(obj=> {
          if(obj['name'] === prodName){
            obj.quantity--
            if(rem){
              obj.quantity = 0;
            };
          };
        });
    };
  });
};

clearQty(){
  this.category.map(obj => {
    obj.product.map(obj =>{
      obj.quantity = 0
      if(obj.subProducts.length){
        obj.subProducts.map(obj => {
          obj.quantity = 0;
          this.categoryState.next(this.category);
        });
      } else {
        this.categoryState.next(this.category);
      };
    });
  });
};

// **************SAVE DATA*******************************


onCategoryAdd(category: Category){
  this.category.push(category);
  this.categoryState.next([...this.category]);
}

onProductAdd(product: any){
  const index = this.category.findIndex(obj=> obj._id === product.category);
  this.category[index].product.push(product);
  this.categoryState.next([...this.category]);
}

onSubProductAdd(subProduct: any){
  const catIndex = this.category.findIndex(obj => obj._id === subProduct.product.category);
  const prodIndex = this.category[catIndex].product.findIndex(obj => obj._id === subProduct.product._id);
  this.category[catIndex].product[prodIndex].subProducts.push(subProduct);
  this.categoryState.next([...this.category]);
}

// **************EDIT DATA*******************************

onCategoryEdit(editedCategory: Category) {
  const index = this.category.findIndex(obj => obj._id === editedCategory._id);
  if (index !== -1) {
    this.category[index] = editedCategory;
    this.category = this.sortData(this.category);
    this.categoryState.next([...this.category]);
  }
}

onProductEdit(editedProduct: any, catIndex: number){
    const index = this.category[catIndex].product.findIndex(obj => obj._id === editedProduct._id);
    if(index !== -1){
     const oldProduct = this.category[catIndex].product[index];
     if(oldProduct.category._id !== editedProduct.category._id){
      console.log('hit categoy change')
        this.category[catIndex].product.splice(index, 1);
        const newCatIndex = this.category.findIndex(obj => obj._id === editedProduct.category)
        this.category[newCatIndex].product.push(editedProduct);
        this.category = this.sortData(this.category);
        this.categoryState.next([...this.category]);
     } else {
      console.log("hit the right place")
        this.category[catIndex].product[index] = editedProduct;
        this.category = this.sortData(this.category);
        console.log(this.category)
        this.categoryState.next([...this.category]);
     };
    };
};

onSubProductEdit(editedSubProduct: any, catIndex: number, prodIndex: number) {
    const index = this.category[catIndex].product[prodIndex].subProducts.findIndex(obj=> obj._id === editedSubProduct._id);
    if(index !== -1){
      const oldSub = this.category[catIndex].product[prodIndex].subProducts[index];
      if(oldSub.product._id !== editedSubProduct.product._id){
        this.category[catIndex].product[prodIndex].subProducts.splice(index, 1);
        const newCatIndex = this.category.findIndex(obj => obj._id === editedSubProduct.product.category);
        const newProdIndex = this.category[newCatIndex].product.findIndex(obj => obj._id === editedSubProduct.product._id);
        this.category[newCatIndex].product[newProdIndex].subProducts.push(editedSubProduct);
        this.category = this.sortData(this.category)
        this.categoryState.next([...this.category]);
      } else {
        this.category[catIndex].product[prodIndex].subProducts[index] = editedSubProduct;
        this.category = this.sortData(this.category)
        this.categoryState.next([...this.category]);
      };
    };
};



subDelete(subId: string, catIndex: number, prodIndex: number){
  const index = this.category[catIndex].product[prodIndex].subProducts.findIndex(obj => obj._id === subId);
  this.category[catIndex].product[prodIndex].subProducts.splice(index, 1);
  this.categoryState.next([...this.category]);
};

prodDelete( categoryIndex: number, prodIndex: number){
    this.category[categoryIndex].product.splice(prodIndex, 1);
    this.categoryState.next([...this.category]);
};

catDelete(categoryId: string){
  const index = this.category.findIndex(obj => obj._id === categoryId);
  this.category.splice(index, 1);
  this.categoryState.next([...this.category]);
};

// *****************************GET DATA*************************

  getCategory(id: string){
    return this.category.find(obj => obj._id === id);
    };

  getProduct(prodId: string, catIndex: number) {
   return this.category[catIndex].product.find(obj => obj._id === prodId);
  };

  getSubProduct(subId: string, catIndex: number, prodIndex: number){
    return this.category[catIndex].product[prodIndex].subProducts.find(obj=> obj._id === subId);
  };

  getAllProducts(){
    let products: Product[] = []
    for( let category of this.category){
      for( let product of category.product){
          products.push(product)
      }
    }
    return products
  }

  getCatIndex(id: string){
    for(let category of this.category){
        for(let product of category.product){
          if(product._id === id) {
            return this.category.findIndex(obj => obj === category)
          } else {
            continue
          }
        }
    }
    return -1
  }

  getProductIndex(id: string){
    for(let category of this.category){
      for(let product of category.product){
        if(product._id === id) {
          return category.product.findIndex(obj => obj === product)
        } else {
          continue
        }
      }
  }
  return -1
}

getProductId(subProdId: string){
  for(let category of this.category){
    for(let product of category.product){
      for(let subProd of product.subProducts){
        if(subProd._id === subProdId) {
          return product._id
        } else {
          continue
        }
      }

    }
  }
  return -1
}





  private sortData(data: Category[]){
    let sortedCategories: Category[] = [];
    data.sort((a, b) => a.order - b.order);
    for(let category of data){
        category.product.sort((a,b)=> a.order - b.order);
        for(let product of category.product){
          product.subProducts.sort((a,b) => a.order - b.order);
        }
        sortedCategories.push(category);
    }
    return sortedCategories;
  }

}

