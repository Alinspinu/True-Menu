import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { ImagePickerComponent } from 'src/app/shared/image-picker/image-picker.component';
import { base64toBlob } from 'src/app/shared/utils/base64toBlob';
import { HttpClient} from '@angular/common/http';
import { SpinnerPage } from '../../../shared/spinner/spinner.page';
import { Category } from '../category.model';
import { TabsService } from 'src/app/tabs/tabs.service';
import { showToast } from 'src/app/shared/utils/toast-controller';

interface Response {
  message: string,
  cat: Category
};

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.page.html',
  styleUrls: ['./add-category.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule, ImagePickerComponent, SpinnerPage]
})

export class AddCategoryPage implements OnInit {
  categories!: string;
  currentCategory!: string;
  baseUrl: string = 'http://localhost:8080/api-true/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/api-true/';
  isLoading = false;
  form!: FormGroup;
  mainCategories: {name: string, id: string}[] = [
    {name: 'Food', id: 'food'},
    {name: 'Coffee', id: 'coffee'},
    {name: 'Bar', id: 'bar'},
    {name: 'Shop', id: 'shop'},
    {name: 'Merch', id: 'merch'},
  ]
  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private tabSrv: TabsService,
  ) { }

  ngOnInit() {
    this.getCurrentTab();
    this.form = new FormGroup({
      category: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      order: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      image: new FormControl(null),
    });
  };

  getCurrentTab() {
    const currentTab = window.location.href;
    const indexTab = currentTab.lastIndexOf('/');
    const tab = currentTab.slice(indexTab +1);
    return this.currentCategory = tab;
  };



  confirm(){
    this.isLoading = true;
    if(this.form.valid){
      const catData = new FormData();
      catData.append('name', this.form.value.category);
      catData.append('mainCat', this.currentCategory);
      catData.append('order', this.form.value.order);
      catData.append('image', this.form.value.image);
     return this.http.post<Response>(`${this.newUrl}cat-add`, catData).subscribe((res)=>{
      this.tabSrv.onCategoryAdd(res.cat);
      showToast(this.toastCtrl, res.message, 3000);
      this.isLoading = false;
        return this.cancel();
     })
    } else{
      this.isLoading = false;
      return this.cancel();
    }
  }

  cancel(){
    return this.modalCtrl.dismiss(null, 'cancel');
  };

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
      };
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({image: imageFile});
  };

}
