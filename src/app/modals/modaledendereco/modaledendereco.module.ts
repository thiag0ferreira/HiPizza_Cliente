import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModaledenderecoPageRoutingModule } from './modaledendereco-routing.module';

import { ModaledenderecoPage } from './modaledendereco.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModaledenderecoPageRoutingModule
  ],
  declarations: [ModaledenderecoPage]
})
export class ModaledenderecoPageModule {}
