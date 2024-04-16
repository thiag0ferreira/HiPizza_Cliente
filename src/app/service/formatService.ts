import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FormatServices {

    constructor() {}

    mascaracep = (idElemento) => {
        const elemento = document.getElementById(idElemento);
        let parm = this.getValue(elemento);
        if (parm.length === 5) {
            parm += '-';
            this.setValue(elemento, parm);
        }
    }

    mascaraFone = (idElemento, qtipo) => {
        const elemento = document.getElementById(idElemento);
        let parm = this.getValue(elemento);
        if (parm.length === 1) {
            if (parm !== '(') {
                parm = '(' + parm;
            }
            this.setValue(elemento, parm);
        }
        if (parm.length === 3) {
            parm = parm + ') ';
            this.setValue(elemento, parm);
        }
        if (qtipo === '2') {
            if (parm.length === 6) {
                parm += ' ';
                this.setValue(elemento, parm);
            }
            if (parm.length === 11) {
                parm += '-';
                this.setValue(elemento, parm);
            }
        } else {
            if (parm.length === 9) {
                parm += '-';
                this.setValue(elemento, parm);
            }
        }
    }

    separaFone = (parm) => {
        let retorno = parm;
        if (parm.indexOf('(') === 0) {
            if (parm.indexOf(') ') > 0) {
                const ddd=parm.substring(1, 3);
                const fone = parm.substring(5);
                retorno = ddd + ':' + fone;
            }
        }
        return retorno;
    }

    float2moeda = (num) => {
        let x = 0;

        if (num < 0) {
            num = Math.abs(num);
            x = 1;
        }
        if (isNaN(num)) {
            num = '0';
        }
        const cents = Math.floor((num * 100 + 0.5) % 100);
        let centa = cents.toString();
        num = Math.floor((num * 100 + 0.5) / 100).toString();
        if (cents < 10) {
            centa = '0' + centa;
        }
        for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
            num = num.substring(0, num.length - (4 * i + 3)) + '.'
               + num.substring(num.length - (4 * i + 3));
        }
        let ret = num + ',' + centa;
        if (x === 1) {
            ret = ' - ' + ret;
        }
        return ret;
    }

    getValue = (elemento) => {
        return elemento.value;
    }
    setValue = (elemento, value) => {
        elemento.value = value;
    }

    trocaVigulaPonto = (parm) => {
        let n = parm.indexOf(',');
        while (n >= 0) {
            parm = parm.substring(0, n) + '.' + parm.substring(n + 1, parm.length);
            n = parm.indexOf(',');
        }
        return parm;
    }
    removePonto = (parm) => {
        let n = parm.indexOf('.');
        while (n >= 0) {
            parm = parm.substring(0, n) + parm.substring(n + 1, parm.length);
            n = parm.indexOf('.');
        }
        return parm;
    }
    correnciaParaFloat = (parm) => {
        parm = this.removePonto(parm);
        parm = this.trocaVigulaPonto(parm);
        parm = parm.replace('R$', '');
        parm = parm.replace(' ', '');
        return parm;
    }
}
