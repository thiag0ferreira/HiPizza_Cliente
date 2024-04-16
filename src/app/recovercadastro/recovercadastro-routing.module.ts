import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecovercadastroPage } from './recovercadastro.page';

const routes: Routes = [
  {
    path: '',
    component: RecovercadastroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecovercadastroPageRoutingModule {}
