import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { Ingredient } from "../category.model";


@Injectable({providedIn: 'root'})

export class RecipeIngredientService{


 baseUrl: string = 'http://localhost:8080/nutrition/';
 newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/nutrition/';

  constructor(private http: HttpClient){}

getIngredients(){
  return this.http.get<Ingredient[]>(`${this.baseUrl}ing-send`).pipe(
    map(ings => ings.map (ing => {
     const ingredient = {
      name: ing.name,
      _id: ing._id,
      selected: false,
      quantity: undefined
     }
     return ingredient
    })))
}

}
