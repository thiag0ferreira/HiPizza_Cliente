import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstabelecimentoPage } from './estabelecimento.page';

const routes: Routes = [
  {
    path: '',
    component: EstabelecimentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstabelecimentoPageRoutingModule {}
