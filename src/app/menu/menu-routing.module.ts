import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstabelecimentosPage } from '../estabelecimentos/estabelecimentos.page';
import { PedidosPage } from '../pedidos/pedidos.page';
import { DadoscadastraisPage } from '../dadoscadastrais/dadoscadastrais.page';

import { MenuPage } from './menu.page';
import { from } from 'rxjs';
import { ProdutosfavoritosPage } from '../produtosfavoritos/produtosfavoritos.page';

const routes: Routes = [
  {
    path: '', component: MenuPage,
    children: [
      { path: 'stabc', component: EstabelecimentosPage },
      { path: 'pedidos', component: PedidosPage },
      { path: 'dados', component: DadoscadastraisPage },
      { path: 'favoritos', component: ProdutosfavoritosPage }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
