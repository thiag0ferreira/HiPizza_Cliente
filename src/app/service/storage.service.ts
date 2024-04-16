import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export interface RegistroUsuario {
    id: number;
    nome: string;
    login: string;
    senha: string;
    idPerfil: number;
    email: string;
    verificada: string;
    ddd: number;
    fone: string;
    flow: string;
}

export interface RegistroEstabelecimento {
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
}

export interface Produto {
  id: number;
  nome: number;
  descricao: string;
  detalhe: string;
  preco: number;
  publicado: number;
  valor: string;
  pub: boolean;
  tipo: {
    id: number,
    nome: string,
    idStab: number
  };
  valPedido: string;
  idPedido: number;
}

export interface Tipo {
  id: number;
  nome: string;
  idStab: number;
  aplicaMeioAMeio: number;
}

export interface Item {
  tipo: Tipo;
  produtos: Produto[];
}

export interface OpcoesPedido {
  id: number;
  nome: string;
}

export interface Pedido {
  dataHora: string;
  fantasiaEstabelecimento: string;
  id: number;
  idStatus: number;
  nomeEstabelecimento: string;
  nomeStatus: string;
  obs: string;
  seqPedido: number;
  total: number;
  validade: string;
  itens: number;
  idEstabelecimento: number;
  obsTroco: string;
}

export interface Forma {
  id: number;
  nome: string;
  marcado: any;
}

export interface ItemPedido {
  desconto: number;
  id: number;
  idPedido: number;
  idProduto: number;
  qtd: number;
  seq: number;
  valor: number;
  produto: Produto;
  total: string;
  opcoes: OpcoesPedido[];
  idMetade2: number;
}

export interface MeioAMeio extends ItemPedido {
  produto2: Produto;
  unitario: string;
}

export interface Metades {
  m1: Produto;
  m2: Produto;
  preco: string;
  qtd: number;
  total: string;
  idItem: number;
}

export interface DetalhesItemPedido {
  item: {
    id: number,
    seq: number,
    qtd: number,
    valor: number,
    desconto: number,
    iPedido: number,
    idProduto: number,
    total: number,
    idStatus: number,
    nomeStatus: string,
    idMetade2: number
  };

  pedido: {
    id: number,
    dataHora: string,
    obs: string,
    seqPedido: number,
    total: number,
    validade: string,
    idStatus: number,
    nomeStatus: string,
    nomeEstabelecimento: string,
    fantasiaEstabelecimento: string,
    idEstabelecimento: number,
    obsTroco: string,
    cliente: {
      id: number,
      apelido: string,
      login: string,
      senha: string,
      email: string,
      ddd: string,
      fone: string,
      nome: string,
      obs: string,
      sexo: string,
      result: string,
      tempo: string,
      razao: string,
      fantasia: string,
      cnpj: string,
      endBairro: string,
      endCep: string,
      endCidade: string,
      endComplemento: string,
      endEstado: string,
      endLogradouro: string,
      flow: string,
      endNumero: string,
      endReferencia: string,
      perfil: {
        id: number,
        nome: string
      }
    }
  };
  stab: RegistroEstabelecimento;
}



@Injectable({
    providedIn: 'root'
})
export class StorageService {

    public regUser: any;
    public cpoEdit: string;
    public refresca: number;
    public stab: RegistroEstabelecimento;
    public curPed: any;
    public curProd: any;
    public respCep: any;
    public curParm: any;
    public formaMudada: boolean;
    public troco: string;
    public idItem: number;
    public server: string;

    constructor(private storage: Storage) {
        this.regUser = '';
    }

    salvaUser = (nome, login, senha, id, idPerfil, email, verificada, flow, ddd, fone): Promise<any> => {
        return this.storage.get('stoHipUser').then((registros: RegistroUsuario[]) => {
          if (registros) {
            const registro = registros[0];
            console.log('Encontramos registro ' + registro);
          } else {
            const registro: RegistroUsuario = {
              id,
              nome,
              login,
              senha,
              idPerfil,
              email,
              verificada,
              ddd,
              fone,
              flow
            };
            return this.storage.set('stoHipUser', [registro]);
          }
        });
    }

    salvaRegistroUser = (user: RegistroUsuario): Promise<any> => {
      return this.storage.set('stoHipUser', user);
      /*
      return this.storage.get('stoHipUser').then((registros: RegistroUsuario[]) => {
        if (registros) {
          const registro = registros[0];
          console.log('Encontramos registro ' + registro);
        } else {
        }
      });
      */
    }

    salvaStrUser = (user: RegistroUsuario) => {
      return this.storage.set('stoHipUser', user);
    }

    getJsonByCampo = (json, campo, valor) => {
      const retorno = '';
      for (const reg of json) {
        let resultado = '';
        const cmd = 'resultado=reg.' + campo + ';';
        // tslint:disable-next-line: no-eval
        eval(cmd);
        resultado = resultado.toString();
        if (resultado.toUpperCase() === valor.toString().toUpperCase()) {
          return reg;
        }
      }
      return retorno;
    }

    getEstados = () => {
      let estados = '{"ufs":[ {"sigla":"AC","nome":"Acre"}, {"sigla":"AL","nome":"Alagoas"}, {"sigla":"AM","nome":"Amazonas"}, {"sigla":"AP","nome":"Amapá"}, {"sigla":"BA","nome":"Bahia"}, {"sigla":"CE","nome":"Ceará"}, {"sigla":"DF","nome":"Distrito Federal"}, {"sigla":"ES","nome":"Espírito Santo"}, {"sigla":"GO","nome":"Goiás"}, {"sigla":"MA","nome":"Maranhão"}, {"sigla":"MG","nome":"Minas Gerais"}, {"sigla":"MS","nome":"Mato Grosso do Sul"}, {"sigla":"MT","nome":"Mato Grosso"}, {"sigla":"PA","nome":"Pará"}, {"sigla":"PB","nome":"Paraiba"}, {"sigla":"PE","nome":"Pernambuco"}, {"sigla":"PI","nome":"Piauí"}, {"sigla":"PR","nome":"Paraná"}, {"sigla":"RJ","nome":"Rio de Janeiro"}, {"sigla":"RN","nome":"Rio Grande do Norte"}, {"sigla":"RO","nome":"Rondônia"}, {"sigla":"RR","nome":"Roraima"}, {"sigla":"RS","nome":"Rio Grande do Sul"}, {"sigla":"SC","nome":"Santa Catarina"}, {"sigla":"SE","nome":"Sergipe"}, {"sigla":"SP","nome":"São Paulo"}, {"sigla":"TO","nome":"Tocantins"}]}';
      estados = JSON.parse(estados);
      return estados;
    }

    limpaRegUser = () => {
      this.storage.remove('stoHipUser');
    }

    getUser = () => {
      return this.storage.get('stoHipUser');
    }

    setServer = (qual: string) => {
      this.server = qual;
    }
    getServer = () => {
      return this.server;
    }

    setRegUser = (parm) => {
        this.regUser = parm;
    }
    getRegUser = () => {
        return this.regUser;
    }

    getCpoEdit = () => {
      return this.cpoEdit;
    }
    setCpoEdit = (parm) => {
      this.cpoEdit = parm;
    }

    getRefresca = () => {
      return this.refresca;
    }
    setRefresca = (parm: number) => {
      this.refresca = parm;
    }

    getStab = () => {
      return this.stab;
    }
    setStab = (parm) => {
      this.stab = parm;
    }

    getCurPed = () => {
      return this.curPed;
    }
    setCurPed = (parm) => {
      this.curPed = parm;
    }

    getCurProd = () => {
      return this.curProd;
    }
    setCurProd = (parm) => {
      this.curProd = parm;
    }

    getRespCep = () => {
      return this.respCep;
    }
    setRespCep = (parm) => {
      this.respCep = parm;
    }

    getCurParm = () => {
      return this.curParm;
    }
    setCurParm = (parm) => {
      this.curParm = parm;
    }

    getFormaMudada = () => {
      return this.formaMudada;
    }
    setFormaMudada = (parm) => {
      this.formaMudada = parm;
    }

    getTroco = () => {
      return this.troco;
    }
    setTroco = (parm) => {
      this.troco = parm;
    }

    getIdItem = () => {
      return this.idItem;
    }
    setIdItem = (parm) => {
      this.idItem = parm;
    }
}
