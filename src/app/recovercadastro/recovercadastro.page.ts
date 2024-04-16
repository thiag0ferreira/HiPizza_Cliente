import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ApiServices } from '../service/apiService';
import { StorageService } from '../service/storage.service';

interface User {
  login: string;
  senha: string;
}

interface RegUser {
    id: number;
    apelido: string;
    login: string;
    senha: string;
    email: string;
    ddd: string;
    fone: string;
    nome: string;
    obs: string;
    sexo: string;
    result: null,
    tempo: string;
    razao: string;
    fantasia: string;
    cnpj: string;
    endBairro: string;
    endCep: string;
    endCidade: string;
    endComplemento: string;
    endEstado: string;
    endLogradouro: string;
    flow: string;
    endNumero: string;
    endReferencia: string;
    perfil: {
      id: number;
      nome: string;
    }
}

@Component({
  selector: 'app-recovercadastro',
  templateUrl: './recovercadastro.page.html',
  styleUrls: ['./recovercadastro.page.scss'],
})
export class RecovercadastroPage implements OnInit {

  public tLogin: string;
  public tSenha: string;
  private user: User;
  private regUser: RegUser;

  constructor(private alertController: AlertController,
              private api: ApiServices,
              private storageService: StorageService,
              private nav: NavController) { }

  ngOnInit() {
    console.log('Recover...');
    this.api.setCallBack(this.goNada);
    this.api.getCab();
  }

  goNada = () => {};

  recoverData = () => {
    let ok = true;
    const header = 'Atenção';
    const subh = 'Autenticação';
    if (this.tLogin === undefined) {
      const msg = 'Informe seu login';
      this.alertar(header, subh, msg);
      ok = false;
    }
    if (ok) {
      if (this.tLogin === '') {
        const msg = 'Informe seu login';
        this.alertar(header, subh, msg);
        ok = false;
      }
    }
    if (ok) {
      if (this.tSenha === undefined) {
        const msg = 'Informe sua senha';
        this.alertar(header, subh, msg);
        ok = false;
      }
    }
    if (ok) {
      if (this.tSenha === '') {
        const msg = 'Informe sua senha';
        this.alertar(header, subh, msg);
        ok = false;
      }
    }
    if (ok) {
      this.user = {
        login: this.tLogin,
        senha: this.tSenha
      };
      this.api.getByLoginESenha(this.user).then(reg => this.gotByLoginESenha(reg));
    }
  }

  gotByLoginESenha = (data) => {
    console.log("Resposta da API: " + "%o", data);
    const header = 'Atenção';
    const subh = 'Cadastro';
    if (data === undefined) {
      const msg = 'Erro recuperando dados';
      this.alertar(header, subh, msg);
    } else if (data.id === undefined) {
      const msg = 'Erro recuperando dados';
      this.alertar(header, subh, msg);
    } else if (data.id === 0) {
      const msg = 'Erro recuperando dados';
      this.alertar(header, subh, msg);
    } else {
      this.regUser = data;
      this.storageService.setRegUser(this.regUser);
      this.nav.navigateRoot('/menu', { animated: true, animationDirection: 'forward' });
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
}
