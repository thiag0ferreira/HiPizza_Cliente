import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdutosfavoritosPageRoutingModule } from './produtosfavoritos-routing.module';

import { ProdutosfavoritosPage } from './produtosfavoritos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdutosfavoritosPageRoutingModule
  ],
  declarations: [ProdutosfavoritosPage]
})
export class ProdutosfavoritosPageModule {}
