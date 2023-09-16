import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TabContentPage } from '../../content/tab-content/tab-content.page';
import { TabHeaderPage } from '../../content/tab-header/tab-header.page';

@Component({
  selector: 'app-bar',
  templateUrl: 'bar.page.html',
  styleUrls: ['bar.page.scss'],
  standalone: true,
  imports: [IonicModule, TabContentPage, TabHeaderPage, CommonModule],
})
export class BarPage {
  isDarkMode!: boolean;

  constructor() {}

  ngOnInit(): void {
    this.detectColorScheme();

  };

  detectColorScheme() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = darkModeMediaQuery.matches;
    darkModeMediaQuery.addListener((event) => {
      this.isDarkMode = event.matches;
    });
  };

};
