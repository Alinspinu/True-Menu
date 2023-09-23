import { Component,  Inject, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, IonInput, ModalController } from '@ionic/angular';
import { RecipeIngredientService } from './recipe-ingredient.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { AddIngredientPage } from '../add-ingredient/add-ingredient.page';

interface Ing{
  name: string,
  _id: string,
  quantity: number | undefined,
  selected: boolean
}

interface Data{
  ing: {
    _id: string,
    qty: number
  }[],
  mode: string
  ingId: string
}

@Component({
  selector: 'app-recipe-ingredient',
  templateUrl: './recipe-ingredient.page.html',
  styleUrls: ['./recipe-ingredient.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecipeIngredientPage implements OnInit {

  @Input() data!: Data

  ingredients!: Ing[]
  filteredOptions: any[] = [];
  searchTerm: string = '';
  prodIng: boolean = false
  productName: string = ''
  onEdit: boolean = false
  title: string = "Update Recipe"

  constructor(
    private modalCtrl: ModalController,
    private ingSrv: RecipeIngredientService,
    private alertController: AlertController,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    ) {}

  ngOnInit(): void {
    this.ingSrv.getIngredients().subscribe(response => {
       this.ingredients = response
       this.ingredients.forEach(el => {
        this.data.ing.forEach(data => {
          if(el._id === data._id ){
              el.selected = true
              el.quantity = data.qty
          }
        })
       })
       this.filteredOptions = [...this.sortIngredients()];
    })
    this.setMode()
  }

  sortIngredients(){
    return this.ingredients.slice().sort((a,b)=> a.name.localeCompare(b.name))
  }

  onChange(event: any, qtyInput: IonInput){
    if(event.detail.checked){
      qtyInput.setFocus()
    }
  }

  showActions(){
    this.actionSheet.openModal(AddIngredientPage, {ing: [], mode:'', ingId: ''})
  }

  setMode(){
    if(this.data.mode === 'prod-ing'){
      this.prodIng = true
      this.title = "Add Product Ingredient"
    } else if(this.data.mode === 'on-edit'){
      this.onEdit = true
      this.title = "Edit Ingredients"
    }
  }


  filterOptions() {
    this.filteredOptions = this.ingredients.filter(option => {
      return option.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }


  cancel(){
    this.modalCtrl.dismiss()
  }

  closeModal() {
    const selectedOptions = this.ingredients
    .filter(ing => ing.selected)
    .map(ing => ({
      ingredient: ing._id,
      quantity: ing.quantity
    }));
    if(this.productName.length){
      this.modalCtrl.dismiss({ingredients: selectedOptions, name: this.productName});
    } else {
      this.modalCtrl.dismiss(selectedOptions)
    }
  }

  editIngredient(id: string){
    this.actionSheet.openModal(AddIngredientPage, {ing: [], mode: 'on-edit', ingId: id});
  }

  onDelete(ingredientId: string, index: number){
    this.ingSrv.deleteIngredients(ingredientId).subscribe(response => {
      this.filteredOptions.splice(index, 1)
    })
  }

  async presentAlert(name: string, ingredientId: string, index: number) {
    const alert = await this.alertController.create({
      header: 'Șterge',
      message: `Ești sigur că vrei să ștergi ${name}?`,
      buttons: [
        {
          text: 'Renunță',
          role: 'cancel'
        },
        {
          text: 'Șterge',
          role: 'confirm',
          handler: () => {
            this.onDelete(ingredientId, index);
          },
        },
      ]
    });
    await alert.present();
  }

}
