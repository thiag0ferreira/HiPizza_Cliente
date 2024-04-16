import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeioAMeioPageRoutingModule } from './meio-a-meio-routing.module';

import { MeioAMeioPage } from './meio-a-meio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeioAMeioPageRoutingModule
  ],
  declarations: [MeioAMeioPage]
})
export class MeioAMeioPageModule {}
