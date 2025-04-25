import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesPagamentComponent } from './proces-pagament.component';

describe('ProcesPagamentComponent', () => {
  let component: ProcesPagamentComponent;
  let fixture: ComponentFixture<ProcesPagamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcesPagamentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesPagamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
