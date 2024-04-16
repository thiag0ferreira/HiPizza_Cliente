import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeioAMeioPage } from './meio-a-meio.page';

describe('MeioAMeioPage', () => {
  let component: MeioAMeioPage;
  let fixture: ComponentFixture<MeioAMeioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeioAMeioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeioAMeioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
