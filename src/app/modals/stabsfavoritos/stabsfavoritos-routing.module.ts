import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StabsfavoritosPage } from './stabsfavoritos.page';

const routes: Routes = [
  {
    path: '',
    component: StabsfavoritosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StabsfavoritosPageRoutingModule {}
