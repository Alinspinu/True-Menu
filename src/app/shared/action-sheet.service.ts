import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

@Injectable({
  providedIn: 'root'
})
export class ActionSheetService {

  constructor(private modalCtrl: ModalController) { }

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
      this.openModal(AddCategoryPage);
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
      this.openModal(AddSubproductPage);
    } else if (result.index === 0) {
      this.openModal(AddProductPage);
    }

    console.log('Action Sheet result:', result);
  }

  async showAdd():Promise<any> {
    const result = await ActionSheet.showActions({
      title: 'Choose',
      message: 'Select an option to perform',
      options: [
        {
          title: 'Parring Product',
        },
        {
          title: 'Recipe Ingredient',
        },
        {
          title: 'Cancel',
          style: ActionSheetButtonStyle.Cancel,
        },
      ],
    });

    if (result.index === 0) {
     return this.openModal(ParringProductPage);
    } else if (result.index === 1) {
      return this.openModal(RecipeIngredientPage);
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
               typeof RecipeIngredientPage
               ) {
    const modal = await this.modalCtrl.create({
      component: component,
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

  async openAuth(component: typeof AuthPage | typeof RegisterPage) {
    const modal = await this.modalCtrl.create({
      component: component,
    });
    modal.present();
  };
};
