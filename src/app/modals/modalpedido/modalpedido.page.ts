import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiServices } from 'src/app/service/apiService';
import { FormatServices } from 'src/app/service/formatService';
import { PrecoService } from 'src/app/service/precoService';
import { StorageService, OpcoesPedido, RegistroEstabelecimento, Produto, Pedido, Forma, ItemPedido, MeioAMeio, Metades } from 'src/app/service/storage.service';
import { ModalformasPage } from '../modalformas/modalformas.page';
import { ModalopcoespedidoPage } from '../modalopcoespedido/modalopcoespedido.page';
import { ModaltrocoPage } from '../modaltroco/modaltroco.page';

declare  global {
  interface String {
    gentNum(): string;
    numGent(): string;
    toMoeda(): string;
    correnciaParaFloat(): string;
    float2moeda(): string;
  }
}

interface Produtox {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  tipo: {
    id: number;
    nome: string;
  };
  categoria: {
    id: number;
    nome: string;
  };
  divisao: {
    id: number;
    nome: string;
  };
  valor: string;
}

interface QtdEntidade {
  idItem: number;
  idPedido: number;
  idProduto: number;
  qtd: number;
  idCliente: number;
  idStab: number;
  desconto: number;
}

interface BtModal {
  text: string;
  handler: any;
  role: string;
}

@Component({
  selector: 'app-modalpedido',
  templateUrl: './modalpedido.page.html',
  styleUrls: ['./modalpedido.page.scss'],
})
export class ModalpedidoPage implements OnInit {

  public pedido: Pedido;
  public dataPedido: string;
  public produtos: Produto[];
  public produto: Produto;
  public itensPedido: ItemPedido[];
  public itemPedido: ItemPedido;
  public itensMeioAMeio: ItemPedido[];
  public itensTela: ItemPedido[];
  public dataTela: string;
  public eQtd: QtdEntidade;
  public formasPg: string;
  public formas: Forma[];
  public forma: Forma;
  public obsTroco: string;
  public opcoes: OpcoesPedido[];
  public opcao: OpcoesPedido;
  private idItem: number;

  public conta: number;
  private novoStatus: number;
  public metades: MeioAMeio[];

  constructor(private modalCtrl: ModalController,
              private storageService: StorageService,
              private api: ApiServices,
              formatService: FormatServices,
              private alertController: AlertController,
              private precoService: PrecoService) {
                String.prototype.gentNum = function() {
                  const parm = this;
                  let retorno = parm;
                  if (parm.length > 9) {
                      retorno = parm.substring(6, 10) + '-' + parm.substring(3, 5) + '-' + parm.substring(0, 2);
                  }
                  return retorno;
                };
                String.prototype.numGent = function() {
                  const parm = this;
                  let retorno = parm;
                  if (parm.length > 9) {
                      retorno = parm.substring(8, 10) + '/' + parm.substring(5, 7) + '/' + parm.substring(0, 4);
                  }
                  return retorno;
                };
                String.prototype.toMoeda = function() {
                  const num = this;
                  const retorno = formatService.float2moeda(num);
                  return retorno;
                };
                String.prototype.correnciaParaFloat = function() {
                  let parm = this;
                  parm = formatService.removePonto(parm);
                  parm = formatService.trocaVigulaPonto(parm);
                  parm = parm.replace('R$', '');
                  parm = parm.replace(' ', '');
                  return parm;
              }
  }

  ngOnInit() {
    console.log('produto selecionado');
    this.pedido = this.storageService.getCurPed();
    if (this.pedido.obsTroco === null) {
      this.obsTroco = '';
    } else if (this.pedido.obsTroco === 'null') {
      this.obsTroco = '';
    } else if (this.pedido.obsTroco === '') {
      this.obsTroco = '';
    } else {
      this.obsTroco = '( troco para ' + this.pedido.obsTroco + ' )';
    }
    console.log(this.opcoes);
    this.dataTela = this.pedido.dataHora.numGent();
    this.api.setCallBack(this.getStab);
    this.api.getCab();
  }

  getStab = () => {
    this.api.getEstabelecimento(this.pedido.idEstabelecimento).then(reg => this.gotStab(reg));
  }

  gotStab = (data) => {
    this.storageService.setStab(data);
    this.getItensPedido();
  }

  getItensPedido = () => {
    this.conta = 0;
    this.api.getItensPedido(this.pedido.id).then(reg => this.gotItensPedido(reg));
  }

  gotItensPedido = (data) => {
    console.log(data);
    this.itensPedido = data;
    this.preparaItensPedido();
  }

  preparaItensPedido = () => {
    console.log('Pegando item ' + this.conta);
    if (this.itensPedido.length > this.conta) {
      this.itemPedido = this.itensPedido[this.conta];
      const idProduto = this.itemPedido.idProduto;
      this.api.getProdutoById(idProduto).then(reg => this.gotProduto(reg));
    } else {
      this.itensMeioAMeio = this.itensPedido.filter(p => p.idMetade2 != 0);
      this.itensPedido = this.itensPedido.filter(p => p.idMetade2 == 0);
      this.itensTela = this.itensPedido;
      this.getTotalPedido();
    }
  }

  getTotalPedido = () => {
    this.api.getTotalPedido(this.pedido.id).then(reg => this.gotTotal(reg));
  }

  gotTotal = (data) => {
    this.pedido.total = data.total.toString().toMoeda();
    this.getFormas();
  }

  getFormas = () => {
    this.api.getFormasPedido(this.pedido.id).then(reg => this.gotFormas(reg));
  }

  gotFormas = (data) => {
    this.formasPg = 'não definida';
    if (data.length > 0) {
      console.log('Tem formas');
      this.formas = data;
      this.setFormas();
    } else {
      console.log('Não tem formas');
      this.obsTroco = '';
      this.storageService.setTroco('');
      this.getOpcoesItem();
    }
  }

  setFormas = () => {
    this.formasPg = '';
    this.formas.forEach(item => {
      this.forma = item;
      if (this.formasPg !== '') {
        this.formasPg += ', ';
      }
      this.formasPg += this.forma.nome;
    });
    const checaDin: boolean = this.storageService.getFormaMudada();
    if (checaDin) {
      this.resolvePedeTroco();
    } else {
      this.getOpcoesItem();
    }
  }

  resolvePedeTroco = () => {
    const n = this.formasPg.indexOf('Dinh');
    if ( n >= 0) {
      console.log('Pede troco');
      this.openModalTroco();
    } else {
      console.log('Não pede troco');
      this.storageService.setTroco('');
      this.obsTroco = '';
    }
    this.storageService.setFormaMudada(false);
    this.getOpcoesItem();
  }

  getOpcoesItem = () => {
    this.conta = 0;
    this.percorreOpcoes();
  }

  percorreOpcoes = () => {
    if (this.itensPedido.length > this.conta) {
      this.itemPedido = this.itensPedido[this.conta];
      this.api.getOpcoesItem(this.itemPedido.id).then(regs => this.gotOpcoes(regs));
    } else {
      console.log('Resultado opções:');
      this.complementaMetades();
    }
  }

  complementaMetades = () => {
    this.metades = [];
    for (const idx in this.itensMeioAMeio) {
      const mtd = this.itensMeioAMeio[idx];
      let meio: MeioAMeio;
      let prd2: Produto;
      let metades: Metades;
      let stab: RegistroEstabelecimento = this.storageService.getStab();
      this.api.getProdutoById(mtd.idMetade2).then(res => {
        prd2 = this.objToProd(res);
        metades = {
          m1: mtd.produto,
          m2: prd2,
          preco: '0',
          qtd: mtd.qtd,
          idItem: mtd.idMetade2,
          total: mtd.total
        }
        const vCalculado = this.precoService.calculoPrecoMetades(metades, stab);
        const total = parseFloat(vCalculado.correnciaParaFloat()) * metades.qtd
        const tt = total.toString().float2moeda();
        meio = {
          desconto: mtd.desconto,
          id: mtd.id,
          idProduto: mtd.idProduto,
          idMetade2: mtd.idMetade2,
          qtd: mtd.qtd,
          idPedido: mtd.idPedido,
          opcoes: mtd.opcoes,
          produto: mtd.produto,
          seq: mtd.seq,
          total: tt,
          valor: parseFloat(vCalculado.correnciaParaFloat()),
          produto2: prd2,
          unitario: parseFloat(vCalculado.correnciaParaFloat()).toString().float2moeda()
        }
        this.metades.push(meio);
      });
    }
  }

  objToProd = (obj) => {
    let prd: Produto = obj;
    return prd;
  }

  gotOpcoes = (data) => {
    this.opcoes = data;
    this.itemPedido = this.itensPedido[this.conta];
    this.itemPedido.opcoes = this.opcoes;
    this.conta++;
    this.percorreOpcoes();
  }

  acertar = (last: boolean) => {
    if (last) {
      this.doAcerto();
    }
  }

  gotProduto = (data) => {
    this.produto = data;
    console.log(this.produto);
    const valor = this.produto.preco.toString().toMoeda();
    this.produto.valor = valor;
    const total = (this.produto.preco * this.itemPedido.qtd) - this.itemPedido.desconto;
    this.itemPedido.total = total.toString().toMoeda();
    this.itemPedido.produto = this.produto;
    this.itensPedido[this.conta] = this.itemPedido;
    this.conta++;
    this.preparaItensPedido();
  }

  doAcerto = () => {
    const tam = screen.width;
    const el = document.getElementById('iListaMP');
    if (tam < 768) {
      el.style.setProperty('padding-left', '5%');
      el.style.setProperty('padding-right', '5%');
    } else {
      el.style.setProperty('padding-left', '25%');
      el.style.setProperty('padding-right', '25%');
    }
    // console.log('acertado');
  }

  maisProd = (id, modo) => {
    if (this.pedido.idStatus !== 3) {
      const header = 'Atenção';
      const subh = 'Permissões';
      const msg = 'Este pedido está com status ' + this.pedido.nomeStatus + ' e não pode ser alterado';
      this.alertar(header, subh, msg);
    } else {
      this.itemPedido = this.storageService.getJsonByCampo(this.itensPedido, 'id', id);
      if (modo == 2) {
        this.itemPedido = this.metades.find(m => m.id == id);
      }
      let qtd = this.itemPedido.qtd;
      qtd++;
      console.log('Modando quantidade de ' + this.itemPedido.qtd + ' para ' + qtd);
      this.itemPedido.qtd = qtd;
      const total = (this.itemPedido.qtd * this.itemPedido.produto.preco) - this.itemPedido.desconto;
      const sTotal = total.toString().toMoeda();
      this.itemPedido.total = sTotal;
    }
  }

  menosProd = (id, modo) => {
    if (this.pedido.idStatus !== 3) {
      const header = 'Atenção';
      const subh = 'Permissões';
      const msg = 'Este pedido está com status ' + this.pedido.nomeStatus + ' e não pode ser alterado';
      this.alertar(header, subh, msg);
    } else {
      this.itemPedido = this.storageService.getJsonByCampo(this.itensPedido, 'id', id);
      if (modo == 2) {
        this.itemPedido = this.metades.find(m => m.id == id);
      }
      let qtd = this.itemPedido.qtd;
      qtd--;
      console.log('Modando quantidade de ' + this.itemPedido.qtd + ' para ' + qtd);
      this.itemPedido.qtd = qtd;
      const total = (this.itemPedido.qtd * this.itemPedido.produto.preco) - this.itemPedido.desconto;
      const sTotal = total.toString().toMoeda();
      this.itemPedido.total = sTotal;
    }
  }

  altQtd = (id, modo) => {
    if (this.pedido.idStatus !== 3) {
      const header = 'Atenção';
      const subh = 'Permissões';
      const msg = 'Este pedido está com status ' + this.pedido.nomeStatus + ' e não pode ser alterado';
      this.alertar(header, subh, msg);
    } else {
      this.itemPedido = this.storageService.getJsonByCampo(this.itensPedido, 'id', id);
      if (modo == 2) {
        this.itemPedido = this.metades.find(m => m.id == id);
      }
      const user = this.storageService.getRegUser();
      this.eQtd = {
        idCliente: user.id,
        idItem: this.itemPedido.id,
        idPedido: this.itemPedido.idPedido,
        idProduto: this.produto.id,
        idStab: this.pedido.idEstabelecimento,
        qtd: this.itemPedido.qtd,
        desconto: 0
      };
      console.log(this.eQtd);
      this.api.setQtdItem(this.eQtd).then(ret => this.qtdSetada(ret));
    }
  }

  qtdSetada = (data) => {
    if (data.retorno !== 'Ok') {
      const header = 'Atenção';
      const subh = 'Erro!';
      const msg = data.retorno;
      this.alertar(header, subh, msg);
    } else {
      this.closeModal();
    }
  }

  fecharPedido = () => {
    if (this.formasPg === 'não definida') {
      const header = 'Atenção';
      const subh = 'Erro!';
      const msg = 'Para fechar um pedido você deve antes definir as formas de pagamento';
      this.alertar(header, subh, msg);
    } else {
      console.log('Pedido fechado');
      const idStatus = 5;
      this.novoStatus = 5;
      const idPedido = this.pedido.id;
      this.api.setStatusPedido(idPedido, idStatus).then(ret => this.pedidoFechado(ret));
    }
  }

  pedidoFechado = (data) => {
    if (data.retorno !== 'Ok') {
      const header = 'Atenção';
      const subh = 'Erro!';
      const msg = data.retorno;
      this.alertar(header, subh, msg);
    } else {
      this.closeModal();
      this.pedido.idStatus = this.novoStatus;
      this.storageService.setCurPed(this.pedido);
      this.getItensPedido();
    }
  }

  cancelarPedido = () => {
    console.log('Pedido cancelado');
    const idStatus = 4;
    this.novoStatus = 4;
    const idPedido = this.pedido.id;
    this.api.setStatusPedido(idPedido, idStatus).then(ret => this.pedidoFechado(ret));
  }

  reativarPedido = () => {
    const idStatus = 3;
    this.novoStatus = 3;
    const idPedido = this.pedido.id;
    this.api.setStatusPedido(idPedido, idStatus).then(ret => this.pedidoFechado(ret));
  }

  jaCancelado = () => {
    const header = 'Atenção';
    const subh = 'Alteração de pedido';
    const msg = 'Este pedido já está cancelado';
    this.alertar(header, subh, msg);
  }

  setStatus = () => {
    if (this.pedido.idStatus !== 3 && this.pedido.idStatus !== 4) {
      const header = 'Atenção';
      const subh = 'Permissões';
      const msg = 'Este pedido está com status ' + this.pedido.nomeStatus + ' e não pode ser alterado';
      this.alertar(header, subh, msg);
    } else {
      let btFecha: BtModal;
      btFecha = {
        text: 'Fechar pedido',
        role: 'fechar',
        handler: this.fecharPedido
      };
      if (this.pedido.idStatus === 4) {
        btFecha = {
          text: 'Reativar pedido',
          role: 'fechar',
          handler: this.reativarPedido
        };
      }
      let btCancel: BtModal;
      btCancel = {
        text: 'Cancelar o pedido',
        role: 'cancel',
        handler: this.cancelarPedido
      };
      if (this.pedido.idStatus === 4) {
        btCancel = {
          text: 'Cancelar o pedido',
          role: 'cancel',
          handler: this.jaCancelado
        };
      }
      let btSai: BtModal;
      btSai = {
        text: 'Sair',
        role: 'saida',
        handler: null
      };
      const buttons = [btFecha, btCancel, btSai];
      const header = 'Atenção';
      const subh = 'Decisão';
      const msg = 'Alterar seu pedido';
      this.alertDecide(header, subh, msg, buttons);
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

  async alertDecide(head, subHead, parm, buttons) {
    const alert = await this.alertController.create({
      header: head,
      subHeader: subHead,
      message: parm,
      buttons
    });
    return await alert.present();
  }

  openOpcoes = (id: number) => {
    if (this.pedido.idStatus !== 3) {
      const header = 'Atenção';
      const subh = 'Permissões';
      const msg = 'Este pedido está com status ' + this.pedido.nomeStatus + ' e não pode ser alterado';
      this.alertar(header, subh, msg);
    } else {
      this.idItem = id;
      this.storageService.setIdItem(id);
      this.openModalOpcoes();
    }
  }

  async openModal() {
    if (this.pedido.idStatus !== 3) {
      const header = 'Atenção';
      const subh = 'Permissões';
      const msg = 'Este pedido está com status ' + this.pedido.nomeStatus + ' e não pode ser alterado';
      this.alertar(header, subh, msg);
    } else {
      const modal = await this.modalCtrl.create({
        component: ModalformasPage
      });
      modal.onDidDismiss().then((data) => {
        this.getFormas();
      });
      this.storageService.setRefresca(0);
      return await modal.present();
    }
  }

  async openModalTroco() {
    const modal = await this.modalCtrl.create({
      component: ModaltrocoPage
    });
    modal.onDidDismiss().then((data) => {
      this.obsTroco = '';
      if (this.storageService.getTroco() !== undefined) {
        if (this.storageService.getTroco() !== '') {
          this.obsTroco = '( troco para ' + this.storageService.getTroco() + ' )';
        }
      }
    });
    this.storageService.setRefresca(0);
    return await modal.present();
  }

  async openModalOpcoes() {
    const modal = await this.modalCtrl.create({
      component: ModalopcoespedidoPage
    });
    modal.onDidDismiss().then((data) => {
      this.getOpcoesItem();
    });
    this.storageService.setRefresca(0);
    return await modal.present();
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }}
