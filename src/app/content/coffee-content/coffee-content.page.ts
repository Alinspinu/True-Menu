import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

register();

@Component({
  selector: 'app-coffee-content',
  templateUrl: './coffee-content.page.html',
  styleUrls: ['./coffee-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class CoffeeContentPage implements OnInit {

  backTab!: string;

  constructor() { }

  ngOnInit() {
  }

}
