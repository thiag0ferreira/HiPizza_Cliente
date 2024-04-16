import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AbreprodPageRoutingModule } from './abreprod-routing.module';

import { AbreprodPage } from './abreprod.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AbreprodPageRoutingModule
  ],
  declarations: [AbreprodPage]
})
export class AbreprodPageModule {}
