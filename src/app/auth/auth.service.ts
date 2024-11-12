import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  BehaviorSubject, from, map, tap } from "rxjs";
import  jwt_decode  from 'jwt-decode'
import { Preferences } from "@capacitor/preferences";
import User from "./user.model";
import { CartService } from "../cart/cart.service";
import { TabsService } from "../tabs/tabs.service";
import { environment } from "src/environments/environment";



export interface AuthResData {
message: string ,
user: {
  name: string,
  email: string,
  id: string,
}
}


@Injectable({providedIn: 'root'})

export class AuthService{
  activeLogoutTimer!: any;
  emptyUser: User = {
    _id: '',
    name:'',
    token:'',
    cashBack: -1,
    cashBackProcent: 0,
    admin: 0,
    email:'',
    tokenExpirationDate: '',
    status: '',
    telephone: '',
    locatie: '',
    employee: {fullName: '', position: '', user: '', access: 0},
    discount: {
      general: 0,
      category: []
    },
  };

  private user = new BehaviorSubject<User>(this.emptyUser);


  private createBasicAuthHeader(): HttpHeaders {
    const credentials = btoa(`${environment.API_USER}:${environment.API_PASSWORD}`);
    return new HttpHeaders({
      'Authorization': `Basic ${credentials}`
    });
  }

  get user$() {
      return from(Preferences.get({key: 'authData'})).pipe(map(data => {
        if(data.value){
          const userData = JSON.parse(data.value) as {
            _id: string,
            name: string,
            token: string,
            admin: number,
            cashBack: number,
            cashBackProcent: number
            email: string,
            tokenExpirationDate: any,
            status: string,
            telephone: string,
            locatie: string,
            discount: {
              general: number,
              category: {
                precent: number
                name: string,
                cat: string
              }[]
          },
            employee: {position: string, fullName: string, user: string, access: number}
          };
          const tokenDate = new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();
          if(tokenDate <= 0){
            return this.user.asObservable();
          } else if(tokenDate > 0) {
            this.user.next(userData);
            this.aoutoLogout(tokenDate);
            return this.user.asObservable();
          } else if(this.user.value.cashBack < userData.cashBack && this.user.value.cashBack !== -1){
            userData.cashBack = this.user.value.cashBack;
            this.user.next(userData);
            return this.user.asObservable();
          }else {
            this.user.next(userData);
            return this.user.asObservable();
          };
        } else {
          return this.user.asObservable();
        };
      }));
  };

  constructor(private http: HttpClient, private cartSrv: CartService, private tabSrv: TabsService){}

  onLogin(email: string, password: string){
    const headers = this.createBasicAuthHeader()
    return this.http.post<any>(`${environment.BASE_URL}auth/login`,{email, password, url: environment.APP_URL, adminEmail: environment.ADMIN_EMAIL, loc: environment.LOC}, {headers})
        .pipe(tap(this.setAndStoreUserData.bind(this)));
  }

  onRegister(name: string, email: string, tel: string, password: string, confirmPassword: string, firstCart: string, survey: string, id: string, loc: string, url: string){
    const headers = this.createBasicAuthHeader()
    return this.http.post<{message: string, id: string}>(`${environment.BASE_URL}auth/register`,{name, email, password, confirmPassword, firstCart, survey, tel, id, loc, url}, {headers});
  };

  verifyToken(token: string){
    return this.http.post<any>(`${environment.BASE_URL}auth/verify-token`, {token: token, adminEmail: environment.ADMIN_EMAIL})
        .pipe(tap(this.setAndStoreUserData.bind(this)));
  };

  sendResetEmail(email: string){
   return this.http.post<AuthResData>(`${environment.BASE_URL}auth/send-reset-email`, {email: email, loc: environment.LOC, url: environment.APP_URL });
  };

  resetPassword(token: string, password: string, confirmPassword: string){
    return this.http.post(`${environment.BASE_URL}auth/reset-password`, {token, password, confirmPassword, adminEmail: environment.ADMIN_EMAIL})
        .pipe(tap(this.setAndStoreUserData.bind(this)));
  }

  private setAndStoreUserData(userData: any){
    if(userData.message){
    } else {
      const decodedToken: any = jwt_decode(userData.token);
      const expirationDate: any = new Date(+Date.now().toString() + (decodedToken.exp-decodedToken.iat) * 1000);
      const data = JSON.stringify({
        _id: decodedToken.userId,
        name: userData.name,
        token: userData.token,
        admin: userData.admin,
        cashBack: userData.cashBack,
        cashBackProcent: userData.cashBackProcent,
        email: userData.email,
        tokenExpirationDate: expirationDate,
        status: userData.status,
        telephone: userData.telephone,
        locatie: userData.locatie,
        employee: {
          fullName: userData.employee.fullName,
          position: userData.employee.position,
          access: userData.employee.access,
          user: decodedToken.userId
        },
        discount: userData.discount
      });
      const tokenDate = new Date(expirationDate).getTime() - new Date().getTime();
      this.aoutoLogout(tokenDate);
      this.user.next(JSON.parse(data));
    Preferences.set({key: 'authData', value: data});
    };
  };

  updateCaskBack(user: User){
     this.user.next(user);
  }

  logout(){
    if(this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
    Preferences.remove({key: "authData"});
    Preferences.remove({key: 'data'});
    this.cartSrv.removeCart();
    this.tabSrv.clearQty();
    this.user.next(this.emptyUser);
  }

  getQrCode(data: string){
    const headers = this.createBasicAuthHeader()
    const options = {
      headers: headers,
      responseType: 'text' as 'json'
    };
    return this.http.get(`${environment.BASE_URL}users/generateQr?id=${data}`, options)
  }

  private aoutoLogout(duration: number) {
    if(this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(()=> {
      this.logout();
    }, duration);
  };

};
