import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InviteAuthPage } from './invite-auth.page';

describe('InviteAuthPage', () => {
  let component: InviteAuthPage;
  let fixture: ComponentFixture<InviteAuthPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InviteAuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
