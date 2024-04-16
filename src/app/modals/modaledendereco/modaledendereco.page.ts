import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiServices } from 'src/app/service/apiService';
import { StorageService } from 'src/app/service/storage.service';

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

interface Uf {
  sigla: string;
  nome: string;
}

@Component({
  selector: 'app-modaledendereco',
  templateUrl: './modaledendereco.page.html',
  styleUrls: ['./modaledendereco.page.scss'],
})
export class ModaledenderecoPage implements OnInit {

  public translate: any;
  public label: string;
  public tValor: any;
  public user: StrUser;
  public estados: Uf[];
  public isTado: boolean;

  constructor(private modalCtrl: ModalController,
              private storageService: StorageService,
              private api: ApiServices,
              private alertController: AlertController) { }

  ngOnInit() {
    this.user = this.storageService.getRegUser();
    this.setTranslate();
  }

  setTranslate = () => {
    const mj = [];
    mj[0] = JSON.parse('{"chave":"Lo","apresenta":"Logradouro","campo":"endLogradouro"}');
    mj[1] = JSON.parse('{"chave":"Co","apresenta":"Complemento","campo":"endComplemento"}');
    mj[2] = JSON.parse('{"chave":"Ba","apresenta":"Bairro","campo":"endBairro"}');
    mj[3] = JSON.parse('{"chave":"Ci","apresenta":"Cidade","campo":"endCidade"}');
    mj[4] = JSON.parse('{"chave":"Es","apresenta":"Estado","campo":"endEstado"}');
    mj[5] = JSON.parse('{"chave":"No","apresenta":"Número","campo":"endNumero"}');
    this.translate = mj;
    this.setPageAttribs();
  }

  getAtribs = (chave) => {
    return this.storageService.getJsonByCampo(this.translate, 'chave', chave);
  }

  setPageAttribs = () => {
    this.isTado = false;
    const cpoEdit = this.storageService.getCpoEdit();
    if (cpoEdit === 'Es') {
      this.isTado = true;
    }
    this.label = this.getAtribs(cpoEdit).apresenta;
    const campo = this.getAtribs(cpoEdit).campo;
    this.tValor = this.user[campo];
    const estados = this.storageService.getEstados();
    this.setEstados(estados);
  }

  setEstados = (data) => {
    this.estados = data.ufs;
    console.log(this.estados);
  }

  alteraEnd = () => {
    const cpoEdit = this.storageService.getCpoEdit();
    const valor = this.tValor;
    switch (cpoEdit) {
      case 'Lo':
        this.user.endLogradouro = this.tValor;
        break;
      case 'Co':
        this.user.endComplemento = this.tValor;
        break;
      case 'Ba':
        this.user.endBairro = this.tValor;
        break;
      case 'Ci':
        this.user.endCidade = this.tValor;
        break;
      case 'Es':
        this.user.endEstado = this.tValor;
        break;
      case 'No':
        this.user.endNumero = this.tValor;
        break;
    }
    this.api.alteraUser(this.user).then(ret => this.userAlterado(ret));
  }

  userAlterado = (data) => {
    if (data.retorno !== 'Ok') {
      const header = 'Atenção';
      const subh = 'Erro!';
      const msg = data.retorno;
      this.alertar(header, subh, msg);
    } else {
      this.storageService.setCurParm('Endereco');
      this.closeModal();
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
