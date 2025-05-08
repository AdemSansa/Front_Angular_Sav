import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTechniciansComponent } from './my-technicians.component';

describe('MyTechniciansComponent', () => {
  let component: MyTechniciansComponent;
  let fixture: ComponentFixture<MyTechniciansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTechniciansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTechniciansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
