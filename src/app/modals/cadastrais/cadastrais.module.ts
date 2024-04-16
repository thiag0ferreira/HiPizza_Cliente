import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastraisPageRoutingModule } from './cadastrais-routing.module';

import { CadastraisPage } from './cadastrais.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastraisPageRoutingModule
  ],
  declarations: [CadastraisPage]
})
export class CadastraisPageModule {}
