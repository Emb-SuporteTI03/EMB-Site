<script setup>
import axios from "axios";
import { ref } from "vue";
import { shortenInfo, applyTableStipedRows, GetGenerico } from '~/composables/visualization';
import { ToastSuccess, ToastError, ToastWarning } from '~/composables/toasts';
import { useAuthStore } from '~/stores/auth';
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
const dataInicial = ref("")
const dataFinal = ref("")
dataInicial.value = new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0];
dataFinal.value = new Date().toISOString().split('T')[0];

const tabelaConsumoCarregada = ref(false);

const infosTableConsumoSLA = ref([]);
const staticInfosTableConsumoSLA = ref([]); // Para manter os dados originais e poder limpar os filtros

const selectedCodProduto = ref(null);
const selectedDescProduto = ref(null);
const selectedComplementoSaida = ref(null);
const selectedMotivo = ref(null);

const isLoadingEXCELRelatorio = ref(false);
const isLoadingPDFRelatorio = ref(false);

const mostrarTodos = ref(false);

// PARA A BARRA DE TOTAL FICAR CORRETAMENTE ALINHADA ===========================\
const compensacaoScroll = ref('17');
const paddingTabela = ref('0.25rem');
const tabelaWrapperConsumo = ref(null);

const ajustarCompensacaoScrollConsumo = () => {
  const el = tabelaWrapperConsumo.value;
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
  const produtoEscolhaFiltro = computed(() => {
    const unicos = new Set();

    infosTableConsumoSLA.value.forEach(e => {
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

    infosTableConsumoSLA.value.forEach(e => {
      if (e.descricaoComponente) {
        unicos.add(e.descricaoComponente);
      }
    });

    return Array.from(unicos).map((item, index) => ({
      id: index + 1,
      cNome: item
    }));
  });

  const complementosSaidaEscolhaFiltro = computed(() => {
    const unicos = new Set(
      infosTableConsumoSLA.value
        .map(e => e.complementoSaida)
        .filter(x => x) // remove null/undefined/""
    );

    return Array.from(unicos).map((item, index) => ({
      id: index + 1,
      cNome: item
    }));
  });

  const motivosSaidaEscolhaFiltro = computed(() => {
    const unicos = new Set(
      infosTableConsumoSLA.value
        .map(e => e.motivo)
        .filter(x => x)
    );

    return Array.from(unicos).map((item, index) => ({
      id: index + 1,
      cNome: item
    }));
  });

const infosTableConsumoSLASlice = computed(() => {
  return mostrarTodos.value
    ? infosTableConsumoSLA.value
    : infosTableConsumoSLA.value.slice(0, 50)
});

const totalQuantidadeConsumo = computed(() => {
  const codProduto        = selectedCodProduto.value?.cNome.toLowerCase() || "";
  const descProduto       = selectedDescProduto.value?.cNome.toLowerCase() || "";
  const complementoSaida  = selectedComplementoSaida.value?.cNome.toLowerCase() || "";
  const motivo            = selectedMotivo.value?.cNome.toLowerCase() || "";

  return staticInfosTableConsumoSLA.value
    .filter(comp => {
      return (
        (codProduto        ? comp.codigoComponente?.toLowerCase().includes(codProduto) : true) &&
        (descProduto       ? comp.descricaoComponente?.toLowerCase().includes(descProduto) : true) &&
        (complementoSaida  ? comp.complementoSaida?.toLowerCase().includes(complementoSaida) : true) &&
        (motivo            ? comp.motivo?.toLowerCase().includes(motivo) : true)
      );
    })
    .reduce((acc, e) => acc + (Number(e.quantidade) || 0), 0);
});

// --------------------------/

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// FUNÇÕES DO FILTRO
const aplicarFiltros = async () => {
  const codProduto     = selectedCodProduto.value?.cNome.toLowerCase() || "";
  const descProduto    = selectedDescProduto.value?.cNome.toLowerCase() || "";
  const complementoSaida = selectedComplementoSaida.value?.cNome.toLowerCase() || "";
  const motivo    = selectedMotivo.value?.cNome.toLowerCase() || "";

  infosTableConsumoSLA.value = staticInfosTableConsumoSLA.value.filter(comp => {
    return (
      (codProduto       ? comp.codigoComponente?.toLowerCase().includes(codProduto) : true) &&
      (descProduto      ? comp.descricaoComponente?.toLowerCase().includes(descProduto) : true) &&
      (complementoSaida ? comp.complementoSaida?.toLowerCase().includes(complementoSaida) : true) &&
      (motivo           ? comp.motivo?.toLowerCase().includes(motivo) : true)
    );
  });

  await nextTick();
  ajustarCompensacaoScrollConsumo();
};

const OnClickLupa = () => {
  ToastWarning('LUPA: em desenvolvimento.');
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
    console.error("Erro ao buscar dados:", error);
  }
}
async function getInfosConsumoSLA() {
  const authStore = useAuthStore();

  try {
    tabelaConsumoCarregada.value = false;

    const response = await axios.get(
      `${urlProd}/consultas-sla/sla-consumo/${ID_Carteira.value}?dataInicio=${dataInicial.value}&dataFinal=${dataFinal.value}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`
        }
      }
    );

    infosTableConsumoSLA.value = response.data;
    staticInfosTableConsumoSLA.value = response.data;

    await aplicarFiltros();
  } catch (response) {
    console.error("Erro ao buscar dados:");
  } finally {
    tabelaConsumoCarregada.value = true;
  }
};
async function fetchEXCELConsumoSLA() {
  if(infosTableConsumoSLA.value.length == 0) {
    ToastWarning('Não há dados para exportar!');
    return;
  }

  ToastWarning('Aguarde enquanto o documento é gerado...');

  isLoadingEXCELRelatorio.value = true;
  const authStore = useAuthStore();

  try {
    // Garante array puro
    const payload = Array.isArray(infosTableConsumoSLA.value)
      ? toRaw(infosTableConsumoSLA.value)
      : [toRaw(infosTableConsumoSLA.value)];

    const url = `${urlProd}/consultas-sla/sla-consumo-excel`; // <-- .value aqui!

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
    let fileName = `SLA_CONSUMO_${cliente.value.cNmFantasia}.xlsx`;
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
async function fetchPDFConsumoSLA() {
  if(infosTableConsumoSLA.value.length == 0) {
  ToastWarning('Não há dados para exportar!');
  return;
}
  isLoadingPDFRelatorio.value = true;

  ToastWarning('Aguarde enquanto o documento é gerado...');
  const authStore = useAuthStore();

  try {
    // Garante array puro
    const payload = Array.isArray(infosTableConsumoSLA.value)
      ? toRaw(infosTableConsumoSLA.value)
      : [toRaw(infosTableConsumoSLA.value)];

    const url = `${urlProd}/consultas-sla/sla-consumo-pdf`; // <-- endpoint do PDF

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
    let fileName = `SLA_CONSUMO_${cliente.value.cNmFantasia}.pdf`;
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

async function downloadJustificativa(ID_MovSaida) {
    try {
     
      if (!ID_MovSaida) {
            console.error("Erro ao baixar o arquivo: ID da movimentação não encontrado.");
            ToastError("Erro ao baixar o arquivo: ID da movimentação não encontrado.");
            return;
        }

        // Monta a URL do arquivo com base no ID_MovSaida
        const arquivoURL = `${urlProd}/estoque/movimentacao-saidas/arquivo-justificativa/${ID_MovSaida}`;

        // Faz a requisição para pegar o arquivo
        const response = await fetch(arquivoURL, {
            method: "GET",
            headers: {
                Accept: "application/octet-stream",
                Authorization: `Bearer ${this.token}`,
            },
        });

        if (!response.ok) {
            console.error(`[downloadJustificativa] Erro HTTP: ${response.status} - ${response.statusText}`);
            ToastError(`Erro ao baixar o arquivo: ARQUIVO NÃO EXISTE`);
            return;
        }

        // Obtém o conteúdo do arquivo como um Blob
        const arquivoBlob = await response.blob();

        // Nome do arquivo do backend (fallback)
        let nomeArquivo = `arquivo_${ID_MovSaida}`;

        // Tenta pegar o filename do header Content-Disposition
        const contentDisposition = response.headers.get("Content-Disposition");
        if (contentDisposition) {
            // Primeiro tenta pegar filename padrão
            let match = contentDisposition.match(/filename="?([^";]+)"?/);
            if (!match) {
                // Tenta pegar filename codificado (UTF-8)
                match = contentDisposition.match(/filename\*\=UTF-8''([^";]+)/);
                if (match) {
                    nomeArquivo = decodeURIComponent(match[1]);
                }
            } else if (match[1]) {
                nomeArquivo = match[1];
            }
        }

        // Determinar extensão do arquivo
        let extensao = nomeArquivo.includes(".") ? nomeArquivo.split(".").pop().toLowerCase() : "";
        if (!extensao) {
            // Tenta derivar a extensão do tipo MIME
            const mimeType = arquivoBlob.type;
            if (mimeType) {
                const mimeMap = {
                    "application/pdf": "pdf",
                    "image/jpeg": "jpg",
                    "image/png": "png",
                    "text/csv": "csv",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
                    "application/vnd.ms-excel": "xls",
                    "application/vnd.ms-outlook": "msg",
                    "message/rfc822": "eml"
                };
                extensao = mimeMap[mimeType] || "bin";
            } else {
                extensao = "bin";
            }
            nomeArquivo += `.${extensao}`;
        }

        // Cria link temporário e dispara download
        const link = document.createElement("a");
        const url = window.URL.createObjectURL(arquivoBlob);
        link.href = url;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

      } catch (error) {
        console.error("[downloadJustificativa] Erro ao baixar o arquivo:", error);
        ToastError("Erro inesperado ao baixar o arquivo. Verifique sua conexão.");
    }
}

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

  await getInfosConsumoSLA();
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

  await getInfosConsumoSLA();
};

async function onClickLimparFiltros() {
  dataInicial.value = new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0];
  dataFinal.value = new Date().toISOString().split('T')[0];
  selectedCodProduto.value = null;
  selectedDescProduto.value = null;
  selectedComplementoSaida.value = null;
  selectedMotivo.value = null;

  mostrarTodos.value = false;
  infosTableConsumoSLA.value = staticInfosTableConsumoSLA.value;
  aplicarFiltros();
  await getInfosConsumoSLA();
};

const toggleVerMais = () => {
  mostrarTodos.value = !mostrarTodos.value 
}

// MOUNTED DA PÁGINA
onMounted(async () => {
  await getTransportadorasApenasSLA();
  await getInfosConsumoSLA();

  nextTick(() => {
    ajustarCompensacaoScrollConsumo();

    let td = tabelaWrapperConsumo.value
      ?.querySelector('tbody td');

    if (td) {
      const style = getComputedStyle(td);
      paddingTabela.value = style.paddingLeft;
    }

    td = tabelaWrapperConsumo.value
      ?.querySelector('tbody td');

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
        funcionalidadeProp="CONSUMO"
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

                <!-- CÓDIGO PRODUTO -->
                <BasicElementVue3SelectPequeno
                  :options="produtoEscolhaFiltro"
                  optionLabel="cNome"
                  v-model="selectedCodProduto"

                  @update:modelValue="aplicarFiltros"
                  
                  label="COD. PRODUTO:"
                  :titulo="selectedCodProduto?.cNome"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15'"
                  :widthLista="''"
                />

                <BasicElementVue3SelectPequeno
                  :options="descProdutoEscolhaFiltro"
                  optionLabel="cNome"
                  v-model="selectedDescProduto"

                  @update:modelValue="aplicarFiltros"
                  
                  label="DESCRIÇÃO DO PRODUTO:"
                  :titulo="selectedDescProduto?.cNome"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15'"
                  :widthLista="''"
                /> 

              </div>

              <!-- DIV CENTRAL 2 -->
              <div class="D-flex WIDTH-25 BOR-L-solidgrey-1 FD-column PADDING-T5-R5-B5-L10">

                <!-- COMPLEMENTO -->
                <BasicElementVue3SelectPequeno
                  :options="complementosSaidaEscolhaFiltro"
                  optionLabel="cNome"
                  v-model="selectedComplementoSaida"

                  @update:modelValue="aplicarFiltros"
                  
                  label="COMPLEMENTO SAÍDA:"
                  :titulo="selectedComplementoSaida?.cNome"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15'"
                  :widthLista="''"
                />

                <!-- MOTIVO SAÍDA -->
                <BasicElementVue3SelectPequeno
                  :options="motivosSaidaEscolhaFiltro"
                  optionLabel="cNome"
                  v-model="selectedMotivo"

                  @update:modelValue="aplicarFiltros"
                  
                  label="MOTIVO SAÍDA:"
                  :titulo="selectedMotivo?.cNome"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15'"
                  :widthLista="''"
                />

              </div>

              <!-- DIV DIREITA - Botões -->
              <div class="WIDTH-44 HEIGHT-100 D-flex JC-flex-end ALITEM-flex-end BOR-L-solidgrey-1">
                <div style="margin-right: 10px; cursor: pointer;" @click="getInfosConsumoSLA()" title="Atualizar informações">
                  <IconsRefresh
                    corProp="rgb(24, 134, 84)"
                    alturaProp="1.6"
                    larguraProp="1.6"
                  />
                </div>

                <!-- EXCEL -->
                <button :disabled="isLoadingEXCELRelatorio" id="exportar-EXCEL-button" type="button"
                class="btn btn-success MARGIN-R5 FSIZE-12px  PADDING-4" @click="fetchEXCELConsumoSLA()">
                  <IconsExcel corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                  Exportar EXCEL</button>
                  
                <!-- PDF -->
                <button :disabled="isLoadingPDFRelatorio" id="exportar-PDF-button" type="button"
                class="btn btn-warning FSIZE-12px PADDING-4" @click="fetchPDFConsumoSLA()">
                  <IconsPDF corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                  Exportar PDF
                </button>

              </div>

            </div>
            
          </div>

          <!-- Tabela -->
          <div class="BOR-SensacaoAfundado OFLOW-auto WIDTH-99 HEIGHT-70 BORRAD-5">

            <div class="HEIGHT-93 OFLOW-auto WIDTH-100"  ref="tabelaWrapperConsumo">
            
              <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5 table-fixed FSIZE-PADRAO-TABLE">
                <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                  <tr>
                    <!-- <th class="WIDTH-2 TEXTALI-center" scope="col"></th> -->
                    <th class="WIDTH-2 TEXTALI-center" scope="col"></th>
                    <th class="WIDTH-12 TEXTALI-center" scope="col">Data</th>
                    <th class="WIDTH-15 TEXTALI-center" scope="col">Motivo Saída</th>
                    <th class="WIDTH-10 TEXTALI-center" scope="col">Código</th>
                    <th class="WIDTH-40 TEXTALI-center" scope="col">Descrição do Produto</th>
                    <th class="WIDTH-6 TEXTALI-center" scope="col">Qtd.</th>
                    <th class="WIDTH-15 TEXTALI-center" scope="col">Complemento</th>
                  </tr>
                </thead>
                <LayoutTabelaCarregarEsqueleto v-if="!tabelaConsumoCarregada"
                  :Linhas="12" :Colunas="7" />
                
                  <tbody v-if="tabelaConsumoCarregada" class="BORRAD-5">
                  <tr
                    v-for="(consumo, i) in infosTableConsumoSLASlice" :key="i"
                    class="BGC-H-cinza-8 HEIGHT-5px CURSOR-pointer"
                    :class="applyTableStipedRows(i)"
                    >
                      <!-- <td class="HEIGHT-5px WIDTH-2 TEXTALI-center" scope="row">
                        <button
                          type="button"
                            class="in-table-button"
                            title="Visualizar detalhes do Trâmite"
                            @click="OnClickLupa">
                          <IconsLupa corProp="currentColor" alturaProp="1" larguraProp="1"/>  
                        </button>
                      </td> -->
                      <td class="HEIGHT-5px WIDTH-2 TEXTALI-center" scope="row">
                        <button type="button"
                          :class="consumo.complementoSaida !== 'SAÍDA MANUAL DO ESTOQUE' ? 'OPACITY-03' : ''"
                          class="in-table-button"
                          title="Baixar justificativa da saída"
                          v-if="consumo.complementoSaida === 'SAÍDA MANUAL DO ESTOQUE' "
                          @click="downloadJustificativa(consumo.idSaida)"
                        >
                          <IconsConsulta  corProp="currentColor" alturaProp="1" larguraProp="1"/>  
                        </button>
                      </td>
                      <td class="HEIGHT-5px WIDTH-12 TEXTALI-center TableElipsis" scope="row" :title="consumo.dataConsumo" >{{ consumo.dataConsumo }}</td>
                      <td class="HEIGHT-5px WIDTH-15 TEXTALI-center TableElipsis" :title="consumo.complementoSaida" >{{ consumo.complementoSaida }}</td>
                      <td class="HEIGHT-5px WIDTH-10 TEXTALI-left TableElipsis" :title="consumo.codigoComponente" >{{ consumo.codigoComponente }}</td>
                      <td class="HEIGHT-5px WIDTH-40 TEXTALI-left TableElipsis" :title="consumo.descricaoComponente" >{{ consumo.descricaoComponente }}</td>
                      <td class="HEIGHT-5px WIDTH-6 TEXTALI-center TableElipsis" :title="consumo.quantidade" >{{ consumo.quantidade }}</td>
                      <td class="HEIGHT-5px WIDTH-15 TEXTALI-center TableElipsis" :title="consumo.motivo" >{{ consumo.motivo }}</td>
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
                  {{ mostrarTodos ? `Ver menos...` : `Ver mais... (${infosTableConsumoSLA.length})` }}
                </button>
              </div>

              <div class="WIDTH-19"></div>

              <div class="WIDTH-6 FWEIGHT-bold FSIZE-14px"
                :style="{
                  paddingLeft: paddingTabela,
                  paddingRight: paddingTabela,
                  textAlign: 'center'
                }"
              >
                <span v-if="!tabelaConsumoCarregada" class="loading-dots"></span>
                <span v-else>{{ totalQuantidadeConsumo }}</span>
              </div>

              <div class="WIDTH-15"></div>


            </div>

          </div>

        </div>

      </div>
      
      <Rodape />

    </div>
  </main>
</template>

<style scoped>
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