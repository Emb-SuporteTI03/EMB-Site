<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRoute } from 'vue-router'
import { shortenInfo, applyTableStipedRows, GetGenerico, getStatusClass } from '~/composables/visualization';
import { ToastSuccess, ToastError, ToastWarning } from '~/composables/toasts';

// VARIÁVEIS ------------------------------------------------------------------------------------------------------------
  const isERP = ref(true);  // Sistema interno
  // const isERP = ref(false); // Sistema externo

  // Rota para obter o ID do cliente
  const urlProd = useUrlProd();
  const urlSistema = useUrlProdSistema();
  const route = useRoute();
  const urlBase = useUrlProd();

  // ===============================
  // SOMENTE PINIA (SEM isERP)
  // ===============================

  const userID_Unidade = ref(authStore.ID_Unidade).value;
  const userNome = ref(authStore.nome);
  const siglaUsuario = ref(authStore.sigla);
  const ID_Area = ref(authStore.ID_Unidade ?? 0);
  const ID_Carteira = ref(authStore.ID_Carteira ?? 0);
  const token = ref(authStore.token ?? "");

  // ===============================
  // REGRA HÍBRIDA (ERP = PINIA | EXTERNO = sessionStorage)
  // ===============================

  const userID = computed(() => {
    if (isERP.value) {
      return userID_Unidade ?? null
    }

    const value = Number(sessionStorage.getItem('iD_ResponsavelInformaEntregaExterno'))
    return isNaN(value) ? null : value
  });

  const transpID = computed(() => {
    if (isERP.value) {
      return authStore.ID_Carteira ?? null
    }

    const value = Number(sessionStorage.getItem('ID_Carteira'))
    return isNaN(value) ? null : value
  });

  const transpcNmFantasia = computed(() => {
    if (isERP.value) {
      return authStore.cNmFantasiaTransp ?? null
    }

    return sessionStorage.getItem('cNmFantasiaTransp')
  });

  const maxDataHoraAtual = computed(() => {
    const now = new Date();

    const pad = (n) => String(n).padStart(2, "0");

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  });
  
  const cliente = ref({});
  const logoPath = `/CLIENTES/${ID_Carteira.value}.png`;
  const carregandoPDF = ref(false);
  const router = useRouter();

  const isTabelaPedidosCarregada = ref(false);
  const selectedClienteREF = ref();
  const arquivoSelecionado = ref(null);
  const fileInput = ref(null);
  const excluirFoto = ref(false);
  const isDragging = ref(false);
  const preview = ref(null);

  const infoPedidosPossiveis = ref([]);
  const staticinfoPedidosPossiveis = ref([]); // Para manter os dados originais e poder limpar os filtros

  const tabelaPedidoItensCarregada = ref(false);
  const infoPedidosItens = ref([]);
  const infoPedidosItensSelecionados = ref([]);

  const pedidoSelecionadoCorreios = ref({
    iD_Pedido: 0,
    cGuiaRemessa: '',
    cNumPedido: '',
    cCodigoRastreio: ''
  });

  const infoStatus = ref([
    {iD: 6, cNome: "EM ROTA"}, {iD: 7, cNome: "ENTREGUE"}
  ]);
  const infoTransportadorasHomologadas = ref([]);

  const selectedCK = ref(null);
  const selectedCliente = ref({iD: 0, cNome: ""});
  const selectedNF = ref(null);
  const selectedGuiaRemessa = ref(null);
  const selectedTramite = ref(null);
  const selectedTransportadora = ref({iD: 0, cNome: ''});
  const selectedStatus = ref({iD: 0, cNome: ''});
  const selectedTranspFiltro = ref({iD: 0, cNome: ''});

  const selectedStatusREF = ref(null);
  const selectedTransportadoraREF = ref(null);
  
  const infosEtapasSistemicas = ref([]);

  const isLoadingEXCELRelatorio = ref(false);
  const isLoadingPDFRelatorio = ref(false);

  const mostrarTodosPedidosPossiveis = ref(false);
  const mostrarTodosPedidosSelecionados = ref(false);
  const tituloModalPdfs = ref("");

  const isButtonTranspSelecionado = ref(true);
  const isButtonCorreiosSelecionado = ref(false);

  const linhaExpandidaDaTabelaPedidosPossiveis = ref(null);
  const linhaExpandidaDaTabelaPedidosSelecionados = ref(null);

  const InformarEmRotaEntregueRequestDTO = ref({
    iD_StatusAPIInformado: null,
    iD_Carteira: null,
    iD_Transportadora: null,
    dEntregaInformada: null,
    cNomeRecebedor: null,
    cDocRecebedor: null,
    imagem: null,
    iD_ResponsavelInformarEntrega: null,
    isERP: false,
    listaIDsPedidos: []
  });

  // PARA A BARRA DE TOTAL FICAR CORRETAMENTE ALINHADA ===========================\
  const compensacaoScrollPossiveis = ref('17');
  const compensacaoScrollSelecionados = ref('17');
  const paddingTabela = ref('0.25rem');
  const tabelaWrapperPossiveis = ref(null);
  const tabelaWrapperSelecionados = ref(null);

  const ajustarCompensacaoScrollPossiveis = () => {
    const el = tabelaWrapperPossiveis.value;
    if (!el) return;

    const temScroll =
      el.scrollHeight > el.clientHeight;

    compensacaoScrollPossiveis.value = temScroll
      ? el.offsetWidth - el.clientWidth
      : 0;
  };

  const ajustarCompensacaoScrollSelecionado = () => {
    const el = tabelaWrapperSelecionados.value;
    if (!el) return;

    const temScroll =
    el.scrollHeight > el.clientHeight;
    
    compensacaoScrollSelecionados.value = temScroll
    ? el.offsetWidth - el.clientWidth
    : 0;
  };

  const AjustaRodapeTabela = async () => {
    await nextTick();
    ajustarCompensacaoScrollPossiveis();
    ajustarCompensacaoScrollSelecionado();
  };
  // ==============================================================================/

  // FUNÇÕES ---------------------------------------------------------------------------------------------------------------
  const transitionName = computed(() =>
    isButtonCorreiosSelecionado.value
      ? 'slide-left'
      : 'slide-right'
  );
  const isButtonDisabled = computed(() => {
    // Sempre obrigatórios
    if (
      !selectedStatus?.value?.iD ||
      !selectedTransportadora?.value?.iD ||
      !InformarEmRotaEntregueRequestDTO.value.dEntregaInformada
    ) {
      return true
    }

    // Se for ENTREGA (7), nome e documento são obrigatórios
    if (selectedStatus.value.iD === 7) {
      return (
        !InformarEmRotaEntregueRequestDTO.value.cNomeRecebedor ||
        !InformarEmRotaEntregueRequestDTO.value.cDocRecebedor
      )
    }

    // Para EM ROTA (6) ou outros status válidos
    return false
  });

  // Computeds ----------------\
  const cksUnicas = computed(() => {
    if (!infoPedidosPossiveis.value.filter(x => x.bSelecionado === false)) return []
    return [...new Set(infoPedidosPossiveis.value.filter(x => x.bSelecionado === false).map(e => e.cCK))]
      .filter(Boolean) // tira undefined/nulos
      .map(c => ({ label: c, value: c }))
  });
  const clientesUnicos = computed(() => {
    if (!infoPedidosPossiveis.value.filter(x => x.bSelecionado === false)) return []
    return [...new Set(infoPedidosPossiveis.value.filter(x => x.bSelecionado === false).map(e => e.cNmFantasia))]
      .filter(Boolean) // tira undefined/nulos
      .map(c => ({ iD: c, cNome: c }))
  });
  const nfsUnicas = computed(() => {
    if (!infoPedidosPossiveis.value.filter(x => x.bSelecionado === false)) return []
    return [...new Set(infoPedidosPossiveis.value.filter(x => x.bSelecionado === false).map(e => e.cNumNFe))]
      .filter(Boolean) // tira undefined/nulos
      .map(c => ({ label: c, value: c }))
  });
  const guiasRemessasUnicas = computed(() => {
    if (!infoPedidosPossiveis.value.filter(x => x.bSelecionado === false)) return []
    return [...new Set(infoPedidosPossiveis.value.filter(x => x.bSelecionado === false).map(e => e.cGuiaRemessa))]
      .filter(Boolean) // tira undefined/nulos
      .map(c => ({ label: c, value: c }))
  });
  const tramitesUnicos = computed(() => {
    if (!infoPedidosPossiveis.value.filter(x => x.bSelecionado === false)) return []
    return [...new Set(infoPedidosPossiveis.value.filter(x => x.bSelecionado === false).map(e => e.cTramite))]
      .filter(Boolean) // tira undefined/nulos
      .map(c => ({ label: String(c), value: c }))
  });
  const transportadorasUnicas = computed(() => {
    if (!infoPedidosPossiveis.value.filter(x => x.bSelecionado === false)) return []
    return [...new Set(infoPedidosPossiveis.value.filter(x => x.bSelecionado === false).map(e => e.cNomeTransportadora))]
      .filter(Boolean) // tira undefined/nulos
      .map(c => ({ iD: c, cNome: c }))
  });

  const infoPedidosPossiveisSlice = computed(() => {
    return mostrarTodosPedidosPossiveis.value
      ? infoPedidosPossiveis.value
      : infoPedidosPossiveis.value.slice(0, 50)
  });
  const totalQuantidadeItensPossiveis = computed(() => {
    return infoPedidosPossiveis.value.filter(x => x.bSelecionado === false).reduce((acc, e) => acc + (Number(e.iQtdeItens) || 0), 0);
  });
  const totalQuantidadeVolumesPossiveis = computed(() => {
    return infoPedidosPossiveis.value.filter(x => x.bSelecionado === false).reduce((acc, e) => acc + (Number(e.iVolume) || 0), 0);
  });
  const totalQuantidadeItensSelecionados = computed(() => {
    return staticinfoPedidosPossiveis.value.filter(x => x.bSelecionado === true).reduce((acc, e) => acc + (Number(e.iQtdeItens) || 0), 0);
  });
  const totalQuantidadeVolumesSelecionados = computed(() => {
    return staticinfoPedidosPossiveis.value.filter(x => x.bSelecionado === true).reduce((acc, e) => acc + (Number(e.iVolume) || 0), 0);
  });
  // --------------------------/
  
  const DefineCliente = async () => {
    if (isERP.value) {
      const url = `${urlProd}/sistema/carteira/com-join/${ID_Carteira.value}`;
        try {
          const response = await axios.get(url,
          { headers: { Authorization: `Bearer ${token.value}` }, }
        );
        const { iD_Carteira, cNmFantasia } = response.data;

        selectedCliente.value.iD = iD_Carteira;
        selectedCliente.value.cNome = cNmFantasia;
      } catch (err) {
        console.error(err);
      } finally {
        selectedClienteREF.value?.desabilitar();
      }
    } 
  };

  // MODAL 
  const abrirModalEtapasSistema = async (ID_Pedido) => {
    showModal('EtapasSistemaModal', true);

    await getEtapasSistemicas(ID_Pedido);
  };
  const abrirModalVisualizaPDFs = async (ID_Pedido, TipoPDF) => {
    
    tituloModalPdfs.value = TipoPDF;
    
    showModal('VisualizarPDFs', true);
    
    carregandoPDF.value = true

    if(TipoPDF == 'PDF DANFE'){
      await getPDFDanfe(ID_Pedido);
    } else if(TipoPDF == 'PDF PEDIDO'){
      await getPDFPedido(ID_Pedido);
    }

    carregandoPDF.value = false

  };
  const fecharModalEtapasSistema = () => {
    showModal('EtapasSistemaModal', false);
  }
  const fecharModalVisualizaPDFs = () => {
    showModal('VisualizarPDFs', false);
  }
  const getPDFPedido = async (ID_Pedido) => {
    try {
      const response = await axios.post(
        `${urlBase.value}/consultas-sla/visualiza-baixa-pdf-pedido/${ID_Pedido}/1`,
        null,
        {
          headers: { Authorization: `Bearer ${token.value}` },
          responseType: 'blob' // importante para tratar como arquivo binário
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const iframe = document.getElementById("iframePDF");
      iframe.src = url;

    } catch (err) {
      console.error("Erro ao buscar PDF Pedido", err);
    }
  };
  const getPDFDanfe = async (ID_Pedido) => {
    try {
      const response = await axios.post(
        `${urlBase.value}/consultas-sla/visualiza-baixa-pdf-danfe/${ID_Pedido}/1`,
        null,
        {
          headers: { Authorization: `Bearer ${token.value}` },
          responseType: 'blob' // importante para tratar como arquivo binário
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const iframe = document.getElementById("iframePDF");
      iframe.src = url;

    } catch (err) {
      console.error("Erro ao buscar PDF Danfe", err);
    }
  };

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };


  // FUNÇÕES DO FILTRO
  const aplicarFiltros = async () => {
    const normalize = (val) => (val != null ? val.toString().toLowerCase() : '');

    const ck          = normalize(selectedCK.value?.value);
    const notaFiscal  = normalize(selectedNF.value?.value);
    const guiaRemessa = normalize(selectedGuiaRemessa.value?.value);
    const tramite     = normalize(selectedTramite.value?.value);
    const cliente     = normalize(selectedCliente.value?.cNome);
    const transp      = normalize(selectedTranspFiltro.value?.cNome);

    infoPedidosPossiveis.value = staticinfoPedidosPossiveis.value.filter(comp => {
      return (
        (ck          ? normalize(comp.cCK).includes(ck) : true) &&
        (notaFiscal  ? normalize(comp.cNumNFe).includes(notaFiscal) : true) &&
        (guiaRemessa ? normalize(comp.cGuiaRemessa).includes(guiaRemessa) : true) &&
        (tramite     ? normalize(comp.cTramite).includes(tramite) : true) &&
        (transp      ? normalize(comp.cNomeTransportadora).includes(transp) : true) &&
        (
          isERP.value
            ? true
            : (cliente ? normalize(comp.cNmFantasia).includes(cliente) : true)
        )
      );
    });

    await AjustaRodapeTabela();
  };

  const onClickButtonCorreios = async () => {
    isTabelaPedidosCarregada.value = false;

    // Se clicar no botão CORREIOS e CORREIOS estiver selecionado, não faz nada:
    if (!isButtonCorreiosSelecionado.value) {
      isButtonCorreiosSelecionado.value = !isButtonCorreiosSelecionado.value;
      // Busca as infos do correios:
      linhaExpandidaDaTabelaPedidosPossiveis.value = null;
      await FetchPedidosPossiveisInformarEntregaCorreios();
      onClickLimparFiltros();
    }

    isButtonTranspSelecionado.value = false;
    linhaExpandidaDaTabelaPedidosSelecionados.value = null;
    atualizarEstilosBotoesTranspCorreios();
    aplicarFiltros();
    await AjustaRodapeTabela()
  };

  const onClickButtonTransportadoras = async () => {
    isTabelaPedidosCarregada.value = false;

    if (!isButtonTranspSelecionado.value) {
      isButtonTranspSelecionado.value = !isButtonTranspSelecionado.value;
      
      linhaExpandidaDaTabelaPedidosPossiveis.value = null;
      linhaExpandidaDaTabelaPedidosSelecionados.value = null;
      await FetchPedidosPossiveisInformarEntrega();
      onClickLimparFiltros();
    }
    
    isButtonCorreiosSelecionado.value = false;
    atualizarEstilosBotoesTranspCorreios();
    aplicarFiltros();
    await AjustaRodapeTabela()
  };
  const atualizarEstilosBotoesTranspCorreios = () => {
    isButtonCorreiosSelecionado.value
      ? aplicaEstiloSelecionado('somente-correios-button') 
      : removeEstiloSelecionado('somente-correios-button');

    isButtonTranspSelecionado.value
      ? aplicaEstiloSelecionado('somente-transp-button') 
      : removeEstiloSelecionado('somente-transp-button');
  };
  const aplicaEstiloSelecionado = (buttonID) => {
    const botao = document.getElementById(buttonID);
    botao?.classList.remove('BGC-branco', 'COLOR-black', 'BOR-grey');
    botao?.classList.add('BGC-amarelo-0', 'COLOR-white', 'BOR-amarelo');
  };
  const removeEstiloSelecionado = (buttonID) => {
    const botao = document.getElementById(buttonID);
    botao?.classList.remove('BGC-amarelo-0', 'COLOR-white', 'BOR-amarelo');
    botao?.classList.add('BGC-branco', 'COLOR-black', 'BOR-grey');
  };

  // REQUISIÇÕES
  async function getTransportadorasApenasSLA() {
    cliente.value = await GetGenerico(`${urlSistema.value}/carteira/com-join/${ID_Carteira.value}`, {}, token.value)
  };
  const FetchPedidosPossiveisInformarEntrega = async () => {
    // Inicia carregamento:
    isTabelaPedidosCarregada.value = false;
    const url = isERP.value ? `${urlProd}/sla/pedido-entrega/obter-pedido-possivel-informar-entrega/${ID_Carteira.value}` :
      `${urlProd}/sla/pedido-entrega/obter-pedido-possivel-informar-entrega-transp/${transpID}`;

    try {
      const response = await axios.get(url,
        { headers: { Authorization: `Bearer ${token.value}` }, }
      );
      infoPedidosPossiveis.value = response.data;
      staticinfoPedidosPossiveis.value = response.data;
      aplicarFiltros();
    } catch (err) {
      console.error(err);
    } finally {
      // Finaliza carregamento:
      isTabelaPedidosCarregada.value = true;
    }
  };
  const FetchPedidosPossiveisInformarEntregaCorreios = async () => {
    // Inicia carregamento:
    isTabelaPedidosCarregada.value = false;
    const url = `${urlProd}/sla/pedido-entrega/obter-pedido-possivel-informar-codigo-rastreio/${ID_Carteira.value}`;

    try {
      const response = await axios.get(url,
        { headers: { Authorization: `Bearer ${token.value}` }, }
      );

      infoPedidosPossiveis.value = response.data;
      staticinfoPedidosPossiveis.value = response.data;

      aplicarFiltros();
    } catch (err) {
      console.error(err);
    } finally {
      // Finaliza carregamento:
      isTabelaPedidosCarregada.value = true;
    }
  };
  async function getEtapasSistemicas(idPedido) {
    try {
      const response = await axios.get(`${urlProd}/consultas-sla/etapas-sistemicas/${idPedido}`, { headers: { Authorization: `Bearer ${token.value}` }, });
      infosEtapasSistemicas.value = response.data;

    } catch (response) {
      console.error("Erro ao buscar dados:");
    }
  };
  async function fetchEXCELSaidasSLA() {
    ToastWarning('Baixando EXCEL...');
    isLoadingEXCELRelatorio.value = true;
    try {
      // Garante array puro
      const payload = Array.isArray(infoPedidosPossiveis.value)
        ? toRaw(infoPedidosPossiveis.value)
        : [toRaw(infoPedidosPossiveis.value)];

      const url = `${urlProd}/consultas-sla/sla-saidas-excel`;

      const response = await axios.post(
        url,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          },
          responseType: 'blob',
          validateStatus: () => true // deixa a gente inspecionar respostas não-200
        }
      );

      // Falha? tente ler corpo como texto pra ver erro do backend/gateway
      if (response.status !== 200) {
        const msg = await response.data.text();
        throw new Error(`HTTP ${response.status} - ${msg}`);
      }

      // Sanidade: checa se é Excel (ou pelo menos ZIP: "PK")
      const contentType = response.headers['content-type'] || '';
      const blob = response.data;
      const header = await blob.slice(0, 4).arrayBuffer();
      const isZip = String.fromCharCode(...new Uint8Array(header)) === 'PK\u0003\u0004';
      if (!/officedocument\.spreadsheetml\.sheet|octet-stream/i.test(contentType) && !isZip) {
        const txt = await blob.text();
        console.error('Resposta não-Excel:', txt);
        throw new Error('Servidor não retornou um Excel (veja o console).');
      }

      // Nome do arquivo (se vier)
      let fileName = `SLA_SAIDAS_${cliente.value.cNmFantasia}.xlsx`;
      const cd = response.headers['content-disposition'];
      if (cd) {
        const m = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(cd);
        if (m) fileName = decodeURIComponent(m[1]);
      }

      // Baixa
      const dlUrl = URL.createObjectURL(
        new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      );
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(dlUrl);

    } catch (error) {
      console.error('Erro ao gerar Excel:', error);
    }
    isLoadingEXCELRelatorio.value = false;
  };
  async function fetchPDFSaidasSLA() {
    ToastWarning('Baixando PDF...');

    isLoadingPDFRelatorio.value = true;
    try {
      // Garante array puro
      const payload = Array.isArray(infoPedidosPossiveis.value)
        ? toRaw(infoPedidosPossiveis.value)
        : [toRaw(infoPedidosPossiveis.value)];

      const url = `${urlProd}/consultas-sla/sla-saidas-pdf`; // <-- endpoint do PDF

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
          Accept: 'application/pdf'
        },
        responseType: 'blob',
        validateStatus: () => true
      });

      if (response.status !== 200) {
        const msg = await response.data.text();
        throw new Error(`HTTP ${response.status} - ${msg}`);
      }

      const blob = response.data;

      // Nome do arquivo
      let fileName = `SLA_SAIDAS_${cliente.value.cNmFantasia}.pdf`;
      const cd = response.headers['content-disposition'];
      if (cd) {
        const m = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(cd);
        if (m) fileName = decodeURIComponent(m[1]);
      }

      // Cria URL e força download
      const dlUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(dlUrl);

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
    isLoadingPDFRelatorio.value = false;
  };

  // FUNÇÕES AUXILIARES
  let onClickLimparFiltros = () => {
    selectedCK.value = null;
    selectedGuiaRemessa.value = null;
    selectedTramite.value = null;
    selectedNF.value = null;
    selectedTranspFiltro.value = null;

    infoPedidosPossiveis.value = staticinfoPedidosPossiveis.value;
    aplicarFiltros();
  };
  const toggleVerMaisPedidosPossiveis = () => {
    mostrarTodosPedidosPossiveis.value = !mostrarTodosPedidosPossiveis.value;
  }
  const toggleVerMaisPedidosSelecionados = () => {
    mostrarTodosPedidosSelecionados.value = !mostrarTodosPedidosSelecionados.value;
  };

  const IrParaRota = (rota) => {
    router.push(rota);
  };

  // const OnClickCheckBoxTabelaPossiveis = async (pedido) => {
  //   // 1️⃣ Todos os clientes dos pedidos já selecionados
  //   const clientesSelecionados = staticinfoPedidosPossiveis.value
  //     .filter(p => p.bSelecionado)
  //     .map(p => p.cNmFantasia);

  //   const clienteClicado = pedido.cNmFantasia;

  //   // 2️⃣ Verifica se existe algum cliente diferente
  //   const existeClienteDiferente = clientesSelecionados.some(
  //     c => c !== clienteClicado
  //   );

  //   if (existeClienteDiferente) {
  //     ToastWarning("Não é possível misturar clientes.");

  //     // 🔹 Reverte o v-model do checkbox
  //     pedido.bSelecionado = false;
  //     return;
  //   }

  //   // 3️⃣ Atualiza o static
  //   const pedidoSelecionadoStatic = staticinfoPedidosPossiveis.value
  //     .find(p => p.iD_Pedido === pedido.iD_Pedido);
  //   if (pedidoSelecionadoStatic) pedidoSelecionadoStatic.bSelecionado = pedido.bSelecionado;

  //   await AjustaRodapeTabela();
  // };

  const OnClickCheckBoxTabelaPossiveis = async (pedido) => {
    // 1️⃣ Pedidos já selecionados (exceto o que acabou de clicar, se estiver desmarcando)
    const pedidosSelecionados = staticinfoPedidosPossiveis.value
      .filter(p => p.bSelecionado && p.iD_Pedido !== pedido.iD_Pedido)

    const clienteClicado = pedido.cNmFantasia
    const transportadoraClicada = pedido.cNomeTransportadora

    // 2️⃣ Regra: não misturar clientes
    const existeClienteDiferente = pedidosSelecionados.some(
      p => p.cNmFantasia !== clienteClicado
    )

    if (existeClienteDiferente) {
      ToastWarning("Não é possível misturar clientes.")
      pedido.bSelecionado = false
      return
    }

    // 3️⃣ Regra: não misturar transportadoras
    const existeTransportadoraDiferente = pedidosSelecionados.some(
      p => p.cNomeTransportadora !== transportadoraClicada
    )

    if (existeTransportadoraDiferente) {
      ToastWarning("Não é possível misturar transportadoras.")
      pedido.bSelecionado = false
      return
    }

    // 4️⃣ Atualiza o static
    const pedidoSelecionadoStatic = staticinfoPedidosPossiveis.value
      .find(p => p.iD_Pedido === pedido.iD_Pedido)

    if (pedidoSelecionadoStatic) {
      pedidoSelecionadoStatic.bSelecionado = pedido.bSelecionado
    }

    await AjustaRodapeTabela()
  };

  const OnClickCheckBoxTabelaSelecionados = async (pedido) => {
    const pedidoSelecionadoStatic = staticinfoPedidosPossiveis.value
      .find(ped => ped.iD_Pedido === pedido.iD_Pedido);
    pedidoSelecionadoStatic.bSelecionado = false;
    
    const pedidoSelecionado = infoPedidosPossiveis.value
      .find(ped => ped.iD_Pedido === pedido.iD_Pedido);

    if (pedidoSelecionado) {
      pedidoSelecionado.bSelecionado = false;
    }

    await AjustaRodapeTabela();
  };

  // const OnClickSelecionarTodos = async () => {
  //   // 1️⃣ Pega os clientes dos pedidos já selecionados
  //   const clientesSelecionados = new Set(
  //     staticinfoPedidosPossiveis.value
  //       .filter(p => p.bSelecionado)
  //       .map(p => p.cNmFantasia)
  //   );

  //   // 2️⃣ Filtra os pedidos que ainda não foram selecionados
  //   const pedidosNaoSelecionados = infoPedidosPossiveis.value.filter(p => !p.bSelecionado);

  //   // 3️⃣ Define o cliente alvo
  //   let clienteAlvo = null;

  //   if (clientesSelecionados.size > 0) {
  //     // Se já existe pedido selecionado, pega o cliente existente
  //     clienteAlvo = Array.from(clientesSelecionados)[0];

  //     // Verifica se algum não selecionado é de outro cliente
  //     const clientesDiferentes = pedidosNaoSelecionados.some(
  //       p => p.cNmFantasia !== clienteAlvo
  //     );
  //     if (clientesDiferentes) {
  //       // 🚨 Emite warning e não seleciona nada
  //       ToastWarning("Não é possível misturar clientes.");
  //       return;
  //     }
  //   } else if (pedidosNaoSelecionados.length > 0) {
  //     // Se nenhum selecionado ainda, pega o primeiro cliente do não selecionado
  //     clienteAlvo = pedidosNaoSelecionados[0].cNmFantasia;

  //     // Verifica se existem múltiplos clientes entre os não selecionados
  //     const clientesDiferentes = pedidosNaoSelecionados.some(
  //       p => p.cNmFantasia !== clienteAlvo
  //     );
  //     if (clientesDiferentes) {
  //       ToastWarning("Não é possível selecionar pedidos de clientes diferentes.");
  //       return;
  //     }
  //   }

  //   // 4️⃣ Marca como selecionados apenas os pedidos do clienteAlvo
  //   infoPedidosPossiveis.value.forEach(ped => {
  //     if (!ped.bSelecionado && ped.cNmFantasia === clienteAlvo) {
  //       ped.bSelecionado = true;
  //     }
  //   });

  //   await AjustaRodapeTabela();
  // };

  const OnClickSelecionarTodos = async () => {
    const pedidosSelecionados = staticinfoPedidosPossiveis.value.filter(p => p.bSelecionado)
    const pedidosNaoSelecionados = infoPedidosPossiveis.value.filter(p => !p.bSelecionado)

    const resultado = validarNaoMisturarClienteETransportadora(pedidosSelecionados,pedidosNaoSelecionados);

    if (!resultado) return

    const { clienteAlvo, transportadoraAlvo } = resultado

    infoPedidosPossiveis.value.forEach(ped => {
      if (
        !ped.bSelecionado &&
        ped.cNmFantasia === clienteAlvo &&
        ped.cNomeTransportadora === transportadoraAlvo
      ) {
        ped.bSelecionado = true
      }
    })

    await AjustaRodapeTabela()
  };
  
  const validarNaoMisturarClienteETransportadora = (pedidosSelecionados, pedidosNaoSelecionados) => {
    // CLIENTE
    const clientes = new Set(pedidosSelecionados.map(p => p.cNmFantasia))
    let clienteAlvo = null

    if (clientes.size > 0) {
      clienteAlvo = Array.from(clientes)[0]

      if (pedidosNaoSelecionados.some(p => p.cNmFantasia !== clienteAlvo)) {
        ToastWarning('Não é possível misturar clientes.')
        return null
      }
    } else if (pedidosNaoSelecionados.length > 0) {
      clienteAlvo = pedidosNaoSelecionados[0].cNmFantasia

      if (pedidosNaoSelecionados.some(p => p.cNmFantasia !== clienteAlvo)) {
        ToastWarning('Não é possível selecionar pedidos de clientes diferentes.')
        return null
      }
    }

    // TRANSPORTADORA
    const transportadoras = new Set(
      pedidosSelecionados.map(p => p.cNomeTransportadora)
    )
    let transportadoraAlvo = null

    if (transportadoras.size > 0) {
      transportadoraAlvo = Array.from(transportadoras)[0]

      if (pedidosNaoSelecionados.some(p => p.cNomeTransportadora !== transportadoraAlvo)) {
        ToastWarning('Não é possível misturar transportadoras.')
        return null
      }
    } else if (pedidosNaoSelecionados.length > 0) {
      transportadoraAlvo = pedidosNaoSelecionados[0].cNomeTransportadora

      if (pedidosNaoSelecionados.some(p => p.cNomeTransportadora !== transportadoraAlvo)) {
        ToastWarning('Não é possível selecionar pedidos de transportadoras diferentes.')
        return null
      }
    }

    return { clienteAlvo, transportadoraAlvo }
  };

  const validacaoInfoStatus = () => {
    // Se qualquer pedido já tiver EM ROTA informado,
    // só deixa disponível ENTREGUE (7)
    const emRotaInformado = staticinfoPedidosPossiveis.value.filter(x => x.bSelecionado === true).some(x => x.dDataEmRota);

    if (emRotaInformado) {
      infoStatus.value = [
        { iD: 7, cNome: 'ENTREGUE' }
      ];
    } else {
      infoStatus.value = [
        { iD: 6, cNome: 'EM ROTA' },
        { iD: 7, cNome: 'ENTREGUE' }
      ];
    }
  };

  const OnClickInformarEntregaButton = async () => {
    validacaoInfoStatus();

    // NÃO DEIXAR INFORMAR A ENTREGA ANTES DO VALOOR DE EM ROTA MAIS RECENTE

    const pedidoSelecionado = staticinfoPedidosPossiveis.value.find(x => x.bSelecionado);
    if (!pedidoSelecionado) return;

    showModal('entregaModal', true);

    if (isERP.value) {
      selectedTransportadora.value = {
        iD: pedidoSelecionado.iD_Transportadora,
        cNome: pedidoSelecionado.cNomeTransportadora
      };
    } else {
      selectedTransportadora.value = {
        iD: transpID.value,
        cNome: transpcNmFantasia.value
      };
    }

    InformarEmRotaEntregueRequestDTO.value.iD_Transportadora = selectedTransportadora.value.iD;
    selectedTransportadoraREF.value?.desabilitar();

    setTimeout(() => {
      selectedStatusREF.value?.focusInput();
    }, 500);
  };

  const OnClickFecharModalInformarEntrega = () => {
    clearInfoModal();
  };

  const OnClickConfirmarEntregaButton = async () => {
    InformarEmRotaEntregueRequestDTO.value.iD_StatusAPIInformado = selectedStatus.value.iD;
    InformarEmRotaEntregueRequestDTO.value.iD_Carteira = selectedCliente.value.iD;
    // InformarEmRotaEntregueRequestDTO.value.iD_Transportadora = selectedTransportadora.value.id;

    InformarEmRotaEntregueRequestDTO.value.iD_ResponsavelInformarEntrega = userID.value;
    InformarEmRotaEntregueRequestDTO.value.isERP = isERP.value;
    InformarEmRotaEntregueRequestDTO.value.listaIDsPedidos =
      staticinfoPedidosPossiveis.value
        .filter(x => x.bSelecionado === true)
        .map(x => x.iD_Pedido);

    const deuCerto = await InformaEmRotaEntregueDB();

    if (deuCerto) {
      // Fecha o modal e limpa as variaveis:
      showModal('entregaModal', false);
      
      MetodosAposInserirClickEmConfirmarEntrega();
    } else {
      // Não fecha o modal:
      
    }
  };

  const clearInfoModal = () => {
    selectedStatus.value = null;
    selectedTransportadora.value = null;

    InformarEmRotaEntregueRequestDTO.value.iD_StatusAPIInformado = null;
    InformarEmRotaEntregueRequestDTO.value.iD_Carteira = null;
    InformarEmRotaEntregueRequestDTO.value.iD_Transportadora = null;
    InformarEmRotaEntregueRequestDTO.value.dEntregaInformada = null;
    InformarEmRotaEntregueRequestDTO.value.cNomeRecebedor = null;
    InformarEmRotaEntregueRequestDTO.value.cDocRecebedor = null;
    InformarEmRotaEntregueRequestDTO.value.imagem = null;
    InformarEmRotaEntregueRequestDTO.value.iD_ResponsavelInformarEntrega = null;
    InformarEmRotaEntregueRequestDTO.value.isERP = false;
    InformarEmRotaEntregueRequestDTO.value.listaIDsPedidos = [];

    removerImagem();
  };
  
  const MetodosAposInserirClickEmConfirmarEntrega = async () => {
    clearInfoModal();


    onClickLimparFiltros();
    await FetchPedidosPossiveisInformarEntrega();
    await FetchAllTransportadorasHomologadas();
    await AjustaRodapeTabela();
  }


  const InformaEmRotaEntregueDB = async () => {
    DisableButtonById('confirmar-informar-button', true);

    try {
      await axios.post(
        `${urlProd}/sla/pedido-entrega/informar-em-rota-entregue`,
        InformarEmRotaEntregueRequestDTO.value,
        { headers: { Authorization: `Bearer ${token.value}` } }
      );

      ToastSuccess('EM ROTA / ENTREGA INFORMADA COM SUCESSO');
      return true;
    } catch (error) {
      if (error?.response?.status === 400) {
        ToastWarning(error.response.data);
      } else {
        ToastError('ERRO AO INFORMAR EM ROTA / ENTREGA.\nCONSULTE A TI.');
      }
      return false;
    } finally { }
  };

  const onDragOver = () => {
    isDragging.value = true;
  };
  const onDragLeave = () => {
    isDragging.value = false;
  };
  const onFileDrop = (event) => {
    isDragging.value = false;
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange({ target: { files: [file] } });
    } else {
      ToastError('Por favor, insira apenas imagens!');
    }
  };
  const abrirInputArquivo = () => {
    fileInput.value.click();
  };
  const removerImagem = () => {
    arquivoSelecionado.value = null;
    preview.value = null;
    excluirFoto.value = true;
    InformarEmRotaEntregueRequestDTO.value.imagem = null;

    const input = document.getElementById('fileInput');
    if (input) input.value = '';
  };
  const handleFileChange = (event) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      arquivoSelecionado.value = null;
      preview.value = null;
      InformarEmRotaEntregueRequestDTO.value.imagem = null;
      return;
    }

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      ToastError("Por favor, selecione apenas imagens!");
      arquivoSelecionado.value = null;
      preview.value = null;
      InformarEmRotaEntregueRequestDTO.value.imagem = null;
      return;
    }

    arquivoSelecionado.value = file;

    // preview visual
    preview.value = URL.createObjectURL(file);

    excluirFoto.value = false;

    // 🔹 CONVERTE PARA BASE64 E JOGA NO DTO
    const reader = new FileReader();
    reader.onload = () => {
      // remove o header: data:image/jpeg;base64,
      InformarEmRotaEntregueRequestDTO.value.imagem =
        reader.result.split(',')[1];
    };
    reader.readAsDataURL(file);
  };

  const OnClickAnularSelecao = async () => {
    staticinfoPedidosPossiveis.value.forEach(ped => { ped.bSelecionado = false; });
    await AjustaRodapeTabela();
  };

  const FetchAllTransportadorasHomologadas = async () => {
    if (isERP) {
      try {
        const res = await axios.get(`${urlProd}/sla/pedido/transportadoras-homologadas/${ID_Carteira.value}`,
          { headers: { Authorization: `Bearer ${token.value}` } }
        );
        
        infoTransportadorasHomologadas.value = res.data;
      } catch (error) {
        console.error(error);
      } finally {  }
    } else {
      // Ai pega do usuario logado se for EXT (bloqueia o input tb):

    }
  };

  const OnChangeStatus = () => {
    InformarEmRotaEntregueRequestDTO.value.cDocRecebedor = '';
    InformarEmRotaEntregueRequestDTO.value.cNomeRecebedor = '';
    selectedTransportadoraREF.value?.desabilitar();
  };

  const OnChangeTransportadora = () => {
  };

  const FetchPedidoItens = async (ID_Pedido) => {
    tabelaPedidoItensCarregada.value = false;
    try {
      const res = await axios.get(`${urlProd}/sla/pedido-item/por-pedido/${ID_Pedido}`,
        { headers: { Authorization: `Bearer ${token.value}` } }
      );

      return res.data;
    } catch (error) {
      console.error(error);
    } finally {
      tabelaPedidoItensCarregada.value = true;
    }
  };

  const ativarSubLinhaPedidosPossiveis = async (ID_Pedido) => {
    if (linhaExpandidaDaTabelaPedidosPossiveis.value === ID_Pedido) {
      // Fecha todos:
      linhaExpandidaDaTabelaPedidosPossiveis.value = null; 
    } else {
      linhaExpandidaDaTabelaPedidosPossiveis.value = ID_Pedido;
      infoPedidosItens.value = await FetchPedidoItens(ID_Pedido); // Chama a função para buscar os itens do trâmite
    }
  };

  const ativarSubLinhaPedidosSelecionados = async (ID_Pedido) => {
    if (linhaExpandidaDaTabelaPedidosSelecionados.value === ID_Pedido) {
      // Fecha todos:
      linhaExpandidaDaTabelaPedidosSelecionados.value = null; 
    } else {
      linhaExpandidaDaTabelaPedidosSelecionados.value = ID_Pedido;
      infoPedidosItensSelecionados.value = await FetchPedidoItens(ID_Pedido); // Chama a função para buscar os itens do trâmite
    }
  };

  const OnClickTabelaCorreios = async (pedido) => {
    // Aqui deve abrir o modal, buscar as informações e ter uma maneira de inserir o código de rastreio
    showModal('codigoRastreioModal', true);

    pedidoSelecionadoCorreios.value.iD_Pedido = pedido.iD_Pedido; 
    pedidoSelecionadoCorreios.value.cGuiaRemessa = pedido.cGuiaRemessa; 
    pedidoSelecionadoCorreios.value.cNumPedido = pedido.cNumPedido; 
    pedidoSelecionadoCorreios.value.cCodigoRastreio = ''; 

    setTimeout(() => {
      FocusInputById('codigo-rastreio-input');
    }, 600);
  };

  const OnClickFecharModalInformarCodigoRastreio = () => {
    showModal('codigoRastreioModal', false);

    clearInfoModalcCodRastreio();
  };

  const OnClickConfirmarCodigoRastreioButton = async () => {
    DisableButtonById('confirmar-informar-codigo-rastreio-button', true);

    const deuCerto = await InformaCodigoRastreioDB();

    if (deuCerto) {
      // Fecha o modal e limpa as variaveis:
      showModal('codigoRastreioModal', false);
      
      MetodosAposInserirClickEmConfirmarCodigoRastreio();
    } else {
      // Não fecha o modal:
      
    }
  };

  const MetodosAposInserirClickEmConfirmarCodigoRastreio = async () => {
    clearInfoModalcCodRastreio();

    onClickLimparFiltros();

    await FetchPedidosPossiveisInformarEntregaCorreios();
    await AjustaRodapeTabela();
  };

  const clearInfoModalcCodRastreio = () => {
    pedidoSelecionadoCorreios.value.iD_Pedido = 0;
    pedidoSelecionadoCorreios.value.cGuiaRemessa = '';
    pedidoSelecionadoCorreios.value.cNumPedido = '';
    pedidoSelecionadoCorreios.value.cCodigoRastreio = '';
  };

  const InformaCodigoRastreioDB = async () => {
    const { iD_Pedido, cCodigoRastreio } = pedidoSelecionadoCorreios.value;
    try {
      await axios.post(
        `${urlProd}/sla/pedido-entrega/informar-codigo-rastreio/${iD_Pedido}/${cCodigoRastreio.toUpperCase()}`,
        {},
        { headers: { Authorization: `Bearer ${token.value}` } }
      );

      ToastSuccess('CÓDIGO RASTREIO INFORMADO COM SUCESSO');
      return true;
    } catch (error) {
      if (error?.response?.status === 400) {
        ToastWarning(error.response.data);
      } else {
        ToastError('ERRO AO INFORMAR CÓDIGO RASTREIO.\nCONSULTE A TI.');
      }
      return false;
    } finally { }
  };

  const docValido = (documento) => {
    if (!documento) return false;

    // Remove tudo que não é número
    const doc = documento.replace(/[^\d]+/g, '');

    if (doc.length === 11) {
      return validaCPF(doc);
    } else if (doc.length === 14) {
      return validaCNPJ(doc);
    }

    return false;
  };

  const validaCPF = (cpf) => {
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let resto = 11 - (soma % 11);
    let dig1 = resto >= 10 ? 0 : resto;

    if (dig1 !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = 11 - (soma % 11);
    let dig2 = resto >= 10 ? 0 : resto;

    return dig2 === parseInt(cpf.charAt(10));
  };
  const validaCNPJ = (cnpj) => {
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    const calc = (base, factors) =>
      factors.reduce((acc, factor, i) => acc + base[i] * factor, 0);

    const base = cnpj.substr(0, 12).split('').map(Number);
    const verifiers = cnpj.substr(12).split('').map(Number);

    const factor1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const factor2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const calcDigit = (sum) => (sum % 11 < 2 ? 0 : 11 - (sum % 11));

    const dig1 = calcDigit(calc(base, factor1));
    const dig2 = calcDigit(calc([...base, dig1], factor2));

    return dig1 === verifiers[0] && dig2 === verifiers[1];
  };
  const parseDataBR = (dataStr) => {
    if (!dataStr) return null

    const [data, hora] = dataStr.split(' ')
    const [dia, mes, ano] = data.split('/')
    const [h, m, s] = hora.split(':')

    return new Date(ano, mes - 1, dia, h, m, s)
  };
  const obterMaiorDataSelecionados = () => {

    const pedidosSelecionados = staticinfoPedidosPossiveis.value.filter(p => p.bSelecionado === true)

    let maiorData = null

    pedidosSelecionados.forEach(pedido => {
      const dataPedido = parseDataBR(pedido.dDataEmRota)

      if (!dataPedido) return

      if (!maiorData || dataPedido > maiorData) {
        maiorData = dataPedido
      }
    })

    return maiorData

  };
  const OnChangeDataEntrega = () => {
    const dataInformada = InformarEmRotaEntregueRequestDTO.value.dEntregaInformada
    if (!dataInformada) return

    const dataSelecionada = new Date(dataInformada)
    const agora = new Date()

    // Bloqueia futuro
    if (dataSelecionada > agora) {
      InformarEmRotaEntregueRequestDTO.value.dEntregaInformada = null
      ToastWarning('A data e hora da entrega não podem ser futuras.')
      return
    }

    // Bloqueia menor que a maior dos pedidos
    const maiorData = obterMaiorDataSelecionados()

    if (maiorData && dataSelecionada < maiorData) {
      InformarEmRotaEntregueRequestDTO.value.dEntregaInformada = null
      ToastWarning('A data deve ser maior ou igual à última movimentação dos pedidos selecionados.')
    }
  };


  const onBlurCPFCNPJ = () => {
    if(!InformarEmRotaEntregueRequestDTO.value.cDocRecebedor) return;
    if(!docValido(InformarEmRotaEntregueRequestDTO.value.cDocRecebedor) && InformarEmRotaEntregueRequestDTO.value.cDocRecebedor != "") {
      document.getElementById("doc-recebedor-input").focus();
      ToastWarning('Documento inválido.');
      InformarEmRotaEntregueRequestDTO.value.cDocRecebedor = '';
    }      
  };

  // MOUNTED DA PÁGINA
  onMounted(async () => {
    await DefineCliente();
    await FetchPedidosPossiveisInformarEntrega();
    await getTransportadorasApenasSLA();
    await FetchAllTransportadorasHomologadas();

    await AjustaRodapeTabela();
  });
</script>


<template>

  <!-- MODAL DE INFORMAR ENTREGA -->
  <div class="modal fade" id="entregaModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="entregaModalLabel">
    <div class="modal-dialog modal-xl WIDTH-35">
      <div class="modal-content" id="modalTableClick">

        <!-- CABEÇALHO  -->
        <div class="MAX-HEIGHT-8vh PADDING-T5-R10-B5-L10 D-flex JC-space-between ALITEM-center BOR-B-grey-5">
        
          <img src="assets\images\Logo-E-azul-enhanced.png" alt="Logo Grupo Embalarte" class="WIDTH-4 HEIGHT-4" title="Grupo Embalarte">
      
          <h1 class="modal-title fs-5 WIDTH-58 D-flex JC-center ALITEM-center" id="PDFsModalLabel">INFORMAR</h1>

          <!-- Botão de Fechar a modal -->
          <button id="insert-modal-close-button" @click="OnClickFecharModalInformarEntrega()"
            data-bs-dismiss="modal" type="button" class="btn-close" aria-label="Close">
          </button>

        </div>

        <!-- CORPO -->
        <div class="BOR-B-grey-2 D-flex FD-column PADDING-15" style="height: 77.5vh;">
    
          <!-- STATUS E DATA -->
          <div class="D-flex HEIGHT-8 WIDTH-100 JC-space-between ALITEM-flex-start">
            <!-- STATUS (EM ROTA/ENTREGUE) -->
            <BasicElementVue3SelectPequeno
              ref="selectedStatusREF"

              :options="infoStatus"
              optionLabel="cNome"
              v-model="selectedStatus"
              
              @update:modelValue="OnChangeStatus"

              label="STATUS"
              :titulo="selectedStatus?.cNome"

              :divClass="'WIDTH-54 col-1 MARGIN-T21-R5'"
              :selectClass="''"
              :labelClass="'FSIZE-12px MARGIN-T-15 red-asterisk'"
              :widthLista="''"
            />

            <!-- DATA -->
            <div class="WIDTH-45">
              <label
                id="data-informar-entrega-label"
                for="data-informar-entrega-input"
                :class="selectedStatus?.iD ? 'BGC-branco' : 'BGC-input-disabled'"
                class="form-label BORRAD-5 red-asterisk FSIZE-11px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
              >
                DATA E HORA ENTREGA
              </label>
              <input
                id="data-informar-entrega-input"
                type="datetime-local"
                @change="OnChangeDataEntrega"
                class="form-control BOR-grey MARGIN-T-10 FSIZE-12px InputUPPERCASE"
                v-model="InformarEmRotaEntregueRequestDTO.dEntregaInformada"
                :disabled="!selectedStatus?.iD"
                :max="maxDataHoraAtual"
                >

            </div>

          </div>

          <!-- TRANSPORTADORAS -->
          <div class="D-flex HEIGHT-8 WIDTH-100 JC-space-between">
            <!-- TRANSPORTADORAS (HOMOLOGADAS) -->
            <BasicElementVue3SelectPequeno
              ref="selectedTransportadoraREF"

              :options="infoTransportadorasHomologadas"
              optionLabel="cNome"
              v-model="selectedTransportadora"
              
              @update:modelValue="OnChangeTransportadora"

              label="TRANSPORTADORA"
              :titulo="selectedTransportadora?.cNome"

              :divClass="'WIDTH-101-05 col-1 MARGIN-T21-R5'"
              :selectClass="''"
              :labelClass="'FSIZE-12px MARGIN-T-15 red-asterisk'"
              :widthLista="''"
            />
          </div>
          
          <!-- NOME E DOC. RECEBEDOR -->
          <div class="D-flex HEIGHT-8 WIDTH-100 JC-space-between">
            <!-- NOME RECEBEDOR -->
            <div class="WIDTH-66">
              <label
                id="nome-recebedor-label"
                for="nome-recebedor-input"
                :class="[
                  selectedStatus?.iD === 7 ? 'BGC-branco' : 'BGC-input-disabled',
                  { 'red-asterisk': selectedStatus?.iD === 7 },
                  'form-label BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5'
                ]"
              >
                NOME RECEBEDOR
              </label>

              <input
                id="nome-recebedor-input"
                v-model="InformarEmRotaEntregueRequestDTO.cNomeRecebedor"
                type="text"
                :disabled="selectedStatus?.iD !== 7"
                class="form-control BOR-grey MARGIN-T-10 FSIZE-12px InputUPPERCASE"
              />
            </div>

            <!-- DOC. RECEBEDOR -->
            <div class="WIDTH-32">
              <label
                id="doc-recebedor-label"
                for="doc-recebedor-input"
                :class="[
                  selectedStatus?.iD === 7 ? 'BGC-branco' : 'BGC-input-disabled',
                  { 'red-asterisk': selectedStatus?.iD === 7 },
                  'form-label BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5'
                ]"
              >
                DOC. RECEBEDOR
              </label>

              <input
                id="doc-recebedor-input"
                v-model="InformarEmRotaEntregueRequestDTO.cDocRecebedor"
                type="text"
                :disabled="selectedStatus?.iD !== 7"
                class="form-control BOR-grey MARGIN-T-10 FSIZE-12px InputUPPERCASE"
              />
            </div>

          </div>

          <div v-if="selectedStatus?.iD === 7" class="D-flex FD-column JC-center ALITEM-center HEIGHT-70 BORRAD-8 PADDING-20 BOR-grey-1">

            <div class="HEIGHT-100 WIDTH-100">
              <!-- Se não tiver arquivo/foto ou preview é 204 -->
              <div v-if="!preview || preview === 204" class="HEIGHT-100 WIDTH-100 upload-area"
                  @click="abrirInputArquivo"
                  @dragover.prevent="onDragOver"
                  @dragleave.prevent="onDragLeave"
                  @drop.prevent="onFileDrop">
                <span>{{ isDragging ? 'Solte a imagem aqui...' : 'Clique ou arraste uma imagem' }}</span>
                <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" hidden>
              </div>

              <!-- Se tiver arquivo/foto válido -->
              <div v-else class="preview-container">
                <div class="image-wrapper">
                  <img :src="preview" alt="Imagem da entrega">
                  <button class="delete-button" @click="removerImagem">×</button>
                </div>
              </div>

            </div>

          </div>
          <div v-else class="D-flex FD-column JC-center ALITEM-center HEIGHT-70 BORRAD-8 PADDING-20 BOR-grey-1">
            <span class="FISE-40px FWEIGHT-bold FFAMILY-monospace">FOTO DO CANHOTO ASSINADO</span>
              <span class="FISE-40px FWEIGHT-bold FFAMILY-monospace"> APENAS PARA <span class="COLOR-blue">ENTREGA</span></span>
          </div>

          <!-- RODAPÉ -->
          <div class="HEIGHT-6 WIDTH-100 D-flex ALITEM-flex-end JC-space-between ">
            <div>
              <span class="FWEIGHT-bold FSIZE-14px"
              >({{ staticinfoPedidosPossiveis.filter(x => x.bSelecionado === true).length }}) PEDIDO(s)</span>
            </div>

            <button  
              :disabled="isButtonDisabled"
              type="button"
              id="confirmar-informar-button" 
              class="btn btn-success FSIZE-12px" 
              @click="OnClickConfirmarEntregaButton()"
            > 
              CONFIRMAR {{ selectedStatus?.iD === 7 ? 'ENTREGA' : selectedStatus?.iD === 6 ? 'EM ROTA' : '' }}
            </button>
          </div>

        </div>

      </div>
    </div>
  </div>

  <!-- MODAL DE INFORMAR CÓDIGO RASTREIO -->
  <div class="modal fade" id="codigoRastreioModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="codigoRastreioModalLabel">
    <div class="modal-dialog modal-xl WIDTH-35">
      <div class="modal-content" id="modalTableClick">

        <!-- CABEÇALHO  -->
        <div class="MAX-HEIGHT-8vh PADDING-T5-R10-B5-L10 D-flex JC-space-between ALITEM-center BOR-B-grey-5">
        
          <img src="assets\images\Logo-E-azul-enhanced.png" alt="Logo Grupo Embalarte" class="WIDTH-4 HEIGHT-4" title="Grupo Embalarte">
      
          <h1 class="modal-title fs-5 WIDTH-58 D-flex JC-center ALITEM-center" id="PDFsModalLabel">INFORMAR</h1>

          <!-- Botão de Fechar a modal -->
          <button id="insert-modal-close-button" @click="OnClickFecharModalInformarCodigoRastreio()"
            data-bs-dismiss="modal" type="button" class="btn-close" aria-label="Close">
          </button>

        </div>

        <!-- CORPO -->
        <div class="BOR-B-grey-2 D-flex FD-column PADDING-15" style="height: 20vh;">
    
          <!-- INFOS PEDIDOS -->
          <div class="D-flex HEIGHT-35 WIDTH-100 JC-center ALITEM-center">
            <span class="">Guia Remessa: <strong>{{ pedidoSelecionadoCorreios.cGuiaRemessa }}</strong> • Pedido: <strong>{{ pedidoSelecionadoCorreios.cNumPedido }}</strong></span>
          </div>

          <!-- CÓDIGO RASTREIO -->
          <div class="D-flex HEIGHT-35 WIDTH-100 JC-center ALITEM-center">
            <div class="WIDTH-60">
              <label
                id="codigo-rastreio-label"
                for="codigo-rastreio-input"
                class="form-label BORRAD-5 BGC-branco red-asterisk FSIZE-11px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
              >CÓDIGO RASTREIO
              </label>
              <input
                id="codigo-rastreio-input"
                type="text"
                class="form-control BOR-grey MARGIN-T-10 FSIZE-12px InputUPPERCASE"
                v-model="pedidoSelecionadoCorreios.cCodigoRastreio"
                maxlength="20"
                >

            </div>
          </div>

          <!-- RODAPÉ -->
          <div class="HEIGHT-30 WIDTH-100 D-flex ALITEM-flex-end JC-flex-end ">
            <button 
              :disabled="!pedidoSelecionadoCorreios.cCodigoRastreio"
              type="button"
              id="confirmar-informar-codigo-rastreio-button" 
              class="btn btn-success FSIZE-12px PADDING-4"  
              @click="OnClickConfirmarCodigoRastreioButton()"> CONFIRMAR CÓDIGO RASTREIO

            </button>
          </div>

        </div>

      </div>
    </div>
  </div>

  <!-- layout main da página -->
  <main class="D-flex">

    <!-- Todo o Conteúdo da página -->
    <div class="D-flex FD-column WIDTH-100 HEIGHT-100vh OFLOW-auto">

      <!-- Menu Superior -->
      <SetorProducaoSLAMenuSuperior 
        funcionalidadeProp="INFORMAR EM ROTA/ENTREGAS"
        :destinoVoltarProp="`/sla/cliente/saidas`"
        :srcFoto="logoPath"
      />
      
      <!-- ESPAÇO CORPO -->
      <div class="D-flex FD-column HEIGHT-90vh WIDTH-100 JC-center ALITEM-center BGC-cinza-9 BOR-branca">
        <!-- QUADRO BRANCO -->
        <div style="overflow-x: hidden;" class="D-flex FD-column ALITEM-center JC-center HEIGHT-95 WIDTH-98 BORRAD-5 BGC-branco PADDING-T5-B10">

          <!-- Filtros -->
          <div class="D-flex JC-space-between MIN-HEIGHT-15 HEIGHT-15 WIDTH-98 mb-1">

            <div class="D-flex WIDTH-100 JC-space-between">
              
              <!-- Decoração FILTROS -->
              <div class="WIDTH-6 BGC-azul-esverdeado COLOR-white ALITEM-center BORRAD-5 FWEIGHT-bold D-flex FD-column JC-space-between">
                <p>Filtros</p>
                <button type="button" class="btn btn-dark WIDTH-75 FSIZE-12px mb-1" @click="onClickLimparFiltros">Limpar</button>
              </div>

              <!-- DIV CENTRAL 1 -->
              <div class="D-flex WIDTH-18 FD-column ALITEM-center JC-space-between PADDING-T0-R5-B5-L5">
                <!-- CLIENTE -->
                <BasicElementVue3SelectPequeno
                  ref="selectedClienteREF"

                  :options="clientesUnicos"
                  optionLabel="cNome"
                  v-model="selectedCliente"

                  label="CLIENTE"
                  :titulo="selectedCliente ? selectedCliente.label : ''"

                  @update:modelValue="aplicarFiltros"

                  :divClass="'MARGIN-T21-R-8 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15-L-5'"
                  :widthLista="''"
                />
                
                <!-- Toggle de CORREIOS ou TRANSPORTADORAS -->
                <div class="WIDTH-100 TEXTALI-center HEIGHT-50">
                  <h5 class="FSIZE-14px">Mostrar na lista:</h5>
                  <div class=" D-flex JC-space-around ALITEM-center">
                    <div></div>
                    <button id="somente-transp-button" class="BORRAD-5  PADDING-T4-R0-B4-L0 FSIZE-11px BGC-amarelo-0 COLOR-white BOR-amarelo"
                      :class="isERP ? 'WIDTH-50' : 'WIDTH-90'"
                      @click="onClickButtonTransportadoras()"
                    >TRANSPORTADORAS</button>

                    <button v-if="isERP" id="somente-correios-button" class="BOR-grey BORRAD-5 PADDING-T4-R0-B4-L0 WIDTH-45 FSIZE-11px BGC-branco"
                      @click="onClickButtonCorreios()"
                    >CORREIOS</button>

                    <div></div>
                  </div>

                </div>
              </div>

              <!-- DIV CENTRAL 2 -->
              <div class="D-flex WIDTH-18 FD-column ALITEM-center JC-space-between PADDING-T0-R5-B5-L10 BOR-L-solidgrey-1">

                <!-- TRANSPORTADORA -->
                <BasicElementVue3SelectPequeno
                  ref="selectedTranspFiltroREF"

                  :options="transportadorasUnicas"
                  optionLabel="cNome"
                  v-model="selectedTranspFiltro"
                  
                  @update:modelValue="aplicarFiltros"

                  label="TRANSPORTADORA"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15-L-5'"
                  :widthLista="'500px'"
                />

                <!-- CK e TRAMITE -->
                <div class="WIDTH-100 D-flex JC-space-between ALITEM-center">
                  <!-- CK -->
                  <BasicElementVue3SelectPequeno
                    :options="cksUnicas"
                    v-model="selectedCK"

                    label="CK"
                    :titulo="selectedCK ? selectedCK.label : ''"

                    @update:modelValue="aplicarFiltros"

                    :divClass="'MARGIN-T21 WIDTH-50'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px MARGIN-T-15-L-5'"
                    :widthLista="''"

                    option-label="label"
                    option-value="value"
                  />

                  <!-- TRAMITE -->
                  <BasicElementVue3SelectPequeno
                    :options="tramitesUnicos"
                    v-model="selectedTramite"

                    label="TRÂMITE"
                    :titulo="selectedTramite ? selectedTramite.label : ''"

                    @update:modelValue="aplicarFiltros"

                    :divClass="'MARGIN-T21 WIDTH-50'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px MARGIN-T-15-L-5'"
                    :widthLista="''"

                    option-label="label"
                    option-value="value"
                  />
                </div>


              </div>

              <!-- DIV CENTRAL 3 -->
              <div class="D-flex WIDTH-18 FD-column JC-space-between PADDING-T0-R5-B5-L10 BOR-L-solidgrey-1">
                <!-- GUIA REMESSA -->
                <BasicElementVue3SelectPequeno
                  :options="guiasRemessasUnicas"
                  v-model="selectedGuiaRemessa"

                  label="GUIA REMESSA"
                  :titulo="selectedGuiaRemessa ? selectedGuiaRemessa.label : ''"

                  @update:modelValue="aplicarFiltros"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15-L-5'"
                  :widthLista="''"

                  option-label="label"
                  option-value="value"
                />

                <!-- NF -->
                <BasicElementVue3SelectPequeno
                  :options="nfsUnicas"
                  v-model="selectedNF"

                  label="NF"
                  :titulo="selectedNF ? selectedNF.label : ''"

                  @update:modelValue="aplicarFiltros"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15-L-5'"
                  :widthLista="''"

                  option-label="label"
                  option-value="value"
                />

              </div>

              <!-- DIV DIREITA - Botões -->
              <div class="WIDTH-40 HEIGHT-100 D-flex JC-flex-end ALITEM-flex-end">
                <!-- <div style="margin-right: 10px; cursor: pointer;" @click="FetchPedidosPossiveisInformarEntrega()" title="Atualizar informações">
                  <IconsRefresh
                    corProp="rgb(24, 134, 84)"
                    alturaProp="1.6"
                    larguraProp="1.6"
                  />
                </div> -->
                
                <!-- INFORMAR ENTREGA -->
                <!-- :to="`/sla/cliente/informar-entrega`" -->
                <!-- <NuxtLink
                :to="`/sla/cliente/informarEntregas`"
                class="WIDTH-22 MARGIN-R5">
                  <button
                    type="button"
                    class="btn btn-primary FSIZE-12px WIDTH-100"
                  >
                    Informar Entrega
                  </button>
                </NuxtLink> -->

                <!-- EXCEL -->
                <!-- <button :disabled="isLoadingEXCELRelatorio" id="exportar-EXCEL-button" type="button" class="btn btn-success MARGIN-R5 FSIZE-12px " @click="fetchEXCELSaidasSLA()">
                  <IconsExcel corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                  Exportar EXCEL</button> -->
                  
                <!-- PDF -->
                <!-- <button :disabled="isLoadingPDFRelatorio" id="exportar-PDF-button" type="button" class="btn btn-warning FSIZE-12px" @click="fetchPDFSaidasSLA()">
                  <IconsPDF corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                  Exportar PDF
                </button> -->

              </div>

            </div>

          </div>

          <transition :name="transitionName" mode="out-in">
            <!-- CORREIOS -->
            <div v-if="isButtonCorreiosSelecionado" key="correios"
              class="WIDTH-99 HEIGHT-84">
              <!-- Tabela CORREIOS -->
              <div class="WIDTH-100 HEIGHT-100 BORRAD-5 mb-1">

                <!-- Tabela -->
                <div class="BOR-SensacaoAfundado OFLOW-auto WIDTH-100 HEIGHT-100 BGC-branco">

                  <div class="WIDTH-100 HEIGHT-95 OFLOW-auto BGC-branco" ref="tabelaWrapperPossiveis">
                    <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5  table-fixed FSIZE-PADRAO-TABLE" style="overflow-x: hidden; width: 100%;">
                      
                      <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                        <tr>
                          <th class="WIDTH-2  TEXTALI-center no-wrap-text" scope="col"></th> <!-- + -->
                          <th class="WIDTH-7  TEXTALI-center no-wrap-text" scope="col">CK</th>
                          <th class="WIDTH-7  TEXTALI-center no-wrap-text" scope="col">TRÂMITE</th>
                          <th class="WIDTH-7  TEXTALI-center no-wrap-text" scope="col">NF</th>
                          <th class="WIDTH-10  TEXTALI-center no-wrap-text" scope="col">GUIA REMESSA</th>
                          <th class="WIDTH-10 TEXTALI-center no-wrap-text" scope="col">PEDIDO</th>
                          <th class="WIDTH-6  TEXTALI-center no-wrap-text" scope="col">OV</th>
                          <th class="WIDTH-4  TEXTALI-center no-wrap-text" scope="col">VOL.</th>
                          <th class="WIDTH-4 TEXTALI-center no-wrap-text" scope="col">ITENS</th>
                          <th class="WIDTH-11  TEXTALI-center no-wrap-text" scope="col">DESTINATÁRIO</th>
                          <th class="WIDTH-3  TEXTALI-center no-wrap-text" scope="col">UF</th>
                          <th class="WIDTH-6  TEXTALI-center no-wrap-text" scope="col">CEP</th>
                          <th class="WIDTH-22  TEXTALI-center no-wrap-text" scope="col">CÓDIGO RASTREIO</th>
                        </tr>
                      </thead>
                      
                      <LayoutTabelaCarregarEsqueleto
                        :Linhas="infoPedidosPossiveis.length === 0 ? 15 : infoPedidosPossiveis.length"
                        :Colunas=15 v-if="!isTabelaPedidosCarregada" />

                      <tbody v-if="isTabelaPedidosCarregada" class="BORRAD-5">
                      
                        <template v-for="(pedido, i) in infoPedidosPossiveis.filter(p => p.bSelecionado === false)" :key="pedido.iD_Pedido">

                        <!-- LINHA PRINCIPAL -->
                        <tr class="CURSOR-default BGC-H-cinza-8"
                          :class="applyTableStipedRows(i)"
                          :id="pedido.iD_Pedido"
                          >
                          <!-- @click="OnClickTabelaCorreios(pedido)" -->
                          <!-- Botão ver os itens -->
                          <td class="WIDTH-2 TEXTALI-center ALITEM-center no-wrap-text">
                            <button
                              title="Informar CÓDIGO de RASTREIO"
                              class="custom-button"
                              style="height: 15px; width: 15px; font-size: 12px;"
                              @click="OnClickTabelaCorreios(pedido)"
                              >
                              <IconsCaminhao corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                            </button>
                          </td>
                          <td class="WIDTH-7  TEXTALI-center no-wrap-text" :title="pedido.cCK" >{{ pedido.cCK }}</td>
                          <td class="WIDTH-7  TEXTALI-center no-wrap-text" :title="pedido.cTramite" >{{ pedido.cTramite }}</td>
                          <td class="WIDTH-7  TEXTALI-center no-wrap-text" :title="pedido.cNumNFe" >{{ pedido.cNumNFe }}</td>
                          <td class="WIDTH-10 TEXTALI-center no-wrap-text" :title="pedido.cGuiaRemessa" >{{ pedido.cGuiaRemessa }}</td>
                          <td class="WIDTH-10 TEXTALI-center no-wrap-text" :title="pedido.cNumPedido" >{{ pedido.cNumPedido }}</td>
                          <td class="WIDTH-6  TEXTALI-center no-wrap-text" :title="pedido.cOV" >{{ pedido.cOV }}</td>
                          <td class="WIDTH-4  TEXTALI-right  no-wrap-text" :title="pedido.iVolume" >{{ pedido.cVolume }}</td>
                          <td class="WIDTH-4  TEXTALI-right  no-wrap-text" :title="pedido.iQtdeItens" >{{ pedido.cQtdeItens }}</td>
                          <td class="WIDTH-11 TEXTALI-left   CTTABLEELPIS" :title="pedido.cDestinatario" >{{ pedido.cDestinatario }}</td>
                          <td class="WIDTH-3  TEXTALI-center no-wrap-text" :title="pedido.cUF" >{{ pedido.cUF }}</td>
                          <td class="WIDTH-6  TEXTALI-center no-wrap-text" :title="pedido.cCEP" >{{ pedido.cCEP }}</td>
                          <td class="WIDTH-22 TEXTALI-center no-wrap-text" :title="pedido.cCodigoRastreio" >{{ pedido.cCodigoRastreio }}</td>
                        </tr>

                        <!-- Linha expandida -->
                        <tr v-if="linhaExpandidaDaTabelaPedidosPossiveis === pedido.iD_Pedido">
                          <td colspan="15" class="expanded-row" style="background-color: #fff0f0;">
                            <div class="expanded-content" style="display: flex">
                              <table class="table table-sm FSIZE-PADRAO-TABLE" style="overflow-x: hidden; width: 100%; border: 2px 0px 0px 0px solid #000; border-collapse: collapse; z-index: 1">
                                
                                <thead>
                                  <tr style="text-align: center">
                                    <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5">GUIA REMESSA</th>
                                    <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5">N° PEDIDO</th>
                                    <!-- <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-4">N° COMP.</th> -->
                                    <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-8">CÓD. COMP.</th>
                                    <th style="background-color: #97b6b8" class="TEXTALI-left  WIDTH-15">DESC. COMP.</th>
                                    <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5">QUANTIDADE</th>
                                    <!-- <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5">PESO COMP.</th> -->
                                    <!-- <th style="background-color: #97b6b8" class="TEXTALI-left  WIDTH-15">CÓD • DESC. INFORMADA</th> -->
                                    <!-- <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5">PESO INFORMADO</th> -->
                                  </tr>
                                </thead>

                                <tbody>
                                  <template v-for="pedidoItem in infoPedidosItens" :key="pedidoItem.iD_Pedido_Item">

                                    <tr class="">
                                      <td class="TEXTALI-center  WIDTH-5 no-wrap-text" style="background-color: #e0e0e0;">
                                        {{ pedido.cGuiaRemessa }}
                                      </td>
                                      <td class="TEXTALI-center  WIDTH-5 no-wrap-text" style="background-color: #e0e0e0;">
                                        {{ pedido.cNumPedido }}
                                      </td>
                                      <!-- <td class="TEXTALI-center  WIDTH-4 no-wrap-text" style="background-color: #e0e0e0;">
                                        {{ pedidoItem.iD_Componente }}
                                      </td> -->
                                      <td class="TEXTALI-center  WIDTH-8 no-wrap-text" style="background-color: #e0e0e0;">
                                        {{ pedidoItem.cCodComponente }}
                                      </td>
                                      <td class="TEXTALI-left  WIDTH-20 no-wrap-text" :title="pedidoItem.cDescricao" style="background-color: #e0e0e0;">
                                        {{ pedidoItem.cDescricao ? shortenInfo(pedidoItem.cDescricao, 35) : "COMP. NÃO CADASTRADO" }}
                                      </td>
                                      <td class="TEXTALI-center  WIDTH-10 no-wrap-text" style="background-color: #e0e0e0;">
                                        {{ pedidoItem.iQuantidade }}
                                      </td>
                                      <!-- <td class="TEXTALI-center  WIDTH-5 no-wrap-text" style="background-color: #e0e0e0;">
                                        {{ pedidoItem.cPesoIndividual }}
                                      </td> -->
                                      <!-- <td class="TEXTALI-left  WIDTH-15 no-wrap-text" :title="pedidoItem.cDescricaoItemInformado" style="background-color: #e0e0e0; ">
                                        {{ pedidoItem.cCodComponenteInformado }} • {{ shortenInfo(pedidoItem.cDescricaoItemInformado, 35) }}
                                      </td> -->
                                      <!-- <td class="TEXTALI-center  WIDTH-5 no-wrap-text" style="background-color: #e0e0e0;">
                                        {{ pedidoItem.nPesoUnitarioInformado }}
                                      </td> -->
                                    
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

                  <!-- RODAPÉ -->
                  <div class="HEIGHT-5 WIDTH-100 D-flex ALITEM-center BOR-B-R-RAD-5 totais-barra "
                    :style="{
                      background: hexToRgba('#9E9E9E', 0.6),
                      paddingRight: compensacaoScrollPossiveis + 'px'
                    }"
                  >
                    <div class="WIDTH-49 FWEIGHT-bold FSIZE-14px">TOTAL:</div>

                    <!-- <div class="WIDTH-20 D-flex JC-center PADDING-2"> -->
                      <!-- <button @click="toggleVerMaisPedidosPossiveis" 
                      class="btn btn-soft btn-compact WIDTH-100 FSIZE-11px">
                        {{ mostrarTodosPedidosPossiveis ? `Ver menos...` : `Ver mais... (${infoPedidosPossiveis.length})` }}
                      </button> -->
                    <!-- </div> -->

                    <div class="WIDTH-4 FWEIGHT-bold FSIZE-14px"
                      :style="{
                        paddingLeft: paddingTabela,
                        paddingRight: paddingTabela,
                        textAlign: 'right'
                      }"
                    >
                      <span v-if="!isTabelaPedidosCarregada" class="loading-dots"></span>
                      <span v-else>{{ totalQuantidadeVolumesPossiveis }}</span>
                    </div>

                    <div class="WIDTH-4 FWEIGHT-bold FSIZE-14px"
                      :style="{
                        paddingLeft: paddingTabela,
                        paddingRight: paddingTabela,
                        textAlign: 'right'
                      }"
                    >
                      <span v-if="!isTabelaPedidosCarregada" class="loading-dots"></span>
                      <span v-else>{{ totalQuantidadeItensPossiveis  }}</span>
                    </div>

                    <div class="WIDTH-43"></div>

                  </div>

                </div>

              </div>
            </div>

            <!-- TRANSPORTADORAS -->
            <div v-else key="transportadora" class="WIDTH-99 HEIGHT-84">
              <!-- 2 Tabelas TRANSPORTADORAS -->
              <div  class="D-flex FD-column HEIGHT-93 WIDTH-100 mb-1">

                <!-- Tabela de pedidos possíveis -->
                <div class="WIDTH-100 HEIGHT-49 mb-1">
                  <!-- TABELA + TITULO -->
                  <div class="D-flex FD-column ALITEM-center JC-center HEIGHT-100 WIDTH-100 BORRAD-5 BGC-cinza-9  PADDING-2 BOR-grey-1px">
                    
                    <!-- FILTRO DATAS + BARRA DE PESQUISA + REFRESH -->
                    <div class="D-flex JC-flex-end HEIGHT-6 WIDTH-98">

                      <!-- Filtro de datas -->
                      <div class="WIDTH-40 D-flex JC-flex-start ALITEM-center"></div>

                      <!-- TÍTULO -->
                      <div class="WIDTH-20 D-flex JC-center ALITEM-center HEIGHT-100">
                        <h4 class="FSIZE-18px">PEDIDOS</h4>
                      </div>

                      <!-- TOTAL PEDIDOS, ITENS E SKUS -->
                      <div class="D-flex ALITEM-center JC-flex-end WIDTH-40 HEIGHT-100 mb-3 FWEIGHT-bold">Pedidos: {{ infoPedidosPossiveis.filter(x => x.bSelecionado === false).length }}</div>

                    </div>

                    <!-- Tabela -->
                    <div class="BOR-SensacaoAfundado OFLOW-auto WIDTH-98 HEIGHT-90 BGC-branco">

                      <div class="WIDTH-100 HEIGHT-91 OFLOW-auto BGC-branco" ref="tabelaWrapperPossiveis">
                        <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5  table-fixed FSIZE-PADRAO-TABLE" style="overflow-x: hidden; width: 100%;">
                          
                          <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                            <tr>
                              <th class="WIDTH-2  TEXTALI-center no-wrap-text" scope="col"></th> <!-- CheckBox -->
                              <th class="WIDTH-2  TEXTALI-center no-wrap-text" scope="col"></th> <!-- + -->
                              <th class="WIDTH-7  TEXTALI-center no-wrap-text" scope="col">CK</th>
                              <th class="WIDTH-6  TEXTALI-center no-wrap-text" scope="col">TRÂMITE</th>
                              <th class="WIDTH-6  TEXTALI-center no-wrap-text" scope="col">NF</th>
                              <th class="WIDTH-10  TEXTALI-center no-wrap-text" scope="col">GUIA REMESSA</th>
                              <th class="WIDTH-8 TEXTALI-center no-wrap-text" scope="col">PEDIDO</th>
                              <th class="WIDTH-6  TEXTALI-center no-wrap-text" scope="col">OV</th>
                              <th class="WIDTH-4  TEXTALI-center no-wrap-text" scope="col">VOL.</th>
                              <th class="WIDTH-4 TEXTALI-center no-wrap-text" scope="col">ITENS</th>
                              <th class="WIDTH-8  TEXTALI-center no-wrap-text" scope="col">DESTINATÁRIO</th>
                              <th class="WIDTH-3  TEXTALI-center no-wrap-text" scope="col">UF</th>
                              <th class="WIDTH-6  TEXTALI-center no-wrap-text" scope="col">CEP</th>
                              <th class="WIDTH-8  TEXTALI-center no-wrap-text" scope="col">TRANSP.</th>
                              <th class="WIDTH-10  TEXTALI-center no-wrap-text" scope="col">EM ROTA</th>
                              <th class="WIDTH-10 TEXTALI-center no-wrap-text" scope="col">ENTREGUE</th>
                            </tr>
                          </thead>
                          
                          <LayoutTabelaCarregarEsqueleto
                            :Linhas="infoPedidosPossiveis.length === 0 ? 15 : infoPedidosPossiveis.length"
                            :Colunas=16 v-if="!isTabelaPedidosCarregada" />

                          <tbody v-if="isTabelaPedidosCarregada" class="BORRAD-5">
                          
                            <template v-for="(pedido, i) in infoPedidosPossiveis.filter(p => p.bSelecionado === false)" :key="pedido.iD_Pedido">

                            <!-- LINHA PRINCIPAL -->
                            <tr class="CURSOR-default BGC-H-cinza-8"
                              :class="applyTableStipedRows(i)"
                              :id="pedido.iD_Pedido"
                              >
                              <!-- CheckBox - selecionado -->
                              <td class="WIDTH-2 TEXTALI-center no-wrap-text">
                                <input
                                  type="checkbox"
                                  class="CURSOR-pointer"
                                  v-model="pedido.bSelecionado"
                                  @change="OnClickCheckBoxTabelaPossiveis(pedido)"
                                />
                              </td>
                              <!-- Botão ver os itens -->
                              <td class="WIDTH-2 TEXTALI-center ALITEM-center no-wrap-text">
                                <button
                                  title="Mais informações"
                                  class="custom-button"
                                  style="height: 15px; width: 15px; font-size: 12px;"
                                  @click.stop.prevent="ativarSubLinhaPedidosPossiveis(pedido.iD_Pedido)"
                                  >
                                  {{ linhaExpandidaDaTabelaPedidosPossiveis === pedido.iD_Pedido ? '-' : '+' }}
                                </button>
                              </td>
                              <td class="WIDTH-7  TEXTALI-center no-wrap-text" :title="pedido.cCK" >{{ pedido.cCK }}</td>
                              <td class="WIDTH-6  TEXTALI-center no-wrap-text" :title="pedido.cTramite" >{{ pedido.cTramite }}</td>
                              <td class="WIDTH-6  TEXTALI-center no-wrap-text" :title="pedido.cNumNFe" >{{ pedido.cNumNFe }}</td>
                              <td class="WIDTH-10  TEXTALI-center no-wrap-text" :title="pedido.cGuiaRemessa" >{{ pedido.cGuiaRemessa }}</td>
                              <td class="WIDTH-8  TEXTALI-center no-wrap-text" :title="pedido.cNumPedido" >{{ pedido.cNumPedido }}</td>
                              <td class="WIDTH-6  TEXTALI-center no-wrap-text" :title="pedido.cOV" >{{ pedido.cOV }}</td>
                              <td class="WIDTH-4  TEXTALI-right no-wrap-text" :title="pedido.iVolume" >{{ pedido.cVolume }}</td>
                              <td class="WIDTH-4  TEXTALI-right   no-wrap-text" :title="pedido.iQtdeItens" >{{ pedido.cQtdeItens }}</td>
                              <td class="WIDTH-8  TEXTALI-left   CTTABLEELPIS" :title="pedido.cDestinatario" >{{ pedido.cDestinatario }}</td>
                              <td class="WIDTH-3  TEXTALI-center no-wrap-text" :title="pedido.cUF" >{{ pedido.cUF }}</td>
                              <td class="WIDTH-6  TEXTALI-center no-wrap-text" :title="pedido.cCEP" >{{ pedido.cCEP }}</td>
                              <td class="WIDTH-8  TEXTALI-center no-wrap-text" :title="pedido.cNomeTransportadora" >{{ shortenInfo(pedido.cNomeTransportadora, 12) }}</td>
                              <td class="WIDTH-10  TEXTALI-center no-wrap-text" :title="pedido.dDataEmRota" >{{ pedido.dDataEmRota }}</td>
                              <td class="WIDTH-10 TEXTALI-center  no-wrap-text" :title="pedido.dDataEmEntregue" >{{ pedido.dDataEmEntregue }}</td>
                            </tr>

                            <!-- Linha expandida -->
                            <tr v-if="linhaExpandidaDaTabelaPedidosPossiveis === pedido.iD_Pedido">
                              <td colspan="16" class="expanded-row" style="background-color: #fff0f0;">
                                <div class="expanded-content" style="display: flex">
                                  <table class="table table-sm FSIZE-PADRAO-TABLE" style="overflow-x: hidden; width: 100%; border: 2px 0px 0px 0px solid #000; border-collapse: collapse; z-index: 1">
                                    
                                    <thead>
                                      <tr style="text-align: center">
                                        <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5">GUIA REMESSA</th>
                                        <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5">N° PEDIDO</th>
                                        <!-- <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-4">N° COMP.</th> -->
                                        <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-8">CÓD. COMP.</th>
                                        <th style="background-color: #97b6b8" class="TEXTALI-left  WIDTH-15">DESC. COMP.</th>
                                        <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5">QUANTIDADE</th>
                                        <!-- <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5">PESO COMP.</th> -->
                                        <!-- <th style="background-color: #97b6b8" class="TEXTALI-left  WIDTH-15">CÓD • DESC. INFORMADA</th> -->
                                        <!-- <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5">PESO INFORMADO</th> -->
                                      </tr>
                                    </thead>

                                    <tbody>
                                      <template v-for="pedidoItem in infoPedidosItens" :key="pedidoItem.iD_Pedido_Item">

                                        <tr class="">
                                          <td class="TEXTALI-center  WIDTH-5 no-wrap-text" style="background-color: #e0e0e0;">
                                            {{ pedido.cGuiaRemessa }}
                                          </td>
                                          <td class="TEXTALI-center  WIDTH-5 no-wrap-text" style="background-color: #e0e0e0;">
                                            {{ pedido.cNumPedido }}
                                          </td>
                                          <!-- <td class="TEXTALI-center  WIDTH-4 no-wrap-text" style="background-color: #e0e0e0;">
                                            {{ pedidoItem.iD_Componente }}
                                          </td> -->
                                          <td class="TEXTALI-center  WIDTH-8 no-wrap-text" style="background-color: #e0e0e0;">
                                            {{ pedidoItem.cCodComponente }}
                                          </td>
                                          <td class="TEXTALI-left  WIDTH-20 no-wrap-text" :title="pedidoItem.cDescricao" style="background-color: #e0e0e0;">
                                            {{ pedidoItem.cDescricao ? shortenInfo(pedidoItem.cDescricao, 35) : "COMP. NÃO CADASTRADO" }}
                                          </td>
                                          <td class="TEXTALI-center  WIDTH-10 no-wrap-text" style="background-color: #e0e0e0;">
                                            {{ pedidoItem.iQuantidade }}
                                          </td>
                                          <!-- <td class="TEXTALI-center  WIDTH-5 no-wrap-text" style="background-color: #e0e0e0;">
                                            {{ pedidoItem.cPesoIndividual }}
                                          </td> -->
                                          <!-- <td class="TEXTALI-left  WIDTH-15 no-wrap-text" :title="pedidoItem.cDescricaoItemInformado" style="background-color: #e0e0e0; ">
                                            {{ pedidoItem.cCodComponenteInformado }} • {{ shortenInfo(pedidoItem.cDescricaoItemInformado, 35) }}
                                          </td> -->
                                          <!-- <td class="TEXTALI-center  WIDTH-5 no-wrap-text" style="background-color: #e0e0e0;">
                                            {{ pedidoItem.nPesoUnitarioInformado }}
                                          </td> -->
                                        
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

                      <!-- RODAPÉ -->
                      <div class="HEIGHT-9 WIDTH-100 D-flex ALITEM-center BOR-B-R-RAD-5 totais-barra "
                        :style="{
                          background: hexToRgba('#9E9E9E', 0.6),
                          paddingRight: compensacaoScrollPossiveis + 'px'
                        }"
                      >
                        <div class="WIDTH-47 FWEIGHT-bold FSIZE-14px">TOTAL:</div>

                        <!-- <div class="WIDTH-20 D-flex JC-center PADDING-2"> -->
                          <!-- <button @click="toggleVerMaisPedidosPossiveis" 
                          class="btn btn-soft btn-compact WIDTH-100 FSIZE-11px">
                            {{ mostrarTodosPedidosPossiveis ? `Ver menos...` : `Ver mais... (${infoPedidosPossiveis.length})` }}
                          </button> -->
                        <!-- </div> -->

                        <div class="WIDTH-4 FWEIGHT-bold FSIZE-14px"
                          :style="{
                            paddingLeft: paddingTabela,
                            paddingRight: paddingTabela,
                            textAlign: 'right'
                          }"
                        >
                          <span v-if="!isTabelaPedidosCarregada" class="loading-dots"></span>
                          <span v-else>{{ totalQuantidadeVolumesPossiveis }}</span>
                        </div>

                        <div class="WIDTH-4 FWEIGHT-bold FSIZE-14px"
                          :style="{
                            paddingLeft: paddingTabela,
                            paddingRight: paddingTabela,
                            textAlign: 'right'
                          }"
                        >
                          <span v-if="!isTabelaPedidosCarregada" class="loading-dots"></span>
                          <span v-else>{{ totalQuantidadeItensPossiveis  }}</span>
                        </div>

                        <div class="WIDTH-45"></div>

                      </div>

                    </div>
                    
                  </div>
                </div>

                <!-- Tabela de "Carrinho de compras" -->
                <div class="WIDTH-100 HEIGHT-49 bb BORRAD-5">
                  <!-- TABELA + TITULO -->
                  <div class="D-flex FD-column ALITEM-center JC-center HEIGHT-100 WIDTH-100 BORRAD-5 BGC-azul-5 PADDING-2 BOR-blue">                
                    <!-- FILTRO DATAS + BARRA DE PESQUISA + REFRESH -->
                    <div class="D-flex JC-flex-end HEIGHT-6 WIDTH-98">

                      <!-- Filtro de datas -->
                      <div class="WIDTH-40 D-flex JC-flex-start ALITEM-center"></div>

                      <!-- TÍTULO -->
                      <div class="WIDTH-20 D-flex JC-center ALITEM-center">
                        <h4 style="color: blue;" class="FSIZE-18px" >SELECIONADOS</h4>
                      </div>

                      <!-- TOTAL PEDIDOS, ITENS E SKUS -->
                      <div  style="color: blue;" class="D-flex ALITEM-center JC-flex-end WIDTH-40 HEIGHT-100 mb-3 FWEIGHT-bold">Pedidos: {{ staticinfoPedidosPossiveis.filter(x => x.bSelecionado === true).length }}</div>

                    </div>

                    <!-- Tabela -->
                    <div class="BOR-SensacaoAfundado WIDTH-98 HEIGHT-90 BGC-branco">

                      <div class="WIDTH-100 HEIGHT-91 OFLOW-auto BGC-branco" ref="tabelaWrapperSelecionados">
                        <table class="table-responsive table-sm table-striped table-fixed WIDTH-100 BORRAD-5 FSIZE-PADRAO-TABLE" style="overflow-x: hidden; width: 100%;">
                          
                          <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                            <tr>
                              <th class="WIDTH-2  TEXTALI-center no-wrap-text" scope="col"></th> <!-- CheckBox -->
                              <th class="WIDTH-2  TEXTALI-center no-wrap-text" scope="col"></th> <!-- + -->
                              <th class="WIDTH-7  TEXTALI-center no-wrap-text" scope="col">CK</th>
                              <th class="WIDTH-6  TEXTALI-center no-wrap-text" scope="col">TRÂMITE</th>
                              <th class="WIDTH-6  TEXTALI-center no-wrap-text" scope="col">NF</th>
                              <th class="WIDTH-10  TEXTALI-center no-wrap-text" scope="col">GUIA REMESSA</th>
                              <th class="WIDTH-8 TEXTALI-center no-wrap-text" scope="col">PEDIDO</th>
                              <th class="WIDTH-6  TEXTALI-center no-wrap-text" scope="col">OV</th>
                              <th class="WIDTH-4  TEXTALI-center no-wrap-text" scope="col">VOL.</th>
                              <th class="WIDTH-4 TEXTALI-center no-wrap-text" scope="col">ITENS</th>
                              <th class="WIDTH-8  TEXTALI-center no-wrap-text" scope="col">DESTINATÁRIO</th>
                              <th class="WIDTH-3  TEXTALI-center no-wrap-text" scope="col">UF</th>
                              <th class="WIDTH-6  TEXTALI-center no-wrap-text" scope="col">CEP</th>
                              <th class="WIDTH-8  TEXTALI-center no-wrap-text" scope="col">TRANSP.</th>
                              <th class="WIDTH-10  TEXTALI-center no-wrap-text" scope="col">EM ROTA</th>
                              <th class="WIDTH-10 TEXTALI-center no-wrap-text" scope="col">ENTREGUE</th>
                            </tr>
                          </thead>
                          
                          <LayoutTabelaCarregarEsqueleto
                            :Linhas="staticinfoPedidosPossiveis.length === 0 ? 15 : staticinfoPedidosPossiveis.length"
                            :Colunas=16 v-if="!isTabelaPedidosCarregada" />

                          <tbody v-if="isTabelaPedidosCarregada" class="BORRAD-5">
                          
                            <template v-for="(pedido, i) in staticinfoPedidosPossiveis.filter(p => p.bSelecionado === true)" :key="pedido.iD_Pedido">

                            <!-- LINHA PRINCIPAL -->
                            <tr class="CURSOR-default BGC-H-cinza-8"
                              :class="applyTableStipedRows(i)"
                              :id="pedido.iD_Pedido"
                              >
                              <!-- CheckBox - selecionado -->
                              <td class="WIDTH-2 TEXTALI-center no-wrap-text">
                                <input
                                  type="checkbox"
                                  class="CURSOR-pointer"
                                  v-model="pedido.bSelecionado"
                                  @change="OnClickCheckBoxTabelaSelecionados(pedido)"
                                />
                              </td>
                              <!-- Botão ver os itens -->
                              <td class="WIDTH-2 TEXTALI-center ALITEM-center no-wrap-text">
                                <button
                                  title="Mais informações"
                                  class="custom-button"
                                  style="height: 15px; width: 15px; font-size: 12px;"
                                  @click.stop.prevent="ativarSubLinhaPedidosSelecionados(pedido.iD_Pedido)"
                                  >
                                  {{ linhaExpandidaDaTabelaPedidosSelecionados === pedido.iD_Pedido ? '-' : '+' }}
                                </button>
                              </td>
                              <td class="WIDTH-7  TEXTALI-center no-wrap-text" :title="pedido.cCK" >{{ pedido.cCK }}</td>
                              <td class="WIDTH-6  TEXTALI-center no-wrap-text" :title="pedido.cTramite" >{{ pedido.cTramite }}</td>
                              <td class="WIDTH-6  TEXTALI-center no-wrap-text" :title="pedido.cNumNFe" >{{ pedido.cNumNFe }}</td>
                              <td class="WIDTH-10  TEXTALI-center no-wrap-text" :title="pedido.cGuiaRemessa" >{{ pedido.cGuiaRemessa }}</td>
                              <td class="WIDTH-8  TEXTALI-center no-wrap-text" :title="pedido.cNumPedido" >{{ pedido.cNumPedido }}</td>
                              <td class="WIDTH-6  TEXTALI-center no-wrap-text" :title="pedido.cOV" >{{ pedido.cOV }}</td>
                              <td class="WIDTH-4  TEXTALI-right no-wrap-text" :title="pedido.iVolume" >{{ pedido.cVolume }}</td>
                              <td class="WIDTH-4  TEXTALI-right   no-wrap-text" :title="pedido.iQtdeItens" >{{ pedido.cQtdeItens }}</td>
                              <td class="WIDTH-8  TEXTALI-left   CTTABLEELPIS" :title="pedido.cDestinatario" >{{ pedido.cDestinatario }}</td>
                              <td class="WIDTH-3  TEXTALI-center no-wrap-text" :title="pedido.cUF" >{{ pedido.cUF }}</td>
                              <td class="WIDTH-6  TEXTALI-center no-wrap-text" :title="pedido.cCEP" >{{ pedido.cCEP }}</td>
                              <td class="WIDTH-8  TEXTALI-center no-wrap-text" :title="pedido.cNomeTransportadora" >{{ shortenInfo(pedido.cNomeTransportadora, 12) }}</td>
                              <td class="WIDTH-10  TEXTALI-center no-wrap-text" :title="pedido.dDataEmRota" >{{ pedido.dDataEmRota }}</td>
                              <td class="WIDTH-10 TEXTALI-center  no-wrap-text" :title="pedido.dDataEmEntregue" >{{ pedido.dDataEmEntregue }}</td>
                            </tr>

                            <!-- Linha expandida -->
                            <tr v-if="linhaExpandidaDaTabelaPedidosSelecionados === pedido.iD_Pedido">
                              <td colspan="16" class="expanded-row" style="background-color: #fff0f0;">
                                <div class="expanded-content" style="display: flex">
                                  <table class="table table-sm FSIZE-PADRAO-TABLE" style="overflow-x: hidden; width: 100%; border: 2px 0px 0px 0px solid #000; border-collapse: collapse; z-index: 1">
                                    
                                    <thead>
                                      <tr style="text-align: center">
                                        <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5">GUIA REMESSA</th>
                                        <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5">N° PEDIDO</th>
                                        <!-- <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-4">N° COMP.</th> -->
                                        <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-8">CÓD. COMP.</th>
                                        <th style="background-color: #97b6b8" class="TEXTALI-left  WIDTH-15">DESC. COMP.</th>
                                        <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5">QUANTIDADE</th>
                                        <!-- <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5">PESO COMP.</th> -->
                                        <!-- <th style="background-color: #97b6b8" class="TEXTALI-left  WIDTH-15">CÓD • DESC. INFORMADA</th> -->
                                        <!-- <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5">PESO INFORMADO</th> -->
                                      </tr>
                                    </thead>

                                    <tbody>
                                      <template v-for="pedidoItem in infoPedidosItensSelecionados" :key="pedidoItem.iD_Pedido_Item">

                                        <tr class="">
                                          <td class="TEXTALI-center  WIDTH-5 no-wrap-text" style="background-color: #e0e0e0;">
                                            {{ pedido.cGuiaRemessa }}
                                          </td>
                                          <td class="TEXTALI-center  WIDTH-5 no-wrap-text" style="background-color: #e0e0e0;">
                                            {{ pedido.cNumPedido }}
                                          </td>
                                          <!-- <td class="TEXTALI-center  WIDTH-4 no-wrap-text" style="background-color: #e0e0e0;">
                                            {{ pedidoItem.iD_Componente }}
                                          </td> -->
                                          <td class="TEXTALI-center  WIDTH-8 no-wrap-text" style="background-color: #e0e0e0;">
                                            {{ pedidoItem.cCodComponente }}
                                          </td>
                                          <td class="TEXTALI-left  WIDTH-20 no-wrap-text" :title="pedidoItem.cDescricao" style="background-color: #e0e0e0;">
                                            {{ pedidoItem.cDescricao ? shortenInfo(pedidoItem.cDescricao, 35) : "COMP. NÃO CADASTRADO" }}
                                          </td>
                                          <td class="TEXTALI-center  WIDTH-10 no-wrap-text" style="background-color: #e0e0e0;">
                                            {{ pedidoItem.iQuantidade }}
                                          </td>
                                          <!-- <td class="TEXTALI-center  WIDTH-5 no-wrap-text" style="background-color: #e0e0e0;">
                                            {{ pedidoItem.cPesoIndividual }}
                                          </td> -->
                                          <!-- <td class="TEXTALI-left  WIDTH-15 no-wrap-text" :title="pedidoItem.cDescricaoItemInformado" style="background-color: #e0e0e0; ">
                                            {{ pedidoItem.cCodComponenteInformado }} • {{ shortenInfo(pedidoItem.cDescricaoItemInformado, 35) }}
                                          </td> -->
                                          <!-- <td class="TEXTALI-center  WIDTH-5 no-wrap-text" style="background-color: #e0e0e0;">
                                            {{ pedidoItem.nPesoUnitarioInformado }}
                                          </td> -->
                                        
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

                      <!-- Botão de VER MAIS e VER MENOS -->
                      <div class="HEIGHT-9 WIDTH-100 D-flex ALITEM-center BOR-B-R-RAD-5 totais-barra "
                        :style="{
                          background: hexToRgba('#9E9E9E', 0.6),
                          paddingRight: compensacaoScrollSelecionados + 'px'
                        }"
                      >
                        <div class="WIDTH-47 FWEIGHT-bold FSIZE-14px">TOTAL:</div>

                        <!-- <div class="WIDTH-20 D-flex JC-center PADDING-2"> -->
                          <!-- <button @click="toggleVerMaisPedidosPossiveis" 
                          class="btn btn-soft btn-compact WIDTH-100 FSIZE-11px">
                            {{ mostrarTodosPedidosPossiveis ? `Ver menos...` : `Ver mais... (${infoPedidosPossiveis.length})` }}
                          </button> -->
                        <!-- </div> -->

                        <div class="WIDTH-4 FWEIGHT-bold FSIZE-14px"
                          :style="{
                            paddingLeft: paddingTabela,
                            paddingRight: paddingTabela,
                            textAlign: 'right'
                          }"
                        >
                          <span v-if="!isTabelaPedidosCarregada" class="loading-dots"></span>
                          <span v-else>{{ totalQuantidadeVolumesSelecionados }}</span>
                        </div>

                        <div class="WIDTH-4 FWEIGHT-bold FSIZE-14px"
                          :style="{
                            paddingLeft: paddingTabela,
                            paddingRight: paddingTabela,
                            textAlign: 'right'
                          }"
                        >
                          <span v-if="!isTabelaPedidosCarregada" class="loading-dots"></span>
                          <span v-else>{{ totalQuantidadeItensSelecionados }}</span>
                        </div>

                        <div class="WIDTH-45"></div>

                      </div>
                    </div>

                  </div>
                </div>

              </div>
              <!-- Botões -->
              <div v class="D-flex HEIGHT-7 WIDTH-100 BOR-SensacaoAfundado BGC-cinza-6 PADDING-2">

                <div class="PADDING-L5 WIDTH-70 D-flex ALITEM-center JC-flex-start HEIGHT-100">
                  <button id="selecionar-todos-button"
                    class="btn btn-primary MARGIN-R5 FSIZE-12px D-flex JC-center ALITEM-center HEIGHT-100"
                    @click="OnClickSelecionarTodos()"
                    :disabled="infoPedidosPossiveis.filter(p => p.bSelecionado === false).length === 0"
                  >SELECIONAR TODOS
                  </button>

                  <button id="anular-selecao-button"
                    class="btn btn-danger MARGIN-R5 FSIZE-12px HEIGHT-100 D-flex JC-center ALITEM-center"
                    :disabled="staticinfoPedidosPossiveis.filter(p => p.bSelecionado === true).length === 0"
                    @click="OnClickAnularSelecao()"
                  >ANULAR SELEÇÃO
                  </button>

                </div>

                <div class="PADDING-r5 WIDTH-30 D-flex ALITEM-center JC-flex-end HEIGHT-100">
                  <button id="gerar-syspick-button"
                    class="btn btn-success MARGIN-R5 FSIZE-12px D-flex JC-center ALITEM-center HEIGHT-100"
                    @click="OnClickInformarEntregaButton()"
                    :disabled="staticinfoPedidosPossiveis.filter(p => p.bSelecionado === true).length === 0"
                    >INFORMAR EM ROTA/ENTREGA
                  </button>              
                </div>

              </div>
            </div>
          </transition>
        </div>
        
      </div>
      
      <Rodape />

   </div>

  </main>

</template>

<style scoped>
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
  
/* MODAL */
/* Modal com 75% da largura */
.modal-75 {
  max-width: 75vw;
  width: 75vw;
}

/* Modal quase tela cheia */
.modal-92vh {
  height: 92vh;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
}

/* Garante que o body cresça */
.modal-92vh .modal-body {
  overflow: hidden;
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

.totais-barra {
  padding-left: 0.25rem; 
  border-top: 1px solid #bebebe;
  background: #f9f9f9;
  align-items: center;
}

.loading-dots::after {
  content: "...";
  animation: dots 1.4s infinite;
}

@keyframes dots {
  0%   { content: "."; }
  33%  { content: ".."; }
  66%  { content: "..."; }
}

/* Imagem responsiva e centralizada */
.image-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* Mantém proporção sem cortar */
  border-radius: 12px;
  box-shadow: 0 0 25px rgba(240, 240, 240, 0.3);
  transition: transform 0.3s ease;
}

/* Efeito suave ao passar o mouse */
.image-preview:hover {
  transform: scale(1.02);
}
.no-image-text {
  color: #ccc;
  font-style: italic;
  text-align: center;
}

/* entra da direita */
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

/* entra da esquerda */
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.25s ease;
}


</style>