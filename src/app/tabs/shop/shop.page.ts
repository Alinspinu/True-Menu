import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabContentPage } from '../../tab-content/tab-content.page';
import { TabHeaderPage } from '../../tab-header/tab-header.page';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TabContentPage, TabHeaderPage]
})
export class ShopPage implements OnInit{
  isDarkMode!: boolean;
  constructor() { }

ngOnInit(): void {
  this.detectColorScheme();
}

  detectColorScheme() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = darkModeMediaQuery.matches;
    console.log(this.isDarkMode);
    darkModeMediaQuery.addListener((event) => {
      this.isDarkMode = event.matches;
    });
  };
};
