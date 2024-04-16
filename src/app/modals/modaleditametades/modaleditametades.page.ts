import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiServices } from 'src/app/service/apiService';
import { PrecoService } from 'src/app/service/precoService';
import { DetalhesItemPedido, Forma, ItemPedido, MeioAMeio, Metades, OpcoesPedido } from 'src/app/service/storage.service';
import {  Pedido, Produto, RegistroEstabelecimento, StorageService } from 'src/app/service/storage.service';
import { ModaltrocoPage } from '../modaltroco/modaltroco.page';

interface QtdEntidade {
  idItem: number;
  idPedido: number;
  idProduto: number;
  qtd: number;
  idCliente: number;
  idStab: number;
  desconto: number;
  idProduto2: number;
}

@Component({
  selector: 'app-modaleditametades',
  templateUrl: './modaleditametades.page.html',
  styleUrls: ['./modaleditametades.page.scss'],
})
export class ModaleditametadesPage implements OnInit {

  public pedido: Pedido;
  public obsTroco: string;
  public dataTela: string;
  public formasPg: string;
  public formas: Forma[];
  public conta: number;
  public itensPedido: ItemPedido[];
  public itemPedido: ItemPedido;
  public itensMeioAMeio: ItemPedido[];
  public metades: MeioAMeio[];
  public opcoes: OpcoesPedido[];
  public metade: Metades;
  public detalhesItem: DetalhesItemPedido;
  public preco: string;
  public qtd: number;
  public eQtd: QtdEntidade;

  constructor(private modalCtrl: ModalController,
              private storageService: StorageService,
              private api: ApiServices,
              private precoService: PrecoService,
              private alertController: AlertController) {
      String.prototype.numGent = function() {
        const parm = this;
        let retorno = parm;
        if (parm.length > 9) {
            retorno = parm.substring(8, 10) + '/' + parm.substring(5, 7) + '/' + parm.substring(0, 4);
        }
        return retorno;
      };
    }

  ngOnInit() {
    console.log('modalmetade');
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
    this.dataTela = this.pedido.dataHora.numGent();
    this.api.setCallBack(this.getStab);
    this.api.getCab();
  }

  getStab = () => {
    this.api.getEstabelecimento(this.pedido.idEstabelecimento).then(reg => this.gotStab(reg));
  }

  gotStab = (data) => {
    this.storageService.setStab(data);
    this.metade = JSON.parse(window.localStorage.getItem('metadeEditando'));
    this.qtd = this.metade.qtd;
    this.preco = this.metade.preco;
    this.getDetalhesItem();
  }

  getDetalhesItem = () => {
    this.api.getDetalheItemPedido(this.metade.idItem).then(res => this.trouxeDetalhes(res));
  }

  trouxeDetalhes = (res) => {
    this.detalhesItem = res;
  }

  maisProd = () => {
    if (this.pedido.idStatus !== 3) {
      const header = 'Atenção';
      const subh = 'Permissões';
      const msg = 'Este pedido está com status ' + this.pedido.nomeStatus + ' e não pode ser alterado';
      this.alertar(header, subh, msg);
    } else {
      let qtd = this.qtd;
      qtd++;
      this.qtd = qtd;
      const vCalculado = this.precoService.calculoPrecoMetades(this.metade, this.detalhesItem.stab);
      const total = parseFloat(vCalculado.correnciaParaFloat()) * qtd;
      const sTotal = total.toString().toMoeda();
      this.preco = sTotal;
    }
  }

  menosProd = () => {
    if (this.pedido.idStatus !== 3) {
      const header = 'Atenção';
      const subh = 'Permissões';
      const msg = 'Este pedido está com status ' + this.pedido.nomeStatus + ' e não pode ser alterado';
      this.alertar(header, subh, msg);
    } else {
      let qtd = this.qtd;
      if (qtd > 0) {
        qtd--;
        this.qtd = qtd;
        const vCalculado = this.precoService.calculoPrecoMetades(this.metade, this.detalhesItem.stab);
        const total = parseFloat(vCalculado.correnciaParaFloat()) * qtd;
        const sTotal = total.toString().toMoeda();
        this.preco = sTotal;
      }
    }
  }

  altQtd = () => {
    this.eQtd = {
      idCliente: this.detalhesItem.pedido.cliente.id,
      idItem: this.detalhesItem.item.id,
      idPedido: this.detalhesItem.pedido.id,
      idProduto: this.metade.m1.id,
      idStab: this.detalhesItem.stab.id,
      qtd: this.qtd,
      desconto: 0,
      idProduto2: this.metade.m2.id
    };
    this.api.setQtdItem(this.eQtd).then(ret => this.qtdSetada(ret));
  }

  qtdSetada = (res) => {
    this.closeModal();
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
      const forma = item;
      if (this.formasPg !== '') {
        this.formasPg += ', ';
      }
      this.formasPg += forma.nome;
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

  gotOpcoes = (data) => {
    this.opcoes = data;
    this.itemPedido = this.itensPedido[this.conta];
    this.itemPedido.opcoes = this.opcoes;
    this.conta++;
    this.percorreOpcoes();
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
          idItem: mtd.id,
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
    const prd: Produto = obj;
    return prd;
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

  async closeModal() {
    await this.modalCtrl.dismiss();
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
