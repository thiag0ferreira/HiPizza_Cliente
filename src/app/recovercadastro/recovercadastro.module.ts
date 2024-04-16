import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecovercadastroPageRoutingModule } from './recovercadastro-routing.module';

import { RecovercadastroPage } from './recovercadastro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecovercadastroPageRoutingModule
  ],
  declarations: [RecovercadastroPage]
})
export class RecovercadastroPageModule {}
