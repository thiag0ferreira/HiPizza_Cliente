import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ApiServices } from '../service/apiService';
import { StorageService, RegistroUsuario } from '../service/storage.service';
import { FormatServices } from '../service/formatService';

@Component({
  selector: 'app-cadastro1email',
  templateUrl: './cadastro1email.page.html',
  styleUrls: ['./cadastro1email.page.scss'],
})
export class Cadastro1emailPage implements OnInit {

  public tNome: string;
  public tEmail: string;
  public tLogin: string;
  public tSenha: string;
  public tCelular: string;
  public tDdd: number;
  public tFone: string;
  private user: RegistroUsuario;
  private hData: any;
  public pad: 25;
  public flow: string;

  constructor(private nav: NavController,
              public alertController: AlertController,
              public api: ApiServices,
              public storageService: StorageService,
              public format: FormatServices) { }

  ngOnInit() {
    console.log('Entrando cadastro...');
    this.checaSituacaoUsuario();
    const tam = screen.width;
    const el = document.getElementById('iLista');
    if (tam < 768) {
      el.style.setProperty('padding-left', '5%');
      el.style.setProperty('padding-right', '5%');
    } else {
      el.style.setProperty('padding-left', '25%');
      el.style.setProperty('padding-right', '25%');
    }
  }

  branco = () => {};

  checaSituacaoUsuario = () => {
    this.api.setCallBack(this.branco);
    this.api.getCab();
    this.storageService.getUser().then((retorno) => { this.trataCkUser(retorno); });
  }
  trataCkUser = (data) => {
    console.log(data);
    if (data !== null) {
      if (data.flow !== undefined) {
        if (data.flow === 'token enviado') {
          this.storageService.setRegUser(data);
          this.nav.navigateRoot('/informetoken', { animated: true, animationDirection: 'forward' });
        }
      }
    }
  }

  goHome = () => {
    this.nav.navigateRoot('/home', { animated: true, animationDirection: 'forward' });
  }

  processaCadastro = () => {
    let ok = true;
    if (this.tNome === undefined) {
      this.alertar('Atenção', 'inconsistência', 'Informe seu nome e sobrenome');
      document.getElementById('tNome').focus();
      ok = false;
    }
    if (ok) {
      if (this.tNome === '') {
        this.alertar('Atenção', 'inconsistência', 'Informe seu nome e sobrenome');
        ok = false;
      }
    }
    if (ok) {
      if (this.tEmail === undefined) {
        this.alertar('Atenção', 'inconsistência', 'Informe seu e-mail');
        ok = false;
      }
    }
    if (ok) {
      if (this.tEmail === '') {
        this.alertar('Atenção', 'inconsistência', 'Informe seu e-mail');
        ok = false;
      }
    }
    if (ok) {
      if (this.tEmail.indexOf('@') <= 0) {
        this.alertar('Atenção', 'inconsistência', 'E-mail inválido');
        ok = false;
      }
    }
    if (ok) {
      if (this.tEmail.indexOf('.') <= 0) {
        this.alertar('Atenção', 'inconsistência', 'E-mail inválido');
        ok = false;
      }
    }
    if (ok) {
      const ia = this.tEmail.indexOf('@');
      const up = this.tEmail.lastIndexOf('.');
      if (up < ia) {
        this.alertar('Atenção', 'inconsistência', 'E-mail inválido');
        ok = false;
      }
    }
    if (ok) {
      if (this.tLogin === undefined) {
        this.alertar('Atenção', 'inconsistência', 'Informe seu login');
        ok = false;
      }
    }
    if (ok) {
      if (this.tLogin === '') {
        this.alertar('Atenção', 'inconsistência', 'Informe seu login');
        ok = false;
      }
    }
    if (ok) {
      if (this.tSenha === undefined) {
        this.alertar('Atenção', 'inconsistência', 'Informe sea senha');
        ok = false;
      }
    }
    if (ok) {
      if (this.tSenha === '') {
        this.alertar('Atenção', 'inconsistência', 'Informe sea senha');
        ok = false;
      }
    }
    if (ok) {
      let ddd = 0;
      let fone = '';
      if (this.tCelular !== undefined) {
        if (this.tCelular !== '') {
          const separado = this.format.separaFone(this.tCelular);
          const partes = separado.split(':');
          ddd = partes[0];
          fone = partes[1];
        }
      }
      this.tDdd = ddd;
      this.tFone = fone;
      this.api.checaLogin(this.tEmail, ddd, fone).then((data) => {
        console.log(data);
        this.trataRespostaChecaMail(data);
      });
    }
  }
  trataRespostaChecaMail = (data) => {
    const retorno = data.resposta;
    if (retorno !== 'Ok') {
      this.alertar('Atenção', 'Erro verificação', retorno);
    } else {
      console.log('Pode gravar');
      this.user = {
        email: this.tEmail,
        login: this.tLogin,
        senha: this.tSenha,
        flow: 'email unico',
        nome: this.tNome,
        id: 0,
        idPerfil: 0,
        ddd: this.tDdd,
        fone: this.tFone,
        verificada: 'Nok'
      };
      this.storageService.limpaRegUser();
      this.storageService.salvaStrUser(this.user);
      this.api.gravaNovoUser(this.user).then((datal) => this.trataNovoUser(datal));
    }
  }

  trataNovoUser = (user) => {
    console.log(user);
    console.log('Enviando código...');
    if (user.id !== undefined) {
      console.log('para user ' + user.id);
      this.api.geraToken(user.id).then((resposta) => this.trataEnvio(resposta));
    }
  }

  trataEnvio = (data) => {
    console.log('Resposta envio token: ');
    console.log(data);
    if (data.resposta !== 'Ok') {
      const head = 'Atenção';
      const subHead = 'retorno envio seu token';
      const msg = `O envio do token gerou uma cocrrência:<br>` + data.resposta;
      this.alertar(head, subHead, msg);
    } else {
      this.user.flow = 'token enviado';
      this.storageService.setRegUser(this.user);
      this.storageService.limpaRegUser();
      this.storageService.salvaRegistroUser(this.user);
      this.flow = this.user.flow;
      this.api.setCallBack(this.tokenEnviado);
      this.api.getCab();
    }
  }

  tokenEnviado = () => {
    this.api.getUserByEmail(this.user.email).then(reg => this.setUserCompleto(reg));
  }

  setUserCompleto = (data) => {
    this.user = data;
    this.user.flow = this.flow;
    this.storageService.salvaStrUser(this.user);
    this.storageService.setRegUser(this.user);
    this.nav.navigateRoot('/informetoken', { animated: true, animationDirection: 'forward' });
  }

  formata = (idElemento, qTipo) => {
    this.format.mascaraFone(idElemento, qTipo);
  }

  getReg = () => {
    this.storageService.getUser().then((resposta) => {
      const reg: any = resposta;
      this.user = reg;
      console.log(this.user);
    });
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
