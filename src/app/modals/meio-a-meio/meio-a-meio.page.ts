import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ApiServices } from 'src/app/service/apiService';
import { FormatServices } from 'src/app/service/formatService';
import { Item, Produto, RegistroEstabelecimento, StorageService } from 'src/app/service/storage.service';

interface Metades {
  m1: Produto,
  m2: Produto,
  preco: string,
  qtd: number
}

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
  selector: 'app-meio-a-meio',
  templateUrl: './meio-a-meio.page.html',
  styleUrls: ['./meio-a-meio.page.scss'],
})
export class MeioAMeioPage implements OnInit {

  public item: Item;
  public produtos: Produto[];
  public metade1: Produto;
  public metade2: Produto;
  public idMetade1: number;
  public idMetade2: number;
  private stab: RegistroEstabelecimento;
  public preco: string;
  public definido: boolean;
  public metades: Metades;
  public grande = false;
  public pequeno = true;
  private idUser: number;

  constructor(private modalCtrl: ModalController,
    private storageService: StorageService,
    private fmt: FormatServices,
    private alertController: AlertController,
    private api: ApiServices) {
      String.prototype.correnciaParaFloat = function() {
        let parm = this;
        parm = fmt.removePonto(parm);
        parm = fmt.trocaVigulaPonto(parm);
        parm = parm.replace('R$', '');
        parm = parm.replace(' ', '');
        return parm;
      }
      String.prototype.float2moeda = function() {
        let parm = this;
        const retorno = fmt.float2moeda(parm);
        return retorno;
      }
    }

  ngOnInit() {
    console.log('Meio a meio');
    const tam = screen.width;
    if (tam < 768) {
      this.pequeno = true;
      this.grande = false;
    } else {
      this.pequeno = false;
      this.grande = true;
    }
    this.item = JSON.parse(window.localStorage.getItem('itemMeio'));
    this.produtos = this.item.produtos;
    this.definido = false;
    this.storageService.getUser().then(res => this.gotUser(res));
  }

  gotUser = (res) => {
    this.idUser = res.id;
  }

  processaMeio = () => {
    if (this.idMetade1 === undefined || this.idMetade2 === undefined) {
      this.alertar('Atenção', 'inconsistência', 'Defina as metades da pizza');
    } else if (this.idMetade1 === this.idMetade2) {
      this.alertar('Atenção', 'meio a meio' , 'As duas metades são iguais');
    } else {
      this.metade1 = this.produtos.find(p => p.id === parseInt(''+this.idMetade1,10));
      this.metade2 = this.produtos.find(p => p.id === parseInt(''+this.idMetade2,10));
      this.stab = this.storageService.getStab();
      const p1 = parseFloat(this.metade1.valor.correnciaParaFloat());
      const p2 = parseFloat(this.metade2.valor.correnciaParaFloat());
      let preco = p1;
      if (p2 > p1) {
        preco = p2;
      }
      if (this.stab.meioameio === 'medio') {
        preco = (p1 + p2) / 2;
        preco = parseFloat(parseFloat(preco.toString()).toFixed(2));
      }
      this.preco = preco.toString().float2moeda();
      this.metades = {
        m1: this.metade1,
        m2: this.metade2,
        preco: this.preco,
        qtd: 0
      }
      this.mostraComposicaoMeioAMeio();
    }
  }

  mostraComposicaoMeioAMeio = () => {
    this.definido = true;
  }

  maisQtd = () => {
    let qtd = this.metades.qtd;
    qtd++;
    this.metades.qtd = qtd;
    this.recalculaPreco();
  }

  menosQtd = () => {
    let qtd = this.metades.qtd;
    qtd--;
    if (qtd < 0) {
      qtd = 0;
    }
    this.metades.qtd = qtd;
    this.recalculaPreco();
  }

  recalculaPreco = () => {
    let qtd = this.metades.qtd;
    let preco = parseFloat(this.metades.preco.correnciaParaFloat());
    preco = preco * qtd;
    this.preco = preco.toString().float2moeda();
  }

  gravaMetades = () => {
    let idPedido = 0;
    if (this.storageService.getCurPed().id !== undefined) {
      idPedido = this.storageService.getCurPed().id;
    }
    const sIdsMetades = this.metades.m1.id + "." + this.metades.m2.id;
    const desconto: number = parseFloat(sIdsMetades);
    const eQtd: QtdEntidade = {
      idCliente: this.idUser,
      idItem: 0,
      idPedido,
      idProduto: this.metades.m1.id,
      idStab: this.stab.id,
      qtd: this.metades.qtd,
      desconto: 0,
      idProduto2: this.metades.m2.id
    };
    console.log(eQtd);
    this.api.setQtdItem(eQtd).then(ret => this.qtdSetada(ret));
  }

  qtdSetada = (data) => {
    console.log(data);
    this.closeModal();
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
