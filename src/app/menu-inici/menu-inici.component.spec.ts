import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuIniciComponent } from './menu-inici.component';

describe('MenuIniciComponent', () => {
  let component: MenuIniciComponent;
  let fixture: ComponentFixture<MenuIniciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuIniciComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuIniciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
