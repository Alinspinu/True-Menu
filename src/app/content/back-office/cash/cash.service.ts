import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Bill } from "../../../cart/cart.model";

import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})



export class CashService{


  constructor(
    private http: HttpClient,
    ){
    }

 getOrders(start: string | undefined, end: string | undefined, day: string | undefined){
  return this.http.post<{orders: Bill[], delProducts: any[]}>(`${environment.BASE_URL}orders/get-orders`, {start: start, end: end, loc: environment.LOC, day: day})
 }
}
