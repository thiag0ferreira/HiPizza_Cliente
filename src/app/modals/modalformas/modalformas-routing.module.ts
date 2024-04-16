import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalformasPage } from './modalformas.page';

const routes: Routes = [
  {
    path: '',
    component: ModalformasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalformasPageRoutingModule {}
