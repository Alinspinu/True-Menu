import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { VoucherService } from './voucher.service';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { CapitalizePipe } from 'src/app/shared/capitalize.pipe';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.page.html',
  styleUrls: ['./voucher.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, CapitalizePipe]
})
export class VoucherPage implements OnInit {

  voucherForm!: FormGroup
  checkForm!: FormGroup

  voucher!: any
  checkMode: boolean = true

  constructor(
    @Inject(VoucherService) private voucherSrv: VoucherService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.setUpCheckForm()
    this.setUpVoucherForm()
  }

  addVoucher(){
    if(this.voucherForm.valid){
      const code = this.voucherForm.value.code
      const value = this.voucherForm.value.value
      this.voucherSrv.saveVoucher(code, +value).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 5000)
          this.voucherForm.reset()
        }
      })
    }
  }

  tryAgain(){
   this.voucher = null
  }


  checkVoucher(){
    if(this.checkForm.valid){
      const code = this.checkForm.value.code
      this.voucherSrv.verfyVoucher(code).subscribe(response => {
        if(response){
          this.voucher = response.voucher
          showToast(this.toastCtrl, response.message, 5000)
          this.checkForm.reset()
        }
      })
    }
  }


  setUpVoucherForm(){
    this.voucherForm = new FormGroup({
      code: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      value: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
    });
  }

  setUpCheckForm(){
    this.checkForm = new FormGroup({
      code: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
    });
  }

  useVoucher(id: string){
    this.voucherSrv.useVoucher(id).subscribe(response => {
      if(response){
        showToast(this.toastCtrl, response.message, 5000)
        setTimeout(() => {
          this.voucher = null
        }, 3000)
      }
    })
  }



}
