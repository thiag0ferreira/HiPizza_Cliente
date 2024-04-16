import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AbreprodPage } from '../modals/abreprod/abreprod.page';
import { ApiServices } from '../service/apiService';
import { FormatServices } from '../service/formatService';
import { StorageService, RegistroUsuario, Produto, RegistroEstabelecimento } from '../service/storage.service';

declare  global {
  interface String {
    toMoeda(): string;
  }
}

interface Favorito {
  idStab: number,
  fantasia: string,
  razao: string,
  produtos: Produto[]
}

interface PedidoNoProduto {
  produto: Produto,
  dto: {
    id: number,
    seq: number,
    qtd: number,
    valor: number,
    desconto: number,
    idPedido: number,
    idProduto: number,
    total: number
  }
}

@Component({
  selector: 'app-produtosfavoritos',
  templateUrl: './produtosfavoritos.page.html',
  styleUrls: ['./produtosfavoritos.page.scss'],
})
export class ProdutosfavoritosPage implements OnInit {

  private user: RegistroUsuario;
  private idxPagina: number;
  public produto: Produto;
  private favoritos: Favorito[];

  public pequeno: boolean;
  public grande: boolean;

  public favoritoTela: Favorito;
  public mais: boolean;
  public primeiro: boolean;

  public nPedsAbertos: number;
  public nItens: number;

  constructor(private storageService: StorageService,
    private api: ApiServices,
    private formatService: FormatServices,
    private modalCtrl: ModalController) {
      String.prototype.toMoeda = function() {
        const num = this;
        const retorno = formatService.float2moeda(num);
        return retorno;
      };
    }

  ngOnInit() {
    console.log('Favoritos');
    const tam = screen.width;
    if (tam < 768) {
      this.pequeno = true;
      this.grande = false;
    } else {
      this.pequeno = false;
      this.grande = true;
    }
    this.idxPagina = 0;
    // this.storageService.getUser().then(reg => this.gotUser(reg));
    const data = this.storageService.getRegUser();
    this.gotUser(data);
  }

  gotUser = (data) => {
    this.user = data;
    this.api.setCallBack(this.getFavoritos);
    this.api.getCab();
  }

  getFavoritos = () => {
    this.api.trazFavoritosDoCliente(this.user.id).then(regs => this.gotFavoritos(regs));
  }

  gotFavoritos = (data) => {
    console.log(data);
    this.favoritos = data;
    this.trazRegistros();
  }
  
  trazRegistros = () => {
    class klass implements PedidoNoProduto {
      produto: Produto;
      dto: { id: number; 
        seq: number; 
        qtd: number; 
        valor: number; 
        desconto: number; 
        idPedido: number; 
        idProduto: number; 
        total: number; 
      };
      
      constructor(o: any){
        Object.assign(this, o);
      }
    }
    let fav = this.favoritos[this.idxPagina];
    this.favoritoTela = fav;
    this.primeiro = false;
    if (this.idxPagina == 0) {
      this.primeiro = true;
    }
    const k = this.idxPagina + 1;
    this.mais = false;
    if (this.favoritos.length > k) {
      this.mais = true;
    }
    for (const produto of fav.produtos) {
      const valor = produto.preco.toString();
      produto.valor = valor.toMoeda();
      produto.valPedido = '';
      produto.idPedido = 0;
      this.api.getProdutoComPedido(this.user.id, produto.id).then(ret => {
        let pedProd = new klass(ret);
        if (pedProd.dto === null) {
          console.log('Nulo');
        } else {
          console.log('Continua');
          const qtd = pedProd.dto.qtd
          const preco = pedProd.dto.valor;
          const total = qtd * preco;
          const vUn = preco.toString().toMoeda();
          const vTo = total.toString().toMoeda();
          const msg = '(' + qtd + ') x ' + vUn + ' = ' + vTo;
          produto.valPedido = msg;
          produto.idPedido = pedProd.dto.idPedido;
        }
      });
    }
    this.favoritoTela = fav;
    this.nItens = 0;
  }

  goAdiante = () => {
    this.idxPagina++;
    this.trazRegistros();
  }

  goVoltar = () => {
    this.idxPagina--;
    this.trazRegistros()
  }

  abrePede = (id) => {
    class klass implements RegistroEstabelecimento {
      id: number;
      cargoContato: string;
      cnpj: string;
      contatoEmpresa: string;
      ddd: string;
      deptoContato: string;
      dtAtualizacao: string;
      dtUltContato: string;
      email: string;
      emailContato: string;
      fantasia: string;
      faturamento: string;
      fone: string;
      ie: string;
      mailing: string;
      numeroFuncionarios: string;
      razaoSocial: string;
      sms: string;
      status: string;
      poligono: string;
      idStatusEntidade: number;
      nomeStatusEntidade: string;
      website: string;
      meioameio: string;
      
      constructor(o: any){
        Object.assign(this, o);
      }
    }
    this.storageService.setCurPed(0);
    this.produto = this.storageService.getJsonByCampo(this.favoritoTela.produtos, 'id', id);
    this.api.getEstabelecimento(this.produto.tipo.idStab).then(ret => {
      let stab = new klass(ret);
      this.storageService.setStab(stab);
    });
    this.storageService.setCurProd(this.produto);
    if (this.produto.idPedido !== 0) {
      let curPed = {};
      curPed['id'] = this.produto.idPedido;
      this.storageService.setCurPed(curPed);
    }
    this.openModalPede();
  }

  async openModalPede() {
    const modal = await this.modalCtrl.create({
      component: AbreprodPage
    });
    modal.onDidDismiss().then((data) => {
      this.getFavoritos();
    });
    this.storageService.setRefresca(0);
    return await modal.present();
  }
}
