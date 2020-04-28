import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListenpopovPage } from './listenpopov.page';

describe('ListenpopovPage', () => {
  let component: ListenpopovPage;
  let fixture: ComponentFixture<ListenpopovPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListenpopovPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListenpopovPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
