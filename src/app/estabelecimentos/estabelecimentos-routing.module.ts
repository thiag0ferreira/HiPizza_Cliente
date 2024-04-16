import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstabelecimentoPage } from '../estabelecimento/estabelecimento.page';

import { EstabelecimentosPage } from './estabelecimentos.page';

const routes: Routes = [
  { path: '', component: EstabelecimentosPage },
  { path: 'estabelecimento', component: EstabelecimentoPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstabelecimentosPageRoutingModule {}
