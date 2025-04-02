import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take, tap } from "rxjs";
import { Ingredient, Product } from "src/app/CRUD/add/category.model";
import { environment } from "src/environments/environment";

interface Topping{
  name: string,
  price: number,
  qty: number,
  um: string
}

interface Ings{
  quantity: number,
  ingredient: Ingredient
}

interface Response {
  message: string,
  list: string[]
}

@Injectable({providedIn: 'root'})

export class ProductContentService{

  private blackListState!: BehaviorSubject<string[]>;
  public blackListSend$!: Observable<string[]>;
  balckList: string[] = [];



  constructor(
    private http: HttpClient,
    ){
      this.blackListState = new BehaviorSubject<string[]>([]);
      this.blackListSend$ =  this.blackListState.asObservable();
    }

  addIngredients(ingredients: Ings[], productId: string){
   return this.http.post(`${environment.BASE_URL}nutrition/add-ing-to-product?id=${productId}`, ingredients)
  }

  addProductIngredient(ingredients: Ings[], name: string){
    return this.http.post(`${environment.BASE_URL}nutrition/add-prod-ing?name=${name}`, ingredients )
  }

  addProductTopping(topping: Topping, id: string){
    return this.http.post(`${environment.BASE_URL}top/add-topping?id=${id}`, topping)
  }

  updateBlackList(listToSend: string[]){
   return this.http.put<Response>(`${environment.BASE_URL}top/update-blackList`, listToSend).pipe(take(1), tap((response: Response) => {
    this.balckList = response.list
    console.log(response)
    this.blackListState.next([...this.balckList])
   }) )
  }

  fetchBlackList(){
   return this.http.get<string[]>(`${environment.BASE_URL}top/get-blackList`).pipe(take(1), tap(response => {
    this.balckList = response
    this.blackListState.next([...this.balckList])
   }))
  }

  getProduct(id: string){
    return this.http.get<Product>(`${environment.BASE_URL}product/get-product?id=${id}`)
  }

}


