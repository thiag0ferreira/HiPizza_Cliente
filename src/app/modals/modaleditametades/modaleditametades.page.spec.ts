import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModaleditametadesPage } from './modaleditametades.page';

describe('ModaleditametadesPage', () => {
  let component: ModaleditametadesPage;
  let fixture: ComponentFixture<ModaleditametadesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaleditametadesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModaleditametadesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
