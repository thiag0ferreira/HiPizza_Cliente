import { Component, OnInit } from '@angular/core';
import { StorageService, RegistroEstabelecimento, RegistroUsuario, Produto, Tipo } from 'src/app/service/storage.service';
import { ModalController, AlertController } from '@ionic/angular';
import { ApiServices } from 'src/app/service/apiService';

interface Item {
  id: number;
  desconto: number;
  qtd: number;
  valor: number;
}

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
  obsTroco: string;
}

interface QtdEntidade {
  idItem: number;
  idPedido: number;
  idProduto: number;
  qtd: number;
  idCliente: number;
  idStab: number;
  desconto: number;
}

@Component({
  selector: 'app-abreprod',
  templateUrl: './abreprod.page.html',
  styleUrls: ['./abreprod.page.scss'],
})
export class AbreprodPage implements OnInit {

  public produto: Produto;
  public stab: RegistroEstabelecimento;
  public user: RegistroUsuario;
  public qtd: number;
  public eQtd: QtdEntidade;
  public itemGravado: Item;
  public pedido: Pedido;
  public prodFavorito = false;
  public pequeno: boolean;
  public grande: boolean;

  constructor(private storageService: StorageService,
              private modalCtrl: ModalController,
              private alertController: AlertController,
              private api: ApiServices) { }

  ngOnInit() {
    console.log('Abrindo produto...');
    const tam = screen.width;
    if (tam < 768) {
      this.pequeno = true;
      this.grande = false;
    } else {
      this.pequeno = false;
      this.grande = true;
    }
    this.qtd = 0;
    this.produto = this.storageService.getCurProd();
    this.stab = this.storageService.getStab();
    this.user = this.storageService.getRegUser();
    this.api.setCallBack(this.getItemNoPed);
    this.api.getCab();
  }

  getItemNoPed = () => {
    let idPed = 0;
    if (this.storageService.getCurPed().id !== undefined) {
      idPed = this.storageService.getCurPed().id;
    }
    console.log('idPed: ' + idPed);
    this.api.produtoNoPedido(idPed, this.produto.id).then(data => this.gotOcor(data));
  }

  gotOcor = (data) => {
    console.log(data);
    if (data.retorno === 'Ok') {
      this.qtd = data.qtd;
      this.itemGravado = data;
    } else {
      this.qtd = 0;
      this.itemGravado = {
        id: 0,
        desconto: 0,
        qtd: this.qtd,
        valor: 0
      };
    }
    this.verificaFavorito();
  }

  verificaFavorito = () => {
    this.api.verificaProdutoFavorito(this.user.id, this.produto.id).then(ret => this.favoritoVerificado(ret));
  }

  favoritoVerificado = (data) => {
    console.log('Favorito: ' + data.favorito);
    if (data.favorito === 'SIM') {
      this.prodFavorito = true;
    }
  }

  acertar = () => {
    this.doAcerto();
  }

  doAcerto = () => {
    const tam = screen.width;
    const el = document.getElementById('iListaStab');
    if (tam < 768) {
      el.style.setProperty('padding-left', '5%');
      el.style.setProperty('padding-right', '5%');
    } else {
      el.style.setProperty('padding-left', '25%');
      el.style.setProperty('padding-right', '25%');
    }
    console.log('acertado');
  }

  maisProd = () => {
    this.pedido = this.storageService.getCurPed();
    if (this.pedido.idStatus !== 3 && this.pedido.idStatus !== undefined) {
      const header = 'Atenção';
      const subh = 'Permissões';
      const msg = 'Este pedido está com status ' + this.pedido.nomeStatus + ' e não pode ser alterado';
      this.alertar(header, subh, msg);
    } else {
      this.qtd++;
    }
  }
  menosProd = () => {
    this.pedido = this.storageService.getCurPed();
    if (this.pedido.idStatus !== 3) {
      const header = 'Atenção';
      const subh = 'Permissões';
      const msg = 'Este pedido está com status ' + this.pedido.nomeStatus + ' e não pode ser alterado';
      this.alertar(header, subh, msg);
    } else {
      if (this.qtd > 0) {
        this.qtd--;
      }
    }
  }

  altQtd = () => {
    let idPedido = 0;
    if (this.storageService.getCurPed().id !== undefined) {
      idPedido = this.storageService.getCurPed().id;
    }
    this.eQtd = {
      idCliente: this.user.id,
      idItem: this.itemGravado.id,
      idPedido,
      idProduto: this.produto.id,
      idStab: this.stab.id,
      qtd: this.qtd,
      desconto: 0
    };
    this.api.setQtdItem(this.eQtd).then(ret => this.qtdSetada(ret));
  }

  qtdSetada = (data) => {
    console.log(data);
    this.closeModal();
  }

  mudaFavorito = () => {
    if (this.prodFavorito) {
      console.log('Desmarcar produto');
      this.api.retiraProdutoDosFavoritos(this.user.id, this.produto.id).then(ret => this.favoritoMudado(ret));
    } else {
      this.api.setProdutoFavorito(this.user.id, this.produto.id).then(ret => this.favoritoMudado(ret));
    }
  }

  favoritoMudado = (data) => {
    if (data.retorno !== 'Ok') {
      alert('Erro marcando favorito');
    }
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  async alertar(head, subHead, parm) {
    if (head === undefined) {
      head = 'Atenção';
    }
    if (subHead === undefined) {
      subHead = '';
    }
    const alert = await this.alertController.create({
      header: head,
      subHeader: subHead,
      message: parm,
      buttons: ['OK']
    });

    await alert.present();
  }
}
