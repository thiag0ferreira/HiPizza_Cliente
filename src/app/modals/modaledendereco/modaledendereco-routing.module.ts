import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModaledenderecoPage } from './modaledendereco.page';

const routes: Routes = [
  {
    path: '',
    component: ModaledenderecoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModaledenderecoPageRoutingModule {}
