import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstabelecimentosfavoritosPageRoutingModule } from './estabelecimentosfavoritos-routing.module';

import { EstabelecimentosfavoritosPage } from './estabelecimentosfavoritos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstabelecimentosfavoritosPageRoutingModule
  ],
  declarations: [EstabelecimentosfavoritosPage]
})
export class EstabelecimentosfavoritosPageModule {}
