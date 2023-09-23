import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.page.html',
  styleUrls: ['./timer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TimerPage implements OnInit {

  maxCountdown: number = 25;
  countdown: number = this.maxCountdown;

  constructor() {}

  ngOnInit(): void {
    setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      }
    }, 1000);

  }


}
