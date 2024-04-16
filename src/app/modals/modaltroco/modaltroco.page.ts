import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiServices } from 'src/app/service/apiService';
import { FormatServices } from 'src/app/service/formatService';
import { StorageService } from 'src/app/service/storage.service';

declare  global {
  interface String{
    limpaValor(): string;
  }
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

@Component({
  selector: 'app-modaltroco',
  templateUrl: './modaltroco.page.html',
  styleUrls: ['./modaltroco.page.scss'],
})
export class ModaltrocoPage implements OnInit {

  public pedido: Pedido;
  public obsTroco: string;

  constructor(private modalCtrl: ModalController,
              private storageService: StorageService,
              private alertController: AlertController,
              private formatService: FormatServices,
              private api: ApiServices) {

                String.prototype.limpaValor = function() {
                  const parm = this;
                  let retorno = parm;
                  retorno = formatService.trocaVigulaPonto(retorno);
                  retorno = formatService.removePonto(retorno);
                  return retorno;
                };

              }

  ngOnInit() {
    this.pedido = this.storageService.getCurPed();
    this.obsTroco = this.pedido.obsTroco;
    if (this.obsTroco === null) {
      this.obsTroco = '';
    }
    if (this.obsTroco === 'null') {
      this.obsTroco = '';
    }
  }

  gravaObsTroco = () => {
    let ok = true;
    const header = 'Atenção';
    const subh = 'Consistência';
    if (this.obsTroco === undefined) {
      const msg = 'Informe um valor (zero) para nenhum valor';
      this.alertar(header, subh, msg);
      ok = false;
    }
    if (ok) {
      if (this.obsTroco === '') {
        const msg = 'Informe um valor (zero) para nenhum valor';
        this.alertar(header, subh, msg);
        ok = false;
      }
    }
    if (ok) {
      this.obsTroco = this.obsTroco.limpaValor();
      this.api.alteraTroco(this.pedido.id, this.obsTroco).then(ret => this.gotTroco(ret));
    }
  }

  gotTroco = (data) => {
    const header = 'Atenção';
    const subh = 'Retorno';
    if (data.retorno !== 'Ok') {
      const msg = data.retorno;
    } else {
      this.storageService.setTroco(this.obsTroco);
      const msg = 'Observação registrada com sucesso';
      this.alertar(header, subh, msg);
      this.closeModal();
    }
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

  async closeModal() {
    await this.modalCtrl.dismiss();
  }
}
