import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, take, tap} from "rxjs";
import { Category, Product, SubProduct} from "../CRUD/add/category.model";

@Injectable({providedIn: 'root'})

export class TabsService{
  baseUrl: string = 'http://localhost:8080/api-true/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/api-true/';
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
    nutrition: {
      energy:{kJ: 0, kcal: 0},
      fat: {all: 0, satAcids: 0},
      carbs: {all: 0, sugar: 0},
      salts: 0,
      protein: 0,
    },
    additives: [],
    allergens: [],
    paring: [],
  }
  private categoryState!: BehaviorSubject<Category[]>;
  public categorySend$!: Observable<Category[]>;
  category: Category[] = [this.emptyCategory];


  constructor(private http: HttpClient){
    this.categoryState = new BehaviorSubject<Category[]>([this.emptyCategory]);
    this.categorySend$ =  this.categoryState.asObservable();
  }


  saveCat(
    name: string,
    mainCat: string,
    image: File
  ){
    const catData = new FormData();
    catData.append('name', name);
    catData.append('mainCat', mainCat);
    catData.append('image', image);
    this.http.post(`${this.newUrl}add-product`, catData);
  };


  fetchCategories(){
    return this.http.get<Category[]>(`${this.newUrl}get-cats`).pipe(take(1), tap(res => {
      this.category = this.sortData(res)
      this.categoryState.next([...this.category]);
    }));
};

changeProdStatus(status: string, id: string){
  return this.http.post(`${this.newUrl}change-status`, {stat: status, id: id});
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

  addProd(categoryId: string, prodName: string){
    this.category.map(obj => {
      if(obj['_id'] === categoryId){
           obj.product.map(obj=> {
            if(obj['name'] === prodName){
              obj.quantity++;
            };
          });
      };
    });
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
        this.category[catIndex].product.splice(index, 1);
        const newCatIndex = this.category.findIndex(obj => obj._id === editedProduct.category)
        this.category[newCatIndex].product.push(editedProduct);
        this.category = this.sortData(this.category);
        this.categoryState.next([...this.category]);
     } else {
        this.category[catIndex].product[index] = editedProduct;
        this.category = this.sortData(this.category);
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

