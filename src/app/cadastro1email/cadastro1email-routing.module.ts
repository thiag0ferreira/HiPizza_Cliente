import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Cadastro1emailPage } from './cadastro1email.page';

const routes: Routes = [
  {
    path: '',
    component: Cadastro1emailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Cadastro1emailPageRoutingModule {}
