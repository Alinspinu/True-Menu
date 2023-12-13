import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams } from '@ionic/angular';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { RegisterPage } from '../register/register.page';
import { AuthPage } from '../auth.page';

@Component({
  selector: 'app-invite-auth',
  templateUrl: './invite-auth.page.html',
  styleUrls: ['./invite-auth.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InviteAuthPage implements OnInit {

    mode: boolean = false

  constructor(
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private navPar: NavParams,
  ) { }

  ngOnInit() {
    const data = this.navPar.get('data')
    if(data){
      this.mode = data
      console.log(data)
    }
  }

  triggerEscape(){
    console.log('esc')
    triggerEscapeKeyPress()
  }

  onRegister(){
    this.actionSheet.openAuth(RegisterPage)
    triggerEscapeKeyPress()
  }

  onSignIn(){
    this.actionSheet.openAuth(AuthPage)
    triggerEscapeKeyPress()
  }

}
