import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take, tap } from "rxjs";
import { Ingredient } from "src/app/CRUD/add/category.model";
import { Day } from "./cash-register/cash-register.model";



@Injectable({providedIn: 'root'})



export class BackOfficeService{
  baseUrl: string = 'http://localhost:8080/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/';

  balckList: string[] = [];



  constructor(
    private http: HttpClient,
    ){
    }

    getDocsByTimeInterval(start: string, end: string){
      console.log(start, end)
      return this.http.get(`${this.baseUrl}register/create-xcel?startDate=${start}&endDate=${end}`)
    }

    getDocuments(page: number): Observable<{message: string, documents: Day[]}> {
      return this.http.get<{message: string, documents: Day[]}>(`${this.newUrl}register/show-cash-register?page=${page}`);
    }

    deleteEntry(id: string){
      return this.http.delete<{message: string}>(`${this.newUrl}register/delete-entry?id=${id}`)
    }


}
