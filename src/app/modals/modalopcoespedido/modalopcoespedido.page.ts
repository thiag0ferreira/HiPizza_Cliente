import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiServices } from 'src/app/service/apiService';
import { StorageService, OpcoesPedido } from 'src/app/service/storage.service';

interface OpItem {
  idItem: number;
  opcoes: OpcoesPedido[];
}

@Component({
  selector: 'app-modalopcoespedido',
  templateUrl: './modalopcoespedido.page.html',
  styleUrls: ['./modalopcoespedido.page.scss'],
})
export class ModalopcoespedidoPage implements OnInit {

  public opcoes: OpcoesPedido[];
  public opcao: OpcoesPedido;
  public cbOpcoes: number[];
  public conta: number;

  constructor(private modalCtrl: ModalController,
              private api: ApiServices,
              private storageService: StorageService,
              private alertController: AlertController) { }

  ngOnInit() {
    this.api.setCallBack(this.getListaOpcoes);
    this.api.getCab();
  }

  getListaOpcoes = () => {
    this.api.getListaOpcoes().then(regs => this.gotOpcoes(regs));
  }

  gotOpcoes = (data) => {
    this.opcoes = data;
    console.log(this.opcoes);
    this.setCbOpcoes();
  }

  setCbOpcoes = () => {
    const idItem: number = this.storageService.getIdItem();
    this.api.getOpcoesItem(idItem).then(regs => this.gotCbOpcoes(regs));
  }

  gotCbOpcoes = (data) => {
    const opsProd: OpcoesPedido[] = data;
    const cbs = new Array();
    opsProd.forEach(op => {
      const id = '' + op.id;
      cbs.push(id);
    });
    this.cbOpcoes = cbs;
    console.log('cbOpcoes ficou:');
    console.log(this.cbOpcoes);
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  gotOps = () => {
    const idItem: number = this.storageService.getIdItem();
    console.log('Minhas opções');
    console.log('ítem ' + idItem + ' abre com as seguintes opções: ');
    console.log(this.cbOpcoes);
    this.preparaGravacao();
  }

  preparaGravacao = () => {
    this.conta = 0;
    this.setOpcoes();
  }

  setOpcoes = () => {
    const idItem: number = this.storageService.getIdItem();
    const ops: OpcoesPedido[] = new Array();
    this.cbOpcoes.forEach(id => {
      const op: OpcoesPedido = this.storageService.getJsonByCampo(this.opcoes, 'id', id);
      ops.push(op);
    });
    const opDto: OpItem = {
      idItem,
      opcoes: ops
    };
    this.api.setOpcoesItem(opDto).then(ret => this.opcoesSetadas(ret));
  }

  opcoesSetadas = (data) => {
    console.log(data);
    if (data.retorno !== 'Ok') {
      const header = 'Atenção';
      const subh = 'Erro!';
      const msg = data.retorno;
      this.alertar(header, subh, msg);
    } else {
      this.closeModal();
    }
  }

  mudou = () => {
    console.log('Mudou');
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
