<!-- ALTER TABLE dsMatriz.sla.Pedidos DISABLE TRIGGER TRG_slaPedidos_BloquearDeleteEmMassa;
delete FROM dsMatriz.sla.Pedidos
ALTER TABLE dsMatriz.sla.Pedidos ENABLE TRIGGER TRG_slaPedidos_BloquearDeleteEmMassa;

delete from dsMatriz.sla.Pedidos_Datas

ALTER TABLE dsMatriz.sla.Pedidos_Itens DISABLE TRIGGER TRG_slaPedidosItens_BloquearDeleteEmMassa;
DELETE FROM dsMatriz.sla.Pedidos_Itens
ALTER TABLE dsMatriz.sla.Pedidos_Itens ENABLE TRIGGER TRG_slaPedidosItens_BloquearDeleteEmMassa;

delete from dsMatriz.sla.Controle_CHECKIN
delete from dsMatriz.sla.Bipagem_Congelamento
delete from dsMatriz.sla.Bipagem_CHECKIN
delete from dsMatriz.sla.Bipagem_CHECKIN_Historico

DELETE FROM dsMatriz.sla.Historico_Corte_Logico
delete FROM dsMatriz.sla.Bipagem_LR
delete FROM dsMatriz.sla.Bipagem_LR_Historico
delete FROM dsMatriz.sla.Controle_LR

delete from dsMatriz.sla.Pedidos_Solicitacao_Cancelamento
delete from dsMatriz.sla.Pedidos_Cancelados

DELETE FROM dsMatriz.log.Entrada_Componente_Reservado -->

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { applyTableStipedRows, getStatusClass, shortenInfo } from '~/composables/visualization';
  import axios from 'axios'
  import { ToastError, ToastSuccess, ToastWarning } from '~/composables/toasts';
  
  import { RequestManager } from '@/composables/functions';
import { useAuthStore } from '~/stores/auth';
  const requests = new RequestManager();

  // Interfaces: ------------------\
  interface PedidoTabelaWEB {
    iD_Pedido: number;

    dInput: string;
    iCK: number | null;
    cCK: string;
    cGuiaRemessa: string;
    cNumPedido: string;
    cOV: string;
    cNumNFE: string;
    iVolume: number;
    iQuantidadeItens: number;
    cPedidoStatusAPI: string;
    cNome: string;
    cCidade: string;
    cUF: string;
    cTransportadora: string | null;
    ID_SolicitacaoCancelamento: number | null;
    cMotivoCancelamento: string | null;
  };

  interface PedidoTabelaAreaCliente {
    idPedido: number;
    data: string;
    iCK: number | null;
    guiaRemessa: string;
    pedido: string;
    ov: string;
    nfe: string;
    volume: number;
    destinatario: number;
    uF: string;
    status: string;
    cdRastreio: string;
    statusRastreio: string;
    transportadora: string;
    dataRecebimentoAPIPedido: string;
    dataCancelamentoPedido: string;
  };

  interface SLAEtapasSistemicasDTO {
    ck: string | null;
    guiaRemessa: string | null;
    dataInput: string | null;
    dataCorteLogico: string | null;
    dataGerado: string | null;
    dataPrazo: string | null;
    dataSeparado: string | null;
    dataProcessado: string | null;
    dataExpedido: string | null;
    dataPrevisaoEntrega: string | null;
    dataEntrega: string | null;
    dataEmRota: string | null;
  }

  interface PedidoPaginadoResponseDTO {
    totalRegistros: number;
    registros: PedidoTabelaWEB[];
  }

  interface PedidoItensTabelaAreaCliente {
    iD_Pedido: number | null;
    cdProduto: string | null;
    nmProduto: string | null;
    quantidade: string | null;
    guiaRemessa: string | null;
    itemComCorteLogico: string | null;
  }
  // ------------------------------/

  // VARIÁVEIS ------------------------------------------------------------------------------------------------------------
  const urlProd = useUrlProd();
  const token = useAuthStore().token;
  const isHoveringTabela = ref<boolean>(false);
  const numeroRegistrosPagina = ref<number>(10);
  const paginaAtual = ref<number>(1);
  const totalPaginas = ref<number>(0);
  const tituloModalPdfs = ref<string>("");
  const carregandoPDF = ref<boolean>(false);
  const tableContainer = ref<HTMLDivElement | null>(null)
  const rowsPerPage = ref<number>(10)
  const rowHeightPx = ref<number>(30)
  const tabelaPronta = ref<boolean>(false)
  const tabelaPedidosItensCarregada = ref<boolean>(false)
  const currentTab = ref('tab1');
  const infoPedidosTabelaAreaCliente = ref<PedidoTabelaAreaCliente[]>([]);
  const infoPedidosTabelaAreaClienteStatic = ref<PedidoTabelaAreaCliente[]>([]);
  const infoPedidosItensTabelaAreaCliente = ref<PedidoItensTabelaAreaCliente[]>([]);
  const infoPedidosItensTabelaAreaClienteStatic = ref<PedidoItensTabelaAreaCliente[]>([]);
  const cellTitle = (v: unknown) => (v === null || v === undefined ? '' : String(v));
  const mostrarTodosPedidosItensAreaCliente = ref<boolean>(false);
  const bloqueandoLupaPedidosItens = ref<boolean>(false);
  declare const bootstrap: any;
  const bgCorteLogico = (item: PedidoItensTabelaAreaCliente) => {
    if (currentTab.value !== 'tab2') {
      return {}; // não aplica estilo nenhum
    }

    return {
      backgroundColor: item.itemComCorteLogico
        ? 'rgba(120, 0, 0, 0.25)'
        : '#e0e0e0'
    };
  };
  const reservasEmAbertoPCP = ref<number>(0);

  const idPedidoPDF = ref<number>(0);
    
  // Computed:
  
  const infoPedidosGuia1Slice = computed(() => {
    if (mostrarTodos.value) return infoPedidosTabela.value;
    return infoPedidosTabela.value.slice(0, Math.max(1, rowsPerPage.value));
  });
  const infoPedidosAreaClienteSlice = computed(() => {
    if (mostrarTodos.value) return infoPedidosTabelaAreaCliente.value;
    return infoPedidosTabelaAreaCliente.value.slice(0, Math.max(1, rowsPerPage.value));
  });
  const infoPedidosItensTabelaSlice = computed(() => {
    return mostrarTodosPedidosItensAreaCliente.value
        ? infoPedidosItensTabelaAreaCliente.value
        : infoPedidosItensTabelaAreaCliente.value.slice(0, 50)
  });
  // Rota para obter o ID do cliente
  const urlBase = useUrlProd()
  const route = useRoute()
  const router = useRouter();

  const authStore = useAuthStore();
  const userID = ref<number | null>(authStore.idUsuario);
  // const userID_Unidade = ref<number | null>(authStore.ID_Unidade).value;
  // const userNome = ref<string | null>(authStore.nome);
  // const siglaUsuario = ref<string | null>(authStore.sigla);
  // const ID_Area = ref<number>(authStore.ID_Unidade ?? 0);
  const ID_Carteira = ref<number>(authStore.idCarteira ?? 0);
  const userRole = ref<string>(authStore.idFuncao ?? "");

  // Caminho da logo do cliente 
  const logoPath = `/CLIENTES/${ID_Carteira.value}.png`
  const querieProcura = ref<string>('');

  // Variáveis para controle da tabela principal
  const infoPedidosTabela = ref<PedidoTabelaWEB[]>([]);
  const infoPedidosTabelaStatic = ref<PedidoTabelaWEB[]>([]);

  const tabelaPedidosCarregada = ref<boolean>(false);
  const tabelaPedidosCompletaCarregada = ref<boolean>(false);

  const mostrarTodos = ref<boolean>(false);
  const hoje = new Date();
  const umMesAtras = new Date();
  umMesAtras.setMonth(umMesAtras.getMonth() - 1);

  const dataInicio = ref<string>(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);
  const dataFim = ref<string>(new Date().toISOString().split('T')[0]);

  const infosEtapasSistemicas = ref<SLAEtapasSistemicasDTO | null>(null);

  // SUB TABELA PEDIDOS ITENS
  const linhaExpandidaDaTabelaPedidos = ref<number|null>(null);
  const linhaExpandidaDaTabelaAreaCliente = ref<number|null>(null);
  const infoPedidoItens = ref<PedidoItensTabelaAreaCliente[]>([]);
  const infoPedidoAreaClienteItens = ref<PedidoItensTabelaAreaCliente[]>([]);

  const isLoadingEXCELRelatorio = ref<boolean>(false);

  // FUNÇÕES ------------------------------------------------------------------------------------------------------------
  async function showTab(tabName: string) {
    infoPedidoItens.value = [];
    infoPedidoAreaClienteItens.value = [];
    linhaExpandidaDaTabelaPedidos.value = null;
    linhaExpandidaDaTabelaAreaCliente.value = null;

    paginaAtual.value = 1
    totalPaginas.value = 0

    currentTab.value = tabName;

    if(tabName == 'tab1') {
      await carregarTabela();
    } else if(tabName == 'tab2') {
      await getInfosPedidosAreaCliente('corte-logico');
    } else if(tabName == 'tab3') {
      await getInfosPedidosAreaCliente('pendentes');
    } else if(tabName == 'tab4') {
      await getInfosPedidosAreaCliente('cancelados');
    }

  };
  async function clickLupaPedidos(idPedido: number) {
    if (bloqueandoLupaPedidosItens.value) return;
    try {
      bloqueandoLupaPedidosItens.value = true;

      await getInfosPedidosInfoAreaCliente(idPedido);
      await abrirModalPedidosItens();
    } catch (error) {
      console.error('Erro ao abrir pedido:', error);
    } finally {
      bloqueandoLupaPedidosItens.value = false;
    }
  }
  async function clickXModalPedidosItens() {
    await fecharModalPedidosItens();
    infoPedidosItensTabelaAreaCliente.value = [];
    infoPedidosItensTabelaAreaClienteStatic.value = [];
  } 
  // REQUISIÇÕES ---------------------------------\
  const btnProxClicado = async () => {
    if(currentTab.value == 'tab1') {
      await carregarTabela();
    } else if(currentTab.value == 'tab2') {
      await getInfosPedidosAreaCliente('corte-logico');
    } else if(currentTab.value == 'tab3') {
      await getInfosPedidosAreaCliente('pendentes');
    } else if(currentTab.value == 'tab4') {
      await getInfosPedidosAreaCliente('cancelados');
    }
  };
  const buscarPedidos50 = async () => {
    tabelaPedidosCarregada.value = false;
    try {
      const response = await axios.get<PedidoPaginadoResponseDTO>(
        `${urlBase}/sla/pedido/selecionar-pedidos-50/${ID_Carteira.value}/${paginaAtual.value}/${numeroRegistrosPagina.value}/${querieProcura.value}`,
        { headers: { 'Authorization': `Bearer ${token ?? ''}` } }
        // { signal: requests.signal }
      );

      infoPedidosTabela.value = response.data.registros;
      infoPedidosTabelaStatic.value = response.data.registros;
      totalPaginas.value = Math.ceil(response.data.totalRegistros/numeroRegistrosPagina.value);

    } catch (error: any) {
      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
        return;
      }
      console.error(error);
    } finally {
      tabelaPedidosCarregada.value = true;
    }
  };
  async function getInfosPedidosAreaCliente(infoTab: string) {
    tabelaPronta.value = false

    try {
      const url =
        `${urlProd}/consultas-sla/area-cliente-pedidos/` +
        `${infoTab}/${ID_Carteira.value}/${paginaAtual.value}/${numeroRegistrosPagina.value}/` +
        `${encodeURIComponent(querieProcura.value ?? '')}`

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token ?? ''}` }
      })
      infoPedidosTabelaAreaCliente.value = response.data.registros
      infoPedidosTabelaAreaClienteStatic.value = response.data.registros

      totalPaginas.value = Math.ceil(
        response.data.totalRegistros / numeroRegistrosPagina.value
      )

      paginaAtual.value = 1

    } catch (error: any) {
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        return
      }
      console.error(error)
    } finally {
      tabelaPronta.value = true
    }
  };
  async function getInfosPedidosInfoAreaCliente(idPedido: number) {

    mostrarTodosPedidosItensAreaCliente.value = false

    try {
      const response = await axios.get(`${urlProd}/consultas-sla/area-cliente-pedidos/itens/${idPedido}`,
        { headers: { Authorization: `Bearer ${token ?? ""}`, } }
      );

      infoPedidosItensTabelaAreaCliente.value = response.data
      infoPedidosItensTabelaAreaClienteStatic.value = response.data

      mostrarTodosPedidosItensAreaCliente.value = true

      return infoPedidosItensTabelaAreaCliente.value
    } catch (error) {
      mostrarTodosPedidosItensAreaCliente.value = false

      throw error
    }

  };
  async function abrirModalPedidosItens() {
    const el = document.getElementById('PedidoItensModal');
    if (!el) return;

    const modal = new bootstrap.Modal(el);
    modal.show();
  }

  async function fecharModalPedidosItens() {
    const el = document.getElementById('PedidoItensModal');
    if (!el) return;

    const modal = bootstrap.Modal.getInstance(el);
    if (modal) modal.hide();
  }
  const getEtapasSistemicas = async (ID_Pedido: number) => {
    try {
      const response = await axios.get(`${urlBase}/consultas-sla/etapas-sistemicas/${ID_Pedido}`, 
        { headers: { Authorization: `Bearer ${token ?? ''}` } }
      );
      infosEtapasSistemicas.value = response.data;
    } catch (response) {
      console.error("Erro ao buscar dados:");
    }
  }
  const getPDFPedido = async (ID_Pedido: number) => {
    try {
      const response = await axios.post(
        `${urlBase}/consultas-sla/visualiza-baixa-pdf-pedido/${ID_Pedido}/1`,
        {}, // 👈 body vazio
        {
          headers: {
            Authorization: `Bearer ${token ?? ''}`
          },
          responseType: "blob"
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const iframe = document.getElementById("iframePDF") as HTMLIFrameElement;
      iframe.src = url;

    } catch (err) {
      console.error("Erro ao buscar PDF Pedido", err);
    }
  };

  const getPDFDanfe = async (ID_Pedido: number): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${urlBase}/consultas-sla/visualiza-baixa-pdf-danfe/pedido/${ID_Pedido}/1`,
        {}, // 👈 body vazio
        {
          headers: {
            Authorization: `Bearer ${token ?? ''}`
          },
          responseType: "blob",
          validateStatus: (status: number) =>
            status === 200 || status === 204
        }
      );

      if (response.status === 204) return false;

      const contentType = response.headers["content-type"];

      if (!contentType?.includes("application/pdf")) {
        return false;
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const iframe = document.getElementById("iframePDF") as HTMLIFrameElement;
      iframe.src = url;

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const enviaEmailPDF = async (
    idPedido: number | null,
    idUsuario: number | null,
    tipoPdf: string | null
  ) => {
    try {
      const authStore = useAuthStore();

      const response = await axios.post(
        `${urlBase}/consultas-sla/enviar-pdf`,
        {
          idPedido,
          idUsuario,
          tipoPdf
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token ?? ''}`
          }
        }
      );

      if (response.data?.sucesso) {
        ToastSuccess("Email enviado com sucesso!");
      } else {
        ToastError(response.data?.mensagem || "Erro ao enviar email.");
      }

    } catch (err) {
      console.error("Erro ao enviar email:", err);
      ToastError("ERRO AO ENVIAR EMAIL. CONSULTE A TI.");
    }
  };

  const ativarSubLinhaItensPedido = async (ID_Pedido: number) => {
    infoPedidoItens.value = [];

    if (linhaExpandidaDaTabelaPedidos.value ===  ID_Pedido) {
      linhaExpandidaDaTabelaPedidos.value = null;
    } else {
      linhaExpandidaDaTabelaPedidos.value = ID_Pedido
      infoPedidoItens.value = await getInfosPedidosInfoAreaCliente(ID_Pedido);
    }
  };
    const ativarSubLinhaItensAreaCliente = async (ID_Pedido: number) => {
    infoPedidoAreaClienteItens.value = [];

    if (linhaExpandidaDaTabelaAreaCliente.value ===  ID_Pedido) {
      linhaExpandidaDaTabelaAreaCliente.value = null;
    } else {
      linhaExpandidaDaTabelaAreaCliente.value = ID_Pedido
      infoPedidoAreaClienteItens.value = await getInfosPedidosInfoAreaCliente(ID_Pedido);
    }
  };
  // ---------------------------------------------/

  // UTILITARIOS ---------------------------------\
  const calcularRowsPerPage = async () => {
    if (!tableContainer.value) return;

    await nextTick();
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

    const ROW_HEIGHT_BASE_PX = 30;

    const container = tableContainer.value;
    const containerHeight = container.clientHeight;
    const thead = container.querySelector('thead') as HTMLTableSectionElement | null;
    if (!thead) return;

    const headerHeight = Math.ceil(thead.getBoundingClientRect().height);
    const available = Math.max(0, containerHeight - headerHeight);

    const count = Math.max(1, Math.floor(available / ROW_HEIGHT_BASE_PX));
    const finalRowHeight = Math.max(1, available / count);

    rowsPerPage.value = count;
    numeroRegistrosPagina.value = count;
    rowHeightPx.value = finalRowHeight;

  };
  
  const carregarTabela = async () => {
    // mantém skeleton até termos: rowsPerPage calculado + fetch concluído + CSS de altura aplicado
    tabelaPronta.value = false;
    await calcularRowsPerPage();
    await buscarPedidos50();
    await nextTick();
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    tabelaPronta.value = true;
  };

  // Recalcula apenas a altura das linhas ao redimensionar a janela,
  // sem refazer a requisição de dados.
  const ajustarAlturaTabelaOnResize = async () => {
    if (!tableContainer.value || !rowsPerPage.value) return;

    await nextTick();
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

    const container = tableContainer.value;
    const containerHeight = container.clientHeight;
    const thead = container.querySelector('thead') as HTMLTableSectionElement | null;
    if (!thead) return;

    const headerHeight = Math.ceil(thead.getBoundingClientRect().height);
    const available = Math.max(0, containerHeight - headerHeight);

    const count = Math.max(1, rowsPerPage.value);
    const finalRowHeight = Math.max(1, available / count);

    rowHeightPx.value = finalRowHeight;
  };
  const toggleVerMais = () => {
    mostrarTodos.value = !mostrarTodos.value
  };
  const abrirModalEtapasSistema = async (ID_Pedido: number) => {
    showModal('EtapasSistemaModal', true);

    await getEtapasSistemicas(ID_Pedido);
  };
  const abrirModalVisualizaPDFs = async (ID_Pedido: number, TipoPDF: string) => {
    
    tituloModalPdfs.value = TipoPDF;
    carregandoPDF.value = true;
    idPedidoPDF.value = ID_Pedido;

    if(TipoPDF == 'PDF DANFE'){
      const deuCerto = await getPDFDanfe(ID_Pedido);
      if (!deuCerto) {
        ToastWarning("XML não existente.");
        return;
      }

      showModal('VisualizarPDFs', true);

    } else if(TipoPDF == 'PDF PEDIDO'){
      showModal('VisualizarPDFs', true);
      await getPDFPedido(ID_Pedido);
    }

    carregandoPDF.value = false;

  };
  const fecharModalEtapasSistema = () => {
    showModal('EtapasSistemaModal', false);
  }
  const fecharModalVisualizaPDFs = () => {
    idPedidoPDF.value = 0
    showModal('VisualizarPDFs', false);
    const iframe = document.getElementById("iframePDF") as HTMLIFrameElement;
    iframe.src = 'about:blank';
  }


  const clickRefreshPedidosButton = async () => {
    try {
      await buscarPedidos50();
      ToastSuccess("Lista de pedidos atualizada com sucesso!")
    } catch {
      ToastError("Erro ao atualizar a lista de pedidos.")
    }
  };

  const OnChangeDataInicio = async () => {
    if (!dataInicio.value) {
      dataInicio.value = new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split("T")[0];
    }

    await buscarPedidos50();
  };

  const OnClickVisualizarCopiaDanfe = (ID_Pedido: number) => {
    ToastWarning('Visualizar cópia do Danfe: Em desenvolvimento');
  };
  
  const OnClickVisualizarPedido = (ID_Pedido: number) => {
    ToastWarning('Visualizar pedido: Em desenvolvimento');
  };
  // ---------------------------------------------/

  // FORMATAÇÕES DE DADOS ------------------------\
  // watch(querieProcura, () => {
  //   OnKeyUpBarraPesquisa();
  //   // filtrarPedidosGuia1();
  // });


  // watch(tabelaPedidosCarregada, async (loaded) => {
  //   if (!loaded) return;
  //   await calcularRowsPerPage();
  // });

  const OnClickLupaBarraPesquisa = async () => {
    if(currentTab.value == 'tab1') {
      await carregarTabela();
    } else if(currentTab.value == 'tab2') {
      await getInfosPedidosAreaCliente('corte-logico');
    } else if(currentTab.value == 'tab3') {
      await getInfosPedidosAreaCliente('pendentes');
    } else if(currentTab.value == 'tab4') {
      await getInfosPedidosAreaCliente('cancelados');
    } 
  };

  const OnBlurBarraPesquisa = async () => {
    if(currentTab.value == 'tab1') {
      await carregarTabela();
    } else if(currentTab.value == 'tab2') {
      await getInfosPedidosAreaCliente('corte-logico');
    } else if(currentTab.value == 'tab3') {
      await getInfosPedidosAreaCliente('pendentes');
    } else if(currentTab.value == 'tab4') {
      await getInfosPedidosAreaCliente('cancelados');
    } 
  };


  const OnKeyUpBarraPesquisa = async (event: KeyboardEvent) => {
    if (event.key === 'Enter' || querieProcura.value === '') {
      event.preventDefault(); // evita submit de form
    if(currentTab.value == 'tab1') {
      await carregarTabela();
    } else if(currentTab.value == 'tab2') {
      await getInfosPedidosAreaCliente('corte-logico');
    } else if(currentTab.value == 'tab3') {
      await getInfosPedidosAreaCliente('pendentes');
    } else if(currentTab.value == 'tab4') {
      await getInfosPedidosAreaCliente('cancelados');
    } 
    }
  };

  const filtrarPedidosGuia1 = () => {

    const query = querieProcura.value.toLowerCase();

    // Sempre reseta para a lista original
    infoPedidosTabela.value = infoPedidosTabelaStatic.value.filter((item) => {
      return (
        item.iCK?.toString().includes(query) ||
        item.cGuiaRemessa.toLowerCase().includes(query) ||
        item.cNumPedido.toLowerCase().includes(query) ||
        item.cOV.toLowerCase().includes(query) ||
        item.cNumNFE.toLowerCase().includes(query) ||
        item.cPedidoStatusAPI.toLowerCase().includes(query) ||
        item.cNome.toLowerCase().includes(query) ||
        item.cCidade.toLowerCase().includes(query) ||
        item.cUF.toLowerCase().includes(query) ||
        item.cTransportadora?.toLowerCase().includes(query)
      );
    });
  };
  
  const normalizar = (str: string) => {
    if (!str) return "";
    return str
      .normalize("NFD")               // separa acentos
      .replace(/[\u0300-\u036f]/g, "")// remove acentos
      .toLowerCase();                 // ignora case
  };

  const filtrarPedidosAreaCliente = () => {
    const query = normalizar(querieProcura.value);

    infoPedidosTabelaAreaCliente.value = infoPedidosTabelaAreaClienteStatic.value.filter((item) => {
      return (
        normalizar(item.guiaRemessa).includes(query) ||
        normalizar(item.pedido).includes(query) ||
        normalizar(item.ov).includes(query) ||
        normalizar(item.nfe).includes(query) ||
        normalizar(item.status).includes(query) ||
        normalizar(item.destinatario.toString()).includes(query) ||
        normalizar(item.uF).includes(query)
      );
    });
  };
  // ---------------------------------------------/

  // NAVEGAÇÃO E REGRAS DE ACESSO ----------------\
  const IrParaRota = (rota: string) => {
    router.push(rota);
  };
  const OnClickGerenciadorAPI = async (rota: string) => {
    const requestTela: RegistraAtualizaControleTelaRequestDTO = {
      cDescricaoTela: `GERENCIADOR API`, // ajusta para o nome da sua tela
      ID_Objeto: ID_Carteira.value,
      ID_Usuario: userID.value ?? 0,
    };

    // Confere se tem alguem la:
    const resultadoTela = await verificaAcessoTela(requestTela);

    if (!resultadoTela.liberado) {
      ToastWarning(`ESSE GERENCIADOR API ESTÁ ABERTA EM OUTRA TELA:\n${resultadoTela.usuarioOcupando}`);
      return; // bloqueia entrada
    }

    IrParaRota(rota);
  };
  const enablePermittedPath = () => {
    // Aqui eu pego a lista de funcionalidades que existem nessa página(1 a 8):
    const listaFuncionalidades = document.getElementsByClassName('btn-azul-claro');

    // const listaIds: [] = [];
    // for (let i = 0; i < listaFuncionalidades.length; i++) {
    //   listaIds.push(Number(listaFuncionalidades[i].id));
    // }

    // for (let i = 0; i < listaIds.length; i++) {
    //   let permitido = this.infoPermissoesUsuario.some(info => info.iD_Funcionalidade === listaIds[i]);

    //   // Se estiver permitido:
    //   if (permitido) {
    //     const card = document.getElementById(String(listaIds[i]));
    //     const titulo = this.infoPermissoesUsuario.find(info => info.iD_Funcionalidade === listaIds[i]).nomeFuncionalidade;

    //     card.title = titulo;
    //     card.parentElement.parentElement.title = '';
    //     card.classList.remove('disabled');
    //     card.classList.add('BOX-SHADOW-H-black');
    //   }
    // }
  };
  // ---------------------------------------------/

  // Verificação da tela: ----------------------------------------------------\
  let intervaloSessao: number | undefined;
  const VerificaERegistraAtualizaAcessoTela = async (
    request: RegistraAtualizaControleTelaRequestDTO,
    callback?: (resultado: RegistrarSessaoTelaResult) => void
  ) => {
    // Primeira chamada imediata
    const resultado = await RegistraAtualizaAcessoTela(request);
    callback?.(resultado);

    // Limpa intervalo antigo, caso exista
    if (intervaloSessao) clearInterval(intervaloSessao);

    // Configura repetição a cada 60 segundos
    intervaloSessao = window.setInterval(async () => {
      const resultadoAtual = await RegistraAtualizaAcessoTela(request);
      callback?.(resultadoAtual);
    }, 60000); // 60 segundos
  };
  const verificaEExpulsaTela = async (requestTela: RegistraAtualizaControleTelaRequestDTO) => {
    const resultado = await verificaAcessoTela(requestTela);

    if (!resultado.liberado) {
      // Pode exibir alerta opcional
      ToastWarning(`Tela ocupada por: ${resultado.usuarioOcupando || 'Outro usuário'}`);
      // Redireciona
      router.push('/producao/bipagem');
    }

    return resultado;
  }
  // -------------------------------------------------------------------------/

  // PDF corte logico --------------------------------------------------------\
  const isLoadingPDF = ref<boolean>(false);
  const isAguardandoOption = ref<boolean>(false);
  const embysProcurando = ref<boolean>(false);
  const selectedPedidoGuiaRemessa = ref<objetoPadrao | null>(null);
  const tituloBotoesSeta = ref<string>('');
  const infoPedidosGuiaRemessa = ref<objetoPadrao[]>();
  const infoPedidosGuiaRemessaStatic = ref<objetoPadrao[]>();

  const FetchPedidoGuiaRemessa = async () => {
    // this.$refs.selectedPedidoCorteLogico.isLoadingInputValue(true);
    try {
      let res = await axios.get(`${urlBase}/sla/pedido/pedido-guia-remessa/${ID_Carteira.value}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Aqui vai os pedidos que estão na tabela no momento:
      infoPedidosGuiaRemessaStatic.value = res.data;
      infoPedidosGuiaRemessa.value = res.data;
    } catch (error) {
      console.error(error);
    } finally {
      // this.$refs.selectedPedidoCorteLogico.isLoadingInputValue(false);
    }
  };

  const FetchPDF_1 = async (body: any) => {
    try {
      const response = await axios.post(
        `${urlBase}/sla/historico-corte-logico/relatorio-PDF`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob'
        }
      );
      
      return response.data;
    } catch (error) { console.error(error); }
    finally { }
  };
  const FetchPDF_2 = async (body: any) => {
    try {
      const response = await axios.post(
        `${urlBase}/sla/historico-corte-logico/relatorio-PDF-por-lista-pedido`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob'
        }
      );

      return response.data;
    } catch (error) { console.error(error); }
    finally { }
  };
  const exibirPDF = (iframeID: string, pdfBytes: any) => {
    // Cria um Blob a partir dos bytes do PDF:
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Cria uma URL temporária para o Blob:
    const url = URL.createObjectURL(blob);

    // Recupera o iframe:
    const iframe = document.getElementById(iframeID) as HTMLIFrameElement | null;
    if (iframe) {
      iframe.src = url;
    }
  };

  const FetchPDFs = async () => {
    // Busca lista filtrada com query:
    

    // pra buscar os PDF, precisa mudar a requisição:
    try {
      embysProcurando.value = true;
      isLoadingPDF.value = true;
      let body = {};

      if (isAguardandoOption.value) {
        body = {
          ID_Carteira: ID_Carteira.value,
          // listaID_Pedidos: [] // substituida pelo novo formato da query
          query: querieProcura.value // substituida pelo novo formato da query
        };
      } else {
        body = {
          ID_Carteira: ID_Carteira.value,
          listaID_Pedidos: [] // substituida pelo novo formato da query
        };
      }

      if (isAguardandoOption.value) {
        const PDF1 = await FetchPDF_1(body);
        exibirPDF('pdf-1-iframe', PDF1);
      } else {
        const PDF2 = await FetchPDF_2(body);
        exibirPDF('pdf-2-iframe', PDF2);
      }

    } catch (error) { 
      console.error(error); 
    } finally {
      isLoadingPDF.value = false;
      embysProcurando.value = false;
    }
  };

  const onChangePedidoGuiaRemessaSelectREF = async () => {
    if (!selectedPedidoGuiaRemessa.value) {
      isLoadingPDF.value = true;
      embysProcurando.value = false;
      return;
    }
    await FetchPDFs();
  };

  const OnClickFecharModalRelatorioCorteLogico = () => {

  };

  const OnClickRelatorioCorteLogico = async () => {
    isLoadingPDF.value = true;
    isAguardandoOption.value = true;
    await FetchPedidoGuiaRemessa();
    await FetchPDFs();
  };

  // EXCELs de corte lógico:
  const FetchExcelCorteLogico = async () => {
    ToastWarning('Em desenvolvimento');
  };

  const OnclickBotaoSeta = async () => {
    selectedPedidoGuiaRemessa.value = null;

    if (isAguardandoOption.value) {
      const iframe = document.getElementById("pdf-1-iframe") as HTMLIFrameElement | null;
      if (iframe) iframe.src = "";
    } else {
      const iframe = document.getElementById("pdf-2-iframe") as HTMLIFrameElement | null;
      if (iframe) iframe.src = "";
    }

    // Caso seja a opção AGUARDANDO no momento do click:
    if (isAguardandoOption.value) {
      isAguardandoOption.value = !isAguardandoOption.value;
      tituloBotoesSeta.value = 'AGUARDANDO';
      isLoadingPDF.value = true;
      embysProcurando.value = false;
    } else {
      // É pra buscar todos os AGUARDANDO:
      isAguardandoOption.value = !isAguardandoOption.value;
      tituloBotoesSeta.value = 'POR PEDIDOS';
      embysProcurando.value = true;
      await FetchPDFs();
    }

  };

  const disableBotoesEnvioEmail = (bool: boolean): void => {
    const buttonInterno = document.getElementById('button-email-interno') as HTMLButtonElement | null;
    const buttonExterno = document.getElementById('button-email-externo') as HTMLButtonElement | null;

    if (buttonInterno) buttonInterno.disabled = bool;
    if (buttonExterno) buttonExterno.disabled = bool;
  };

  const OnClickEnviarEmailInterno = async () => {
    disableBotoesEnvioEmail(true);
    
    ToastWarning("Aguarde enquanto enviamos seu e-mail.");
    try {
      const body = {
        ID_Carteira: ID_Carteira.value,
        // listaID_Pedidos: [] // substituida pelo novo formato da query
        query: querieProcura.value // substituida pelo novo formato da query
      };

      // E-mail interno:
      const response = await axios.post(
        `${urlBase}/sla/historico-corte-logico/enviar-email-PDF-relatorio-corte-logico/1`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      ToastSuccess("E-mail enviado com sucesso.");
    } catch(error) {
      console.error(error);
      ToastError('Erro no envio do e-mail.\nConsulte a TI.');
    } finally {
      disableBotoesEnvioEmail(false);
    }
  };
  const OnClickEnviarEmailExterno = async () => {
    disableBotoesEnvioEmail(true);
    
    ToastWarning("Aguarde enquanto enviamos seu e-mail.");
    try {
      const body = {
        ID_Carteira: ID_Carteira.value,
        // listaID_Pedidos: [] // substituida pelo novo formato da query
        query: querieProcura.value // substituida pelo novo formato da query

      };

      // E-mail externo:
      const response = await axios.post(
        `${urlBase}/sla/historico-corte-logico/enviar-email-PDF-relatorio-corte-logico/2`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      ToastSuccess("E-mail enviado com sucesso.");
    } catch(error) {
      console.error(error);
      ToastError('Erro no envio do e-mail.\nConsulte a TI.');
    } finally {
      disableBotoesEnvioEmail(false);
    }
  };

  // MOUNTED --------------------------------------
  onMounted(async () => {
    await carregarTabela();
    reservasEmAbertoPCP.value = await BuscaQtdReservasEmAbertoPCP(ID_Carteira.value);

    window.addEventListener('resize', ajustarAlturaTabelaOnResize);
    
    enablePermittedPath();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', ajustarAlturaTabelaOnResize)
  });

 onScopeDispose(() => {
    requests.cancel();
  });


</script>


<template>

  <!-- Modal RELATORIOS CORTE LOGICO -->
  <div class="modal fade" id="relatorioCorteLogicoModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="relatorioCorteLogicoModalLabel" aria-hidden="false">
    <div class="modal-dialog modal-xl MAX-WIDTH-80 modal-dialog-centered">
      <div class="modal-content">

        <!-- Cabeçalho MODAL -->
        <div class="MAX-HEIGHT-8vh PADDING-T5-R10-B5-L10 D-flex JC-space-between ALITEM-center BOR-B-grey-5">
          <img src="assets\images\Logo-E-azul-enhanced.png" alt="Logo Grupo Embalarte" class="WIDTH-2 HEIGHT-2" title="Grupo Embalarte">
          <h1 class="modal-title fs-5 WIDTH-58 D-flex JC-center ALITEM-center" id="relatorioCorteLogicoModalLabel">RELATÓRIO • CORTE LÓGICO</h1>

          <!-- Botão de Fechar a modal -->
          <button id="insert-modal-close-button" @click="OnClickFecharModalRelatorioCorteLogico()"
            data-bs-dismiss="modal" type="button" class="btn-close" aria-label="Close">
          </button>
        </div>

        <!-- Corpo MODAL -->
        <div id="insert-modal-corpo" class="BOR-B-grey-2 HEIGHT-80vh D-flex FD-column PADDING-20">
          <!-- DIV com AGUARDANDO | SELECT -->
          <div class="D-flex WIDTH-100 HEIGHT-8 BORRAD-5 PADDING-B5">
            <!-- Botão esquerda -->
            <div class="WIDTH-10">
              <button @click="OnclickBotaoSeta()" :title="tituloBotoesSeta" class="btn btn-light HEIGHT-100 WIDTH-100 D-flex ALITEM-center JC-center">
                <IconsSetaCarretEsquerda corProp="gray" alturaProp="3" larguraProp="3" />
              </button>
            </div>

            <!-- DIV central -->
            <div class="WIDTH-80 D-flex ALITEM-center JC-center">
              <h2 v-if="isAguardandoOption">AGUARDANDO • CORTE LÓGICO</h2>

              <div v-else class="WIDTH-100 HEIGHT-100 D-flex JC-center ALITEM-center">
                <!-- TRANSPORTADORA -->
                <BasicElementVue3SelectPequeno
                  ref="selectedPedidoCorteLogico"

                  :options="infoPedidosGuiaRemessa"
                  optionLabel="cNome"
                  v-model="selectedPedidoGuiaRemessa"
                  
                  @update:modelValue="onChangePedidoGuiaRemessaSelectREF"

                  label="PEDIDO/GUIA REMESSA:"
                  :titulo="selectedPedidoGuiaRemessa?.cNome"

                  :divClass="'WIDTH-40 col-1 MARGIN-T21-R5'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15'"
                  :widthLista="''"
                />
              </div>
            </div>

            <!-- Botão direita -->
            <div class="WIDTH-10">
              <button @click="OnclickBotaoSeta()" :title="tituloBotoesSeta" class="btn btn-light HEIGHT-100 WIDTH-100 D-flex ALITEM-center JC-center">
                <IconsSetaCarretDireita corProp="gray" alturaProp="3" larguraProp="3" />
              </button>
            </div>
          </div>

          <!-- DIV com PDFs -->
          <div class="D-flex WIDTH-100 HEIGHT-92">
            <!-- PDF 1 -->
            <div v-show="!isLoadingPDF" v-if="isAguardandoOption" class="D-flex WIDTH-100 FD-column JC-space-between HEIGHT-100 PADDING-R5">
              <div class="D-flex JC-center ALITEM-center WIDTH-100 HEIGHT-94 BORRAD-5">
                <iframe id="pdf-1-iframe"
                  class="HEIGHT-100 WIDTH-100 PADDING-0 BORRAD-5 MARGIN-0 ANIMATION-OPA-0-1-125 BOR-B-grey"
                ></iframe>
              </div>

              <!-- Rodapé com botões de email -->
              <div class="D-flex JC-flex-end ALITEM-center HEIGHT-5 WIDTH-100 BORRAD-5 PADDING-T2">
                <button id="button-email-interno" class="btn btn-primary MARGIN-R5 FSIZE-12px" @click="OnClickEnviarEmailInterno()"  
                >ENVIAR E-MAIL INTERNO</button>
                <button id="button-email-externo" class="btn btn-warning FSIZE-12px" @click="OnClickEnviarEmailExterno()"
                >ENVIAR E-MAIL EXTERNO</button>
              </div>
            </div>

            <!-- PDF 2 -->
            <div v-show="!isLoadingPDF" v-if="!isAguardandoOption" class="D-flex WIDTH-100 HEIGHT-100 BORRAD-5 PADDING-L5">
              <div class="D-flex JC-center ALITEM-center WIDTH-100 HEIGHT-100 BORRAD-5">
                <iframe id="pdf-2-iframe"
                  class="HEIGHT-100 WIDTH-100 PADDING-0 BORRAD-5 MARGIN-0 ANIMATION-OPA-0-1-125 BOR-B-grey"
                ></iframe>
              </div>
            </div>

            <!-- Carregamento PDF -->
            <div v-show="isLoadingPDF" class="WIDTH-100 HEIGHT-100 BGC-cinza-10 PADDING-B5 MARGIN-0 D-flex JC-center ALITEM-center">
              <!-- <img src="/assets/images/gif-carregamento-horizontal.gif" alt="Carregando..." style="width: 100px; height: auto;"/> -->
              <img v-if="embysProcurando" src="/assets/images/Embys-PDF.png" alt="Carregando..." class=""
                style="width: 300px; height: auto;"/>
              <img v-else src="/assets/images/embys_selecione_pedido.png" alt="Carregando..." class=""
                style="width: 300px; height: auto;"/>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>


  <main>  
    <!-- DIV CABEÇALHO -->
    <SetorProducaoSLAMenuSuperior 
      funcionalidadeProp="SLA - PEDIDOS"
      destinoVoltarProp="/"
      :srcFoto="logoPath"
    /> 
    
    <!-- DIV CORPO -->
    <div class="D-flex FD-column HEIGHT-88vh WIDTH-100 JC-center ALITEM-center BGC-cinza-9 BOR-branca">

      <!-- QUADRADO BRANCO PARA CONTER A TABELA -->
      <div class="D-flex FD-column ALITEM-center JC-center HEIGHT-85 WIDTH-98 BORRAD-5 BGC-branco PADDING-T5-R10-B5-L10">

        <!-- PARTE COM A BARRA E A O REFRESH -->
				<!-- Barra de pesquisa -->
        <div class="ALITEM-center HEIGHT-95 WIDTH-100 mb-1">

          <!-- <div class="WIDTH-10 MARGIN-T-13" >
            <label
              id="data-inicio-ck-label"
              for="data-inicio-ck-input"
              class="form-label BGC-branco BORRAD-5 FSIZE-10px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
            >A PARTIR DE</label>
            <input
              autocomplete="off"
              id="data-inicio-ck-input"
              type="date"
              onkeydown="return false"
              v-model="dataInicio"
              @change="OnChangeDataInicio"
              class="form-control BORRAD-5 BOR-grey MARGIN-T-10 FSIZE-12px BGC-branco">
          </div> -->

          <div class="WIDTH-100 D-flex JC-space-between HEIGHT-6">

            <div class="abas WIDTH-40">
              <button class="aba-button FSIZE-14px" @click="showTab('tab1')" :class="{ active: currentTab === 'tab1' }">Todos</button>
              <button class="aba-button FSIZE-14px" @click="showTab('tab2')" :class="{ active: currentTab === 'tab2' }">Corte Lógico Atual</button>
              <button class="aba-button FSIZE-14px" @click="showTab('tab3')" :class="{ active: currentTab === 'tab3' }">Pedidos Aguardando</button>
              <button class="aba-button FSIZE-14px" @click="showTab('tab4')" :class="{ active: currentTab === 'tab4' }">Pedidos Cancelados</button>
            </div>
            
            <div class="D-flex ALITEM-center JC-flex-end WIDTH-50">
              <!-- Aqui vai os botões de extrair EXCEL caso seja CORTE LÓGICO -->
              <div v-if="currentTab === 'tab2'" class="">
                <!-- EXCEL -->
                <button :disabled="isLoadingEXCELRelatorio" id="exportar-EXCEL-button" type="button"
                  class="btn btn-warning MARGIN-R5 FSIZE-12px PADDING-4 "
                  data-bs-toggle="modal"
                  data-bs-target="#relatorioCorteLogicoModal"
                  @click="OnClickRelatorioCorteLogico()">
                  <IconsExcel corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                  Exportar PDF • HISTÓRICO</button>

                <!-- EXCEL  -->
                <!-- <button :disabled="isLoadingEXCELRelatorio" id="exportar-EXCEL-button" type="button"
                  class="btn btn-success MARGIN-R5 FSIZE-12px PADDING-4 " @click="FetchExcelCorteLogico()">
                  <IconsPDF corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                  Exportar EXCEL • ATUAL
                </button> -->
              </div>

              <div style="margin-right: 10px; cursor: pointer;" @click="clickRefreshPedidosButton()" title="Atualizar informações">
                <IconsRefresh
                  corProp="rgb(24, 134, 84)"
                  alturaProp="1.6"
                  larguraProp="1.6"
                />
              </div>
  
              <div class="input-group input-group-sm WIDTH-28 HEIGHT-100">
                <input
                  autocomplete="off"
                  v-model="querieProcura"
                  id="barra-procura"
                  type="text"
                  @keyup="OnKeyUpBarraPesquisa"
                  class="form-control BOR-grey FSIZE-12px HEIGHT-90"
                  placeholder="Buscar"
                  />
                  <!-- @blur="OnBlurBarraPesquisa" -->
              <button class="btn btn-outline-secondary D-flex JC-center ALITEM-center HEIGHT-90"
                @click="OnClickLupaBarraPesquisa">
                <IconsLupa corProp="black" alturaProp="1.25" larguraProp="1.25" />
              </button>
              </div>
            </div>
            
          </div>

          <!-- DIV PARA A TABELA - PARTE BRANCA - CORPO -->
          <div ref="tableContainer" class="table-container WIDTH-100 BOR-SensacaoAfundado HEIGHT-94" :class="{ 'com-scroll': linhaExpandidaDaTabelaAreaCliente !== null }" :style="{ '--row-h': rowHeightPx + 'px' }">
            <!-- TABELA -->
            <table class="table-responsive table-sm table-striped table-fixed WIDTH-100 BORRAD-5 FSIZE-PADRAO-TABLE">
              <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
               
                <!-- CABEÇALHO QUANDO A TABELA FOR DA TAB1 -->
                <tr v-if="currentTab == 'tab1' ">
                  <th class="WIDTH-2  TEXTALI-center no-wrap-text"></th>
                  <th class="WIDTH-2  TEXTALI-center no-wrap-text"></th>
                  <th class="WIDTH-2  TEXTALI-center no-wrap-text"></th>
                  <th class="WIDTH-2  TEXTALI-center no-wrap-text"></th>
                  <th class="WIDTH-7  TEXTALI-center no-wrap-text">DATA</th>
                  <th class="WIDTH-7  TEXTALI-center no-wrap-text">CK</th>
                  <th class="WIDTH-10  TEXTALI-center no-wrap-text">GUIA REMESSA</th>
                  <th class="WIDTH-10 TEXTALI-center no-wrap-text">PEDIDO</th>
                  <th class="WIDTH-6  TEXTALI-center no-wrap-text">O.V.</th>
                  <th class="WIDTH-8  TEXTALI-center no-wrap-text">NFE</th>
                  <th class="WIDTH-4  TEXTALI-center no-wrap-text">VOL.</th>
                  <th class="WIDTH-17 TEXTALI-center no-wrap-text">DESTINATÁRIO</th>
                  <th class="WIDTH-4  TEXTALI-center no-wrap-text">UF</th>
                  <th class="WIDTH-8  TEXTALI-center no-wrap-text">STATUS</th>
                  <th class="WIDTH-14 TEXTALI-center no-wrap-text">TRANSPORTADORA</th>
                </tr>

                <!-- CABEÇALHO QUANDO A TABELA FOR DA TAB2, 3 OU 4 (ERA ÁREA DO CLIENTE) -->
                <tr v-if="currentTab != 'tab1'">
                  <th class="TEXTALI-center WIDTH-2 no-wrap-text"></th>
                  <th class="TEXTALI-center WIDTH-9 no-wrap-text">DATA</th>
                  <th class="TEXTALI-center WIDTH-9 no-wrap-text">GUIA REMESSA</th>
                  <th class="TEXTALI-center WIDTH-10 no-wrap-text">PEDIDO</th>
                  <th class="TEXTALI-center WIDTH-8 no-wrap-text">O.V.</th>
                  <th class="TEXTALI-center WIDTH-9 no-wrap-text">NFE</th>
                  <th class="TEXTALI-center WIDTH-5 no-wrap-text">VOL.</th>
                  <th v-if="currentTab == 'tab2'" class="TEXTALI-center WIDTH-17 no-wrap-text">DESTINATÁRIO</th>
                  <th v-if="currentTab == 'tab3'" class="TEXTALI-center WIDTH-24 no-wrap-text">DESTINATÁRIO</th>
                  <th v-if="currentTab == 'tab4'" class="TEXTALI-center WIDTH-20 no-wrap-text">DESTINATÁRIO</th>
                  <th class="TEXTALI-center WIDTH-5 no-wrap-text">UF</th>
                  <th class="TEXTALI-center WIDTH-8 no-wrap-text">STATUS</th>
                  <th v-if="currentTab == 'tab2'" class="TEXTALI-center WIDTH-18 no-wrap-text">TRANSPORTADORA</th>
                  <th v-if="currentTab == 'tab3'" class="TEXTALI-center WIDTH-11 no-wrap-text">DATA INPUT</th>
                  <th v-if="currentTab == 'tab4'" class="TEXTALI-center WIDTH-15 no-wrap-text">DATA CANCELAMENTO</th>
                </tr>

              </thead>

              <LayoutTabelaCarregarEsqueleto
                :Linhas="rowsPerPage"
                :Colunas=15 v-if="!tabelaPronta" />

              <tbody v-if="tabelaPronta" class="BORRAD-5">
              
                <!-- LINHAS PARA QUANDO A TABELA FOR DA TAB1 -->
                <template v-for="(pedido, i) in infoPedidosGuia1Slice" :key="i">

                  <!-- LINHA PRINCIPAL -->
                  <tr v-if="currentTab == 'tab1'" class="CURSOR-pointer BGC-H-cinza-8" :key="i" :class="applyTableStipedRows(i + 1)">
                    <!-- BOTÃO EXPANDIR -->
                    <td class="WIDTH-2 TEXTALI-center ALITEM-center">
                      <button
                        title="Mais informações"
                        class="custom-button"
                        style="height: 15px; width: 15px;"
                        @click.stop.prevent="ativarSubLinhaItensPedido(pedido.iD_Pedido ?? 0)"
                      >{{ linhaExpandidaDaTabelaPedidos === pedido.iD_Pedido ? '-' : '+' }}
                      </button>
                    </td>
                    <td class="WIDTH-2 JC-center CTTABLEELPIS">
                      <button type="button" class="in-table-button" title="Visualizar pedido"
                      @click="abrirModalVisualizaPDFs(pedido.iD_Pedido, 'PDF PEDIDO')">
                        <IconsPedido corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                      </button>
                    </td>
                    <td class="WIDTH-2 JC-center CTTABLEELPIS">
                      <button type="button" class="in-table-button" title="Visualizar etapas sistêmicas" @click="abrirModalEtapasSistema(pedido.iD_Pedido)">
                        <IconsPencilDoc corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                      </button>
                    </td>
                    <td class="WIDTH-2 JC-center CTTABLEELPIS">
                      <button type="button" class="in-table-button" title="Visualizar cópia do Danfe"
                      @click="abrirModalVisualizaPDFs(pedido.iD_Pedido, 'PDF DANFE')">
                        <IconsDocument corProp="currentColor" alturaProp="1" larguraProp="1"/>
                      </button>
                    </td>
                    <td class="WIDTH-7  TEXTALI-center CTTABLEELPIS" :title="cellTitle(pedido.dInput)">{{ pedido.dInput }}</td>
                    <td class="WIDTH-7  TEXTALI-center CTTABLEELPIS" :title="cellTitle(pedido.cCK)">{{ pedido.cCK }}</td>
                    <td class="WIDTH-10  TEXTALI-center CTTABLEELPIS" :title="cellTitle(pedido.cGuiaRemessa)">{{ pedido.cGuiaRemessa }}</td>
                    <td class="WIDTH-10 TEXTALI-center CTTABLEELPIS" :title="cellTitle(pedido.cNumPedido)">{{ pedido.cNumPedido }}</td>                 
                    <td class="WIDTH-6  TEXTALI-center CTTABLEELPIS" :title="cellTitle(pedido.cOV)">{{ pedido.cOV }}</td>             
                    <td class="WIDTH-8  TEXTALI-center CTTABLEELPIS" :title="cellTitle(pedido.cNumNFE)">{{ pedido.cNumNFE }}</td>             
                    <td class="WIDTH-4  TEXTALI-center CTTABLEELPIS" :title="cellTitle(pedido.iVolume)">{{ pedido.iVolume }}</td>             
                    <td class="WIDTH-17 TEXTALI-left   CTTABLEELPIS" :title="cellTitle(pedido.cNome)">{{ pedido.cNome }}</td>             
                    <td class="WIDTH-4  TEXTALI-center  CTTABLEELPIS" :title="cellTitle(pedido.cUF)">{{ pedido.cUF }}</td>  
                    <td class="WIDTH-7  TEXTALI-center  CTTABLEELPIS" :class="[getStatusClass(pedido.cPedidoStatusAPI)]" :title="cellTitle(pedido.cPedidoStatusAPI)">{{ pedido.cPedidoStatusAPI }}</td>
                    <td class="WIDTH-14 TEXTALI-left   CTTABLEELPIS" :title="cellTitle(pedido.cTransportadora)">{{ pedido.cTransportadora }}</td>
                  </tr>

                  <!-- Linha expandida -->
                  <tr v-if="linhaExpandidaDaTabelaPedidos === pedido.iD_Pedido">
                    <td colspan="15" class="expanded-row" style="background-color: #fff0f0;">
                      <div class="expanded-content" style="display: flex">
                        <table class="table table-sm FSIZE-PADRAO-TABLE" style="overflow-x: hidden; width: 100%; border: 2px 0px 0px 0px solid #000; border-collapse: collapse; z-index: 1">
                          
                          <thead class="BGC-cinza-secondary POSITION-sticky TOP-1px">
                            <tr>
                              <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10 no-wrap-text">GUIA REMESSA</th>
                              <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10 no-wrap-text" >N° PEDIDO</th>
                              <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10 no-wrap-text" >CÓD. COMP.</th>
                              <th style="background-color: #97b6b8" class="TEXTALI-left  WIDTH-60   no-wrap-text">DESC. COMP.</th>
                              <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10 no-wrap-text">QUANTIDADE</th>
                            </tr>
                          </thead>
                          <LayoutTabelaCarregarEsqueleto
                            :Linhas="infoPedidosItensTabelaSlice.length === 0 ? 4 : infoPedidosItensTabelaSlice.length"
                            :Colunas=15 v-if="!mostrarTodosPedidosItensAreaCliente" />

                          <tbody>
                            <template v-for="(pedidoItem, j) in infoPedidosItensTabelaSlice" :key="j">

                              <tr :class="applyTableStipedRows(j)">
                                <td class="TEXTALI-center WIDTH-10 no-wrap-text CTTABLEELPIS" style="background-color: #e0e0e0;">{{ pedidoItem.guiaRemessa }}</td>
                                <td class="TEXTALI-center WIDTH-10 no-wrap-text CTTABLEELPIS" style="background-color: #e0e0e0;">{{ pedido.cNumPedido }}</td>
                                <td class="TEXTALI-center WIDTH-10 no-wrap-text CTTABLEELPIS" style="background-color: #e0e0e0;">{{ pedidoItem.cdProduto }}</td>
                                <td class="TEXTALI-left WIDTH-60 no-wrap-text   CTTABLEELPIS" :title="pedidoItem.nmProduto ?? undefined" style="background-color: #e0e0e0;">{{ pedidoItem.nmProduto ? pedidoItem.nmProduto : "COMP. NÃO CADASTRADO" }}</td>
                                <td class="TEXTALI-center WIDTH-10 no-wrap-text CTTABLEELPIS" style="background-color: #e0e0e0;">{{ pedidoItem.quantidade }}</td>
                              </tr>
                              
                            </template>
                          </tbody>

                        </table>
                      </div>
                    </td>
                  </tr>

                </template>

              <!-- LINHAS PARA QUANDO A TABELA FOR DA TAB2, 3 OU 4 (ERA ÁREA DO CLIENTE) -->
                <template v-for="(pedido, i) in infoPedidosTabelaAreaCliente" :key="i">
              
                  <tr v-if="currentTab != 'tab1'" class="CURSOR-pointer BGC-H-cinza-8" :key="i" :class="applyTableStipedRows(i + 1)">
                    <td class="WIDTH-2 TEXTALI-center ALITEM-center">
                      <button
                        title="Mais informações"
                        class="custom-button"
                        style="height: 15px; width: 15px;"
                        @click.stop.prevent="ativarSubLinhaItensAreaCliente(pedido.idPedido ?? 0)"
                      >{{ linhaExpandidaDaTabelaAreaCliente === pedido.idPedido ? '-' : '+' }}
                      </button>
                    </td>
                    <!-- <td class="TEXTALI-center WIDTH-2 TableElipsis">
                      <button type="button" class="in-table-button" title="Visualizar pedido" :disabled="bloqueandoLupaPedidosItens" @click="clickLupaPedidos(pedido.idPedido)">
                        <IconsLupa corProp="currentColor" alturaProp="1" larguraProp="1" />
                      </button>
                    </td> -->
                    <td class="TEXTALI-center WIDTH-9 TableElipsis">{{ pedido.data }}</td>
                    <td class="TEXTALI-center WIDTH-9 TableElipsis">{{ pedido.guiaRemessa }}</td>
                    <td class="TEXTALI-center WIDTH-10 TableElipsis">{{ pedido.pedido }}</td>
                    <td class="TEXTALI-center WIDTH-8 TableElipsis">{{ pedido.ov }}</td>                  
                    <td class="TEXTALI-center WIDTH-9 TableElipsis">{{ pedido.nfe }}</td>             
                    <td class="TEXTALI-center WIDTH-5 TableElipsis">{{ pedido.volume }}</td>             
                    <td v-if="currentTab == 'tab2'" class="TEXTALI-left WIDTH-17 TableElipsis">{{ pedido.destinatario }}</td>             
                    <td v-if="currentTab == 'tab3'"  class="TEXTALI-left WIDTH-24 TableElipsis">{{ pedido.destinatario }}</td>             
                    <td v-if="currentTab == 'tab4'"  class="TEXTALI-left WIDTH-20 TableElipsis">{{ pedido.destinatario }}</td>             
                    <td class="TEXTALI-center WIDTH-5 TableElipsis">{{ pedido.uF }}</td>             
                    <td class="TEXTALI-center WIDTH-8 TableElipsis" :class="[getStatusClass(pedido.status)]">{{ pedido.status }}</td>  
                    <td v-if="currentTab == 'tab2'" class="TEXTALI-left WIDTH-18 TableElipsis">{{ pedido.transportadora }}</td>  
                    <td v-if="currentTab == 'tab3'" class="TEXTALI-center WIDTH-11 TableElipsis">{{ pedido.dataRecebimentoAPIPedido }}</td>  
                    <td v-if="currentTab == 'tab4'" class="TEXTALI-center WIDTH-15 TableElipsis">{{ pedido.dataCancelamentoPedido }}</td>  
                  </tr>

                  <!-- Linha expandida -->
                  <tr v-if="linhaExpandidaDaTabelaAreaCliente == pedido.idPedido">
                    <td colspan="15" class="expanded-row" style="background-color: #fff0f0;">
                      <div class="expanded-content" style="display: flex">
                        <table class="table table-sm FSIZE-PADRAO-TABLE" style="overflow-x: hidden; width: 100%; border: 2px 0px 0px 0px solid #000; border-collapse: collapse; z-index: 1">
                          
                          <thead class="BGC-cinza-secondary POSITION-sticky TOP-1px">
                            <tr>
                              <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10">GUIA REMESSA</th>
                              <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10">SITUAÇÃO</th>
                              <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10">N° PEDIDO</th>
                              <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10">CÓD. COMP.</th>
                              <th style="background-color: #97b6b8" class="TEXTALI-left  WIDTH-50">DESC. COMP.</th>
                              <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10">QUANTIDADE</th>

                            </tr>
                          </thead>
                          <LayoutTabelaCarregarEsqueleto
                            :Linhas="infoPedidosItensTabelaSlice.length === 0 ? 4 : infoPedidosItensTabelaSlice.length"
                            :Colunas=6 v-if="!mostrarTodosPedidosItensAreaCliente" />

                          <tbody>
                            <template v-for="(pedidoItem, j) in infoPedidosItensTabelaSlice" :key="j">

                              <tr class="PADRAO-TABLE" :class="applyTableStipedRows(j)">
                                <td class="TEXTALI-center WIDTH-10 no-wrap-text CTTABLEELPIS">{{ pedidoItem.guiaRemessa }}</td>
                                <td v-if="pedidoItem.itemComCorteLogico" class="TEXTALI-center WIDTH-10 no-wrap-text CTTABLEELPIS" :style="bgCorteLogico(pedidoItem)" >CORTE LÓGICO</td>
                                <td v-else class="TEXTALI-center WIDTH-10 no-wrap-text CTTABLEELPIS">DISPONÍVEL</td>
                                <td class="TEXTALI-center WIDTH-10 no-wrap-text CTTABLEELPIS">{{ pedido.idPedido }}</td>
                                <td class="TEXTALI-center WIDTH-10 no-wrap-text CTTABLEELPIS">{{ pedidoItem.cdProduto }}</td>
                                <td class="TEXTALI-left WIDTH-50 no-wrap-text   CTTABLEELPIS":title="pedidoItem.nmProduto ?? undefined">{{ pedidoItem.nmProduto ? pedidoItem.nmProduto : "COMP. NÃO CADASTRADO" }}</td>
                                <td class="TEXTALI-center WIDTH-10 no-wrap-text CTTABLEELPIS">{{ pedidoItem.quantidade }}</td>
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

        </div>

        
        <div class="WIDTH-100 HEIGHT-5">

          <LayoutPaginacaoTabelas
            v-model:currentPage="paginaAtual"
            :totalPages="totalPaginas"
            @page-change="btnProxClicado"
            :enabled="tabelaPedidosCarregada"
          />

        </div>

      </div>

      <!-- DIV BOTÕES - CORPO  -->
      <div class="D-flex ALITEM-center HEIGHT-12 WIDTH-98 BGC-cinza-9 MARGIN-T5 BOR-SensacaoAfundado PADDING-T5-R10-B5-L10" >
      
        <div class="WIDTH-75 HEIGHT-100 D-flex FD-column">

          <div class="WIDTH-100 HEIGHT-50 D-flex  ALITEM-center JC-space-between">
            <!-- entradas -->
            <button
              type="button"
              class="btn btn-azul-claro WIDTH-18 HEIGHT-80 D-flex JC-center ALITEM-center"
              @click="IrParaRota(`/sla/entradas`)"
            >
              Entradas
            </button>
  
            <!-- saidas -->
            <button
              type="button"
              class="btn btn-azul-claro WIDTH-18 HEIGHT-80 D-flex JC-center ALITEM-center"
              @click="IrParaRota(`/sla/saidas`)"
            >
              Saídas
            </button>
  
            <!-- estoque -->
            <button
              type="button"
              class="btn btn-azul-claro WIDTH-18 HEIGHT-80 D-flex JC-center ALITEM-center"
              @click="IrParaRota(`/sla/estoque`)"
            >
              Estoque
            </button>

            <!-- estoque -->
            <button
              type="button"
              class="btn btn-azul-claro WIDTH-18 HEIGHT-80 D-flex JC-center ALITEM-center"
              @click="ToastWarning(`Indicadores desempenho em desenvolvimento.`)"
              >
              <!-- @click="IrParaRota(`/sla/${idCliente}/estoque`)" -->
              Indic. Desempenho
            </button>

            <!-- gerenciador -->
             <div class="WIDTH-18 HEIGHT-80" :title="userRole != 'Administrador' ? '⛔ Usuário sem permissão' : 'Gerenciador API'">
               <button
                 type="button"
                 class="btn btn-azul-claro WIDTH-100 HEIGHT-100 D-flex JC-center ALITEM-center"
                 disabled
                 >
                 <!-- @click="OnClickGerenciadorAPI(`/sla/gerenciadorAPI`)" -->
                 <!-- style="color: blue;" -->
                 <!-- @click="IrParaRota(`/sla/gerenciadorAPI`)" -->
                 Gerenciador API
               </button>
             </div>

          </div>
          <div class="WIDTH-100 HEIGHT-50 D-flex ALITEM-center JC-space-between">
            <!-- Abastecimento -->
            <button
              type="button"
              class="btn btn-azul-claro WIDTH-18 HEIGHT-80 D-flex JC-center ALITEM-center"
              @click="IrParaRota(`/sla/abastecimento`)"
            >
              Abastecimento
            </button>
  
            <!-- Consumo -->
            <button
              type="button"
              class="btn btn-azul-claro WIDTH-18 HEIGHT-80 D-flex JC-center ALITEM-center"
              @click="IrParaRota(`/sla/consumo`)"
            >
              Consumo
            </button>

            <!-- cruzamento -->
            <button
              type="button"
              class="btn btn-azul-claro WIDTH-18 HEIGHT-80 D-flex JC-center ALITEM-center"
              @click="IrParaRota(`/sla/cruzamento`)"
            >
              Cruzamento A/C
            </button>

            <!-- Area do cliente -> LOGÍSTICA REVERSA -->
            <button
              type="button"
              class="btn btn-azul-claro WIDTH-18 HEIGHT-80 D-flex JC-center ALITEM-center"
              @click="IrParaRota(`/sla/logReversa`)"
            >
              Logística Reversa
            </button>

            <!-- Area do cliente -->
            <button
              type="button"
              class="btn btn-azul-claro WIDTH-18 HEIGHT-80 D-flex JC-center ALITEM-center"
              disabled
              >
              <!-- @click="IrParaRota(`/sla/pcp`)" -->
              P.C.P.

              <span
                v-if="reservasEmAbertoPCP > 0"
                class="btn-badge"
              >
                {{ reservasEmAbertoPCP }}
              </span>
            </button>
          </div>

        </div>

        <div class="WIDTH-25 HEIGHT-100 D-flex JC-flex-end ALITEM-flex-end">
          <p></p>
        </div>

      </div>

    </div>

    <!-- DIV RODAPÉ -->
    <Rodape/>
    
  </main>
  
  <!-- MODAL -->
  <div class="modal fade" id="EtapasSistemaModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="EtapasSistemaLabel" aria-hidden="true">
    <div class="modal-dialog modal-sm MIN-WIDTH-55 modal-dialog-scrollable">
      <div class="modal-content" id="EtapasSistemaModalContent">

        <div class="d-flex justify-content-between align-items-center border-bottom p-2 HEIGHT-6vh">
          <!-- Logo -->
          <img 
            src="assets/images/Logo-E-azul-enhanced.png" 
            alt="Logo Grupo Embalarte" 
            class="WIDTH-3 HEIGHT-auto" 
            title="Grupo Embalarte">

          <span class="FWEIGHT-bold FSIZE-20px">ETAPAS SISTÊMICAS</span class="FWEIGHT-bold FSIZE-20px">

          <!-- Botão Fechar que pede confirmação -->
          <button
            title="Fechar (F4)" 
            id="update-modal-close-button" 
            type="button" 
            class="btn-close" 
            @click="fecharModalEtapasSistema()"
          ></button>
        </div>

        <div class="modal-body FFAMILY-monospace TEXTALI-center MARGIN-B10">
       
          <div class="JC-center ALITEM-center FSIZE-18px MARGIN-B20">
            CK: <strong>{{ infosEtapasSistemicas?.ck }}</strong> &nbsp;• Guia Remessa: <strong>{{ infosEtapasSistemicas?.guiaRemessa }}</strong>
          </div>

          <div class="D-flex">
            
            <div class="D-flex FD-column ALITEM-flex-end JC-flex-end WIDTH-45">
              Data input pedido............:<br>

              <!-- QUESTÃO DO CORTE LÓGICO -->
              <template v-if="!( infosEtapasSistemicas?.dataCorteLogico !== 'N/C' )">
                <span class="">
                  Data do corte lógico.........:<br>
                </span>
              </template>

              <template v-if="infosEtapasSistemicas?.dataCorteLogico !== 'N/C'">
                <span class="COLOR-red">
                  Período do corte lógico......:<br>
                </span>
              </template>
              <!-- ============================= -->

              Data pedido gerado...........:<br>
              Data separado................:<br>
              Data processado..............:<br>
              Data expedido................:<br>
              Data em rota.................:<br>
              Data entrega.................:<br>
            </div>

            <div class="D-flex FD-column ALITEM-flex-start JC-flex-start WIDTH-55 PADDING-L5">
              <strong>{{ infosEtapasSistemicas?.dataInput }}</strong>
              
              <!-- QUESTÃO DO CORTE LÓGICO -->
              <strong v-if="!( infosEtapasSistemicas?.dataCorteLogico !== 'N/C' )">N/C</strong>
              <strong v-if="infosEtapasSistemicas?.dataCorteLogico !== 'N/C'" class="COLOR-red">{{ infosEtapasSistemicas?.dataCorteLogico }}</strong>
              <!-- ============================= -->

              <strong>{{ infosEtapasSistemicas?.dataGerado }}</strong>         
              <strong>{{ infosEtapasSistemicas?.dataSeparado }}</strong>       
              <strong>{{ infosEtapasSistemicas?.dataProcessado }}</strong>     
              <strong>{{ infosEtapasSistemicas?.dataExpedido }}</strong>       
              <strong>{{ infosEtapasSistemicas?.dataEmRota }}</strong>
              <strong>{{ infosEtapasSistemicas?.dataEntrega }}</strong>        
            </div>

          </div>


        </div>

        <div class="">

        </div>

      </div>
    </div>
  </div>

<div class="modal fade" id="VisualizarPDFs" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="PDFsModalLabel" aria-hidden="false">
  <div class="modal-dialog modal-xl MAX-WIDTH-80 modal-dialog-centered">
    <div class="modal-content">

      <!-- CABEÇALHO MODAL -->
      <div class="MAX-HEIGHT-8vh PADDING-T5-R10-B5-L10 D-flex JC-space-between ALITEM-center BOR-B-grey-5">
      
        <img src="assets\images\Logo-E-azul-enhanced.png" alt="Logo Grupo Embalarte" class="WIDTH-2 HEIGHT-2" title="Grupo Embalarte">
     
        <h1 class="modal-title fs-5 WIDTH-58 D-flex JC-center ALITEM-center" id="PDFsModalLabel">{{ tituloModalPdfs }}</h1>

        <!-- Botão de Fechar a modal -->
        <button id="insert-modal-close-button" @click="fecharModalVisualizaPDFs()"
          data-bs-dismiss="modal" type="button" class="btn-close" aria-label="Close">
        </button>

      </div>

        <!-- Corpo MODAL -->
        <div id="insert-modal-corpo" class="BOR-B-grey-2 HEIGHT-80vh D-flex FD-column PADDING-5">
    
          <!-- DIV com PDFs -->
          <div class="D-flex WIDTH-100 HEIGHT-93">
         
            <!-- PDF 1 -->
            <div v-show="!carregandoPDF" class="D-flex WIDTH-100 FD-column JC-space-between HEIGHT-100 PADDING-R5">
              <div class="D-flex JC-center ALITEM-center WIDTH-100 HEIGHT-100 BORRAD-5">
                <iframe id="iframePDF"
                  class="HEIGHT-100 WIDTH-100 PADDING-0 BORRAD-5 MARGIN-0 ANIMATION-OPA-0-1-125 BOR-B-grey"
                ></iframe>
              </div>
            </div>

            <!-- Carregamento PDF -->
            <div v-show="carregandoPDF" class="WIDTH-100 HEIGHT-100 BGC-cinza-10 PADDING-B5 MARGIN-0 D-flex JC-center ALITEM-center">
              <img src="/assets/images/Embys-PDF.png" alt="Carregando..." class=""
                style="width: 300px; height: auto;"/>
            </div>

          </div>

          <div class="D-flex WIDTH-100 HEIGHT-7 p-1 JC-start ALITEM-center">
            <button type="button" class="btn btn-dark WIDTH-10 FSIZE-11px HEIGHT-90"
            @click="enviaEmailPDF(idPedidoPDF, userID, tituloModalPdfs)"
            >
              ENVIAR E-MAIL
            </button>
          </div>

          
        </div>

    </div>
  </div>
</div>

  <div class="modal fade" id="PedidoItensModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="PedidoItensModalLabel" aria-hidden="true">
    <div class="modal-dialog MIN-WIDTH-80  modal-dialog-scrollable">
      <div class="modal-content" id="PedidoItensModalContent">

        <div class="d-flex justify-content-between align-items-center border-bottom p-2 HEIGHT-6vh">
          <!-- Logo -->
          <img 
            src="assets/images/Logo-E-azul-enhanced.png" 
            alt="Logo Grupo Embalarte" 
            class="WIDTH-2 HEIGHT-auto" 
            title="Grupo Embalarte">

          <span class="FWEIGHT-bold FSIZE-20px">ITENS DO PEDIDO</span class="FWEIGHT-bold FSIZE-20px">

          <!-- Botão Fechar que pede confirmação -->
          <button
            title="Fechar (F4)" 
            id="update-modal-close-button" 
            type="button" 
            class="btn-close" 
            @click="clickXModalPedidosItens()"
          ></button>
        </div>

        <div class="modal-body HEIGHT-80vh">
          
          <div class="OFLOW-X-hidden WIDTH-100 HEIGHT-92 BOR-SensacaoAfundado mb-1">
            <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5 table-fixed BORRAD-5">
              <thead
                class="BGC-cinza-secondary POSITION-sticky TOP-1px">
                <tr>
                  <th class="TEXTALI-center WIDTH-12 TableElipsis">
                    SKU
                  </th>
                  <th class="TEXTALI-center WIDTH-67 TableElipsis">
                    DESCRIÇÃO
                  </th>
                  <th class="TEXTALI-center WIDTH-6 TableElipsis">
                    QTD.
                  </th>
                  <th class="TEXTALI-center WIDTH-12 TableElipsis">
                    GUIA REMESSA
                  </th>
                </tr>
              </thead>
              <LayoutTabelaCarregarEsqueleto
                :Linhas="infoPedidosItensTabelaSlice.length === 0 ? 4 : infoPedidosItensTabelaSlice.length"
                :Colunas=12 v-if="!mostrarTodosPedidosItensAreaCliente" />
              <tbody v-if="mostrarTodosPedidosItensAreaCliente" class="BORRAD-5">
                
                  <!-- Linha principal -->
                  <tr
                    class="CURSOR-pointer BGC-H-cinza-8 HEIGHT-5px"
                    v-for="(pedido, i) in infoPedidosItensTabelaSlice" :key="i"
                    :class="applyTableStipedRows(i)"
                  >
                    <td class="TEXTALI-center WIDTH-12 TableElipsis">
                      {{ pedido.cdProduto }}
                    </td>
                    <td class="TEXTALI-left WIDTH-67 TableElipsis">
                      {{ pedido.nmProduto }}
                    </td>
                    <td class="TEXTALI-center WIDTH-6 TableElipsis">
                      {{ pedido.quantidade }}
                    </td>
                    <td class="TEXTALI-center WIDTH-12 TableElipsis">
                      {{ pedido.guiaRemessa }}
                    </td>
                  </tr>
              </tbody>
            </table>  
          </div>

          <div class="HEIGHT-6 FSIZE-18px D-flex FD-column ALITEM-flex-end JC-flex-end bold">TOTAL DE ITENS - {{ infoPedidosItensTabelaAreaCliente.length }}</div>

        </div>

      </div>
    </div>
  </div>



</template>

<style scoped>

.table-fixed { table-layout: fixed; }

.table-container {
  overflow: hidden; /* mata o scroll */
}

.table-container.com-scroll {
  overflow-y: auto;
}

.table-container tbody tr { height: var(--row-h, 30px); }
.table-container tbody td { height: var(--row-h, 30px); }
.table-container .loading-elements { margin: 0; }

.botoes-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.botao-pedido {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.btn-paginacao {
  background-color: #d8e9fa;
  border: 1.5px solid #a6cffa;
}

/* MODAL PDFS */
/* Modal com 75% da largura */
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

.in-table-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


.no-wrap-text {
  white-space: nowrap;  /* Impede quebra de linha */
  overflow: hidden;     /* Oculta excesso de texto */
  text-overflow: ellipsis; /* Adiciona "..." se cortar */
}

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
</style>