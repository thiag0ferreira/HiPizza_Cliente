import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AbreprodPage } from './abreprod.page';

const routes: Routes = [
  {
    path: '',
    component: AbreprodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbreprodPageRoutingModule {}
