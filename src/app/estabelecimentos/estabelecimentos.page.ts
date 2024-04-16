import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { ApiServices } from '../service/apiService';
import { StorageService, RegistroUsuario, RegistroEstabelecimento } from '../service/storage.service';

interface RegTela {
  stab: RegistroEstabelecimento;
  ed: any;
}
@Component({
  selector: 'app-estabelecimentos',
  templateUrl: './estabelecimentos.page.html',
  styleUrls: ['./estabelecimentos.page.scss'],
})
export class EstabelecimentosPage implements OnInit {

  private user: RegistroUsuario;
  public stabs: RegistroEstabelecimento[];
  public stab: RegistroEstabelecimento;
  public stbs: any;
  public endStabs: { 
    'id': 0,
    'idEstabelecimento': '',
    'tipoLogradouro': '',
    'logradouro': '',
    'numero': '',
    'complemento': '',
    'cidade': '',
    'estado': '',
    'cep': '',
    'bairro': '',
    'coordenadas': '',
    'referencia': ''
  };
  public curStab: number;
  public staTotal: {
    st: RegistroEstabelecimento,
    ed: any;
  };
  public clienteVarrido = false;

  constructor(private api: ApiServices,
              private storageService: StorageService,
              private platform: Platform,
              private route: Router,
              private nav: NavController) {
                console.log('Busca Estabelecimentos');
              }

  ngOnInit() {
    this.api.setCallBack(this.nada);
    this.api.getCab();
    const tam = screen.width;
    const el = document.getElementById('iLista');
    if (tam < 768) {
      el.style.setProperty('padding-left', '5%');
      el.style.setProperty('padding-right', '5%');
    } else {
      el.style.setProperty('padding-left', '25%');
      el.style.setProperty('padding-right', '25%');
    }
    this.getUser();
  }

  getUser = () => {
    console.log('Pegando user');
    this.gotUser();
    // this.storageService.getUser().then(reg => this.gotUser(reg));
  }

  gotUser = () => {
    console.log('gotUser');
    let data = this.storageService.getRegUser();
    if (data === null) {
      console.log('data nula');
      data = this.storageService.getRegUser();
      console.log('gotRegUser');
      this.storageService.salvaRegistroUser(data);
    }
    console.log('Não é nula');
    this.user = data;
    console.log('Chacando varrido');
    this.checaClienteVarrido();
    // this.getStabs();
  }

  checaClienteVarrido = () => {
    const id = this.user.id;
    // this.api.getClienteVarrido(id).then(res => this.trouxeVarrido(res));
    console.log('Varrendo cliente agora');
    this.api.varreClienteAgora(id).then(res => this.varrendo(res));
  }

  trouxeVarrido = (res) => {
    if (res.retorno == 'Ok') {
      console.log('Pagendao estabelecimentos');
      this.getStabs();
    } else {
      this.api.varreClienteAgora(this.user.id).then(res => this.varrendo(res));
    }
  }

  varrendo = (res) => {
    console.log('checaVarreOcupado');
    this.api.checaVarreOcupado().then(res => this.varreChecado(res));
  }

  varreChecado = (res) => {
    if (res.retorno == '0') {
      this.getStabs();
    } else {
      this.api.checaVarreOcupado();
    }
  }

  getStabs = () => {
    const idCliente = this.user.id
    console.log('Buscando estabelecimentos que atendem');
    this.api.buscaEstabelecimentosQueAtendem(idCliente).then((regs: RegistroEstabelecimento) => this.gotStabs(regs));
  }

  gotStabs = (data) => {
    this.stabs = data;
    this.stbs = data;
    this.curStab = 0;
    this.stbs = [];
    console.log('Pondo endereços');
    this.putEnders();
  }

  getStabs2 = () => {
    this.api.getEstabelecimentos().then((regs) => this.gotStabs(regs));
  }

  putEnders = () => {
    if (this.curStab < this.stabs.length) {
      const idStabel = this.stabs[this.curStab].id;
      this.api.getEndereco(idStabel).then(reg => this.gotEnder(reg));
    } else {
      this.curStab = 0;
      this.trazPedidoDeStab();
    }
  }

  gotEnder = (data) => {
    this.endStabs = data;
    if (this.endStabs.id != null) {
    }
    const stabel = this.stabs[this.curStab];
    this.staTotal = {
      st: stabel,
      ed: this.endStabs
    };
    this.stbs[this.stbs.length] = this.staTotal;
    this.curStab++;
    this.putEnders();
  }

  trazPedidoDeStab = () => {
    if (this.curStab < this.stbs.length) {
      this.putPedidos();
    }
  }

  putPedidos = () => {
    const idStabel = this.stabs[this.curStab].id;
    const idUser = this.user.id;
    this.api.getPedidosAtivosDeStab(idUser, idStabel).then(ret => this.gotPedidos(ret));
  }

  gotPedidos = (data) => {
    const nPedidos = data.length;
    const reg: RegTela = this.stbs[this.curStab];
    reg.ed.nPeds = nPedidos;
    this.curStab++;
    this.trazPedidoDeStab();
  }

  maisStab = () => {
    this.getStabs2();
  }

  verStab = (id) => {
    this.stab = this.storageService.getJsonByCampo(this.stabs, 'id', id);
    console.log(this.stab);
    this.storageService.setStab(this.stab);
    this.storageService.setCurPed(0);
    this.route.navigateByUrl('estabelecimento');
  }

  abreStabsFavoritos = () => {
    this.nav.navigateRoot('/estabelecimentosfavoritos', { animated: true, animationDirection: 'forward' });
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      console.log('Carregou');
    });
  }

  nada = () => {

  }

  removeDados = () => {
    this.storageService.limpaRegUser();
    this.nav.navigateRoot('/home', { animated: true, animationDirection: 'forward' });
  }
}
