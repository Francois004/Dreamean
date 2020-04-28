import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfiltabPage } from './profiltab.page';

describe('ProfiltabPage', () => {
  let component: ProfiltabPage;
  let fixture: ComponentFixture<ProfiltabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfiltabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfiltabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
