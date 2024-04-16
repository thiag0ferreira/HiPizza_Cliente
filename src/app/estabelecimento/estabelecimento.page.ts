import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { AbreprodPage } from '../modals/abreprod/abreprod.page';
import { ApiServices } from '../service/apiService';
import { FormatServices } from '../service/formatService';
import { StorageService, RegistroEstabelecimento, RegistroUsuario, Produto, Item, Tipo } from '../service/storage.service';
import { ModalpedidoPage } from '../modals/modalpedido/modalpedido.page';
import { ModalformasPage } from '../modals/modalformas/modalformas.page';
import { MeioAMeioPage } from '../modals/meio-a-meio/meio-a-meio.page';
import { ModaleditametadesPage } from '../modals/modaleditametades/modaleditametades.page';

declare  global {
  interface String {
    toMoeda(): string;
  }
}
interface Favorito {
  favorito: number;
  id: number;
  mau: number;
  naomostrat: number;
  obs: string;
}

interface Itens {
  id: number;
  seq: number;
  qtd: number;
  valor: number;
  desconto: number;
  idPedido: number;
  idProduto: number;
  idMetade2: number
}

interface Metades {
  m1: Produto,
  m2: Produto,
  qtd: number,
  preco: string,
  total: string,
  idItem: number
}

class ItTel implements Item{
  tipo: Tipo;
  produtos: Produto[];
};

class ProdClass implements Produto{
  id: number;
  nome: number;
  descricao: string;
  detalhe: string;
  preco: number;
  publicado: number;
  valor: string;
  pub: boolean;
  tipo: { id: number; nome: string; idStab: number; };
  valPedido: string;
  idPedido: number
}

@Component({
  selector: 'app-estabelecimento',
  templateUrl: './estabelecimento.page.html',
  styleUrls: ['./estabelecimento.page.scss'],
})
export class EstabelecimentoPage implements OnInit {

  public stab: RegistroEstabelecimento;
  public user: RegistroUsuario;
  public favorito: Favorito;

  public fn: any;
  public produtos: Produto[];
  public produto: Produto;
  public nPedsAbertos: number;
  public nItens: number;
  public itens: Itens[];
  public item: Itens;
  public idxPagina: number;
  public tipoNome: string
  
  public itensPrd: Item[];
  public itensTela: Item[];
  public itemTela: Item;
  public voltar: number;
  public mais: number;
  public semMeio = true;
  public metades: Metades[];

  constructor(private storageService: StorageService,
              private api: ApiServices,
              private alertController: AlertController,
              formatService: FormatServices,
              private modalCtrl: ModalController,
              private nav: NavController,
              private fmt: FormatServices) {
    console.log('stab');
    String.prototype.toMoeda = function() {
      const num = this;
      const retorno = formatService.float2moeda(num);
      return retorno;
    };
    String.prototype.float2moeda = function() {
      let parm = this;
      const retorno = fmt.float2moeda(parm);
      return retorno;
    };
  }

  ngOnInit() {
    console.log('estab lista produtos');
    this.idxPagina = 0;
    this.stab = this.storageService.getStab();
    this.api.setCallBack(this.getUserByEmail);
    this.api.getCab();
  }

  getUserByEmail = () => {
    // this.storageService.getUser().then(reg => this.gotUser(reg));
    const reg = this.storageService.getRegUser();
    this.gotUser(reg);
  }

  gotUser = (data) => {
    this.api.getUserByEmail(data.email).then(reg => this.fillUser(reg));
  }

  fillUser = (data) => {
    this.user = data;
    this.storageService.setRegUser(data);
    this.api.getStabFav(this.user.id, this.stab.id).then(reg => this.gotFav(reg));
  }

  gotFav = (data) => {
    console.log(data);
    this.favorito = data;
    console.log(this.favorito);
    if (this.favorito.id !== null) {
      if (this.favorito.favorito === 1) {
        document.getElementById('iStar').style.color = '#f2d857';
      } else {
        document.getElementById('iStar').style.color = 'Black';
      }
    }
    this.getProdutosStab();
  }

  doMudaFav = () => {
    console.log('Mudar');
    this.api.alteraFavorito(this.user.id, this.stab.id).then(ret => this.mudouFavorito(ret));
  }

  mudouFavorito = (data) => {
    console.log(data);
    if (data.retorno !== 'Ok') {
      const header = 'Atenção';
      const subh = 'Erro!';
      const msg = data.retorno;
      this.alertar(header, subh, msg);
    } else {
      this.api.getStabFav(this.user.id, this.stab.id).then(reg => this.gotFav(reg));
    }
  }

  mudaFav = () => {
    const header = 'Atenção';
    const subh = 'Decisão';
    let msg = 'Deseja colocar este estabelecimento como favorito ?';
    if (this.favorito.favorito === 1) {
      msg = 'Deseja remover este estabelecimento da lista de favoritos';
    }
    this.fn = this.doMudaFav;
    this.alertDecide(header, subh, msg);
  }

  getProdutosStab = () => {
    this.api.getProdutosStab(this.stab.id).then(data => this.gotProdutos(data));
  }

  terminou = (bol) => {
    if (bol) {
      this.doAcerto();
    }
  }

  gotProdutos = (data) => {
    this.itensPrd = data;
    for (const itemPrd of this.itensPrd) {
      this.produtos = itemPrd.produtos;
      for (const produto of this.produtos) {
        const valor = produto.preco.toString();
        produto.valor = valor.toMoeda();
        produto.valPedido = '';
      }
    }
    this.trazInfoTela();
  }
  
  trazInfoTela = () => {
    
    let itTela = [];
    for (const itemPrd of this.itensPrd) {
      let produtos = itemPrd.produtos;
      let validos = [];
      for (const prd of produtos) {
        if (prd.publicado === 1) {
          validos.push(prd);
        }
      }
      if (validos.length > 0) {
        let itValido = new ItTel();
        itValido.tipo = itemPrd.tipo;
        itValido.produtos = validos;
        itTela.push(itValido);
      }
    }
    this.itensTela = itTela;
    this.trazProdutos();
  }
  
  trazProdutos = () => {
    if (this.itensTela.length > 0) {
      this.itemTela = this.itensTela[this.idxPagina];
      this.tipoNome = this.itemTela.tipo.nome;
      this.produtos = this.itemTela.produtos;
      this.semMeio = true;
      if (this.itemTela.tipo.aplicaMeioAMeio === 1) {
        this.semMeio = false;
      }
      const k = this.idxPagina + 1;
      this.mais = (k < this.itensTela.length) ? 1 : 0;
      this.voltar = (this.idxPagina > 0) ? 1 : 0;
      // this.haProd = (this.produtos.length > 0);
    }
    this.nItens = 0;
    this.api.getPedidosAtivosDeStab(this.user.id, this.stab.id).then(reg => this.gotPA(reg));
  }

  gotPA = (data) => {
    this.nPedsAbertos = data.length;
    this.storageService.setCurPed(0);
    if (this.nPedsAbertos === 1) {
      const idPed = data[0].id;
      this.storageService.setCurPed(data[0]);
      this.getNItensDePed(idPed);
    } else {
      for (const reg of data) {
        console.log('Mostrando');
        console.log(reg);
      }
    }
  }

  getNItensDePed = (id) => {
    this.api.contaItensNoPedido(id).then(ret => this.gotContagem(ret));
  }

  gotContagem = (data) => {
    this.nItens = data.retorno;
    if (this.storageService.getCurPed().idStatus === 5) {

    }
    this.itensPedido();
  }

  itensPedido = () => {
    if (this.nPedsAbertos === 1) {
      this.api.getItensPedido(this.storageService.getCurPed().id).then(ret => this.gotItens(ret));
    }
  }

  gotItens = (data) => {
    this.itens = data;
    this.iterateProdutos();
  }

  // TODO
  iterateProdutos = () => {
    this.metades = [];
    for (const produto of this.produtos) {
      this.item = this.storageService.getJsonByCampo(this.itens, 'idProduto', produto.id);
      if (this.item.qtd !== undefined) {
        if (this.item.idMetade2 == 0) {
          const qtd = this.item.qtd;
          const preco = produto.preco;
          const total = qtd * preco;
          console.log(qtd + ' ítens = ' + preco + ' * ' + qtd + ' = ' + total);
          const vUn = preco.toString().toMoeda();
          const vTo = total.toString().toMoeda();
          const msg = '(' + qtd + ') x ' + vUn + ' = ' + vTo;
          produto.valPedido = msg;
        } else {
          const m1 = this.produtos.find(p => p.id == this.item.idProduto);
          const m2 = this.produtos.find(p => p.id == this.item.idMetade2);
          const p1 = m1.preco;
          const p2 = m2.preco;
          let preco = p1;
          if (p2 > p1) {
            preco = p2;
          }
          if (this.stab.meioameio === 'medio') {
            preco = (p1 + p2) / 2;
            preco = parseFloat(parseFloat(preco.toString()).toFixed(2));
          }
          let total = preco * this.item.qtd;
          let metade: Metades = {
            m1: m1,
            m2: m2,
            qtd: this.item.qtd,
            preco: preco.toString().float2moeda(),
            total: total.toString().float2moeda(),
            idItem: this.item.id
          }
          this.metades.push(metade);
        }
      }
    }
  }

  goMeio = () => {
    console.log('Rotina para meio a meio');
    window.localStorage.setItem('itemMeio', JSON.stringify(this.itemTela));
    this.openModalMeio();
  }

  abreMetade = (id: number) => {
    const metade: Metades = this.metades.find(m => m.idItem == id);
    window.localStorage.setItem('metadeEditando', JSON.stringify(metade));
    this.openModalEditaMetades();
  }

  goVoltar = () => {
    this.idxPagina--;
    this.trazProdutos();
  }
  goAdiante = () => {
    this.idxPagina++;
    this.trazProdutos();
  }

  abreProd = (id) => {
    this.storageService.setCurProd(this.storageService.getJsonByCampo(this.produtos, 'id', id));
    this.openModal();
  }

  abreCarrinho = () => {
    console.log(this.storageService.getCurPed());
    this.openModalCarrinho();
  }

  doAcerto = () => {
    const tam = screen.width;
    const el = document.getElementById('iListaStab');
    if (tam < 768) {
      el.style.setProperty('padding-left', '5%');
      el.style.setProperty('padding-right', '5%');
    } else {
      el.style.setProperty('padding-left', '25%');
      el.style.setProperty('padding-right', '25%');
    }
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AbreprodPage
    });
    modal.onDidDismiss().then((data) => {
      this.getProdutosStab();
    });
    this.storageService.setRefresca(0);
    return await modal.present();
  }

  async openModalCarrinho() {
    const modal = await this.modalCtrl.create({
      component: ModalpedidoPage
    });
    modal.onDidDismiss().then((data) => {
      this.getProdutosStab();
      // this.api.getPedidosCliente(this.user.id); /*.then(regs => this.gotPedidos(regs));*/
    });
    this.storageService.setRefresca(0);
    return await modal.present();
  }

  async openModalFormas() {
    const modal = await this.modalCtrl.create({
      component: ModalformasPage
    });
    modal.onDidDismiss().then((data) => {
      // this.getProdutosStab();
    });
    this.storageService.setRefresca(0);
    return await modal.present();
  }

  async openModalMeio() {
    const modal = await this.modalCtrl.create({
      component: MeioAMeioPage
    });
    modal.onDidDismiss().then((data) => {
      this.getProdutosStab();
    });
    this.storageService.setRefresca(0);
    return await modal.present();
  }

  async openModalEditaMetades() {
    const modal = await this.modalCtrl.create({
      component: ModaleditametadesPage
    });
    modal.onDidDismiss().then((data) => {
      this.getProdutosStab();
    });
    this.storageService.setRefresca(0);
    return await modal.present();
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

  async alertDecide(head, subHead, parm) {
    const alert = await this.alertController.create({
      header: head,
      subHeader: subHead,
      message: parm,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.fn();
          }
        },
        {
          text: 'Não',
          role: 'cancel'
        }
      ]
    });
    return await alert.present();
  }goHome = () => {
    this.nav.navigateRoot('/menu', { animated: true, animationDirection: 'forward' });
  }

  
}
