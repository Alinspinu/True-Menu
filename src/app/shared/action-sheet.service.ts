import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { AddCategoryPage } from '../CRUD/add/add-category/add-category.page';
import { AddProductPage } from '../CRUD/add/add-product/add-product.page';
import { AuthPage } from '../auth/auth.page';
import { AddSubproductPage } from '../CRUD/add/add-subproduct/add-subproduct.page';
import { RegisterPage } from '../auth/register/register.page';
import { TipsPage } from '../cart/tips/tips.page';
import { CashBackPage } from '../cart/cash-back/cash-back.page';
import { EditProductComponent } from '../CRUD/edit/edit-product/edit-product.component';
import { EditCategoryComponent } from '../CRUD/edit/edit-category/edit-category.component';
import { EditSubProductComponent } from '../CRUD/edit/edit-sub-product/edit-sub-product.component';
import { ParringProductPage } from '../CRUD/add/parring-product/parring-product.page';
import { RecipeIngredientPage } from '../CRUD/add/recipe-ingredient/recipe-ingredient.page';
import { AddIngredientPage } from '../CRUD/add/add-ingredient/add-ingredient.page';
import { InviteAuthPage } from '../auth/invite-auth/invite-auth.page';
import { AddExtraPage } from '../CRUD/add/add-extra/add-extra.page';
import { BlackListPage } from '../CRUD/add/black-list/black-list.page';
import { DatePickerPage } from './date-picker/date-picker.page';

interface Data {
  ing: {
    _id: string,
    qty: number
  }[],
  mode: string,
  ingId: string,
}

@Injectable({
  providedIn: 'root'
})
export class ActionSheetService {

  emptyData: Data = {ing: [], mode: '', ingId: ''}

  constructor(private modalCtrl: ModalController, private alertController: AlertController) { }

  async showActions() {
    const result = await ActionSheet.showActions({
      title: 'Choose',
      message: 'Select an option to perform',
      options: [
        {
          title: 'Category',
        },
        {
          title: 'Cancel',
          style: ActionSheetButtonStyle.Cancel,
        },
      ],
    });

    if (result.index === 0) {
      this.openModal(AddCategoryPage, this.emptyData);
    }
    console.log('Action Sheet result:', result);
  }

  async showSubProduct() {
    const result = await ActionSheet.showActions({
      title: 'Choose',
      message: 'Select an option to perform',
      options: [
        {
          title: 'Product',
        },
        {
          title: 'Sub-Product',
        },
        {
          title: 'Cancel',
          style: ActionSheetButtonStyle.Cancel,
        },
      ],
    });

    if (result.index === 1) {
      this.openModal(AddSubproductPage, this.emptyData);
    } else if (result.index === 0) {
      this.openModal(AddProductPage, this.emptyData);
    }

    console.log('Action Sheet result:', result);
  }

  async showAdd(data: Data ):Promise<any> {
    const result = await ActionSheet.showActions({
      title: 'Choose',
      message: 'Select an option to perform',
      options: [
        {
          title: 'Add Parring Product',
        },
        {
          title: 'Add Ingredients to Recipe',
        },
        {
          title: 'Add Product Ingredient',
        },
        {
          title: 'Add Ingredient',
        },
        {
          title: 'Add-Topping',
        },
        {
          title: 'Edit Ingredient',
        },

        {
          title: 'Cancel',
          style: ActionSheetButtonStyle.Cancel,
        },
      ],
    });

    if (result.index === 0) {
     return this.openModal(ParringProductPage, this.emptyData);
    } else if (result.index === 1) {
      return this.openModal(RecipeIngredientPage, data);
    } else if (result.index === 2) {
      data.mode = 'prod-ing'
      data.ing = []
      return this.openModal(RecipeIngredientPage, data)
    } else if (result.index === 3){
      return this.openModal(AddIngredientPage, this.emptyData)
    } else if(result.index === 4){
      return this.openModal(AddExtraPage, this.emptyData)
    } else if (result.index == 5){
      data.mode = 'on-edit';
      data.ing = []
      return this.openModal(RecipeIngredientPage, data)
    }

    console.log('Action Sheet result:', result);
  }

  async openModal(
    component: typeof AddCategoryPage |
               typeof AddProductPage |
               typeof AddSubproductPage |
               typeof TipsPage |
               typeof CashBackPage |
               typeof ParringProductPage |
               typeof RecipeIngredientPage |
               typeof AddIngredientPage |
               typeof InviteAuthPage |
               typeof AddExtraPage,

    dta: Data
               ) {
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: {data: dta}
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    return data
  }


  async openEdit(
    component: typeof EditCategoryComponent |
               typeof EditProductComponent |
               typeof EditSubProductComponent|
               typeof ParringProductPage,
               id: string,
               catIndex: number,
               prodIndex: number){
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: {
        id: id,
        catIndex: catIndex,
        prodIndex: prodIndex,
      },
    });
    console.log("action-sheet", id)
    modal.present();
  };

  async openAuth(
    component: typeof AuthPage |
                typeof RegisterPage |
                typeof BlackListPage |
                typeof DatePickerPage
                ) {
    const modal = await this.modalCtrl.create({
      component: component,
    });

    modal.present();
    const { data } = await modal.onDidDismiss();
    return data
  };



  async chooseSubProduct(options: string[]) {
    const inputs = options.map(option => {
      return {
          label: option,
          type: 'radio' as const,
          value: option,
          cssClass: 'option'
      };
  });
    const alert = await this.alertController.create({
      header: 'Alege',
      message: `Alege o opțiune`,
      buttons: [
        {
          text: 'Alege',
          role: 'confirm',
        },
      ],
      inputs: inputs,
      cssClass: 'extraAlert'
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === "confirm"){
      console.log(result)
      return result.data.values
    } else {
      return null
    }
  }

  async chooseExtra(options: string[]) {
    const inputs = options.map(option => {
      return {
          label: option,
          type: 'checkbox' as const,
          value: option,

      };
  });
    const alert = await this.alertController.create({
      header: 'Extra',
      message: `Adaugă extra`,
      buttons: [
        {
          text: 'Nu Muțumesc!',
          role: 'cancel'
        },
        {
          text: 'Adaugă',
          role: 'confirm',
        },
      ],
      inputs: inputs,
      cssClass: 'extraAlert'
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === 'confirm'){
      return result.data.values
    } else {
      return null
    }
  }



};
