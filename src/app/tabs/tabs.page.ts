import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class TabsPage implements OnInit, AfterViewInit, OnDestroy {
  isCart: boolean = false;
  currentTab!: string;
  isDarkMode!: boolean;
  cartSubscription!: Subscription;
  productCount: number = 0;
  constructor(private cartService: CartService, private route: ActivatedRoute) {};

  detectColorScheme() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = darkModeMediaQuery.matches;

    darkModeMediaQuery.addListener((event) => {
      this.isDarkMode = event.matches;
    });
  };


  ngAfterViewInit(): void {
    this.detectColorScheme();
  };

  ngOnInit(): void {
      this.cartSubscription = this.cartService.cartSend$.subscribe(cart => {
        this.productCount = cart.productCount;
      });
  };

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  };

isTab(tab: string){
  if(tab === 'cart'){
    this.isCart = true;
  } else{
    this.isCart = false;
  };
};


};
