import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabsService } from '../../tabs/tabs.service';
import { Category } from '../../CRUD/add/category.model';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogoPagePage } from '../../shared/logo-page/logo-page.page';
import { AuthService } from '../../auth/auth.service';
import User from '../../auth/user.model';
import { EditCategoryComponent } from '../../CRUD/edit/edit-category/edit-category.component';


@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.page.html',
  styleUrls: ['./tab-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, LogoPagePage]
})

export class TabContentPage implements OnInit, OnDestroy {
  isLoadding: boolean = false;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  socialUrl!: string;
  categories!: Category[];
  isDarkMode!: boolean;
  currentCategory!: string;
  tabSubscription!: Subscription;
  userSub!: Subscription;
  user!: User;

  constructor(
    private tabSrv: TabsService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private authSrv: AuthService
  ) { }

  ngOnInit() {
    this.getCurrentTab();
    this.fetchCategory();
    this.detectColorScheme();
    this.getUser();
  }


  getCurrentTab() {
    const currentTab = window.location.href;
    const indexTab = currentTab.lastIndexOf('/');
    const tab = currentTab.slice(indexTab +1);
    return this.currentCategory = tab;
  };

  fetchCategory(){
    this.isLoadding = true;
    this.tabSubscription = this.tabSrv.categorySend$.subscribe(res => {
      this.categories = [];
      for(let category of res){
        if(category.mainCat === this.currentCategory){
          this.categories.push(category);
        }
        this.isLoadding = false;
      };
    });
  };

  getUser(){
    this.userSub = this.authSrv.user$.subscribe((res: any ) => {
      if(res){
        res.subscribe((userData: any) => {
            this.user = userData;
            this.isLoggedIn = this.user.status === 'active' ? true : false;
            this.isAdmin = this.user.admin === 1 ? true : false;
        });
      };
    });
    };

  ngOnDestroy(): void {
    this.tabSubscription.unsubscribe();
  };

  detectColorScheme() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = darkModeMediaQuery.matches;
    console.log(this.isDarkMode);
    darkModeMediaQuery.addListener((event) => {
      this.isDarkMode = event.matches;
    });
  };

  onEdit(id: string){
    this.actionSheet.openEdit(EditCategoryComponent, id, 0, 0);
  };
};

