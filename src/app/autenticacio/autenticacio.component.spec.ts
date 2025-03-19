import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutenticacioComponent } from './autenticacio.component';

describe('AutenticacioComponent', () => {
  let component: AutenticacioComponent;
  let fixture: ComponentFixture<AutenticacioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutenticacioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutenticacioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
