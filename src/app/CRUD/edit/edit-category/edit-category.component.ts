import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { Category } from '../../add/category.model';
import { ImagePickerComponent } from 'src/app/shared/image-picker/image-picker.component';
import { SpinnerPage } from 'src/app/shared/spinner/spinner.page';
import { base64toBlob } from 'src/app/shared/utils/base64toBlob';
import { showToast, triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import { TabsService } from 'src/app/tabs/tabs.service';
import { environment } from 'src/environments/environment';


interface RespData{
  message: string,
  category: Category
};


@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule, ImagePickerComponent, SpinnerPage],
})
export class EditCategoryComponent  implements OnInit {

  categories!: string;
  categoryId!: string;
  category!: Category;
  currentCategory!: string;

  isLoading = false;
  form!: FormGroup;
  mainCategories: {name: string, id: string}[] = [
    {name: 'Food', id: 'food'},
    {name: 'Coffee', id: 'coffee'},
    {name: 'Bar', id: 'bar'},
    {name: 'Shop', id: 'shop'},
    {name: 'Merch', id: 'merch'},
  ];
  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private navParams: NavParams,
    private tabSrv: TabsService,
  ) { }

  ngOnInit() {
    this.categoryId = this.navParams.get('id');
    this.getCategory();
    this.form = new FormGroup({
      category: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      mainCat: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      order: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      image: new FormControl(null),
    });
    this.form.get('category')?.setValue(this.category.name);
    this.form.get('mainCat')?.setValue(this.category.mainCat);
    this.form.get('order')?.setValue(this.category.order);
  };



getCategory(){
  const category = this.tabSrv.getCategory(this.categoryId);
  if(category){
    this.category = category;
  };
};

  confirm(){
    this.isLoading = true;
    if(this.form.valid){
      const catData = new FormData();
      catData.append('name', this.form.value.category);
      catData.append('categoryId', this.categoryId);
      catData.append('image', this.form.value.image);
      catData.append('mainCat', this.form.value.mainCat);
      catData.append('order', this.form.value.order);
     return this.http.put<RespData>(`${environment.BASE_URL}cat/cat`, catData).subscribe((res)=>{
      this.tabSrv.onCategoryEdit(res.category);
      showToast(this.toastCtrl, res.message, 3000);
      this.isLoading = false;
        return this.cancel();
     }, error=> {
      console.log(error.stack);
      showToast(this.toastCtrl, error.error.message, 3000);
     });
    } else{
      this.isLoading = false;
      return this.cancel();
    };
  };

  cancel(){
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  onImagePicked(imageData: string | File){
    let imageFile;
    if(typeof imageData === 'string'){
      try{
      imageFile = base64toBlob(
      imageData.replace(/^data:image\/(png|jpe?g|gif|webp);base64,/, ''),
      'image/jpeg'
      );
      } catch (error) {
        console.log(error);
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({image: imageFile});
  };


  onDelete(){
    this.http.delete<{message: string}>(`${environment.BASE_URL}cat/cat?id=${this.categoryId}`).subscribe(res => {
      this.tabSrv.catDelete(this.categoryId);
      triggerEscapeKeyPress();
      showToast(this.toastCtrl, res.message, 3000);
    }, error => {
      console.log(error);
      showToast(this.toastCtrl, error.error.message, 3000);
      triggerEscapeKeyPress();
    })
  }

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.onDelete();
      },
    },
  ];

}
