import { Component, OnInit } from '@angular/core';
import { ApiServices } from '../service/apiService';
import { FormatServices } from '../service/formatService';
import { StorageService, RegistroUsuario } from '../service/storage.service';
import { ModalController, AlertController } from '@ionic/angular';
import { CadastraisPage } from '../modals/cadastrais/cadastrais.page';
import { ModalcepPage } from '../modals/modalcep/modalcep.page';
import { ModaledenderecoPage } from '../modals/modaledendereco/modaledendereco.page';

interface StrUser {
    id: number;
    nome: string;
    apelido: string;
    login: string;
    senha: string;
    idPerfil: number;
    perfil: any;
    email: string;
    obs: string;
    sexo: string;
    verificada: string;
    ddd: number;
    fone: string;
    flow: string;
    endBairro: string;
    endCep: string;
    endCidade: string;
    endComplemento: string;
    endEstado: string;
    endLogradouro: string;
    endNumero: string;
    endReferencia: string;
}

interface RetCep {
  retorno: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

@Component({
  selector: 'app-dadoscadastrais',
  templateUrl: './dadoscadastrais.page.html',
  styleUrls: ['./dadoscadastrais.page.scss'],
})
export class DadoscadastraisPage implements OnInit {

  public usr: RegistroUsuario;
  public strPerfil: {
    id: number;
    nome: string;
  };
  public celular: any;

  public nome: string;
  public apelido: string;
  public email: string;
  public obs: string;
  sexo: string;
  public cep: string;
  public logradouro: string;
  public numero: string;
  public complemento: string;
  public bairro: string;
  public cidade: string;
  public estado: string;

  public apUser: StrUser;
  public retCep: RetCep;

  constructor(private storageService: StorageService,
              private api: ApiServices,
              private format: FormatServices,
              public modalCtrl: ModalController,
              public alertController: AlertController) {
    console.log('Dados Cadastrais');
  }

  ngOnInit() {
    this.api.setCallBack(this.getUser);
    this.api.getCab();
  }

  doAcerto = () => {
    const tam = screen.width;
    const lNo = document.getElementById('lNo');
    const tNo = document.getElementById('tNo');
    const lAp = document.getElementById('lAp');
    const tAp = document.getElementById('tAp');
    const lEm = document.getElementById('lEm');
    const tEm = document.getElementById('tEm');
    const lFo = document.getElementById('lFo');
    const tFo = document.getElementById('tFo');
    const lSe = document.getElementById('lSe');
    const tSe = document.getElementById('tFo');
    const lOb = document.getElementById('lOb');
    const tOb = document.getElementById('tOb');
    if (tam < 768) {
      lNo.style.setProperty('width', '20%');
      tNo.style.setProperty('width', '80%');
      lAp.style.setProperty('width', '20%');
      tAp.style.setProperty('width', '80%');
      lEm.style.setProperty('width', '20%');
      tEm.style.setProperty('width', '80%');

      lFo.style.setProperty('width', '20%');
      tFo.style.setProperty('width', '80%');
      lSe.style.setProperty('width', '20%');
      tSe.style.setProperty('width', '80%');
      lOb.style.setProperty('width', '20%');
      tOb.style.setProperty('width', '80%');
    } else {
      lNo.style.setProperty('width', '10%');
      tNo.style.setProperty('width', '20%');
      lAp.style.setProperty('width', '10%');
      tAp.style.setProperty('width', '20%');
      lEm.style.setProperty('width', '10%');
      tEm.style.setProperty('width', '20%');

      lFo.style.setProperty('width', '10%');
      tFo.style.setProperty('width', '20%');
      lSe.style.setProperty('width', '10%');
      tSe.style.setProperty('width', '20%');
      lOb.style.setProperty('width', '10%');
      tOb.style.setProperty('width', '20%');
    }
  }

  c1Style = () => {
    const tam = screen.width;
    let styles: any;
    if (tam < 768) {
      styles = {
        display: 'inline-block',
        width: '20%'
      };
    } else {
      styles = {
        display: 'inline-block',
        width: '10%'
      };
    }
    return styles;
  }
  c2Style = () => {
    const tam = screen.width;
    let styles: any;
    if (tam < 768) {
      styles = {
        display: 'inline-block',
        width: '80%'
      };
    } else {
      styles = {
        display: 'inline-block',
        width: '20%'
      };
    }
    return styles;
  }
  c3Style = () => {
    const tam = screen.width;
    let styles: any;
    if (tam < 768) {
      styles = {
        display: 'inline-block',
        width: '80%'
      };
    } else {
      styles = {
        display: 'inline-block',
        width: '40%'
      };
    }
    return styles;
  }
  c4Style = () => {
    const tam = screen.width;
    let styles: any;
    if (tam < 768) {
      styles = {
        display: 'inline-block',
        width: '80%'
      };
    } else {
      styles = {
        display: 'inline-block',
        width: '10%'
      };
    }
    return styles;
  }

  acertar = () => {
    this.doAcerto();
  }

  getUser = () => {
    // this.storageService.getUser().then(reg => this.gotUser(reg));
    const data = this.storageService.getRegUser();
    this.gotUser(data);
  }

  gotUser = (data) => {
    console.log(data);
    this.usr = data;
    this.api.getUserByEmail(this.usr.email).then(reg => this.gotByEmail(reg));
  }

  gotByEmail = (data) => {
    console.log(data);
    this.apUser = data;
    this.storageService.setRegUser(this.apUser);
    console.log(this.apUser);
    this.celular = '(' + this.apUser.ddd + ') ' + this.apUser.fone;
    this.nome = this.apUser.nome;
    this.apelido = this.apUser.apelido;
    this.email = this.apUser.email;
    this.sexo = this.apUser.sexo;
    this.obs = this.apUser.obs;
    if (this.sexo === 'null') {
      this.sexo = '';
    }
    this.cep = this.apUser.endCep;
    this.logradouro = this.apUser.endLogradouro;
    this.numero = this.apUser.endNumero;
    this.complemento = '';
    if (this.apUser.endComplemento !== null) {
      this.complemento = this.apUser.endComplemento;
    }
    this.bairro = this.apUser.endBairro;
    this.cidade = this.apUser.endCidade;
    this.estado = this.apUser.endEstado;
    this.numero = this.apUser.endNumero;
  }

  altera = (id) => {
    console.log('Alterar ' + id);
    this.storageService.setCpoEdit(id);
    this.openModal();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: CadastraisPage
    });
    modal.onDidDismiss().then((data) => {
      this.api.getUserByEmail(this.apUser.email).then(reg => this.gotByEmail(reg));
    });
    this.storageService.setRefresca(0);
    return await modal.present();
  }

  abreCep = () => {
    this.openModalCep();
  }

  trataRetCep = () => {
    this.retCep = this.storageService.getRespCep();
    if (this.retCep !== undefined) {
      if (this.retCep.retorno === 'Ok') {
        this.cep = this.retCep.cep;
        this.logradouro = this.retCep.logradouro;
        this.bairro = this.retCep.bairro;
        this.cidade = this.retCep.cidade;
        this.estado = this.retCep.estado;

        this.apUser.endCep = this.retCep.cep;
        this.apUser.endLogradouro = this.retCep.logradouro;
        this.apUser.endBairro = this.retCep.bairro;
        this.apUser.endCidade = this.retCep.cidade;
        this.apUser.endEstado = this.retCep.estado;
        this.api.alteraUser(this.apUser).then(ret => this.endGravado(ret));
      }
    }
  }

  endGravado = (data) => {
    if (data.retorno !== 'Ok') {
      const header = 'Atenção';
      const subh = 'Erro!';
      const msg = data.retorno;
      this.alertar(header, subh, msg);
    }
  }

  edCep = (qual) => {
    console.log(qual);
    this.storageService.setCpoEdit(qual);
    this.openModalEndereco();
  }

  async openModalCep() {
    const modal = await this.modalCtrl.create({
      component: ModalcepPage
    });
    modal.onDidDismiss().then((data) => {
      this.trataRetCep();
    });
    this.storageService.setRefresca(0);
    return await modal.present();
  }

  async openModalEndereco() {
    this.storageService.setCurParm('cep');
    const modal = await this.modalCtrl.create({
      component: ModaledenderecoPage
    });
    modal.onDidDismiss().then((data) => {
      if (this.storageService.getCurParm() === 'cep') {
        this.trataRetCep();
      } else {
        this.getUser();
      }
    });
    this.storageService.setRefresca(0);
    return await modal.present();
  }

  formata = (idElemento, qTipo) => {
    this.format.mascaraFone(idElemento, qTipo);
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
