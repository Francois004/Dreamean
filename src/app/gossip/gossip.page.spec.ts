import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GossipPage } from './gossip.page';

describe('GossipPage', () => {
  let component: GossipPage;
  let fixture: ComponentFixture<GossipPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GossipPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GossipPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
