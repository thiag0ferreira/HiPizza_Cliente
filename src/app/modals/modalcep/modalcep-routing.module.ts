import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalcepPage } from './modalcep.page';

const routes: Routes = [
  {
    path: '',
    component: ModalcepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalcepPageRoutingModule {}
