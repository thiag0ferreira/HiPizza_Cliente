import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DadoscadastraisPageRoutingModule } from './dadoscadastrais-routing.module';

import { DadoscadastraisPage } from './dadoscadastrais.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DadoscadastraisPageRoutingModule
  ],
  declarations: [DadoscadastraisPage]
})
export class DadoscadastraisPageModule {}
