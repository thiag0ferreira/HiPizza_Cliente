import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformetokenPageRoutingModule } from './informetoken-routing.module';

import { InformetokenPage } from './informetoken.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformetokenPageRoutingModule
  ],
  declarations: [InformetokenPage]
})
export class InformetokenPageModule {}
