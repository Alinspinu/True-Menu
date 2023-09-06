import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TabContentPage } from '../../tab-content/tab-content.page';
import { TabHeaderPage } from '../../tab-header/tab-header.page';


@Component({
  selector: 'app-coffee',
  templateUrl: 'coffee.page.html',
  styleUrls: ['coffee.page.scss'],
  standalone: true,
  imports: [IonicModule, TabContentPage, TabHeaderPage, CommonModule]
})
export class CoffeePage implements OnInit {
  isDarkMode!: boolean;
  tab: string = 'coffee';
  constructor() {}

  ngOnInit(): void {
    this.detectColorScheme();
  };

  detectColorScheme() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = darkModeMediaQuery.matches;
    console.log(this.isDarkMode);
    darkModeMediaQuery.addListener((event) => {
      this.isDarkMode = event.matches;
    });
  };


};
