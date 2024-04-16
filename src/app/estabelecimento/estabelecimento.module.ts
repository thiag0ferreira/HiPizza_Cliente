import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstabelecimentoPageRoutingModule } from './estabelecimento-routing.module';

import { EstabelecimentoPage } from './estabelecimento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstabelecimentoPageRoutingModule
  ],
  declarations: [EstabelecimentoPage]
})
export class EstabelecimentoPageModule {}
