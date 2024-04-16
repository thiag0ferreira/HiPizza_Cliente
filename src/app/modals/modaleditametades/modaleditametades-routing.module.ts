import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModaleditametadesPage } from './modaleditametades.page';

const routes: Routes = [
  {
    path: '',
    component: ModaleditametadesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModaleditametadesPageRoutingModule {}
