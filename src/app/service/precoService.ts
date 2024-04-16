import { Injectable } from '@angular/core';
import { FormatServices } from './formatService';
import { Produto, RegistroEstabelecimento } from './storage.service';

interface Metades {
    m1: Produto,
    m2: Produto,
    preco: string,
    qtd: number
  }

@Injectable({
    providedIn: 'root'
})
export class PrecoService {

    constructor(private fmt: FormatServices) {
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

    calculoPrecoMetades = (metades: Metades, stab: RegistroEstabelecimento) => {
        const p1 = metades.m1.preco;
        const p2 = metades.m2.preco;
        let preco = p1;
      if (p2 > p1) {
        preco = p2;
      }
      if (stab.meioameio === 'medio') {
        preco = (p1 + p2) / 2;
        preco = parseFloat(parseFloat(preco.toString()).toFixed(2));
      }
      const retorno = preco.toString().float2moeda();
      return retorno;
    }
}