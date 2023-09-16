import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParringProductPage } from './parring-product.page';

describe('ParringProductPage', () => {
  let component: ParringProductPage;
  let fixture: ComponentFixture<ParringProductPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParringProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
