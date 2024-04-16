import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiServices } from 'src/app/service/apiService';
import { StorageService, RegistroEstabelecimento } from 'src/app/service/storage.service';

interface Forma {
  id: number;
  nome: string;
  marcado: any;
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
}

@Component({
  selector: 'app-modalformas',
  templateUrl: './modalformas.page.html',
  styleUrls: ['./modalformas.page.scss'],
})
export class ModalformasPage implements OnInit {

  public formas: Forma[];
  public forma: Forma;
  public stab: RegistroEstabelecimento;
  public marco: any;
  private pedido: Pedido;
  private conta: number;
  private nFormas: number;

  constructor(private storageService: StorageService,
              private modalCtrl: ModalController,
              private api: ApiServices,
              private alertController: AlertController) { }

  ngOnInit() {
    this.storageService.setFormaMudada(false);
    this.stab = this.storageService.getStab();
    this.pedido = this.storageService.getCurPed();
    this.api.setCallBack(this.getListaFormas);
    this.api.getCab();
  }

  getListaFormas = () => {
    this.conta = 0;
    this.api.getListaFormas().then(regs => this.gotFormas(regs));
  }

  gotFormas = (data) => {
    this.nFormas = data.length;
    this.formas = data;
    console.log(this.formas);
    this.preencheFormas();
  }

  preencheFormas = () => {
    if (this.conta < this.nFormas) {
      this.setMarca();
    }
  }

  setMarca = () => {
    this.forma = this.formas[this.conta];
    this.api.pedidoTemForma(this.pedido.id, this.forma.id).then(reg => this.trataMarca(reg));
  }

  trataMarca = (data) => {
    console.log('tratando ' + this.conta);
    this.forma = this.formas[this.conta];
    if (data.retorno === 1) {
      console.log('Marcado');
      this.forma.marcado = 1;
    } else {
      console.log('Não');
      this.forma.marcado = 0;
    }
    this.conta++;
    this.preencheFormas();
  }

  marcar = (id) => {
    console.log('Marcar ' + id);
    const forma: Forma = this.storageService.getJsonByCampo(this.formas, 'id', id);
    console.log(forma.marcado);
    if (forma.marcado === undefined) {
      console.log('Marcar forma und');
      this.poeForma(id);
    } else if (forma.marcado === false) {
      console.log('Marcar forma fal');
      this.poeForma(id);
    } else if (forma.marcado === 0) {
      console.log('Marcar forma zero');
      this.poeForma(id);
    } else {
      console.log('Desmarcar forma');
      this.tiraForma(id);
    }
  }

  poeForma = (idForma: number) => {
    this.pedido = this.storageService.getCurPed();
    this.api.adicionaFormaNoPedido(this.pedido.id, idForma).then(ret => this.formaPosta(ret));
  }

  tiraForma = (idForma: number) => {
    this.pedido = this.storageService.getCurPed();
    this.api.removeFormaDoPedido(this.pedido.id, idForma).then(ret => this.formaPosta(ret));
  }

  formaPosta = (data) => {
    console.log(data);
    if (data.retorno !== 'Ok') {
      const header = 'Atenção';
      const subh = 'Permissões';
      const msg = data.retorno;
      this.alertar(header, subh, msg);
    } else {
      this.storageService.setFormaMudada(true);
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
  }}
