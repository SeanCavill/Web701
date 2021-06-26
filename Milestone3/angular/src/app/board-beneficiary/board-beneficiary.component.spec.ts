import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardBeneficiaryComponent } from './board-beneficiary.component';

describe('BoardBeneficiaryComponent', () => {
  let component: BoardBeneficiaryComponent;
  let fixture: ComponentFixture<BoardBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardBeneficiaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
