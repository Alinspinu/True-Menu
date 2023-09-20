import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { RecipeIngredientService } from './recipe-ingredient.service';

interface Ing{
  name: string,
  _id: string,
  quantity: number | undefined,
  selected: boolean
}

@Component({
  selector: 'app-recipe-ingredient',
  templateUrl: './recipe-ingredient.page.html',
  styleUrls: ['./recipe-ingredient.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecipeIngredientPage implements OnInit {

  ingredients!: Ing[]

  filteredOptions: any[] = [];
  searchTerm: string = '';

  constructor(
    private modalCtrl: ModalController,
    private ingSrv: RecipeIngredientService,
    ) {}

  ngOnInit(): void {
    this.ingSrv.getIngredients().subscribe(response => {
       this.ingredients = response
       this.filteredOptions = [...this.ingredients];
       console.log(this.ingredients)
    })
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
    console.log(selectedOptions)
    this.modalCtrl.dismiss(selectedOptions);
  }

}
