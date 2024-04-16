import { Component, OnInit } from '@angular/core';
import { StorageService, RegistroUsuario } from '../service/storage.service';
import { NavController, AlertController } from '@ionic/angular';
import { ApiServices } from '../service/apiService';

@Component({
  selector: 'app-informetoken',
  templateUrl: './informetoken.page.html',
  styleUrls: ['./informetoken.page.scss'],
})
export class InformetokenPage implements OnInit {

  public user: RegistroUsuario;
  public tToken: string;

  constructor(public storageService: StorageService,
              private nav: NavController,
              public alertController: AlertController,
              public api: ApiServices) { }

  ngOnInit() {
    console.log('Entrando...');
    this.getDadosUser();
  }

  getDadosUser = () => {
    this.user = this.storageService.getRegUser();
    console.log(this.user);
  }

  checaToken = () => {
    let ok = true;
    if (this.tToken === undefined) {
      const head = 'Atenção';
      const sub = 'inconsistência';
      const msg = 'Informe o token';
      this.alertar(head, sub, msg);
      ok = false;
    }
    if (ok) {
      if (this.tToken === '') {
        const head = 'Atenção';
        const sub = 'inconsistência';
        const msg = 'Informe o token';
        this.alertar(head, sub, msg);
        ok = false;
      }
    }
    if (ok) {
      if (this.tToken.length < 6 || this.tToken.length > 6) {
        const head = 'Atenção';
        const sub = 'inconsistência';
        const msg = 'Token inválido';
        this.alertar(head, sub, msg);
        ok = false;
      }
    }
    if (ok) {
      this.api.checaToken(this.user.email, this.tToken).then((resposta) => this.trataChecaToken(resposta));
    }
  }

  trataChecaToken = (data) => {
    const retorno = data.retorno;
    if (retorno !== 'Ok') {
      const head = 'Atenção';
      const sub = 'inconsistência';
      const msg = 'Token inválido';
      this.alertar(head, sub, msg);
    } else {
      console.log('Validado');
      this.user.flow = 'token validado';
      this.storageService.salvaStrUser(this.user);
      this.nav.navigateRoot('/menu', { animated: true, animationDirection: 'forward' });
    }
  }

  reEnvioToken = () => {
    const id = this.user.id;
    this.api.reEnviaToken(id).then(ret => this.reEnviado(ret));
  }

  reEnviado = (data) => {
    const header = 'Atenção;';
    const subh = 'Envio de token';
    if (data.retorno === 'Ok') {
      const msg = 'Token enviado com sucesso\nCheque seu e-mail';
      this.alertar(header, subh, msg);
    } else {
      const msg = data.retorno;
      this.alertar(header, subh, msg);
    }
  }


  remarcaEmail = () => {
    console.log('Teste');
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
