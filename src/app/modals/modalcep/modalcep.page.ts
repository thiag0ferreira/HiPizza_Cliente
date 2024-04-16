import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiServices } from 'src/app/service/apiService';
import { FormatServices } from 'src/app/service/formatService';
import { StorageService } from 'src/app/service/storage.service';


interface RetCep {
  retorno: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

@Component({
  selector: 'app-modalcep',
  templateUrl: './modalcep.page.html',
  styleUrls: ['./modalcep.page.scss'],
})
export class ModalcepPage implements OnInit {

  public pLog: string;
  public pBairro: string;
  public pCidade: string;
  public pEstado: string;

  public tCep: string;
  public respCep: RetCep;

  constructor(private modalCtrl: ModalController,
              private formatService: FormatServices,
              private alertController: AlertController,
              private api: ApiServices,
              private storageService: StorageService) { }

  ngOnInit() {
  }

  pesqCep = () => {
    let ok = true;
    const head = 'Atenção';
    const subh = 'Pesquisa de CEP';
    if (this.tCep === undefined) {
      const msg = 'Informe o  CEP';
      this.alertar(head, subh, msg);
      ok = false;
    }
    if (ok) {
      if (this.tCep === '') {
        const msg = 'Informe o  CEP';
        this.alertar(head, subh, msg);
        ok = false;
      }
    }
    if (ok) {
      if (this.tCep.length !== 9) {
        const msg = 'Informe o CEP no formato 9999-99';
        this.alertar(head, subh, msg);
        ok = false;
      }
    }
    if (ok) {
      this.api.getByCep(this.tCep).then(reg => this.gotCep(reg));
    }
  }

  gotCep = (data) => {
    if (data.resultado === '1') {
      const n = data.logradouro.indexOf(' - ');
      if (n > 0) {
        data.logradouro = data.logradouro.substring(0, n);
      }
      data.logradouro = data.tp_logradouro + ' ' + data.logradouro;
      this.pBairro = data.bairro;
      this.pCidade = data.cidade;
      this.pEstado = data.estado;
      this.pLog = data.logradouro;
    } else {
      const head = 'Atenção';
      const subh = 'Pesquisa de Endereço';
      const msg = 'Endereço não localizado';
      this.alertar(head, subh, msg);
    }
  }

  pegaCep = () => {
    let ok = true;
    const head = 'Atenção';
    const subh = 'Pesquisa de CEP';
    if (this.tCep === undefined) {
      const msg = 'Informe o  CEP';
      this.alertar(head, subh, msg);
      ok = false;
    }
    if (ok) {
      if (this.tCep === '') {
        const msg = 'Informe o  CEP';
        this.alertar(head, subh, msg);
        ok = false;
      }
    }
    if (ok) {
      if (this.tCep.length !== 9) {
        const msg = 'Informe o CEP no formato 9999-99';
        this.alertar(head, subh, msg);
        ok = false;
      }
    }
    this.respCep = {
      bairro: '',
      cidade: '',
      estado: '',
      logradouro: '',
      retorno: 'nOk',
      cep: this.tCep
    };
    let bairro = '';
    let cidade = '';
    let estado = '';
    let logradouro = '';
    let retorno = 'nOk';
    if (ok) {
      retorno = 'Ok';
      if (this.pBairro !== undefined) {
        if (this.pBairro !== '') {
          bairro = this.pBairro;
        }
      }
      if (this.pCidade !== undefined) {
        if (this.pCidade !== '') {
          cidade = this.pCidade;
        }
      }
      if (this.pEstado !== undefined) {
        if (this.pEstado !== '') {
          estado = this.pEstado;
        }
      }
      if (this.pLog !== undefined) {
        if (this.pLog !== '') {
          logradouro = this.pLog;
        }
      }
      this.respCep = {
        bairro,
        cidade,
        estado,
        logradouro,
        retorno,
        cep: this.tCep
      };
      this.storageService.setRespCep(this.respCep);
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

  formataCep = (id) => {
    this.formatService.mascaracep(id);
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }
}
