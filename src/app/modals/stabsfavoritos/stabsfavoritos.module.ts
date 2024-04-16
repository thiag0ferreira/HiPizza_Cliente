import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StabsfavoritosPageRoutingModule } from './stabsfavoritos-routing.module';

import { StabsfavoritosPage } from './stabsfavoritos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StabsfavoritosPageRoutingModule
  ],
  declarations: [StabsfavoritosPage]
})
export class StabsfavoritosPageModule {}
