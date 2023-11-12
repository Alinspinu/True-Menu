import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take, tap } from "rxjs";
import { Ingredient } from "src/app/CRUD/add/category.model";

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
  baseUrl: string = 'http://localhost:8080/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/';
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
   return this.http.post(`${this.newUrl}nutrition/add-ing-to-product?id=${productId}`, ingredients)
  }

  addProductIngredient(ingredients: Ings[], name: string){
    return this.http.post(`${this.newUrl}nutrition/add-prod-ing?name=${name}`, ingredients )
  }

  addProductTopping(topping: Topping, id: string){
    return this.http.post(`${this.newUrl}api-true/add-topping?id=${id}`, topping)
  }

  updateBlackList(listToSend: string[]){
   return this.http.put<Response>(`${this.newUrl}api-true/update-blackList`, listToSend).pipe(take(1), tap((response: Response) => {
    this.balckList = response.list
    console.log(response)
    this.blackListState.next([...this.balckList])
   }) )
  }

  fetchBlackList(){
   return this.http.get<string[]>(`${this.newUrl}api-true/get-blackList`).pipe(take(1), tap(response => {
    this.balckList = response
    this.blackListState.next([...this.balckList])
   }))
  }



}


