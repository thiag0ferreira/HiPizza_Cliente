import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstabelecimentosPageRoutingModule } from './estabelecimentos-routing.module';

import { EstabelecimentosPage } from './estabelecimentos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstabelecimentosPageRoutingModule
  ],
  declarations: [EstabelecimentosPage]
})
export class EstabelecimentosPageModule {}
