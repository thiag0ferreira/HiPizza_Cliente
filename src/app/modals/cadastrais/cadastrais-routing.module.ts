import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastraisPage } from './cadastrais.page';

const routes: Routes = [
  {
    path: '',
    component: CadastraisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastraisPageRoutingModule {}
