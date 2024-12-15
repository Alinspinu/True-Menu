import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class QrCodePage implements OnInit {

  showShedule: boolean = false

  iconsDay: any = [
    {name: 'fb', url: '../../../assets/normal mode/fb.svg', path: 'https://www.facebook.com/truefinecoffee/', active: false, urlActive: '../../../assets/normal mode/fb-active.svg' },
    {name: 'insta', url: '../../../assets/normal mode/insta.svg', path: 'https://www.instagram.com/truefinecoffee/', active: false, urlActive: '../../../assets/normal mode/insta-active.svg'},
    {name: 'tel', url: '../../../assets/normal mode/tel.svg', path: 'tel: +40751380040', active: false, urlActive: '../../../assets/normal mode/tel-active.svg'},
    {name: 'mail', url: '../../../assets/normal mode/mail.svg', path: 'mailto:contact@truefinecoffee.ro', active: false, urlActive: '../../../assets/normal mode/mail-active.svg'},
    {name: 'loc', url: '../../../assets/normal mode/loc.svg', path: 'https://www.google.com/maps/search/?api=1&query=47.1567416,27.5824489', active: false, urlActive: '../../../assets/normal mode/loc-active.svg'},
    {name: 'shedule', url: '../../../assets/normal mode/shedule.svg', path: '', active: false, urlActive: '../../../assets/normal mode/shedule-active.svg'},
  ]

  iconsNight: any = [
    {name: 'fb', url: '../../../assets/dark mode/fb.svg', path: 'https://www.facebook.com/truefinecoffee/', active: false, urlActive: '../../../assets/dark mode/fb-active.svg' },
    {name: 'insta', url: '../../../assets/dark mode/insta.svg', path: 'https://www.instagram.com/truefinecoffee/', active: false, urlActive: '../../../assets/dark mode/insta-active.svg'},
    {name: 'tel', url: '../../../assets/dark mode/tel.svg', path: 'tel: +40751380040', active: false, urlActive: '../../../assets/dark mode/tel-active.svg'},
    {name: 'mail', url: '../../../assets/dark mode/mail.svg', path: 'mailto:contact@truefinecoffee.ro', active: false, urlActive: '../../../assets/dark mode/mail-active.svg'},
    {name: 'loc', url: '../../../assets/dark mode/loc.svg', path: 'https://www.google.com/maps/search/?api=1&query=47.1567416,27.5824489', active: false, urlActive: '../../../assets/dark mode/loc-active.svg'},
    {name: 'shedule', url: '../../../assets/dark mode/shedule.svg', path: '', active: false, urlActive: '../../../assets/dark mode/shedule-active.svg'},
  ]




  icons: any = this.iconsDay

  constructor() { }

  ngOnInit() {
    this.getThemeStatus()
  }



  getThemeStatus(){
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if(prefersDark.matches){
      this.icons = this.iconsNight
    } else {
      this.icons = this.iconsDay
    }
  }

  action(icon: any){
    let iconUrl = icon.url
    icon.active = !icon.active
    icon.url = icon.urlActive
    icon.urlActive = iconUrl
    if(icon.name !== 'shedule'){
    setTimeout(() => {
      let iconUrl = icon.url
      icon.active = !icon.active
      icon.url = icon.urlActive
      icon.urlActive = iconUrl
      window.location.href = icon.path
    }, 300)
    } else {
      this.showShedule = !this.showShedule
    }
  }

}
