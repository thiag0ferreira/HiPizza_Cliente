import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ApiServices } from 'src/app/service/apiService';
import { FormatServices } from 'src/app/service/formatService';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-cadastrais',
  templateUrl: './cadastrais.page.html',
  styleUrls: ['./cadastrais.page.scss'],
})
export class CadastraisPage implements OnInit {

  public apUser: {
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
  };
  public translate: any;
  public isSexo: boolean;

  public label: string;
  public tValor: any;
  public tSexo: string;

  constructor(private modalCtrl: ModalController,
              private storageService: StorageService,
              private api: ApiServices,
              private formatServices: FormatServices,
              private alertController: AlertController) {
                console.log('modCad');
              }

  ngOnInit() {
    this.api.setCallBack(this.getUser);
    this.api.getCab();
  }

  getUser = () => {
    this.apUser = this.storageService.getRegUser();
    this.setTranslate();
  }

  setTranslate = () => {
    const mj = [];
    mj[0] = JSON.parse('{"chave":"tNo","apresenta":"Nome","campo":"nome"}');
    mj[1] = JSON.parse('{"chave":"tAp","apresenta":"Apelido","campo":"apelido"}');
    mj[2] = JSON.parse('{"chave":"tEm","apresenta":"E-mail","campo":"email"}');
    mj[3] = JSON.parse('{"chave":"tFo","apresenta":"Telefone","campo":"ddd"}');
    mj[4] = JSON.parse('{"chave":"tSe","apresenta":"Sexo","campo":"sexo"}');
    mj[5] = JSON.parse('{"chave":"tOb","apresenta":"Obs","campo":"obs"}');
    this.translate = mj;
    this.workEdit();
  }

  getAtribs = (chave) => {
    return this.storageService.getJsonByCampo(this.translate, 'chave', chave);
  }

  setSex = (qual) => {
    this.tSexo = qual;
    console.log('Setado sexo ' + qual);
  }

  workEdit = () => {
    this.tSexo = '';
    this.isSexo = false;
    const cpoEdit = this.storageService.getCpoEdit();
    if (cpoEdit === 'tSe') {
      this.isSexo = true;
    }
    this.label = this.getAtribs(cpoEdit).apresenta;
    const campo = this.getAtribs(cpoEdit).campo;
    this.tValor = this.apUser[campo];
    if (cpoEdit === 'tFo') {
      this.tValor = '(' + this.apUser.ddd + ') ' + this.apUser.fone;
    }
  }

  alteraDados = () => {
    const cpoEdit = this.storageService.getCpoEdit();
    if (cpoEdit === 'tNo') {
      this.apUser.nome = this.tValor;
    }
    if (cpoEdit === 'tAp') {
      this.apUser.apelido = this.tValor;
    }
    if (cpoEdit === 'tEm') {
      this.apUser.email = this.tValor;
    }
    if (cpoEdit === 'tFo') {
      let ddd = 0;
      let fone = '';
      if (this.tValor !== undefined) {
        if (this.tValor.length > 6) {
          const separado = this.formatServices.separaFone(this.tValor);
          const partes = separado.split(':');
          ddd = partes[0];
          fone = partes[1];
        }
      }
      this.apUser.ddd = ddd;
      this.apUser.fone = fone;
    }
    if (cpoEdit === 'tSe') {
      this.apUser.sexo = this.tSexo;
    }
    if (cpoEdit === 'tOb') {
      this.apUser.obs = this.tValor;
    }
    this.api.alteraUser(this.apUser).then(ret => this.userAlterado(ret));
  }

  userAlterado = (data) => {
    if (data.retorno === 'Ok') {
      this.storageService.setRefresca(1);
      this.closeModal();
    } else {
      const header = 'Atenção';
      const subh = 'Erro';
      const msg = data.retorno;
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
