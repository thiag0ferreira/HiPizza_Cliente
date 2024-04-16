import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModaltrocoPageRoutingModule } from './modaltroco-routing.module';

import { ModaltrocoPage } from './modaltroco.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModaltrocoPageRoutingModule
  ],
  declarations: [ModaltrocoPage]
})
export class ModaltrocoPageModule {}
