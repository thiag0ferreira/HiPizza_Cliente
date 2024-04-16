import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstabelecimentosfavoritosPage } from './estabelecimentosfavoritos.page';

describe('EstabelecimentosfavoritosPage', () => {
  let component: EstabelecimentosfavoritosPage;
  let fixture: ComponentFixture<EstabelecimentosfavoritosPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstabelecimentosfavoritosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstabelecimentosfavoritosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
