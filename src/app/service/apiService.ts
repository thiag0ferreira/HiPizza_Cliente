import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../service/storage.service';

@Injectable({
    providedIn: 'root'
})
export class ApiServices {

    public fUrl: {
        protocolo: string;
        servidor: string;
        porta: string;
    };

    public fn: any;

    constructor(public http: HttpClient,
                private storageService: StorageService) {
        this.setNuvem();
    }

    setNuvem = () => {
        this.fUrl = {
            protocolo: 'https',
            servidor: 'hipizza.com.br',
            porta: ':8018'
        };
    }
    setLocal = () => {
        this.fUrl = {
            protocolo: 'https',
            servidor: 'localhost',
            porta: ':8018'
        };
    }

    getCab = () => {
        const reg = this.storageService.getServer();
        this.gotServ(reg);
    }
    async gotServ(serv) {
        if (serv === 'local') {
            this.setLocal();
        } else {
            this.setNuvem();
        }
        console.log('setou para serv ' + serv);
        if (this.fn !== undefined) {
            this.fn('setado serv: ' + serv);
        }
        return this.fUrl.protocolo + '://' + this.fUrl.servidor + this.fUrl.porta;
    }

    getProt() {
        return this.fUrl.protocolo + '://' + this.fUrl.servidor + this.fUrl.porta;
    }

    getHeaders = () => {
        const headers = { 
            headers: new HttpHeaders({
              'Access-Control-Allow-Origin': '* always',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
              'Access-Control-Allow-Headers': 'origin, x-requested-with',
            })
        };
        return headers;
    }

    checaLogin = (email: string, ddd: number, fone: string) => {
        let url = this.getProt();
        url += '/clientes/cadastro';
        url += '?email=' + email;
        url += '&ddd=' + ddd;
        url += '&fone=' + fone;
        return this.http.get(url, this.getHeaders()).toPromise();
    }

    gravaNovoUser = (user: any) => {
        let url = this.getProt();
        url += '/clientes/';
        return this.http.post(url, user).toPromise();
    }

    geraToken = (idUser) => {
        let url = this.getProt();
        url += '/clientes/geraTokenValidaEmail?idCliente=' + idUser;
        return this.http.get(url).toPromise();
    }

    checaToken = (email: string, token: string) => {
        let url = this.getProt();
        url += '/clientes/validaToken';
        url += '?email=' + email;
        url += '&token=' + token;
        return this.http.get(url).toPromise();
    }

    reEnviaToken = (id: number) => {
        let url = this.getProt();
        url += '/clientes/reenvioDeToken?idCliente=' + id;
        return this.http.get(url).toPromise();
    }

    buscaEstabelecimentosQueAtendem = (idCliente: number) => {
        let url = this.getProt();
        url += '/estabelecimentos/listaEstabelecimentosQueAtendem?idCliente=' + idCliente;
        return this.http.get(url).toPromise();
    }

    varreClienteAgora = (idCliente: number) => {
        let url = this.getProt();
        url += '/clientes/varreClienteAgora/' + idCliente;
        return this.http.get(url).toPromise();
    }

    checaVarreOcupado = () => {
        let url = this.getProt();
        url += '/clientes/checaVarreOcupado';
        return this.http.get(url).toPromise();
    }

    getClienteVarrido = (idCliente: number) => {
        let url = this.getProt();
        url += '/clientes/clienteVarrido/' + idCliente;
        return this.http.get(url).toPromise();
    }

    getEstabelecimentos = () => {
        let url = this.getProt();
        url += '/estabelecimentos/lista';
        return this.http.get(url).toPromise();
    }

    getEstabelecimento = (id: number) => {
        let url = this.getProt();
        url += '/estabelecimentos/' + id;
        return this.http.get(url).toPromise();
    }

    getEndereco = (idStab: number) => {
        const cab = this.getProt();
        const url = cab + '/estabelecimentos/enderecos/' + idStab;
        return this.http.get(url).toPromise();
    }

    getUserByEmail = (email: string) => {
        const cab = this.getProt();
        const url = cab + '/clientes/getByEmail/' + email;
        return this.http.get(url).toPromise();
    }

    alteraUser = (user: any) => {
        const cab = this.getProt();
        const url = cab + '/clientes/alteraCliente';
        return this.http.post(url, user).toPromise();
    }

    getStabFav = (idCliente: number, idStab: number) => {
        const cab = this.getProt();
        const url = cab + '/clientes/favoritos?idCliente=' + idCliente + '&idStab=' + idStab;
        return this.http.get(url).toPromise();
    }

    alteraFavorito = (idCliente: number, idStab: number) => {
        const cab = this.getProt();
        const url = cab + '/clientes/alteraFavorito/' + idCliente + '/' + idStab;
        return this.http.put(url, null).toPromise();
    }

    getProdutosStab = (idStab: number) => {
        const cab = this.getProt();
        const url = cab + '/produtos/listaPorDescricao?idStab=' + idStab;
        return this.http.get(url).toPromise();
    }

    getPedidosAbertosDeStab = (idCliente: number, idStab: number) => {
        const cab = this.getProt();
        let url = cab + '/pedidos/pedidosAbertosPorClienteNoStab';
        url += '?idCliente=' + idCliente;
        url += '&idStab=' + idStab;
        return this.http.get(url).toPromise();
    }

    getPedidosAtivosDeStab = (idCliente: number, idStab: number) => {
        const cab = this.getProt();
        let url = cab + '/pedidos/pedidosAbertosOuColocadosPorClienteNoStab';
        url += '?idCliente=' + idCliente;
        url += '&idStab=' + idStab;
        return this.http.get(url).toPromise();
    }

    contaItensNoPedido = (idPedido: number) => {
        const cab = this.getProt();
        const url = cab + '/pedidos/ItensNoPedido?idPedido=' + idPedido;
        return this.http.get(url).toPromise();
    }

    produtoNoPedido = (idPedido: number, idProduto: number) => {
        const cab = this.getProt();
        const url = cab + '/pedidos/produtoNoPedido?idPedido=' + idPedido + '&idProduto=' + idProduto;
        return this.http.get(url).toPromise();
    }

    setQtdItem = (parms: any) => {
        const cab = this.getProt();
        const url = cab + '/pedidos/alteraQuantidade';
        return this.http.post(url, parms).toPromise();
    }

    getPedidosCliente = (idCliente: number) => {
        const cab = this.getProt();
        const url = cab + '/pedidos/pedidosDoCliente?idCliente=' + idCliente;
        return this.http.get(url).toPromise();
    }

    getItensPedido = (idPedido: number) => {
        const cab = this.getProt();
        const url = cab + '/pedidos/itensPedido?idPedido=' + idPedido;
        return this.http.get(url).toPromise();
    }

    getDetalheItemPedido = (idItem: number) => {
        const cab = this.getProt();
        const url = cab + '/pedidos/trazItemPedidoPorId?idItem=' + idItem;
        return this.http.get(url).toPromise();
    }

    getProdutoById = (id: number) => {
        const cab = this.getProt();
        const url = cab + '/produtos/getProdutoById?idProduto=' + id;
        return this.http.get(url).toPromise();
    }

    getProdutoComPedido = (idCliente: number, idProduto: number) => {
        const cab = this.getProt();
        const url = cab + '/produtos/produtoComPedido?idCliente=' + idCliente + '&idProduto=' + idProduto;
        return this.http.get(url).toPromise();
    }

    getByCep = (cep) => {
        const url = 'https://hipizza.com.br/cep/buscaCep.php?cep=' + cep;
        return this.http.get(url).toPromise();
    }

    getTotalPedido = (idPedido: number) => {
        const cab = this.getProt();
        const url = cab + '/pedidos/totalDoPedido?idPedido=' + idPedido;
        return this.http.get(url).toPromise();
    }

    setStatusPedido = (idPedido: number, idStatus: number) => {
        const cab = this.getProt();
        const url = cab + '/pedidos/setStatusPed?idPedido=' + idPedido + '&idStatus=' + idStatus + '&q=cli';
        return this.http.get(url).toPromise();
    }

    removePedido = (idPedido: number) => {
        const cab = this.getProt();
        const url = cab + '/pedidos/removePedido?idPedido=' + idPedido;
        return this.http.get(url).toPromise();
    }

    verificaProdutoFavorito = (idCliente: number, idProduto: number) => {
        const cab = this.getProt();
        let url = cab + '/produtos/verificaProdutoFavorito?idCliente=' + idCliente;
        url += '&idProduto=' + idProduto;
        return this.http.get(url).toPromise();
    }

    setProdutoFavorito = (idCliente: number, idProduto: number) => {
        const cab = this.getProt();
        let url = cab + '/produtos/setProdutosFavoritos?idUser=' + idCliente;
        url += '&idProduto=' + idProduto;
        return this.http.post(url, null).toPromise();
    }

    retiraProdutoDosFavoritos = (idCliente: number, idProduto: number) => {
        const cab = this.getProt();
        let url = cab + '/produtos/desmarcaProdutoFavoritos?idUser=' + idCliente;
        url += '&idProduto=' + idProduto;
        return this.http.post(url, null).toPromise();
    }

    trazFavoritosDoCliente = (idCliente: number) => {
        const cab = this.getProt();
        const url = cab + '/produtos/getFavoritosDoCliente?idCliente=' + idCliente;
        return this.http.get(url).toPromise();
    }

    getByLoginESenha = (parms: any) => {
        const cab = this.getProt();
        const url = cab + '/clientes/login';
        const headers = this.getHeaders();
        console.log("Chamada da API:");
        console.log(url);
        console.log("Parms:");
        console.log(parms);
        return this.http.post(url, parms, headers).toPromise();
    }

    getListaFormas = () => {
        const cab = this.getProt();
        const url = cab + '/formasPagamento/listaFormasPagamento';
        return this.http.get(url).toPromise();
    }

    getFormasPedido = (idPedido: number) => {
        const cab = this.getProt();
        const url = cab + '/pedidos/formasParaUmPedido?idPedido=' + idPedido;
        return this.http.get(url).toPromise();
    }

    adicionaFormaNoPedido = (idPedido: number, idForma: number) => {
        const cab = this.getProt();
        let url = cab + '/pedidos/adicionaForma';
        url += '?idForma=' + idForma;
        url += '&idPedido=' + idPedido;
        return this.http.post(url, null).toPromise();
    }

    pedidoTemForma = (idPedido: number, idForma: number) => {
        const cab = this.getProt();
        const url = cab + '/pedidos/pedidoTemForma?idForma=' + idForma + '&idPedido=' + idPedido;
        return this.http.get(url).toPromise();
    }

    removeFormaDoPedido = (idPedido: number, idForma: number) => {
        const cab = this.getProt();
        const url = cab + '/pedidos/removeForma?idForma=' + idForma + '&idPedido=' + idPedido;
        return this.http.get(url).toPromise();
    }

    alteraTroco = (idPedido: number, valor: string) => {
        const cab = this.getProt();
        const url = cab + '/pedidos/alteraTroco?idPedido=' + idPedido + '&texto=' + valor;
        return this.http.get(url).toPromise();
    }

    getListaOpcoes = () => {
        const cab = this.getProt();
        const url = cab + '/opcoes/getListaOpcoes';
        return this.http.get(url).toPromise();
    }

    getOpcoesItem = (idItem: number) => {
        const cab = this.getProt();
        const url = cab + '/opcoes/getOpcoesDeUmProduto?idItem=' + idItem;
        return this.http.get(url).toPromise();
    }

    setOpcoesItem = (dto: any) => {
        const cab = this.getProt();
        const url = cab + '/opcoes/setOpcoesDeUmProduto';
        return this.http.post(url, dto).toPromise();
    }

    getFavoritosDoCliente = (idCliente: number) => {
        const cab = this.getProt();
        const url = cab + '/clientes/favoritosDoCliente?idCliente=' + idCliente;
        return this.http.get(url).toPromise();
    }

    setCallBack = (fun) => {
        this.fn = fun;
    }
}
