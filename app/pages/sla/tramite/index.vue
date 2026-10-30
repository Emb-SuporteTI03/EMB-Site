<script>
import axios from 'axios';
import { nextTick } from 'vue';
import { ToastSuccess, ToastWarning, ToastError } from '~/legado/composables/toasts';
import { GetGenerico, shortenInfo, applyTableStipedRows } from '~/legado/composables/visualization';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import User from '~/legado/components/Icons/User.vue';
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth';

export default {
  components: {
    Swiper,
    SwiperSlide
  },

  data() {
    return {
      // Acesso externo (função 4): os trâmites saem no nome do usuário interno
      // vinculado ao usuário externo (sis.Usuarios_Externos_Usuarios_Internos)
			userID: useAuthStore().usuarioInterno?.id,
			userNome: useAuthStore().usuarioInterno?.nome,
      userID_Unidade: useAuthStore().usuarioInterno?.idUnidade,
      userSigla: useAuthStore().usuarioInterno?.sigla,
			urlProdSistema: useUrlProdSistema(),
			urlBase: useUrlProd(),
      route: useRoute(),
      token: useAuthStore().token,

      dataInicio: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
      dataFim: new Date().toISOString().split('T')[0],

      // DTOS's: ----------------------------------------------\
      tramiteEnvioCompletoDTO: {
        os: null, // É opcional
        iD_Tipo: null, // PRECISA
        iD_Responsavel: useAuthStore().usuarioInterno?.id, // PRECISA
        iD_Transportadora: null, // PRECISA
        iD_Cliente: null, // PRECISA
        iD_Remetente: null, // PRECISA
        iD_Conferente: null, // PRECISA
        veiculo: null, // PRECISA
        placaVeiculo: null, // PRECISA
        motorista: null, // PRECISA
        rgMotorista: null, // PRECISA
        adicionais: null, // É opcional
        inconformidade: null, // É opcional
        logReversa: null // PRECISA
      },
      tramiteLoteExpRequestDTO: {
        iD_Tipo: 2,
        iD_Responsavel: useAuthStore().usuarioInterno?.id,
        iD_Transportadora: null,
        iD_Cliente: null,
        iD_Remetente: null,
        iD_Conferente: null,
        veiculo: null,
        placaVeiculo: null,
        motorista: null,
        rgMotorista: null,
        adicionais: "TRÂMITE INSERIDO AUTOMATICAMENTE PELA CONTROLADORIA DE PEDIDOS - SLA",
        inconformidade: null,
        logReversa: false
      },
      itemFormTramiteItem: {
        iD_Componente: null,
        iD_Acondicionamento: null,
        iD_Lote: null,
        cProtocoloProduto: '',
        cNumNFE: '',
        iOs: '',
        cAdicionaisProduto: '',
        iQtdeComponente: null,
        cInfoGenerica: '',
        iD_Tramite_Item_Operacao: null,
        DANFE: null
      },
      ID_TramiteItemAtualGlobal: 0,
      itensTramite: [], // Array de itens do trâmite
      
      insereTramiteItemRequestDTO: {
        iD_Tramite_Pai: 0,
        iD_Componente: 0,
        iD_Acondicionamento: 0,
        iD_Tramite_Item_Operacao: 0,
        cProtocoloProduto: "",
        cNumNFE: "",
        iOs: "",
        cAdicionaisProduto: "",
        iQtdeComponente: null,
        iD_Lote: null
      },
      tramiteResponseDTO: {
        iD_Tramite: 0,
        iD_Usuario: 0,
        cNmUsuario: "",
        iD_Tipo_Tramite: 0,
        cTipoTramite: "",
        iD_Transportadora: 0,
        cRazaoSocial: "",
        cPlacaVeiculo: "",
        cTipoVeiculo: "",
        cNomeMotorista: "",
        cRGMotorista: "",
        iD_Cliente: 0,
        cNmFantasia: "",
        cUsuarioAnuladoPor: "",
        dDataTramite: "",
        dPrevisaoInicioTramite: "",
        dHoraInicioTramite: "",
        dHoraFimTramite: "",
        cConferenteTramite: "",
        cRemetDestCarga: "",
        cInconformidade: "",
        cURLCargaFoto_01: null,
        cURLCargaFoto_02: null,
        cURLCargaFoto_03: null,
        cURLCargaFoto_04: null,
        cURLCargaFoto_05: null,
        cAdicionais: "",
        iOrdemServico: null,
        cURLImagemAssinatura_EXP: null,
        cURLImagemAssinatura_ENT: null,
        cLancadoEstoque: ""
      },
      tramitePaiSelecionado: {},
      infosTramite: {},
      editandoTramiteDTO: {
        inconformidade: null,
        cAdicionais: null,
      },
      postTramite: {},
      InserteVeiculoMotoristaRequestDTO: {
        cPlacaVeiculo:  '',
        cVeiculo:  '',
        cNomeMotorista:  '',
        cRGMotorista:  '',
      },
      componenteEscolhido: {

      },
      conferenciaDePedidosExpedicao: {
        idPedido: null, 
        idCliente: null, 
        idTransportadora: null
      },

      requestTela: {
        cDescricaoTela: 'EXPEDICAO - PEDIDO',
        ID_Objeto: 0,
        ID_Usuario: useAuthStore().usuarioInterno?.id ?? 0,
      },
      selectedCarteiraRequestTelaAtual: null,
      tipoModalAberto: '',
      intervaloSessao: 0,
      idTramiteAguardandoAssinatura: 0,
      // ------------------------------------------------------~/

      // Arrays: ----------------------------------------------\
      infoComponentes: [],
      infoDanfes: [],
      tramitesPai: [],
      tramitesPaiStatic: [],
      registrosTabelaPrincipalTramite: [],
      infosBuscaTramiteItem: [],
      itensTramiteStatic: [],
      itensTramite: [],
      imagensTramite: [],
      imagemComponente: [],
      imagensCarga: [],
      imagensAssinatura: [],
      clientes: [],
      clientesApenasSLA: [],
      tiposTramite: [],
      transportadoras: [],
      transportadorasApenasSLA: [],
      remetentes: [],
      conferentes: [],
      lotes: [],
      infoPlacasExistentes:[],
      todosRGs:[],
      infoTodasPlacas: [],
      infoAcondicionamentos: [],
      pedidosPossiveisExpedicao: [],
      staticPedidosPossiveisExpedicao: [],
      pedidosExpedicaoSelecionados: [],
      arrayConferenciaDePedidosExpedicao: [],
      // ------------------------------------------------------~/

      swiperModules: [Navigation, Pagination],
      urlEstoque: useUrlEstoque(),
      urlSistema: useUrlProdSistema(),
      stringDiaAtual: new Date().toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),

      idUsuarioAtual: useAuthStore().usuarioInterno?.id,

      tabelaTRAMITEsCarregada: false,
      tabelaLOTEEXPCarregada: false,

      tabelaPedidosPossiveisLoteExp: true,

      tabelaItensTRAMITEsCarregada: false,
      linhaExpandidaDaTabela: null,
      checkboxLRDisabled: false,

      modalAberto: false,
      modoExibicaoImagem: false,
      confirmandoFecharModal: false,
      modoAbertura: null,
      podeAdicionar: false,
      permiteEscolhaBotoes: false,
      apenasLogReversa: null,
      postandoTramite: false,
      itensXMLSemConferencia: false,
      editingIndexItem: null,
      itemEditando: null,
      modoAdicao: '',
      podeClicarBotaoAnular: true,

      listenerAdicionado: false,
      alturaInfosPx: 0,
      tableContainerItemTramiteStyle: {
        width: '100%',
        maxHeight: '0px',
      },

      tabelaTramitePrincipalContainer: null,
      rowsPerPage: 0,
      numeroRegistrosPagina: 0,
      rowHeightPx: 0,

      tramiteSelecionado: null,
     
      senhaAnulaTramite: null,
      motivoAnulaTramite: null,

      editandoTramite: false,
      editandoTramiteItem: false,

      adicionandoNovoItemTramite: false,
      showButtonNovoTramiteFilho: true,

      isLoadingInfoVeiculo: false,
      ID_Veiculo_Selecionado: null,

      liberaCamposCriacaoItem: false,

			querieProcura: '',

      podeApertarBotaoEnviaParaMim: true,

      isVisualizarPDF: false,
      isLoadingPDF: false,

      isSalvandoTramiteExpedicao: false,

      arrayIdQuantidade: [],

      modoEsperaAssinatura: false,
      esperandoConfirmacaoAssinatura: false,
      bloqueandoAssinatura: false,
      // Variaveis para tratar o SELECT componentizado: ------------\
      selectedCliente: null,
      selectedClienteLoteEXP: null,
      selectedTransportadora: null,
      selectedTransportadoraLoteEXP: null,
      selectedRemetente: null,
      selectedComponenteItem: null,
      selectedDANFEItem: null,
      mostrarTodos: false,
      // -----------------------------------------------------------/

      // VARIÁVEIS FILTRO LOTE EXPEDIÇÃO: ---------------------\
      guiaRemessaSelecionadaFiltroLOTEEXP: null,
      pedidoSelecionadoFiltroLOTEEXP: null,
      ovSelecionadoFiltroLOTEEXP: null,
      ckSelecionadoFiltroLOTEEXP: null,
      nfeSelecionadoFiltroLOTEEXP: null,
      cepSelecionadoFIltroLOTEEXP: null,
      destinatarioSelecionadoFiltroLOTEEXP: null,
      ufSelecionadoFiltroLOTEEXP: null,
      // -----------------------------------------------------------/

      quantidadePedidosCancelados: null,
      infoTabelaPedidosItensCancelado: [],
      infoUsuarioLogEst: [],
      selectedUsuarioRecebeuRetorno: null,
      isTabelaPedidosItensCanceladosCarregada: false,
      textoBotaoExpedir: "IR PARA ASSINATURA",
      horarioInicialTramiteLoteEXP: null,
      confirmadoAvisoExpedir: false,
      idClienteInformadoTESTE: null,

      gerarPDFNF: false,
      imprimirDANFE: false,

      // Leitura do danfe
      quantidadeDanfesNaoLidas: 0,
      quantidadeTramitesNaoDirecionados: 0,
      quantidadePulmao: 0,
      infoXMLsNaoLidos: [],
      infoXMLsNaoLidosStatic: [],
      isVisualizarPDF_Danfe: false,
      isPDFDanfeLoading: true,
      iframeSrcDanfe: null,
      iDanfeAtual: 0,

      // VARIÁVEIS DOS FILTROS
			infoUnidadesFiltro: [],
      selectedUnidadeFiltro: null,

      infoTiposFiltro: [],
      selectedTipoFiltro: null,

      infoClientesFiltro: [],
      selectedClienteFiltro: null,

      infoTransportadorasFiltro: [],
      selectedTransportadoraFiltro: null,

      infoTramitesFiltro: [],
      selectedTramiteFiltro: null,

      infoDirecionadoFiltro: [],
      selectedDirecionadoFiltro: null,

      infoOSFiltro: [],
      selectedOSFiltro: null,

      infoLoteFiltro: [],
      selectedLoteFiltro: null,
 
      infoCodProdFiltro: [],
      selectedCodProdFiltro: null,
 
      infoNFProdFiltro: [],
      selectedNFProdFiltro: null,
  
      infoDescProdFiltro: [],
      selectedDescProdFiltro: null,

      // VARIÁVEIS PAGINAÇÃO
      paginaAtual: 1,
      totalPaginas: 0
      

    };
  },

	computed: {
    guiasRemessasFiltroLOTEEXP() {
      const guiasUnicas = new Set();
      this.pedidosPossiveisExpedicao.forEach(pedido => {
        if (pedido.guiaRemessa && pedido.bSelecionado === false) {
          guiasUnicas.add(pedido.guiaRemessa);
        }
      });
      return Array.from(guiasUnicas).map((item, index) => ({
        id: index + 1,
        cNome: item
      }));
    },
    pedidosFiltroLOTEEXP() {
      const pedidosUnicos = new Set();
      this.pedidosPossiveisExpedicao.forEach(pedido => {
        if (pedido.numPedido && pedido.bSelecionado === false) {
          pedidosUnicos.add(pedido.numPedido);
        }
      });
      return Array.from(pedidosUnicos).map((item, index) => ({
        id: index + 1,
        cNome: item
      }));
    },
    ovsFiltroLOTEEXP() {
      const ovsUnicas = new Set();
      this.pedidosPossiveisExpedicao.forEach(pedido => {
        if (pedido.ov && pedido.bSelecionado === false) {
          ovsUnicas.add(pedido.ov);
        }
      });
      return Array.from(ovsUnicas).map((item, index) => ({
        id: index + 1,
        cNome: item
      }));
    },
    cksFiltroLOTEEXP() {
      const cksUnicas = new Set();
      this.pedidosPossiveisExpedicao.forEach(pedido => {
        if (pedido.ck && pedido.bSelecionado === false) {
          cksUnicas.add(pedido.ck);
        }
      });
      return Array.from(cksUnicas).map((item, index) => ({
        id: index + 1,
        cNome: item
      }));
    },
    nfesFiltroLOTEEXP() {
      const nfsUnicas = new Set();
      this.pedidosPossiveisExpedicao.forEach(pedido => {
        if (pedido.notaFiscal && pedido.bSelecionado === false) {
          nfsUnicas.add(pedido.notaFiscal);
        }
      });
      return Array.from(nfsUnicas).map((item, index) => ({
        id: index + 1,
        cNome: item
      }));
    },
    cepsFiltroLOTEEXP() {
      const cepsUnicos = new Set();
      this.pedidosPossiveisExpedicao.forEach(pedido => {
        if (pedido.cep && pedido.bSelecionado === false) {
          cepsUnicos.add(pedido.cep);
        }
      });
      return Array.from(cepsUnicos).map((item, index) => ({
        id: index + 1,
        cNome: item
      }));
    },
    destinatariosFiltroLOTEEXP() {
      const destinatariosUnicos = new Set();
      this.pedidosPossiveisExpedicao.forEach(pedido => {
        if (pedido.destinatario && pedido.bSelecionado === false) {
          destinatariosUnicos.add(pedido.destinatario);
        }
      });
      return Array.from(destinatariosUnicos).map((item, index) => ({
        id: index + 1,
        cNome: item
      }));
    },
    ufsFiltroLOTEEXP() {
      const ufsUnicas = new Set();
      this.pedidosPossiveisExpedicao.forEach(pedido => {
        if (pedido.uf && pedido.bSelecionado === false) {
          ufsUnicas.add(pedido.uf);
        }
      });
      return Array.from(ufsUnicas).map((item, index) => ({
        id: index + 1,
        cNome: item
      }));
    },
    quantidadePedidosPossiveisTotalizador() {
      return this.pedidosPossiveisExpedicao.filter(p => p.bSelecionado === false).length;
    },
    quantidadePedidosSelecionadosTotalizador() {
      return this.pedidosPossiveisExpedicao.filter(p => p.bSelecionado === true).length;
    },
    quantidadeItensPossiveisTotalizador() {
      return this.pedidosPossiveisExpedicao
        .filter(p => p.bSelecionado === false)
        .reduce((total, pedido) => {

          const info = this.arrayIdQuantidade
            ?.find(q => q.iD_Pedido === pedido.iD_Pedido);

          return total + (info ? Number(info.cQuantidadeItens) : 0);

        }, 0);
    },
    quantidadeItensSelecionadosTotalizador() {
      return this.pedidosPossiveisExpedicao
        .filter(p => p.bSelecionado === true)
        .reduce((total, pedido) => {

          const info = this.arrayIdQuantidade
            ?.find(q => q.iD_Pedido === pedido.iD_Pedido);

          return total + (info ? Number(info.cQuantidadeItens) : 0);

        }, 0);
    },
    quantidadeSKUsPossiveisTotalizador() {
      return this.pedidosPossiveisExpedicao
        .filter(p => p.bSelecionado === false)
        .reduce((total, pedido) => {

          const info = this.arrayIdQuantidade
            ?.find(q => q.iD_Pedido === pedido.iD_Pedido);

          return total + (info ? Number(info.cQuantidadeSKUs) : 0);

        }, 0);
    },
    quantidadeVolumesPossiveisTotalizador() {
      return this.pedidosPossiveisExpedicao
        .filter(p => p.bSelecionado === false)
        .reduce((total, pedido) => {

          const info = this.arrayIdQuantidade
            ?.find(q => q.iD_Pedido === pedido.iD_Pedido);

          return total + (info ? Number(info.cQuantidadeVolumes) : 0);

        }, 0);
    },
    quantidadeSKUsSelecionadosTotalizador() {
      return this.pedidosPossiveisExpedicao
        .filter(p => p.bSelecionado === true)
        .reduce((total, pedido) => {

          const info = this.arrayIdQuantidade
            ?.find(q => q.iD_Pedido === pedido.iD_Pedido);

          return total + (info ? Number(info.cQuantidadeSKUs) : 0);

        }, 0);
    },
    quantidadeVolumesSelecionadosTotalizador() {
      return this.pedidosPossiveisExpedicao
        .filter(p => p.bSelecionado === true)
        .reduce((total, pedido) => {

          const info = this.arrayIdQuantidade
            ?.find(q => q.iD_Pedido === pedido.iD_Pedido);

          return total + (info ? Number(info.cQuantidadeVolumes) : 0);

        }, 0);
    },
	},

  watch: {
    staticPedidosPossiveisExpedicao: {
      handler () {
        const cliente = this.$refs.clienteSelectREFLOTEEXP;
        const transportadora = this.$refs.transportadoraSelectREFLOTEEXP;

        const temSelecionado = this.staticPedidosPossiveisExpedicao
          .some(p => p.bSelecionado === true);

        if (temSelecionado) {
          cliente?.desabilitar();
          transportadora?.desabilitar();
        } else {
          cliente?.habilitar();
          transportadora?.habilitar();
        }
      },
      immediate: true,
      deep: true
    },

  },
  methods: {
		// ----------------------------------- GETS VIA API -------------------------------------------------------------\
		ToastError,
		ToastSuccess,
		ToastWarning,
		shortenInfo,
    GetGenerico,
    applyTableStipedRows,


    async getTramitesPai() {
        this.tabelaTRAMITEsCarregada = false;
        
        // Site: traz todos os trâmites cujo responsável é o usuário interno vinculado
        // ao externo logado (a API resolve o vínculo pelo token). A unidade é um filtro
        // opcional: começa vazio e só filtra se o usuário escolher uma.
        const filtro = {
            DataInicio: this.dataInicio,
            DataFim: this.dataFim,
            ID_Unidade: this.selectedUnidadeFiltro?.ID_Unidade ?? null,
            ID_Tipo: this.selectedTipoFiltro?.id ?? null,
            ID_Cliente: this.selectedClienteFiltro?.id ?? null,
            ID_Transportadora: this.selectedTransportadoraFiltro?.id ?? null,
            ID_Tramite: this.selectedTramiteFiltro?.id ?? null,
            ID_Direcionado: this.selectedDirecionadoFiltro?.id ?? null,
            numOS: this.selectedOSFiltro?.cNome ?? null,
            ID_Lote: this.selectedLoteFiltro?.id ?? null,
            ID_Componente: this.selectedCodProdFiltro?.id ?? null,
            nfProduto: this.selectedNFProdFiltro?.cNome ?? null,
            // aguardando back expor idComponente/cOperacao/cInfoGenerica em DescProdutos
            // (ver TramiteFiltrosDisponiveisDTO) pra esses campos deixarem de vir null
            ID_ComponenteDescricao: this.selectedDescProdFiltro?.idComponente ?? null,
            cOperacaoComponenteDescricao: this.selectedDescProdFiltro?.cOperacao ?? null,
            cInfoGenericaComponenteDescricao: this.selectedDescProdFiltro?.cInfoGenerica ?? null,
        };

        try {
            const response = await axios.post(
                `${this.urlEstoque}/tramite/tramite-web/filtrar-externo?pagina=${this.paginaAtual}&tamanhoPagina=${this.numeroRegistrosPagina}`,
                filtro,
                { headers: { Authorization: `Bearer ${this.token ?? ''}` } }
            );

            this.registrosTabelaPrincipalTramite = response.data.registros;
            this.totalPaginas = Math.ceil(response.data.totalRegistros / this.numeroRegistrosPagina);

            this.infoTiposFiltro = response.data.filtros.tipos;
            this.infoClientesFiltro = response.data.filtros.clientes;
            this.infoTransportadorasFiltro = response.data.filtros.transportadoras;
            this.infoTramitesFiltro = response.data.filtros.tramites;
            this.infoDirecionadoFiltro = response.data.filtros.direcionados;
            this.infoOSFiltro = response.data.filtros.os;
            this.infoLoteFiltro = response.data.filtros.lotes;
            this.infoCodProdFiltro = response.data.filtros.codProdutos;
            this.infoNFProdFiltro = response.data.filtros.nfProdutos;
            this.infoDescProdFiltro = response.data.filtros.descProdutos;

            this.filteredOptions();
        } catch (error) {
            console.error("Erro ao buscar trâmites:", error);
        } finally {
            this.tabelaTRAMITEsCarregada = true;
        }
    },

    async OnChangeDataTramite() {
     if (!this.dataInicio) {
				this.dataInicio = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
			}
			if (!this.dataFim) {
				this.dataFim = new Date().toISOString().split('T')[0];
			}
      await this.getTramitesPai();
      await this.getInfosBuscaTramiteItem();
    },
    async getInfosBuscaTramiteItem() {
			this.infosBuscaTramiteItem = await GetGenerico(`${this.urlEstoque}/tramite-item/infos-busca/${this.dataInicio}/${this.dataFim}`, {}, this.token);
    },
    async getImagemTramite(tramiteId) {
      try {
        const response = await axios.get(`${this.urlEstoque}/foto-componente/get-foto-carga-tramite/${tramiteId}`,
          { headers: { Authorization: `Bearer ${this.token}` } }
        );

        if (Array.isArray(response.data)) {
          // Cada base64 vira uma data URL
          // Adiciona cada imagem sem apagar as anteriores
          response.data.forEach(base64 => {
            this.imagensCarga = response.data.map(base64 => `data:image/jpeg;base64,${base64}`);
            this.imagensTramite.push(`data:image/jpeg;base64,${base64}`);
          });
        } else {
          ToastWarning('Formato de resposta inesperado.');
        }
      } catch (error) {
        // console.error('Erro ao buscar imagens:', error);
      }
    },
    async getImagemTramiteAssinatura(tramiteId) {
      try {
        const response = await axios.get(`${this.urlEstoque}/foto-componente/get-foto-assinatura-tramite/${tramiteId}`,
          { headers: { Authorization: `Bearer ${this.token}` } }
        );

        if (Array.isArray(response.data)) {
          // Cada base64 vira uma data URL
          this.imagensAssinatura = response.data.map(base64 => `data:image/jpeg;base64,${base64}`);
          this.imagensTramite = response.data.map(base64 => `data:image/jpeg;base64,${base64}`);
        } else {
          ToastWarning('Formato de resposta inesperado.');
        }
      } catch (error) {
        // console.error('Erro ao buscar imagens:', error);
      }
    },
    async getInfoDeUmTramitePai(ID_Tramite) {
      this.tramiteResponseDTO = await GetGenerico(`${this.urlEstoque}/tramite/com-join/${ID_Tramite}`, {}, this.token);
      this.infosTramite = await GetGenerico(`${this.urlEstoque}/tramite/com-join/${ID_Tramite}`, {}, this.token);
      this.editandoTramiteDTO.inconformidade = this.infosTramite.cInconformidade;
      this.editandoTramiteDTO.cAdicionais = this.infosTramite.cAdicionais;
    },
    async getTiposTramite() {
			this.tiposTramite = await GetGenerico(`${this.urlEstoque}/PTipoTramite`, {}, this.token);
    },
    async getConferentes() {
      this.conferentes = await GetGenerico(`${this.urlSistema}/usuarios/conferentes/${this.userID}`, {}, this.token);
    },
    async getTransportadorasApenasSLA(idCliente) {
      this.transportadorasApenasSLA = await GetGenerico(`${this.urlSistema}/carteira/concatenacao/transportadoras-sla/${idCliente}`, {}, this.token);
    },
    async getClientesApenasSLA() {
			const clientes = await GetGenerico(`${this.urlSistema}/carteira/id-e-nome-disponiveis-lote-exp`, {}, this.token);
      // Site: na expedição de pedido o único cliente possível é a carteira do usuário externo logado
      const idCarteiraUsuario = useAuthStore().idCarteira;
      this.clientesApenasSLA = (clientes || []).filter(c => c.iD_Carteira === idCarteiraUsuario);
    },
    async getItensTramite(idTramite) {
      this.tabelaItensTRAMITEsCarregada = false;
      this.itensTramiteStatic = await GetGenerico(`${this.urlEstoque}/tramite-item/de-um-pai-com-join/${idTramite}`, {}, this.token);
      this.itensTramiteStatic.sort((a, b) => a.iD_Tramite_FILHO - b.iD_Tramite_FILHO);
      this.itensTramiteStatic = this.itensTramiteStatic.map(item => ({
        ...item,
        cNomeComponente:
          this.tramiteResponseDTO.iD_Tipo_Tramite === 2 &&
          item.iD_Componente === 4853
            ? `${item.cNomeComponente} | ${item.cProtocoloProduto}`
            : item.cNomeComponente
      }));


      this.itensTramite = this.itensTramiteStatic;
      this.tabelaItensTRAMITEsCarregada = true;

      // Força o scroll para o final da div com a tabela
      this.$nextTick(() => {
        const el = this.$refs.tabelaContainer;
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      });

    },
    async getPedidosPossiveisExpedicao() {
      this.tabelaPedidosPossiveisLoteExp = false
      // Site: só pedidos cuja transportadora é a do cadastro do usuário externo logado
      const idTransportadoraUsuario = useAuthStore().idTransportadora;
      if (!idTransportadoraUsuario || this.selectedTransportadoraLoteEXP?.iD_Carteira !== idTransportadoraUsuario) {
        this.pedidosPossiveisExpedicao = [];
      } else {
        this.pedidosPossiveisExpedicao = await GetGenerico(`${this.urlBase}/sla/pedido/pedidos-possiveis-expedicao/${this.selectedClienteLoteEXP?.iD_Carteira}/${idTransportadoraUsuario}`, {}, this.token);
      }
      this.staticPedidosPossiveisExpedicao = this.pedidosPossiveisExpedicao;
      this.tabelaPedidosPossiveisLoteExp = true;
    },
    async getQuantidadesItensSKU() {
      try {

        const listaIDsPedidos = this.pedidosPossiveisExpedicao
          ?.map(p => p.iD_Pedido) || [];

        if (!listaIDsPedidos.length) {
          console.warn("Nenhum pedido encontrado.");
          return [];
        }

        const body = {
          listaID_Pedidos: listaIDsPedidos
        };

        let res = await axios.post(
          `${this.urlBase}/sla/pedido/quantidades-itens-sku-lista-pedidos`,
          body,
          {
            headers: { Authorization: `Bearer ${this.token}` }
          }
        );

        return res.data;

      } catch (error) {
        console.error("Erro ao buscar quantidades:", error.response?.data || error);
        return false;
      }
    },
    async confereInfosPedidoClienteTransportadora() {
      const pedidosSelecionados = this.staticPedidosPossiveisExpedicao
        .filter(p => p.bSelecionado === true)
        .map(ped => ped.iD_Pedido);

      const body = {
        iD_Carteira: this.selectedClienteLoteEXP?.iD_Carteira,
        iD_Transportadora: this.selectedTransportadoraLoteEXP?.iD_Carteira,
        listaIDsPedidos: pedidosSelecionados
      }
      try {
        let res = await axios.post(
          `${this.urlBase}/estoque/tramite/confere-infos-tramite-exp-pedido`,
          body,
          {
            headers: { Authorization: `Bearer ${this.token}` }
          }
        );
        return res.data;
      } catch (error) {
        console.error("Erro ao validar pedidos:", error.response?.data || error);
        return false;
      }
    },
    async confereConferenteValidoParaPedido(idConferente) {
      try {
        let res = await axios.get(
          `${this.urlBase}/estoque/tramite/conferente-valido-exp-pedido/${idConferente}`,
          {
            headers: { Authorization: `Bearer ${this.token}` }
          }
        );
        return res.data;
      } catch (error) {
        console.error("Erro ao validar pedidos:", error.response?.data || error);
        return false;
      }
    },
    async postTramiteExpedicaoPedido() {
      try {
        // Faz o POST
        const response = await axios.post(
          `${this.urlBase}/estoque/tramite/tramite-expedicao`,
          this.geraBodyPostTramiteExpedicaoPedido(),
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json"
            }
          }
        );
        ToastSuccess('Trâmite de expedição criado com sucesso! Aguarde a assinatura para que o processo seja concluído.');

        return response;

      } catch (error) {
        console.error("Erro ao criar trâmite de expedição:", error);

        if (error.response && error.response.data) {
          ToastError(`Erro`);
        } else {
          ToastError("Erro inesperado ao criar o trâmite de expedição.");
        }

        return null;
      }
    },
    async ConfereFotoAssinaturaTramiteExpedicao(idTramite) {
      try {
        const response = await axios.get(
          `${this.urlBase}/estoque/tramite/verificar-foto-expedicao/${idTramite}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (response.data?.existeFoto) {
          ToastSuccess("Foto de assinatura encontrada!");
        } else {
          ToastWarning("Este trâmite não possui foto de assinatura.");
        }

        return response;

      } catch (error) {
        console.error("Erro ao verificar foto do trâmite:", error);

        if (error.response && error.response.data) {
          ToastError(`Erro`);
        } else {
          ToastError("Erro inesperado ao verificar foto.");
        }

        return null;
      }
    },
    limpaObjetoTramiteLoteExpedicao() {
      this.tramiteLoteExpRequestDTO = {
        iD_Transportadora: null,
        iD_Cliente: null,
        iD_Remetente: null,
        iD_Conferente: null,
        veiculo: null,
        placaVeiculo: null,
        motorista: null,
        rgMotorista: null,
        inconformidade: null,
        logReversa: false
      };
      this.selectedClienteLoteEXP = null;
      this.selectedTransportadoraLoteEXP = null;
    },
    geraBodyPostTramiteExpedicaoPedido() {
      return {
        Tramite: {
          HorarioInicioTramite: this.horarioInicialTramiteLoteEXP,
          OS: null,
          ID_Tipo: 2,
          ID_Responsavel: this.idUsuarioAtual,
          ID_Transportadora: this.tramiteLoteExpRequestDTO.iD_Transportadora,
          ID_Cliente: this.tramiteLoteExpRequestDTO.iD_Cliente,
          ID_Remetente: this.tramiteLoteExpRequestDTO.iD_Remetente,
          ID_Conferente: this.idUsuarioAtual,
          Veiculo: this.tramiteLoteExpRequestDTO.veiculo,
          PlacaVeiculo: this.tramiteLoteExpRequestDTO.placaVeiculo,
          Motorista: this.tramiteLoteExpRequestDTO.motorista,
          RGMotorista: this.tramiteLoteExpRequestDTO.rgMotorista,
          // Adicionais: "TRÂMITE INSERIDO AUTOMATICAMENTE PELA CONTROLADORIA DE PEDIDOS - SLA",
          Adicionais: "",
          Inconformidade: null,
          LogReversa: false,
        },
        IdsPedidos: this.staticPedidosPossiveisExpedicao
          .filter(p => p.bSelecionado === true)
          .map(ped => ped.iD_Pedido)
      };
    },
    async enviaEmailTramiteReq(modoEnvio, emailUsuario, idDoTramite) {
      ToastWarning("Aguarde o envio do E-mail...");

      try {
        const payload = {
          modoEnvio: modoEnvio,
          email: emailUsuario,
          idTramite: idDoTramite,
        };

        const response = await axios.post(
          `${this.urlEstoque}/tramite/email-tramite`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json"
            }
          }
        );

        ToastSuccess(`Email do trâmite ${idDoTramite} enviado com sucesso!`);

        await this.getTramitesPai();

        return response;

      } catch (error) {
        console.error("Erro ao enviar e-mail do trâmite:", error);

        if (error.response && error.response.data) {
          ToastError(`Erro: ${error.response.data}`);
        } else {
          ToastError("Erro inesperado ao enviar e-mail do trâmite.");
        }

        return null;
      }
    },

    async enviaEmailRomaneio(idTramite) {
      ToastWarning("Aguarde o envio do E-mail...");

      try {
        const response = await axios.post(
          `${this.urlEstoque}/tramite/envia-email-romaneio/${idTramite}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json"
            }
          }
        );

        ToastSuccess(`Email do romaneio do trâmite ${idTramite} enviado com sucesso!`);

        await this.getTramitesPai();

        return response;

      } catch (error) {
        console.error("Erro ao enviar e-mail da expedição:", error);

        if (error.response && error.response.data) {
          ToastError(`Erro: ${error.response.data.mensagem || error.response.data}`);
        } else {
          ToastError("Erro inesperado ao enviar e-mail da expedição.");
        }

        return null;
      }
    },
    
    async enviaEmailAnulaTramiteReq(idTramite) {
      ToastWarning("Aguarde o envio do E-mail...");
      try {
        const response = await axios.post(
          `${this.urlEstoque}/tramite/email-tramite-anulacao/${idTramite}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json"
            }
          }
        );
        if (response.status >= 200 && response.status < 300) {
          ToastSuccess(`Email da anulação do trâmite ${idTramite} enviado com sucesso!`);
          await this.getTramitesPai();
          return null;
        } else {
          throw new Error("Erro ao realizar Trâmite.");
        }
      } catch (error) {
        console.error("Erro ao realizar Trâmite:", error);
        ToastError("Erro ao enviar e-mail do trâmite.");
        return null;
      }
    },
    async anulaTramiteReq(idTramite, motivo) {
      this.podeClicarBotaoAnular = false;
      const permissaoParaExcluir = await axios.get(`${this.urlSistema}/usuarios/verifica-usuario-e-senha/${this.userSigla}/${this.senhaAnulaTramite}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (!permissaoParaExcluir.data) {
      ToastWarning('Senha inválida!');
      document.getElementById('senhaAnulacao-input').classList.add('required-red-border');
      this.podeClicarBotaoAnular = true;
      return false;
      }

      try {
      const response = await axios.put(`${this.urlEstoque}/tramite/anular-tramite`,
        {
          idTramitePai: idTramite,
          idUsuarioAnulante: this.userID,
          motivo: motivo
        },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (response.status >= 200 && response.status < 300) {
        ToastSuccess(`Trâmite ${idTramite} anulado com sucesso!`);
        this.senhaAnulaTramite = null;
        this.motivoAnulaTramite = null;
        const modalEl = document.getElementById('TramitePaiAnularModal');
        if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
          modalInstance.hide();
        }
        }
        return true;
      } else {
        throw new Error("Erro ao anular trâmite.");
      }
      } catch (error) {
      console.error("Erro ao anular o trâmite:", error);
      this.podeClicarBotaoAnular = true;
      return false
      }
    },
    async getTodasPlacas() {
      this.infoTodasPlacas = await GetGenerico(`${this.urlEstoque}/veiculo-motorista/placas`, {}, this.token);
    },

    // BUCSA ------------------------------------\
    // filteredOptions() {
		// 	this.tramitesPai = this.tramitesPaiStatic;
		// 	const query = this.removeAccents(this.querieProcura.toLowerCase());

		// 	this.tramitesPai = this.tramitesPai.filter(option => {
		// 		return (
		// 			option.iD_Tramite.toString().includes(query) ||
    //       this.removeAccents(option.unidade.toLowerCase()).includes(query) ||
		// 			this.removeAccents(option.cTipoTramite.toLowerCase()).includes(query) ||
		// 			this.removeAccents(option.cliente.toLowerCase()).includes(query) ||
		// 			this.removeAccents(option.transportadora.toLowerCase()).includes(query) ||
		// 		  this.removeAccents(option.cTipoTramite.toLowerCase()).includes(query) 
    //     );
		// 	});
		// },
    async FetchUnidade() {
			try {
				let res = await axios.get(`${this.urlProdSistema}/unidade/acesso-usuario/${this.userID}`, {
					headers: { Authorization: `Bearer ${this.token}` }
				});

				// No site a unidade começa sem seleção (mostra todas)
				this.infoUnidadesFiltro = res.data;
			} catch (error) {
				console.error(error);
			}
		},
		removeAccents(str) {
			return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		},
    filteredOptions() {
      const query = this.removeAccents(this.querieProcura.toLowerCase());

      // 1. Filtra os filhos onde codComponente ou nF inclui o texto buscado
      const filhosFiltrados = this.infosBuscaTramiteItem.filter(filho => {
        const codComponente = this.removeAccents(filho.codComponente?.toLowerCase() || "");
        const nf = this.removeAccents(filho.nF?.toLowerCase() || "");

        return codComponente.includes(query) || nf.includes(query);
      });

      // 2. Pega os IDs únicos dos pais relacionados aos filhos filtrados
      const idsPaisDosFilhos = new Set(filhosFiltrados.map(filho => filho.iD_TramitePai));

      // 3. Filtra os pais com base em texto
      let paisFiltrados = this.tramitesPaiStatic.filter(pai => {
        const passaFiltroTexto =
          pai.iD_Tramite?.toString().includes(query) ||
          this.removeAccents(pai.cTipoTramite?.toLowerCase() || "").includes(query) ||
          this.removeAccents(pai.cliente?.toLowerCase() || "").includes(query) ||
          this.removeAccents(pai.transportadora?.toLowerCase() || "").includes(query);

        return passaFiltroTexto;
      });

      // 4. Adiciona pais que têm filhos relacionados e ainda não estão na lista
      const idsPaisAdicionados = new Set(paisFiltrados.map(p => p.iD_Tramite));
      this.tramitesPaiStatic.forEach(pai => {
        if (
          idsPaisDosFilhos.has(pai.iD_Tramite) &&
          !idsPaisAdicionados.has(pai.iD_Tramite)
        ) {
          paisFiltrados.push(pai);
        }
      });

      // 5. Aplica filtro por unidade (se necessário)
      if (this.selectedUnidadeFiltro) {
        paisFiltrados = paisFiltrados.filter(
          pai => pai.iD_Unidade === this.selectedUnidadeFiltro.ID_Unidade
        );
      }

      // 6. Atualiza a lista final
      this.tramitesPai = paisFiltrados;
    },
    onChangeUnidadeSelectREF() {
      // Limpar a unidade deixa sem filtro (não volta para a unidade do usuário)
      this.paginaAtual = 1;
      this.getTramitesPai();
    },
    onChangeFiltro() {
      this.paginaAtual = 1;
      this.getTramitesPai();
    },
		// MODAL --------------------------------------------------------------------------------------------------------\
    async ativarSubLinha(tramiteEscolhido) {
      if (this.linhaExpandidaDaTabela === tramiteEscolhido.iD_Tramite) {
        this.linhaExpandidaDaTabela = null; 
        this.itensTramiteStatic = []; // Limpa os itens do trâmite
        this.itensTramite = []; // Limpa os itens do trâmite
        this.tramitePaiSelecionado = null; // Limpa o trâmite pai selecionado
      } else {
        this.linhaExpandidaDaTabela = tramiteEscolhido.iD_Tramite;
        await this.getItensTramite(tramiteEscolhido.iD_Tramite); // Chama a função para buscar os itens do trâmite
        this.tramitePaiSelecionado = tramiteEscolhido; // Armazena o trâmite selecionado
      }
    },
    async OpenUpdateModal(modoAbertura, tramite) {
      if (tramite?.usuarioAnulante) {
        ToastWarning('Este trâmite já foi anulado e não pode mais ser aberto.');
        return;
      }

      this.tramiteEnvioCompletoDTO.dHoraInicioTramite = Date.now();
      this.modalAberto = true;
      this.modoAbertura = modoAbertura;

      if (modoAbertura === 'AdicionandoTramiteLoteExp') {

        this.horarioInicialTramiteLoteEXP = new Date();

        this.textoBotaoExpedir = 'IR PARA ASSINATURA';
        this.confirmadoAvisoExpedir = false;

        const modalEl = document.getElementById('TramiteLoteExpModal');

        if (!this.modalLoteExpInstance) {
          this.modalLoteExpInstance = new bootstrap.Modal(modalEl);
        }

        this.modalLoteExpInstance.show();

        await this.comportamentoTramiteLoteExp();

        // Foca no input de Cliente:
        setTimeout(() => {
          const selectClienteTramiteExp = this.$refs.clienteSelectREFLOTEEXP;
          if(selectClienteTramiteExp) {
            selectClienteTramiteExp.focusInput();
          }
        }, 500);

        return;
      }

      const modalEl = document.getElementById('TramitePaiModal');

      if (!this.modalPaiInstance) {
        this.modalPaiInstance = new bootstrap.Modal(modalEl);
      }

      this.modalPaiInstance.show();

     // -----------------------------------------------------------/

      if(modoAbertura === 'ClickDiretoTabela') {

        this.textoBotaoExpedir = 'IR PARA ASSINATURA';
        
        await this.comportamentoInfosCarrossel(modoAbertura);
        this.tipoModalAberto = 'ClickDiretoTabela';
        this.tramiteSelecionado = tramite;

          // Trecho necessário para o Swiper funcionar corretamente ---\
          if (!this.listenerAdicionado) {
            modalEl.addEventListener('shown.bs.modal', () => {
              this.definirAlturaSwiper();
            });
            this.listenerAdicionado = true;
          }
          await this.definirAlturaSwiper();
          // ----------------------------------------------------------/

        await this.getInfoDeUmTramitePai(tramite.iD_Tramite);
        await this.getImagemTramiteAssinatura(tramite.iD_Tramite);
        await this.getImagemTramite(tramite.iD_Tramite);
        await this.getItensTramite(tramite.iD_Tramite);
        
        // Ajusta a altura da tabela após o modal ser aberto -------\
        await nextTick(); // Aguarda Vue atualizar o DOM

        setTimeout(() => {
          this.adjustTableHeight();
        }, 100); // Aguarda um curto período antes de calcular

        window.addEventListener('resize', this.adjustTableHeight);
        // --------------------------------------------------------/

      }

      if(modoAbertura === 'AdicionandoItensTramite') {

        this.tramiteSelecionado = tramite;

        this.adequandoTramiteEnvioCompletoDTOParaInfosTramite();


        // Trecho necessário para o Swiper funcionar corretamente ---\
        await this.comportamentoInfosCarrossel(modoAbertura);


        if (!this.listenerAdicionado) {
          modalEl.addEventListener('shown.bs.modal', () => {
            this.definirAlturaSwiper();
          });
          this.listenerAdicionado = true;
        }
        await this.definirAlturaSwiper();
        
        // Ajusta a altura da tabela após o modal ser aberto -------\
        await nextTick(); // Aguarda Vue atualizar o DOM
        
        setTimeout(() => {
          this.adjustTableHeight();
        }, 100); // Aguarda um curto período antes de calcular
        
        window.addEventListener('resize', this.adjustTableHeight);
        // ----------------------------------------------------------/
        // --------------------------------------------------------/

      }
      
      if (modoAbertura === 'AdicionandoTramite') {
        // CONFIGURAÇÕES MODAL ----------------------------------------------\
        const modalElement = document.getElementById("TramitePaiModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

        const focusOnInput = () => {
          const selectElement = document.getElementById("tipotramite-post-select");

          if (selectElement) {
            // Foca no campo
            selectElement.focus();

            // Abre as opções (trick: dispara um evento de teclado)
            const event = new KeyboardEvent("keydown", { key: "ArrowDown" });
            selectElement.dispatchEvent(event);
          }

          modalElement.removeEventListener("shown.bs.modal", focusOnInput);
        };

        modalElement.addEventListener("shown.bs.modal", focusOnInput);
        await this.comportamentoInfosCarrossel(modoAbertura);
        // ------------------------------------------------------------------/

        await this.getTiposTramite();
        await this.getConferentes();
      }
      
    },
    formatarDataHora(timestamp) {
      const data = new Date(timestamp);
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      const hora = String(data.getHours()).padStart(2, '0');
      const min = String(data.getMinutes()).padStart(2, '0');
      return `${dia}/${mes}/${ano} ${hora}:${min}`;
    },
    async adequandoTramiteEnvioCompletoDTOParaInfosTramite() {
      if(this.tramiteEnvioCompletoDTO){
        
        this.infosTramite.dHoraInicioTramite = this.tramiteEnvioCompletoDTO.dHoraInicioTramite;
        
        this.infosTramite.cNmFantasia = this.clientes.filter(
          cliente => cliente.iD_Carteira === this.tramiteEnvioCompletoDTO.iD_Cliente
        )[0]?.cNmFantasia || '';
        
        this.infosTramite.iOrdemServico = this.tramiteEnvioCompletoDTO.os;
        
        this.infosTramite.cTipoTramite = this.tiposTramite.filter(
          tipo => tipo.iD_Tipo_Tramite === this.tramiteEnvioCompletoDTO.iD_Tipo
        )[0]?.cTipoTramite || '';

        this.infosTramite.cLancadoEstoque = "NÃO";

        this.infosTramite.cNmUsuario = this.userNome;

        this.infosTramite.cRazaoSocial = this.transportadoras.filter(
          transportadora => transportadora.iD_Carteira === this.tramiteEnvioCompletoDTO.iD_Transportadora
        )[0]?.cNmFantasia || '';

        this.infosTramite.cTipoVeiculo = this.tramiteEnvioCompletoDTO.veiculo || '';

        this.infosTramite.cPlacaVeiculo = this.tramiteEnvioCompletoDTO.placaVeiculo || '';

        this.infosTramite.cNomeMotorista = this.tramiteEnvioCompletoDTO.motorista || '';

        this.infosTramite.cRGMotorista = this.tramiteEnvioCompletoDTO.rgMotorista || '';

        this.infosTramite.cConferenteTramite = this.conferentes.filter(
          conferente => conferente.iD_Usuario === this.tramiteEnvioCompletoDTO.iD_Conferente
        )[0]?.nomeAbreviadoUsuario || '';

        this.infosTramite.cRemetDestCarga = this.remetentes.filter(
          remetente => remetente.iD_Carteira === this.tramiteEnvioCompletoDTO.iD_Remetente
        )[0]?.cNmFantasia || '';

        this.infosTramite.cAdicionais = this.tramiteEnvioCompletoDTO.adicionais || '';
      }
    },
    async comportamentoInfosCarrossel(modoAbertura) {
      await nextTick(); // espera o DOM renderizar

      const carrosselDiv = document.getElementById('carrossel-div');
      const infosDiv = document.getElementById('infosTramitePai');

      if (carrosselDiv && infosDiv) {
        if (modoAbertura === 'ClickDiretoTabela') {
          carrosselDiv.classList.remove('WIDTH-0px');
          carrosselDiv.classList.add('WIDTH-30');
          infosDiv.classList.remove('WIDTH-100');
          infosDiv.classList.add('WIDTH-70');
        } else if (modoAbertura === 'AdicionandoTramite') {
          carrosselDiv.classList.remove('WIDTH-30');
          carrosselDiv.classList.add('WIDTH-0px');
          infosDiv.classList.remove('WIDTH-70');
          infosDiv.classList.add('WIDTH-100');
        }
      }
    },
    async definirAlturaSwiper() {
      await nextTick(); 
      this.$nextTick(() => {
        const infosDiv = document.getElementById('infosTramitePai');
        if (infosDiv) {
          this.alturaInfosPx = infosDiv.offsetHeight;
        }
      });
    },
    // MODAL AO CLICAR NA TABELA
		async adjustTableHeight() {
			await nextTick(); // Aguarda Vue atualizar o DOM
			// Altura total do modal (91% da altura da tela)
			const modalHeight = window.innerHeight * 0.91;

			// Altura do cabeçalho
			const headerHeight = document.getElementById('modal-header') ? document.getElementById('modal-header').offsetHeight : 0;

			// Altura do formulário (se presente)
			const formHeight = document.getElementById('infosTramitePai') ? document.getElementById('infosTramitePai').offsetHeight : 0;

			// Altura da nova movimentação (se presente)
			const novaMovHeight = document.getElementById('btnNovoItemTramite') ? document.getElementById('btnNovoItemTramite').offsetHeight : 0;

      // Altura do rodapé (se presente)
			const rodapeHeight = document.getElementById('modal-footer') ? document.getElementById('modal-footer').offsetHeight : 0;

			// Calcular altura disponível para a tabela
			const bodyHeight = modalHeight - headerHeight - formHeight - novaMovHeight - rodapeHeight - 30;

			// Ajusta a altura máxima da tabela
			this.tableContainerItemTramiteStyle = {
				maxHeight: `${bodyHeight}px`,
				overflowY: 'auto'
			};
		},

    async enviaEmailTramiteCorreiosReq(idTramite) {
      ToastWarning("Aguarde o envio do E-mail...");

      try {
        const response = await axios.post(
          `${this.urlEstoque}/tramite/envia-email-correios/${idTramite}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json"
            }
          }
        );

        ToastSuccess(`Email da expedição ${idTramite} enviado com sucesso!`);

        await this.getTramitesPai();

        return response;

      } catch (error) {
        console.error("Erro ao enviar e-mail da expedição:", error);

        if (error.response && error.response.data) {
          ToastError(`Erro: ${error.response.data.mensagem || error.response.data}`);
        } else {
          ToastError("Erro inesperado ao enviar e-mail da expedição.");
        }

        return null;
      }
    },
    async enviaEmailGRNF(idTramite) {
      ToastWarning("Aguarde o envio do E-mail...");

      try {
        const response = await axios.post(
          `${this.urlEstoque}/tramite/envia-email-gr-nf/${idTramite}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json"
            }
          }
        );

        ToastSuccess(`Email da expedição ${idTramite} enviado com sucesso!`);

        await this.getTramitesPai();

        return response;

      } catch (error) {
        console.error("Erro ao enviar e-mail da expedição:", error);

        if (error.response && error.response.data) {
          ToastError(`Erro: ${error.response.data.mensagem || error.response.data}`);
        } else {
          ToastError("Erro inesperado ao enviar e-mail da expedição.");
        }

        return null;
      }
    },
    async clickButtonSalvarTramiteExpedicao() {

      // Evita reentrância por duplo clique (estava causando envio de e-mail em duplicidade)
      if (this.postandoTramite) return;

      if(this.modoEsperaAssinatura) {
        // confere se o tramtie já tem alguma imagem
        const resposta = await this.ConfereFotoAssinaturaTramiteExpedicao(this.idTramiteAguardandoAssinatura);

        if(resposta.data.existeFoto) {
          // Bloqueia os botões antes de disparar os e-mails para evitar duplo clique
          this.postandoTramite = true;
          await this.bloquearTodosBotoesTramiteExpedicaoPedido();

          // Encerra a tela ocupada:
          await this.EncerraContagemTelaOcupada();

          // E-mail do trâmite: vai para a lista padrão + o e-mail do cadastro do usuário externo
          // (a API soma o e-mail pelo token). Também é ele que marca o trâmite como finalizado.
          await this.enviaEmailTramiteReq(0, null, this.idTramiteAguardandoAssinatura);

          await this.enviaEmailRomaneio(this.idTramiteAguardandoAssinatura);
          await this.enviaEmailTramiteCorreiosReq(this.idTramiteAguardandoAssinatura);
          if(this.selectedTransportadoraLoteEXP?.iD_Carteira == 5148 || this.selectedTransportadoraLoteEXP?.iD_Carteira == 10801) {
            await this.enviaEmailGRNF(this.idTramiteAguardandoAssinatura);
          }

          if(this.gerarPDFNF) {
            await this.baixarPDFsNFExpedicao(this.idTramiteAguardandoAssinatura);
          }

          if(this.imprimirDANFE) {
            await this.imprimirDANFEsExpedicao(this.idTramiteAguardandoAssinatura);
          } else {
            await this.imprimirRomaneioApenasExpedicao(this.idTramiteAguardandoAssinatura);
          }

          this.postandoTramite = false;
          await this.desbloquearTodosBotoesTramiteExpedicaoPedido();

          await this.clickCloseModalTramiteExpLote();
          await this.replicaMounted();
          return;
        } else {
          return
        }
      }

      // Primeira há uma conferencia:
      // Se não existir o tramite => segue
      // Se existir => Tem que ter um método pra conferir e emitir mensagem que falta assinatura
      const temAviso = this.pedidosPossiveisExpedicao.some(x => x.iD_StatusAPI != 3);

      if (temAviso && !this.confirmadoAvisoExpedir) {
        ToastWarning(
          'AVISO!\nExistem pedidos (CANCELADOS/DESFEITOS) que não entraram na lista para EXPEDIR!'
        );

        this.textoBotaoExpedir = 'CONFIRMAR LEITURA DO AVISO -> ASSINATURA';
        this.confirmadoAvisoExpedir = true;
        return;
      }

      // fluxo normal (não tem aviso OU já confirmou)
      this.postandoTramite = true;

      await this.bloquearTodosBotoesTramiteExpedicaoPedido();

      if(!this.itensTramite.length > 0) {
        const informacoesValidas = await this.confereInformacoesTramiteExpedicaoPedido();
        if (!informacoesValidas) {

          this.postandoTramite = false;
          await this.desbloquearTodosBotoesTramiteExpedicaoPedido();

          return;
        }
        
        const resposta = await this.postTramiteExpedicaoPedido();
        
        if(resposta.status === 200) {
          this.modoEsperaAssinatura = true;
          this.textoBotaoExpedir = "EXPEDIR!";
          this.idTramiteAguardandoAssinatura = resposta.data.iD_Tramite;
          this.postandoTramite = false;
          return;
        } else {
          ToastError('Erro ao criar o trâmite de expedição. Tente novamente.');
          this.postandoTramite = false;
          return;
        }
      } else {
        this.idTramiteAguardandoAssinatura = this.infosTramite.iD_Tramite;
        await this.clickCloseModal();
        await this.OpenUpdateModal('AdicionandoTramiteLoteExp');
        this.modoEsperaAssinatura = true;
        this.textoBotaoExpedir = "EXPEDIR!";
        this.postandoTramite = false;
        return;
      }

      // if (resposta === 'tramite criado e sem assinatura') {
        // Mantem o usuario no modal, emite aviso se ele clicar em expedir denovo e ainda nao tiver a assinatura, confere
      // }

      // await this.desbloquearTodosBotoesTramiteExpedicaoPedido();
      // await this.clickCloseModalTramiteExpLote();
      // await this.replicaMounted();
    },

    async fecharModalViaJS() {
      const modalElement = document.getElementById('TramiteLoteExpModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      await modal.hide();
      await nextTick();
    },
    abrirImagemNovaAba(img) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>Visualizar Imagem</title></head>
            <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh; background:#000;">
              <img src="${img}" style="max-width: 100%; max-height: 100%;" />
            </body>
          </html>
        `);
      } else {
        alert('Não foi possível abrir a nova aba. Verifique se o navegador está bloqueando pop-ups.');
      }
    },
    async clickCloseModal() {

      this.pedidosExpedicaoSelecionados = [];
      this.pedidosPossiveisExpedicao = [];
      this.textoBotaoExpedir = 'IR PARA ASSINATURA';

      if(this.modoExibicaoImagem) {
        this.modoExibicaoImagem = false;
        return;
      }

      if(this.isVisualizarPDF) {
        this.isVisualizarPDF = false;
        this.isLoadingPDF = false;
        return;
      }

      if(this.modoAbertura == 'AdicionandoTramite') {

        const isEmpty = !Object.values(this.tramiteEnvioCompletoDTO).some(
          value => value !== 0 && value !== null && value !== ''
        );

        if (isEmpty && !this.selectedCliente && !this.selectedTransportadora && !this.selectedRemetente) {

          await this.retiraTodosOsrequireds();
          
          const tramitePaiModal = document.getElementById('TramitePaiModal');

          if (tramitePaiModal) {
            const modal = bootstrap.Modal.getInstance(tramitePaiModal);
            modal?.hide();
          }

          await this.closeModal();
          return;
        } 
      }

      
      if(this.modoAbertura == 'ClickDiretoTabela' && !this.podeAdicionar) {

        await this.retiraTodosOsrequireds();
     
        const tramitePaiModal = document.getElementById('TramitePaiModal');

        if (tramitePaiModal) {
          const modal = bootstrap.Modal.getInstance(tramitePaiModal);
          modal?.hide();
        }

        await this.closeModal();
        return;

      }

      this.confirmandoFecharModal = !this.confirmandoFecharModal
      
      if(!this.confirmandoFecharModal) {
        await this.retiraTodosOsrequireds();
        await this.closeModal(); 
        await this.getTramitesPai(); 
      } else {
        this.GeraPerguntaDePerderInfos(); // Gera a pergunta de perder infos
        const botaoSalvar = document.getElementById('tramitepai-post-button')
        if(botaoSalvar) {
          botaoSalvar.disabled = true;
        }
        const botaoNovoTramite = document.getElementById('insert-modal-novo-tramitefilho-button');
        if(botaoNovoTramite) {
          botaoNovoTramite.disabled = true;
        }
      }

    },
    async clickCloseModalTramiteExpLote () {
      this.tipoModalAberto = '';
      // Encerra a contagem de tela ocupada:
      await this.EncerraContagemTelaOcupada();

      // Limpa os filtros:
      this.onClickLimparFiltros();

      this.pedidosExpedicaoSelecionados = [];
      this.pedidosPossiveisExpedicao = [];
      this.staticPedidosPossiveisExpedicao = [];
      this.gerarPDFNF = false;
      this.imprimirDANFE = false;
      this.modoEsperaAssinatura = false;
      this.limpaObjetoTramiteLoteExpedicao();  

      this.enableFDisableTVeiculoLOTEEXPInput(true)
      this.enableFDisableTRGMotoristaLOTEEXPInput(true)
      this.enableFDisableTNomeMotoristaLOTEEXPInput(true)

      await this.fecharModalViaJS();
      await this.getTramitesPai(); 

    },
    escolhaFecharModal(escolha) {
      if(!escolha) {
        document.getElementById('insert-modal-redCross').remove();
        const botaoSalvar = document.getElementById('tramitepai-post-button')
        if(botaoSalvar) {
          botaoSalvar.disabled = false;
        }
        const botaoNovoTramite = document.getElementById('insert-modal-novo-tramitefilho-button');
        if(botaoNovoTramite) {
          botaoNovoTramite.disabled = false;
        }
      }
      else {
        // Aqui deve limpar as infos:
        const botaoSalvar = document.getElementById('tramitepai-post-button')
        if(botaoSalvar) {
          botaoSalvar.disabled = false;
        }

        this.closeModal(); // Fecha o modal
      }

      this.confirmandoFecharModal = false;
    },
    GeraPerguntaDePerderInfos () {
        this.confirmandoFecharModal = true;
  
        const redCross = document.createElement('div');
        redCross.id = 'insert-modal-redCross';
        redCross.classList.add('D-flex');
        redCross.classList.add('JC-center');
        redCross.classList.add('ALITEM-center');
        redCross.style.width = '100%';
        redCross.style.height = '100%';
        // redCross.style.marginTop = '100px';
        redCross.style.cursor = 'pointer';
        redCross.style.zIndex = '999';
        redCross.style.position = 'absolute';
        redCross.style.border = '5px solid red'
  
        // Primeira linha do X
        const line1 = document.createElement('div');
        line1.style.width = '45%';
        line1.style.height = '100px'; // Espessura da linha
        line1.style.backgroundColor = 'red';
        line1.style.position = 'absolute';
        line1.style.transform = 'rotate(45deg)';
  
        // Segunda linha do X
        const line2 = document.createElement('div');
        line2.style.width = '45%';
        line2.style.height = '100px';
        line2.style.backgroundColor = 'red';
        line2.style.position = 'absolute';
        line2.style.transform = 'rotate(-45deg)';
  
        // Adiciona as linhas ao redCross
        redCross.appendChild(line1);
        redCross.appendChild(line2);
  
        const corpoModal = document.getElementById('modal-corpo');
        corpoModal.style.position = 'relative';
        corpoModal.prepend(redCross);
    },
    getMotivoNaoSelecionavel(pedido, selectedTransportadora) {
      // prioridade importa (mesma ordem dos seus ifs)
      
      if (pedido.iD_StatusAPI === 8 || pedido.iD_StatusAPI === 1) {
        return 'PEDIDO CANCELADO/DESFEITO: NÃO PODE SER EXPEDIDO.';
      }

    if (
      pedido.idCliente == 5054 &&
      (!pedido.cNFTransp || pedido.cNFTransp === '') &&
      ![3182, 10801, 5148].includes(selectedTransportadora?.iD_Carteira)
    ) {
      return 'PEDIDO DA MAPLE BEAR SEM NOTA DE TRANSPORTE: NÃO PODE SER EXPEDIDO.';
    }

      // REGRA DESATIVADA: pedido sem nota fiscal pode ser expedido
      // if (!pedido.notaFiscal) {
      //   return 'PEDIDO SEM NOTA FISCAL: NÃO PODE SER EXPEDIDO.';
      // }

      // fallback obrigatório (sua regra geral)
      if (pedido.iD_StatusAPI != 3) {
        return 'PEDIDO CANCELADO/DESFEITO: NÃO PODE SER EXPEDIDO.';
      }

      return null;
    },
    isPedidoNaoSelecionavel(pedido, selectedTransportadora) {
      return !!this.getMotivoNaoSelecionavel(pedido, selectedTransportadora);
    },
    async onClickCheckBoxPedidosPossiveisExpedicao(pedido) {
      if (pedido.iD_StatusAPI === 8 || pedido.iD_StatusAPI === 1) {
        ToastWarning("PEDIDO CANCELADO/DESFEITO: NÃO PODE SER EXPEDIDO.");
        const checkbox = document.getElementById(`${pedido.iD_Pedido}-checkbox-pedido`);
        checkbox.checked = false;

        return;
      }


      if (pedido.idCliente == 5054 && (!pedido.cNFTransp || pedido.cNFTransp =="" ) && this.selectedTransportadoraLoteEXP.iD_Carteira !== 3182 ) {
        ToastWarning("PEDIDO DA MAPLE BEAR SEM NOTA DE TRANSPORTE: NÃO PODE SER EXPEDIDO.");
        const checkbox = document.getElementById(`${pedido.iD_Pedido}-checkbox-pedido`);
        checkbox.checked = false;

        return;
      }

      // REGRA DESATIVADA: pedido sem nota fiscal pode ser expedido
      // if((pedido.notaFiscal == "" || !pedido.notaFiscal || pedido.notaFiscal == null)) {
      //   ToastWarning("PEDIDO SEM NOTA FISCAL: NÃO PODE SER EXPEDIDO.");
      //   const checkbox = document.getElementById(`${pedido.iD_Pedido}-checkbox-pedido`);
      //   checkbox.checked = false;
      //
      //   return;
      // }

      const pedidoSelecionado = this.pedidosPossiveisExpedicao
        .find(ped => ped.iD_Pedido === pedido.iD_Pedido);
      pedidoSelecionado.bSelecionado = true;
      const pedidoSelecionadoStatic = this.staticPedidosPossiveisExpedicao
        .find(ped => ped.iD_Pedido === pedido.iD_Pedido);
      pedidoSelecionadoStatic.bSelecionado = true;

      // ANTIGO:
      // const index = this.pedidosPossiveisExpedicao.findIndex(
      //   p => p.iD_Pedido === pedido.iD_Pedido
      // );

      // if (index === -1) return;

      // // Remove do static tb:
      // const indexStatic = this.staticPedidosPossiveisExpedicao.findIndex(
      //   p => p.iD_Pedido === pedido.iD_Pedido
      // );

      // if (indexStatic === -1) return;

      // this.staticPedidosPossiveisExpedicao.splice(indexStatic, 1);


      // // Remove da lista de possíveis
      // const [pedidoRemovido] = this.pedidosPossiveisExpedicao.splice(index, 1);

      // // Guarda pedido + posição original
      // this.pedidosExpedicaoSelecionados.push({
      //   pedido: pedidoRemovido,
      //   indexOriginal: index
      // });
    },
    async onClickCheckBoxPedidoSelecionadoExpedicao(pedido) {
      const pedidoSelecionadoStatic = this.staticPedidosPossiveisExpedicao
        .find(ped => ped.iD_Pedido === pedido.iD_Pedido);
      pedidoSelecionadoStatic.bSelecionado = false;
      
      const pedidoSelecionado = this.pedidosPossiveisExpedicao
        .find(ped => ped.iD_Pedido === pedido.iD_Pedido);

      if (pedidoSelecionado) {
        pedidoSelecionado.bSelecionado = false;
      }

      

      // ANTIGO:
      // const indexSelecionado = this.pedidosExpedicaoSelecionados.findIndex(
      //   p => p.pedido.iD_Pedido === pedido.iD_Pedido
      // );

      // if (indexSelecionado === -1) return;

      // // Remove da lista de selecionados
      // const [{ pedido: pedidoRetorno, indexOriginal }] =
      //   this.pedidosExpedicaoSelecionados.splice(indexSelecionado, 1);

      // // Insere de volta no índice original
      // // this.pedidosPossiveisExpedicao.splice(indexOriginal, 0, pedidoRetorno);
      // this.staticPedidosPossiveisExpedicao.splice(indexOriginal, 0, pedidoRetorno);
    },
    async onClickAnularSelecao() {
      // this.pedidosPossiveisExpedicao.forEach(ped => { ped.bSelecionado = false; });
      this.staticPedidosPossiveisExpedicao.forEach(ped => { ped.bSelecionado = false; });

      // if (!this.pedidosExpedicaoSelecionados.length) return;

      // // Ordena do maior índice para o menor
      // const selecionadosOrdenados = [...this.pedidosExpedicaoSelecionados]
      //   .sort((a, b) => b.indexOriginal - a.indexOriginal);

      // // Devolve todos para a lista de possíveis
      // selecionadosOrdenados.forEach(({ pedido, indexOriginal }) => {
      //   this.pedidosPossiveisExpedicao.splice(indexOriginal, 0, pedido);
      // });

      // // Limpa a lista de selecionados
      // this.pedidosExpedicaoSelecionados = [];
    },
    async onClickSelecionarTodos() {
      let quantidadeBloqueados = 0;

      this.pedidosPossiveisExpedicao.forEach(ped => {
        if (
          (ped.iD_StatusAPI === 1 || ped.iD_StatusAPI === 8) ||
          (
            ped.idCliente == 5054 &&
            (!ped.cNFTransp || ped.cNFTransp == "") &&
            ![3182, 10801, 5148].includes(this.selectedTransportadoraLoteEXP.iD_Carteira)
          ) ||
          (ped.notaFiscal == "" || !ped.notaFiscal || ped.notaFiscal == null)
        ) {
          ped.bSelecionado = false;
          quantidadeBloqueados++;
          return;
        }

        ped.bSelecionado = true;
      });

      if (quantidadeBloqueados > 0) {
        ToastWarning(
          `${quantidadeBloqueados} PEDIDO(S) NÃO ESTÃO VÁLIDOS PARA EXPEDIÇÃO.`
        );
      }
    },
    async closeModal() {

      // Remove a redCross:
      const redCross = document.getElementById('insert-modal-redCross');
      redCross?.remove();

      if(this.infosTramite?.iD_Tramite) {
        if(this.podeAdicionar) {
          await this.cancelarCriacaoTramite(); // Cancela a criação do trâmite se necessário
        } else {
          // await this.deleteTramitePaiSemFilhoReq();
        }
      }

      await this.getTramitesPai();

      this.$nextTick(() => {
        document.activeElement.blur();
        this.isModalVisible = false;
      });

      window.removeEventListener('resize', this.adjustTableHeight);
      this.modalAberto = false;
      this.clearInfosModal();
      this.disableVeiculoInfoInputs();
    },
    clearInfosModal() {
      this.liberaCamposCriacaoItem = false;
      this.tramiteSelecionado = null;
      this.apenasLogReversa = null;
      this.infosTramite = {}; // Limpa as informações do trâmite
      this.postTramite = {}; // Limpa as informações do trâmite
      this.tramiteEnvioCompletoDTO = {}; // Limpa as informações do trâmite
      this.tramiteEnvioCompletoDTO.iD_Responsavel = this.userID;
      this.selectedCliente = null;
      this.selectedTransportadora = null;
      this.selectedRemetente = null;
      this.selectedComponenteItem = null;
      this.imagensTramite = []; // Limpa as imagens
      this.imagemComponente = []; // Limpa as imagens
      this.itensTramite = []; // Limpa os itens do trâmite
      this.infoPlacasExistentes = [];
    },
    async mudarEstadoCamposFiltroLOTEEXP(novoEstadoCampo) {
      if(novoEstadoCampo) {
        this.$refs.guiaRemessaSelectREFLOTEEXP?.habilitar();
        this.$refs.pedidoSelectREFLOTEEXP?.habilitar();
        this.$refs.ovSelectREFLOTEEXP?.habilitar();
        this.$refs.ckSelectREFLOTEEXP?.habilitar();
        this.$refs.nfeSelectREFLOTEEXP?.habilitar();
        this.$refs.cepSelectREFLOTEEXP?.habilitar();
        this.$refs.destinatarioSelectREFLOTEEXP?.habilitar();
        this.$refs.ufSelectREFLOTEEXP?.habilitar();
      } else {
        this.$refs.guiaRemessaSelectREFLOTEEXP?.desabilitar();
        this.$refs.pedidoSelectREFLOTEEXP?.desabilitar();
        this.$refs.ovSelectREFLOTEEXP?.desabilitar();
        this.$refs.ckSelectREFLOTEEXP?.desabilitar();
        this.$refs.nfeSelectREFLOTEEXP?.desabilitar();
        this.$refs.cepSelectREFLOTEEXP?.desabilitar();
        this.$refs.destinatarioSelectREFLOTEEXP?.desabilitar();
        this.$refs.ufSelectREFLOTEEXP?.desabilitar();
      }
    },
    async comportamentoTramiteLoteExp() {
      if(this.$refs.transportadoraSelectREFLOTEEXP){
        this.$refs.transportadoraSelectREFLOTEEXP.desabilitar();
      }

      // DESABILITO OS CAMPOS DE FILTRO:
      await this.mudarEstadoCamposFiltroLOTEEXP(false);

      // DESABILITO ESCOLHER A PLACA
      const labelLOTEEXP = document.getElementById('LOTEEXPinsert-placa-label')
      const inputLOTEEXP = document.getElementById('LOTEEXPinsert-placa-input')
      if(labelLOTEEXP && inputLOTEEXP) {
        labelLOTEEXP.classList.add('BGC-input-disabled');
        labelLOTEEXP.classList.remove('BGC-input-enabled');
        inputLOTEEXP.disabled = true;
      }
    },

    async cancelarCriacaoTramite() {
      
      try {
        const response = await axios.delete(`${this.urlEstoque}/tramite/delete-tramite/${this.infosTramite.iD_Tramite}`,
				  {	headers: { Authorization: `Bearer ${this.token}` } }
        );

        if (response.status >= 200 && response.status < 300) {
          ToastWarning(`Tramite excluído.`);
        } else {
          throw new Error("Erro ao excluir item.");
        }
      } catch (error) {
        console.error("Erro ao excluir item do tramite:", error);
      }

      await this.getTramitesPai(); // Atualiza a tabela de trâmites após o DELETE

    },
		async OnClickVisualizarPDFVisualizarModal(qualPDF) {
			this.isVisualizarPDF = true;

			// Busca o PDF e ja lida com o carregamento:
			const PDF = await this.fetchPDFPreVisualizar(qualPDF);
      this.exibirPDF('update-modal-iframe', PDF);
		},
    async fetchPDFPreVisualizar (qualPDF) {
			this.isLoadingPDF = true;
      let url = '';
      if(qualPDF === 'tramite') {
        url = `${this.urlEstoque}/tramite/PDF-recebimento/${this.infosTramite.iD_Tramite}`;
      } else if (qualPDF === 'romaneio') {
        url = `${this.urlBase}/estoque/tramite/PDF-romaneio-carga/${this.infosTramite.iD_Tramite}`;
      }

      try {
        const res = await axios.get(url,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/pdf',
          },
          responseType: 'blob'
        });
        
				// this.isLoadingPDF = false;

				return res.data;
      } catch (error) { console.error(error); }
			finally {
				setTimeout(() => {
					this.isLoadingPDF = false;
					
				}, 1500);
			}
    },
		exibirPDF(iframeID, pdfBytes) {
      // Cria um Blob a partir dos bytes do PDF:
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      // Cria uma URL temporária para o Blob:
      const url = URL.createObjectURL(blob);

      // Recupera o iframe:
      const iframe = document.getElementById(iframeID);

      // Defina a fonte do iframe como a URL temporária do Blob:
      iframe.src = url;
    },
    async clickButtonReenviaEmail() {

      // Bloqueia todos os botões da página
      this.mudarEstadoBotaoSalvar(false)
      this.mudarEstadoBotaoEnviaParaMim(false)

      
      // DISPARAR O EMAIL (a API manda para o e-mail do cadastro do usuário externo logado)
      await this.EnviaPDFTramiteEmailUsuario(this.infosTramite.iD_Tramite, this.userID)
    
      // Desbloqueia todos os botões da página
      this.mudarEstadoBotaoSalvar(true)
      this.mudarEstadoBotaoVisualizarPDF(true)
      this.mudarEstadoBotaoFechaModal(true)
      this.mudarEstadoBotaoEnviaParaMim(true)
    },
    async EnviaPDFTramiteEmailUsuario(ID_Tramite, ID_Usuario) {

      this.podeApertarBotaoEnviaParaMim = false; // Desabilita o botão de enviar para mim
			
      ToastWarning("Aguarde enquanto enviamos seu e-mail.");
			try {
				// Faz a requisição para o endpoint configurando o responseType como 'blob':
				let response = await axios.get(`${this.urlEstoque}/tramite/email-tramite-para-mim/${ID_Tramite}/${ID_Usuario}`,
          { headers: { Authorization: `Bearer ${this.token}`  } }
        );

				ToastSuccess("E-mail enviado.");
			} catch(error) {
				console.error(error);
				ToastWarning('Usuário não possui e-mail cadastrado no sistema.\nConsulte a TI.');
			}

      this.podeApertarBotaoEnviaParaMim = true; // Desabilita o botão de enviar para mim

		},
    async confereInformacoesTramiteExpedicaoPedido() {
      // CLIENTE:
      if(!this.tramiteLoteExpRequestDTO.iD_Cliente) {
        ToastWarning('Selecione um cliente válido para expedição de pedido.');
        return false;
      }

      // TRANSPORTADORA
      if(!this.tramiteLoteExpRequestDTO.iD_Transportadora) {
        ToastWarning('Selecione uma transportadora válida para expedição de pedido.');
        return false;
      }

      // CONFERENTE
      const conferenteValidoParaPedido = await this.confereConferenteValidoParaPedido(this.userID)
      if(!conferenteValidoParaPedido) {
        ToastWarning('Conferente atual não é válido para expedição de pedido.');
        return false;
      }

      // PLACA
      if(!this.tramiteLoteExpRequestDTO.placaVeiculo) {
        ToastWarning('Informe uma placa válida para expedição de pedido.');
        return false;
      }

      // VEÍCULO
      if(!this.tramiteLoteExpRequestDTO.veiculo) {
        ToastWarning('Informe um veículo válido para expedição de pedido.');
        return false;
      }

      // RG MOTORISTA
      if(!this.tramiteLoteExpRequestDTO.rgMotorista) {
        ToastWarning('Informe um RG válido para expedição de pedido.');
        return false;
      }

      // MOTORISTA
      if(!this.tramiteLoteExpRequestDTO.motorista) {
        ToastWarning('Informe um motorista válido para expedição de pedido.');
        return false;
      }

      if (!this.staticPedidosPossiveisExpedicao.some(p => p.bSelecionado === true)) {
        ToastWarning('Não há nenhum pedido selecionado para expedição.');
        return false;
      }

      // preciso ver se as informações passadas são válidas pro banco de verdade:
      const infosTramiteValidas = await this.confereInfosPedidoClienteTransportadora();
      if(infosTramiteValidas !== true) {
        ToastWarning(infosTramiteValidas.mensagem);
        return false
      }

      return true;
    },
    async retiraRequiredSeExistir(label, input) {

      const labelElement = document.getElementById(label);
      const inputElement = document.getElementById(input);

      if (labelElement && inputElement) {
        labelElement.classList.remove('required-red-border');
        inputElement.classList.remove('required-red-border');
      }
    },
    async retiraTodosOsrequireds() {
      await this.retiraRequiredSeExistir('tipotramite-post-label', 'tipotramite-post-select');
      await this.retiraRequiredSeExistir('conferente-post-label', 'conferente-post-select');
      await this.retiraRequiredSeExistir('placaveiculo-label', 'placaveiculo-input');
      await this.retiraRequiredSeExistir('veiculo-label', 'veiculo-input');
      await this.retiraRequiredSeExistir('rgmotorista-label', 'rgmotorista-input');
      await this.retiraRequiredSeExistir('motorista-label', 'motorista-input');
      const remetenteSelect = this.$refs?.remetenteSelectREF?.$el?.querySelector('.vs__dropdown-toggle');
      const transportadoraSelect = this.$refs?.transportadoraSelectREF?.$el?.querySelector('.vs__dropdown-toggle');
      const clienteSelect = this.$refs?.clienteSelectREF?.$el?.querySelector('.vs__dropdown-toggle');

      remetenteSelect?.classList.remove('required-red-border');
      transportadoraSelect?.classList.remove('required-red-border');
      clienteSelect?.classList.remove('required-red-border');

    },
    async bloquearTodosBotoesTramiteExpedicaoPedido() {

      this.confirmandoFecharModal = false;
      
      const buttonFecharModalTramiteExp = document.getElementById('LOTEEXP-modal-close-button');
      if(buttonFecharModalTramiteExp) {
        buttonFecharModalTramiteExp.disabled = true;
      }

      const buttonTramiteExp = document.getElementById('tramiteExpPedido-post-button');
      if(buttonTramiteExp) {
        buttonTramiteExp.disabled = true;
      }

      // Ja estariam bloqueados
      const selectClienteTramiteExp = this.$refs.clienteSelectREFLOTEEXP;
      if(selectClienteTramiteExp) {
        selectClienteTramiteExp.desabilitar();
      }

      const selectTransportadoraTramiteExp = this.$refs.transportadoraSelectREFLOTEEXP;
      if(selectTransportadoraTramiteExp) {
        selectTransportadoraTramiteExp.desabilitar();
      }

      const inputPlacaVeiculoTramiteExp = document.getElementById('LOTEEXPinsert-placa-input');
      const labelInputPlacaVeiculoTramiteExp = document.getElementById('LOTEEXPinsert-placa-label');
      if(inputPlacaVeiculoTramiteExp && labelInputPlacaVeiculoTramiteExp) {
        inputPlacaVeiculoTramiteExp.disabled = true;
        labelInputPlacaVeiculoTramiteExp.classList.add('BGC-input-disabled');
        labelInputPlacaVeiculoTramiteExp.classList.remove('BGC-input-enabled');
      }

      const inputVeiculoTramiteExp = document.getElementById('LOTEEXPinsert-veiculo-input');
      const labelInputVeiculoTramiteExp = document.getElementById('LOTEEXPinsert-veiculo-label');
      if(inputVeiculoTramiteExp && labelInputVeiculoTramiteExp) {
        inputVeiculoTramiteExp.disabled = true;
        labelInputVeiculoTramiteExp.classList.add('BGC-input-disabled');
        labelInputVeiculoTramiteExp.classList.remove('BGC-input-enabled');
      }

      const inputRGMotoristaTramiteExp = document.getElementById('LOTEEXPinsert-rgmotorista-input');
      const labelInputRGMotoristaTramiteExp = document.getElementById('LOTEEXPinsert-rgmotorista-label');
      if(inputRGMotoristaTramiteExp && labelInputRGMotoristaTramiteExp) {
        inputRGMotoristaTramiteExp.disabled = true;
        labelInputRGMotoristaTramiteExp.classList.add('BGC-input-disabled');
        labelInputRGMotoristaTramiteExp.classList.remove('BGC-input-enabled');
      }

      const inputMotoristaTramiteExp = document.getElementById('LOTEEXPinsert-motorista-input');
      const labelInputMotoristaTramiteExp = document.getElementById('LOTEEXPinsert-motorista-label');
      if(inputMotoristaTramiteExp && labelInputMotoristaTramiteExp) {
        inputMotoristaTramiteExp.disabled = true;
        labelInputMotoristaTramiteExp.classList.add('BGC-input-disabled');
        labelInputMotoristaTramiteExp.classList.remove('BGC-input-enabled');
      }

    },
    async desbloquearTodosBotoesTramiteExpedicaoPedido() {

      const buttonFecharModalTramiteExp = document.getElementById('LOTEEXP-modal-close-button');
      if (buttonFecharModalTramiteExp) {
        buttonFecharModalTramiteExp.disabled = false;
      }

      const buttonTramiteExp = document.getElementById('tramiteExpPedido-post-button');
      if (buttonTramiteExp) {
        buttonTramiteExp.disabled = false;
      }

      const temSelecionado = this.staticPedidosPossiveisExpedicao
        .some(p => p.bSelecionado === true);
      const selectClienteTramiteExp = this.$refs.clienteSelectREFLOTEEXP;
      if (selectClienteTramiteExp && !temSelecionado) {
        selectClienteTramiteExp.habilitar();
      }

      const selectTransportadoraTramiteExp = this.$refs.transportadoraSelectREFLOTEEXP;
      if (selectTransportadoraTramiteExp && !temSelecionado) {
        selectTransportadoraTramiteExp.habilitar();
      }

      const inputPlacaVeiculoTramiteExp = document.getElementById('LOTEEXPinsert-placa-input');
      const labelInputPlacaVeiculoTramiteExp = document.getElementById('LOTEEXPinsert-placa-label');
      if (inputPlacaVeiculoTramiteExp && labelInputPlacaVeiculoTramiteExp && this.selectedTransportadoraLoteEXP) {
        inputPlacaVeiculoTramiteExp.disabled = false;
        labelInputPlacaVeiculoTramiteExp.classList.remove('BGC-input-disabled');
        labelInputPlacaVeiculoTramiteExp.classList.add('BGC-input-enabled');
      }

      const inputVeiculoTramiteExp = document.getElementById('LOTEEXPinsert-veiculo-input');
      const labelInputVeiculoTramiteExp = document.getElementById('LOTEEXPinsert-veiculo-label');
      if (inputVeiculoTramiteExp && labelInputVeiculoTramiteExp) {
        inputVeiculoTramiteExp.disabled = false;
        labelInputVeiculoTramiteExp.classList.remove('BGC-input-disabled');
        labelInputVeiculoTramiteExp.classList.add('BGC-input-enabled');
      }

      const inputRGMotoristaTramiteExp = document.getElementById('LOTEEXPinsert-rgmotorista-input');
      const labelInputRGMotoristaTramiteExp = document.getElementById('LOTEEXPinsert-rgmotorista-label');
      if (inputRGMotoristaTramiteExp && labelInputRGMotoristaTramiteExp) {
        inputRGMotoristaTramiteExp.disabled = false;
        labelInputRGMotoristaTramiteExp.classList.remove('BGC-input-disabled');
        labelInputRGMotoristaTramiteExp.classList.add('BGC-input-enabled');
      }

      const inputMotoristaTramiteExp = document.getElementById('LOTEEXPinsert-motorista-input');
      const labelInputMotoristaTramiteExp = document.getElementById('LOTEEXPinsert-motorista-label');
      if (inputMotoristaTramiteExp && labelInputMotoristaTramiteExp) {
        inputMotoristaTramiteExp.disabled = false;
        labelInputMotoristaTramiteExp.classList.remove('BGC-input-disabled');
        labelInputMotoristaTramiteExp.classList.add('BGC-input-enabled');
      }

    },

    getStylePorTipo(tramite) {
      // Se está anulado, aplica vermelho claro e encerra
      if (tramite.usuarioAnulante) {
        return { backgroundColor: '#ffe5e5' }; // vermelho claro
      }

      // Se email não foi enviado, aplica amarelo claro e transparente
      if (tramite.bEmailEnviado == false) {
        return { backgroundColor: 'rgba(255, 255, 150, 0.4)' }; // amarelo clarinho transparente
      }

      // Caso contrário, sem estilo
      return {};
    },
    enableFDisableTVeiculoLOTEEXPInput(bool) {
      const veiculoInput = document.getElementById('LOTEEXPveiculo-input');
      const veiculoLabel = document.getElementById('LOTEEXPveiculo-label');
      if(veiculoInput && veiculoLabel) {
        if (bool) {
          veiculoInput.disabled = bool;
          veiculoLabel.classList.remove('BGC-branco');
          veiculoLabel.classList.add('BGC-input-disabled');
        } else {
          veiculoInput.disabled = bool;
          veiculoLabel.classList.add('BGC-branco');
          veiculoLabel.classList.remove('BGC-input-disabled');
        }
      }

    },
    enableFDisableTRGMotoristaLOTEEXPInput(bool) {
      const rgMotoristaInput = document.getElementById('LOTEEXPrgmotorista-input');
      const rgMotoristaLabel = document.getElementById('LOTEEXPrgmotorista-label');
      if(rgMotoristaInput && rgMotoristaLabel) {
        if (bool) {
          rgMotoristaInput.disabled = bool;
          rgMotoristaLabel.classList.remove('BGC-branco');
          rgMotoristaLabel.classList.add('BGC-input-disabled');
        } else {
          rgMotoristaInput.disabled = bool;
          rgMotoristaLabel.classList.add('BGC-branco');
          rgMotoristaLabel.classList.remove('BGC-input-disabled');
        }
      }
    },
    enableFDisableTNomeMotoristaLOTEEXPInput(bool) {
      const nomeMotoristaInput = document.getElementById('LOTEEXPmotorista-input');
      const nomeMotoristaLabel = document.getElementById('LOTEEXPmotorista-label');
      if (nomeMotoristaInput && nomeMotoristaLabel) {
        if (bool) {
          nomeMotoristaInput.disabled = bool;
          nomeMotoristaLabel.classList.remove('BGC-branco');
          nomeMotoristaLabel.classList.add('BGC-input-disabled');
        } else {
          nomeMotoristaInput.disabled = bool;
          nomeMotoristaLabel.classList.add('BGC-branco');
          nomeMotoristaLabel.classList.remove('BGC-input-disabled');
        }
      }
    },
    focaInputRgMotoristaLOTEEXP() {
      const input = document.getElementById("LOTEEXPrgmotorista-input");
      if (input) {
        input.focus();
      }
    },
    focaInputVeiculoLOTEEXP () {
      const input = document.getElementById("LOTEEXPveiculo-input");
      if (input) {
        input.focus();
      }
    },
    focaInputNomeMotoristaLOTEEXP () {
      const input = document.getElementById("LOTEEXPmotorista-input");
      if (input) {
        input.focus();
      }
    },
    conferePlacaValidaLOTEEXP() {
      // Remove tudo que não for letra ou número
      const placa = this.tramiteLoteExpRequestDTO.placaVeiculo.replace(/[^A-Z0-9]/gi, '').toUpperCase();

      // Regex para os dois formatos válidos
      const formatoAntigo = /^[A-Z]{3}[0-9]{4}$/;
      const formatoMercosul = /^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/;

      const placaValida = formatoAntigo.test(placa) || formatoMercosul.test(placa);

      if (!placaValida) {
        console.warn('Placa inválida:', placa);
        // Aqui você pode exibir um erro ou limpar o campo, se quiser:
        // this.postTramite.placaVeiculo = ''
      }

      return placaValida;
    },
    async clickCrossExcluirTramite(tramite) {
      const idTramite = tramite.iD_Tramite;
      const idUsuario = tramite.idUsuarioResponsavel;

      if(!tramite?.bEmailEnviado) {
        ToastWarning(`Esse trâmite está em andamento.\nResponsável: ${tramite.cNomeResponsavel}`);
        return;
      }

      // Se ja foi direcionado, tambem nao pode anular:
      if (tramite.emEstoque === 'SIM') {
        ToastWarning('Esse Trâmite NÃO pode ser anulado, pois já foi DIRECIONADO.');
      // Se não foi voce que fez esse tramite:
      } else if (this.userID != idUsuario) {
        // Avisa quem fez e que só pode anular quem fez:
        ToastWarning(`Um Trâmite só pode ser anulado por seu responsável.\nResponsável: ${tramite.cNomeResponsavel}`);
      } else {
        const modalEl = document.getElementById('TramitePaiAnularModal');
  
        if (!this.anularModalInstance) {
          this.anularModalInstance = new bootstrap.Modal(modalEl);
        }
  
        this.anularModalInstance.show(); // Show the modal
        this.tramiteSelecionado = idTramite; // Store the selected tramite ID
      }
    },
    async clickConfirmarAnularTramite(idTramite) {
      const anulou = await this.anulaTramiteReq(idTramite, this.motivoAnulaTramite);
      if(anulou) {
        await this.getTramitesPai(); // Atualiza a tabela de trâmites após o POST
        // E-mail de anulação: lista padrão + e-mail do cadastro do usuário externo (a API soma pelo token)
        await this.enviaEmailAnulaTramiteReq(idTramite)
      }
    },

    async mudarEstadoLixeira(flag) {
      this.$nextTick(() => {
        const buttons = document.querySelectorAll('.buttonTableTramiteItem');

        buttons.forEach(button => {
          button.disabled = !flag;
        });
      });
    },
    mudarEstadoBotaoFechar(flag) {
      const botaoFechar = document.getElementById('update-modal-close-button');
      botaoFechar.disabled = !flag;
    },
    mudarEstadoBotaoNovoItem(flag) {
      const botaoNovoItem = document.getElementById('insert-modal-novo-tramitefilho-button');
      if (botaoNovoItem) {
        botaoNovoItem.disabled = !flag;
      } else {
        return;
      }
    },
    mudarEstadoBotaoSalvar(flag){
      const botaoNovoItem = document.getElementById('salva-novo-tramite-button');
      if(botaoNovoItem) {
        botaoNovoItem.disabled = !flag;
      }
    },
    mudarEstadoBotaoVisualizarPDF(flag) {
      const botao = document.getElementById('baixar-pdf-button');
      if(botao) {
        botao.disabled = !flag;
      }
    },
    mudarEstadoBotaoFechaModal(flag) {
      const botao = document.getElementById('update-modal-close-button');
      if(botao) {
        botao.disabled = !flag;
      }
    },
    mudarEstadoBotaoEnviaParaMim(flag) {
      const botao = document.getElementById('email-para-mim-button');
      if(botao) {
        botao.disabled = !flag;
      }
    },
    mudarEstadoAdcs(flag){
      const adcInput = document.getElementById('adicionais-input');
      const adcLabel = document.getElementById('adicionais-label');

      adcInput.disabled = !flag;

      // SE EU RECEBER UM TRUE, EU QUERO LIBERAR O CAMPO ENTÃO EU RETIRO O DISABLED
      if(flag){

        adcLabel.classList.remove('BGC-input-disabled');
        adcLabel.classList.add('BGC-input-enabled');

      }
      // SE EU RECEBER UM FALSE, EU QUERO BLOQUEAR O CAMPO ENTÃO EU APLICO O DISABLED
      else {

        adcLabel.classList.remove('BGC-input-enabled');
        adcLabel.classList.add('BGC-input-disabled');

      }
    },
    async clickSalvarEditarTramite() {
      this.editandoTramite = false; // Desabilita o modo de edição

      this.editandoTramiteDTO.inconformidade = this.editandoTramiteDTO.inconformidade.toUpperCase();
      this.editandoTramiteDTO.cAdicionais = this.editandoTramiteDTO.cAdicionais.toUpperCase();

      await this.reqEditarTramite(this.infosTramite.iD_Tramite, this.editandoTramiteDTO);

      await this.getInfoDeUmTramitePai(this.tramiteSelecionado.iD_Tramite);

      // HABILITA OS BOTÕES DE LIXEIRA
      await this.mudarEstadoLixeira(true);
      this.mudarEstadoBotaoFechar(true);
      this.mudarEstadoBotaoNovoItem(true);

      this.mudarEstadoAdcs(false);

    },
    async reqEditarTramite(idTramite, { inconformidade, cAdicionais }) {

      try {
        const response = await axios.put(`${this.urlEstoque}/tramite/update-inc-e-obs`,
          {
            idTramite: idTramite,
            inconformidade: inconformidade,
            cAdicionais: cAdicionais
          },
          {	headers: { Authorization: `Bearer ${this.token}` } }
        );

        ToastSuccess('Trâmite editado com sucesso!');
      } catch (error) {
        if (error.response) {
          console.error('Erro ao editar tramite:', error.response.data);
        } else {
          console.error('Erro inesperado:', error.message);
        }
        ToastError('Erro ao editar o trâmite.');
      }
    },
    async clickCancelarEditarTramite() {
      this.editandoTramite = false; // Desabilita o modo de edição
      this.editandoTramiteDTO.inconformidade = this.infosTramite.cInconformidade;
      this.editandoTramiteDTO.cAdicionais = this.infosTramite.cAdicionais;
      
      // HABILITA OS BOTÕES DE LIXEIRA
      this.mudarEstadoBotaoFechar(true);
      this.mudarEstadoBotaoNovoItem(true);
      await this.mudarEstadoLixeira(true);
      this.mudarEstadoAdcs(false);
    },
    async onBlurPlacaVeiculoLoteEXP() {
      if (this.tramiteLoteExpRequestDTO?.placaVeiculo) {
        // ELE CONFERE SE O QUE FOI DIGITADO TEM ALGUMA CORRESPONDENCIA QUE COMECE IGUAL
        const normalize = (text) => text.replace(/[-.\s]/g, '').toUpperCase();
        const filtro = normalize(this.tramiteLoteExpRequestDTO.placaVeiculo);
        const sugestao = this.infoTodasPlacas.find(placa =>
          normalize(placa).includes(filtro)
        );


        // SE TIVER ALGUMA CORRESPONDENCIA ELE ATRIBUI E BLOQUEIA O CAMPO:
        if (sugestao) {
          this.tramiteLoteExpRequestDTO.placaVeiculo = sugestao;
          document.getElementById("LOTEEXPveiculo-input").disabled = true;

            // bloqueio os campos de input:
            this.enableFDisableTVeiculoLOTEEXPInput(true);
            this.enableFDisableTRGMotoristaLOTEEXPInput(false);
            // this.enableFDisableTNomeMotoristaInput(false);

            // Da o fetch baseado na placa:
            await this.fetchPlacaExistente(this.tramiteLoteExpRequestDTO.placaVeiculo);
            this.tramiteLoteExpRequestDTO.veiculo = this.infoPlacasExistentes[0]?.cTipoVeiculo;
            
            this.focaInputRgMotoristaLOTEEXP();

            this.retiraRequiredSeExistir('LOTEEXPveiculo-label', 'LOTEEXPveiculo-input');
            this.retiraRequiredSeExistir('LOTEEXPinsert-placa-label', 'LOTEEXPinsert-placa-input');

        // SE NÃO TIVER ELE SÓ DÁ UM AVISO MAS SEGUE NORMAL
        } else {
          // ELE CONFERE SE A PLACA TEM O MINIMO DE CARACTERES POSSÍVEIS E SE É VÁLIDA
          if ( (this.tramiteLoteExpRequestDTO?.placaVeiculo.length < 7) || (!this.conferePlacaValidaLOTEEXP()) ) {
            ToastWarning('Formato de placa inválido')
            document.getElementById("LOTEEXPinsert-placa-input").focus();
            document.getElementById("LOTEEXPinsert-placa-input").classList.add('required-red-border');

            // bloqueio os campos de input:
            this.enableFDisableTVeiculoLOTEEXPInput(true);
            this.enableFDisableTRGMotoristaLOTEEXPInput(true);
            this.enableFDisableTNomeMotoristaLOTEEXPInput(true);

            return;
          } else {
            // Avisa o usuário:
            ToastWarning('Nenhum cadastro foi encontrado com essa PLACA.');
            
            // Libera os campos de input:
            this.enableFDisableTVeiculoLOTEEXPInput(false);
            this.enableFDisableTRGMotoristaLOTEEXPInput(false);
            // this.enableFDisableTNomeMotoristaInput(false);

            this.retiraRequiredSeExistir('LOTEEXPinsert-placa-label', 'LOTEEXPinsert-placa-input');
            this.retiraRequiredSeExistir('LOTEEXPveiculo-label', 'LOTEEXPveiculo-input');

            this.focaInputVeiculoLOTEEXP();
          }
        } 
      } else {
        // bloqueio os campos de input:
        this.enableFDisableTVeiculoLOTEEXPInput(true);
        this.enableFDisableTRGMotoristaLOTEEXPInput(true);
        this.enableFDisableTNomeMotoristaLOTEEXPInput(true);
      }
    },
    onKeyUpPlacaVeiculoLoteEXP() {
      let raw = this.tramiteLoteExpRequestDTO?.placaVeiculo || '';

      raw = raw.toUpperCase().replace(/[^A-Z0-9\-]/g, '');

      // Se traço já estiver na posição 4 (índice 3), mantemos ele
      const hasValidDash = raw.length >= 4 && raw[3] === '-';

      // Se tiver traço correto, removemos apenas os traços fora do lugar
      if (hasValidDash) {
        raw = raw.slice(0, 4) + raw.slice(4).replace(/-/g, '');
      } else {
        raw = raw.replace(/-/g, '');
      }

      let formatted = '';

      for (let i = 0; i < raw.length && formatted.length < 8; i++) {
        const char = raw[i];

        if (formatted.length < 3) {
          // Posições 1-3: apenas letras
          if (/[A-Z]/.test(char)) {
            formatted += char;
          }
        } else if (formatted.length === 3) {
          // Posição 4: sempre traço
          formatted += '-';
          if (char !== '-') i--; // Se o usuário já digitou o traço, não repete
        } else if (formatted.length === 4) {
          // Posição 5: apenas número
          if (/[0-9]/.test(char)) {
            formatted += char;
          }
        } else if (formatted.length === 5) {
          // Posição 6: letra ou número
          if (/[A-Z0-9]/.test(char)) {
            formatted += char;
          }
        } else if (formatted.length === 6 || formatted.length === 7) {
          // Posições 7-8: apenas números
          if (/[0-9]/.test(char)) {
            formatted += char;
          }
        }
      }

      this.tramiteLoteExpRequestDTO.placaVeiculo = formatted;

      if (!formatted.replace('-', '')) {
        this.enableFDisableTVeiculoLOTEEXPInput(true);
        this.enableFDisableTRGMotoristaLOTEEXPInput(true);
        this.enableFDisableTNomeMotoristaLOTEEXPInput(true);
        this.clearCamposMotoristaLOTEEXP();
      }
    },
    clearCamposMotoristaLOTEEXP () {
        this.tramiteLoteExpRequestDTO.rgMotorista = '';
        this.tramiteLoteExpRequestDTO.veiculo = '';
        this.tramiteLoteExpRequestDTO.motorista = '';
    },
    onKeyUpRGMotoristaLOTEEXPInput() {
      // Se não tiver valor:
      if (!this.tramiteLoteExpRequestDTO?.rgMotorista || this.tramiteLoteExpRequestDTO?.rgMotorista.length < 7) {
        // Bloqueia o campo de Nome do Motorista e zera seu valor:
        this.enableFDisableTNomeMotoristaLOTEEXPInput(true);
        this.tramiteLoteExpRequestDTO.motorista = '';

        this.retiraRequiredSeExistir('LOTEEXPrgmotorista-label', 'LOTEEXPrgmotorista-input');
      }
    },
    onBlurInputRGMotoristaLOTEEXP() {
      if (this.tramiteLoteExpRequestDTO?.rgMotorista) {
        // ELE CONFERE SE O QUE FOI DIGITADO TEM ALGUMA CORRESPONDENCIA QUE COMECE IGUAL
        const normalize = (text) => (text || '').replace(/[-.\s]/g, '').toUpperCase();
        const filtro = normalize(this.tramiteLoteExpRequestDTO.rgMotorista);

        const sugestao = this.todosRGs.find(rg => {
          const rgLimpo = normalize(rg.cRGMotorista);
          return rgLimpo.includes(filtro);
        });

        if (sugestao) {
          // Preenche o RG e o Nome do Motorista:
          this.tramiteLoteExpRequestDTO.rgMotorista = sugestao.cRGMotorista;
          this.tramiteLoteExpRequestDTO.motorista = sugestao.cNomeMotorista;

          this.enableFDisableTNomeMotoristaLOTEEXPInput(true);

          this.retiraRequiredSeExistir('LOTEEXPmotorista-label', 'LOTEEXPmotorista-input');
          this.retiraRequiredSeExistir('LOTEEXPrgmotorista-label', 'LOTEEXPrgmotorista-input');

        // SE NÃO TIVER
        } else {
          // ELE CONFERE SE O RG É VÁLIDO
          if (this.tramiteLoteExpRequestDTO?.rgMotorista.length < 7) {
            ToastWarning('Formato de RG inválido');
            document.getElementById("LOTEEXPrgmotorista-input").focus();
            document.getElementById("LOTEEXPrgmotorista-input").classList.add('required-red-border');

            return;
          } else {
            this.retiraRequiredSeExistir('LOTEEXPmotorista-label', 'LOTEEXPmotorista-input');
            this.retiraRequiredSeExistir('LOTEEXPveiculo-label', 'LOTEEXPveiculo-input');
            
            this.enableFDisableTNomeMotoristaLOTEEXPInput(false);

            this.focaInputNomeMotoristaLOTEEXP();
          }
        }
      }
    },
    async fetchPlacaExistente(placa) {
      this.infoPlacasExistentes = [];
      this.isLoadingInfoVeiculo = true;

      try {
        const dados = await GetGenerico(`${this.urlEstoque}/veiculo-motorista/${placa}`, {}, this.token);
        
        this.infoPlacasExistentes = dados.map(item => ({
          ...item,
          cRGMotoristaLimpo: item.cRGMotorista.replace(/\D/g, ''),
        }));

      } catch (error) {  
        console.error(error);
      } finally {
        this.isLoadingInfoVeiculo = false;
      }
    },
    async getRGs() {
      this.todosRGs = await GetGenerico(`${this.urlEstoque}/veiculo-motorista/rgs`, {}, this.token);
    },
    disableVeiculoInfoInputs() {
      const veiculoLabel = document.getElementById('veiculo-label');
      const veiculoInput = document.getElementById('veiculo-input');
      const MotoristaLabel = document.getElementById('motorista-label');
      const MotoristaInput = document.getElementById('motorista-input');
      const RGLabel = document.getElementById('rgmotorista-label');
      const RGInput = document.getElementById('rgmotorista-input');

      // Aplica os estilos:
      if (veiculoInput) {
        veiculoLabel.classList.remove('BGC-branco');
        veiculoLabel.classList.add('BGC-input-disabled');
        MotoristaLabel.classList.remove('BGC-branco');
        MotoristaLabel.classList.add('BGC-input-disabled');
        RGLabel.classList.remove('BGC-branco');
        RGLabel.classList.add('BGC-input-disabled');
        
        veiculoInput.disabled = true;
        MotoristaInput.disabled = true;
        RGInput.disabled = true;
      }
    },  
    onBlurSelectTransportadora() {
      this.tramiteEnvioCompletoDTO.iD_Transportadora = this.selectedTransportadora?.iD_Carteira;
    },
    onBlurSelectTransportadora() {
      this.tramiteEnvioCompletoDTO.iD_Transportadora = this.selectedTransportadora?.iD_Carteira;
    },
    onBlurSelectTransportadora() {
    },
    onBlurSelectRemetente() {
      this.tramiteEnvioCompletoDTO.iD_Remetente = this.selectedRemetente?.iD_Carteira;
    },
    onBlurSelectRemetente() {
      this.tramiteEnvioCompletoDTO.iD_Remetente = this.selectedRemetente?.iD_Carteira;
    },
    onBlurSelectRemetente() {
    },
    async replicaMounted() {
      this.pedidosPossiveisExpedicao = [];
      this.staticPedidosPossiveisExpedicao = [];
      await this.getTramitesPai();
      await this.getTodasPlacas();
      await this.getRGs();
      await this.getClientesApenasSLA();
    },

    // ============================== AQUI VAI OS MÉTODOS DO LOTE EXP =================================\
    async onChangeClienteLoteExpedicao() {
      // Limpa os filtros e variáveis: ---------\
      this.onClickLimparFiltros();
      this.transportadorasApenasSLA = [];
      this.pedidosPossiveisExpedicao = [];
      // this.pedidosExpedicaoSelecionados = [];
      this.selectedTransportadoraLoteEXP = null;
      // ---------------------------------------/

      // Atribui o valor ao DTO da requisição:
      this.tramiteLoteExpRequestDTO.iD_Cliente = this.selectedClienteLoteEXP?.iD_Carteira || null;

      // caso selecione um valor
      if(this.selectedClienteLoteEXP?.iD_Carteira) 
      {
        // Aqui deve iniciar a requisição de tela ocupada e iniciar o intervalo:
        const liberado = await this.IniciaContagemTelaOcupada(this.selectedClienteLoteEXP);
        if (!liberado) {
          this.selectedClienteLoteEXP = null;
          this.tramiteLoteExpRequestDTO.iD_Cliente = null;
          this.selectedCarteiraRequestTelaAtual = null;
          if (this.intervaloSessao) clearInterval(this.intervaloSessao);

        } else {
          this.tramiteLoteExpRequestDTO.cRemetDestCarga = this.selectedClienteLoteEXP.idCarteira_cNmFantasia_CPFCNPJ;
          this.tramiteLoteExpRequestDTO.iD_Remetente = this.selectedClienteLoteEXP.iD_Carteira;
          
          await this.getTransportadorasApenasSLA(this.selectedClienteLoteEXP.iD_Carteira);
          // Site: na expedição de pedido a única transportadora possível é a do usuário externo logado
          const idTransportadoraUsuario = useAuthStore().idTransportadora;
          this.transportadorasApenasSLA = (this.transportadorasApenasSLA || []).filter(t => t.iD_Carteira === idTransportadoraUsuario);
          this.$refs.transportadoraSelectREFLOTEEXP.habilitar();
          setTimeout(() => {
            this.$refs.transportadoraSelectREFLOTEEXP.focusInput();
          }, 250);
        }
      } 
      // caso limpe o valor
      else 
      {
        // Aqui deve encerrar a sessão de tela ocupada e zerar o intervalo.
        await this.EncerraContagemTelaOcupada();
        
        // DESABILITO OS CAMPOS
        this.$refs.transportadoraSelectREFLOTEEXP.desabilitar();
        this.mudarEstadoCamposFiltroLOTEEXP(false);
        await this.mudarEstadoCamposVeiculoMotoristaLOTEEXP(false);
        this.tramiteLoteExpRequestDTO.cRemetDestCarga = null;
        this.tramiteLoteExpRequestDTO.iD_Remetente = null;
        this.selectedCarteiraRequestTelaAtual = null;
        this.pedidosExpedicaoSelecionados = []
        this.pedidosPossiveisExpedicao = []
        this.staticPedidosPossiveisExpedicao = []

        // LIMPO OS CAMPOS DE FILTRO
        this.onClickLimparFiltros();
      
      }
    },
    async mudarEstadoCamposVeiculoMotoristaLOTEEXP(novoEstadoCampo) {

      // CAMPOS DO VEICULO/MOTORISTA
      const labelPlacaLOTEEXP = document.getElementById('LOTEEXPinsert-placa-label');
      const inputPlacaLOTEEXP = document.getElementById('LOTEEXPinsert-placa-input');

      const labelVeiculoLOTEEXP = document.getElementById('LOTEEXPveiculo-label');
      const inputVeiculoLOTEEXP = document.getElementById('LOTEEXPveiculo-input');
      
      const labelRGMotoristaLOTEEXP = document.getElementById('LOTEEXPrgmotorista-label');
      const inputRGMotoristaLOTEEXP = document.getElementById('LOTEEXPrgmotorista-input');
      
      const labelMotoristaLOTEEXP = document.getElementById('LOTEEXPmotorista-label');
      const inputMotoristaLOTEEXP = document.getElementById('LOTEEXPmotorista-input');

      if(novoEstadoCampo) 
      { // HABILITA OS CAMPOS
        if(labelPlacaLOTEEXP && inputPlacaLOTEEXP) {
          labelPlacaLOTEEXP.classList.add('BGC-input-enabled');
          labelPlacaLOTEEXP.classList.remove('BGC-input-disabled');
          inputPlacaLOTEEXP.disabled = false;
        }
        if(labelVeiculoLOTEEXP && inputVeiculoLOTEEXP) {
          labelVeiculoLOTEEXP.classList.add('BGC-input-enabled');
          labelVeiculoLOTEEXP.classList.remove('BGC-input-disabled');
          inputVeiculoLOTEEXP.disabled = false;
        }
        if(labelRGMotoristaLOTEEXP && inputRGMotoristaLOTEEXP) {
          labelRGMotoristaLOTEEXP.classList.add('BGC-input-enabled');
          labelRGMotoristaLOTEEXP.classList.remove('BGC-input-disabled');
          inputRGMotoristaLOTEEXP.disabled = false;
        }
        if(labelMotoristaLOTEEXP && inputMotoristaLOTEEXP) {
          labelMotoristaLOTEEXP.classList.add('BGC-input-enabled');
          labelMotoristaLOTEEXP.classList.remove('BGC-input-disabled');
          inputMotoristaLOTEEXP.disabled = false;
        }
      } 
      else 
      {
        // DESABILITA OS CAMPOS
        this.tramiteLoteExpRequestDTO.veiculo = null;
        this.tramiteLoteExpRequestDTO.placaVeiculo = null;
        this.tramiteLoteExpRequestDTO.rgMotorista = null;
        this.tramiteLoteExpRequestDTO.motorista = null;

        if(labelPlacaLOTEEXP && inputPlacaLOTEEXP) {
          labelPlacaLOTEEXP.classList.add('BGC-input-disabled');
          labelPlacaLOTEEXP.classList.remove('BGC-input-enabled');
          inputPlacaLOTEEXP.disabled = true;
        }
        if(labelVeiculoLOTEEXP && inputVeiculoLOTEEXP) {
          labelVeiculoLOTEEXP.classList.add('BGC-input-disabled');
          labelVeiculoLOTEEXP.classList.remove('BGC-input-enabled');
          inputVeiculoLOTEEXP.disabled = true;
        }
        if(labelRGMotoristaLOTEEXP && inputRGMotoristaLOTEEXP) {
          labelRGMotoristaLOTEEXP.classList.add('BGC-input-disabled');
          labelRGMotoristaLOTEEXP.classList.remove('BGC-input-enabled');
          inputRGMotoristaLOTEEXP.disabled = true;
        }
        if(labelMotoristaLOTEEXP && inputMotoristaLOTEEXP) {
          labelMotoristaLOTEEXP.classList.add('BGC-input-disabled');
          labelMotoristaLOTEEXP.classList.remove('BGC-input-enabled');
          inputMotoristaLOTEEXP.disabled = true;
        }
      }

    },
    async onChangeTransportadoraLoteExpedicao() {
      // Limpa os filtros:
      this.onClickLimparFiltros();

      // this.pedidosExpedicaoSelecionados = [];
      this.pedidosPossiveisExpedicao = []
      const labelLOTEEXP = document.getElementById('LOTEEXPinsert-placa-label')
      const inputLOTEEXP = document.getElementById('LOTEEXPinsert-placa-input')

      this.tramiteLoteExpRequestDTO.iD_Transportadora = this.selectedTransportadoraLoteEXP?.iD_Carteira || null;

      if(this.selectedTransportadoraLoteEXP?.iD_Carteira && this.selectedClienteLoteEXP?.iD_Carteira) 
      {
        await this.getPedidosPossiveisExpedicao();
        this.arrayIdQuantidade = await this.getQuantidadesItensSKU();

        // HABILITO OS FILTROS
        this.mudarEstadoCamposFiltroLOTEEXP(true);

        // HABILITO ESCOLHER A PLACA
        if(labelLOTEEXP && inputLOTEEXP) {
          labelLOTEEXP.classList.add('BGC-input-enabled');
          labelLOTEEXP.classList.remove('BGC-input-disabled');
          inputLOTEEXP.disabled = false;
        } 
      } 
      else {
        // DESABILITO OS CAMPOS
        this.mudarEstadoCamposFiltroLOTEEXP(false);
        
        // DESABILITO ESCOLHER A PLACA
        await this.mudarEstadoCamposVeiculoMotoristaLOTEEXP(false);

        this.pedidosExpedicaoSelecionados = []
        this.pedidosPossiveisExpedicao = []
        this.staticPedidosPossiveisExpedicao = []

        // LIMPO OS CAMPOS DE FILTRO
        this.onClickLimparFiltros();
      }
    },
    aplicarFiltrosSelect() {

      const guiaRemessa  = this.guiaRemessaSelecionadaFiltroLOTEEXP?.cNome.toLowerCase() || "";
      const pedido       = this.pedidoSelecionadoFiltroLOTEEXP?.cNome.toLowerCase() || "";
      const ov           = this.ovSelecionadoFiltroLOTEEXP?.cNome.toLowerCase() || "";
      const ck           = this.ckSelecionadoFiltroLOTEEXP?.cNome.toLowerCase() || "";
      const nfe          = this.nfeSelecionadoFiltroLOTEEXP?.cNome.toLowerCase() || "";
      const cep          = this.cepSelecionadoFIltroLOTEEXP?.cNome.toLowerCase() || "";
      const destinatario = this.destinatarioSelecionadoFiltroLOTEEXP?.cNome.toLowerCase() || "";
      const uf           = this.ufSelecionadoFiltroLOTEEXP?.cNome.toLowerCase() || "";

      this.pedidosPossiveisExpedicao = this.staticPedidosPossiveisExpedicao.filter(pedidoItem => {

        // -----------------------------
        //   FILTRO DOS SELECTS
        // -----------------------------
        const filtroSelects =
          (guiaRemessa  ? pedidoItem.guiaRemessa?.toLowerCase().includes(guiaRemessa) : true) &&
          (pedido       ? pedidoItem.numPedido?.toLowerCase().includes(pedido) : true) &&
          (ov           ? pedidoItem.ov?.toLowerCase().includes(ov) : true) &&
          (ck           ? pedidoItem.ck?.toLowerCase().includes(ck) : true) &&
          (nfe          ? pedidoItem.notaFiscal?.toLowerCase().includes(nfe) : true) &&
          (cep          ? pedidoItem.cep?.toLowerCase().includes(cep) : true) &&
          (destinatario ? pedidoItem.destinatario?.toLowerCase().includes(destinatario) : true) &&
          (uf           ? pedidoItem.uf?.toLowerCase().includes(uf) : true);

        // -----------------------------
        //   RETORNO FINAL
        // -----------------------------
        return filtroSelects;
      });
    },
    onClickLimparFiltros() {
      this.guiaRemessaSelecionadaFiltroLOTEEXP = null;
      this.pedidoSelecionadoFiltroLOTEEXP = null;
      this.ovSelecionadoFiltroLOTEEXP = null;
      this.ckSelecionadoFiltroLOTEEXP = null;
      this.nfeSelecionadoFiltroLOTEEXP = null;
      this.cepSelecionadoFIltroLOTEEXP = null;
      this.destinatarioSelecionadoFiltroLOTEEXP = null;
      this.ufSelecionadoFiltroLOTEEXP = null;

      this.aplicarFiltrosSelect();

      this.selectedUnidadeFiltro = null;
      this.selectedTipoFiltro = null;
      this.selectedClienteFiltro = null;
      this.selectedTransportadoraFiltro = null;
      this.selectedTramiteFiltro = null;
      this.selectedDirecionadoFiltro = null;
      this.selectedOSFiltro = null;
      this.selectedLoteFiltro = null;
      this.selectedCodProdFiltro = null;
      this.selectedNFProdFiltro = null;
      this.selectedDescProdFiltro = null;

      this.paginaAtual = 1;
      
      this.getTramitesPai();

    },


    async baixarPDFsNFExpedicao(idTramite) {
      try {
        const response = await axios.get(
          `${this.urlBase}/consultas-sla/download-zip-danfe/${idTramite}`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
            responseType: "blob"
          }
        );

        const blob = new Blob([response.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `DANFE_Tramite_${idTramite}.zip`;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

      } catch (error) {
        console.error("Erro ao baixar ZIP:", error);
        ToastError("ERRO AO BAIXAR DANFES.\nCONSULTE A TI.");
      }
    },
    async imprimirDANFEsExpedicao(idTramite) {
      try {
        const response = await axios.get(
          `${this.urlBase}/consultas-sla/download-pdf-tramite/${idTramite}`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
            responseType: "blob"
          }
        );

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        iframe.src = url;

        document.body.appendChild(iframe);

        iframe.onload = function () {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        };

      } catch (error) {
        console.error("Erro ao imprimir DANFEs:", error);
        ToastError("ERRO AO IMPRIMIR DANFES.\nCONSULTE A TI.");
      }
    },

    async imprimirRomaneioApenasExpedicao(idTramite) {
      try {
        const response = await axios.get(
          `${this.urlBase}/consultas-sla/download-pdf-tramite-romaneio/${idTramite}`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
            responseType: "blob"
          }
        );

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        iframe.src = url;

        document.body.appendChild(iframe);

        iframe.onload = function () {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        };

      } catch (error) {
        console.error("Erro ao imprimir romaneio:", error);
        ToastError("ERRO AO IMPRIMIR ROMANEIO.\nCONSULTE A TI.");
      }
    },


    // Contagem de ocupação da tela:
    async EncerraContagemTelaOcupada () {
      // aqui é mais tranquilo, só encerrar normal
      await encerrarSessaoTela(this.requestTela);

      // Da um stop do intervalo:
      if (this.intervaloSessao) clearInterval(this.intervaloSessao);
    },
    async IniciaContagemTelaOcupada(selectedCarteira) {
      this.requestTela.ID_Objeto = selectedCarteira.iD_Carteira;

      // Assim que clicou pra mudar, a primeira coisa antes de
      // iniciar a contagem é conferir se pode entrar:
      const resultado = await verificaAcessoTela(this.requestTela);
  
      // Tem outro usuário:
      if (!resultado.liberado) {
        // Pode exibir alerta opcional
        ToastWarning(`Tela ocupada por: ${resultado.usuarioOcupando || 'Outro usuário'}`);
        
        // Encerra qualquer sessão ativa desta pagina:
        if (this.selectedCarteiraRequestTelaAtual != null) {
          this.requestTela.ID_Objeto = this.selectedCarteiraRequestTelaAtual.iD_Carteira;
          
          await this.EncerraContagemTelaOcupada();
        }

        return resultado.liberado;
      }

      // Não tem outro usuário:
      // Antes de iniciar nova sessão, é importante conferir se o usuário estava em uma sessão de outro cliente e encerrar, se sim
      if (this.selectedCarteiraRequestTelaAtual != null && this.selectedCarteiraRequestTelaAtual?.iD_Carteira != selectedCarteira.iD_Carteira) {

        // encerrar sessão do antigo deste ID
        this.requestTela.ID_Objeto = this.selectedCarteiraRequestTelaAtual.iD_Carteira;
        await encerrarSessaoTela(this.requestTela);
      }

      this.selectedCarteiraRequestTelaAtual = selectedCarteira;
      this.requestTela.ID_Objeto = selectedCarteira .iD_Carteira;

      // Aqui sim, inicia a sessão
      await this.VerificaERegistraAtualizaAcessoTela(this.requestTela, (resultado) => {
        if (!resultado.liberado) {
          ToastWarning(`Tela ocupada por: ${resultado.usuarioOcupando || 'Outro usuário'}`);
          if (this.intervaloSessao) clearInterval(this.intervaloSessao);
          return resultado.liberado;
        }
      });

      return resultado.liberado;
    },

    async VerificaERegistraAtualizaAcessoTela(request, callback) {
      // Primeira chamada imediata
      const resultado = await RegistraAtualizaAcessoTela(request);
      if (callback) callback(resultado);

      // Limpa intervalo antigo, caso exista
      if (this.intervaloSessao) clearInterval(this.intervaloSessao);

      // Configura repetição a cada 60 segundos
      this.intervaloSessao = window.setInterval(async () => {
        const resultadoAtual = await RegistraAtualizaAcessoTela(request);
        if (callback) callback(resultadoAtual);
      }, 60000); // 60 segundos 60000

    },

    descricaoComponente(item) {
      return [
        item.cNomeComponente,
        item.cTipoOperacao,
        item.cInfoGenerica
      ]
        .filter(v => v && v.trim())
        .join(' | ')
    },
    
    async calcularRowsPerPage() {
      const container = this.$refs.tabelaTramitePrincipalContainer;
      if (!container) return;

      await this.$nextTick();

      // Double RAF: o primeiro frame garante o layout, o segundo garante o paint.
      // Necessário para que getBoundingClientRect() retorne valores corretos
      // mesmo em contêineres com altura percentual (HEIGHT-94, HEIGHT-85, etc.).
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      );

      const ROW_HEIGHT_BASE_PX = 30;

      // getBoundingClientRect().height sempre retorna o valor real renderizado,
      // ao contrário de clientHeight que pode retornar 0 em layouts com % antes do paint.
      const containerHeight = Math.floor(container.getBoundingClientRect().height);
      if (containerHeight <= 0) return; // contêiner ainda não renderizado

      const thead = container.querySelector('thead');
      if (!thead) return;

      const headerHeight = Math.ceil(thead.getBoundingClientRect().height);
      const available = Math.max(0, containerHeight - headerHeight);

      const count = Math.max(1, Math.floor(available / ROW_HEIGHT_BASE_PX));
      const finalRowHeight = available / count;

      this.rowsPerPage = count;
      this.numeroRegistrosPagina = count;
      this.rowHeightPx = finalRowHeight;
    },
	},


	async mounted() {
    await this.FetchUnidade();
    await this.calcularRowsPerPage();
		await this.getTramitesPai();
    await this.getTodasPlacas();
    await this.getRGs();
    await this.getClientesApenasSLA();

    await window.addEventListener('resize', this.definirAlturaSwiper);    
	},

  beforeDestroy() {
    window.removeEventListener('resize', this.definirAlturaSwiper);
  },

};
</script>

<template>

  <div class="modal fade" id="TramitePaiModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="TramitePaiModalLabel">
    <div class="modal-dialog modal-xl MIN-WIDTH-97">
      <div class="modal-content" id="modalTableClick">

        <!-- Cabeçalho MODAL -->
        <div>
          
          <div v-if="!confirmandoFecharModal" class="d-flex justify-content-between align-items-center border-bottom p-2 HEIGHT-6vh">
            <!-- Logo -->
            <img 
              src="/legado/images/Logo-E-azul-enhanced.png" 
              alt="Logo Grupo Embalarte" 
              class="WIDTH-2 HEIGHT-auto" 
              title="Grupo Embalarte">

            <!-- Título -->
            <h1 v-if="modoAbertura == 'ClickDiretoTabela' && !infosTramite.bLogReversa" class="modal-title fs-5 flex-grow-1 text-center" id="TramitePaiModalLabel">
              TRAMITE | {{ infosTramite.iD_Tramite }}
            </h1>
            <h1 v-if="modoAbertura == 'ClickDiretoTabela' && infosTramite.bLogReversa" class="modal-title fs-5 flex-grow-1 text-center" id="TramitePaiModalLabel">
              TRAMITE DE LOGÍSTICA REVERSA | {{ infosTramite.iD_Tramite }}
            </h1>

            <!-- Botão Fechar que pede confirmação -->
            <button
              title="Fechar (F4)" 
              id="update-modal-close-button" 
              type="button" 
              class="btn-close" 
              @click="clickCloseModal()"
            ></button>
          </div>

          <!-- Aviso de Perda de informações -->
          <div v-else
            class="">
            <div class="d-flex justify-content-between align-items-center border-bottom p-2 HEIGHT-6vh BGC-amarelo-claro">
              <button
                id="modal-confirmarFechar-button"
                class="btn btn-danger WIDTH-8 FSIZE-12px D-flex JC-center ALITEM-center"
                type="button"
                data-bs-dismiss="modal"
                @click="this.escolhaFecharModal(true)"
              >Sim</button>

              <div class="D-flex FWEIGHT-bold WIDTH-90 FSIZE-16px ALITEM-center JC-center"
              >Todas as informações serão perdidas. Realmente deseja fechar?</div>

              <button
                id="modal-cancelarFechar-button"
                class="btn btn-dark WIDTH-8 FSIZE-12px D-flex JC-center ALITEM-center"
                type="button"
                @click="escolhaFecharModal(false)"
              >Não</button>  
            </div>
          </div>
          
        </div>

        <!-- Corpo do Modal -->
        
        <!-- PDF -->
        <div v-if="this.isVisualizarPDF" class="D-flex JC-center ALITEM-center HEIGHT-83vh BOR-B-grey-2">
          <div v-show="this.isLoadingPDF" class="WIDTH-100 HEIGHT-100 BGC-cinza-10 PADDING-B5 MARGIN-0 D-flex JC-center ALITEM-center">
            <!-- <img src="/legado/images/gif-carregamento-horizontal.gif" alt="Carregando..." style="width: 100px; height: auto;"/> -->
            <img src="/legado/images/Embys-PDF.png" alt="Carregando..." class=""
              style="width: 300px; height: auto;"/>
          </div>
          <iframe v-show="!this.isLoadingPDF"
            id="update-modal-iframe"
            class="HEIGHT-100 WIDTH-100 PADDING-0 MARGIN-0 ANIMATION-OPA-0-1-125"
          ></iframe>
        </div>
        
        <!-- CORPO NORMAL -->
        <div v-if="!modoExibicaoImagem && !isVisualizarPDF" id="modal-corpo" class="PADDING-0 d-flex flex-column" :style="{ height: podeAdicionar ? '74vh' : '78vh' }">

          <!-- Primeira linha de informações INFOS + FOTO -->
          <div class="D-flex BGC-input-disabled">

            <!-- Esquerda: Informações ---------------------------------------------------------------\ -->
            <div class="WIDTH-70 pe-1 d-flex flex-column h-100 PADDING-L10" id="infosTramitePai">

              <!-- LINHA 1 -->
              <div class="D-flex">

                <!-- CRIAÇÃO TRAMITE -->
                <div class="WIDTH-14 MARGIN-R1P">
                  <label
                    id="datacriacao-label"
                    for="datacriacao-input"
                    class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >D. CRIAÇÃO</label>
                  <input
                    disabled
                    id="datacriacao-input"
                    type="text"
                    v-model="infosTramite.dDataTramite"
                    :title="infosTramite.dDataTramite"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

                <!-- DATA INICIO -->
                <div class="WIDTH-21 MARGIN-R1P">
                  <label
                  id="datainicio-label"
                  for="datainicio-input"
                  class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >INÍCIO</label>
                  <input v-if="modoAbertura == 'ClickDiretoTabela'"
                    disabled
                    id="datainicio-input"
                    :value="infosTramite.dHoraInicioTramite"
                    :title="infosTramite.dHoraInicioTramite"
                    type="text"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

                <!-- DATA FIM -->
                <div class="WIDTH-21 MARGIN-R1P">
                  <label
                  id="datafim-label"
                  for="datafim-input"
                  class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >FIM</label>
                  <input
                  disabled
                  id="datafim-input"
                  v-model="infosTramite.dHoraFimTramite"
                  :title="infosTramite.dHoraFimTramite"
                  type="text"
                  class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

                <!-- CLIENTE -->
                <div class="WIDTH-18 MARGIN-R1P">
                  <label
                  id="cliente-label"
                  for="cliente-input"
                  class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >CLIENTE</label>
                  <input
                  disabled
                  id="cliente-input"
                  type="text"
                  v-model="infosTramite.cNmFantasia"
                  :title="infosTramite.cNmFantasia"
                  class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

                <!-- OS -->
                <div class="WIDTH-7 MARGIN-R1P">
                  <label
                    id="os-label"
                    for="os-input"
                    class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >O.S.</label>
                  <input
                    disabled
                    id="os-input"
                    v-model="infosTramite.iOrdemServico"
                    :title="infosTramite.iOrdemServico"
                    type="number"
                    min="1"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

                <!-- TIPO -->
                <div class="WIDTH-12 MARGIN-R1P">
                  <label
                    id="tipo-label"
                    for="tipo-input"
                    class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >TIPO</label>
                  <input
                    disabled
                    id="tipo-input"
                    v-model="infosTramite.cTipoTramite"
                    :title="infosTramite.cTipoTramite"
                    type="text"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

                <!-- LANÇADO -->
                <div class="WIDTH-10 MARGIN-R1P">
                  <label
                  id="lancado-label"
                  for="lancado-input"
                  class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >LANÇADO</label>
                  <input
                  disabled
                  id="lancado-input"
                  v-model="infosTramite.cLancadoEstoque"
                  :title="infosTramite.cLancadoEstoque"
                  type="text"
                  class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE TEXTALI-center">
                </div>   

                <!-- NÃO ESTANDO EDITANDO --------------------- -->
                <!-- <div v-if="!editandoTramite" class="WIDTH-14">
                  <button class="btn btn-warning MARGIN-T10 WIDTH-80 FSIZE-12px" id="update-modal-edit-button" @click="clickLapisEditarTramite()"
                  >EDITAR</button>
                </div> -->
                
                <!-- EDITANDO --------------------------------- -->

                <div v-if="editandoTramite" class="WIDTH-14">
                  <button class="btn btn-danger MARGIN-T10 WIDTH-80 FSIZE-10px" id="update-modal-edit-button" @click="clickCancelarEditarTramite()"
                  >CANCELAR</button>
                </div>

              </div>

              <!-- LINHA 2 -->
              <div class="D-flex">

                <!-- RESPONSÁVEL -->
                <div class="WIDTH-12 MARGIN-R1P">
                  <label
                    id="responsavel-label"
                    for="responsavel-input"
                    class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >RESPONSÁVEL</label>
                  <input
                    disabled
                    id="responsavel-input"
                    type="text"
                    v-model="infosTramite.cNmUsuario"
                    :title="infosTramite.cNmUsuario"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

                <!-- TRANSPORTADORA -->
                <div class="WIDTH-20 MARGIN-R1P">
                  <label
                    id="transportadora-label"
                    for="transportadora-input"
                    class="form-label BGC-branco BORRAD-5 FSIZE-11px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >TRANSPORTADORA</label>
                  <input
                    disabled
                    id="transportadora-input"
                    type="text"
                    v-model="infosTramite.cRazaoSocial"
                    :title="infosTramite.cRazaoSocial"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

                <!-- VEÍCULO - duvida -->
                <div class="WIDTH-16 MARGIN-R1P">
                  <label
                    id="insert-veiculo-label"
                    for="insert-veiculo-input"
                    class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >VEÍCULO</label>
                  <input
                    id="insert-veiculo-input"
                    disabled
                    v-model="infosTramite.cTipoVeiculo"
                    :title="infosTramite.cTipoVeiculo"
                    type="text"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

                <!-- PLACA -->
                <div class="WIDTH-10 MARGIN-R1P">
                  <label
                    id="insert-placa-label"
                    for="insert-placa-input"
                    class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >PLACA</label>
                  <input
                    id="insert-placa-input"
                    disabled
                    v-model="infosTramite.cPlacaVeiculo"
                    :title="infosTramite.cPlacaVeiculo"
                    type="text"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

                <!-- MOTORISTA -->
                <div class="WIDTH-20 MARGIN-R1P">
                  <label
                    id="insert-motorista-label"
                    for="insert-motorista-input"
                    class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >MOTORISTA</label>
                  <input
                    id="insert-motorista-input"
                    disabled
                    v-model="infosTramite.cNomeMotorista"
                    :title="infosTramite.cNomeMotorista"
                    type="text"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

                <!-- RG - MOTORISTA -->
                <div class="" >
                  <label
                    id="insert-rg-motorista-label"
                    for="insert-rg-motorista-input"
                    class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >RG MOTORISTA</label>
                  <input
                    id="insert-rg-motorista-input"
                    disabled
                    v-model="infosTramite.cRGMotorista"
                    :title="infosTramite.cRGMotorista"
                    type="text"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

                <!-- EDITANDO --------------------------------- -->
                <div v-if="editandoTramite" class="WIDTH-12">
                  <button class="btn btn-success MARGIN-T10 WIDTH-80 FSIZE-10px" id="update-modal-edit-button" 
                  @click="clickSalvarEditarTramite()"
                  >SALVAR</button>
                </div>

              </div>

              <!-- LINHA 3 -->
              <div class="D-flex">

                <!-- CONFERENTE -->
                <div class="WIDTH-33 MARGIN-R1P">
                  <label
                    id="conferente-label"
                    for="conferente-input"
                    class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >CONFERENTE</label>
                  <input
                    disabled
                    id="conferente-input"
                    type="text"
                    v-model="infosTramite.cConferenteTramite"
                    :title="infosTramite.cConferenteTramite"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

                <!-- REMETENTE -->
                <div class="WIDTH-33 MARGIN-R1P">
                  <label
                    id="remetente-label"
                    for="remetente-input"
                    class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >REMETENTE</label>
                  <input
                    disabled
                    id="remetente-input"
                    type="text"
                    v-model="infosTramite.cRemetDestCarga"
                    :title="infosTramite.cRemetDestCarga"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

                <!-- ANULADO POR -->
                <div class="" style="width: 31%;">
                  <label
                    id="anulante-label"
                    for="anulante-input"
                    class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >ANULADOR</label>
                  <input
                    disabled
                    id="anulante-input"
                    type="text"
                    v-model="infosTramite.cUsuarioAnuladoPor"
                    :title="infosTramite.cUsuarioAnuladoPor"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

              </div>

            </div>

            <!-- Direita: Carrossel de fotos da carga -->
            <div v-if="modoAbertura == 'ClickDiretoTabela'" id="carrossel-div" class="WIDTH-30" :style="{ height: `${alturaInfosPx}px` }" style=""
            >
              <Swiper v-if="this.imagensTramite?.length > 0 && imagemComponente.length == 0"
              :modules="swiperModules"
              :navigation="true"
              :pagination="{ clickable: true }"
              class="my-swiper h-100"
              >
                <SwiperSlide v-for="(img, index) in imagensTramite" :key="index" class="">
                  <div class="img-wrapper-carga" @click="modoExibicaoImagem = !modoExibicaoImagem"> 
                    <img :src="img" class="img-carga" /> 
                  </div>
                </SwiperSlide>
              </Swiper>

              <Swiper v-if="imagemComponente.length > 0"
              :modules="swiperModules"
              :navigation="true"
              :pagination="{ clickable: true }"
              class="my-swiper h-100"
              >
                <SwiperSlide v-for="(img, index) in imagemComponente" :key="index" class="">
                  <div class="img-wrapper-carga" @click=""> 
                    <a href="#" @click.prevent="abrirImagemNovaAba(img)">
                      <img :src="img" class="img-carga" />
                    </a>
                  </div>
                </SwiperSlide>
              </Swiper>

              <div v-if="this.imagensTramite?.length == 0 && imagemComponente.length == 0" class="WIDTH-100 HEIGHT-100 PADDING-5">
                <span class="BGC-cinza-6 WIDTH-100 HEIGHT-100 JC-center ALITEM-center D-flex PADDING-5" >Imagem não disponível</span>
              </div>

            </div>
            <!-- -------------------------------------------------------------------------------------/ -->

          </div>

          <div v-if="modoAbertura == 'ClickDiretoTabela'" class="D-flex BGC-input-disabled" style="margin: 5px;" ref="tabelaContainer" :style="tableContainerItemTramiteStyle">

            <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5 table-fixed FSIZE-PADRAO-TABLE">
              <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                <tr>
                  <th class="TEXTALI-left CTTABLEELPIS WIDTH-10">
                    O.S.
                  </th>
                  <th class="TEXTALI-left CTTABLEELPIS WIDTH-10">
                    N° N.F.
                  </th>
                  <th class="TEXTALI-center CTTABLEELPIS WIDTH-10">
                    N° COMP.
                  </th>
                  <th class="TEXTALI-left CTTABLEELPIS WIDTH-28">
                    COMPONENTE
                  </th>
                  <th class="TEXTALI-center CTTABLEELPIS WIDTH-5">
                    QTD.
                  </th>
                  <th class="TEXTALI-left CTTABLEELPIS WIDTH-8">
                    ACOND.
                  </th>
                  <th class="TEXTALI-left CTTABLEELPIS WIDTH-14">
                    ADC.
                  </th>
                  <th class="TEXTALI-center CTTABLEELPIS WIDTH-10">
                    LOTE
                  </th>
                </tr>
              </thead>
              <LayoutTabelaCarregarEsqueleto :Linhas=20 :Colunas=6 v-if="!tabelaTRAMITEsCarregada" />

              <tbody v-if="this.tabelaTRAMITEsCarregada" class="BORRAD-5">
                <tr
                  v-for="(item, i) in this.itensTramite" :key="i"
                  class="BGC-H-cinza-8 HEIGHT-5px"
                  :class="this.applyTableStipedRows(i)"
                  :id="item.iD_Tramite_FILHO + ': ' + item.nomeTramite"
                  :value="item.iD_Tramite_FILHO"
                >
                  <td class="TEXTALI-left CTTABLEELPIS WIDTH-10" :title="item.iOs">
                    {{ item.iOs }}
                  </td>
                  <td class="TEXTALI-left CTTABLEELPIS WIDTH-10" :title="item.cNumNFE">
                    {{ item.cNumNFE }}
                  </td>
                  <td class="TEXTALI-center CTTABLEELPIS WIDTH-10" :title="item.cCodComponente">
                    {{ item.cCodComponente }}
                  </td>
                  <td v-if="!item.cTipoOperacao && item.cNomeComponente != 'ENTRADA GENÉRICA' " class="TEXTALI-left CTTABLEELPIS WIDTH-28" :title="item.cNomeComponente">
                    {{ item.cNomeComponente }}
                  </td>
                  <td v-else class="TEXTALI-left CTTABLEELPIS WIDTH-28" :title="`${item.cNomeComponente} | ${item.cTipoOperacao} | ${item.cInfoGenerica}` ">
                    {{ this.descricaoComponente(item) }}
                  </td>
                  <td class="TEXTALI-center CTTABLEELPIS WIDTH-5">
                    {{ item.iQtdeComponente }}
                  </td>
                  <td class="TEXTALI-left CTTABLEELPIS WIDTH-8">
                    {{ item.acondicionamento }}
                  </td>
                  <td class="TEXTALI-left CTTABLEELPIS WIDTH-15">
                    {{ item.cAdicionaisProduto }}
                  </td>
                  <td class="TEXTALI-center CTTABLEELPIS WIDTH-10">
                    {{ item.cLote || 'N/C' }}
                  </td>
                </tr>
              </tbody>

            </table>

          </div>

        </div>

        <!-- Corpo caso esteja mostrando imagens -->
        <div v-if="this.modoExibicaoImagem" style="display: flex; flex-direction: row; justify-content: space-between; padding: 2% 2% 2% 2%; height: 85vh;" id="modal-body">

          <!-- Metade do modal é foto da carga -->
          <div style="width: 49%; border: 5px solid #ccc; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 100%; padding: 20px; box-sizing: border-box;">

            <h3 style="margin-bottom: 50px; text-align: center; width: 100%;">FOTOS CARGA</h3>

            <Swiper
              v-if="this.imagensTramite?.length > 0"
              :modules="swiperModules"
              :navigation="true"
              :pagination="{ clickable: true }"
              class="my-swiper"
              style="flex: 1; display: flex; align-items: center; justify-content: center; width: 100%;"
            >
              <SwiperSlide v-for="(img, index) in imagensCarga" :key="index">
                <div class="img-wrapper-carga">
                  <a href="#" @click.prevent="abrirImagemNovaAba(img)">
                    <img :src="img" class="img-carga" />
                  </a>
                </div>
              </SwiperSlide>
            </Swiper>
            <div v-else class="WIDTH-100 HEIGHT-100 PADDING-5">
              <span class="BGC-cinza-6 WIDTH-100 HEIGHT-100 JC-center ALITEM-center D-flex PADDING-5" >Imagem não disponível</span>
            </div>

          </div>  
          
          <!-- Outra metade do modal é foto da assinatura -->
          <div style="width: 49%; border: 5px solid #ccc; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 100%; padding: 20px; box-sizing: border-box;">

            <h3 style="margin-bottom: 15px; text-align: center; width: 100%;">ASSINATURA</h3>

            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">

              <!-- VEÍCULO -->
              <div class="WIDTH-20 MARGIN-R1P">
                <label
                id="insert-veiculo-label"
                for="insert-veiculo-input"
                class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                >VEÍCULO</label>
                <input
                id="insert-veiculo-input"
                disabled
                v-model="infosTramite.cTipoVeiculo"
                type="text"
                class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
              </div>
              
              <!-- PLACA -->
              <div class="WIDTH-15 MARGIN-R1P">
                <label
                for="insert-placa-input"
                class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                >PLACA</label>
                <input
                disabled
                v-model="infosTramite.cPlacaVeiculo"
                type="text"
                class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
              </div>
              
              <!-- MOTORISTA -->
              <div class="WIDTH-25 MARGIN-R1P">
                <label
                for="insert-motorista-input"
                class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                >MOTORISTA</label>
                <input
                id="insert-motorista-input"
                disabled
                v-model="infosTramite.cNomeMotorista"
                type="text"
                class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
              </div>
              
              <!-- RG - MOTORISTA -->
              <div class="" >
                <label
                for="insert-rg-motorista-input"
                class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                >RG MOTORISTA</label>
                <input
                disabled
                v-model="infosTramite.cRGMotorista"
                type="text"
                class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
              </div>
              
            </div>

            <!-- GPT PURO -->
            <Swiper
            v-if="this.imagensTramite?.length > 0"
            :modules="swiperModules"
            :navigation="true"
            :pagination="{ clickable: true }"
            class="my-swiper"
            style="flex: 1; width: 100%; height: 100%;"
            >
              <SwiperSlide
              v-for="(img, index) in imagensAssinatura"
              :key="index"
              style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;"
              >
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa;">
                  <a href="#" @click.prevent="abrirImagemNovaAba(img)" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                    <img
                      :src="img"
                      style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;"
                    />
                  </a>
                </div>
              </SwiperSlide>
            </Swiper>

            <div v-else class="WIDTH-100 HEIGHT-100 PADDING-5">
              <span class="BGC-cinza-6 WIDTH-100 HEIGHT-100 JC-center ALITEM-center D-flex PADDING-5" >Imagem não disponível</span>
            </div>

          </div>

        </div>
        
        <!-- Rodapé do Modal -->
        <div v-if="!modoExibicaoImagem && !isVisualizarPDF"
          id="modal-footer"
          class="p-2 d-flex justify-content-between align-items-end flex-wrap"
          style="height: auto;"
        >
          <!-- BOTÕES À ESQUERDA -->
          <div class="d-flex align-items-center flex-wrap gap-2">

            <button v-if="!(tramiteSelecionado?.cURLImagemAssinatura_EXP) && infosTramite.cTipoTramite == 'EXPEDIÇÃO'"
              id="tramiteExpPedido-post-button"
              class="btn FSIZE-12px "
              @click="clickButtonSalvarTramiteExpedicao()"
              title="SALVAR TRAMITE"
              style="background-color: black; color: yellow; border: none;"
              :disabled="postandoTramite"
              >
              {{ textoBotaoExpedir }}
            </button>

            <!-- Botão VISUALIZAR PDF -->
            <button
              v-if="modoAbertura === 'ClickDiretoTabela' && !isVisualizarPDF"
              type="button"
              id="baixar-pdf-button"
              class="btn btn-warning FSIZE-11px"
              @click="OnClickVisualizarPDFVisualizarModal('tramite')"
            >
              <IconsPDF corProp="black" alturaProp="1.25" larguraProp="1.25"/>
              &nbsp;VISUALIZAR PDF
            </button>

            <!-- Botão ENVIAR EMAIL PARA MIM -->
            <button
              v-if="modoAbertura === 'ClickDiretoTabela' && infosTramite.bEmailEnviado && infosTramite.cTipoTramite == 'EXPEDIÇÃO' "
              type="button"
              id="pdf-romaneio-button"
              class="btn btn-dark FSIZE-11px"
              :disabled="(!itensTramite?.length > 0 || editandoTramite) && !podeApertarBotaoEnviaParaMim"
              @click="OnClickVisualizarPDFVisualizarModal('romaneio')"
            >
              <IconsPDF corProp="white" alturaProp="1.25" larguraProp="1.25"/>&nbsp;PDF ROMANEIO
            </button>

            <!-- Botão ENVIAR EMAIL PARA MIM (vai para o e-mail do cadastro do usuário externo) -->
            <button
              v-if="modoAbertura === 'ClickDiretoTabela' && infosTramite.bEmailEnviado"
              type="button"
              id="email-para-mim-button"
              class="btn btn-primary FSIZE-11px"
              :disabled="(!itensTramite?.length > 0 || editandoTramite) && !podeApertarBotaoEnviaParaMim"
              @click="clickButtonReenviaEmail(1, emailUsuario)"
            >
              ENVIAR E-MAIL PARA MIM
            </button>

          </div>

          <!-- CAMPO OBS GERAIS + BOTÃO SALVAR à direita -->
          <div
            v-if="modoAbertura === 'ClickDiretoTabela' && !podeAdicionar"
            class="d-flex align-items-end gap-2"
            style="width: 45%;"
          >
            <!-- OBS. GERAIS -->
            <div class="flex-grow-1">
              <label
                for="adicionais-input"
                class="form-label BGC-branco BORRAD-5 FSIZE-10px FWEIGHT-bold PADDING-R5-L5 BGC-input-disabled"
              >
                OBS. GERAIS
              </label>
              <input
                disabled
                id="adicionais-input"
                type="text"
                v-model="editandoTramiteDTO.cAdicionais"
                :title="editandoTramiteDTO.cAdicionais"
                class="form-control BOR-grey HEIGHT-55 MARGIN-T-10 FSIZE-10px InputUPPERCASE"
              >
            </div>
          </div>

        </div>

        <!-- Rodape do Modal sem nada -->
        <!-- <div v-else class="p-2" style="display: flex; flex-direction: row; height: 5vh;" id="modal-footer"></div>  -->

      </div>
    </div>
  </div>

  <div class="modal fade" id="TramiteLoteExpModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="TramiteLoteExpModalLabel">
    <div class="modal-dialog modal-xl MIN-WIDTH-97">
      <div class="modal-content d-flex flex-column" id="modalTableClick">

        <!-- CABEÇALHO -->
        <div class="HEIGHT-6vh flex-shrink-0">
          
          <div v-if="!confirmandoFecharModal" class="d-flex justify-content-between align-items-center border-bottom p-2">
            <!-- Logo -->
            <img 
              src="/legado/images/Logo-E-azul-enhanced.png" 
              alt="Logo Grupo Embalarte" 
              class="WIDTH-2 HEIGHT-auto" 
              title="Grupo Embalarte">

            <!-- Título -->
            <h1 class="modal-title fs-5 flex-grow-1 text-center">
              TRAMITE DE EXPEDIÇÃO • {{ idTramiteAguardandoAssinatura }}
            </h1>

            <!-- Botão Fechar que pede confirmação -->
            <button v-if="!modoEsperaAssinatura || tipoModalAberto == 'ClickDiretoTabela'"
              title="Fechar (F4)" 
              id="LOTEEXP-modal-close-button" 
              type="button" 
              class="btn-close" 
              @click="clickCloseModalTramiteExpLote()"
            ></button>
          </div>

          <!-- Aviso de Perda de informações -->
          <div v-else
            class="">
            <div class="d-flex justify-content-between align-items-center border-bottom p-2 HEIGHT-6vh BGC-amarelo-claro">
              <button
                id="LOTEEXP-modal-confirmarFechar-button"
                class="btn btn-danger WIDTH-8 FSIZE-12px D-flex JC-center ALITEM-center"
                type="button"
                data-bs-dismiss="modal"
                @click="this.escolhaFecharModal(true)"
              >Sim</button>

              <div class="D-flex FWEIGHT-bold WIDTH-90 FSIZE-16px ALITEM-center JC-center">Todas as informações serão perdidas. Realmente deseja fechar?</div>

              <button
                id="LOTEEXPmodal-cancelarFechar-button"
                class="btn btn-dark WIDTH-8 FSIZE-12px D-flex JC-center ALITEM-center"
                type="button"
                @click="escolhaFecharModal(false)"
              >Não</button>  
            </div>
          </div>
          
        </div>

        <!-- CORPO -->
        <div id="LOTEEXP-modal-corpo" class="d-flex flex-column HEIGHT-79vh flex-shrink-0 PADDING-T3p-2p mb-1">
      
          <div v-if="!modoEsperaAssinatura" class="D-flex FD-column HEIGHT-100 WIDTH-98 MARGIN-L1P BORRAD-5 BGC-branco">

            <!-- Filtros -->
            <div class="D-flex JC-space-between WIDTH-100 mb-1">

              <div class="D-flex WIDTH-100 JC-space-between">

                <!-- CLIENTE E TRANSPORTADORA -->
                <div class="WIDTH-34 D-flex FD-column">
                  <!-- CLIENTE -->
                  <BasicElementVue3SelectPequeno
                    ref="clienteSelectREFLOTEEXP"
                    :options="clientesApenasSLA"
                    optionLabel="idCarteira_cNmFantasia_CPFCNPJ"
                    v-model="selectedClienteLoteEXP"
                    @update:modelValue="onChangeClienteLoteExpedicao"
                    label="CLIENTE/REMETENTE:"
                    :titulo="selectedClienteLoteEXP?.idCarteira_cNmFantasia_CPFCNPJ"
                    :divClass="'WIDTH-70 col-1 MARGIN-T21-R5'"
                    :selectClass="''"
                    :labelClass="'FSIZE-10px red-asterisk MARGIN-T-15'"
                  />

                  <!-- TRANSPORTADORA -->
                  <BasicElementVue3SelectPequeno
                    ref="transportadoraSelectREFLOTEEXP"

                    :options="transportadorasApenasSLA"
                    optionLabel="idCarteira_cNmFantasia_CPFCNPJ"
                    v-model="selectedTransportadoraLoteEXP"
                    
                    @update:modelValue="onChangeTransportadoraLoteExpedicao"

                    label="TRANSPORTADORA:"
                    :titulo="selectedTransportadoraLoteEXP?.idCarteira_cNmFantasia_CPFCNPJ"

                    :divClass="'WIDTH-70 col-1 MARGIN-T21-R5'"
                    :selectClass="''"
                    :labelClass="'FSIZE-10px red-asterisk MARGIN-T-15'"
                  />
                </div>

                <!-- Decoração FILTROS -->
                <div class="WIDTH-6 BGC-azul-esverdeado COLOR-white ALITEM-center BORRAD-5 FWEIGHT-bold D-flex FD-column JC-space-between">
                  <p>Filtros</p>
                  <button type="button" class="btn btn-dark WIDTH-75 FSIZE-12px mb-1" @click="onClickLimparFiltros">Limpar</button>
                </div>

                <div class="D-flex WIDTH-15 FD-column PADDING-T0-R5-B5-L10">
                  
                  <!-- GUIA REMESSA -->
                  <BasicElementVue3SelectPequeno
                    ref="guiaRemessaSelectREFLOTEEXP"
                    :options="guiasRemessasFiltroLOTEEXP"
                    option-label="cNome"
                    v-model="guiaRemessaSelecionadaFiltroLOTEEXP"
                    
                    @update:modelValue="aplicarFiltrosSelect"
                    
                    label="GUIA REMESSA:"
                    :titulo="guiaRemessaSelecionadaFiltroLOTEEXP?.cNome"
                    
                    :divClass="'MARGIN-T21 WIDTH-100'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px red-asterisk MARGIN-T-15'"
                  />

                  <!-- NÚMERO PEDIDO -->
                  <BasicElementVue3SelectPequeno
                    ref="pedidoSelectREFLOTEEXP"
                    :options="pedidosFiltroLOTEEXP"
                    option-label="cNome"
                    v-model="pedidoSelecionadoFiltroLOTEEXP"
                    
                    @update:modelValue="aplicarFiltrosSelect"
                    
                    label="PEDIDO:"
                    :titulo="pedidoSelecionadoFiltroLOTEEXP?.cNome"

                    :divClass="'MARGIN-T21 WIDTH-100'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px red-asterisk MARGIN-T-15'"
                  />

                </div>

                <div class="D-flex WIDTH-15 FD-column PADDING-T0-R5-B5-L10 BOR-L-solidgrey-1">
                
                  <!-- OV O.V. -->
                  <BasicElementVue3SelectPequeno
                    ref="ovSelectREFLOTEEXP"
                    :options="ovsFiltroLOTEEXP"
                    option-label="cNome"
                    v-model="ovSelecionadoFiltroLOTEEXP"

                    @update:modelValue="aplicarFiltrosSelect"
                    
                    label="O.V.:"
                    :titulo="ovSelecionadoFiltroLOTEEXP?.cNome"
                    
                    :divClass="'MARGIN-T21 WIDTH-100'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px red-asterisk MARGIN-T-15'"
                    
                  />
                  
                  <!-- CK -->
                  <BasicElementVue3SelectPequeno
                    ref="ckSelectREFLOTEEXP"
                    :options="cksFiltroLOTEEXP"
                    option-label="cNome"
                    v-model="ckSelecionadoFiltroLOTEEXP"

                    @update:modelValue="aplicarFiltrosSelect"

                    label="CK:"
                    :titulo="ckSelecionadoFiltroLOTEEXP?.cNome"

                    :divClass="'MARGIN-T21 WIDTH-100'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px red-asterisk MARGIN-T-15'"
                  /> 
                  
                </div>

                <div class="D-flex WIDTH-15 FD-column PADDING-T0-R5-B5-L10 BOR-L-solidgrey-1">
                
                  <!-- NFe -->
                  <BasicElementVue3SelectPequeno
                    ref="nfeSelectREFLOTEEXP"
                    :options="nfesFiltroLOTEEXP"
                    option-label="cNome"
                    v-model="nfeSelecionadoFiltroLOTEEXP"

                    @update:modelValue="aplicarFiltrosSelect"

                    label="NFe:"
                    :titulo="nfeSelecionadoFiltroLOTEEXP?.cNome"
  
                    :divClass="'MARGIN-T21 WIDTH-100'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px red-asterisk MARGIN-T-15'"
                    :widthLista="''"
                    
                  />
                  
                  <!-- CEP -->
                  <BasicElementVue3SelectPequeno
                    ref="cepSelectREFLOTEEXP"
                    :options="cepsFiltroLOTEEXP"
                    option-label="cNome"
                    v-model="cepSelecionadoFIltroLOTEEXP"

                    @update:modelValue="aplicarFiltrosSelect"

                    label="CEP:"
                    :titulo="cepSelecionadoFIltroLOTEEXP?.cNome"

                    :divClass="'MARGIN-T21 WIDTH-100'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px red-asterisk MARGIN-T-15'"
                  /> 
                  
                </div>

                <div class="D-flex WIDTH-15 FD-column PADDING-T0-R0-B5-L10 BOR-L-solidgrey-1">
                
                  <!-- DESTINATÁRIO -->
                  <BasicElementVue3SelectPequeno
                    ref="destinatarioSelectREFLOTEEXP"
                    :options="destinatariosFiltroLOTEEXP"
                    option-label="cNome"
                    v-model="destinatarioSelecionadoFiltroLOTEEXP"
                    
                    @update:modelValue="aplicarFiltrosSelect"
                    
                    label="DESTINATÁRIO:"
                    :titulo="destinatarioSelecionadoFiltroLOTEEXP?.cNome"

                    :divClass="'MARGIN-T21 WIDTH-100'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px red-asterisk MARGIN-T-15'"
                    
                  />
                  
                  <!-- UF -->
                  <BasicElementVue3SelectPequeno
                    ref="ufSelectREFLOTEEXP"
                    :options="ufsFiltroLOTEEXP"
                    option-label="cNome"
                    v-model="ufSelecionadoFiltroLOTEEXP"

                    @update:modelValue="aplicarFiltrosSelect"

                    label="UF:"
                    :titulo="ufSelecionadoFiltroLOTEEXP?.cNome"

                    :divClass="'MARGIN-T21 WIDTH-100'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px red-asterisk MARGIN-T-15'"
                  /> 
                  
                </div>

              </div>
              
            </div>

            <!-- PARTE DO CONTEÚDO DO TRAMITE -->           
            <div class=" d-flex flex-column flex-grow-1 overflow-hidden PADDING-5 CARD-Afundado-Subtil BGC-cinza-9">

              <!-- PARTE DO CABEÇALHO DO TRAMITE -->
              <div class="w-100 D-flex FD-column ALITEM-flex-start JC-center bgc-input-branco MARGIN-B5" id="infosTramitePaiLOTEEXP">

                <!-- LINHA 1 -->
                <div class="D-flex WIDTH-100 JC-space-between ALITEM-center">

                  <!-- DATA INICIO -->
                  <div class="WIDTH-8">  
                    <label
                    id="LOTEEXPdatainicio-label"
                    for="LOTEEXPdatainicio-input"
                    class="form-label BGC-branco BORRAD-5 FSIZE-10px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                    >INÍCIO</label>
                    <input
                      disabled
                      id="LOTEEXPdatainicio-input"
                      :value="formatarDataHora(tramiteEnvioCompletoDTO.dHoraInicioTramite)"
                      :title="infosTramite.dHoraInicioTramite"
                      type="text"
                      class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-10px InputUPPERCASE">
                  </div>

                  <!-- RESPONSÁVEL/CONFERENTE -->
                  <div class="WIDTH-20">
                    <label
                      id="LOTEEXPresponsavel-label"
                      for="LOTEEXPresponsavel-input"
                      class="form-label BGC-branco BORRAD-5 FSIZE-10px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                    >RESPONSÁVEL/CONFERENTE</label>
                    <input
                      disabled
                      id="LOTEEXPresponsavel-input"
                      type="text"
                      v-model="userNome"
                      :title="userNome"
                      class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                  </div>

                <!-- PLACA VEÍCULO -->
                  <div class="WIDTH-12">
                    <label
                      id="LOTEEXPinsert-placa-label"
                      for="LOTEEXPinsert-placa-input"
                      class="form-label BGC-branco BORRAD-5 FSIZE-10px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 red-asterisk"
                    >PLACA VEÍCULO</label>
                    <input
                      autocomplete="off"
                      list="insert-placa-veiculo-dataList"
                      @blur="onBlurPlacaVeiculoLoteEXP()"
                      @keyup="onKeyUpPlacaVeiculoLoteEXP()"
                      id="LOTEEXPinsert-placa-input"
                      v-model="tramiteLoteExpRequestDTO.placaVeiculo"
                      type="text"
                      maxlength="8"
                      class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE"
                      :title="tramiteLoteExpRequestDTO.placaVeiculo">
                    <datalist id="insert-placa-veiculo-dataList" class="">
                      <option v-for="(placa, i) in this.infoTodasPlacas" :key="i" :value="placa">
                        {{ placa }}
                      </option>
                    </datalist>
                  </div>

                  <!-- VEÍCULO -->
                  <div class="WIDTH-15">
                    <label
                      id="LOTEEXPveiculo-label"
                      for="LOTEEXPveiculo-input"
                      class="form-label BGC-input-disabled BORRAD-5 FSIZE-10px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 red-asterisk"
                    >VEÍCULO</label>
                    <div v-if="isLoadingInfoVeiculo" class="loading-container">
                      <img src="/legado/images/gif-carregamento-horizontal.gif" alt="Carregando..." style="width: 50px; height: auto; margin-left: 20px; margin-top: -15px"/>
                    </div>
                    <input v-else
                      id="LOTEEXPveiculo-input"
                      @keyup="this.retiraRequiredSeExistir('LOTEEXPveiculo-label', 'LOTEEXPveiculo-input');"
                      v-model="tramiteLoteExpRequestDTO.veiculo"
                      disabled
                      type="text"
                      class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE"
                      :title="tramiteLoteExpRequestDTO.veiculo">
                  </div>

                  <!-- RG DO MOTORISTA -->
                  <div class="WIDTH-20">
                    <label
                      id="LOTEEXPrgmotorista-label"
                      for="LOTEEXPrgmotorista-input"
                      class="form-label BGC-input-disabled BORRAD-5 FSIZE-10px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 red-asterisk"
                    >RG DO MOTORISTA</label>
                    <input
                    id="LOTEEXPrgmotorista-input"
                    list="insert-rg-motorista-dataList"
                    autocomplete="off" 
                    maxlength="14" 
                    @keyup="this.onKeyUpRGMotoristaLOTEEXPInput();"
                    @blur="onBlurInputRGMotoristaLOTEEXP()"
                    v-model="tramiteLoteExpRequestDTO.rgMotorista"
                    type="text"
                    disabled
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE"
                    :title="tramiteLoteExpRequestDTO.rgMotorista">
                    <!-- @keyup="this.retiraRequiredSeExistir('rgmotorista-label', 'rgmotorista-input');" -->
                      <datalist id="insert-rg-motorista-dataList">
                        <option v-for="(rg, i) in this.todosRGs" :key="i" :value="rg.cRGMotorista">
                          {{ rg.cRGMotoristaLimpo }}
                        </option>
                      </datalist>
                  </div>

                  <!-- MOTORISTA -->
                  <div class="WIDTH-20">
                    <label
                      id="LOTEEXPmotorista-label"
                      for="LOTEEXPmotorista-input"
                      class="form-label BGC-input-disabled BORRAD-5 FSIZE-10px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 red-asterisk"
                    >MOTORISTA</label>
                    <input
                      id="LOTEEXPmotorista-input"
                      list="insert-nome-motorista-dataList"
                      autocomplete="off" 
                      @keyup="this.retiraRequiredSeExistir('motorista-label', 'motorista-input');"
                      v-model="tramiteLoteExpRequestDTO.motorista"
                      disabled
                      type="text"
                      class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE"
                      :title="tramiteLoteExpRequestDTO.motorista">
                        <datalist id="insert-nome-motorista-dataList">
                          <option v-for="(rg, i) in this.infoPlacasExistentes" :key="i" :value="rg.cNomeMotorista">
                            {{ rg.cNomeMotorista }}
                          </option>
                        </datalist>
                  </div>

                </div>

              </div>

              <!-- PARTE DAS TABELAS -->
              <div class="flex-grow-1 d-flex flex-column overflow-hidden">
                
                <div class="OFLOW-auto WIDTH-100 HEIGHT-100 BOR-grey BORRAD-3 MARGIN-B5 BGC-cinza-8 p-1">
              
                    <div class="WIDTH-100 D-flex JC-center ALITEM-center HEIGHT-12">
                      
                      <div class="WIDTH-40 D-flex JC-center ALITEM-center HEIGHT-100"></div>
                      <!-- TÍTULO -->
                      <div class="WIDTH-20 D-flex JC-center ALITEM-center HEIGHT-100">
                        <h5>PEDIDOS</h5>
                      </div>

                      <!-- TOTAL PEDIDOS, ITENS E SKUS -->
                      <div class="D-flex ALITEM-center JC-flex-end WIDTH-40 HEIGHT-100 mb-1">
                        <div class="D-flex ALITEM-center JC-flex-end WIDTH-100">
                          <span  class="FSIZE-12px FWEIGHT-bold"
                            >Pedidos: 
                            <img
                              v-if="!tabelaPedidosPossiveisLoteExp"
                              src="/legado/images/gif-carregamento-horizontal.gif"
                              alt="Carregando..."
                              class="HEIGHT-5px"
                            />
                            <strong v-else>{{ quantidadePedidosPossiveisTotalizador }}</strong>
                            •
                            Itens:
                            <img
                              v-if="!tabelaPedidosPossiveisLoteExp"
                              src="/legado/images/gif-carregamento-horizontal.gif"
                              alt="Carregando..."
                              class="HEIGHT-5px"
                            />
                            <strong v-else>{{ quantidadeItensPossiveisTotalizador }}</strong>
                            •
                            SKUs:
                            <img
                              v-if="!tabelaPedidosPossiveisLoteExp"
                              src="/legado/images/gif-carregamento-horizontal.gif"
                              alt="Carregando..."
                              class="HEIGHT-5px"
                            />
                            <strong v-else>{{ quantidadeSKUsPossiveisTotalizador }}</strong>
                            •
                            Volumes:
                            <img
                              v-if="!tabelaPedidosPossiveisLoteExp"
                              src="/legado/images/gif-carregamento-horizontal.gif"
                              alt="Carregando..."
                              class="HEIGHT-5px"
                            />
                            <strong v-else>{{ quantidadeVolumesPossiveisTotalizador }}</strong>
                          </span>
                        </div>
                      </div>

                    </div>

                  <div class="OFLOW-auto WIDTH-100 HEIGHT-88 BOR-SensacaoAfundado BGC-branco">

                    <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5" style="overflow-x: hidden; width: 100%;">
                    
                      <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                        <tr>
                          <th class="TEXTALI-center WIDTH-3 CTTABLEELPIS">
                          </th>
                          <th class="TEXTALI-center WIDTH-12 CTTABLEELPIS">
                            G. REMESSA
                          </th>
                          <th class="TEXTALI-center WIDTH-12 CTTABLEELPIS">
                            PEDIDO
                          </th>
                          <th class="TEXTALI-center WIDTH-12 CTTABLEELPIS">
                            O.V.
                          </th>
                          <th class="TEXTALI-center WIDTH-10 CTTABLEELPIS">
                            CK
                          </th>
                          <th class="TEXTALI-center WIDTH-12 CTTABLEELPIS">
                            NFe
                          </th>
                          <th class="TEXTALI-center WIDTH-5 CTTABLEELPIS">
                            VOL.
                          </th>
                          <th class="TEXTALI-center WIDTH-29 CTTABLEELPIS">
                            DESTINATÁRIO
                          </th>
                          <th class="TEXTALI-center WIDTH-2 CTTABLEELPIS">
                            UF
                          </th>
                          <th class="TEXTALI-center WIDTH-8 CTTABLEELPIS">
                            CEP
                          </th>
                        </tr>
                      </thead>
                      <LayoutTabelaCarregarEsqueleto :Linhas=9 :Colunas=9 v-if="!tabelaPedidosPossiveisLoteExp" />
                      <tbody class="BORRAD-5">
                        
                        <tr v-if="tabelaPedidosPossiveisLoteExp && (!selectedClienteLoteEXP || !selectedTransportadoraLoteEXP)">
                          <td colspan="10" class="BGC-amarelo-claro HEIGHT-100">
                            <div class="WIDTH-100 HEIGHT-50 D-flex JC-center ALITEM-center FWEIGHT-bold FSIZE-16px TEXTALI-center">
                              SELECIONE O CLIENTE E A TRANSPORTADORA PARA CARREGAR OS PEDIDOS DISPONÍVEIS.
                            </div>
                          </td>
                        </tr>
                        <tr v-if="tabelaPedidosPossiveisLoteExp && (selectedClienteLoteEXP && selectedTransportadoraLoteEXP) && staticPedidosPossiveisExpedicao.length === 0">
                          <td colspan="10" class="BGC-amarelo-claro">
                            <div
                              class="WIDTH-100 HEIGHT-100 D-flex JC-center ALITEM-center
                                    FWEIGHT-bold FSIZE-16px TEXTALI-center"
                            >
                              NÃO EXISTEM PEDIDOS SELECIONÁVEIS PARA ESSE CLIENTE E TRANSPORTADORA.
                            </div>
                          </td>
                        </tr>
                        <tr v-else
                          v-for="(pedido, i) in pedidosPossiveisExpedicao.filter(p => p.bSelecionado === false)"
                          :key="pedido.iD_Pedido"
                          class="BGC-H-cinza-8 HEIGHT-5px"
                          :class="[
                            applyTableStipedRows(i),
                            { 'pedido-nao-selecionavel': isPedidoNaoSelecionavel(pedido, selectedTransportadoraLoteEXP) }
                          ]"
                          :id="pedido.numPedido"
                        >
                        <td class="TEXTALI-left CTTABLEELPIS WIDTH-3">
                          <div class="D-flex HEIGHT-100 WIDTH-100 JC-space-between ALITEM-center">

                            <input
                              type="checkbox"
                              :id="`${pedido.iD_Pedido}-checkbox-pedido`"
                              :value="pedido.iD_Pedido"
                              :disabled="isPedidoNaoSelecionavel(pedido, selectedTransportadoraLoteEXP)"
                              @change="onClickCheckBoxPedidosPossiveisExpedicao(pedido)"
                            />

                            <div
                              v-if="isPedidoNaoSelecionavel(pedido, selectedTransportadoraLoteEXP)"
                              :title="getMotivoNaoSelecionavel(pedido, selectedTransportadoraLoteEXP)"
                            >
                              <IconsAviso corProp="Goldenrod" alturaProp="1" larguraProp="1"/>
                            </div>

                          </div>
                        </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-12" :title="pedido.guiaRemessa">
                            {{ pedido.guiaRemessa }}
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-12" :title="pedido.numPedido">
                            {{ pedido.numPedido }}
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-12" :title="pedido.ov">
                            {{ pedido.ov }}
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-10" :title="pedido.ck">
                            {{ pedido.ck }} 
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-12" :title="pedido.notaFiscal">
                            {{ pedido.notaFiscal }}
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-5" :title="pedido.volumes">
                            {{ pedido.volumes }}
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-29" :title="pedido.destinatario">
                            {{ pedido.destinatario }}
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-2" :title="pedido.uf">
                            {{ pedido.uf }}
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-8" :title="pedido.cep">
                            {{ pedido.cep }}
                          </td>
                        </tr>
                      </tbody>

                    </table>

                  </div>

                  <!-- <div class="WIDTH-95">
                    <button @click="toggleVerMais" class="btn btn-secondary WIDTH-100 FSIZE-14px">
                      {{ mostrarTodos ? `Ver menos...` : `Ver mais... (${tramitesPai.length})` }}
                    </button>
                  </div> -->

                </div>

                <div class="OFLOW-auto WIDTH-100 HEIGHT-100 BOR-blue BORRAD-3 MARGIN-B5 BGC-cinza-8 p-1">
              
                  <div class="WIDTH-100 D-flex JC-center ALITEM-center HEIGHT-12">
                    
                    <div class="WIDTH-40 D-flex JC-center ALITEM-center"></div>

                    <!-- TÍTULO -->
                    <div class="WIDTH-20 D-flex JC-center ALITEM-center">
                        <h5 style="color: blue;">SELECIONADOS</h5>
                    </div>

                    <!-- TOTAL PEDIDOS, ITENS E SKUS -->
                    <div class="D-flex ALITEM-center JC-flex-end WIDTH-40 HEIGHT-100 mb-1">
                      <div class="D-flex ALITEM-center JC-flex-end WIDTH-100">
                        <span  class="COLOR-blue FSIZE-12px FWEIGHT-bold"
                          >Pedidos: 
                          <img
                            v-if="!tabelaPedidosPossiveisLoteExp"
                            src="/legado/images/gif-carregamento-horizontal.gif"
                            alt="Carregando..."
                            class="HEIGHT-5px"
                          />
                          <strong v-else>{{ quantidadePedidosSelecionadosTotalizador }}</strong>
                          •
                          Itens:
                          <img
                            v-if="!tabelaPedidosPossiveisLoteExp"
                            src="/legado/images/gif-carregamento-horizontal.gif"
                            alt="Carregando..."
                            class="HEIGHT-5px"
                          />
                          <strong v-else>{{ quantidadeItensSelecionadosTotalizador }}</strong>
                          •
                          SKUs:
                          <img
                            v-if="!tabelaPedidosPossiveisLoteExp"
                            src="/legado/images/gif-carregamento-horizontal.gif"
                            alt="Carregando..."
                            class="HEIGHT-5px"
                          />
                          <strong v-else>{{ quantidadeSKUsSelecionadosTotalizador }}</strong>
                          •
                          Volumes:
                          <img
                            v-if="!tabelaPedidosPossiveisLoteExp"
                            src="/legado/images/gif-carregamento-horizontal.gif"
                            alt="Carregando..."
                            class="HEIGHT-5px"
                          />
                          <strong v-else>{{ quantidadeVolumesSelecionadosTotalizador }}</strong>
                        </span>
                      </div>
                    </div>

                  </div>

                  <div class="OFLOW-auto WIDTH-100 HEIGHT-88 BOR-SensacaoAfundado BGC-branco">

                    <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5">
                    
                      <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                        <tr>
                          <th class="TEXTALI-center WIDTH-3 CTTABLEELPIS">
                          </th>
                          <th class="TEXTALI-center WIDTH-12 CTTABLEELPIS">
                            G. REMESSA
                          </th>
                          <th class="TEXTALI-center WIDTH-12 CTTABLEELPIS">
                            PEDIDO
                          </th>
                          <th class="TEXTALI-center WIDTH-12 CTTABLEELPIS">
                            O.V.
                          </th>
                          <th class="TEXTALI-center WIDTH-10 CTTABLEELPIS">
                            CK
                          </th>
                          <th class="TEXTALI-center WIDTH-12 CTTABLEELPIS">
                            NFe
                          </th>
                          <th class="TEXTALI-center WIDTH-5 CTTABLEELPIS">
                            VOL.
                          </th>
                          <th class="TEXTALI-center WIDTH-29 CTTABLEELPIS">
                            DESTINATÁRIO
                          </th>
                          <th class="TEXTALI-center WIDTH-2 CTTABLEELPIS">
                            UF
                          </th>
                          <th class="TEXTALI-center WIDTH-8 CTTABLEELPIS">
                            CEP
                          </th>
                        </tr>
                      </thead>
                      <tbody class="BORRAD-5">
                        <tr
                          v-for="(pedido, i) in staticPedidosPossiveisExpedicao.filter(p => p.bSelecionado === true)" :key="pedido.iD_Pedido"
                          class="BGC-H-cinza-8 HEIGHT-5px"
                          :class="this.applyTableStipedRows(i)"
                          :value="pedido.iD_Pedido"
                        >
                          <td class="TEXTALI-left CTTABLEELPIS WIDTH-3">
                            <input
                              type="checkbox"
                              :checked="true"
                              @change="onClickCheckBoxPedidoSelecionadoExpedicao(pedido)"
                            />
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-12" :title="pedido.guiaRemessa">
                            {{ pedido.guiaRemessa }}
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-12" :title="pedido.numPedido">
                            {{ pedido.numPedido }}
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-12" :title="pedido.ov">
                            {{ pedido.ov }}
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-10" :title="pedido.ck">
                            {{ pedido.ck }} 
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-12" :title="pedido.notaFiscal">
                            {{ pedido.notaFiscal }}
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-5" :title="pedido.volumes">
                            {{ pedido.volumes }}
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-29" :title="pedido.destinatario">
                            {{ pedido.destinatario }}
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-2" :title="pedido.uf">
                            {{ pedido.uf }}
                          </td>
                          <td class="TEXTALI-center CTTABLEELPIS WIDTH-8" :title="pedido.cep">
                            {{ pedido.cep }}
                          </td>

                        </tr>
                      </tbody>

                    </table>

                  </div>
  <!-- 
                  <div class="WIDTH-95">
                    <button @click="toggleVerMais" class="btn btn-secondary WIDTH-100 FSIZE-14px">
                      {{ mostrarTodos ? `Ver menos...` : `Ver mais... (${tramitesPai.length})` }}
                    </button>
                  </div> -->

                </div>

              </div>

            </div>

          </div>
          <!-- ESTADO AGUARDANDO ASSINATURA -->
          <div v-else class="assinatura-container">

            <div class="assinatura-box WIDTH-75">
              <div class="assinatura-icon">
                <i class="bi bi-tablet"></i>
              </div>

              <div class="assinatura-title">
                Aguardando Assinatura
              </div>

              <div class="assinatura-text">
                Colete a assinatura pelo aplicativo para finalizar o trâmite de expedição.
              </div>
            </div>

          </div>
        
        </div>
        
        <!-- RODAPÉ -->
        <div class="PADDING-T5-R18-B5-L18 D-flex ALITEM-center HEIGHT-5vh" id="modal-footer">
          <!-- BOTÕES SELECIONAR TODOS E ANULAR SELEÇÃO -->
          <div v-if="!modoEsperaAssinatura" class="WIDTH-30 D-flex JC-flex-start ALITEM-center">
            <button id="selecionar-todos-button"
              class="btn btn-primary FSIZE-10px  MARGIN-R5"
              :disabled="pedidosPossiveisExpedicao.filter(p => p.bSelecionado === false).length === 0"
            @click="onClickSelecionarTodos">SELECIONAR TODOS</button>
            <button id="anular-selecao-button"
              class="btn btn-warning FSIZE-10px "
              :disabled="staticPedidosPossiveisExpedicao.filter(p => p.bSelecionado === true).length === 0"
            @click="onClickAnularSelecao">ANULAR SELEÇÃO</button>
          </div>
          <div v-if="modoEsperaAssinatura" class="WIDTH-30 D-flex JC-flex-start ALITEM-center"></div>

          <!-- BOTÕES EXPEDIR | IMPRIMIR DANFE | GERAR O PDF NF -->
          <div class="WIDTH-70 D-flex JC-flex-end ALITEM-center">

            <div class="MARGIN-R15 FWEIGHT-bold BOR-grey-1 BORRAD-5 PADDING-2">
              <input
                class="FSIZE-14px"
                type="checkbox"
                v-model="imprimirDANFE"
              />
              Imprimir Danfe
            </div>

            <div class="MARGIN-R15 FWEIGHT-bold BOR-grey-1 BORRAD-5 PADDING-2">
              <input
                class="FSIZE-14px"
                type="checkbox"
                v-model="gerarPDFNF"
              />
              Gerar o PDF NF
            </div>

            <button
              id="tramiteExpPedido-post-button"
              class="btn FSIZE-12px "
              @click="clickButtonSalvarTramiteExpedicao()"
              title="SALVAR TRAMITE"
              style="background-color: black; color: yellow; border: none;"
              :disabled="postandoTramite"
              >
              {{ textoBotaoExpedir }}
            </button>

          </div>
                    

        </div>

      </div>
    </div>
  </div>

  <div class="modal fade" id="TramitePaiAnularModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="TramitePaiAnularModalLabel">
    <div class="modal-dialog">
      <div class="modal-content" id="modalAnular">

        <!-- Cabeçalho MODAL -->
        <div class="d-flex justify-content-between align-items-center border-bottom p-2 HEIGHT-6" id="modal-header">
        
        <!-- Logo -->
        <img 
          src="/legado/images/Logo-E-azul-enhanced.png" 
          alt="Logo Grupo Embalarte" 
          class="WIDTH-6 HEIGHT-auto" 
          title="Grupo Embalarte">

        <!-- Título -->
        <h1 class="modal-title fs-5 flex-grow-1 text-center" id="TramitePaiModalLabel">
          ANULAR TRÂMITE | {{ tramiteSelecionado }}
        </h1>

        <!-- Botão Fechar -->
        <button 
          title="Fechar (F4)" 
          id="update-modal-close-button" 
          type="button" 
          class="btn-close" 
          data-bs-dismiss="modal" 
          aria-label="Close"
          @click="senhaAnulaTramite = null; motivoAnulaTramite = null"
        ></button>
        </div>

        <!-- Corpo do Modal -->
        <div class="" style="padding: 2% 5% 2% 5%;">
        <p>Insira a senha para confirmar a anulação do trâmite</p>
      
        <div class="WIDTH-100 MARGIN-R1P">
          <label
            id="mtvAnulacao-label"
            for="mtvAnulacao-input"
            class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-enabled"
          >MOTIVO DA ANULAÇÃO</label>
          <input
            id="mtvAnulacao-input"
            type="text"
            v-model="motivoAnulaTramite"
            class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
        </div>

        <div class="WIDTH-50 MARGIN-R1P">
          <label
            id="senhaAnulacao-label"
            for="senhaAnulacao-input"
            class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-enabled"
          >SENHA</label>
          <input type="text" style="display:none">
          <input
            @change="retiraRequiredSeExistir('senhaAnulacao-label', 'senhaAnulacao-input')"
            id="senhaAnulacao-input"
            type="password"
            autocomplete="new-password"
            name="nope"
            v-model="senhaAnulaTramite"
            class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
        </div>

          <div class="d-flex justify-content-end">
            <button 
            class="btn btn-secondary me-2" 
            data-bs-dismiss="modal" 
            @click="senhaAnulaTramite = null; motivoAnulaTramite = null"
            >
            Cancelar
            </button>

            <button class="btn btn-danger" :disabled="!podeClicarBotaoAnular" @click="clickConfirmarAnularTramite(tramiteSelecionado)">
            Confirmar
            </button>
          </div>

        </div>

      </div>
    </div>
  </div>

  <!-- Corpo (OK) -->
  <main class="D-flex">

    <!-- Todo o Conteúdo da página -->
    <div class="D-flex FD-column WIDTH-100 HEIGHT-100vh OFLOW-auto">

      <!-- Menu Superior -->
      <!-- No site usa o menu do acesso externo (logout volta para a home do site) -->
      <SetorProducaoSLAMenuSuperior
        funcionalidadeProp="LOGÍSTICA - TRÂMITE"
        destinoVoltarProp="/"
      />

      <!-- Tabela de TRAMITE + Botões -->
      <div class="D-flex FD-column HEIGHT-90vh WIDTH-100 JC-center ALITEM-center BGC-cinza-10 BOR-branca">

        <!-- TRAMITE -->
        <div class="D-flex FD-column ALITEM-center JC-center HEIGHT-82 WIDTH-98 BORRAD-5 BGC-branco PADDING-T10-R10-B5-L10">
          
					<div class="D-flex ALITEM-center WIDTH-100 mb-1" style="flex: 0 0 auto;">

            <!-- Decoração FILTROS -->
            <div class="WIDTH-5 HEIGHT-100 BGC-azul-esverdeado COLOR-white ALITEM-center BORRAD-5 FWEIGHT-bold D-flex FD-column JC-space-between">
              <p>Filtros</p>
              <button type="button" class="btn btn-dark WIDTH-75 FSIZE-12px mb-1" @click="onClickLimparFiltros">Limpar</button>
            </div>

            <div class="D-flex WIDTH-19 FD-column JC-space-around PADDING-T2-R5-B5-L10 HEIGHT-100">

              <!-- <div class="D-flex FD-row WIDTH-100"> -->

                <!-- UNIDADE (começa vazio: mostra todas) -->
                <BasicElementVue3SelectPequeno
                  ref="UnidadeSelectREF"

                  :options="infoUnidadesFiltro"
                  optionLabel="Unidade"
                  v-model="selectedUnidadeFiltro"

                  @update:modelValue="() => onChangeUnidadeSelectREF()"

                  label="UNIDADE:"
                  :titulo="selectedUnidadeFiltro?.cNome"

                  :divClass="'MARGIN-T12 WIDTH-100 HEIGHT-20'"
                  :selectClass="'FSIZE-12px'"
                  :labelClass="'FSIZE-12px MARGIN-T-15'"

                />

                <!-- <div class="WIDTH-35" style="margin-right: 5px;">
                  <label
                    id="data-inicio-aguardando-label"
                    for="data-inicio-aguardando-input"
                    class="form-label BGC-branco BORRAD-5 FSIZE-10px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
                  >A PARTIR DE</label>
                  <input
                    autocomplete="off"
                    id="data-inicio-aguardando-input"
                    type="date"
                    onkeydown="return false"
                    v-model="dataInicio"
                    @change="OnChangeDataTramite"
                    class="form-control BORRAD-5 BOR-grey MARGIN-T-8 FSIZE-11px BGC-branco">
                </div> -->

              <!-- </div> -->

            <!-- TIPO -->
            <BasicElementVue3SelectPequeno
              :options="infoTiposFiltro"
              optionLabel="cNome"
              v-model="selectedTipoFiltro"

              label="TIPO:"
              :titulo="selectedTipoFiltro?.cNome"

              @update:modelValue="() => onChangeFiltro()"

              :divClass="'MARGIN-T12 WIDTH-100 HEIGHT-20'"
              :selectClass="'FSIZE-12px'"
              :labelClass="'FSIZE-12px MARGIN-T-15'"
            />

                              
              <!-- CLIENTE -->
              <BasicElementVue3SelectPequeno
                :options="infoClientesFiltro"
                optionLabel="cNome"
                v-model="selectedClienteFiltro"

                label="CLIENTE:"
                :titulo="infoClientesFiltro?.cNome"

                @update:modelValue="() => onChangeFiltro()"

                :divClass="'MARGIN-T12 WIDTH-100 HEIGHT-20'"
                :selectClass="'FSIZE-12px'"
                :labelClass="'FSIZE-12px MARGIN-T-15'"
              />

            </div>

            <div class="D-flex WIDTH-19 FD-column JC-space-around BOR-L-solidgrey-1 PADDING-T2-R5-B5-L10 HEIGHT-100">

              <div class="MARGIN-T-8" style="margin-right: 5px;">
                <label
                  id="data-inicio-aguardando-label"
                  for="data-inicio-aguardando-input"
                  class="form-label BGC-branco BORRAD-5 FSIZE-10px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
                >A PARTIR DE</label>
                <input
                  autocomplete="off"
                  id="data-inicio-aguardando-input"
                  type="date"
                  onkeydown="return false"
                  v-model="dataInicio"
                  @change="OnChangeDataTramite"
                  class="form-control BORRAD-5 BOR-grey MARGIN-T-8 FSIZE-11px BGC-branco">
              </div>

              <!-- TRANSPORTADORA -->
              <BasicElementVue3SelectPequeno
                :options="infoTransportadorasFiltro"
                optionLabel="cNome"
                v-model="selectedTransportadoraFiltro"

                label="TRANSPORTADORA:"
                :titulo="selectedTransportadoraFiltro?.cNome"

                @update:modelValue="() => onChangeFiltro()"

                :divClass="'MARGIN-T12 WIDTH-100 HEIGHT-20'"
                :selectClass="'FSIZE-12px'"
                :labelClass="'FSIZE-12px MARGIN-T-15'"
              />

              <!-- TRAMITE -->
              <BasicElementVue3SelectPequeno
                :options="infoTramitesFiltro"
                optionLabel="cNome"
                v-model="selectedTramiteFiltro"

                label="TRÂMITE:"
                :titulo="selectedTramiteFiltro?.cNome"

                @update:modelValue="() => onChangeFiltro()"

                :divClass="'MARGIN-T12 WIDTH-100 HEIGHT-20'"
                :selectClass="'FSIZE-12px'"
                :labelClass="'FSIZE-12px MARGIN-T-15'"
              />

            </div>

            <div class="D-flex WIDTH-19 FD-column JC-space-around BOR-L-solidgrey-1 PADDING-T2-R5-B5-L10 HEIGHT-100">
              
              <!-- DIRECIONADO -->
              <BasicElementVue3SelectPequeno
                :options="infoDirecionadoFiltro"
                optionLabel="cNome"
                v-model="selectedDirecionadoFiltro"

                label="DIRECIONADO:"
                :titulo="selectedDirecionadoFiltro?.cNome"

                @update:modelValue="() => onChangeFiltro()"

                :divClass="'MARGIN-T12 WIDTH-100 HEIGHT-20'"
                :selectClass="'FSIZE-12px'"
                :labelClass="'FSIZE-12px MARGIN-T-15'"
              />

              <!-- OS -->
              <BasicElementVue3SelectPequeno
                :options="infoOSFiltro"
                optionLabel="cNome"
                v-model="selectedOSFiltro"

                label="OS:"
                :titulo="selectedOSFiltro?.cNome"

                @update:modelValue="() => onChangeFiltro()"

                :divClass="'MARGIN-T12 WIDTH-100 HEIGHT-20'"
                :selectClass="'FSIZE-12px'"
                :labelClass="'FSIZE-12px MARGIN-T-15'"
              />

              <!-- LOTE -->
              <BasicElementVue3SelectPequeno
                :options="infoLoteFiltro"
                optionLabel="cNome"
                v-model="selectedLoteFiltro"

                label="LOTE:"
                :titulo="selectedLoteFiltro?.cNome"

                @update:modelValue="() => onChangeFiltro()"

                :divClass="'MARGIN-T12 WIDTH-100 HEIGHT-20'"
                :selectClass="'FSIZE-12px'"
                :labelClass="'FSIZE-12px MARGIN-T-15'"
              />

            </div>

            <div class="D-flex WIDTH-19 FD-column JC-space-around BOR-L-solidgrey-1 PADDING-T2-R5-B5-L10 HEIGHT-100">
                  
              <div class="D-flex FD-row WIDTH-100">
                
                <!-- CÓDIGO PRODUTO -->
                <BasicElementVue3SelectPequeno
                  :options="infoCodProdFiltro"
                  optionLabel="cNome"
                  v-model="selectedCodProdFiltro"

                  label="COD. PROD.:"
                  :titulo="selectedCodProdFiltro?.cNome"

                  @update:modelValue="() => onChangeFiltro()"

                  :divClass="'MARGIN-T12 WIDTH-100 HEIGHT-20'"
                  :selectClass="'FSIZE-12px'"
                  :labelClass="'FSIZE-12px MARGIN-T-15'"

                />

                <!-- NF PRODUTO -->
                <BasicElementVue3SelectPequeno
                  :options="infoNFProdFiltro"
                  optionLabel="cNome"
                  v-model="selectedNFProdFiltro"

                  label="NF PROD.:"
                  :titulo="selectedNFProdFiltro?.cNome"

                  @update:modelValue="() => onChangeFiltro()"

                  :divClass="'MARGIN-T12 WIDTH-100 HEIGHT-20'"
                  :selectClass="'FSIZE-12px'"
                  :labelClass="'FSIZE-12px MARGIN-T-15'"

                />

              </div>


                <!-- DESCRIÇÃO PRODUTO -->
                <BasicElementVue3SelectPequeno
                  :options="infoDescProdFiltro"
                  optionLabel="cNome"
                  v-model="selectedDescProdFiltro"

                  label="DESCRIÇÃO DO PRODUTO:"
                  :titulo="selectedDescProdFiltro?.cNome"

                  @update:modelValue="() => onChangeFiltro()"

                  :divClass="'MARGIN-T12 WIDTH-100 HEIGHT-20'"
                  :selectClass="'FSIZE-12px'"
                  :labelClass="'FSIZE-12px MARGIN-T-15'"

                />


            </div>
          
            <div class="WIDTH-19 HEIGHT-100 D-flex JC-flex-end ALITEM-flex-end">

              <div style="margin-right: 10px; cursor: pointer;" @click="getTramitesPai()" title="Atualizar informações">
                <IconsRefresh
                  corProp="rgb(24, 134, 84)"
                  alturaProp="1.6"
                  larguraProp="1.6"
                />
              </div>
              
              <!-- EXCEL -->
              <button id="exportar-EXCEL-button" type="button"
                class="btn btn-success MARGIN-R5 FSIZE-12px PADDING-4 " @click="ToastWarning('Em desenvolvimento')">
                <IconsExcel corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                Exportar EXCEL</button>
                
              <!-- PDF -->
              <button id="exportar-PDF-button" type="button"
                class="btn btn-warning FSIZE-12px PADDING-4" @click="ToastWarning('Em desenvolvimento')">
                <IconsPDF corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                Exportar PDF
              </button>

            </div>
            
					</div>

          <!-- Tabela -->
          <div class="OFLOW-auto WIDTH-100 BORRAD-5" style="flex: 1 1 auto; min-height: 0;">
          
            <div ref="tabelaTramitePrincipalContainer" class="table-container WIDTH-100 BOR-SensacaoAfundado HEIGHT-94" :class="{ 'com-scroll': ( linhaExpandidaDaTabela !== null ) }" :style="{ '--row-h': rowHeightPx + 'px' }">
            
              <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5 table-fixed FSIZE-PADRAO-TABLE">
                <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                  <tr>
                    <th class="TEXTALI-center WIDTH-2">
                    </th>
                    <th class="TEXTALI-center WIDTH-10">
                      N°
                    </th>
                    <th class="TEXTALI-center WIDTH-15">
                      Unidade
                    </th>
                    <th class="TEXTALI-center WIDTH-10">
                      Data
                    </th>
                    <th class="TEXTALI-center WIDTH-10">
                      Tipo
                    </th>
                    <th class="TEXTALI-center WIDTH-10">
                      Cliente
                    </th>
                    <th class="TEXTALI-center WIDTH-21">
                      Transportadora
                    </th>
                    <th class="TEXTALI-center WIDTH-7">
                      Direcionado
                    </th>
                    <th class="TEXTALI-center WIDTH-7">
                      Qtd. Itens
                    </th>
                    <th class="TEXTALI-center WIDTH-3">
                    </th>
                    <th class="TEXTALI-center WIDTH-3">
                    </th>
                    <th class="TEXTALI-center WIDTH-2">
                    </th>
                  </tr>
                </thead>

                <LayoutTabelaCarregarEsqueleto
                  :Linhas="registrosTabelaPrincipalTramite.length === 0 ? 12 : registrosTabelaPrincipalTramite.length"
                  :Colunas=12 v-if="!tabelaTRAMITEsCarregada" />

                <tbody v-if="tabelaTRAMITEsCarregada" class="BORRAD-5">
                
                  <template v-for="(tramite, i) in registrosTabelaPrincipalTramite" :key="tramite.iD_Tramite">

                    <!-- Linha principal -->
                    <tr
                      :style="getStylePorTipo(tramite)"
                      class="CURSOR-pointer BGC-H-cinza-8 HEIGHT-5px"
                      :class="applyTableStipedRows(i)"
                      :id="tramite.iD_Tramite"
                      :value="tramite.iD_Tramite"
                      @click="OpenUpdateModal('ClickDiretoTabela', tramite)"
                    >
                      <td @click.stop.prevent class="TEXTALI-center WIDTH-2 CTTABLEELPIS">
                        <button
                          @click.stop.prevent="ativarSubLinha(tramite)"
                          title="Mais informações"
                          class="custom-button"
                        >
                          {{ linhaExpandidaDaTabela === tramite.iD_Tramite ? '-' : '+' }}
                        </button>
                      </td>
                      <td class="TEXTALI-center WIDTH-10 CTTABLEELPIS">
                        {{ tramite.iD_Tramite }}
                      </td>
                      <td class="TEXTALI-left WIDTH-15 CTTABLEELPIS">
                        {{ tramite.unidade }}
                      </td>
                      <td class="TEXTALI-center WIDTH-10 CTTABLEELPIS">
                        {{ tramite.data }}
                      </td>
                      <td class="TEXTALI-left WIDTH-10 CTTABLEELPIS">
                        {{ tramite.cTipoTramite }}
                      </td>
                      <td class="TEXTALI-left WIDTH-10 CTTABLEELPIS">
                        {{ tramite.cliente }}
                      </td>
                      <td class="TEXTALI-left WIDTH-21 CTTABLEELPIS">
                        {{ tramite.transportadora }}
                      </td>
                      <td class="TEXTALI-center WIDTH-7 CTTABLEELPIS">
                        {{ tramite.emEstoque }}
                      </td>
                      <td class="TEXTALI-right WIDTH-7 CTTABLEELPIS">
                        {{ tramite.quantidadeItens }}
                      </td>
                      <td class="TEXTALI-left WIDTH-3 CTTABLEELPIS">
                        {{ tramite.cLR }}
                      </td>
                      <td class="TEXTALI-left WIDTH-3 CTTABLEELPIS">
                        <!-- <button
                          v-if="(!tramite.bEmailEnviado) && (tramite.cTipoTramite == 'EXPEDIÇÃO')"
                          class="buttonTableEntradas botao-voltar"
                          :disabled="bloqueandoAssinatura"
                        >
                          @click.stop="OnClickBotaoAssinaturaTramiteTabela(tramite.iD_Tramite)"
                          <IconsAssinatura corProp="red" alturaProp="1.2" larguraProp="1.2" />
                        </button> -->
                      </td>
                      <td class="TEXTALI-center WIDTH-2 CTTABLEELPIS">
                        
                        <button
                          v-if="!tramite.usuarioAnulante"
                          class="buttonTableEntradas botao-voltar"
                          @click.stop="clickCrossExcluirTramite(tramite)"
                        >
                          <IconsCrossQuadrado corProp="red" alturaProp="1.2" larguraProp="1.2" />
                        </button>
                       
                        <button
                          v-else
                          class="buttonTableEntradas botao-voltar"
                          disabled
                          style="visibility: hidden;"
                        ></button>

                      </td>


                    </tr>

                    <!-- Linha expandida -->
                    <tr v-if="linhaExpandidaDaTabela === tramite.iD_Tramite">
                      <td colspan="16" class="expanded-row" style="background-color: #fff0f0;">
                        <div class="expanded-content" style="display: flex">
                          <table  class="table table-sm" style="border: 2px 0px 0px 0px solid #000; border-collapse: collapse; z-index: 1">
                            
                            <thead>
                              <tr style="text-align: center">
                                <th style="background-color: #97b6b8" class="TEXTALI-left CTTABLEELPIS WIDTH-6 FSIZE-12px">N°</th>
                                <th style="background-color: #97b6b8" class="TEXTALI-left CTTABLEELPIS WIDTH-8 FSIZE-12px">NF-e</th>
                                <th style="background-color: #97b6b8" class="TEXTALI-left CTTABLEELPIS WIDTH-10 FSIZE-12px">Cod. Comp.</th>
                                <th style="background-color: #97b6b8" class="TEXTALI-left CTTABLEELPIS FSIZE-12px">Descrição</th>
                                <th style="background-color: #97b6b8" class="TEXTALI-center CTTABLEELPIS WIDTH-8 FSIZE-12px">Acond.</th>
                                <th style="background-color: #97b6b8" class="TEXTALI-left CTTABLEELPIS WIDTH-10 FSIZE-12px">Protocolo</th>
                                <th style="background-color: #97b6b8" class="TEXTALI-left CTTABLEELPIS WIDTH-4 FSIZE-12px">Qtd.</th>
                                <th style="background-color: #97b6b8" class="TEXTALI-left CTTABLEELPIS WIDTH-10 FSIZE-12px">Adicionais</th>
                              </tr>
                            </thead>

                            <tbody>
                              
                            <template v-for="tramiteFilhoInfos in itensTramite" :key="tramiteFilhoInfos.indice">

                              <tr>
                                <td class="TEXTALI-left CTTABLEELPIS WIDTH-6" style="background-color: #e0e0e0" :title="tramiteFilhoInfos.iD_Tramite_FILHO">
                                  {{ tramiteFilhoInfos.iD_Tramite_FILHO }}
                                </td>
                                <td class="TEXTALI-left CTTABLEELPIS WIDTH-8" style="background-color: #e0e0e0" :title="tramiteFilhoInfos.cNumNFE">
                                  {{ tramiteFilhoInfos.cNumNFE }}
                                </td>
                                <td class="TEXTALI-left CTTABLEELPIS WIDTH-10" style="background-color: #e0e0e0" :title="tramiteFilhoInfos.cCodComponente">
                                  {{ tramiteFilhoInfos.cCodComponente }}
                                </td>
                                <td v-if="!tramiteFilhoInfos.iD_Tramite_Item_Operacao" class="TEXTALI-left CTTABLEELPIS WIDTH-30" style="background-color: #e0e0e0">
                                  {{ tramiteFilhoInfos.cNomeComponente }}
                                </td>
                                <td v-else class="TEXTALI-left CTTABLEELPIS WIDTH-30" style="background-color: #e0e0e0">
                                  {{ `${tramiteFilhoInfos.cNomeComponente} | ${tramiteFilhoInfos.cTipoOperacao} | ${tramiteFilhoInfos.cInfoGenerica}` }}
                                </td>
                                <td class="TEXTALI-center CTTABLEELPIS WIDTH-10" style="background-color: #e0e0e0" :title="tramiteFilhoInfos.acondicionamento">
                                  {{ tramiteFilhoInfos.acondicionamento }}
                                </td>
                                <td class="TEXTALI-left CTTABLEELPIS WIDTH-10" style="background-color: #e0e0e0" :title="tramiteFilhoInfos.cProtocoloProduto">
                                  {{ tramiteFilhoInfos.cProtocoloProduto }}
                                </td>
                                <td class="TEXTALI-center CTTABLEELPIS WIDTH-4" style="background-color: #e0e0e0" :title="tramiteFilhoInfos.iQtdeComponente">
                                  {{ tramiteFilhoInfos.iQtdeComponente }}
                                </td>
                                <td class="TEXTALI-left CTTABLEELPIS WIDTH-12" style="background-color: #e0e0e0" :title="tramiteFilhoInfos.cAdicionaisProduto">
                                  {{ tramiteFilhoInfos.cAdicionaisProduto }}
                                </td>
                              
                              </tr>
                              
                            </template>

                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>

                  </template>

                </tbody>

              </table>

            </div>

            <div class="WIDTH-100 HEIGHT-5">
              
              <LayoutPaginacaoTabelas
                v-model:currentPage="paginaAtual"
                :totalPages="totalPaginas"
                @page-change="() => getTramitesPai()"
                :enabled="tabelaTRAMITEsCarregada"
              />

            </div>
          
          </div>

        </div>

        <!-- RODAPÉ - Botões -->
        <div class="D-flex ALITEM-center HEIGHT-12 WIDTH-98 BGC-cinza-9 MARGIN-T5 BOR-SensacaoAfundado PADDING-T5-R10-B5-L10" >

          <div class="WIDTH-50 HEIGHT-100 D-flex FD-column JC-flex-end ALITEM-flex-start">
            <div class="WIDTH-100 HEIGHT-50 D-flex ALITEM-center JC-space-between">
              <button
                class="btn btn-lote-exp PADDING-4 WIDTH-24 FSIZE-14px D-flex JC-center ALITEM-center"
                @click="OpenUpdateModal('AdicionandoTramiteLoteExp')"
              >
                + LOTE EXPEDIÇÃO
              </button>
            </div>
          </div>

        </div>

      </div>

      <Rodape />

    </div>

  </main>

</template>

<style scoped>
.imagem-container {
  width: 10%;
  max-width: 300px; 
  overflow: hidden;
  margin: 0 auto;
}

.botoes-final {
	margin-top: 1%;
	margin-left: 1%;
	margin-right: 1%;
	margin-bottom: 1%;
	width: 200px; /* Ajuste a largura do botão */
	height: 40px; /* Ajuste a altura do botão */
	border: 1px solid #ccc; /* Adicione uma borda ao botão */
	border-radius: 10px;
	background-color: #eaf3f5; /* Cor de fundo do botão */
	display: flex; /* Usa flexbox para alinhamento */
	align-items: center; /* Centraliza o conteúdo verticalmente */
	justify-content: center; /* Centraliza o conteúdo horizontalmente */
	box-sizing: border-box; /* Inclui a borda e o preenchimento na largura e altura totais do botão */
}

.botoes-final h1 {
	font-size: 0.7rem;
	margin-top: 7.5%;
}

.botoes-final:hover {
	background-color: #dad9d9; /* Muda a cor de fundo ao passar o mouse */
}

.imagem-container img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  display: block;
  border-radius: 8px; 
}

.img-wrapper-carga {
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-carga {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.img-wrapper-carga a {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
  
.object-fit-contain {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Estilo para o botão que contém o ícone de lupa */
.custom-button {
  background-color: #dadada; /* Cor de fundo do botão */
  border: none; /* Remove borda padrão */
  padding: 2px; /* Espaçamento interno  */
  border-radius: 25%; /* Torna o botão redondo */
  cursor: pointer; /* Mostra cursor de ponteiro ao passar o mouse */
  display: flex; /* Usa flexbox para alinhar o ícone */
  align-items: center; /* Alinha verticalmente o ícone */
  justify-content: center; /* Centraliza o ícone */
  transition: background-color 0.3s ease; /* Animação de transição suave */
  outline: none; /* Remove a borda padrão de foco */
  width: 20px;
  height: 20px;
}

/* Efeito hover (quando o usuário passa o mouse) */
.custom-button:hover {
  background-color: #e0e0e0; /* Muda a cor de fundo ao passar o mouse */
}

/* Efeito focus (quando o botão é focado com o teclado) */
.custom-button:focus {
  outline: 2px solid #4CAF50; /* Adiciona uma borda verde ao focar */
}

/* Estilo para o ícone dentro do botão */
.custom-button svg {
  width: 10px; /* Largura do ícone */
  height: 10px; /* Altura do ícone */
  fill: #333; /* Cor do ícone */
}

/* Efeito de clique (quando o botão é pressionado) */
.custom-button:active {
  background-color: #d0d0d0; /* Muda a cor de fundo ao clicar */
  transform: scale(0.95); /* Reduz o botão um pouco para efeito de clique */
}

.buttonTableTramiteItem:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.buttonTableTramiteItem {
  transition: opacity 0.3s ease;
}

.buttonTableEntradas:disabled {
  background-color: #e0e0e0;
  color: #999;
  border-color: #ccc;
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-lote-exp {
  background-color: #000;
  color: #ffc107;
  border-color: #000;
}

.btn-lote-exp:hover,
.btn-lote-exp:focus {
  background-color: #000;
  color: #ffc107;
  border-color: #000;
}

.table-padding {
  padding: 0.5rem;          /* espaço da parede */
}

.CARD-Afundado-Subtil {
  border-radius: 8px;

  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.15),
    inset 0 -1px 1px rgba(255, 255, 255, 0.25);

  border: 1px solid rgba(0, 0, 0, 0.08);
}

.btn-cancelados {
  position: relative;

  background-color: #ff4d4f; /* vermelho vivo e moderno */

  color: #ffffff;

  border: none;
  border-radius: 6px;

  font-size: 14px;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.btn-cancelados:hover {
  background-color: #e63946; /* vermelho mais forte no hover */
  box-shadow: 0 0 0 2px rgba(255, 76, 76, 0.25);
}

.btn-cinza-notificacao {
  position: relative;

  background-color: #6b7280;

  color: #ffffff;

  border: none;
  border-radius: 6px;

  font-size: 14px;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.btn-cinza-notificacao:hover {
  background-color: #4b5563;
  box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.25);
}

/* Badge de notificação */
.btn-badge {
  position: absolute;
  top: -6px;
  right: -6px;

  min-width: 10px;
  height: 15px;
  padding: 0 6px;

  background-color: #d90429; /* vermelho notificação */
  color: #ffffff;

  border-radius: 50%;

  font-size: 9px;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 0 0 2px #ffffff;
}

.pedido-nao-selecionavel {
  background-color: rgba(255, 0, 0, 0.08);
}

/* Quando também for linha alternada */
.pedido-nao-selecionavel.BGC-cinza-8 {
  background-color: rgba(255, 0, 0, 0.16);
}

/* ===== BODY ===== */

.modal-body-custom {
  display: flex;
  flex-direction: column;
  height: 80vh;
  padding: 24px 28px;
  background-color: #f5f6f8; /* cinza corporativo claro */
}

/* HEADER INTERNO */

.body-header {
  margin-bottom: 20px;
}

.body-title {
  font-size: 18px;
  font-weight: 600;
  color: #2f2f2f;
  margin-bottom: 4px;
}

.body-subtitle {
  font-size: 13px;
  color: #6c757d;
}

/* CONTEÚDO */

.body-content {
  flex: 1;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 18px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  overflow: auto;
}

/* TABELA */

.table-container {
  overflow: hidden; /* mata o scroll */
}

.table-container.com-scroll {
  overflow-y: auto;
}

.table-container tbody tr { height: var(--row-h, 30px); }
.table-container tbody td { height: var(--row-h, 30px); }
.table-container .loading-elements { margin: 0; }


/* ESTADO ASSINATURA */

.assinatura-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.assinatura-box {
  background-color: #ffffff;
  padding: 40px 60px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
  max-width: 600px;
}

.assinatura-icon i {
  font-size: 42px;
  color: #6c757d;
  margin-bottom: 16px;
}

.assinatura-title {
  font-size: 32px;
  font-weight: 600;
  color: #2f2f2f;
  margin-bottom: 8px;
}

.assinatura-text {
  font-size: 28px;
  color: #6c757d;
}

.btn-compact {
  padding: 4px 6px;      /* controla a altura real */
  line-height: 1;        /* evita espaço extra vertical */
  min-height: unset;     /* remove altura mínima do bootstrap */
}

.btn-soft {
  background: rgba(124, 122, 122, 0.65);
  border: 1px solid rgba(192, 192, 192, 0.65);
  color: #ffffff;
}

.btn-soft:hover {
  background:rgba(124, 122, 122, 1);
}
</style>