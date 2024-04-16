import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalformasPageRoutingModule } from './modalformas-routing.module';

import { ModalformasPage } from './modalformas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalformasPageRoutingModule
  ],
  declarations: [ModalformasPage]
})
export class ModalformasPageModule {}
