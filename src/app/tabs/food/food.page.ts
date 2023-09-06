import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TabContentPage } from '../../tab-content/tab-content.page';
import { TabHeaderPage } from '../../tab-header/tab-header.page';


@Component({
  selector: 'app-food',
  templateUrl: 'food.page.html',
  styleUrls: ['food.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, TabContentPage, TabHeaderPage],
})
export class FoodPage implements OnInit{

  isDarkMode!: boolean
  constructor() {}

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
