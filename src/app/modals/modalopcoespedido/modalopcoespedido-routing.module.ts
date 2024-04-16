import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalopcoespedidoPage } from './modalopcoespedido.page';

const routes: Routes = [
  {
    path: '',
    component: ModalopcoespedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalopcoespedidoPageRoutingModule {}
