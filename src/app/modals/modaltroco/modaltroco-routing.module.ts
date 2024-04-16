import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModaltrocoPage } from './modaltroco.page';

const routes: Routes = [
  {
    path: '',
    component: ModaltrocoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModaltrocoPageRoutingModule {}
