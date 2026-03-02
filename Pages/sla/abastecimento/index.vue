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
const token = ref(authStore.token);

const cliente = ref({});
const logoPath = `/CLIENTES/${ID_Carteira.value}.png`;
const dataInicial = ref("")
const dataFinal = ref("")
dataInicial.value = new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0];
dataFinal.value = new Date().toISOString().split('T')[0];

const tabelaAbastecimentoCarregada = ref(false);

const infosTableAbastecimentoSLA = ref([]);
const staticInfosTableAbastecimentoSLA = ref([]); // Para manter os dados originais e poder limpar os filtros

const selectedFamilia = ref(null);
const selectedLote = ref(null);
const selectedEdicao = ref(null);
const selectedCodProduto = ref(null);
const selectedDescProduto = ref(null);
const selectedEstadoMaterial = ref(null);

const isLoadingEXCELRelatorio = ref(false);
const isLoadingPDFRelatorio = ref(false);

const mostrarTodos = ref(false);

// PARA A BARRA DE TOTAL FICAR CORRETAMENTE ALINHADA ===========================\
const compensacaoScroll = ref('17');
const paddingTabela = ref('0.25rem');
const tabelaWrapperAbastecimento = ref(null);

const ajustarCompensacaoScrollAbastecimento = () => {
  const el = tabelaWrapperAbastecimento.value;
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
const produtoEscolhaFiltro = computed(() => {
  const unicos = new Set();

  infosTableAbastecimentoSLA.value.forEach(e => {
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

  infosTableAbastecimentoSLA.value.forEach(e => {
    if (e.descricaoComponente) {
      unicos.add(e.descricaoComponente);
    }
  });

  return Array.from(unicos).map((item, index) => ({
    id: index + 1,
    cNome: item
  }));
});
const familiasEscolhaFiltro = computed(() => {
  const unicos = new Set(
    infosTableAbastecimentoSLA.value
      .map(e => e.familia)
      .filter(x => x) // remove null/empty
  );

  return Array.from(unicos).map((item, index) => ({
    id: index + 1,
    cNome: item
  }));
});

const lotesEscolhaFiltro = computed(() => {
  const unicos = new Set(
    infosTableAbastecimentoSLA.value
      .map(e => e.lote)
      .filter(x => x)
  );

  return Array.from(unicos).map((item, index) => ({
    id: index + 1,
    cNome: item
  }));
});

const edicoesEscolhaFiltro = computed(() => {
  const unicos = new Set(
    infosTableAbastecimentoSLA.value
      .map(e => e.edicao)
      .filter(x => x)
  );

  return Array.from(unicos).map((item, index) => ({
    id: index + 1,
    cNome: item
  }));
});

const estadoMaterialEscolhaFiltro = computed(() => {
  const unicos = new Set(
    infosTableAbastecimentoSLA.value
      .map(e => e.estadoEntrada)
      .filter(x => x)
  );

  return Array.from(unicos).map((item, index) => ({
    id: index + 1,
    cNome: item
  }));
});
const infosTableAbastecimentoSLASlice = computed(() => {
  return mostrarTodos.value
    ? infosTableAbastecimentoSLA.value
    : infosTableAbastecimentoSLA.value.slice(0, 50)
});
const totalQuantidadeAbastecimentos = computed(() => {
  const codProduto     = selectedCodProduto.value?.cNome.toLowerCase() || "";
  const descProduto    = selectedDescProduto.value?.cNome.toLowerCase() || "";
  const familia        = selectedFamilia.value?.cNome.toLowerCase() || "";
  const lote           = selectedLote.value?.cNome.toLowerCase() || "";
  const edicao         = selectedEdicao.value?.cNome.toLowerCase() || "";
  const estadoMaterial = selectedEstadoMaterial.value?.cNome.toLowerCase() || "";

  return staticInfosTableAbastecimentoSLA.value
    .filter(comp => {
      // Datas (dd/MM/yyyy)
      let dentroIntervalo = true;

      if (comp.dataEntrada && dataInicial.value && dataFinal.value) {
        const [dia, mes, ano] = comp.dataEntrada.split("/");
        const dataItem = new Date(`${ano}-${mes}-${dia}`);
        const inicio   = new Date(dataInicial.value);
        const fim      = new Date(dataFinal.value);

        dentroIntervalo = dataItem >= inicio && dataItem <= fim;
      }

      return (
        (codProduto     ? comp.codigoComponente?.toLowerCase().includes(codProduto) : true) &&
        (descProduto    ? comp.descricaoComponente?.toLowerCase().includes(descProduto) : true) &&
        (familia        ? comp.familia?.toLowerCase().includes(familia) : true) &&
        (lote           ? comp.lote?.toLowerCase().includes(lote) : true) &&
        (edicao         ? comp.edicao?.toLowerCase().includes(edicao) : true) &&
        (estadoMaterial ? comp.estadoEntrada?.toLowerCase().includes(estadoMaterial) : true) &&
        dentroIntervalo
      );
    })
    .reduce((acc, e) => acc + (Number(e.quantidade) || 0), 0);
});

// --------------------------/



// FUNÇÕES DO FILTRO
const aplicarFiltros = async () => {
  const codProduto     = selectedCodProduto.value?.cNome.toLowerCase() || "";
  const descProduto    = selectedDescProduto.value?.cNome.toLowerCase() || "";
  const familia        = selectedFamilia.value?.cNome.toLowerCase() || "";
  const lote           = selectedLote.value?.cNome.toLowerCase() || "";
  const edicao         = selectedEdicao.value?.cNome.toLowerCase() || "";
  const estadoMaterial = selectedEstadoMaterial.value?.cNome.toLowerCase() || ""; 

  infosTableAbastecimentoSLA.value = staticInfosTableAbastecimentoSLA.value.filter(comp => {
    // Validação de datas (comp.dataEntrada vem como dd/MM/yyyy)
    let dentroIntervalo = true;
    if (comp.dataEntrada && dataInicial.value && dataFinal.value) {
      const [dia, mes, ano] = comp.dataEntrada.split("/");
      const dataItem = new Date(`${ano}-${mes}-${dia}`); // normaliza para yyyy-MM-dd
      const inicio = new Date(dataInicial.value);
      const fim    = new Date(dataFinal.value);

      dentroIntervalo = dataItem >= inicio && dataItem <= fim;
    }

    return (
      (codProduto     ? comp.codigoComponente?.toLowerCase().includes(codProduto) : true) &&
      (descProduto    ? comp.descricaoComponente?.toLowerCase().includes(descProduto) : true) &&
      (familia        ? comp.familia?.toLowerCase().includes(familia) : true) &&
      (lote           ? comp.lote?.toLowerCase().includes(lote) : true) &&
      (edicao         ? comp.edicao?.toLowerCase().includes(edicao) : true) &&
      (estadoMaterial ? comp.estadoEntrada?.toLowerCase().includes(estadoMaterial) : true) &&
      dentroIntervalo
    );
  });

    
  await nextTick();

  ajustarCompensacaoScrollAbastecimento();

};

// REQUISIÇÕES
async function getTransportadorasApenasSLA() {
  const authStore = useAuthStore();

  const response = await axios.get(
      `${urlSistema.value}/carteira/com-join/${ID_Carteira.value}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`
        }
      }
    );
  cliente.value = response.data;
}
async function getInfosAbastecimentoSLA() {
  const authStore = useAuthStore();

  try {
    tabelaAbastecimentoCarregada.value = false;
    const response = await axios.get(
      `${urlProd}/consultas-sla/sla-abastecimento/${ID_Carteira.value}?dataInicio=${dataInicial.value}&dataFinal=${dataFinal.value}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`
        }
      }
    );

    infosTableAbastecimentoSLA.value = response.data;
    staticInfosTableAbastecimentoSLA.value = response.data;

    tabelaAbastecimentoCarregada.value = true;
    aplicarFiltros();
  } catch (response) {
    console.error("Erro ao buscar dados:");
  }
};
async function fetchEXCELAbastecimentoSLA() {
    if(infosTableAbastecimentoSLA.value.length == 0) {
    ToastWarning('Não há dados para exportar!');
    return;
  }

  ToastWarning('Aguarde enquanto o documento é gerado...');

  isLoadingEXCELRelatorio.value = true;
  const authStore = useAuthStore();

  try {
    // Garante array puro
    const payload = Array.isArray(infosTableAbastecimentoSLA.value)
      ? toRaw(infosTableAbastecimentoSLA.value)
      : [toRaw(infosTableAbastecimentoSLA.value)];

    const url = `${urlProd}/consultas-sla/sla-abastecimento-excel`; // <-- .value aqui!

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
    let fileName = `SLA_ABASTECIMENTOS_${cliente.value.cNmFantasia}.xlsx`;
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
async function fetchPDFAbastecimentoSLA() {
  if(infosTableAbastecimentoSLA.value.length == 0) {
    ToastWarning('Não há dados para exportar!');
    return;
  }

  ToastWarning('Aguarde enquanto o documento é gerado...');

  isLoadingPDFRelatorio.value = true;
  const authStore = useAuthStore();

  try {
    // Garante array puro
    const payload = Array.isArray(infosTableAbastecimentoSLA.value)
      ? toRaw(infosTableAbastecimentoSLA.value)
      : [toRaw(infosTableAbastecimentoSLA.value)];

    const url = `${urlProd}/consultas-sla/sla-abastecimento-pdf`; // <-- endpoint do PDF

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
    let fileName = `SLA_ABASTECIMENTO_${cliente.value.cNmFantasia}.pdf`;
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

  // FUNÇÕES AUXILIARES
  const aplicaCorAoEstado = (estado) => {
    if (estado === 'BOM') {
      return 'BGC-verde-5 COLOR-green';
    } else {
      return 'BGC-vermelho-5 COLOR-red';
    }
  };

  const OnChangeDataInicio = async () => {
    if (
      dataInicial.value &&
      dataFinal.value &&
      new Date(dataInicial.value) > new Date(dataFinal.value)
    ) {
      ToastWarning("A data inicial não pode ser maior que a final!");
      dataInicial.value = dataFinal.value;
    }

    await getInfosAbastecimentoSLA();
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

    await getInfosAbastecimentoSLA();
  };


async function onClickLimparFiltros() {
  dataInicial.value = new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0];
  dataFinal.value = new Date().toISOString().split('T')[0];
  selectedCodProduto.value = null;
  selectedDescProduto.value = null;
  selectedFamilia.value = null;
  selectedLote.value = null;
  selectedEstadoMaterial.value = null;
  selectedEdicao.value = null;

  mostrarTodos.value = false
  infosTableAbastecimentoSLA.value = staticInfosTableAbastecimentoSLA.value;
  aplicarFiltros();
  await getInfosAbastecimentoSLA();  
};
const toggleVerMais = () => {
  mostrarTodos.value = !mostrarTodos.value
}

// MOUNTED DA PÁGINA
onMounted(async () => {
  await getTransportadorasApenasSLA();
  await getInfosAbastecimentoSLA();
});

</script>


<template>
  <main class="D-flex">

    <!-- Todo o Conteúdo da página -->
    <div class="D-flex FD-column WIDTH-100 HEIGHT-100vh OFLOW-auto">

      <!-- Menu Superior -->
      <SetorProducaoSLAMenuSuperior 
        funcionalidadeProp="ABASTECIMENTO"
        :destinoVoltarProp="`/sla`"
        :srcFoto="logoPath"
      />
      
      <!-- ESPAÇO CORPO -->
      <div class="D-flex FD-column HEIGHT-88vh WIDTH-100 JC-center ALITEM-center BGC-cinza-9 BOR-branca">
        <div class="D-flex FD-column ALITEM-center JC-center HEIGHT-95 WIDTH-98 BORRAD-5 BGC-branco PADDING-T5-B10">

          <!-- Filtros -->
          <div class="D-flex JC-space-between HEIGHT-30 WIDTH-98 mb-1">

            <div class="D-flex WIDTH-100 JC-space-between">
              
              <!-- DECORAÇÃO FILTROS -->
              <div class="WIDTH-6 BGC-azul-esverdeado COLOR-white ALITEM-center BORRAD-5 FWEIGHT-bold D-flex FD-column JC-space-between">
                <p>Filtros</p>
                <button type="button" class="btn btn-dark WIDTH-75 FSIZE-12px mb-1" @click="onClickLimparFiltros">Limpar</button>
              </div>

              <!-- DIV CENTRAL 1 -->
              <div class="D-flex WIDTH-25  FD-column PADDING-T5-R5-B5-L10">
                
                <!-- FILTRO DE DATAS -->
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
                  :titulo="selectedCodProduto?.cnome"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15'"
                  :widthLista="''"
                />

                <!-- DESCRIÇÃO PRODUTO -->
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
              <div class="D-flex WIDTH-25 FD-column PADDING-T5-R5-B5-L10 BOR-L-solidgrey-1">
                
                <!-- FAMÍLIA -->
                <BasicElementVue3SelectPequeno
                  optionLabel="cNome"
                  :options="familiasEscolhaFiltro"
                  v-model="selectedFamilia"

                  @update:modelValue="aplicarFiltros"
                  
                  label="FAMÍLIA:"
                  :titulo="selectedFamilia?.cNome"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15'"
                  :widthLista="''"
                /> 

                <!-- LOTE -->
                <BasicElementVue3SelectPequeno
                  optionLabel="cNome"
                  :options="lotesEscolhaFiltro"
                  v-model="selectedLote"

                  @update:modelValue="aplicarFiltros"
                  
                  label="LOTE:"
                  :titulo="selectedLote?.cNome"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15'"
                  :widthLista="''"
                /> 

                <!-- EDIÇÃO -->
                <BasicElementVue3SelectPequeno
                  optionLabel="cNome"
                  :options="edicoesEscolhaFiltro"
                  v-model="selectedEdicao"

                  @update:modelValue="aplicarFiltros"
                  
                  label="EDIÇÃO:"
                  :titulo="selectedEdicao?.cNome"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15'"
                  :widthLista="''"
                /> 

              </div>

              <div class="D-flex WIDTH-25 FD-column PADDING-T5-R5-B5-L10 BOR-L-solidgrey-1">
                <!-- ESTADO MATERIAL -->
                <BasicElementVue3SelectPequeno
                  :options="estadoMaterialEscolhaFiltro"
                  optionLabel="cNome"
                  v-model="selectedEstadoMaterial"

                  @update:modelValue="aplicarFiltros"
                  
                  label="ESTADO:"
                  :titulo="selectedEstadoMaterial?.cNome"

                  :divClass="'MARGIN-T21 WIDTH-100'"
                  :selectClass="''"
                  :labelClass="'FSIZE-12px MARGIN-T-15'"
                  :widthLista="''"
                /> 
              </div>


              <!-- BOTÕES -->
              <div class="WIDTH-19 HEIGHT-100 D-flex JC-flex-end ALITEM-flex-end">
                
                <!-- BOTÃO REFRESH -->
                <div style="margin-right: 10px; cursor: pointer;" @click="getInfosAbastecimentoSLA()" title="Atualizar informações">
                  <IconsRefresh
                    corProp="rgb(24, 134, 84)"
                    alturaProp="1.6"
                    larguraProp="1.6"
                  />
                </div>

                <!-- EXCEL -->
                <button id="exportar-EXCEL-button" type="button"
                  class="btn btn-success MARGIN-R5 FSIZE-12px PADDING-4" @click="fetchEXCELAbastecimentoSLA()">
                  <IconsExcel corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                  Exportar EXCEL</button>
                  
                <!-- PDF -->
                <button id="exportar-PDF-button" type="button"
                  class="btn btn-warning MARGIN-R5 FSIZE-12px PADDING-4" @click="fetchPDFAbastecimentoSLA()">
                  <IconsPDF corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                  Exportar PDF
                </button>

              </div>

            </div>

          </div>

          <!-- Tabela -->
          <div class="BOR-SensacaoAfundado OFLOW-auto WIDTH-99 HEIGHT-70 BORRAD-5">

            <div class="HEIGHT-93 OFLOW-auto WIDTH-100" ref="tabelaWrapperAbastecimento">
            
              <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5 table-fixed FSIZE-PADRAO-TABLE">
                <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                  <tr>
                    <th class="WIDTH-12 TEXTALI-center" scope="col">Data</th>
                    <th class="WIDTH-9 TEXTALI-center" scope="col">Código</th>
                    <th class="WIDTH-30 TEXTALI-center" scope="col">Descrição do Produto</th>
                    <th class="WIDTH-10 TEXTALI-center" scope="col">Família</th>
                    <th class="WIDTH-8 TEXTALI-center" scope="col">Lote</th>
                    <th class="WIDTH-8 TEXTALI-center" scope="col">Edição</th>
                    <th class="WIDTH-5 TEXTALI-center" scope="col">Qtd.</th>
                    <th class="WIDTH-5 TEXTALI-center" scope="col">Estado</th>
                    <th class="WIDTH-13 TEXTALI-center" scope="col">Motivo Entrada</th>
                  </tr>
                </thead>
                <LayoutTabelaCarregarEsqueleto v-if="!tabelaAbastecimentoCarregada"
                  :Linhas="infosTableAbastecimentoSLASlice.length === 0 ? 15 : infosTableAbastecimentoSLASlice.length" :Colunas="10" />
                
                  <tbody v-if="tabelaAbastecimentoCarregada" class="BORRAD-5">
                  <tr
                    v-for="(entrada, i) in infosTableAbastecimentoSLASlice" :key="i"
                    class="BGC-H-cinza-8 HEIGHT-5px CURSOR-pointer"
                    :class="applyTableStipedRows(i)"
                    >
                      <td class="HEIGHT-5px WIDTH-12 TEXTALI-center TableElipsis" :title="entrada.dataHoraEntrada" >{{ entrada.dataHoraEntrada }}</td>
                      <td class="HEIGHT-5px WIDTH-9 TEXTALI-center TableElipsis" :title="entrada.codigoComponente" >{{ entrada.codigoComponente }}</td>
                      <td class="HEIGHT-5px WIDTH-30 TEXTALI-left TableElipsis" :title="entrada.descricaoComponente" >{{ entrada.descricaoComponente }}</td>
                      <td class="HEIGHT-5px WIDTH-10 TEXTALI-center TableElipsis" :title="entrada.familia" >{{ entrada.familia }}</td>
                      <td class="HEIGHT-5px WIDTH-8 TEXTALI-center TableElipsis" :title="entrada.lote" >{{ entrada.lote }}</td>
                      <td class="HEIGHT-5px WIDTH-8 TEXTALI-center TableElipsis" :title="entrada.edicao" >{{ entrada.edicao }}</td>
                      <td class="HEIGHT-5px WIDTH-5 TEXTALI-center TableElipsis">{{ entrada.quantidade }}</td>
                      <td class="HEIGHT-5px WIDTH-5 TEXTALI-center TableElipsis" :class="aplicaCorAoEstado(entrada.estadoEntrada)">{{ entrada.estadoEntrada }}</td>
                      <td class="HEIGHT-5px WIDTH-13 TEXTALI-left TableElipsis" :title="entrada.motivoEntrada" >{{ entrada.motivoEntrada }}</td>
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
                    {{ mostrarTodos ? `Ver menos...` : `Ver mais... (${infosTableAbastecimentoSLA.length})` }}
                  </button>
                </div>

                <div class="WIDTH-17"></div>

                <div class="WIDTH-5 FWEIGHT-bold FSIZE-14px"
                  :style="{
                    paddingLeft: paddingTabela,
                    paddingRight: paddingTabela,
                    textAlign: 'center'
                  }"
                >
                  <span v-if="!tabelaAbastecimentoCarregada" class="loading-dots"></span>
                  <span v-else>{{ totalQuantidadeAbastecimentos }}</span>
                </div>

                <div class="WIDTH-18"></div>

              </div>

          </div>

          
        </div>
      </div>
      
      <Rodape />

   </div>
  </main>
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