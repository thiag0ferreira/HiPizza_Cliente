import { Component, OnInit } from '@angular/core';
import { StorageService, RegistroUsuario } from '../service/storage.service';
import { NavController } from '@ionic/angular';
import { ApiServices } from '../service/apiService';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public regUser: any;
  public serv: string;
  public user: RegistroUsuario;

  public verificar: boolean;
  public flow: string;

  constructor(public storageService: StorageService,
              private nav: NavController,
              private api: ApiServices) {

  }

  ngOnInit(): void {
    this.serv = 'local';
    console.log('Verificando usuário...');
    this.api.setCallBack(this.getUserFromStor);
    this.api.getCab();
  }

  getUserFromStor = () => {
    this.storageService.getUser().then((retorno) => this.gotUser(retorno));
  }

  gotUser = (data) => {
    if (data !== undefined && data != null) {
      this.user = data;
      this.flow = this.user.flow;
      if (this.user.id === 0) {
        const email = this.user.email;
        this.api.getUserByEmail(email).then(reg => this.gotByEmail(reg));
      } else {
        this.storageService.setRegUser(this.user);
        this.verifUser();
      }
    }
  }

  cadastraDepois = () => {};

  getMeusDados = () => {
    this.nav.navigateRoot('/recovercadastro', { animated: true, animationDirection: 'forward' });
  }

  gotByEmail = (data) => {
    this.user = data;
    this.user.flow = this.flow;
    console.log(this.user);
    this.storageService.setRegUser(this.user);
    this.verifUser();

  }

  verifUser = () => {
    const flow = this.user.flow;
    if (flow === 'token enviado') {
      this.nav.navigateRoot('/informetoken', { animated: true, animationDirection: 'forward' });
    }
    if (flow === 'token validado') {
      this.nav.navigateRoot('/menu', { animated: true, animationDirection: 'forward' });
    }
  }

  userSalvo = (data) => {
    console.log('Salvo');
    console.log(data);
  }

  mudaServ = () => {
    if (this.serv === 'local') {
      this.serv = 'nuvem';
    } else {
      this.serv = 'local';
    }
    this.storageService.setServer(this.serv);
    console.log(this.serv);
  }

  removeDados = () => {
    this.storageService.limpaRegUser();
  }

  cadastrar = () => {
    this.nav.navigateRoot('/cadastro1email', { animated: true, animationDirection: 'forward' });
  }
}
