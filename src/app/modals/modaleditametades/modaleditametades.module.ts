import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModaleditametadesPageRoutingModule } from './modaleditametades-routing.module';

import { ModaleditametadesPage } from './modaleditametades.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModaleditametadesPageRoutingModule
  ],
  declarations: [ModaleditametadesPage]
})
export class ModaleditametadesPageModule {}
