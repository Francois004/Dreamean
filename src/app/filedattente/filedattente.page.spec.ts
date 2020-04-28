import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FiledattentePage } from './filedattente.page';

describe('FiledattentePage', () => {
  let component: FiledattentePage;
  let fixture: ComponentFixture<FiledattentePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiledattentePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FiledattentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
