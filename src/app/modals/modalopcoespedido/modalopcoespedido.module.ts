import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalopcoespedidoPageRoutingModule } from './modalopcoespedido-routing.module';

import { ModalopcoespedidoPage } from './modalopcoespedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalopcoespedidoPageRoutingModule
  ],
  declarations: [ModalopcoespedidoPage]
})
export class ModalopcoespedidoPageModule {}
