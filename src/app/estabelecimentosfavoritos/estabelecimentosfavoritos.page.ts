import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiServices } from '../service/apiService';
import { RegistroUsuario, StorageService, RegistroEstabelecimento } from '../service/storage.service';

interface RegTela {
  stab: RegistroEstabelecimento;
  ed: any;
}

@Component({
  selector: 'app-estabelecimentosfavoritos',
  templateUrl: './estabelecimentosfavoritos.page.html',
  styleUrls: ['./estabelecimentosfavoritos.page.scss'],
})
export class EstabelecimentosfavoritosPage implements OnInit {

  private user: RegistroUsuario;
  public stab: RegistroEstabelecimento;
  private stabs: RegistroEstabelecimento[];
  private curStab: number;
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
  public staTotal: {
    st: RegistroEstabelecimento,
    ed: any;
  };
  public stbs: any;
  public pequeno: boolean;
  public grande: boolean;

  constructor(private storageService: StorageService,
    private api: ApiServices,
    private nav: NavController,
    private route: Router) { }

  ngOnInit() {
    console.log('Estabelecimentos Favoritos');
    const tam = screen.width;
    if (tam < 768) {
      this.pequeno = true;
      this.grande = false;
    } else {
      this.pequeno = false;
      this.grande = true;
    }
    this.api.setCallBack(this.getUser);
    this.api.getCab();
  }

  getUser = () => {
    this.storageService.getUser().then(reg => this.gotUser(reg));
  }

  nada = () => {}

  gotUser = (data) => {
    this.user = data;
    this.api.getFavoritosDoCliente(this.user.id).then(regs => this.gotFavoritos(regs));
  }

  gotFavoritos = (data) => {
    console.log(data);
    if (data.length === 0) {
      alert("Você não tem estabelecimentos favoritos");
      this.nav.navigateRoot('/menu', { animated: true, animationDirection: 'forward' });
    } else {
      this.populaStabs(data);
    }
  }

  goTodos = () => {
    this.nav.navigateRoot('/menu', { animated: true, animationDirection: 'forward' });
  }

  populaStabs = (data) => {
    this.stabs = data;
    this.curStab = 0;
    this.stbs = [];
    this.putEnders();
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

  verStab = (id) => {
    this.stab = this.storageService.getJsonByCampo(this.stabs, 'id', id);
    console.log(this.stab);
    this.storageService.setStab(this.stab);
    this.storageService.setCurPed(0);
    this.route.navigateByUrl('estabelecimento');
  }
}
