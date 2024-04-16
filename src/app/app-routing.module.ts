import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'cadastro1email',
    loadChildren: () => import('./cadastro1email/cadastro1email.module').then( m => m.Cadastro1emailPageModule)
  },
  {
    path: 'informetoken',
    loadChildren: () => import('./informetoken/informetoken.module').then( m => m.InformetokenPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'estabelecimentos',
    loadChildren: () => import('./estabelecimentos/estabelecimentos.module').then( m => m.EstabelecimentosPageModule)
  },
  {
    path: 'pedidos',
    loadChildren: () => import('./pedidos/pedidos.module').then( m => m.PedidosPageModule)
  },
  {
    path: 'dadoscadastrais',
    loadChildren: () => import('./dadoscadastrais/dadoscadastrais.module').then( m => m.DadoscadastraisPageModule)
  },
  {
    path: 'cadastrais',
    loadChildren: () => import('./modals/cadastrais/cadastrais.module').then( m => m.CadastraisPageModule)
  },
  {
    path: 'estabelecimento',
    loadChildren: () => import('./estabelecimento/estabelecimento.module').then( m => m.EstabelecimentoPageModule)
  },
  {
    path: 'abreprod',
    loadChildren: () => import('./modals/abreprod/abreprod.module').then( m => m.AbreprodPageModule)
  },
  {
    path: 'modalpedido',
    loadChildren: () => import('./modals/modalpedido/modalpedido.module').then( m => m.ModalpedidoPageModule)
  },
  {
    path: 'modalcep',
    loadChildren: () => import('./modals/modalcep/modalcep.module').then( m => m.ModalcepPageModule)
  },
  {
    path: 'modaledendereco',
    loadChildren: () => import('./modals/modaledendereco/modaledendereco.module').then( m => m.ModaledenderecoPageModule)
  },
  {
    path: 'recovercadastro',
    loadChildren: () => import('./recovercadastro/recovercadastro.module').then( m => m.RecovercadastroPageModule)
  },
  {
    path: 'modalformas',
    loadChildren: () => import('./modals/modalformas/modalformas.module').then( m => m.ModalformasPageModule)
  },
  {
    path: 'modaltroco',
    loadChildren: () => import('./modals/modaltroco/modaltroco.module').then( m => m.ModaltrocoPageModule)
  },
  {
    path: 'modalopcoespedido',
    loadChildren: () => import('./modals/modalopcoespedido/modalopcoespedido.module').then( m => m.ModalopcoespedidoPageModule)
  },
  {
    path: 'stabsfavoritos',
    loadChildren: () => import('./modals/stabsfavoritos/stabsfavoritos.module').then( m => m.StabsfavoritosPageModule)
  },
  {
    path: 'estabelecimentosfavoritos',
    loadChildren: () => import('./estabelecimentosfavoritos/estabelecimentosfavoritos.module').then( m => m.EstabelecimentosfavoritosPageModule)
  },
  {
    path: 'produtosfavoritos',
    loadChildren: () => import('./produtosfavoritos/produtosfavoritos.module').then( m => m.ProdutosfavoritosPageModule)
  },
  {
    path: 'meio-a-meio',
    loadChildren: () => import('./modals/meio-a-meio/meio-a-meio.module').then( m => m.MeioAMeioPageModule)
  },
  {
    path: 'modaleditametades',
    loadChildren: () => import('./modals/modaleditametades/modaleditametades.module').then( m => m.ModaleditametadesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
