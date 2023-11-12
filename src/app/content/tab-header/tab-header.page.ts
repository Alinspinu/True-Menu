import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { TabsService } from '../../tabs/tabs.service';
import { AuthPage } from '../../auth/auth.page';
import { AuthService } from '../../auth/auth.service';
import User from '../../auth/user.model';
import { Subscription } from 'rxjs';
import { CapitalizePipe } from '../../shared/capitalize.pipe';
import { BlackListPage } from 'src/app/CRUD/add/black-list/black-list.page';
import { ProductContentService } from '../product-content/product-content.service';
@Component({
  selector: 'app-tab-header',
  templateUrl: './tab-header.page.html',
  styleUrls: ['./tab-header.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, AuthPage, CapitalizePipe]
})
export class TabHeaderPage implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() imgPath: string = '';
  tab!: string;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  user!: User;
  userSub!: Subscription;
  secondUserSub!: Subscription;

  constructor(
    private tabSrv: TabsService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private authSrv: AuthService,
    private productSrv: ProductContentService,
  ) { };


  ngOnInit() {
    this.getUser();
    this.getCurrentTab()
  }

  getCurrentTab() {
    const currentTab = window.location.href;
    const indexTab = currentTab.lastIndexOf('/');
    const tab = currentTab.slice(indexTab +1);
    return this.tab = tab;
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.secondUserSub.unsubscribe();
    };


  showActions(){
    this.actionSheet.showActions();
  };


  getUser(){
    this.userSub = this.authSrv.user$.subscribe((res: any ) => {
      if(res){
        this.secondUserSub = res.subscribe((userData: any) => {
            this.user = userData;
            this.user.cashBack = this.round(this.user.cashBack);
            this.isLoggedIn = this.user.status === 'active' ? true : false;
            this.isAdmin = this.user.admin === 1 ? true : false;
        });
      };
    });
    };


    async blackList(){
    const blackList = await this.actionSheet.openAuth(BlackListPage)
    console.log(blackList)
    this.productSrv.updateBlackList(blackList).subscribe(res => {
      console.log(res)
    })
    }


  logout(){
   this.authSrv.logout();
  };

  openLogin(){
    this.actionSheet.openAuth(AuthPage);
  };


 private round(num: number) {
    return Math.round(num * 100) / 100;
};




}
