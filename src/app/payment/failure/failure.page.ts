import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-failure',
  templateUrl: './failure.page.html',
  styleUrls: ['./failure.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FailurePage implements OnInit {
 @Input() errorMessage!: string
  constructor() { }

  ngOnInit() {
  }

}
