import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstabelecimentosfavoritosPage } from './estabelecimentosfavoritos.page';

const routes: Routes = [
  {
    path: '',
    component: EstabelecimentosfavoritosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstabelecimentosfavoritosPageRoutingModule {}
