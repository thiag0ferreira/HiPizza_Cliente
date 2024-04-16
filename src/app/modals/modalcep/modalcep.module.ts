import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalcepPageRoutingModule } from './modalcep-routing.module';

import { ModalcepPage } from './modalcep.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalcepPageRoutingModule
  ],
  declarations: [ModalcepPage]
})
export class ModalcepPageModule {}
