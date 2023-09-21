import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, take, tap } from "rxjs";
import { Ingredient } from "../category.model";


@Injectable({providedIn: 'root'})

export class RecipeIngredientService{


 baseUrl: string = 'http://localhost:8080/nutrition/';
 newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/nutrition/';
 ingredients!: Ingredient[]

 private ingState!: BehaviorSubject<Ingredient[]>;
 public ingSend$!: Observable<Ingredient[]>;
 emptyIng: Ingredient = {
      _id: '',
      name: '',
      labelInfo: '',
      energy: {kcal: 0, kJ: 0},
      carbs: {all: 0, sugar: 0},
      fat: {all: 0, satAcids: 0},
      salts: 0,
      protein: 0,
      additives:[],
      allergens:[]
}
//  category: Category[] = [this.emptyCategory];

  constructor(private http: HttpClient){
    this.ingState = new BehaviorSubject<Ingredient[]>([this.emptyIng]);
    this.ingSend$ =  this.ingState.asObservable();
  }

getIngredients(){
  return this.http.get<Ingredient[]>(`${this.newUrl}ing-send`).pipe(take(1), tap(res=>{
    this.ingredients = res
    this.ingState.next([...this.ingredients])
  }),
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

deleteIngredients(id: string){
  return this.http.delete<{message: string}>(`${this.newUrl}delete-ingredient?id=${id}`)
}


}
