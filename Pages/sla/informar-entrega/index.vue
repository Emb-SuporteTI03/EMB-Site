<script setup>
import axios from "axios";
import { shortenInfo, applyTableStipedRows } from '~/composables/visualization';
import { ToastSuccess, ToastError, ToastWarning } from '~/composables/toasts';
import { ref, nextTick } from 'vue'
import { toRaw } from 'vue';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'

const swiperModules = [Navigation, Pagination]
// VARIÁVEIS ------------------------------------------------------------------------------------------------------------

// Rota para obter o ID do cliente
const urlProd = useUrlProd();
const route = useRoute();
const idCliente = route.params.id;
const logoPath = `/CLIENTES/${idCliente}.png`;
const dataInicial = ref("")
const dataFinal = ref("")
dataInicial.value = new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0];
dataFinal.value = new Date().toISOString().split('T')[0];

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

// FUNÇÕES ---------------------------------------------------------------------------------------------------------------
// Computeds ----------------\
const notasFiscaisEscolhaFiltro = computed(() => {
  const unicos = new Set()
  infosTableEntradasSLA.value.forEach(e => {
    if (e.numeroNFE) {
      unicos.add(e.numeroNFE)
    }
  })
  return Array.from(unicos)
})
const tramitesEscolhaFiltro = computed(() => {
  const unicos = new Set()
  infosTableEntradasSLA.value.forEach(e => {
    if (e.idTramite) {
      unicos.add(e.idTramite)
    }
  })
  return Array.from(unicos)
})
const produtoEscolhaFiltro = computed(() => {
  const unicos = new Set()
  infosTableEntradasSLA.value.forEach(e => {
    if (e.codigoComponente) {
      unicos.add(e.codigoComponente)
    }
  })
  return Array.from(unicos)
})
const descProdutoEscolhaFiltro = computed(() => {
  return [...new Set(infosTableEntradasSLA.value.map(e => e.descricaoComponente))];
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
// --------------------------/

// FUNÇÕES DO FILTRO
const aplicarFiltrosSelect = () => {
  const remetente      = selectedRemetente.value?.cNmFantasia?.toLowerCase() || "";
  const transportadora = selectedTransportadora.value?.cNmFantasia?.toLowerCase() || "";
  const notaFiscal     = selectedNotaFiscal.value?.toLowerCase() || "";
  const tramite        = selectedTramite.value ? String(selectedTramite.value).toLowerCase() : "";
  const codProduto     = selectedCodProduto.value?.toLowerCase() || "";
  const descProduto    = selectedDescProduto.value?.toLowerCase() || "";

  console.log("Aplicando filtros:", {
    remetente,
    transportadora,
    notaFiscal,
    tramite,
    codProduto,
    descProduto,
    dataInicial: dataInicial.value,
    dataFinal: dataFinal.value
  });

  infosTableEntradasSLA.value = staticInfosTableEntradasSLA.value.filter(comp => {
    // Validação de datas (comp.dataTramite vem como dd/MM/yyyy)
    let dentroIntervalo = true;
    if (comp.dataTramite && dataInicial.value && dataFinal.value) {
      const [dia, mes, ano] = comp.dataTramite.split("/");
      const dataItem = new Date(`${ano}-${mes}-${dia}`); // normaliza para yyyy-MM-dd
      const inicio = new Date(dataInicial.value);
      const fim    = new Date(dataFinal.value);

      dentroIntervalo = dataItem >= inicio && dataItem <= fim;
    }

    return (
      (remetente      ? comp.remetente?.cNmFantasia?.toLowerCase().includes(remetente) : true) &&
      (transportadora ? comp.transportadora?.cNmFantasia?.toLowerCase().includes(transportadora) : true) &&
      (notaFiscal     ? comp.numeroNFE?.toLowerCase().includes(notaFiscal) : true) &&
      (tramite        ? String(comp.idTramite || comp.IDTramite || "")
                          .toLowerCase()
                          .includes(tramite) : true) &&
      (codProduto     ? comp.codigoComponente?.toLowerCase().includes(codProduto) : true) &&
      (descProduto    ? comp.descricaoComponente?.toLowerCase().includes(descProduto) : true) &&
      dentroIntervalo
    );
  });
};
const aplicarFiltrosInput = () => {
  const query = queryInfAdc.value.trim().toLowerCase();

  infosTableEntradasSLA.value = staticInfosTableEntradasSLA.value.filter(comp => {
    return (
      (query ? (comp.idTramite           || "").toLowerCase().includes(query) : true) || 
      (query ? (comp.protocoloProduto    || "").toLowerCase().includes(query) : true) || 
      (query ? (comp.numeroNFE           || "").toLowerCase().includes(query) : true) ||
      (query ? (comp.codigoComponente    || "").toLowerCase().includes(query) : true) ||
      (query ? (comp.descricaoComponente || "").toLowerCase().includes(query) : true) ||
      (query ? (comp.familia             || "").toLowerCase().includes(query) : true) ||
      (query ? (comp.adicionaisProduto   || "").toLowerCase().includes(query) : true)
    );
  });
};

// REQUISIÇÕES
async function getInfosEntradasSLA() {
  try {
    tabelaENTRADASCarregada.value = false;

    const response = await axios.get(`${urlProd.value}/consultas-sla/sla-entradas/${idCliente}`, {});

    infosTableEntradasSLA.value = response.data;
    staticInfosTableEntradasSLA.value = response.data;

    tabelaENTRADASCarregada.value = true;
  } catch (response) {
    console.error("Erro ao buscar dados:");
  }
}
async function getImagemTramiteAssinatura(tramiteId) {
  try {
    const response = await axios.get(`${urlProd.value}/estoque/foto-componente/get-foto-assinatura-tramite/${tramiteId}`);

    if (Array.isArray(response.data)) {
      // Cada base64 vira uma data URL
      imagensAssinatura = response.data.map(base64 => `data:image/jpeg;base64,${base64}`);
      imagensTramite = response.data.map(base64 => `data:image/jpeg;base64,${base64}`);
    } else {
      ToastWarning('Formato de resposta inesperado.');
    }
  } catch (error) {
    // console.error('Erro ao buscar imagens:', error);
  }
};
async function getImagemTramite(tramiteId) {
  try {
    const response = await axios.get(`${urlProd.value}/estoque/foto-componente/get-foto-carga-tramite/${tramiteId}`);

    if (Array.isArray(response.data)) {
      // Cada base64 vira uma data URL
      // Adiciona cada imagem sem apagar as anteriores
      response.data.forEach(base64 => {
        imagensCarga = response.data.map(base64 => `data:image/jpeg;base64,${base64}`);
        imagensTramite.push(`data:image/jpeg;base64,${base64}`);
      });
    } else {
      ToastWarning('Formato de resposta inesperado.');
    }
  } catch (error) {
    // console.error('Erro ao buscar imagens:', error);
  }
};
async function getItensTramite(idTramite) {
  tabelaTRAMITEsCarregada.value = false

  try {
    const result = await GetGenerico(`${urlProd.value}/estoque/tramite-item/de-um-pai-com-join/${idTramite}`)

    // garante que seja sempre array
    itensTramiteStatic.value = Array.isArray(result) ? result : []

    // ordena o array
    itensTramiteStatic.value.sort((a, b) => a.iD_Tramite_FILHO - b.iD_Tramite_FILHO)

    // atualiza itensTramite
    itensTramite.value = [...itensTramiteStatic.value]

    // tabela carregada com sucesso
    tabelaTRAMITEsCarregada.value = true

    // força o scroll para o final da div
    await nextTick()
    const el = document.querySelector('#tabelaContainer') // ou use ref
    if (el) el.scrollTop = el.scrollHeight

  } catch (error) {
    console.error('Erro ao obter itens do trâmite:', error)
    // opcional: mostrar toast ou mensagem para o usuário
    ToastError('Falha ao carregar os itens do trâmite.')
    tabelaTRAMITEsCarregada.value = false
  }
};
async function fetchPDFPreVisualizar () {
  isLoadingPDF.value = true;
  try {
    const res = await axios.get(`${urlProd.value}/estoque/tramite/PDF-recebimento/${tramiteModal.iD_Tramite}`,
    {
      headers: {
        "Content-Type": "application/pdf"
      },
      responseType: 'blob'
    });

    return res.data;
  } catch (error) { console.error(error); }
  finally {
    setTimeout(() => {
      isLoadingPDF.value = false;
      
    }, 1500);
  }
};
async function fetchEXCELEntradasSLA() {
  isLoadingEXCELRelatorio.value = true;
  try {
    // Garante array puro
    const payload = Array.isArray(infosTableEntradasSLA.value)
      ? toRaw(infosTableEntradasSLA.value)
      : [toRaw(infosTableEntradasSLA.value)];

    const url = `${urlProd.value}/consultas-sla/sla-entradas-excel`; // <-- .value aqui!

    const response = await axios.post(
      url,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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
    let fileName = 'SLA_ENTRADAS.xlsx';
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
}
async function fetchPDFEntradasSLA() {
  isLoadingPDFRelatorio.value = true;
  try {
    // Garante array puro
    const payload = Array.isArray(infosTableEntradasSLA.value)
      ? toRaw(infosTableEntradasSLA.value)
      : [toRaw(infosTableEntradasSLA.value)];

    const url = `${urlProd.value}/consultas-sla/sla-entradas-pdf`; // <-- endpoint do PDF

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
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
    let fileName = 'SLA_ENTRADAS.pdf';
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
}



// FUNÇÕES DO MODAL
async function AbrirModalDetalhesTramite(idTramite) {

  const response = await axios.get(`${urlProd.value}/estoque/tramite/com-join/${idTramite}`, {});
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
const OnChangeDataInicio = () => {
  if (dataInicial.value && dataFinal.value && new Date(dataInicial.value) > new Date(dataFinal.value)) {
    ToastWarning("A data inicial não pode ser maior que a final!")
    dataInicial.value = dataFinal.value
    aplicarFiltrosSelect()
  } else {
    aplicarFiltrosSelect()
  }
};
const OnChangeDataFinal = () => {
  if (dataInicial && dataFinal && new Date(dataFinal) < new Date(dataInicial)) {
    ToastWarning("A data final não pode ser menor que a inicial!");
    dataFinal = dataInicial; // volta para o valor antigo
    aplicarFiltrosSelect()
  } else {
    aplicarFiltrosSelect();
  }
};
let onClickLimparFiltros = () => {
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

  infosTableEntradasSLA.value = staticInfosTableEntradasSLA.value;
  aplicarFiltrosSelect();
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
  await getInfosEntradasSLA();
  aplicarFiltrosSelect();
});

</script>


<template>
  <main class="D-flex">

    <!-- Todo o Conteúdo da página -->
    <div class="D-flex FD-column WIDTH-100 HEIGHT-100vh OFLOW-auto">

      <!-- Menu Superior -->
      <SLAMenuSuperior 
        funcionalidadeProp="INFORMAR ENTREGA"
        :destinoVoltarProp="`/sla/cliente/${idCliente}/home`"
        :srcFoto="logoPath"
      />
      
      <!-- ESPAÇO CORPO -->
      <div class="D-flex FD-column HEIGHT-90vh WIDTH-100 JC-center ALITEM-center BGC-cinza-9 BOR-branca">
        <div class="D-flex FD-column ALITEM-center JC-center HEIGHT-95 WIDTH-98 BORRAD-5 BGC-branco PADDING-T5-B10">

            <!-- Filtros -->
            <div class="D-flex JC-space-between HEIGHT-30 WIDTH-98 mb-1">
              <!-- DIV esquerda -->
              <div class="D-flex WIDTH-70 JC-space-between">
                
                <!-- Decoração FILTROS -->
                <div class="WIDTH-10 BGC-azul-esverdeado COLOR-white ALITEM-center BORRAD-5 FWEIGHT-bold D-flex FD-column JC-space-between">
                  <p>Filtros</p>
                  <button type="button" class="btn btn-dark WIDTH-75 FSIZE-12px mb-1" @click="onClickLimparFiltros">Limpar</button>
                </div>

                <!-- Inputs de Filtro + Toggle de Estado do material -->
                <div class="D-flex WIDTH-89 BORRAD-5 MARGIN-T-7">
                  <!-- Inputs de Filtro -->
                  <div class="WIDTH-100">
                  <!-- OFLOW-Y-scroll -->

                    <!-- Escolha Data inicial e Final -->
                    <div class="row">

                      <!-- Filtro de datas -->
                      <div class="WIDTH-40 D-flex JC-flex-start ALITEM-center MARGIN-T10">
                  
                        <div class="WIDTH-35 MARGIN-T-13 mb-1">
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
                            class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold PADDING-R5-L5"
                            style="margin-top: 1.5%;"
                          >A</div>

                        <div class="WIDTH-35 MARGIN-T-13 mb-1" style="margin-right: 2px;">
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
                      
                    </div>

                    <!-- Depositante, Remetente e Transportadora -->
                    <div class="row D-flex">

                      <!-- Remetente -->
                      <BasicElementVue3SelectPequeno
                        :options="remetentesUnicos"
                        optionLabel="idCarteira_cNmFantasia_CPFCNPJ"
                        v-model="selectedRemetente"

                        label="REMETENTE:"
                        class="col-4"
                        :titulo="selectedTransportadora?.idCarteira_cNmFantasia_CPFCNPJ"

                        @update:modelValue="aplicarFiltrosSelect"

                        :divClass="'MARGIN-T21'"
                        :selectClass="''"
                        :labelClass="'FSIZE-12px red-asterisk MARGIN-T-15'"
                        :widthLista="'500px'"
                      />

                      <!-- Transportadora -->
                      <BasicElementVue3SelectPequeno
                        

                        :options="transportadorasUnicas"
                        optionLabel="idCarteira_cNmFantasia_CPFCNPJ"
                        v-model="selectedTransportadora"

                        @update:modelValue="aplicarFiltrosSelect"
                        
                        label="TRANSPORTADORA:"
                        class="col-4"
                        :titulo="selectedTransportadora?.idCarteira_cNmFantasia_CPFCNPJ"

                        :divClass="'MARGIN-T21'"
                        :selectClass="''"
                        :labelClass="'FSIZE-12px red-asterisk MARGIN-T-15'"
                        :widthLista="'500px'"
                      />

                    </div>

                    <!-- Descrição e LOTE -->
                    <div class="row">

                      <!-- Nota Fiscal -->
                      <BasicElementVue3SelectPequeno
                        

                        :options="notasFiscaisEscolhaFiltro"
                        v-model="selectedNotaFiscal"
                        
                        label="NOTA FISCAL:"
                        class="col-2"
                        :titulo="selectedNotaFiscal"

                        @update:modelValue="aplicarFiltrosSelect"

                        :divClass="'MARGIN-T21'"
                        :selectClass="''"
                        :labelClass="'FSIZE-12px red-asterisk MARGIN-T-15'"
                        :widthLista="'75px'"
                      />

                      <!-- Trâmite -->
                      <BasicElementVue3SelectPequeno
                        

                        :options="tramitesEscolhaFiltro"
                        v-model="selectedTramite"

                        @update:modelValue="aplicarFiltrosSelect"
                        
                        label="TRÂMITE:"
                        class="col-2"
                        :titulo="selectedTramite"

                        :divClass="'MARGIN-T21'"
                        :selectClass="''"
                        :labelClass="'FSIZE-12px red-asterisk MARGIN-T-15'"
                        :widthLista="'75px'"
                      />

                      <!-- Codigo produto -->
                      <BasicElementVue3SelectPequeno
                        

                        :options="produtoEscolhaFiltro"
                        v-model="selectedCodProduto"

                        @update:modelValue="aplicarFiltrosSelect"
                        
                        label="COD. PRODUTO:"
                        class="col-2"
                        :titulo="selectedCodProduto"

                        :divClass="'MARGIN-T21'"
                        :selectClass="''"
                        :labelClass="'FSIZE-12px red-asterisk MARGIN-T-15'"
                        :widthLista="'120px'"
                      />
                                          
                      <!-- Descrição produto -->
                      <BasicElementVue3SelectPequeno
                        

                        :options="descProdutoEscolhaFiltro"
                        v-model="selectedDescProduto"

                        @update:modelValue="aplicarFiltrosSelect"
                        
                        label="DESCRIÇÃO DO PRODUTO:"
                        class="col-6"
                        :titulo="selectedDescProduto"

                        :divClass="'MARGIN-T21'"
                        :selectClass="''"
                        :labelClass="'FSIZE-12px red-asterisk MARGIN-T-15'"
                        :widthLista="'500px'"
                      /> 

                    </div>

                    <!-- EDIÇÃO -->
                    <div class="row">
                      
                      <!-- INFORMAÇÃO ADICIONAL -->
                      <div class="col-12 WIDTH-99">
                        <label
                          id="infAdc-label"
                          for="infAdc-input"
                          class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-enabled red-asterisk"
                        >INFORMAÇÃO ADICIONAL</label>
                        <input
                          autocomplete="off"
                          @keyup="aplicarFiltrosInput()"
                          id="infAdc-input"
                          v-model="queryInfAdc"
                          type="text"
                          class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE"
                          :title="queryInfAdc">
                      </div>
                      
                    </div>

                  </div>

                </div>

              </div>

              <!-- DIV direita -->
              <div class="D-flex FD-column WIDTH-20 BOR-L-solidgrey ALITEM-center">

                <!-- Botões -->
                <div class="HEIGHT-100 D-flex JC-flex-end ALITEM-flex-end WIDTH-100">
                  
                  <!-- Botões de EXPORTAR -->
                  <div>
                    <button id="exportar-EXCEL-button" type="button" class="btn btn-success MARGIN-R5 FSIZE-14px" @click="fetchEXCELEntradasSLA()" :disabled="isLoadingEXCELRelatorio || isLoadingPDFRelatorio">
                      <IconsExcel corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                      Exportar EXCEL</button>
                      
                      <button id="exportar-PDF-button" type="button" class="btn btn-warning FSIZE-14px" @click="fetchPDFEntradasSLA()" :disabled="isLoadingPDFRelatorio || isLoadingEXCELRelatorio">
                        <IconsPDF corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                        Exportar PDF
                      </button>
                  </div>

                </div>

              </div>
            </div>

            <!-- Tabela -->
            <div class="OFLOW-auto WIDTH-98 HEIGHT-70 BOR-SensacaoAfundado mb-1">
            
              <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5 table-fixed">
                <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                  <tr>
                    <th class="WIDTH-3 TEXTALI-center" scope="col"></th>
                    <th class="WIDTH-7 TEXTALI-center" scope="col">Data</th>
                    <th class="WIDTH-6 TEXTALI-center" scope="col">Tramite</th>
                    <th class="WIDTH-7 TEXTALI-center" scope="col">Protocolo</th>
                    <th class="WIDTH-8 TEXTALI-center" scope="col">NF</th>
                    <th class="WIDTH-10 TEXTALI-center" scope="col">Código</th>
                    <th class="WIDTH-30 TEXTALI-center" scope="col">Descrição do Produto</th>
                    <th class="WIDTH-13 TEXTALI-center" scope="col">Família</th>
                    <th class="WIDTH-10 TEXTALI-center" scope="col">Adicionais</th>
                    <th class="WIDTH-6 TEXTALI-center" scope="col">Quant.</th>
                  </tr>
                </thead>
                <LayoutTabelaCarregarEsqueleto v-if="!tabelaENTRADASCarregada"
                  :Linhas="12" :Colunas="10" />
                
                  <tbody v-if="tabelaENTRADASCarregada" class="BORRAD-5">
                  <tr
                    v-for="(entrada, i) in infosTableEntradasSLA" :key="i"
                    class="BGC-H-cinza-8 HEIGHT-5px CURSOR-pointer"
                    :class="applyTableStipedRows(i)"
                    >
                      <td class="HEIGHT-5px WIDTH-3 TEXTALI-center" scope="row" :title="entrada.dataTramite" >
                        <button type="button" class="in-table-button" title="Visualizar detalhes do Trâmite" @click="AbrirModalDetalhesTramite(entrada.idTramite)">
                          <IconsLupa corProp="currentColor" alturaProp="1" larguraProp="1"/>  
                        </button>
                      </td>
                      <td class="HEIGHT-5px WIDTH-7 TEXTALI-center" scope="row" :title="entrada.dataTramite" >{{ entrada.dataTramite }}</td>
                      <td class="HEIGHT-5px WIDTH-6 TEXTALI-center" :title="entrada.idTramite" >{{ entrada.idTramite }}</td>
                      <td class="HEIGHT-5px WIDTH-7 TEXTALI-left" :title="entrada.protocoloProduto" >{{ entrada.protocoloProduto }}</td>
                      <td class="HEIGHT-5px WIDTH-8 TEXTALI-center" :title="entrada.numeroNFE" >{{ entrada.numeroNFE }}</td>
                      <td class="HEIGHT-5px WIDTH-10 TEXTALI-center" :title="entrada.codigoComponente" >{{ entrada.codigoComponente }}</td>
                      <td class="HEIGHT-5px WIDTH-30 TEXTALI-left ellipsisTable" :title="entrada.descricaoComponente" >{{ entrada.descricaoComponente }}</td>
                      <td class="HEIGHT-5px WIDTH-13 TEXTALI-left" :title="entrada.familia" >{{ entrada.familia }}</td>
                      <td class="HEIGHT-5px WIDTH-10 TEXTALI-left ellipsisTable" :title="entrada.adicionaisProduto" >{{ entrada.adicionaisProduto }}</td>
                      <td class="HEIGHT-5px WIDTH-6 TEXTALI-center">{{ entrada.quantidadeComponente }}</td>
                  </tr>
                </tbody>
              </table>

            </div>
            <div class="WIDTH-98">
              <button @click="toggleVerMais()" class="btn btn-secondary WIDTH-100 FSIZE-14px">
                {{ mostrarTodos ? `Ver menos...` : `Ver mais... (${2})` }}
              </button>
            </div>

        </div>
      </div>
      
      <Rodape />

   </div>
  </main>

</template>