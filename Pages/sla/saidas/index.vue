<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRoute } from 'vue-router'
import { shortenInfo, applyTableStipedRows, GetGenerico, getStatusClass } from '~/composables/visualization';
import { ToastSuccess, ToastError, ToastWarning } from '~/composables/toasts';
import { useAuthStore } from '~/stores/auth';
// VARIÁVEIS ------------------------------------------------------------------------------------------------------------

// Rota para obter o ID do cliente
const urlProd = useUrlProd();
const urlSistema = useUrlProdSistema();
const route = useRoute();
const urlBase = useUrlProd();

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
const carregandoPDF = ref(false);
const router = useRouter();

const tabelaSaidasCarregada = ref(false);

const infosTableSaidasSLA = ref([]);
const staticinfosTableSaidasSLA = ref([]); // Para manter os dados originais e poder limpar os filtros

const selectedCK = ref(null);
const selectedDestinatario = ref(null);
// const selectedUF = ref(null);
const selectedNotaFiscal = ref(null);
const selectedPedido = ref(null);
const selectedGuiaRemessa = ref(null);
const selectedTramite = ref(null);
const selectedStatus = ref(null);
const selectedTransportadora = ref(null); 
const selectedTipoPedido = ref(null);
const selectedCodRastreio = ref(null);

const infosEtapasSistemicas = ref([]);

const isLoadingEXCELRelatorio = ref(false);
const isLoadingPDFRelatorio = ref(false);

const mostrarTodos = ref(false);
const tituloModalPdfs = ref("");

const infoEntregaCarregado = ref(false);
const infoEntregaResponseDTO = ref({
  ID_Pedido_Entrega: null,
  ID_Carteira_Cliente: null,
  cNmFantasia: '',
  cRazaoSocial: '',
  dEntregaInformada: '',
  cNomeRecebedor: '',
  cDocRecebedor: '',
  cNomeResponsavel: '',
  cTipoResponsavel: '',
  cNomeFoto: '',
  imagemUrl: null,
  imagemUrlDownload: null
});
const cGuiaRemessaEntrega = ref('');
const mostrarTodosPedidosItensAreaCliente = ref(false);
const infoPedidosItensTabelaAreaCliente = ref([]);
const infoPedidosItensTabelaAreaClienteStatic = ref([]);
const infoPedidoItens = ref([]);
const linhaExpandidaDaTabelaPedidos = ref(null);
const idPedidoPDF = ref(0);

// PARA A BARRA DE TOTAL FICAR CORRETAMENTE ALINHADA ===========================\
const compensacaoScroll = ref('17');
const paddingTabela = ref('0.25rem');
const tabelaWrapperSaidas = ref(null);

const ajustarCompensacaoScrollSaidas = () => {
  const el = tabelaWrapperSaidas.value;
  if (!el) return;

  const temScroll =
    el.scrollHeight > el.clientHeight;

  compensacaoScroll.value = temScroll
    ? el.offsetWidth - el.clientWidth
    : 0;
};
// ==============================================================================/

// FUNÇÕES ---------------------------------------------------------------------------------------------------------------
// Computeds ----------------\
const cksUnicas = computed(() => {
  if (!infosTableSaidasSLA.value) return []
  return [...new Set(infosTableSaidasSLA.value.map(e => e.idCk))]
    .filter(Boolean) // tira undefined/nulos
    .map(c => ({ label: c, value: c }))
})
const destinatariosUnicos = computed(() => {
  if (!infosTableSaidasSLA.value) return []
  return [...new Set(infosTableSaidasSLA.value.map(e => e.destino))]
    .filter(Boolean) // tira undefined/nulos
    .map(c => ({ label: c, value: c }))
})
// const ufsUnicas = computed(() => {
//   if (!infosTableSaidasSLA.value) return []
//   return [...new Set(infosTableSaidasSLA.value.map(e => e.uf))]
//     .filter(Boolean) // tira undefined/nulos
//     .map(c => ({ label: c, value: c }))
// })
const notasFiscaisUnicas = computed(() => {
  if (!infosTableSaidasSLA.value) return []
  return [...new Set(infosTableSaidasSLA.value.map(e => e.nFe))]
    .filter(Boolean) // tira undefined/nulos
    .map(c => ({ label: c, value: c }))
})
const pedidosUnicos = computed(() => {
  if (!infosTableSaidasSLA.value) return []
  return [...new Set(infosTableSaidasSLA.value.map(e => e.idPedido))] 
    .filter(Boolean)
    .map(c => ({ label: String(c), value: c })) // força label string p/ não dar warning
})
const guiasRemessasUnicas = computed(() => {
  if (!infosTableSaidasSLA.value) return []
  return [...new Set(infosTableSaidasSLA.value.map(e => e.guiaRemessa))]
    .filter(Boolean) // tira undefined/nulos
    .map(c => ({ label: c, value: c }))
})
const tramitesUnicos = computed(() => {
  if (!infosTableSaidasSLA.value) return []
  return [...new Set(infosTableSaidasSLA.value.map(e => e.tramite))]
    .filter(Boolean) // tira undefined/nulos
    .map(c => ({ label: String(c), value: c }))
})
const statusUnicos = computed(() => {
  if (!infosTableSaidasSLA.value) return []
  return [...new Set(infosTableSaidasSLA.value.map(e => e.status))]
    .filter(Boolean) // tira undefined/nulos
    .map(c => ({ label: c, value: c }))
})
const transportadorasUnicas = computed(() => {
  if (!infosTableSaidasSLA.value) return []
  return [...new Set(infosTableSaidasSLA.value.map(e => e.transportadora))]
    .filter(Boolean) // tira undefined/nulos
    .map(c => ({ label: c, value: c }))
})
const tiposPedidosUnicos = computed(() => {
  if (!infosTableSaidasSLA.value) return []
  return [...new Set(infosTableSaidasSLA.value.map(e => e.tipoPedido))]
    .filter(Boolean) // tira undefined/nulos
    .map(c => ({ label: c, value: c }))
})
const codRastreiosUnicos = computed(() => {
  if (!infosTableSaidasSLA.value) return []
  return [...new Set(infosTableSaidasSLA.value.map(e => e.codigoRastreio))]
    .filter(Boolean) // tira undefined/nulos
    .map(c => ({ label: c, value: c }))
})
const infosTableSaidasSLASlice = computed(() => {
  return mostrarTodos.value
    ? infosTableSaidasSLA.value
    : infosTableSaidasSLA.value.slice(0, 50)
});
// const totalQuantidadeItensSaidas = computed(() => {
//   const normalize = (val) => val != null ? val.toString().toLowerCase() : "";

//   const ck             = normalize(selectedCK.value?.value ?? selectedCK.value);
//   const destinatario   = normalize(selectedDestinatario.value?.value ?? selectedDestinatario.value);
//   // const uf             = normalize(selectedUF.value?.value ?? selectedUF.value);
//   const notaFiscal     = normalize(selectedNotaFiscal.value?.value ?? selectedNotaFiscal.value);
//   const pedido         = normalize(selectedPedido.value?.value ?? selectedPedido.value);
//   const guiaRemessa    = normalize(selectedGuiaRemessa.value?.value ?? selectedGuiaRemessa.value);
//   const tramite        = normalize(selectedTramite.value?.value ?? selectedTramite.value);
//   const status         = normalize(selectedStatus.value?.value ?? selectedStatus.value);
//   const transportadora = normalize(selectedTransportadora.value?.value ?? selectedTransportadora.value);
//   const tipoPedido     = normalize(selectedTipoPedido.value?.value ?? selectedTipoPedido.value);
//   const codRastreio    = normalize(selectedCodRastreio.value?.value ?? selectedCodRastreio.value);

//   return staticinfosTableSaidasSLA.value
//     .filter(comp => {
//       let dentroIntervalo = true;
//       if (comp.dataTramite && dataInicial.value && dataFinal.value) {
//         const [dia, mes, ano] = comp.dataTramite.split("/");
//         const dataItem = new Date(`${ano}-${mes}-${dia}`);
//         const inicio   = new Date(dataInicial.value);
//         const fim      = new Date(dataFinal.value);

//         dentroIntervalo = dataItem >= inicio && dataItem <= fim;
//       }

//       return (
//         (ck             ? normalize(comp.idCk).includes(ck) : true) &&
//         (destinatario   ? normalize(comp.destino).includes(destinatario) : true) &&
//         (uf             ? normalize(comp.uf).includes(uf) : true) &&
//         (notaFiscal     ? normalize(comp.nFe).includes(notaFiscal) : true) &&
//         (pedido         ? normalize(comp.idPedido).includes(pedido) : true) &&
//         (guiaRemessa    ? normalize(comp.guiaRemessa).includes(guiaRemessa) : true) &&
//         (tramite        ? normalize(comp.tramite).includes(tramite) : true) &&
//         (status         ? normalize(comp.status).includes(status) : true) &&
//         (transportadora ? normalize(comp.transportadora).includes(transportadora) : true) &&
//         (tipoPedido     ? normalize(comp.tipoPedido).includes(tipoPedido) : true) &&
//         dentroIntervalo
//       );
//     })
//     .reduce((acc, e) => acc + (Number(e.itens) || 0), 0);
// });
const totalQuantidadeVolumesSaidas = computed(() => {
  const normalize = (val) => val != null ? val.toString().toLowerCase() : "";

  const ck             = normalize(selectedCK.value?.value ?? selectedCK.value);
  const destinatario   = normalize(selectedDestinatario.value?.value ?? selectedDestinatario.value);
  // const uf             = normalize(selectedUF.value?.value ?? selectedUF.value);
  const notaFiscal     = normalize(selectedNotaFiscal.value?.value ?? selectedNotaFiscal.value);
  const pedido         = normalize(selectedPedido.value?.value ?? selectedPedido.value);
  const guiaRemessa    = normalize(selectedGuiaRemessa.value?.value ?? selectedGuiaRemessa.value);
  const tramite        = normalize(selectedTramite.value?.value ?? selectedTramite.value);
  const status         = normalize(selectedStatus.value?.value ?? selectedStatus.value);
  const transportadora = normalize(selectedTransportadora.value?.value ?? selectedTransportadora.value);
  const tipoPedido     = normalize(selectedTipoPedido.value?.value ?? selectedTipoPedido.value);
  const codRastreio    = normalize(selectedCodRastreio.value?.value ?? selectedCodRastreio.value);

  return staticinfosTableSaidasSLA.value
    .filter(comp => {
      let dentroIntervalo = true;
      if (comp.dataTramite && dataInicial.value && dataFinal.value) {
        const [dia, mes, ano] = comp.dataTramite.split("/");
        const dataItem = new Date(`${ano}-${mes}-${dia}`);
        const inicio   = new Date(dataInicial.value);
        const fim      = new Date(dataFinal.value);

        dentroIntervalo = dataItem >= inicio && dataItem <= fim;
      }

      return (
        (ck             ? normalize(comp.idCk).includes(ck) : true) &&
        (destinatario   ? normalize(comp.destino).includes(destinatario) : true) &&
        // (uf             ? normalize(comp.uf).includes(uf) : true) &&
        (notaFiscal     ? normalize(comp.nFe).includes(notaFiscal) : true) &&
        (pedido         ? normalize(comp.idPedido).includes(pedido) : true) &&
        (guiaRemessa    ? normalize(comp.guiaRemessa).includes(guiaRemessa) : true) &&
        (tramite        ? normalize(comp.tramite).includes(tramite) : true) &&
        (status         ? normalize(comp.status).includes(status) : true) &&
        (transportadora ? normalize(comp.transportadora).includes(transportadora) : true) &&
        (tipoPedido     ? normalize(comp.tipoPedido).includes(tipoPedido) : true) &&
        (codRastreio    ? normalize(comp.codigoRastreio).includes(codRastreio) : true) &&
        dentroIntervalo
      );
    })
    .reduce((acc, e) => acc + (Number(e.volume) || 0), 0);
});

// --------------------------/
// MODAL 
  const abrirModalEtapasSistema = async (ID_Pedido) => {
    showModal('EtapasSistemaModal', true);

    await getEtapasSistemicas(ID_Pedido);
  };
  const abrirModalVisualizaPDFs = async (ID_Pedido, TipoPDF) => {
    
    tituloModalPdfs.value = TipoPDF;
    carregandoPDF.value = true;
    idPedidoPDF.value = ID_Pedido;
    
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
    idPedidoPDF.value = 0
    showModal('VisualizarPDFs', false);
    const iframe = document.getElementById("iframePDF");
    iframe.src = 'about:blank';
  }
  const getPDFPedido = async (ID_Pedido) => {
    const authStore = useAuthStore();

    try {
      const response = await axios.post(
        `${urlBase}/consultas-sla/visualiza-baixa-pdf-pedido/${ID_Pedido}/1`,
        null,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${authStore.token ?? ''}`
          }
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
    const authStore = useAuthStore();

    try {
      const response = await axios.post(
        `${urlBase}/consultas-sla/visualiza-baixa-pdf-danfe/pedido/${ID_Pedido}/1`,
        null,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${authStore.token ?? ''}`
          }
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
  const normalize = (val) => val != null ? val.toString().toLowerCase() : "";

  const ck             = normalize(selectedCK.value?.value ?? selectedCK.value);
  const destinatario   = normalize(selectedDestinatario.value?.value ?? selectedDestinatario.value);
  // const uf             = normalize(selectedUF.value?.value ?? selectedUF.value);
  const notaFiscal     = normalize(selectedNotaFiscal.value?.value ?? selectedNotaFiscal.value);
  const pedido         = normalize(selectedPedido.value?.value ?? selectedPedido.value);
  const guiaRemessa    = normalize(selectedGuiaRemessa.value?.value ?? selectedGuiaRemessa.value);
  const tramite        = normalize(selectedTramite.value?.value ?? selectedTramite.value);
  const status         = normalize(selectedStatus.value?.value ?? selectedStatus.value);
  const transportadora = normalize(selectedTransportadora.value?.value ?? selectedTransportadora.value);
  const tipoPedido     = normalize(selectedTipoPedido.value?.value ?? selectedTipoPedido.value);
  const codRastreio    = normalize(selectedCodRastreio.value?.value ?? selectedCodRastreio.value);

  infosTableSaidasSLA.value = staticinfosTableSaidasSLA.value.filter(comp => {
    return (
      (ck             ? normalize(comp.idCk).includes(ck) : true) &&
      (destinatario   ? normalize(comp.destino).includes(destinatario) : true) &&
      // (uf             ? normalize(comp.uf).includes(uf) : true) &&
      (notaFiscal     ? normalize(comp.nFe).includes(notaFiscal) : true) &&
      (pedido         ? normalize(comp.idPedido).includes(pedido) : true) &&
      (guiaRemessa    ? normalize(comp.guiaRemessa).includes(guiaRemessa) : true) &&
      (tramite        ? normalize(comp.tramite).includes(tramite) : true) &&
      (status         ? normalize(comp.status).includes(status) : true) &&
      (transportadora ? normalize(comp.transportadora).includes(transportadora) : true) &&
      (tipoPedido     ? normalize(comp.tipoPedido).includes(tipoPedido) : true) &&
      (codRastreio    ? normalize(comp.codigoRastreio).includes(codRastreio) : true)
    );
  });

  await nextTick();

  ajustarCompensacaoScrollSaidas();

};

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

async function getInfosSaidasSLA() {
  const authStore = useAuthStore();

  try {
    tabelaSaidasCarregada.value = false;

    const response = await axios.get(`${urlProd}/consultas-sla/sla-saidas/${ID_Carteira.value}/${dataInicial.value}/${dataFinal.value}`, {
      headers: {
        Authorization: `Bearer ${authStore.token ?? ''}`
      }
    });

    infosTableSaidasSLA.value = response.data;
    staticinfosTableSaidasSLA.value = response.data;

    tabelaSaidasCarregada.value = true;

    aplicarFiltros();
  } catch (response) {
    console.error("Erro ao buscar dados:");
  }
}
async function getEtapasSistemicas(idPedido) {
  const authStore = useAuthStore();

  try {
    const response = await axios.get(`${urlProd}/consultas-sla/etapas-sistemicas/${idPedido}`, {
      headers: {
        Authorization: `Bearer ${authStore.token ?? ''}`
      }
    });
    infosEtapasSistemicas.value = response.data;

  } catch (response) {
    console.error("Erro ao buscar dados:");
  }
}
async function fetchEXCELSaidasSLA() {
  if(infosTableSaidasSLA.value.length == 0) {
    ToastWarning('Não há dados para exportar!');
    return;
  }

  ToastWarning('Aguarde enquanto o documento é gerado...');

  isLoadingEXCELRelatorio.value = true;
  const authStore = useAuthStore();

  try {
    // Garante array puro
    const payload = Array.isArray(infosTableSaidasSLA.value)
      ? toRaw(infosTableSaidasSLA.value)
      : [toRaw(infosTableSaidasSLA.value)];

    const url = `${urlProd}/consultas-sla/sla-saidas-excel`;

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
    ToastSuccess('Documento baixado com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar Excel:', error);
    ToastError('Erro ao gerar o documento');
  }
  isLoadingEXCELRelatorio.value = false;
};
async function fetchPDFSaidasSLA() {
  if(infosTableSaidasSLA.value.length == 0) {
    ToastWarning('Não há dados para exportar!');
    return;
  }

  ToastWarning('Aguarde enquanto o documento é gerado...');

  isLoadingPDFRelatorio.value = true;
  const authStore = useAuthStore();

  try {
    // Garante array puro
    const payload = Array.isArray(infosTableSaidasSLA.value)
      ? toRaw(infosTableSaidasSLA.value)
      : [toRaw(infosTableSaidasSLA.value)];

    const url = `${urlProd}/consultas-sla/sla-saidas-pdf`; // <-- endpoint do PDF

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
    ToastSuccess('Documento baixado com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    ToastError('Erro ao gerar o documento');
  }
  isLoadingPDFRelatorio.value = false;
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

  await getInfosSaidasSLA();
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

  await getInfosSaidasSLA();
};

async function onClickLimparFiltros() {
  dataInicial.value = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
  dataFinal.value = new Date().toISOString().split('T')[0];

  selectedCK.value = null;
  selectedDestinatario.value = null;
  selectedNotaFiscal.value = null;
  selectedPedido.value = null;
  selectedGuiaRemessa.value = null;
  selectedTramite.value = null;
  selectedStatus.value = null;
  selectedTransportadora.value = null;
  selectedTipoPedido.value = null;
  selectedCodRastreio.value = null;

  infosTableSaidasSLA.value = staticinfosTableSaidasSLA.value;
  await getInfosSaidasSLA();
  aplicarFiltros();
};
const toggleVerMais = () => {
  mostrarTodos.value = !mostrarTodos.value;
}

const IrParaRota = (rota) => {
  router.push(rota);
};

// ENTREGA
 const OnClickFecharModalInfoEntrega = () => {
    showModal('InfoEntregaModal', false);

    infoEntregaResponseDTO.value = {
      ID_Pedido_Entrega: null,
      ID_Carteira_Cliente: null,
      cNmFantasia: '',
      cRazaoSocial: '',
      dEntregaInformada: '',
      cNomeRecebedor: '',
      cDocRecebedor: '',
      cNomeResponsavel: '',
      cTipoResponsavel: '',
      cNomeFoto: '',
      imagemUrl: null,
      imagemUrlDownload: null
    };
  };

  const abriModalEntrega = async (ID_Pedido_Entrega, cGuiaRemessa) => {
    cGuiaRemessaEntrega.value = cGuiaRemessa;
    showModal('InfoEntregaModal', true);

    infoEntregaResponseDTO.value = await GetInfoEntregaFoto(ID_Pedido_Entrega);
  };

  const GetInfoEntregaFoto = async (ID_Pedido_Entrega) => {
    const authStore = useAuthStore();
    infoEntregaCarregado.value = false;

    try {
      const url = `${urlProd}/sla/pedido-entrega/get-info-entrega-foto/${ID_Pedido_Entrega}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${authStore.token ?? ''}` }
      });

      const dto = response?.data;
      if (!dto) return null;

      let blobUrl = null;

      // Se existir foto, converte
      if (dto.foto) {
        const byteCharacters = atob(dto.foto);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        blobUrl = URL.createObjectURL(blob);
      }

      return {
        ID_Pedido_Entrega: dto.id_Pedido_Entrega,
        ID_Carteira_Cliente: dto.id_Carteira_Cliente,
        cNmFantasia: dto.cNmFantasia,
        cRazaoSocial: dto.cRazaoSocial,
        dEntregaInformada: dto.dEntregaInformada,
        cNomeRecebedor: dto.cNomeRecebedor,
        cDocRecebedor: dto.cDocRecebedor,
        cNomeResponsavel: dto.cNomeResponsavel,
        cTipoResponsavel: dto.cTipoResponsavel,
        cNomeFoto: dto.cNomeFoto ?? '',
        imagemUrl: blobUrl,
        imagemUrlDownload: blobUrl
      };
    } catch (error) {
      console.error('Erro ao recuperar dados da entrega:', error);
      return null;
    } finally {
      infoEntregaCarregado.value = true;
    }
  };
  
  const enviaEmailPDF = async (idPedido, idUsuario, tipoPdf) => {
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

  const ativarSubLinhaItensPedido = async (ID_Pedido) => {
    infoPedidoItens.value = [];

    if (linhaExpandidaDaTabelaPedidos.value ===  ID_Pedido) {
      linhaExpandidaDaTabelaPedidos.value = null;
    } else {
      linhaExpandidaDaTabelaPedidos.value = ID_Pedido
      infoPedidoItens.value = await getInfosPedidosInfoAreaCliente(ID_Pedido);
    }
  };

  async function getInfosPedidosInfoAreaCliente(idPedido) {
    const authStore = useAuthStore();

    mostrarTodosPedidosItensAreaCliente.value = false

    try {
      const response = await axios.get(`${urlProd}/consultas-sla/area-cliente-pedidos/itens/${idPedido}`, {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`
        }
      });
      infoPedidosItensTabelaAreaCliente.value = response.data
      infoPedidosItensTabelaAreaClienteStatic.value = response.data

      mostrarTodosPedidosItensAreaCliente.value = true

      return infoPedidosItensTabelaAreaCliente.value
    } catch (error) {
      mostrarTodosPedidosItensAreaCliente.value = false

      throw error
    }

  };

// MOUNTED DA PÁGINA
onMounted(async () => {
  await getTransportadorasApenasSLA();
  await getInfosSaidasSLA();

  await nextTick(() => {
    ajustarCompensacaoScrollSaidas();

    // let td = tabelaSaidasCarregada.value?.querySelector('tbody td');

    // if (td) {
    //   const style = getComputedStyle(td);
    //   paddingTabela.value = style.paddingLeft;
    // }
  });

});

</script>


<template>
  
  <!-- layout main da página -->
  <main class="D-flex">

    <!-- Todo o Conteúdo da página -->
    <div class="D-flex FD-column WIDTH-100 HEIGHT-100vh OFLOW-auto">

      <!-- Menu Superior -->
      <SetorProducaoSLAMenuSuperior 
        funcionalidadeProp="SAÍDAS"
        :destinoVoltarProp="`/sla`"
        :srcFoto="logoPath"
      />
      
      <!-- ESPAÇO CORPO -->
      <div class="D-flex FD-column HEIGHT-88vh WIDTH-100 JC-center ALITEM-center BGC-cinza-9 BOR-branca">
        <!-- QUADRO BRANCO -->
        <div class="D-flex FD-column ALITEM-center JC-center HEIGHT-90 WIDTH-98 BORRAD-5 BGC-branco PADDING-T5-B10">

          <!-- Filtros -->
          <div class="D-flex JC-space-between HEIGHT-30 WIDTH-98 mb-1">

            <div class="D-flex WIDTH-100 JC-space-between">
              
              <!-- Decoração FILTROS -->
              <div class="WIDTH-6 BGC-azul-esverdeado COLOR-white ALITEM-center BORRAD-5 FWEIGHT-bold D-flex FD-column JC-space-between">
                <p>Filtros</p>
                <button type="button" class="btn btn-dark WIDTH-75 FSIZE-12px mb-1" @click="onClickLimparFiltros">Limpar</button>
              </div>

              <!-- DIV CENTRAL 1 -->
              <div class="D-flex WIDTH-25 FD-column PADDING-T0-R5-B5-L10">

                <!-- Filtro de DATAS -->
                <div class="WIDTH-98-5 D-flex JC-space-between ALITEM-center MARGIN-T-5">
            
                  <div class="WIDTH-45 mb-1">
                    <label
                      id="data-inicio-aguardando-label"
                      for="data-inicio-aguardando-input"
                      class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
                    ></label>
                    <input
                      autocomplete="off"
                      id="data-inicio-aguardando-input"
                      type="date"
                      onkeydown="return false"
                      @change="OnChangeDataInicio"
                      v-model="dataInicial"
                      class="form-control WIDTH-100 BORRAD-5 BOR-grey MARGIN-T-10 FSIZE-12px BGC-branco">
                  </div>
                  
                  <div
                    class="form-label WIDTH-5 BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold PADDING-R5-L5"
                    style="margin-top: 20px;"
                  >A</div>

                  <div class="WIDTH-45 mb-1" style="margin-right: 2px;">
                    <label
                      id="data-inicio-aguardando-label"
                      for="data-inicio-aguardando-input"
                      class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
                    ></label>
                    <input
                      autocomplete="off"
                      id="data-inicio-aguardando-input"
                      type="date"
                      onkeydown="return false"
                      @change="OnChangeDataFinal"
                      v-model="dataFinal"
                      class="form-control BORRAD-5 BOR-grey MARGIN-T-10 FSIZE-12px BGC-branco">
                  </div>

                </div>

                <!-- DESTINATÁRIO -->
                <BasicElementVue3SelectPequeno
                  :options="destinatariosUnicos"
                  v-model="selectedDestinatario"

                  label="DESTINATÁRIO:"
                  :titulo="selectedDestinatario ? selectedDestinatario.label : ''"

                  @update:modelValue="aplicarFiltros"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15-L-5'"
                  :widthLista="''"

                  option-label="label"
                  option-value="value"
                />

                <!-- TRANSPORTADORA -->
                <BasicElementVue3SelectPequeno
                  
                  :options="transportadorasUnicas"
                  v-model="selectedTransportadora"
                  
                  label="TRANSPORTADORA:"
                  class="col-4"
                  :titulo="selectedTransportadora ? selectedTransportadora.label : ''"


                  @update:modelValue="aplicarFiltros"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15-L-5'"
                  :widthLista="''"

                  option-label="label"
                  option-value="value"
                />



              </div>

              <!-- DIV CENTRAL 2 -->
              <div class="D-flex WIDTH-25 FD-column PADDING-T0-R5-B5-L10 BOR-L-solidgrey-1">
                
                <div class="WIDTH-100 D-flex JC-space-between ALITEM-center MARGIN-T-5">
                  <!-- PEDIDO -->
                  <BasicElementVue3SelectPequeno
                    
                    :options="pedidosUnicos"
                    v-model="selectedPedido"

                    @update:modelValue="aplicarFiltros"
                    
                    label="N. PEDIDO:"
                    :titulo="selectedPedido ? selectedPedido.label : ''"

                    :divClass="'MARGIN-T21 WIDTH-50'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px MARGIN-T-15-L-5'"
                    :widthLista="''"

                    option-label="label"
                    option-value="value"
                  />

                  <!-- GUIA REMESSA -->
                  <BasicElementVue3SelectPequeno
                    :options="guiasRemessasUnicas"
                    v-model="selectedGuiaRemessa"

                    @update:modelValue="aplicarFiltros"
                    
                    label="GUIA REMESSA:"
                    :titulo="selectedGuiaRemessa ? selectedGuiaRemessa.label : ''"


                    :divClass="'MARGIN-T21 WIDTH-50'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px MARGIN-T-15-L-5'"
                    :widthLista="''"

                    
                    option-label="label"
                    option-value="value"
                  />
                </div>

                <div class="WIDTH-100 D-flex JC-space-between ALITEM-center">
                  <!-- STATUS -->
                  <BasicElementVue3SelectPequeno
                    :options="statusUnicos"

                    optionLabel="idCarteira_cNmFantasia_CPFCNPJ"
                    v-model="selectedStatus"
                    
                    label="STATUS:"
                    :titulo="selectedStatus ? selectedStatus.label : ''"


                    @update:modelValue="aplicarFiltros"

                    :divClass="'MARGIN-T21 WIDTH-50'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px MARGIN-T-15-L-5'"
                    :widthLista="''"

                    option-label="label"
                    option-value="value"
                  />

                  <!-- TIPO PEDIDO -->
                  <BasicElementVue3SelectPequeno
                    
                    :options="tiposPedidosUnicos"
                    v-model="selectedTipoPedido"
                    
                    label="TIPO PEDIDO:"
                    :titulo="selectedTipoPedido ? selectedTipoPedido.label : ''"


                    @update:modelValue="aplicarFiltros"

                    :divClass="'MARGIN-T21 WIDTH-50'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px MARGIN-T-15-L-5'"
                    :widthLista="''"

                    option-label="label"
                    option-value="value"
                  />

                  <!-- UF -->
                  <!-- <BasicElementVue3SelectPequeno
                    :options="ufsUnicas"
                    v-model="selectedUF"

                    @update:modelValue="aplicarFiltros"

                    label="UF:"
                    class="col-2"
                    :titulo="selectedUF ? selectedUF.label : ''"

                    :divClass="'MARGIN-T21 WIDTH-32'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px MARGIN-T-15-L-5'"
                    :widthLista="''"

                    option-label="label"
                    option-value="value"
                  /> -->
                </div>

                <div class="WIDTH-100 D-flex JC-space-between ALITEM-center">

                  <!--CÓDIGO DE RASTREIO -->
                  <BasicElementVue3SelectPequeno
                    
                    :options="codRastreiosUnicos"
                    v-model="selectedCodRastreio"
                    
                    label="COD. RASTREIO:"
                    :titulo="selectedCodRastreio ? selectedCodRastreio.label : ''"


                    @update:modelValue="aplicarFiltros"

                    :divClass="'MARGIN-T21 WIDTH-100'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px MARGIN-T-15-L-5'"
                    :widthLista="''"

                    option-label="label"
                    option-value="value"
                  />

                </div>

                <!-- <div class="WIDTH-100 D-flex JC-space-between ALITEM-center">
                  TOTAL DE PEDIDOS: 23 
                </div> -->

              </div>

              <!-- NF e CK -->
              <div class="D-flex WIDTH-25 FD-column PADDING-T0-R5-B5-L10 BOR-L-solidgrey-1">
                <div class="WIDTH-100 D-flex JC-space-between ALITEM-center">
                  <!-- NOTA FISCAL -->
                  <BasicElementVue3SelectPequeno
                    :options="notasFiscaisUnicas"
                    v-model="selectedNotaFiscal"
                    
                    @update:modelValue="aplicarFiltros"
                    
                    label="NOTA FISCAL:"
                    :titulo="selectedNotaFiscal ? selectedNotaFiscal.label : ''"
  
  
                    :divClass="'MARGIN-T21 WIDTH-50'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px MARGIN-T-15-L-5'"
                    :widthLista="''"
  
                    option-label="label"
                    option-value="value"
                  />

                  <!-- TRÂMITE -->
                  <!-- <BasicElementVue3SelectPequeno
                    v-model="selectedTramite"
                    :options="tramitesUnicos"

                    @update:modelValue="aplicarFiltros"
                    
                    label="TRÂMITE:"
                    :titulo="selectedTramite?.label"

                    :divClass="'MARGIN-T21 WIDTH-32'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px MARGIN-T-15'"
                    :widthLista="''"

                    
                    option-label="label"
                    option-value="value"
                  /> -->

                  <!-- CK -->
                  <BasicElementVue3SelectPequeno
                    :options="cksUnicas"
                    v-model="selectedCK"
                    
                    label="CK:"
                    :titulo="selectedCK ? String(selectedCK.label) : ''"

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

              <!-- DIV DIREITA - Botões -->
              <div class="WIDTH-19 HEIGHT-100 D-flex JC-flex-end ALITEM-flex-end">
                <div style="margin-right: 10px; cursor: pointer;" @click="getInfosSaidasSLA()" title="Atualizar informações">
                  <IconsRefresh
                    corProp="rgb(24, 134, 84)"
                    alturaProp="1.6"
                    larguraProp="1.6"
                  />
                </div>
                
                <!-- EXCEL -->
                <button :disabled="isLoadingEXCELRelatorio" id="exportar-EXCEL-button" type="button"
                  class="btn btn-success MARGIN-R5 FSIZE-12px PADDING-4 " @click="fetchEXCELSaidasSLA()">
                  <IconsExcel corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                  Exportar EXCEL</button>
                  
                <!-- PDF -->
                <button :disabled="isLoadingPDFRelatorio" id="exportar-PDF-button" type="button"
                  class="btn btn-warning FSIZE-12px PADDING-4" @click="fetchPDFSaidasSLA()">
                  <IconsPDF corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                  Exportar PDF
                </button>

              </div>

            </div>
          </div>

          <!-- Tabela -->
          <div class="BOR-SensacaoAfundado OFLOW-auto WIDTH-99 HEIGHT-70 BORRAD-5">

            <div class="HEIGHT-93 OFLOW-auto WIDTH-100" ref="tabelaWrapperSaidas">
          
              <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5 table-fixed FSIZE-PADRAO-TABLE">
                  <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                  <tr>
                    <th class="WIDTH-2 TEXTALI-center no-wrap-text" scope="col"></th>
                    <th class="WIDTH-2 TEXTALI-center no-wrap-text" scope="col"></th>
                    <th class="WIDTH-2 TEXTALI-center no-wrap-text" scope="col"></th>
                    <th class="WIDTH-2 TEXTALI-center no-wrap-text" scope="col"></th>
                    <th class="WIDTH-2 TEXTALI-center no-wrap-text" scope="col"></th>
                    <th class="WIDTH-7 TEXTALI-center no-wrap-text" scope="col">Data</th>
                    <th class="WIDTH-7 TEXTALI-center no-wrap-text" scope="col">C.K.</th>
                    <th class="WIDTH-7 TEXTALI-center no-wrap-text" scope="col">Trâmite</th>
                    <th class="WIDTH-10 TEXTALI-center no-wrap-text" scope="col">G. Remessa</th>
                    <th class="WIDTH-8 TEXTALI-center no-wrap-text" scope="col">Pedido</th>
                    <th class="WIDTH-7 TEXTALI-center no-wrap-text" scope="col">Cod. Rastreio</th>
                    <!-- <th class="WIDTH-6 TEXTALI-center no-wrap-text" scope="col">O.V</th> -->
                    <th class="WIDTH-8 TEXTALI-center no-wrap-text" scope="col">NFe</th>
                    <th class="WIDTH-9 TEXTALI-center no-wrap-text" scope="col">Status</th>
                    <th class="WIDTH-5 TEXTALI-center no-wrap-text" scope="col">Vol.</th>
                    <!-- <th class="WIDTH-5 TEXTALI-center no-wrap-text" scope="col">Itens</th> -->
                    <th class="WIDTH-11 TEXTALI-center no-wrap-text" scope="col">Destinatário</th>
                    <th class="WIDTH-11 TEXTALI-center no-wrap-text" scope="col">Transportadora</th>

                  </tr>
                </thead>
                <LayoutTabelaCarregarEsqueleto v-if="!tabelaSaidasCarregada"
                  :Linhas="infosTableSaidasSLASlice.length === 0 ? 15 : infosTableSaidasSLASlice.length" :Colunas="16" />
                
                  <tbody v-if="tabelaSaidasCarregada" class="BORRAD-5">
                    <template v-for="(saida, i) in infosTableSaidasSLASlice" :key="i">
                   
                      <!-- LINHA PRINCIPAL -->
                      <tr class="CURSOR-pointer BGC-H-cinza-8" :class="applyTableStipedRows(i + 1)">
                        <td class="WIDTH-2 TEXTALI-center ALITEM-center">
                          <button
                            title="Mais informações"
                            class="custom-button"
                            style="height: 15px; width: 15px;"
                            @click.stop.prevent="ativarSubLinhaItensPedido(saida.iD_Pedido ?? 0)"
                          >{{ linhaExpandidaDaTabelaPedidos === saida.iD_Pedido ? '-' : '+' }}
                          </button>
                        </td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-2 TEXTALI-center" scope="row">
                          <button type="button" class="in-table-button" title="Visualizar Pedido" 
                          @click="abrirModalVisualizaPDFs(saida.iD_Pedido, 'PDF PEDIDO')">
                            <IconsPedido corProp="currentColor" alturaProp="1" larguraProp="1"/>  
                          </button>
                        </td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-2 TEXTALI-center" scope="row">
                          <button type="button" class="in-table-button" title="Visualizar Etapas Sistêmicas" 
                          @click="abrirModalEtapasSistema(saida.iD_Pedido)">
                            <IconsPencilDoc corProp="currentColor" alturaProp="1.5" larguraProp="1.5"/>  
                          </button>
                        </td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-2 TEXTALI-center" scope="row">
                          <button type="button" class="in-table-button" title="Visualizar Cópia do DANFE" 
                          @click="abrirModalVisualizaPDFs(saida.iD_Pedido, 'PDF DANFE')">
                            <IconsConsulta corProp="currentColor" alturaProp="1" larguraProp="1"/>  
                          </button>
                        </td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-2 TEXTALI-center" scope="row">
                          <button v-if="saida.status ===  'ENTREGUE'" type="button" class="in-table-button" title="Visualizar informações da entrega" 
                          @click="abriModalEntrega(saida.idPedidoEntrega, saida.guiaRemessa)">
                            <IconsCaminhao corProp="currentColor" alturaProp="1" larguraProp="1"/>  
                          </button>
                        </td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-7 TEXTALI-center TableElipsis" scope="row" :title="saida.dataSaida" >{{ saida.dataSaida }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-7 TEXTALI-center TableElipsis" scope="row" :title="saida.idCk" >{{ saida.idCk }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-7 TEXTALI-center TableElipsis" scope="row" :title="saida.tramite" >{{ saida.tramite }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-10 TEXTALI-center no-wrap-text" scope="row" :title="saida.guiaRemessa" >{{ saida.guiaRemessa }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-8 TEXTALI-center no-wrap-text" scope="row" :title="saida.cNumPedido" >{{ saida.cNumPedido }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-7 TEXTALI-center no-wrap-text" scope="row" :title="saida.codigoRastreio" >{{ saida.codigoRastreio }}</td>
                        <!-- <td class="HEIGHT-5px no-wrap-text WIDTH-6 TEXTALI-center TableElipsis" scope="row" :title="saida.ov" >{{ saida.ov }}</td> -->
                        <td class="HEIGHT-5px no-wrap-text WIDTH-8 TEXTALI-center TableElipsis" scope="row" :title="saida.nFe" >{{ saida.nFe }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-9 TEXTALI-center TableElipsis" scope="row" :title="saida.status" :class="['TEXTALI-center', getStatusClass(saida.status)]" >{{ saida.status }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-5 TEXTALI-right TableElipsis" scope="row" :title="saida.volume" >{{ saida.volume }}</td>
                        <!-- <td class="HEIGHT-5px no-wrap-text WIDTH-5 TEXTALI-center TableElipsis" scope="row" :title="saida.itens" >{{ saida.itens }}</td> -->
                        <td class="HEIGHT-5px no-wrap-text WIDTH-11 TEXTALI-left TableElipsis" scope="row" :title="saida.destino" >{{ saida.destino }}</td>
                        <td class="HEIGHT-5px no-wrap-text WIDTH-11 TEXTALI-left TableElipsis" scope="row" :title="saida.transportadora" >{{ saida.transportadora }}</td>
                      </tr>

                      <!-- LINHA EXPANDIDA -->
                      <tr v-if="linhaExpandidaDaTabelaPedidos === saida.iD_Pedido">
                        <td colspan="16" class="expanded-row" style="background-color: #fff0f0;">
                          <div class="expanded-content" style="display: flex">
                            <table class="table table-sm FSIZE-PADRAO-TABLE" style="overflow-x: hidden; width: 100%; border: 2px 0px 0px 0px solid #000; border-collapse: collapse; z-index: 1">
                              
                              <thead class="BGC-cinza-secondary POSITION-sticky TOP-1px">
                                <tr>
                                  <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10">GUIA REMESSA</th>
                                  <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10">N° PEDIDO</th>
                                  <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10">CÓD. COMP.</th>
                                  <th style="background-color: #97b6b8" class="TEXTALI-left  WIDTH-60">DESC. COMP.</th>
                                  <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10">QUANTIDADE</th>
                                </tr>
                              </thead>
                              <LayoutTabelaCarregarEsqueleto
                                :Linhas="infoPedidosItensTabelaAreaCliente.length === 0 ? 4 : infoPedidosItensTabelaAreaCliente.length"
                                :Colunas=12 v-if="!mostrarTodosPedidosItensAreaCliente" />

                              <tbody>
                                <template v-for="(pedidoItem, j) in infoPedidosItensTabelaAreaCliente" :key="j">

                                  <tr :class="applyTableStipedRows(j)">
                                    <td class="TEXTALI-center WIDTH-10 no-wrap-text CTTABLEELPIS" style="background-color: #e0e0e0;">{{ pedidoItem.guiaRemessa }}</td>
                                    <td class="TEXTALI-center WIDTH-10 no-wrap-text CTTABLEELPIS" style="background-color: #e0e0e0;">{{ saida.cNumPedido }}</td>
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

                </tbody>
              </table>

            </div>

            <!-- RODAPÉ -->
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
                  {{ mostrarTodos ? `Ver menos...` : `Ver mais... (${infosTableSaidasSLA.length})` }}
                </button>
              </div>

              <div class="WIDTH-11"></div>

              <div class="WIDTH-5 FWEIGHT-bold FSIZE-PADRAO-TABLE"
                :style="{
                  paddingLeft: paddingTabela,
                  paddingRight: paddingTabela,
                  textAlign: 'right'
                }"
              >
                <span v-if="!tabelaSaidasCarregada" class="loading-dots"></span>
                <span v-else>{{ totalQuantidadeVolumesSaidas }}</span>
              </div>

              <!-- <div class="WIDTH-5 FWEIGHT-bold FSIZE-14px"
                :style="{
                  paddingLeft: paddingTabela,
                  paddingRight: paddingTabela,
                  textAlign: 'center'
                }"
              >
                <span v-if="!tabelaSaidasCarregada" class="loading-dots"></span>
                <span v-else>{{ totalQuantidadeItensSaidas  }}</span>
              </div> -->

              <div class="WIDTH-24"></div>

            </div>

          </div>

        </div>

        <!-- DIV BOTÕES - CORPO  -->
        <div class="D-flex ALITEM-center JC-center HEIGHT-6 WIDTH-98 BGC-cinza-9 MARGIN-T5 BOR-SensacaoAfundado PADDING-T5-R10-B5-L10" >
        
          <div class="WIDTH-100 HEIGHT-100 D-flex ALITEM-center JC-flex-end">
            <!-- cruzamento -->
            <!-- <button
              type="button"
              class="btn btn-azul-claro HEIGHT-100 D-flex JC-center ALITEM-center MARGIN-R5"
              @click="ToastWarning('CONSULTAR ENTREGAS: Em desenvolvimento')"
              >CONSULTAR ENTREGAS -->
              <!-- @click="IrParaRota(`/sla/informarEntregas`)" -->
            <!-- </button> -->

            <!-- cruzamento -->
            <!-- <button
              type="button"
              class="btn btn-azul-claro HEIGHT-100 D-flex JC-center ALITEM-center"
              @click="IrParaRota(`/sla/informarEntregas`)"
            >
              INFORMAR ENTREGAS
            </button> -->
          </div>

        </div>
        
      </div>
      
      <Rodape />

   </div>
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

  <!-- MODAL - ENTREGA -->
  <div class="modal fade" id="InfoEntregaModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="InfoEntregaModalLabel">
    <div class="modal-dialog modal-xl MIN-WIDTH-60">
      <div class="modal-content" id="modalTableClick">

        <!-- Cabeçalho MODAL -->
        <div class="d-flex justify-content-between align-items-center border-bottom p-2 HEIGHT-5vh" id="modal-header">	
          <!-- Logo -->
          <img 
            src="assets\images\Logo-E-azul-enhanced.png" 
            alt="Logo Grupo Embalarte" 
            class="WIDTH-2" 
            style="height: auto;" 
            title="Grupo Embalarte">

          <!-- Título -->
          <h1 class="modal-title fs-5 flex-grow-1 text-center" id="InfoEntregaModalLabel">
            INFORMAÇÕES ENTREGA • GUIA REMESSA: {{ cGuiaRemessaEntrega }}
          </h1>

          <!-- Botão Fechar -->
          <button title="Fechar (F4)" id="update-modal-close-button" 
            type="button" class="btn-close" aria-label="Close" @click="OnClickFecharModalInfoEntrega();"
          ></button>
        </div>

        <!-- Corpo MODAL -->
        <div class="HEIGHT-60vh D-flex JC-center ALITEM-center">
          <!-- INFOS -->
          <div class=" HEIGHT-100 WIDTH-25 D-flex FD-column JC-flex-start ALITEM-center PADDING-5">
            <!-- DATA FOTO -->  
            <div class="WIDTH-80 mb-2">
              <label
                id="componente-data-label"
                for="componente-data-input"
                class="form-label BGC-input-disabled FSIZE-12px BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
              >DATA ENTREGA</label>
              <input
                id="componente-data-input"
                type="text"
                disabled
                class="form-control InputUPPERCASE BOR-grey MARGIN-T-10 FSIZE-12px"
                v-model="infoEntregaResponseDTO.dEntregaInformada"
                >
            </div>

            <!-- NOME RECEBEDOR -->
            <div class="WIDTH-80 mb-2">
              <label
                id="nome-recebedor-label"
                for="nome-recebedor-input"
                class="form-label BGC-input-disabled FSIZE-12px BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
              >NOME RECEBEDOR</label>
              <input
                id="nome-recebedor-input"
                type="text"
                disabled
                class="form-control InputUPPERCASE BOR-grey MARGIN-T-10 FSIZE-12px"
                v-model="infoEntregaResponseDTO.cNomeRecebedor"
                >
            </div>

            <!-- DOC. RECEBEDOR -->
            <div class="WIDTH-80 mb-2">
              <label
                id="doc-recebedor-label"
                for="doc-recebedor-input"
                class="form-label BGC-input-disabled FSIZE-12px BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
              >DOC. RECEBEDOR</label>
              <input
                id="doc-recebedor-input"
                type="text"
                disabled
                class="form-control InputUPPERCASE BOR-grey MARGIN-T-10 FSIZE-12px"
                v-model="infoEntregaResponseDTO.cDocRecebedor"
                >
            </div>

            <!-- RESPONSÁVEL ENTREGA -->
            <div class="WIDTH-80 mb-2">
              <label
                id="componente-arquivo-label"
                for="componente-arquivo-input"
                class="form-label BGC-input-disabled FSIZE-12px BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
              >RESPONSÁVEL ENTREGA</label>
              <input
                id="componente-arquivo-input"
                type="text"
                disabled
                class="form-control InputUPPERCASE BOR-grey MARGIN-T-10 FSIZE-12px"
                v-model="infoEntregaResponseDTO.cNomeResponsavel"
                >
            </div>

            <!-- TRANSPORTADORA -->
            <div class="WIDTH-80 mb-2">
              <label
                id="componente-codigo-label"
                for="componente-codigo-input"
                class="form-label BGC-input-disabled FSIZE-12px BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
              >TRANSPORTADORA</label>
              <input
                id="componente-codigo-input"
                type="text"
                disabled
                class="form-control InputUPPERCASE BOR-grey MARGIN-T-10 FSIZE-12px"
                v-model="infoEntregaResponseDTO.cRazaoSocial"
                >
            </div>
          </div>

          <!-- FOTO -->
          <div class="HEIGHT-100 WIDTH-75 D-flex JC-center ALITEM-center BGC-cinza-9">
            <!-- carregando -->
            <p v-if="!infoEntregaCarregado">Carregando...</p>

            <!-- imagem -->
            <a
              v-else-if="infoEntregaResponseDTO?.imagemUrl"
              :href="infoEntregaResponseDTO.imagemUrlDownload"
              target="_blank"
              rel="noopener"
              class="TEXTDECO-none HEIGHT-100 WIDTH-100"
            >
              <img
                :src="infoEntregaResponseDTO.imagemUrl"
                alt="Imagem do componente"
                class="HEIGHT-100 WIDTH-100"
                style="
                  cursor: pointer;
                  object-fit: contain;
                "
              />
            </a>

            <!-- sem imagem -->
            <p v-else>Imagem não disponível</p>
          </div>
          
        </div>

      </div>
    </div>
  </div>



</template>

<style scoped>
  
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