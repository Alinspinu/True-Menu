import { Component, Inject, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
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
import { AddEntryPage } from 'src/app/CRUD/add/add-entry/add-entry.page';
import { DisplayQrPage } from 'src/app/shared/display-qr/display-qr.page';
import { DomSanitizer } from '@angular/platform-browser';


interface Data {
  ing: {
    _id: string,
    qty: number
  }[],
  mode: string,
  ingId: string,
}


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

  @Output() dayEv = new EventEmitter<any>()

  on: boolean = false
  tab!: string;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  user!: User;
  userSub!: Subscription;
  secondUserSub!: Subscription;
  emptyData: Data = {ing: [], mode: '', ingId: ''}

  private audioPlayer!: HTMLAudioElement;

  constructor(
    private tabSrv: TabsService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private authSrv: AuthService,
    private productSrv: ProductContentService,
    private sanitizer: DomSanitizer,
  ) {
    this.audioPlayer = new Audio('/assets/audio/ding.mp3')
   };


  ngOnInit() {
    this.getUser();
    this.getCurrentTab()
    console.log(this.isLoggedIn)
  }

  async openAddEntry(){
   const day = await this.actionSheet.openModal(AddEntryPage, this.emptyData)
   this.dayEv.emit(day)
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

  play(){
    if(!this.on){
      this.on = true;
      this.audioPlayer.play()
    }
  }

  openQrModal(){
    this.authSrv.getQrCode(this.user._id).subscribe((response: any) => {
      const data = {
        cashBack: this.user.cashBack,
        qrCode: response,
        username: this.user.name
      }
      this.actionSheet.openModal(DisplayQrPage, data)
    })
  }


  getQRCodeUrl(qrCodeData: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(qrCodeData));
  }

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
