import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalpedidoPage } from '../modals/modalpedido/modalpedido.page';
import { ApiServices } from '../service/apiService';
import { StorageService, RegistroUsuario } from '../service/storage.service';

interface Pedido {
  dataHora: string;
  fantasiaEstabelecimento: string;
  id: number;
  idStatus: number;
  nomeEstabelecimento: string;
  nomeStatus: string;
  obs: string;
  seqPedido: number;
  total: number;
  validade: string;
  itens: number;
  idEstabelecimento: number;
}
@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {

  public tais = [
    {a: '1', b: '2'},
    {a: '3', b: '4'}
  ];

  public user: RegistroUsuario;
  public pedidos: Pedido[];
  public pedido: Pedido;

  public conta: number;

  constructor(private api: ApiServices,
              private storageService: StorageService,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log('iniciando');
    this.api.setCallBack(this.getUserByEmail);
    console.log('callBack setado');
    this.api.getCab();
    console.log('chamou getCab...');
  }

  getUserByEmail = () => {
    // this.storageService.getUser().then(reg => this.gotUser(reg));
    console.log('pegando regUser de storageService');
    const data = this.storageService.getRegUser();
    console.log('Levando user ' + data.login);
    this.gotUser(data);
  }

  gotUser = (data) => {
    this.api.getUserByEmail(data.email).then(reg => this.fillUser(reg));
  }

  fillUser = (data) => {
    this.user = data;
    console.log('data: ');
    console.log(data);
    // this.storageService.setRegUser(data);
    console.log(this.user);
    console.log('pagando pedidos');
    this.api.getPedidosCliente(this.user.id).then(regs => this.gotPedidos(regs));
  }

  gotPedidos = (data) => {
    console.log(data);
    this.pedidos = data;
    console.log(this.pedidos);
    this.conta = 0;
    console.log('Complementando');
    this.complementaPedido();
  }

  complementaPedido = () => {
    if (this.conta < this.pedidos.length) {
      this.pedido = this.pedidos[this.conta];
      this.complementa(this.pedido);
    }
  }

  complementa = (ped: Pedido) => {
    console.log('chamando api de contaitens');
    this.api.contaItensNoPedido(ped.id).then(ret => this.gotTotItens(ret));
  }
  gotTotItens = (data) => {
    const nItens = data.retorno;
    console.log('trouxe ' + nItens + ' itens');
    this.pedido.itens = nItens;
    this.pedidos[this.conta] = this.pedido;
    this.conta++;
    console.log('complementando pedido');
    this.complementaPedido();
  }

  novoPedido = () => {}

  doAcerto = () => {
    const tam = screen.width;
    const el = document.getElementById('iListaPed');
    if (tam < 768) {
      el.style.setProperty('padding-left', '5%');
      el.style.setProperty('padding-right', '5%');
    } else {
      el.style.setProperty('padding-left', '25%');
      el.style.setProperty('padding-right', '25%');
    }
    console.log('acertado');
  }

  abrePed = (id) => {
    this.pedido = this.storageService.getJsonByCampo(this.pedidos, 'id', id);
    this.storageService.setCurPed(this.pedido);
    this.openModal();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalpedidoPage
    });
    modal.onDidDismiss().then((data) => {
      this.api.getPedidosCliente(this.user.id).then(regs => this.gotPedidos(regs));
    });
    this.storageService.setRefresca(0);
    return await modal.present();
  }

  terminou = (bol) => {
    if (bol) {
      this.doAcerto();
    }
  }
}
