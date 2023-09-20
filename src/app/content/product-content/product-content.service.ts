import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Ingredient } from "src/app/CRUD/add/category.model";
interface Ings{
  quantity: number,
  ingredient: Ingredient
}

@Injectable({providedIn: 'root'})



export class ProductContentService{
  baseUrl: string = 'http://localhost:8080/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/';


  constructor(
    private http: HttpClient,
    ){}

  addIngredients(ingredients: Ings[], productId: string){
   return this.http.post(`${this.newUrl}nutrition/add-ing-to-product?id=${productId}`, ingredients)
  }

}


