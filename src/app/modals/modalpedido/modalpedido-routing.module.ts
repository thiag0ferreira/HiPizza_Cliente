import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalpedidoPage } from './modalpedido.page';

const routes: Routes = [
  {
    path: '',
    component: ModalpedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalpedidoPageRoutingModule {}
