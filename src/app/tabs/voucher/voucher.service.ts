import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";


@Injectable({providedIn: 'root'})


export class VoucherService{

  constructor(
    private http: HttpClient
  ){}

  saveVoucher(code: string, value: number){
    return this.http.post<{message: string}>(`${environment.BASE_URL}pay/add-voucher`, {code: code, value: value})
  }

  verfyVoucher(code: string){
    return this.http.post<{message: string, voucher: any}>(`${environment.BASE_URL}pay/verify-voucher`, {code: code})
  }

  useVoucher(id: string){
    return this.http.post<{message: string}>(`${environment.BASE_URL}pay/use-voucher`, {id: id})
  }
}
