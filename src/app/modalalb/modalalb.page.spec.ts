import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalalbPage } from './modalalb.page';

describe('ModalalbPage', () => {
  let component: ModalalbPage;
  let fixture: ComponentFixture<ModalalbPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalalbPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalalbPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
