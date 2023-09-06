import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookiePolicyPage } from './cookie-policy.page';

describe('CookiePolicyPage', () => {
  let component: CookiePolicyPage;
  let fixture: ComponentFixture<CookiePolicyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CookiePolicyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
