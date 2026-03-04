<script setup>
import axios from "axios";
import { shortenInfo, applyTableStipedRows, GetGenerico } from '~/composables/visualization';
import { ToastSuccess, ToastError, ToastWarning } from '~/composables/toasts';
import { ref, nextTick } from 'vue'
import { toRaw } from 'vue';
import { useAuthStore } from '~/stores/auth';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'

const swiperModules = [Navigation, Pagination]
// VARIÁVEIS ------------------------------------------------------------------------------------------------------------

// Rota para obter o ID do cliente
const urlProd = useUrlProd();
const urlSistema = useUrlProdSistema();
const route = useRoute();
const authStore = useAuthStore();
const userID = ref(authStore.idUsuario);
// const userID_Unidade = ref(authStore.ID_Unidade).value;
// const userNome = ref(authStore.nome);
// const siglaUsuario = ref(authStore.sigla);
// const ID_Area = ref(authStore.ID_Unidade ?? 0);
const ID_Carteira = ref(authStore.idCarteira ?? 0);
const token = ref(authStore.token ?? "");

const cliente = ref({});
const logoPath = `/CLIENTES/${ID_Carteira.value}.png`;
const dataInicial = ref(new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0]);
const dataFinal = ref(new Date().toISOString().split('T')[0]);

const queryInfAdc = ref("");

const tabelaENTRADASCarregada = ref(false);

const infosTableEntradasSLA = ref([]);
const staticInfosTableEntradasSLA = ref([]); // Para manter os dados originais e poder limpar os filtros

const selectedRemetente = ref(null);
const selectedFamilia = ref(null);
const selectedTransportadora = ref(null);
const selectedNotaFiscal = ref(null);
const selectedTramite = ref(null);
const selectedCodProduto = ref(null);
const selectedDescProduto = ref(null);

const familiaEscolhaFiltro = ref([]);
const depositantesEscolhaFiltro = ref([]);



// variáveis do modal
let modalInstance = null;
let tramiteModal = {};
const itensTramiteStatic = ref([])
const itensTramite = ref([])
const imagensTramite = [];
const imagemComponente = [];
const imagensCarga = [];
const alturaInfosPx = ref(0);
const tableContainerItemTramiteStyle = ref({
  width: '99%',
  maxHeight: '0px',
})
const tabelaTRAMITEsCarregada = ref(false);
let listenerAdicionado = false;

const isLoadingPDF = ref(false);
const isVisualizarPDF = ref(false);
const modoExibicaoImagem = false;

const isLoadingPDFRelatorio = ref(false);
const isLoadingEXCELRelatorio = ref(false);

const mostrarTodos = ref(false);

// PARA A BARRA DE TOTAL FICAR CORRETAMENTE ALINHADA ===========================\
const compensacaoScroll = ref('17');
const paddingTabela = ref('0.25rem');
const tabelaWrapperEntradas = ref(null);

const ajustarCompensacaoScrollEntradas = () => {
  const el = tabelaWrapperEntradas.value;
  if (!el) return;

  const temScroll =
    el.scrollHeight > el.clientHeight;

  compensacaoScroll.value = temScroll
    ? el.offsetWidth - el.clientWidth
    : 0;
};
  const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ==============================================================================/

// FUNÇÕES ---------------------------------------------------------------------------------------------------------------
// Computeds ----------------\
const notasFiscaisEscolhaFiltro = computed(() => {
  const unicos = new Set();

  infosTableEntradasSLA.value.forEach(e => {
    if (e.numeroNFE) {
      unicos.add(e.numeroNFE);
    }
  });

  return Array.from(unicos).map((item, index) => ({
    id: index + 1,
    cNome: item
  }));
});
const infosTableEntradasSLASlice = computed(() => {
  return mostrarTodos.value
    ? infosTableEntradasSLA.value
    : infosTableEntradasSLA.value.slice(0, 50)
});
const tramitesEscolhaFiltro = computed(() => {
  const unicos = new Set();

  infosTableEntradasSLA.value.forEach(e => {
    if (e.idTramite) {
      unicos.add(e.idTramite);
    }
  });

  return Array.from(unicos).map((item, index) => ({
    id: index + 1,
    cNome: item
  }));
});
const produtoEscolhaFiltro = computed(() => {
  const unicos = new Set();

  infosTableEntradasSLA.value.forEach(e => {
    if (e.codigoComponente) {
      unicos.add(e.codigoComponente);
    }
  });

  return Array.from(unicos).map((item, index) => ({
    id: index + 1,
    cNome: item
  }));
});
const descProdutoEscolhaFiltro = computed(() => {
  const unicos = new Set();

  infosTableEntradasSLA.value.forEach(e => {
    if (e.descricaoComponente) {
      unicos.add(e.descricaoComponente);
    }
  });

  return Array.from(unicos).map((item, index) => ({
    id: index + 1,
    cNome: item
  }));
});
const remetentesUnicos = computed(() => {
  const mapa = new Map(); // chave = iD_Carteira, valor = objeto remetente
  (infosTableEntradasSLA.value || []).forEach(item => {
    const r = item?.remetente;
    if (r && r.iD_Carteira != null && !mapa.has(r.iD_Carteira)) {
      mapa.set(r.iD_Carteira, r);
    }
  });
  // opcional: ordenar por nome fantasia
  return Array.from(mapa.values()).sort((a, b) =>
    (a.cNmFantasia || "").localeCompare(b.cNmFantasia || "")
  );
});
const transportadorasUnicas = computed(() => {
  const mapa = new Map(); // chave = iD_Carteira, valor = objeto remetente
  (infosTableEntradasSLA.value || []).forEach(item => {
    const r = item?.transportadora;
    if (r && r.iD_Carteira != null && !mapa.has(r.iD_Carteira)) {
      mapa.set(r.iD_Carteira, r);
    }
  });
  // opcional: ordenar por nome fantasia
  return Array.from(mapa.values()).sort((a, b) =>
    (a.cNmFantasia || "").localeCompare(b.cNmFantasia || "")
  );
});
const totalQuantidadeVolumesSaidas = computed(() => {
  const remetente      = selectedRemetente.value?.cNmFantasia?.toLowerCase() || "";
  const transportadora = selectedTransportadora.value?.cNmFantasia?.toLowerCase() || "";
  const notaFiscal     = selectedNotaFiscal.value?.cNome.toLowerCase() || "";
  const tramite        = selectedTramite.value?.cNome.toLowerCase() || "";
  const codProduto     = selectedCodProduto.value?.cNome.toLowerCase() || "";
  const descProduto    = selectedDescProduto.value?.cNome.toLowerCase() || "";

  const query = queryInfAdc.value?.trim().toLowerCase();

  return staticInfosTableEntradasSLA.value
    .filter(comp => {
      // -----------------------------
      //   INTERVALO DE DATAS (mantido igual)
      // -----------------------------
      let dentroIntervalo = true;

      // -----------------------------
      //   FILTROS DOS SELECTS
      // -----------------------------
      const filtroSelects =
        (remetente      ? comp.remetente?.cNmFantasia?.toLowerCase().includes(remetente) : true) &&
        (transportadora ? comp.transportadora?.cNmFantasia?.toLowerCase().includes(transportadora) : true) &&
        (notaFiscal     ? comp.numeroNFE?.toLowerCase().includes(notaFiscal) : true) &&
        (tramite        ? String(comp.idTramite || comp.IDTramite || "")
                            .toLowerCase()
                            .includes(tramite) : true) &&
        (codProduto     ? comp.codigoComponente?.toLowerCase().includes(codProduto) : true) &&
        (descProduto    ? comp.descricaoComponente?.toLowerCase().includes(descProduto) : true);

      // -----------------------------
      //   FILTRO DO INPUT GERAL
      // -----------------------------
      const filtroQuery = query
        ? (
            (comp.idTramite           || "").toString().toLowerCase().includes(query) ||
            (comp.protocoloProduto    || "").toLowerCase().includes(query) ||
            (comp.numeroNFE           || "").toLowerCase().includes(query) ||
            (comp.codigoComponente    || "").toLowerCase().includes(query) ||
            (comp.descricaoComponente || "").toLowerCase().includes(query) ||
            (comp.familia             || "").toLowerCase().includes(query) ||
            (comp.adicionaisProduto   || "").toLowerCase().includes(query)
          )
        : true;

      return filtroSelects && filtroQuery && dentroIntervalo;
    })
    .reduce(
      (acc, e) => acc + (Number(e.quantidadeComponente) || 0),
      0
    );
});

// --------------------------/

// FUNÇÕES DO FILTRO
// const aplicarFiltrosSelect = () => {
//   const remetente      = selectedRemetente.value?.cNmFantasia?.toLowerCase() || "";
//   const transportadora = selectedTransportadora.value?.cNmFantasia?.toLowerCase() || "";
//   const notaFiscal     = selectedNotaFiscal.value?.toLowerCase() || "";
//   const tramite        = selectedTramite.value ? String(selectedTramite.value).toLowerCase() : "";
//   const codProduto     = selectedCodProduto.value?.toLowerCase() || "";
//   const descProduto    = selectedDescProduto.value?.toLowerCase() || "";

//   infosTableEntradasSLA.value = staticInfosTableEntradasSLA.value.filter(comp => {
//     // Validação de datas (comp.dataTramite vem como dd/MM/yyyy)
//     let dentroIntervalo = true;
//     if (comp.dataTramite && dataInicial.value && dataFinal.value) {
//       const [dia, mes, ano] = comp.dataTramite.split("/");
//       const dataItem = new Date(`${ano}-${mes}-${dia}`); // normaliza para yyyy-MM-dd
//       const inicio = new Date(dataInicial.value);
//       const fim    = new Date(dataFinal.value);

//       dentroIntervalo = dataItem >= inicio && dataItem <= fim;
//     }

//     return (
//       (remetente      ? comp.remetente?.cNmFantasia?.toLowerCase().includes(remetente) : true) &&
//       (transportadora ? comp.transportadora?.cNmFantasia?.toLowerCase().includes(transportadora) : true) &&
//       (notaFiscal     ? comp.numeroNFE?.toLowerCase().includes(notaFiscal) : true) &&
//       (tramite        ? String(comp.idTramite || comp.IDTramite || "")
//                           .toLowerCase()
//                           .includes(tramite) : true) &&
//       (codProduto     ? comp.codigoComponente?.toLowerCase().includes(codProduto) : true) &&
//       (descProduto    ? comp.descricaoComponente?.toLowerCase().includes(descProduto) : true) &&
//       dentroIntervalo
//     );
//   });
// };
// const aplicarFiltrosInput = () => {
//   const query = queryInfAdc.value.trim().toLowerCase();

//   infosTableEntradasSLA.value = staticInfosTableEntradasSLA.value.filter(comp => {
//     return (
//       (query ? (comp.idTramite           || "").toLowerCase().includes(query) : true) || 
//       (query ? (comp.protocoloProduto    || "").toLowerCase().includes(query) : true) || 
//       (query ? (comp.numeroNFE           || "").toLowerCase().includes(query) : true) ||
//       (query ? (comp.codigoComponente    || "").toLowerCase().includes(query) : true) ||
//       (query ? (comp.descricaoComponente || "").toLowerCase().includes(query) : true) ||
//       (query ? (comp.familia             || "").toLowerCase().includes(query) : true) ||
//       (query ? (comp.adicionaisProduto   || "").toLowerCase().includes(query) : true)
//     );
//   });
// };

// const aplicarFiltrosSelect = async () => {
//   const remetente      = selectedRemetente.value?.cNmFantasia?.toLowerCase() || "";
//   const transportadora = selectedTransportadora.value?.cNmFantasia?.toLowerCase() || "";
//   const notaFiscal     = selectedNotaFiscal.value?.cNome.toLowerCase() || "";
//   const tramite        = selectedTramite.value?.cNome.toLowerCase() || "";
//   const codProduto     = selectedCodProduto.value?.cNome.toLowerCase() || "";
//   const descProduto    = selectedDescProduto.value?.cNome.toLowerCase() || "";

//   const query = queryInfAdc.value?.trim().toLowerCase();

//   infosTableEntradasSLA.value = staticInfosTableEntradasSLA.value.filter(comp => {
//     // -----------------------------
//     //   VALIDAÇÃO DE INTERVALO DE DATAS
//     // -----------------------------
//     let dentroIntervalo = true;
//     // if (comp.dataTramite && dataInicial.value && dataFinal.value) {
//     //   const [dia, mes, ano] = comp.dataTramite.split("/");
//     //   const dataItem = new Date(`${ano}-${mes}-${dia}`);
//     //   const inicio   = new Date(dataInicial.value);
//     //   const fim      = new Date(dataFinal.value);

//     //   dentroIntervalo = dataItem >= inicio && dataItem <= fim;
//     // }

//     // -----------------------------
//     //   FILTRO DOS SELECTS
//     // -----------------------------
//     const filtroSelects =
//       (remetente      ? comp.remetente?.cNmFantasia?.toLowerCase().includes(remetente) : true) &&
//       (transportadora ? comp.transportadora?.cNmFantasia?.toLowerCase().includes(transportadora) : true) &&
//       (notaFiscal     ? comp.numeroNFE?.toLowerCase().includes(notaFiscal) : true) &&
//       (tramite        ? String(comp.idTramite || comp.IDTramite || "")
//                           .toLowerCase()
//                           .includes(tramite) : true) &&
//       (codProduto     ? comp.codigoComponente?.toLowerCase().includes(codProduto) : true) &&
//       (descProduto    ? comp.descricaoComponente?.toLowerCase().includes(descProduto) : true);

//     // -----------------------------
//     //   FILTRO DO INPUT GERAL (query)
//     // -----------------------------
//     const filtroQuery = query
//       ? (
//           (comp.idTramite           || "").toString().toLowerCase().includes(query) ||
//           (comp.protocoloProduto    || "").toLowerCase().includes(query) ||
//           (comp.numeroNFE           || "").toLowerCase().includes(query) ||
//           (comp.codigoComponente    || "").toLowerCase().includes(query) ||
//           (comp.descricaoComponente || "").toLowerCase().includes(query) ||
//           (comp.familia             || "").toLowerCase().includes(query) ||
//           (comp.adicionaisProduto   || "").toLowerCase().includes(query)
//         )
//       : true;

//     // -----------------------------
//     //   RETORNO FINAL
//     // -----------------------------
//     return filtroSelects && filtroQuery && dentroIntervalo;
//   });
  
//   await nextTick();

//   ajustarCompensacaoScrollEntradas();

// };

const aplicarFiltrosSelect = async () => {
  const remetente      = selectedRemetente.value?.cNmFantasia?.toLowerCase() || "";
  const transportadora = selectedTransportadora.value?.cNmFantasia?.toLowerCase() || "";
  const notaFiscal     = selectedNotaFiscal.value?.cNome.toLowerCase() || "";
  const tramite        = selectedTramite.value?.cNome.toLowerCase() || "";
  const codProduto     = selectedCodProduto.value?.cNome.toLowerCase() || "";
  const descProduto    = selectedDescProduto.value?.cNome.toLowerCase() || "";
  const filtrarLR      = isButtonLRSelecionado.value;

  const query = queryInfAdc.value?.trim().toLowerCase();

  infosTableEntradasSLA.value = staticInfosTableEntradasSLA.value.filter(comp => {

    // -----------------------------
    //   VALIDAÇÃO DE INTERVALO DE DATAS
    // -----------------------------
    let dentroIntervalo = true;

    // -----------------------------
    //   FILTRO DOS SELECTS
    // -----------------------------
    const filtroSelects =
      (remetente
        ? comp.remetente?.cNmFantasia?.toLowerCase().includes(remetente)
        : true) &&
      (transportadora
        ? comp.transportadora?.cNmFantasia?.toLowerCase().includes(transportadora)
        : true) &&
      (notaFiscal
        ? comp.numeroNFE?.toLowerCase().includes(notaFiscal)
        : true) &&
      (tramite
        ? String(comp.idTramite || comp.IDTramite || "")
            .toLowerCase()
            .includes(tramite)
        : true) &&
      (codProduto
        ? comp.codigoComponente?.toLowerCase().includes(codProduto)
        : true) &&
      (descProduto
        ? comp.descricaoComponente?.toLowerCase().includes(descProduto)
        : true);

    // -----------------------------
    //   FILTRO DO INPUT GERAL (query)
    // -----------------------------
    const filtroQuery = query
      ? (
          (comp.idTramite           || "").toString().toLowerCase().includes(query) ||
          (comp.protocoloProduto    || "").toLowerCase().includes(query) ||
          (comp.numeroNFE           || "").toLowerCase().includes(query) ||
          (comp.codigoComponente    || "").toLowerCase().includes(query) ||
          (comp.descricaoComponente || "").toLowerCase().includes(query) ||
          (comp.familia             || "").toLowerCase().includes(query) ||
          (comp.adicionaisProduto   || "").toLowerCase().includes(query)
        )
      : true;

    // -----------------------------
    //   FILTRO DO BOTÃO LR
    // -----------------------------
    const codigo = comp.codigoComponente || "";

    const filtroLR = filtrarLR
      ? true // Se botão LR estiver ativo → deixa passar tudo
      : codigo !== "TE00000000000"; // Se não estiver ativo → remove TE00000000000

    // -----------------------------
    //   RETORNO FINAL
    // -----------------------------
    return filtroSelects && filtroQuery && dentroIntervalo && filtroLR;
  });

  await nextTick();

  ajustarCompensacaoScrollEntradas();
};

  const isButtonLRSelecionado = ref(false);

  const OnClicKLRButton = () => {
    isButtonLRSelecionado.value = !isButtonLRSelecionado.value;

    atualizarEstilosBotoes();
    aplicarFiltrosSelect();
  };

  const atualizarEstilosBotoes = ()  => {
    isButtonLRSelecionado.value
      ? aplicaEstiloSelecionado('lr-button') 
      : removeEstiloSelecionado('lr-button');
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

const toggleVerMais = () => {
  mostrarTodos.value = !mostrarTodos.value;
}

const OnKeyUpInfAdicionais = () => {
  aplicarFiltrosSelect();
}

// REQUISIÇÕES
async function getTransportadorasApenasSLA() {
  const authStore = useAuthStore();

  try {
    const response = await axios.get(
      `${urlSistema.value}/carteira/com-join/${ID_Carteira.value}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`
        }
      }
    );

    cliente.value = response.data;

  } catch (error) {

    // ✅ Unauthorized → volta pra página base
    if (error.response?.status === 401) {
      authStore.logout();
      LimpaLocalStor();
      return navigateTo('/');
    }

    console.error(error);
  }
}

async function getInfosEntradasSLA() {
  const authStore = useAuthStore();

  try {
    tabelaENTRADASCarregada.value = false;

    const response = await axios.get(
      `${urlProd}/consultas-sla/sla-entradas/${ID_Carteira.value}/${dataInicial.value}/${dataFinal.value}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`
        }
      }
    );

    infosTableEntradasSLA.value = response.data;
    staticInfosTableEntradasSLA.value = response.data;

    aplicarFiltrosSelect();

  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  } finally {
    tabelaENTRADASCarregada.value = true;
  }
}

async function getImagemTramiteAssinatura(tramiteId) {
  const authStore = useAuthStore();

  try {
    const response = await axios.get(
      `${urlProd}/estoque/foto-componente/get-foto-assinatura-tramite/${tramiteId}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`
        }
      }
    );

    if (Array.isArray(response.data)) {
      imagensAssinatura = response.data.map(
        base64 => `data:image/jpeg;base64,${base64}`
      );
      imagensTramite = [...imagensAssinatura];
    }
  } catch (error) {}
}
async function getImagemTramite(tramiteId) {
  const authStore = useAuthStore();

  try {
    const response = await axios.get(
      `${urlProd}/estoque/foto-componente/get-foto-carga-tramite/${tramiteId}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`
        }
      }
    );

    if (Array.isArray(response.data)) {
      imagensCarga = response.data.map(
        base64 => `data:image/jpeg;base64,${base64}`
      );

      imagensTramite.push(
        ...response.data.map(base64 => `data:image/jpeg;base64,${base64}`)
      );
    }
  } catch (error) {}
}

async function getItensTramite(idTramite) {
  const authStore = useAuthStore();

  tabelaTRAMITEsCarregada.value = false;

  try {
    const result = await axios.get(
      `${urlProd}/estoque/tramite-item/de-um-pai-com-join/${idTramite}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`
        }
      }
    );

    itensTramiteStatic.value = Array.isArray(result.data)
      ? result.data
      : [];

    itensTramiteStatic.value.sort(
      (a, b) => a.iD_Tramite_FILHO - b.iD_Tramite_FILHO
    );

    itensTramite.value = [...itensTramiteStatic.value];

  } catch (error) {
    ToastError("Falha ao carregar os itens do trâmite.");
  } finally {
    tabelaTRAMITEsCarregada.value = true;
  }
}

async function fetchPDFPreVisualizar() {
  const authStore = useAuthStore();

  isLoadingPDF.value = true;

  try {
    const res = await axios.get(
      `${urlProd}/estoque/tramite/PDF-recebimento/${tramiteModal.iD_Tramite}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`
        },
        responseType: "blob"
      }
    );

    return res.data;

  } catch (error) {
    console.error(error);
  } finally {
    isLoadingPDF.value = false;
  }
}

async function fetchEXCELEntradasSLA() {
  const authStore = useAuthStore();

  if(infosTableEntradasSLA.value.length == 0) {
    ToastWarning('Não há dados para exportar!');
    return;
  }

  ToastWarning('Aguarde enquanto o documento é gerado...');

  isLoadingEXCELRelatorio.value = true;
  try {
    // Garante array puro
    const payload = Array.isArray(infosTableEntradasSLA.value)
      ? toRaw(infosTableEntradasSLA.value)
      : [toRaw(infosTableEntradasSLA.value)];

    const url = `${urlProd}/consultas-sla/sla-entradas-excel`; // <-- .value aqui!

    const response = await axios.post(
      url,
      payload,
      {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`,
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
    let fileName = `SLA_ENTRADAS_${cliente.value.cNmFantasia}.xlsx`;
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
    ToastSuccess('Documento baixado com sucesso!');

  } catch (error) {
    console.error('Erro ao gerar Excel:', error);
    ToastError('Erro ao gerar o documento');
  }
  isLoadingEXCELRelatorio.value = false;
}
async function fetchPDFEntradasSLA() {
  const authStore = useAuthStore();

  if(infosTableEntradasSLA.value.length == 0) {
    ToastWarning('Não há dados para exportar!');
    return;
  }

  ToastWarning('Aguarde enquanto o documento é gerado...');

  isLoadingPDFRelatorio.value = true;
  try {
    // Garante array puro
    const payload = Array.isArray(infosTableEntradasSLA.value)
      ? toRaw(infosTableEntradasSLA.value)
      : [toRaw(infosTableEntradasSLA.value)];

    const url = `${urlProd}/consultas-sla/sla-entradas-pdf`; // <-- endpoint do PDF

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${authStore.token ?? ''}`,
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
    let fileName = `SLA_ENTRADAS_${cliente.value.cNmFantasia}.pdf`;
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
    ToastSuccess('Documento baixado com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    ToastError('Erro ao gerar o documento');
  }
  isLoadingPDFRelatorio.value = false;
}



// FUNÇÕES DO MODAL
async function AbrirModalDetalhesTramite(idTramite) {
  const authStore = useAuthStore();

  const response = await axios.get(
      `${urlProd}/estoque/tramite/com-join/${idTramite}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`
        }
      }
    );

  tramiteModal = response.data;

  if (tramiteModal?.iD_Usuario_AnuladoPor) {
    ToastWarning('Este trâmite já foi anulado e não pode mais ser aberto.');
    return;
  }

  const modalEl = document.getElementById('TramitePaiModal')

  if (!modalEl) {
    console.error("Elemento do modal não encontrado")
    return
  }

  // se ainda não tiver instância, cria
  if (!modalInstance) {
    modalInstance = new bootstrap.Modal(modalEl)
  }

  modalInstance.show()

  // A PARTIR DAQUI O MODAL JÁ ESTÁ ABERTO

  // Trecho necessário para o Swiper funcionar corretamente ---\
  if (!listenerAdicionado) {
    modalEl.addEventListener('shown.bs.modal', () => {
      definirAlturaSwiper();
    });
    listenerAdicionado = true;
  }
  await definirAlturaSwiper();
  // ----------------------------------------------------------/

  await getImagemTramiteAssinatura(tramiteModal.iD_Tramite);
  await getImagemTramite(tramiteModal.iD_Tramite);
  await getItensTramite(tramiteModal.iD_Tramite);
  
  // Ajusta a altura da tabela após o modal ser aberto -------\
  await nextTick(); // Aguarda Vue atualizar o DOM

  setTimeout(() => {
    adjustTableHeight();
  }, 100); // Aguarda um curto período antes de calcular

  window.addEventListener('resize', adjustTableHeight);
  // --------------------------------------------------------/


};
async function clickCloseModal() {

  if(modoExibicaoImagem) {
    modoExibicaoImagem = false;
    return;
  }

  if(isVisualizarPDF.value) {
    isVisualizarPDF.value = false;
    isLoadingPDF.value = false;
    return;
  }

  if (modalInstance) {
    tramiteModal = {};
    itensTramite.value = [];
    itensTramiteStatic.value = [];
    modalInstance.hide();
  }

};
async function OnClickVisualizarPDFVisualizarModal() {
  isVisualizarPDF.value = true;

  // Busca o PDF e ja lida com o carregamento:
  const PDF = await fetchPDFPreVisualizar();
  exibirPDF('update-modal-iframe', PDF);
};

// FUNÇÕES AUXILIARES
const OnChangeDataInicio = async () => {
  if (
    dataInicial.value &&
    dataFinal.value &&
    new Date(dataInicial.value) > new Date(dataFinal.value)
  ) {
    ToastWarning("A data inicial não pode ser maior que a final!");
    dataInicial.value = dataFinal.value;
  }

  await getInfosEntradasSLA();
};

const OnChangeDataFinal = async () => {
  if (
    dataInicial.value &&
    dataFinal.value &&
    new Date(dataFinal.value) < new Date(dataInicial.value)
  ) {
    ToastWarning("A data final não pode ser menor que a inicial!");
    dataFinal.value = dataInicial.value;
  }

  await getInfosEntradasSLA();
};

async function onClickLimparFiltros() {
  dataInicial.value = new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0];
  dataFinal.value = new Date().toISOString().split('T')[0];
  selectedRemetente.value = null;
  selectedTransportadora.value = null;
  selectedNotaFiscal.value = null;
  selectedTramite.value = null;
  selectedCodProduto.value = null;
  selectedDescProduto.value = null;
  selectedFamilia.value = null;
  queryInfAdc.value = null;

    // Resetar botões de filtro
  isButtonLRSelecionado.value = false;
  atualizarEstilosBotoes();

  infosTableEntradasSLA.value = staticInfosTableEntradasSLA.value;
  aplicarFiltrosSelect();
  await getInfosEntradasSLA();
};
async function definirAlturaSwiper() {
  await nextTick() // espera a atualização do DOM

  const infosDiv = document.getElementById('infosTramitePai')
  if (infosDiv) {
    alturaInfosPx.value = infosDiv.offsetHeight
  }
}
async function adjustTableHeight() {
  await nextTick() // aguarda atualização do DOM

  const modalHeight = window.innerHeight * 0.91

  const headerHeight = document.getElementById('modal-header')?.offsetHeight || 0
  const formHeight = document.getElementById('infosTramitePai')?.offsetHeight || 0
  const novaMovHeight = document.getElementById('btnNovoItemTramite')?.offsetHeight || 0
  const rodapeHeight = document.getElementById('modal-footer')?.offsetHeight || 0

  const bodyHeight = modalHeight - headerHeight - formHeight - novaMovHeight - rodapeHeight - 30

  tableContainerItemTramiteStyle.value = {
    width: '99%',
    maxHeight: `${bodyHeight}px`,
    overflowY: 'auto'
  }
}
const exibirPDF = (iframeID, pdfBytes) => {
  // Cria um Blob a partir dos bytes do PDF:
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  // Cria uma URL temporária para o Blob:
  const url = URL.createObjectURL(blob);

  // Recupera o iframe:
  const iframe = document.getElementById(iframeID);

  // Defina a fonte do iframe como a URL temporária do Blob:
  iframe.src = url;
};

// MOUNTED DA PÁGINA
onMounted(async () => {
  await getTransportadorasApenasSLA();
  await getInfosEntradasSLA();
  const tamanhoInicialEntradas = infosTableEntradasSLA.value.length;
  // aplicarFiltrosSelect();
  const tamanhoEntradasPosFiltro = infosTableEntradasSLA.value.length;
  if(tamanhoInicialEntradas > 0 && tamanhoEntradasPosFiltro == 0) {
    ToastWarning('Nenhum trâmite criado dentro do período de 2 mêses, altere o filtro de data.');
  }

  nextTick(() => {
    ajustarCompensacaoScrollEntradas();

    let td = tabelaWrapperEntradas.value?.querySelector('tbody td');

    if (td) {
      const style = getComputedStyle(td);
      paddingTabela.value = style.paddingLeft;
    }
  });

});

</script>


<template>
  <main class="D-flex">

    <!-- Todo o Conteúdo da página -->
    <div class="D-flex FD-column WIDTH-100 HEIGHT-100vh OFLOW-auto">

      <!-- Menu Superior -->
      <SetorProducaoSLAMenuSuperior 
        funcionalidadeProp="ENTRADAS"
        :destinoVoltarProp="`/sla`"
        :srcFoto="logoPath"
      />
      
      <!-- ESPAÇO CORPO -->
      <div class="D-flex FD-column HEIGHT-88vh WIDTH-100 JC-center ALITEM-center BGC-cinza-9 BOR-branca">
        <div class="D-flex FD-column ALITEM-center JC-center HEIGHT-95 WIDTH-98 BORRAD-5 BGC-branco PADDING-T5-B10">

            <!-- Filtros -->
            <div class="D-flex JC-space-between HEIGHT-30 WIDTH-98 mb-1">

              <div class="D-flex WIDTH-100 JC-space-between">
                
                <!-- Decoração FILTROS -->
                <div class="WIDTH-6 BGC-azul-esverdeado COLOR-white ALITEM-center BORRAD-5 FWEIGHT-bold D-flex FD-column JC-space-between">
                  <p>Filtros</p>
                  <button type="button" class="btn btn-dark WIDTH-75 FSIZE-12px mb-1" @click="onClickLimparFiltros">Limpar</button>
                </div>

                <div class="D-flex WIDTH-25 FD-column JC-space-between PADDING-T2-R5-B5-L10 HEIGHT-100">
                  
                  <!-- Filtro de DATAS -->
                  <div class="WIDTH-98-5 D-flex JC-space-between ALITEM-center HEIGHT-15">
              
                    <div class="WIDTH-35 HEIGHT-100 D-flex JC-center ALITEM-center">
                      <label
                        id="data-inicio-aguardando-label"
                        for="data-inicio-aguardando-input"
                        class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold"
                      ></label>
                      <input
                        autocomplete="off"
                        id="data-inicio-aguardando-input"
                        type="date"
                        onkeydown="return false"
                        @change="OnChangeDataInicio"
                        v-model="dataInicial"
                        class="form-control WIDTH-100 BORRAD-5 BOR-grey FSIZE-12px BGC-branco PADDING-2">
                    </div>
                    
                    <div
                      class="form-label WIDTH-10 BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold TEXTALI-center "
                      style="margin-top: 1.5%;"
                    >A</div>

                    <div class="WIDTH-35 D-flex JC-center ALITEM-center MARGIN-R2">
                      <label
                        id="data-inicio-aguardando-label"
                        for="data-inicio-aguardando-input"
                        class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold"
                      ></label>
                      <input
                        autocomplete="off"
                        id="data-inicio-aguardando-input"
                        type="date"
                        onkeydown="return false"
                        @change="OnChangeDataFinal"
                        v-model="dataFinal"
                        class="form-control BORRAD-5 BOR-grey  FSIZE-12px BGC-branco PADDING-2">
                    </div>

                  </div>

                  <!-- REMETENTE -->
                  <BasicElementVue3SelectPequeno
                    :options="remetentesUnicos"
                    optionLabel="idCarteira_cNmFantasia_CPFCNPJ"
                    v-model="selectedRemetente"

                    label="REMETENTE:"
                    :titulo="selectedTransportadora?.idCarteira_cNmFantasia_CPFCNPJ"

                    @update:modelValue="aplicarFiltrosSelect"

                    :divClass="'MARGIN-T12 WIDTH-100 HEIGHT-20'"
                    :selectClass="'FSIZE-12px'"
                    :labelClass="'FSIZE-12px MARGIN-T-15'"
                    :widthLista="'500px'"
                  />

                  <!-- TRANSPORTADORAS -->
                  <BasicElementVue3SelectPequeno
                    :options="transportadorasUnicas"
                    optionLabel="idCarteira_cNmFantasia_CPFCNPJ"
                    v-model="selectedTransportadora"

                    @update:modelValue="aplicarFiltrosSelect"
                    
                    label="TRANSPORTADORA:"
                    :titulo="selectedTransportadora?.idCarteira_cNmFantasia_CPFCNPJ"

                    :divClass="'MARGIN-T10 WIDTH-100 HEIGHT-20'"
                    :selectClass="'FSIZE-12px'"
                    :labelClass="'FSIZE-12px MARGIN-T-15'"
                    :widthLista="'500px'"
                  />

                  <div class="WIDTH-100 D-flex JC-space-between ALITEM-center HEIGHT-20">
                    <!-- NOTA FISCAL -->
                    <BasicElementVue3SelectPequeno
                      :options="notasFiscaisEscolhaFiltro"
                      optionLabel="cNome"
                      v-model="selectedNotaFiscal"
                      
                      @update:modelValue="aplicarFiltrosSelect"

                      label="NOTA FISCAL:"
                      :titulo="selectedNotaFiscal?.cNome"

                      :divClass="'MARGIN-T21 WIDTH-50'"
                      :selectClass="'FSIZE-12px'"
                      :labelClass="'FSIZE-12px MARGIN-T-15'"
                      :widthLista="'75px'"
                    />

                    <!-- TRAMITE -->
                    <BasicElementVue3SelectPequeno
                      :options="tramitesEscolhaFiltro"
                      optionLabel="cNome"
                      v-model="selectedTramite"

                      @update:modelValue="aplicarFiltrosSelect"
                      
                      label="TRÂMITE:"
                      :titulo="selectedTramite?.cNome"

                      :divClass="'MARGIN-T21 WIDTH-50'"
                      :selectClass="''"
                      :labelClass="'FSIZE-12px MARGIN-T-15'"
                      :widthLista="'75px'"
                    />
                  </div>

                </div>

                <div class="D-flex WIDTH-25 FD-column PADDING-T2-R5-B5-L10 BOR-L-solidgrey-1 JC-flex-start">
                  <!-- CÓDIGO PRODUTO -->
                  <BasicElementVue3SelectPequeno
                    :options="produtoEscolhaFiltro"
                    option-label="cNome"
                    v-model="selectedCodProduto"

                    @update:modelValue="aplicarFiltrosSelect"
                    
                    label="COD. PRODUTO:"
                    :titulo="selectedCodProduto?.cNome"

                    :divClass="'MARGIN-T10 WIDTH-100 HEIGHT-20'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px MARGIN-T-15'"
                    :widthLista="''"
                    
                  />
                  
                  <!-- DESCRIÇÃO PRODUTO -->
                  <BasicElementVue3SelectPequeno
                    :options="descProdutoEscolhaFiltro"
                    option-label="cNome"
                    v-model="selectedDescProduto"

                    @update:modelValue="aplicarFiltrosSelect"
                    
                    label="DESCRIÇÃO DO PRODUTO:"
                    :titulo="selectedDescProduto?.cNome"

                    :divClass="'MARGIN-T16 WIDTH-100 HEIGHT-20'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px MARGIN-T-15'"
                    :widthLista="''"
                  /> 

                  <!-- INF. ADICIONAIS -->
                  <div class="WIDTH-98">
                    <label
                      id="infAdc-label"
                      for="infAdc-input"
                      class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-enabled"
                    >INFORMAÇÃO ADICIONAL</label>
                    <input
                      autocomplete="off"
                      @keyup="OnKeyUpInfAdicionais()"
                      id="infAdc-input"
                      v-model="queryInfAdc"
                      type="text"
                      class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE BORRAD-3"
                      :title="queryInfAdc">
                  </div>

                  <div class="HEIGHT-20 D-flex ALITEM-center JC-center">
                  <button id="lr-button" class="BOR-grey BORRAD-5 WIDTH-40 BGC-branco"
                    @click="OnClicKLRButton()"
                  >L.R.</button>
                  </div>
                </div>

                <!-- Botões -->
                 <div class="WIDTH-44 HEIGHT-100 D-flex JC-flex-end ALITEM-flex-end BOR-L-solidgrey-1">
                  <div style="margin-right: 10px; cursor: pointer;" @click="getInfosEntradasSLA()" title="Atualizar informações">
                    <IconsRefresh
                      corProp="rgb(24, 134, 84)"
                      alturaProp="1.6"
                      larguraProp="1.6"
                    />
                  </div>

                  <!-- Botões de EXPORTAR -->
                  <div>
                    <button id="exportar-EXCEL-button" type="button" class="btn btn-success MARGIN-R5 FSIZE-12px" @click="fetchEXCELEntradasSLA()" :disabled="isLoadingEXCELRelatorio || isLoadingPDFRelatorio">
                      <IconsExcel corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                      Exportar EXCEL</button>
                      
                      <button id="exportar-PDF-button" type="button" class="btn btn-warning FSIZE-12px" @click="fetchPDFEntradasSLA()" :disabled="isLoadingPDFRelatorio || isLoadingEXCELRelatorio">
                        <IconsPDF corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                        Exportar PDF
                      </button>
                  </div>

                </div>

              </div>
              
            </div>

            <!-- Tabela -->
            <div class="BOR-SensacaoAfundado OFLOW-auto WIDTH-99 HEIGHT-70 BORRAD-5">

              <div class="HEIGHT-93 OFLOW-auto WIDTH-100" ref="tabelaWrapperEntradas">
              
                <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5 table-fixed FSIZE-PADRAO-TABLE">
                  <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                    <tr>
                      <th class="WIDTH-2 TEXTALI-center" scope="col"></th>
                      <th class="WIDTH-9 TEXTALI-center" scope="col">Data</th>
                      <th class="WIDTH-5 TEXTALI-center" scope="col">Tramite</th>
                      <th class="WIDTH-8 TEXTALI-center" scope="col">NF</th>
                      <th class="WIDTH-11 TEXTALI-center" scope="col">Adicionais</th>
                      <th class="WIDTH-10 TEXTALI-center" scope="col">Código</th>
                      <th class="WIDTH-30 TEXTALI-center" scope="col">Descrição do Produto</th>
                      <th class="WIDTH-10 TEXTALI-center" scope="col">Família</th>
                      <th class="WIDTH-6 TEXTALI-center" scope="col">Quant.</th>
                      <th class="WIDTH-9 TEXTALI-center" scope="col">Protocolo</th>
                    </tr>
                  </thead>
                  <LayoutTabelaCarregarEsqueleto v-if="!tabelaENTRADASCarregada"
                  :Linhas="infosTableEntradasSLASlice.length === 0 ? 15 : infosTableEntradasSLASlice.length" :Colunas="10" />
                  
                    <tbody v-if="tabelaENTRADASCarregada" class="BORRAD-5">
                    <tr
                      v-for="(entrada, i) in infosTableEntradasSLASlice" :key="i"
                      class="BGC-H-cinza-8 HEIGHT-5px CURSOR-pointer"
                      :class="applyTableStipedRows(i)"
                      >
                        <td class="HEIGHT-5px no-wrap-text WIDTH-2 TEXTALI-center" scope="row" :title="entrada.dataTramite" >
                          <button type="button" class="in-table-button" title="Visualizar detalhes do Trâmite" @click="AbrirModalDetalhesTramite(entrada.idTramite)">
                            <IconsLupa corProp="currentColor" alturaProp="1" larguraProp="1"/>  
                          </button>
                        </td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-9 TEXTALI-center" scope="row" :title="entrada.dataTramite" >{{ entrada.dataTramite }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-5 TEXTALI-center" :title="entrada.idTramite" >{{ entrada.idTramite }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-8 TEXTALI-center" :title="entrada.numeroNFE" >{{ entrada.numeroNFE }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-11 TEXTALI-left ellipsisTable" :title="entrada.adicionaisProduto" >{{ entrada.adicionaisProduto }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-10 TEXTALI-center" :title="entrada.codigoComponente" >{{ entrada.codigoComponente }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-30 TEXTALI-left ellipsisTable" :title="entrada.descricaoComponente" >{{ entrada.descricaoComponente }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-10 TEXTALI-left" :title="entrada.familia" >{{ entrada.familia }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-6 TEXTALI-center">{{ entrada.quantidadeComponente }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-9 TEXTALI-left" :title="entrada.protocoloProduto" >{{ entrada.protocoloProduto }}</td>
                    </tr>
                  </tbody>
                </table>

              </div>

              <div class="HEIGHT-7 WIDTH-100 D-flex ALITEM-center BOR-B-R-RAD-5 totais-barra"
              :style="{
                  background: hexToRgba('#9E9E9E', 0.6),
                  paddingRight: compensacaoScroll + 'px'
                }"
              >
              
                <div class="WIDTH-40 FWEIGHT-bold FSIZE-14px PADDING-1">
                  TOTAL:
                </div>

                <div class="WIDTH-20 D-flex JC-center">
                  <button @click="mostrarTodos = !mostrarTodos" 
                  class="btn btn-soft btn-compact WIDTH-100 FSIZE-11px">
                    {{ mostrarTodos ? `Ver menos...` : `Ver mais... (${infosTableEntradasSLA.length})` }}
                  </button>
                </div>

                <div class="WIDTH-25"></div>

                <div class="WIDTH-6 FWEIGHT-bold FSIZE-14px"
                  :style="{
                    paddingLeft: paddingTabela,
                    paddingRight: paddingTabela,
                    textAlign: 'center'
                  }"
                >
                  <span v-if="!tabelaENTRADASCarregada" class="loading-dots"></span>
                  <span v-else>{{ totalQuantidadeVolumesSaidas }}</span>
                </div>

                <div class="WIDTH-9"></div>


              </div>

            </div>

        </div>
      </div>
      
      <Rodape />

   </div>
  </main>

  <!-- Modal de Detalhes do Trâmite Pai -->
   <div class="modal fade" id="TramitePaiModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="TramitePaiModalLabel">
    <div class="modal-dialog modal-xl MIN-WIDTH-97">
      <div class="modal-content" id="modalTableClick">

        <!-- Cabeçalho MODAL -->
        <div>
          
          <div class="d-flex justify-content-between align-items-center border-bottom p-2 HEIGHT-6vh">
          
            <!-- Logo -->
            <img 
              src="assets/images/Logo-E-azul-enhanced.png" 
              alt="Logo Grupo Embalarte" 
              class="WIDTH-2 HEIGHT-auto" 
              title="Grupo Embalarte">

            <!-- Título -->
            <h1 v-if="!tramiteModal.cStatusLR" class="modal-title fs-5 flex-grow-1 text-center" id="TramitePaiModalLabel">
              TRAMITE | {{ tramiteModal.iD_Tramite }}
            </h1>
            <h1 v-if="tramiteModal.cStatusLR" class="modal-title fs-5 flex-grow-1 text-center" id="TramitePaiModalLabel">
              TRAMITE DE LOGÍSTICA REVERSA | {{ tramiteModal.iD_Tramite }}
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
          
        </div>

        <!-- Corpo do Modal -->
        
        <!-- PDF -->
        <div v-if="isVisualizarPDF" class="D-flex JC-center ALITEM-center HEIGHT-83vh BOR-B-grey-2">
          <div v-show="isLoadingPDF" class="WIDTH-100 HEIGHT-100 BGC-cinza-10 PADDING-B5 MARGIN-0 D-flex JC-center ALITEM-center">
            <!-- <img src="/assets/images/gif-carregamento-horizontal.gif" alt="Carregando..." style="width: 100px; height: auto;"/> -->
            <img src="/assets/images/Embys-PDF.png" alt="Carregando..." class=""
              style="width: 300px; height: auto;"/>
          </div>
          <iframe v-show="!isLoadingPDF"
            id="update-modal-iframe"
            class="HEIGHT-100 WIDTH-100 PADDING-0 MARGIN-0 ANIMATION-OPA-0-1-125"
          ></iframe>
        </div>
        
        <!-- CORPO NORMAL -->
        <div v-if="!modoExibicaoImagem && !isVisualizarPDF" id="modal-corpo" class="PADDING-0 d-flex flex-column" style="height: 78vh;">

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
                    v-model="tramiteModal.dDataTramite"
                    :title="tramiteModal.dDataTramite"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

                <!-- DATA INICIO -->
                <div class="WIDTH-21 MARGIN-R1P">
                  <label
                  id="datainicio-label"
                  for="datainicio-input"
                  class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                  >INÍCIO</label>
                  <input
                  disabled
                  id="datainicio-input"
                  v-model="tramiteModal.dHoraInicioTramite"
                  :title="tramiteModal.dHoraInicioTramite"
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
                  v-model="tramiteModal.dHoraFimTramite"
                  :title="tramiteModal.dHoraFimTramite"
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
                  v-model="tramiteModal.cNmFantasia"
                  :title="tramiteModal.cNmFantasia"
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
                    v-model="tramiteModal.iOrdemServico"
                    :title="tramiteModal.iOrdemServico"
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
                    v-model="tramiteModal.cTipoTramite"
                    :title="tramiteModal.cTipoTramite"
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
                  v-model="tramiteModal.cLancadoEstoque"
                  :title="tramiteModal.cLancadoEstoque"
                  type="text"
                  class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE TEXTALI-center">
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
                    v-model="tramiteModal.cNmUsuario"
                    :title="tramiteModal.cNmUsuario"
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
                    v-model="tramiteModal.cRazaoSocial"
                    :title="tramiteModal.cRazaoSocial"
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
                    v-model="tramiteModal.cTipoVeiculo"
                    :title="tramiteModal.cTipoVeiculo"
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
                    v-model="tramiteModal.cPlacaVeiculo"
                    :title="tramiteModal.cPlacaVeiculo"
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
                    v-model="tramiteModal.cNomeMotorista"
                    :title="tramiteModal.cNomeMotorista"
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
                    v-model="tramiteModal.cRGMotorista"
                    :title="tramiteModal.cRGMotorista"
                    type="text"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
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
                    v-model="tramiteModal.cConferenteTramite"
                    :title="tramiteModal.cConferenteTramite"
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
                    v-model="tramiteModal.cRemetDestCarga"
                    :title="tramiteModal.cRemetDestCarga"
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
                    v-model="tramiteModal.cUsuarioAnuladoPor"
                    :title="tramiteModal.cUsuarioAnuladoPor"
                    class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
                </div>

              </div>

            </div>

            <!-- Direita: Carrossel de fotos da carga -->
            <div id="carrossel-div" class="WIDTH-30" :style="{ height: `${alturaInfosPx}px` }" style=""
            >
              <Swiper v-if="imagensTramite?.length > 0 && imagemComponente.length == 0"
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

              <div v-if="imagensTramite?.length == 0 && imagemComponente.length == 0" class="WIDTH-100 HEIGHT-100 PADDING-5">
                <span class="BGC-cinza-6 WIDTH-100 HEIGHT-100 JC-center ALITEM-center D-flex PADDING-5" >Imagem não disponível</span>
              </div>

            </div>
            <!-- -------------------------------------------------------------------------------------/ -->

          </div>

            <div
              class="D-flex BGC-input-disabled"
              style="margin: 0.5%; width: 99%;"
              ref="tabelaContainer"
              :style="tableContainerItemTramiteStyle"
            >

            <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5">
              <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                <tr>
                  <th class="TEXTALI-left CTTABLEELPIS WIDTH-5">
                    O.S.
                  </th>
                  <th class="TEXTALI-left CTTABLEELPIS WIDTH-5">
                    N° N.F.
                  </th>
                  <th class="TEXTALI-center CTTABLEELPIS WIDTH-5">
                    N° COMP.
                  </th>
                  <th class="TEXTALI-left CTTABLEELPIS WIDTH-30">
                    COMPONENTE
                  </th>
                  <th class="TEXTALI-center CTTABLEELPIS WIDTH-3">
                    QTD.
                  </th>
                  <th class="TEXTALI-left CTTABLEELPIS WIDTH-9">
                    ACOND.
                  </th>
                  <th class="TEXTALI-left CTTABLEELPIS WIDTH-11">
                    ADC.
                  </th>
                  <th class="TEXTALI-center CTTABLEELPIS WIDTH-8">
                    LOTE
                  </th>
                  
                </tr>
              </thead>
              <LayoutTabelaCarregarEsqueleto :Linhas=20 :Colunas=6 v-if="!tabelaTRAMITEsCarregada" />
              
              <tbody v-if="tabelaTRAMITEsCarregada" class="BORRAD-5">
                <tr
                  v-for="(item, i) in itensTramite" :key="i"
                  class="BGC-H-cinza-8 HEIGHT-5px"
                  :class="applyTableStipedRows(i)"
                  :id="item.iD_Tramite_FILHO + ': ' + item.nomeTramite"
                  :value="item.iD_Tramite_FILHO"
                >
                  <td class="TEXTALI-left CTTABLEELPIS WIDTH-5" :title="item.iOs">
                    {{ item.iOs }}
                  </td>
                  <td class="TEXTALI-left CTTABLEELPIS WIDTH-5" :title="item.cNumNFE">
                    {{ item.cNumNFE }}
                  </td>
                  <td class="TEXTALI-center CTTABLEELPIS WIDTH-5" :title="item.cCodComponente">
                    {{ item.cCodComponente }}
                  </td>
                  <td v-if="!item.cTipoOperacao" class="TEXTALI-left CTTABLEELPIS WIDTH-30" :title="item.cNomeComponente">
                    {{ item.cNomeComponente }}
                  </td>
                  <td v-else class="TEXTALI-left CTTABLEELPIS WIDTH-30" :title="`${item.cNomeComponente} | ${item.cTipoOperacao} | ${item.cInfoGenerica}` ">
                    {{ `${item.cNomeComponente} | ${item.cTipoOperacao} | ${item.cInfoGenerica}` }}
                  </td>
                  <td class="TEXTALI-center CTTABLEELPIS WIDTH-3" :title="item.iQtdeComponente">
                    {{ item.iQtdeComponente }}
                  </td>
                  <td class="TEXTALI-left CTTABLEELPIS WIDTH-10" :title="item.acondicionamento">
                    {{ item.acondicionamento }}
                  </td>
                  <td class="TEXTALI-left CTTABLEELPIS WIDTH-15" :title="item.cAdicionaisProduto">
                    {{ item.cAdicionaisProduto }}
                  </td>
                  <td v-if="item.cLote" class="TEXTALI-center CTTABLEELPIS WIDTH-8" :title="item.cLote">
                    {{ item.cLote }}
                  </td>
                  <td v-else class="TEXTALI-center CTTABLEELPIS WIDTH-8" :title="`N/C`">
                    {{ `N/C` }}
                  </td>
                  
                </tr>
              
              </tbody>

            </table>

          </div>
        
        </div>

        <!-- Corpo caso esteja mostrando imagens -->
        <div v-if="modoExibicaoImagem" style="display: flex; flex-direction: row; justify-content: space-between; padding: 2% 2% 2% 2%; height: 85vh;" id="modal-body">

          <!-- Metade do modal é foto da carga -->
          <div style="width: 49%; border: 5px solid #ccc; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 100%; padding: 20px; box-sizing: border-box;">

            <h3 style="margin-bottom: 50px; text-align: center; width: 100%;">FOTOS CARGA</h3>

            <Swiper
              v-if="imagensTramite?.length > 0"
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
                v-model="tramiteModal.cTipoVeiculo"
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
                v-model="tramiteModal.cPlacaVeiculo"
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
                v-model="tramiteModal.cNomeMotorista"
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
                v-model="tramiteModal.cRGMotorista"
                type="text"
                class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
              </div>
              
            </div>

            <!-- GPT PURO -->
            <Swiper
            v-if="imagensTramite?.length > 0"
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

            <!-- Botão VISUALIZAR PDF -->
            <button
              v-if="!isVisualizarPDF && tramiteModal.bEmailEnviado"
              type="button"
              id="baixar-pdf-button"
              class="btn btn-warning FSIZE-11px"
              @click="OnClickVisualizarPDFVisualizarModal()"
            >
              <IconsPDF corProp="black" alturaProp="1.25" larguraProp="1.25"/>
              &nbsp;VISUALIZAR PDF
            </button>

          </div>

          <!-- CAMPO OBS GERAIS + BOTÃO SALVAR à direita -->
          <div
            class="d-flex align-items-end gap-2"
            style="width: 55%;"
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
                v-model="tramiteModal.cAdicionais"
                :title="tramiteModal.cAdicionais"
                class="form-control BOR-grey HEIGHT-55 MARGIN-T-10 FSIZE-10px InputUPPERCASE"
              >
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<style>
  .no-wrap-text {
  white-space: nowrap;  /* Impede quebra de linha */
  overflow: hidden;     /* Oculta excesso de texto */
  /* text-overflow: ellipsis; Adiciona "..." se cortar */
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
  padding-left: 0.25rem; /* mesmo padding do td */
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
</style>