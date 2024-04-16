import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Cadastro1emailPageRoutingModule } from './cadastro1email-routing.module';

import { Cadastro1emailPage } from './cadastro1email.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cadastro1emailPageRoutingModule
  ],
  declarations: [Cadastro1emailPage]
})
export class Cadastro1emailPageModule {}
