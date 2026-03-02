<script setup>
import axios from "axios";
import { ref } from "vue";
import { shortenInfo, applyTableStipedRows, GetGenerico } from '~/composables/visualization';
import { ToastSuccess, ToastError, ToastWarning } from '~/composables/toasts';
import { useAuthStore } from '~/stores/auth';
// INTERFACEs: -----------------------------------------------------------------------------------\
// interface ConsultaLRsClienteResponseDTO {
//   ID_LR: number;
//   ID_Tramite: number;
//   dDataTramite: string; // DateTime do backend
//   ID_Tramite_Item: number;
//   cProtocoloProduto: string;
//   cNumNFE: string;
//   cAdicionaisProduto: string;
//   cInfoGenerica: string;
//   iQtdeItens: number;
//   cQtdeItens: string;
// }

// interface BipagemHistoricoLRConsultaClienteResponseDTO {
//   ID_Bipagem_LR_Historico: number;
//   dDataBipagem: string; // DateTime do backend
//   ID_LR: number;
//   ID_EstadoMaterial: number;
//   cEstadoMaterial: string;
//   iQuantidade: number;
//   ID_Componente: number;
//   cCodComponente: string;
//   cDescricao: string;
// }

// -----------------------------------------------------------------------------------------------/


// VARIÁVEIS ------------------------------------------------------------------------------------------------------------

// Rota para obter o ID do cliente
const urlProd = useUrlProd();
const urlSistema = useUrlProdSistema();
const route = useRoute();

const authStore = useAuthStore();
const userID = ref(authStore.idUsuario ?? 0);
// const userID_Unidade = ref(authStore.ID_Unidade).value;
// const userNome = ref(authStore.nome);
// const siglaUsuario = ref(authStore.sigla);
// const ID_Area = ref(authStore.ID_Unidade ?? 0);
const ID_Carteira = ref(authStore.idCarteira ?? 0);
const token = ref(authStore.token ?? "");

const logoPath = `/CLIENTES/${ID_Carteira.value}.png`;
const dataInicial = ref(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);
const dataFinal = ref(new Date().toISOString().split('T')[0]);
const tabelaLRCarregada = ref(false);

const infoLrs = ref([]);
const infoLrsStatic = ref([]); // Para manter os dados originais e poder limpar os filtros

const infoHistBipagensLR = ref([]);
const cliente = ref({});

const selectedCK = ref(null);
const selectedDestinatario = ref(null);
const selectedUF = ref(null);
const selectedNotaFiscal = ref(null);
const selectedPedido = ref(null);
const selectedGuiaRemessa = ref(null);
const selectedTramite = ref(null);
const selectedStatus = ref(null);
const selectedTransportadora = ref(null); 
const selectedDadosGerais = ref(null); 
const selectedTipoPedido = ref(null);

const infosEtapasSistemicas = ref([]);

const isLoadingEXCELRelatorio = ref(false);
const isLoadingPDFRelatorio = ref(false);

const mostrarTodos = ref(false);
const linhaExpandidaDaTabelaLRs = ref(0);
const infoComponenteCarregada = ref(false);
const infoComponente = ref({
  dData: '',
  iQuantidade: 0,
  cObservacao: '',
  cNomeFoto: '',
  cCodComponente: '',
  imagemUrl: null,
  imagemUrlDownload: null
});


// FUNÇÕES ---------------------------------------------------------------------------------------------------------------
// Computeds ----------------\
const lrsUnicas = computed(() => {
  if (!infoLrs.value) return []
  return [...new Set(infoLrs.value.map(e => e.cLR))]
    .filter(Boolean) // tira undefined/nulos
    .map(c => ({ label: c, value: c }))
})
const notasFiscaisUnicas = computed(() => {
  if (!infoLrs.value) return []
  return [...new Set(infoLrs.value.map(e => e.cNumNFE))]
    .filter(Boolean) // tira undefined/nulos
    .map(c => ({ label: c, value: c }))
})
const tramitesUnicos = computed(() => {
  if (!infoLrs.value) return []
  return [...new Set(infoLrs.value.map(e => e.cTramite))]
    .filter(Boolean) // tira undefined/nulos
    .map(c => ({ label: String(c), value: c }))
})
const transportadorasUnicas = computed(() => {
  if (!infoLrs.value) return []
  return [...new Set(infoLrs.value.map(e => e.cTransportadora))]
    .filter(Boolean) // tira undefined/nulos
    .map(c => ({ label: c, value: c }))
})
const dadosGeraisUnicos = computed(() => {
  if (!infoLrs.value) return []
  return [...new Set(infoLrs.value.map(e => e.cInfoGerais))]
    .filter(Boolean) // tira undefined/nulos
    .map(c => ({ label: c, value: c }))
})
const infoLrsSlice = computed(() => {
  return mostrarTodos.value
    ? infoLrs.value
    : infoLrs.value.slice(0, 50)
});
// --------------------------/
// MODAL 
async function abrirModalEtapasSistema (idPedido) {
  const modal = new bootstrap.Modal(document.getElementById('EtapasSistemaModal'));
  modal.show();

  await getEtapasSistemicas(idPedido);
}
const fecharModalEtapasSistema = () => {
  const modal = bootstrap.Modal.getInstance(document.getElementById('EtapasSistemaModal'));
  if (modal) modal.hide();
}

// FUNÇÕES DO FILTRO
const aplicarFiltros = () => {
  const normalize = (val) => val != null ? val.toString().toLowerCase() : "";

  const lr             = normalize(selectedCK.value?.value ?? selectedCK.value);
  const notaFiscal     = normalize(selectedNotaFiscal.value?.value ?? selectedNotaFiscal.value);
  const tramite        = normalize(selectedTramite.value?.value ?? selectedTramite.value);
  const transportadora = normalize(selectedTransportadora.value?.value ?? selectedTransportadora.value);
  const dadosGerais    = normalize(selectedDadosGerais.value?.value ?? selectedDadosGerais.value);


  infoLrs.value = infoLrsStatic.value.filter(comp => {
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
      (lr             ? normalize(comp.cLR).includes(lr) : true) &&
      (notaFiscal     ? normalize(comp.cNumNFE).includes(notaFiscal) : true) &&
      (tramite        ? normalize(comp.cTramite).includes(tramite) : true) &&
      (transportadora ? normalize(comp.cTransportadora).includes(transportadora) : true) &&
      (dadosGerais    ? normalize(comp.cInfoGerais).includes(dadosGerais) : true) &&
      dentroIntervalo
    );
  });
};

// REQUISIÇÕES
async function getTransportadorasApenasSLA() {
  cliente.value = await GetGenerico(`${urlSistema.value}/carteira/com-join/${ID_Carteira.value}`,
    {}, token.value
  );
};

const FetchInfoLRs = async () => {
  try {
    tabelaLRCarregada.value = false;
    const url = `${urlProd}/sla/bipagem-lr/all-lrs-finalizadas/${ID_Carteira.value}/${dataInicial.value}/${dataFinal.value}`;
    
    const response = await axios.get(url,
      { headers: { Authorization: `Bearer ${token.value}` } }
    );

    infoLrs.value = response.data;
    infoLrsStatic.value = response.data;

    aplicarFiltros();
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  } finally {
    tabelaLRCarregada.value = true;
  }
};

const FetchHistoricoBipagensLR = async () => {
  try {
    const url = `${urlProd}/sla/bipagem-lr/bipagem-historico-tram-item/${linhaExpandidaDaTabelaLRs.value}`;
    
    const response = await axios.get(url,
      { headers: { Authorization: `Bearer ${token.value}` } }
    );

    infoHistBipagensLR.value = response.data;

  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  } finally {
  }
};
async function getEtapasSistemicas(idPedido) {
  try {
    const response = await axios.get(`${urlProd}/consultas-sla/etapas-sistemicas/${idPedido}`,
      {},
      { headers: { Authorization: `Bearer ${token.value}` } }
    );
    
    infosEtapasSistemicas.value = response.data;

  } catch (response) {
    console.error("Erro ao buscar dados:");
  }
}
async function FetchEXCEL_ResultadoLR() {
  // https://localhost:7116/api/sla/qualidade-lr/resultado-lr-EXCEL

  ToastWarning('Baixando EXCEL...');
  isLoadingEXCELRelatorio.value = true;
  try {
    // Garante array puro:
    const payload = Array.from(
      new Set((Array.isArray(infoLrs.value) ? infoLrs.value : [infoLrs.value])
          .map(x => x.iD_LR)));


    const url = `${urlProd}/sla/qualidade-lr/resultado-lr-EXCEL`;

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
    let fileName = `LOG_REVERSA_${cliente.value.cNmFantasia}.xlsx`;
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

    ToastSuccess('EXCEL baixado com sucesso');


  } catch (error) {
    console.error('Erro ao gerar Excel:', error);
    ToastError('Erro ao baixar EXCEL');

  } finally {
    isLoadingEXCELRelatorio.value = false;
  }
};
async function FetchPDF_ResultadoLR() {
  ToastWarning('PDF em desenvolvimento');
  
  return;
  
  ToastWarning('Baixando PDF...');
  isLoadingPDFRelatorio.value = true;
  try {
    // Garante array puro
    const payload = Array.isArray(infoLrs.value)
      ? toRaw(infoLrs.value)
      : [toRaw(infoLrs.value)];

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
    let fileName = 'LOG_REVERSA.pdf';
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
const OnChangeDataInicio = async () => {
  if (dataInicial.value && dataFinal.value &&
    new Date(dataInicial.value) > new Date(dataFinal.value)
  ) {
    ToastWarning("A data inicial não pode ser maior que a final!");
    dataInicial.value = dataFinal.value;
  }

  await FetchInfoLRs();
};

const OnChangeDataFinal = async () => {
  if (dataInicial.value && dataFinal.value &&
    new Date(dataFinal.value) < new Date(dataInicial.value)
  ) {
    ToastWarning("A data final não pode ser menor que a inicial!");
    dataFinal.value = dataInicial.value;
  }

  await FetchInfoLRs();
};

let onClickLimparFiltros = () => {
  dataInicial.value = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
  dataFinal.value = new Date().toISOString().split('T')[0];

  selectedCK.value = null;
  selectedNotaFiscal.value = null;
  selectedTramite.value = null;
  selectedTransportadora.value = null;
  selectedDadosGerais.value = null;

  infoLrs.value = infoLrsStatic.value;
  aplicarFiltros();
};
const toggleVerMais = () => {
  mostrarTodos.value = !mostrarTodos.value;
}

// GERAL
const ativarSubLinhaLRs = async (ID_Tramite_Item) => {
  if (linhaExpandidaDaTabelaLRs.value === ID_Tramite_Item) {
    // Fecha:
    linhaExpandidaDaTabelaLRs.value = null;
  } else {
    linhaExpandidaDaTabelaLRs.value = ID_Tramite_Item;
    await FetchHistoricoBipagensLR(ID_Tramite_Item);
  }
};
const aplicaCorAoEstado = (estado) => {
  if (estado === 'BOM') {
    return 'BGC-verde-5 COLOR-green';
  } else {
    return 'BGC-vermelho-5 COLOR-red';
  }
};
const aplicaCorAoEstadoStyle = (estado) => {
  if (estado === 'BOM') {
    return {
      backgroundColor: 'rgba(0, 177, 64, 0.4)',
      color: '#006B2E' // verde escuro
    };
  }

  return {
    backgroundColor: 'rgba(228, 28, 56, 0.4)',
    color: '#8B0000' // vermelho escuro
  };
};
const OnClickLupaVerComponente = async (ID_LR, ID_Componente) => {
  // Abre o modal:
  showModal('FotoComponenteModal', true);

  // Busca a foto do componente:
  infoComponente.value = await GetImagemComponente(ID_LR, ID_Componente);
};
const GetImagemComponente = async (ID_LR, ID_Componente) => {
  infoComponenteCarregada.value = false;

  try {
    const url = `${urlProd}/sla/bipagem-lr/qualidade-lr-foto-componente/${ID_LR}/${ID_Componente}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token.value}` }
    });

    if (!response?.data?.foto) return null;

    const dto = response.data;

    // Base64 → Blob
    const byteCharacters = atob(dto.foto);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // URL real (blob:)
    const blobUrl = URL.createObjectURL(blob);

    return {
      dData: dto.dData,
      iQuantidade: dto.iQuantidade,
      cObservacao: dto.cObservacao,
      cNomeFoto: dto.cNomeFoto,
      cCodComponente: dto.cCodComponente,
      imagemUrl: blobUrl,        // usada no <img>
      imagemUrlDownload: blobUrl // usada no <a target="_blank">
    };
  } catch (error) {
    console.error('Erro ao recuperar dados do componente:', error);
    return null;
  } finally {
    infoComponenteCarregada.value = true;
  }
};

const OnClickFecharModalFotoComponente = () => {
  showModal('FotoComponenteModal', false);

};


// MOUNTED DA PÁGINA
onMounted(async () => {
  await getTransportadorasApenasSLA();
  await FetchInfoLRs();
});

</script>


<template>
  
  <!-- layout main da página -->
  <main class="D-flex">

    <!-- Todo o Conteúdo da página -->
    <div class="D-flex FD-column WIDTH-100 HEIGHT-100vh OFLOW-auto">

      <!-- Menu Superior -->
      <SetorProducaoSLAMenuSuperior 
        funcionalidadeProp="LOGÍSTICA REVERSA"
        :destinoVoltarProp="`/sla`"
        :srcFoto="logoPath"
      />
      
      <!-- ESPAÇO CORPO -->
      <div class="D-flex FD-column HEIGHT-90vh WIDTH-100 JC-center ALITEM-center BGC-cinza-9 BOR-branca">
        <div class="D-flex FD-column ALITEM-center JC-center HEIGHT-95 WIDTH-98 BORRAD-5 BGC-branco PADDING-T5-B10">

          <!-- Filtros -->
          <div class="D-flex JC-space-between HEIGHT-30 WIDTH-98 mb-1">

            <div class="D-flex WIDTH-100 JC-space-between">
              
              <!-- Decoração FILTROS -->
              <div class="WIDTH-6 BGC-azul-esverdeado COLOR-white ALITEM-center BORRAD-5 FWEIGHT-bold D-flex FD-column JC-space-between">
                <p>Filtros</p>
                <button type="button" class="btn btn-dark WIDTH-75 FSIZE-12px mb-1" @click="onClickLimparFiltros">Limpar</button>
              </div>

              <!-- DIV CENTRAL 1 -->
              <div class="D-flex WIDTH-25  FD-column PADDING-T5-R5-B5-L10">

                <!-- Filtro de DATAS -->
                <div class="WIDTH-98-5 D-flex JC-space-between ALITEM-center MARGIN-T13">
            
                  <div class="WIDTH-45 MARGIN-T-13 mb-1">
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
                    style="margin-top: 1.5%;"
                  >A</div>

                  <div class="WIDTH-45 MARGIN-T-13 mb-1" style="margin-right: 2px;">
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

                <!-- DADOS GERAIS -->
                <BasicElementVue3SelectPequeno
                  
                  :options="dadosGeraisUnicos"
                  v-model="selectedDadosGerais"
                  
                  label="DADOS GERAIS"
                  class="col-4"
                  :titulo="selectedDadosGerais ? selectedDadosGerais.label : ''"


                  @update:modelValue="aplicarFiltros"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px   MARGIN-T-15-L-5'"
                  :widthLista="''"

                  option-label="label"
                  option-value="value"
                />

                <div class="WIDTH-100 D-flex JC-space-between ALITEM-center">
                  <!-- LR -->
                  <BasicElementVue3SelectPequeno
                    :options="lrsUnicas"
                    v-model="selectedCK"
                    
                    label="LR"
                    :titulo="selectedCK ? String(selectedCK.label) : ''"

                    @update:modelValue="aplicarFiltros"

                    :divClass="'MARGIN-T21 WIDTH-32'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px   MARGIN-T-15-L-5'"
                    :widthLista="''"

                    option-label="label"
                    option-value="value"
                  />

                  <!-- TRÂMITE -->
                  <BasicElementVue3SelectPequeno
                    v-model="selectedTramite"
                    :options="tramitesUnicos"

                    @update:modelValue="aplicarFiltros"
                    
                    label="TRÂMITE"
                    :titulo="selectedTramite?.label"

                    :divClass="'MARGIN-T21 WIDTH-32'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px   MARGIN-T-15-L-5'"
                    :widthLista="''"

                    
                    option-label="label"
                    option-value="value"
                  />

                  <!-- NOTA FISCAL -->
                  <BasicElementVue3SelectPequeno
                    :options="notasFiscaisUnicas"
                    v-model="selectedNotaFiscal"
                    
                    @update:modelValue="aplicarFiltros"
                    
                    label="N. FISCAL"
                    :titulo="selectedNotaFiscal ? selectedNotaFiscal.label : ''"
  
  
                    :divClass="'MARGIN-T21 WIDTH-32'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px   MARGIN-T-15-L-5'"
                    :widthLista="''"
  
                    option-label="label"
                    option-value="value"
                  />

                </div>

              </div>

              <!-- DIV CENTRAL 2 -->
              <div class="D-flex WIDTH-25 FD-column PADDING-T5-R5-B5-L10 BOR-L-solidgrey-1">
                <!-- TRANSPORTADORA -->
                <BasicElementVue3SelectPequeno
                  
                  :options="transportadorasUnicas"
                  v-model="selectedTransportadora"
                  
                  label="TRANSPORTADORA"
                  class="col-4"
                  :titulo="selectedTransportadora ? selectedTransportadora.label : ''"


                  @update:modelValue="aplicarFiltros"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px   MARGIN-T-15-L-5'"
                  :widthLista="''"

                  option-label="label"
                  option-value="value"
                />
              </div>

              <!-- DIV DIREITA - Botões -->
              <div class="WIDTH-44 HEIGHT-100 D-flex JC-flex-end ALITEM-flex-end ">
                <div style="margin-right: 10px; cursor: pointer;" @click="FetchInfoLRs()" title="Atualizar informações">
                  <IconsRefresh
                    corProp="rgb(24, 134, 84)"
                    alturaProp="1.6"
                    larguraProp="1.6"
                  />
                </div>

                <!-- EXCEL -->
                <button :disabled="isLoadingEXCELRelatorio" id="exportar-EXCEL-button" type="button"
                  class="btn btn-success MARGIN-R5 FSIZE-12px  PADDING-4" @click="FetchEXCEL_ResultadoLR()">
                  <IconsExcel corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                  Exportar EXCEL</button>
                  
                <!-- PDF -->
                <button :disabled="isLoadingPDFRelatorio" id="exportar-PDF-button" type="button"
                class="btn btn-warning FSIZE-12px PADDING-4" @click="FetchPDF_ResultadoLR()">
                  <IconsPDF corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                  Exportar PDF
                </button>

              </div>

            </div>
          </div>

          <!-- Tabela -->
          <div class="OFLOW-auto WIDTH-98 HEIGHT-70 BOR-SensacaoAfundado mb-1">
          
            <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5 table-fixed FSIZE-PADRAO-TABLE">
              <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                <tr>
                  <th class="WIDTH-1 TEXTALI-center no-wrap-text" scope="col"></th>
                  <th class="WIDTH-10 TEXTALI-center no-wrap-text" scope="col">Data</th>
                  <th class="WIDTH-7 TEXTALI-center no-wrap-text" scope="col">L.R.</th>
                  <th class="WIDTH-7 TEXTALI-center no-wrap-text" scope="col">TRÂMITE</th>
                  <th class="WIDTH-10 TEXTALI-center no-wrap-text" scope="col">NF-e</th>
                  <th class="WIDTH-30 TEXTALI-left no-wrap-text" scope="col">DADOS GERAIS</th>
                  <th class="WIDTH-5 TEXTALI-center no-wrap-text" scope="col">ITENS</th>
                  <th class="WIDTH-15 TEXTALI-center no-wrap-text" scope="col">TRANSPORTADORA</th>
                </tr>
              </thead>

              <LayoutTabelaCarregarEsqueleto v-if="!tabelaLRCarregada"
                :Linhas="infoLrsSlice.length === 0 ? 15 : infoLrsSlice.length" :Colunas="8" />
              
              <tbody v-if="tabelaLRCarregada" class="BORRAD-5">
                  
                <template v-for="(LR, i) in infoLrsSlice" :key="i">

                <tr :class="applyTableStipedRows(i)"
                  class="BGC-H-cinza-8 HEIGHT-5px CURSOR-pointer" 
                >
                  <!-- ATIVADOR DA SUB-LINHA -->
                  <td @click.stop.prevent class="TEXTALI-center WIDTH-1">
                    <button title="Mais informações" class="custom-button"
                      style="height: 15px; width: 15px;"
                      @click.stop.prevent="ativarSubLinhaLRs(LR.iD_Tramite_Item)"
                    >{{ linhaExpandidaDaTabelaLRs === LR.iD_Tramite_Item ? '-' : '+' }}
                    </button>
                  </td>
                  <td class="no-wrap-text WIDTH-10 TEXTALI-center" scope="row" :title="LR.dDataTramite" >{{ LR.dDataTramite }}</td>
                  <td class="no-wrap-text WIDTH-7 TEXTALI-center" scope="row" :title="LR.iD_LR" >{{ LR.cLR }}</td>
                  <td class="no-wrap-text WIDTH-7 TEXTALI-center" scope="row" :title="LR.iD_Tramite" >{{ LR.cTramite }}</td>
                  <td class="no-wrap-text WIDTH-10 TEXTALI-center" scope="row" :title="LR.cNumNFE" >{{ LR.cNumNFE }}</td>
                  <td class="no-wrap-text WIDTH-30 TEXTALI-left" scope="row" :title="LR.cInfoGerais" >{{ shortenInfo(LR.cInfoGerais, 50) }}</td>
                  <td class="no-wrap-text WIDTH-5 TEXTALI-center" scope="row" :title="LR.cQtdeItens" >{{ LR.cQtdeItens }}</td>
                  <td class="no-wrap-text WIDTH-15 TEXTALI-center" scope="row" :title="LR.cTransportadora" >{{ LR.cTransportadora }}</td>
                </tr>

                <!-- Linha expandida -->
                <tr v-if="linhaExpandidaDaTabelaLRs === LR.iD_Tramite_Item">
                  <td colspan="8" class="expanded-row" style="background-color: #fff0f0;">
                    <div class="expanded-content" style="display: flex">
                      <table class="table table-sm FSIZE-PADRAO-TABLE" style="border: 2px 0px 0px 0px solid #000; border-collapse: collapse; z-index: 1">
                        
                        <thead>
                          <tr style="text-align: center">
                            <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-1 no-wrap-text"></th>
                            <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10 no-wrap-text">DATA BIPAGEM</th>
                            <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5 no-wrap-text">ID COMP.</th>
                            <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10 no-wrap-text">CÓD. COMP.</th>
                            <th style="background-color: #97b6b8" class="TEXTALI-left  WIDTH-40 no-wrap-text">DESC. COMP.</th>
                            <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-10 no-wrap-text">EST. MATERIAL</th>
                            <th style="background-color: #97b6b8" class="TEXTALI-center  WIDTH-5 no-wrap-text">QUANTIDADE</th>
                          </tr>
                        </thead>

                        <tbody>
                          <template v-for="histBipagem in infoHistBipagensLR" :key="histBipagem.iD_Pedido_Item">

                            <tr>
                              <td class="TEXTALI-center WIDTH-1 no-wrap-text" style="background-color: #e0e0e0;">
                                <div @click="OnClickLupaVerComponente(LR.iD_LR, histBipagem.iD_Componente)" v-if="histBipagem.iD_EstadoMaterial != 1" title="Foto componente" class="CURSOR-pointer">
                                  <IconsLupa  corProp="red" alturaProp="1" larguraProp="1"/> 
                                </div>
                              </td>
                              <td class="TEXTALI-center WIDTH-10 no-wrap-text" style="background-color: #e0e0e0;">
                                {{ histBipagem.dDataBipagem }}
                              </td>
                              <td class="TEXTALI-center WIDTH-5 no-wrap-text" style="background-color: #e0e0e0;">
                                {{ histBipagem.iD_Componente }}
                              </td>
                              <td class="TEXTALI-center WIDTH-10 no-wrap-text" style="background-color: #e0e0e0;">
                                {{ histBipagem.cCodComponente }}
                              </td>
                              <td class="TEXTALI-left WIDTH-40 no-wrap-text" :title="histBipagem.cDescricao" style="background-color: #e0e0e0;">
                                {{ shortenInfo(histBipagem.cDescricao, 80) }}
                              </td>
                              <td class="TEXTALI-center WIDTH-10 no-wrap-text" :style="aplicaCorAoEstadoStyle(histBipagem.cEstadoMaterial)">
                                {{ histBipagem.cEstadoMaterial }}
                              </td>
                              <td class="TEXTALI-center WIDTH-5 no-wrap-text" style="background-color: #e0e0e0; ">
                                {{ histBipagem.iQuantidade }}
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
          <div class="WIDTH-98">
            <button @click="toggleVerMais()" class="btn btn-secondary WIDTH-100 FSIZE-14px">
              {{ mostrarTodos ? `Ver menos...` : `Ver mais... (${infoLrs.length})` }}
            </button>
          </div>
          
        </div>

      </div>
      
      <Rodape />

   </div>
  </main>
  
  <!-- MODAL - FOTO -->
  <div class="modal fade" id="FotoComponenteModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="FotoComponenteModalLabel">
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
          <h1 class="modal-title fs-5 flex-grow-1 text-center" id="FotoComponenteModalLabel">
            L.R. • FOTO COMPONENTE
          </h1>

          <!-- Botão Fechar -->
          <button title="Fechar (F4)" id="update-modal-close-button" 
            type="button" class="btn-close" aria-label="Close" @click="OnClickFecharModalFotoComponente();"
          ></button>
        </div>

        <!-- Corpo MODAL -->
        <div class="HEIGHT-70vh D-flex JC-center ALITEM-center">
          <!-- INFOS -->
          <div class=" HEIGHT-100 WIDTH-25 D-flex FD-column JC-flex-start ALITEM-center PADDING-5">
            <!-- DATA FOTO -->  
            <div class="WIDTH-80 mb-2">
              <label
                id="componente-data-label"
                for="componente-data-input"
                class="form-label BGC-input-disabled FSIZE-12px BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
              >DATA FOTO</label>
              <input
                id="componente-data-input"
                type="text"
                disabled
                class="form-control InputUPPERCASE BOR-grey MARGIN-T-10 FSIZE-12px"
                v-model="infoComponente.dData"
                >
            </div>

            <!-- COMPONENTE -->
            <div class="WIDTH-80 mb-2">
              <label
                id="componente-codigo-label"
                for="componente-codigo-input"
                class="form-label BGC-input-disabled FSIZE-12px BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
              >CÓDIGO</label>
              <input
                id="componente-codigo-input"
                type="text"
                disabled
                class="form-control InputUPPERCASE BOR-grey MARGIN-T-10 FSIZE-12px"
                v-model="infoComponente.cCodComponente"
                >
            </div>


            <!-- ARQUIVO -->
            <div class="WIDTH-80 mb-2">
              <label
                id="componente-arquivo-label"
                for="componente-arquivo-input"
                class="form-label BGC-input-disabled FSIZE-12px BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
              >ARQUIVO</label>
              <input
                id="componente-arquivo-input"
                type="text"
                disabled
                class="form-control InputUPPERCASE BOR-grey MARGIN-T-10 FSIZE-12px"
                v-model="infoComponente.cNomeFoto"
                >
            </div>

            <!-- QUANTIDADE -->
            <div class="WIDTH-80 mb-2">
              <label
                id="componente-quantidade-label"
                for="componente-quantidade-input"
                class="form-label BGC-input-disabled FSIZE-12px BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
              >QUANTIDADE</label>
              <input
                id="componente-quantidade-input"
                type="text"
                disabled
                class="form-control InputUPPERCASE BOR-grey MARGIN-T-10 FSIZE-12px"
                v-model="infoComponente.iQuantidade"
                >
            </div>

            <!-- OBSERVACAO -->
            <div class="WIDTH-80">
              <label
                id="textarea-observacao-label"
                for="textarea-observacao-input"
                class="form-label BGC-input-disabled BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
              >OBSERVAÇÃO</label>

              <textarea
                autocomplete="off"
                id="textarea-observacao-input"
                type="text"
                disabled
                class="form-control BORRAD-5 BOR-grey MARGIN-T-10 FSIZE-12px BGC-branco InputUPPERCASE PADDING-5"
                rows="4"
                :title="infoComponente.cObservacao"
                style="resize: vertical; min-height: 150px; max-height: 200px;"
                v-model="infoComponente.cObservacao"
              ></textarea>
            </div>
          </div>

          <!-- FOTO -->
          <div class="HEIGHT-100 WIDTH-75 D-flex JC-center ALITEM-center BGC-cinza-9">
            <!-- carregando -->
            <p v-if="!infoComponenteCarregada">Carregando...</p>

            <!-- imagem -->
            <a
              v-else-if="infoComponente?.imagemUrl"
              :href="infoComponente.imagemUrlDownload"
              target="_blank"
              rel="noopener"
              class="TEXTDECO-none HEIGHT-100 WIDTH-100"
            >
              <img
                :src="infoComponente.imagemUrl"
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

<style>
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