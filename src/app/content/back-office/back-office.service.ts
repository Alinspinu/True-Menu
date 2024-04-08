import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { Day } from "./cash-register/cash-register.model";



@Injectable({providedIn: 'root'})



export class BackOfficeService{

  balckList: string[] = [];



  constructor(
    private http: HttpClient,
    ){
    }

    getDocsByTimeInterval(start: string, end: string, locatie: string){
      return this.http.post(`${environment.BASE_URL}register/create-xcel`, {startDate: start, endDate: end, loc: locatie},{responseType: 'blob'})
    }

    getDocuments(page: number, locatie: string): Observable<{message: string, documents: Day[]}> {
      return this.http.get<{message: string, documents: Day[]}>(`${environment.BASE_URL}register/show-cash-register?page=${page}&loc=${locatie}`);
    }

    deleteEntry(id: string){
      return this.http.delete<{message: string}>(`${environment.BASE_URL}register/delete-entry?id=${id}`)
    }


}
