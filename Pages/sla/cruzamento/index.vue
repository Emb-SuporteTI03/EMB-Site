<script setup>
import axios from "axios";
import { ref } from "vue";
import { shortenInfo, applyTableStipedRows } from '~/composables/visualization';
import { ToastSuccess, ToastError, ToastWarning } from '~/composables/toasts';
import { useAuthStore } from '~/stores/auth';
// VARIÁVEIS ------------------------------------------------------------------------------------------------------------

// Rota para obter o ID do cliente
const urlProd = useUrlProd();
const urlEstoque = useUrlEstoque();
const route = useRoute();
const urlBase = useUrlProd();

const authStore = useAuthStore();
const userID = ref(authStore.idUsuario);
// const userID_Unidade = ref(authStore.ID_Unidade).value;
// const userNome = ref(authStore.nome);
// const siglaUsuario = ref(authStore.sigla);
// const ID_Area = ref(authStore.ID_Unidade ?? 0);
const ID_Carteira = ref(authStore.idCarteira ?? 0);
const userRole = ref(authStore.idFuncao ?? "");

const logoPath = `/CLIENTES/${ID_Carteira.value}.png`;
const dataInicial = ref("")
const dataFinal = ref("")
dataInicial.value = new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0];
dataFinal.value = new Date().toISOString().split('T')[0];
const carregandoPDF = ref(false);

const tabelaAbastecimentoCarregada = ref(false);
const tabelaConsumoCarregada = ref(false);
const tituloModalPdfs = ref("");

const infosTableAbastecimentoSLA = ref([]);
const infosTableConsumoSLA = ref([]);
const staticInfosTableAbastecimentoSLA = ref([]); // Para manter os dados originais e poder limpar os filtros
const staticInfosTableConsumoSLA = ref([]); // Para manter os dados originais e poder limpar os filtros

const codProdutoSelectREF = ref(null);
const descProdutoSelectREF = ref(null);

const imagemComponente = ref(null);
const isLoadingEXCELRelatorio = ref(false);

const selectedCodProduto = ref(null)
// ({
//   id: null,
//   cNome: null
// })

const selectedDescProduto = ref(null)
// ({
//   id: null,
//   cNome: null
// })
const estoqueSinteticoComponente = ref(null);
const totalEntradas = ref(null);
const totalSaidas = ref(null);

const depositantesEscolhaFiltro = ref([]);
const mostrarTodosAbastecimentos = ref(false)
const mostrarTodosConsumos = ref(false)

const estoqueLogico = ref(null);
const estoqueSintetico = ref(null);

// PARA A BARRA DE TOTAL FICAR CORRETAMENTE ALINHADA ===========================\
const compensacaoScroll = ref('17');
const paddingTabela = ref('0.25rem');
const tabelaWrapperAbastecimento = ref(null);
const tabelaWrapperConsumo = ref(null);

const ajustarCompensacaoScrollAbastecimento = () => {
  const el = tabelaWrapperAbastecimento.value;
  if (!el) return;

  const temScroll =
    el.scrollHeight > el.clientHeight;

  compensacaoScroll.value = temScroll
    ? el.offsetWidth - el.clientWidth
    : 0;
};
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
// const produtoEscolhaFiltro = computed(() => {
//   const unicos = new Set();

//   infosTableAbastecimentoSLA.value.forEach(e => {
//     if (e.codigoComponente) unicos.add(e.codigoComponente);
//   });

//   infosTableConsumoSLA.value.forEach(e => {
//     if (e.codigoComponente) unicos.add(e.codigoComponente);
//   });

//   return Array.from(unicos).map((item, index) => ({
//     id: index + 1,
//     cNome: item
//   }));
// });

// const descProdutoEscolhaFiltro = computed(() => {
//   const unicos = new Set([
//     ...infosTableAbastecimentoSLA.value.map(e => e.descricaoComponente).filter(x => x),
//     ...infosTableConsumoSLA.value.map(e => e.descricaoComponente).filter(x => x)
//   ]);

//   return Array.from(unicos)
//     .sort((a, b) => a.localeCompare(b))
//     .map((item, index) => ({
//       id: index + 1,
//       cNome: item
//     }));
// });
const produtoEscolhaFiltro = ref([]);
const descProdutoEscolhaFiltro = ref([]);

const totalQuantidadeAbastecimento = computed(() => {
  const codProduto =
    selectedCodProduto.value?.cNome?.toLowerCase() ?? "";

  const descProduto =
    selectedDescProduto.value?.cNome?.toLowerCase() ?? "";

  return staticInfosTableAbastecimentoSLA.value
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
        (codProduto  ? comp.codigoComponente?.toLowerCase().includes(codProduto) : true) &&
        (descProduto ? comp.descricaoComponente?.toLowerCase().includes(descProduto) : true) &&
        dentroIntervalo
      );
    })
    .reduce((acc, e) => acc + (Number(e.quantidade) || 0), 0);
});
const totalQuantidadeConsumo = computed(() => {
  const codProduto =
    selectedCodProduto.value?.cNome?.toLowerCase() ?? "";

  const descProduto =
    selectedDescProduto.value?.cNome?.toLowerCase() ?? "";

  return staticInfosTableConsumoSLA.value
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
        (codProduto  ? comp.codigoComponente?.toLowerCase().includes(codProduto) : true) &&
        (descProduto ? comp.descricaoComponente?.toLowerCase().includes(descProduto) : true) &&
        dentroIntervalo
      );
    })
    .reduce((acc, e) => acc + (Number(e.quantidade) || 0), 0);
});

const infosTableAbastecimentoSLASlice = computed(() => {
  return mostrarTodosAbastecimentos.value
    ? infosTableAbastecimentoSLA.value
    : infosTableAbastecimentoSLA.value.slice(0, 50)
});
// --------------------------/

  const abrirModalVisualizaPDFs = async (ID_Pedido, TipoPDF) => {
    
    tituloModalPdfs.value = TipoPDF;
    
    showModal('VisualizarPDFs', true);

    carregandoPDF.value = true

    if(TipoPDF == 'PDF DANFE'){
      await getPDFDanfe(ID_Pedido);
    } else if(TipoPDF == 'PDF PEDIDO'){
      await getPDFPedido(ID_Pedido);
    }

    carregandoPDF.value = false;

  };
  const fecharModalVisualizaPDFs = () => {
    showModal('VisualizarPDFs', false);
  }
  const aplicaCorAoEstado = (estado) => {
    if (estado === 'BOM') {
      return 'BGC-verde-5 COLOR-green';
    } else {
      return 'BGC-vermelho-5 COLOR-red';
    }
  };

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


// FUNÇÕES DO FILTRO
const onchangeCodComponente = async () => {
  // zera os valores
  totalEntradas.value = null;
  totalSaidas.value = null;
  estoqueSintetico.value = null;
  estoqueLogico.value = null;
  imagemComponente.value = null;


  
  if(!selectedCodProduto.value) {

    selectedDescProduto.value = {
      id: null,
      cNome: null
    }
    
    selectedCodProduto.value = null;
    selectedDescProduto.value = null;
    totalEntradas.value = null;
    totalSaidas.value = null;
    infosTableAbastecimentoSLA.value = [];
    tabelaAbastecimentoCarregada.value = false;
    infosTableConsumoSLA.value = [];
    tabelaConsumoCarregada.value = false;
    
    return;
  }

  const registroDescricao = descProdutoEscolhaFiltro.value.find(comp => comp.id === selectedCodProduto.value.id) || null;
  selectedDescProduto.value = {
    id: null,
    cNome: null
  }
  selectedDescProduto.value.id = registroDescricao.id ?? null
  selectedDescProduto.value.cNome = registroDescricao?.cNome ?? null

  await getFotoComponente();
  await getAbastConsu();
  await getEstoqueSintetico();
  analisaEstoqueLogicoXSintetico();

};
const onchangeDescComponente = async () => {

  if (!selectedDescProduto.value) {
    selectedCodProduto.value = {
      id: null,
      cNome: null
    }

    selectedDescProduto.value = null
    selectedCodProduto.value = null

    infosTableAbastecimentoSLA.value = [];
    tabelaAbastecimentoCarregada.value = false;
    infosTableConsumoSLA.value = [];
    tabelaConsumoCarregada.value = false;

    return
  }

  const registroEncontrado = infosTableAbastecimentoSLA.value.find(comp => comp.descricaoComponente === selectedDescProduto.value.cNome) || null
  if (!registroEncontrado) {
    selectedCodProduto.value = infosTableConsumoSLA.value.find(comp => comp.descricaoComponente === selectedDescProduto.value.cNome) || null
  }
    
  selectedCodProduto.value = {
    id: null,
    cNome: null
  }

  const registroCodigo = produtoEscolhaFiltro.value.find(comp => comp.id === selectedDescProduto.value.id) || null;
  selectedCodProduto.value = {
    id: null,
    cNome: null
  }
  selectedCodProduto.value.id = registroCodigo.id ?? null
  selectedCodProduto.value.cNome = registroCodigo?.cNome ?? null

  await getFotoComponente();
  await getAbastConsu();
  await getEstoqueSintetico();
  analisaEstoqueLogicoXSintetico();
}

const aplicarFiltros = async () => {
  const codProduto =
    selectedCodProduto.value?.cNome?.toLowerCase() ?? "";

  const descProduto =
    selectedDescProduto.value?.cNome?.toLowerCase() ?? "";

  infosTableAbastecimentoSLA.value = staticInfosTableAbastecimentoSLA.value.filter(comp => {
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
      (codProduto     ? comp.codigoComponente?.toLowerCase().includes(codProduto) : true) &&
      (descProduto    ? comp.descricaoComponente?.toLowerCase().includes(descProduto) : true) &&
      dentroIntervalo
    );
  });

  infosTableConsumoSLA.value = staticInfosTableConsumoSLA.value.filter(comp => {
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
      (codProduto     ? comp.codigoComponente?.toLowerCase().includes(codProduto) : true) &&
      (descProduto    ? comp.descricaoComponente?.toLowerCase().includes(descProduto) : true) &&
      dentroIntervalo
    );
  });

  await nextTick();

  ajustarCompensacaoScrollAbastecimento();
  ajustarCompensacaoScrollConsumo();
};
const analisaEstoqueLogicoXSintetico = () => {
  estoqueLogico.value = null;
  estoqueSintetico.value = null;
  const labelEstoqueLogico = document.getElementById('estoquelogico-label');
  const labelEstoqueSintetico = document.getElementById('estoquesintetico-label');
  if (labelEstoqueLogico) {
    labelEstoqueLogico.classList.remove('red-asterisk');
    labelEstoqueLogico.classList.remove('BGC-input-attention');
    labelEstoqueLogico.classList.add('BGC-input-disabled');
  }
  if (labelEstoqueSintetico) {
    // labelEstoqueSintetico.classList.remove('red-asterisk');
    // labelEstoqueSintetico.classList.remove('BGC-input-attention');
    // labelEstoqueSintetico.classList.add('BGC-input-disabled');
  }

  estoqueLogico.value = (totalEntradas.value || 0) - (totalSaidas.value || 0);
  estoqueSintetico.value = estoqueSinteticoComponente?.value || 0;

  if (estoqueLogico.value != estoqueSintetico.value) {
    ToastError(`Atenção: Informações de estoque conflitantes. Verifique as movimentações.`);

    if (labelEstoqueLogico) {
      labelEstoqueLogico.classList.add('red-asterisk');
      labelEstoqueLogico.classList.add('BGC-input-attention');
      labelEstoqueLogico.classList.remove('BGC-input-disabled');
    }
    if (labelEstoqueSintetico) {
      // labelEstoqueSintetico.classList.add('red-asterisk');
      // labelEstoqueSintetico.classList.add('BGC-input-attention');
      // labelEstoqueSintetico.classList.remove('BGC-input-disabled');
    }
  }
};
// REQUISIÇÕES
async function getInfosAbastecimentoSLA() {
  const authStore = useAuthStore();

  try {
    const response = await axios.get(
      `${urlProd}/consultas-sla/sla-abastecimento/${ID_Carteira.value}?idComponente=${selectedCodProduto.value.id}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`
        }
      }
    );

    infosTableAbastecimentoSLA.value = response.data;
    staticInfosTableAbastecimentoSLA.value = response.data;

  } catch (response) {
    console.error("Erro ao buscar dados:");
  }
};

async function getInfosConsumoSLA() {
  const authStore = useAuthStore();
  try {
    const response = await axios.get(
      `${urlProd}/consultas-sla/sla-consumo/${ID_Carteira.value}?idComponente=${selectedCodProduto.value.id}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`
        }
      }
    );
    
    infosTableConsumoSLA.value = response.data;
    staticInfosTableConsumoSLA.value = response.data;
    
  } catch (response) {
    console.error("Erro ao buscar dados:");
  } finally {
  }
};
async function getEstoqueSintetico() {
  const authStore = useAuthStore();
  try {
    const response = await axios.get(
      `${urlProd}/consultas-sla/quantidade-sintetica-componente?idComponente=${selectedCodProduto.value.id}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`
        }
      } 
    );
    estoqueSinteticoComponente.value = response.data.quantidadeComp;
    totalEntradas.value = response.data.totalEntradas;
    totalSaidas.value = response.data.totalSaidas;
  } catch (response) {
    console.error("Erro ao buscar dados:");
  } finally {
  }
};
const getComponentesEscolhaFiltro = async () => {
  const authStore = useAuthStore();
  codProdutoSelectREF.value.desabilitar();
  descProdutoSelectREF.value.desabilitar();
  tabelaAbastecimentoCarregada.value = false;
  tabelaConsumoCarregada.value = false;

  try {
    const response = await axios.get(
      `${urlProd}/consultas-sla/componentes-cruzamento-AC/${ID_Carteira.value}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token ?? ''}`
        }
      }
    );
    produtoEscolhaFiltro.value = response.data.codigosComponentes;
    descProdutoEscolhaFiltro.value = response.data.descricoesComponentes;
  } catch (response) {
    console.error("Erro ao buscar dados:");
  }

  codProdutoSelectREF.value.habilitar()
  descProdutoSelectREF.value.habilitar();

};
const getFotoComponente = async () => {
  const authStore = useAuthStore();

  try {
    const url = `${urlEstoque.value}/foto-componente/get-foto/${selectedCodProduto.value.id}`;

    // Faz uma requisição direta para verificar se a imagem existe
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${authStore.token ?? ''}` }, // Inclui cabeçalho de autenticação
      responseType: "blob", // Garante que a resposta será tratada como um arquivo binário
    });

    if (response.status === 200) {
      // Cria um URL temporário para exibir o blob como imagem
      imagemComponente.value = URL.createObjectURL(response.data);
    } else {
      imagemComponente.value = null;
    }
  } catch (error) {
    console.error("Erro ao recuperar a imagem:", error);
    imagemComponente.value = null;
  }
};

const getAbastConsu = async () => {
  tabelaAbastecimentoCarregada.value = false;
  tabelaConsumoCarregada.value = false;
  
  await getInfosAbastecimentoSLA();
  await getInfosConsumoSLA();
  
  await aplicarFiltros();

  tabelaConsumoCarregada.value = true;
  tabelaAbastecimentoCarregada.value = true;

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

  await getAbastConsu();
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

  await getAbastConsu();
};
let onClickLimparFiltros = () => {
  dataInicial.value = new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0];
  dataFinal.value = new Date().toISOString().split('T')[0];

  selectedCodProduto.value.id = null;
  selectedCodProduto.value.cNome = null;
  selectedDescProduto.value.id = null;
  selectedDescProduto.value.cNome = null;

  infosTableAbastecimentoSLA.value = staticInfosTableAbastecimentoSLA.value;
  infosTableConsumoSLA.value = staticInfosTableConsumoSLA.value;
};

const onClickExportarExcel = async () => {
  ToastWarning("Exportar EXCEL em desenvolvimento");
};

  const onClickExportarPDF = async () => {
    ToastWarning("Exportar PDF em desenvolvimento");
  };
  
  const onClickExportarExcelAnaliseCompleta = async () => {
    // https://localhost:7116/api/estoque/componente-vao/analise-estoque-excel/5054

    ToastWarning('Aguarde enquanto o documento é gerado...');

    isLoadingEXCELRelatorio.value = true;
    const authStore = useAuthStore();

    try {
      const url = `${urlProd}/estoque/componente-vao/analise-estoque-excel/${ID_Carteira.value}`;

      const response = await axios.get(
        url,
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
      // let fileName = `SLA_SAIDAS_${cliente.value.cNmFantasia}.xlsx`;
      let fileName = `ANALISE_ESTOQUE_COMPLETO_${ID_Carteira.value}.xlsx`;
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

  const downloadJustificativa = async (ID_MovSaida) => {
    try {
      if (!ID_MovSaida) {
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
        ToastError('Erro ao baixar o arquivo: ARQUIVO NÃO EXISTE');
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
  };

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

// Corrigir quando há barra de rolagem:
const paddingConsummoClass = computed(() =>
  infosTableConsumoSLA.value.length <= 9
    ? 'PADDING-2'
    : 'PADDING-T3-R13-B3-L10'
);

// MOUNTED DA PÁGINA
onMounted(async () => {
  // await getAbastConsu();
  // ToastWarning("Aguarde enquanto os componentes são carregados...");
  await getComponentesEscolhaFiltro();

  nextTick(() => {
    ajustarCompensacaoScrollAbastecimento();

    let td = tabelaWrapperAbastecimento.value
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
        funcionalidadeProp="CRUZAMENTO A/C"
        :destinoVoltarProp="`/sla`"
        :srcFoto="logoPath"
      />
      
      <!-- ESPAÇO CORPO -->
      <div class="D-flex FD-column HEIGHT-88vh WIDTH-100 JC-center ALITEM-center BGC-cinza-9 BOR-branca">
        <div class="D-flex FD-column ALITEM-center JC-center HEIGHT-95 WIDTH-98 BORRAD-5 BGC-branco PADDING-T5-B10">

          <!-- Filtros -->
          <div class="D-flex JC-space-between HEIGHT-20 WIDTH-98 mb-3">

            <div class="D-flex WIDTH-100 JC-space-between">
              
              <!-- Decoração FILTROS -->
              <div class="WIDTH-6 BGC-azul-esverdeado COLOR-white ALITEM-center BORRAD-5 FWEIGHT-bold D-flex FD-column JC-space-between">
                <p>Filtros</p>
                <button type="button" class="btn btn-dark WIDTH-75 FSIZE-12px mb-1" @click="onClickLimparFiltros">Limpar</button>
              </div>

              <!-- DIV CENTRAL -->
              <div class="D-flex WIDTH-25 FD-column PADDING-T5-R5-B5-L10">
                
                  <!-- Filtro de DATAS -->
                  <!-- <div class="WIDTH-98-5 D-flex JC-space-between  ALITEM-center MARGIN-T13">
              
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

                  </div> -->

                  <!-- Codigo produto -->
                  <BasicElementVue3SelectPequeno
                    ref="codProdutoSelectREF"
                    optionLabel="cNome"
                    :options="produtoEscolhaFiltro"
                    v-model="selectedCodProduto"

                    @update:modelValue="onchangeCodComponente"
                    
                    label="COD. PRODUTO:"
                    :titulo="selectedCodProduto?.cNome"

                    :divClass="'MARGIN-T21 WIDTH-100'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px MARGIN-T-15'"
                    :widthLista="''"
                  />

                  <!-- Descrição produto -->
                  <BasicElementVue3SelectPequeno
                    ref="descProdutoSelectREF"
                    optionLabel="cNome"
                    :options="descProdutoEscolhaFiltro"
                    v-model="selectedDescProduto"

                    @update:modelValue="onchangeDescComponente"
                    
                    label="DESCRIÇÃO DO PRODUTO:"
                    :titulo="selectedDescProduto?.cNome"

                    :divClass="'MARGIN-T21 WIDTH-100'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px MARGIN-T-15'"
                    :widthLista="'600px'"
                  /> 

              </div>

              <div class="D-flex WIDTH-39 FD-column PADDING-T5-R5-B5-L10 BOR-L-solidgrey-1">

                <div v-if="!(selectedCodProduto?.cNome && selectedDescProduto?.cNome)" class="WIDTH-100 HEIGHT-100 D-flex JC-flex-start ALITEM-flex-end"></div>
                <div v-if="selectedCodProduto?.cNome && selectedDescProduto?.cNome" class="WIDTH-98 MARGIN-L1P HEIGHT-100 D-flex JC-flex-start ALITEM-flex-end BOR-SensacaoAfundado">

                    <div class="D-Flex HEIGHT-100 WIDTH-33 p-2">
                      <div class="WIDTH-100 HEIGHT-100 D-flex JC-center ALITEM-center BGC-cinza-8 BORRAD-5">
                        <a 
                          v-if="imagemComponente" 
                          :href="imagemComponente" 
                          target="_blank" 
                          class="text-decoration-none WIDTH-100 HEIGHT-100 D-flex"
                        >
                          <img 
                            :src="imagemComponente" 
                            alt="Imagem do componente" 
                            class="WIDTH-100 HEIGHT-100 BORRAD-5" 
                            style="object-fit: fill; cursor: pointer; "
                          />
                        </a>

                        <div v-else class="D-flex JC-center ALITEM-center WIDTH-100 HEIGHT-100 TEXTALI-center">Imagem não disponível</div>
                      </div>
                    </div>
                    <div class="D-Flex HEIGHT-100 WIDTH-65 FD-Column">

                      <div class="WIDTH-100 d-flex">

                        <div class="WIDTH-49 MARGIN-R2P">
                          <label
                            class="form-label BORRAD-5 FSIZE-10px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                            >ABASTECIMENTO TOTAL</label>
                          <input 
                          autocomplete="off"
                          id="estoquelogico-input"
                          type="text"
                          class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE"
                          disabled
                          :value="totalEntradas"
                          >
                        </div>

                        <div class="WIDTH-49">
                          <label
                            class="form-label BORRAD-5 FSIZE-10px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                            >CONSUMO TOTAL</label>
                          <input 
                          autocomplete="off"
                          id="estoquelogico-input"
                          type="text"
                          class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE"
                          disabled
                          :value="totalSaidas"
                          >
                        </div>

                      </div>

                      <div class="WIDTH-100 d-flex">

                        <div class="WIDTH-49 MARGIN-R2P">
                          <label
                            id="estoquesintetico-label"
                            for="estoquelogico-input"
                            class="form-label BORRAD-5 FSIZE-10px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                            >ESTOQUE ATUAL</label>
                            <input 
                            autocomplete="off"
                            id="estoquelogico-input"
                            type="text"
                            class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE"
                            disabled
                            :value="estoqueSintetico"
                            >
                          </div>

                          <div class="WIDTH-49 ">
                            <label
                              id="estoquelogico-label"
                              for="estoquelogico-input"
                              class="form-label BORRAD-5 FSIZE-10px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-disabled"
                              >SALDO LÓGICO</label>
                            <input 
                            autocomplete="off"
                            id="estoquelogico-input"
                            type="text"
                            class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE"
                            disabled
                            :value="estoqueLogico"
                            >
                          </div>

                      </div>

                    </div>
                    
                </div>

              </div>

              <!-- BOTÕES -->
              <div class="WIDTH-30 HEIGHT-100 D-flex FD-column JC-flex-end ALITEM-flex-end BOR-L-solidgrey-1 PADDING-T5-R5-B5-L10">
                <div class="WIDTH-100 HEIGHT-50 D-flex JC-flex-end ALITEM-flex-start">
                  <button id="exportar-EXCEL-button" type="button"
                    class="btn btn-success FSIZE-14px PADDING-4" @click="onClickExportarExcelAnaliseCompleta()">
                    <IconsExcel corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                    Exportar EXCEL - Análise completa</button>
                </div>

                <div class="WIDTH-100 HEIGHT-50 D-flex JC-flex-end ALITEM-flex-end " >

                  <div style="margin-right: 10px; cursor: pointer;" @click="getAbastConsu()" title="Atualizar informações">
                    <IconsRefresh
                      corProp="rgb(24, 134, 84)"
                      alturaProp="1.6"
                      larguraProp="1.6"
                    />
                  </div>

                  <!-- Botões de EXPORTAR -->
                  <div>
                    <button id="exportar-EXCEL-button" type="button"
                      class="btn btn-success MARGIN-R5 FSIZE-14px PADDING-4" @click="onClickExportarExcel()">
                      <IconsExcel corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                      Exportar EXCEL</button>
                      
                    <button id="exportar-PDF-button" type="button"
                      class="btn btn-warning FSIZE-14px PADDING-4" @click="onClickExportarPDF()">
                      <IconsPDF corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                      Exportar PDF
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>

          <div class="D-flex FD-column HEIGHT-80 WIDTH-98 JC-flex-start ALITEM-center BGC-cinza-9 BOR-branca OFLOW-auto">

            <!-- TABELA 1 ================================================= -->
            <div class="BOR-SensacaoAfundado WIDTH-100 HEIGHT-50 mb-1">
                      
              <!-- Tabela -->
              <div class="HEIGHT-90 OFLOW-auto" ref="tabelaWrapperAbastecimento" @scroll="ajustarCompensacaoScrollAbastecimento">
              
                <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5 table-fixed FSIZE-PADRAO-TABLE">
                  <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                    <tr>
                      <th class="WIDTH-2 TEXTALI-center" scope="col"></th>
                      <th class="WIDTH-12 TEXTALI-center" scope="col">Data</th>
                      <th class="WIDTH-10 TEXTALI-center" scope="col">Código</th>
                      <th class="WIDTH-27 TEXTALI-center" scope="col">Descrição do Produto</th>
                      <th class="WIDTH-10 TEXTALI-center" scope="col">Família</th>
                      <th class="WIDTH-8 TEXTALI-center" scope="col">Lote</th>
                      <th class="WIDTH-8 TEXTALI-center" scope="col">Edição</th>
                      <th class="WIDTH-5 TEXTALI-center" scope="col">Qtd.</th>
                      <th class="WIDTH-5 TEXTALI-center" scope="col">Estado</th>
                      <th class="WIDTH-13 TEXTALI-center" scope="col">Motivo Entrada</th>
                    </tr>
                  </thead>

                  <tbody v-if="!tabelaAbastecimentoCarregada && !(selectedCodProduto?.cNome && selectedDescProduto?.cNome)" class="BORRAD-5">
                    <tr>
                      <td colspan="10" class="HEIGHT-5px WIDTH-100 TEXTALI-center FWEIGHT-bold FSIZE-14px PADDING-2">
                        Selecione um produto para visualizar os dados de abastecimento.
                      </td>
                    </tr>
                  </tbody>

                  <LayoutTabelaCarregarEsqueleto v-if="!tabelaAbastecimentoCarregada && (selectedCodProduto?.cNome && selectedDescProduto?.cNome)"
                    :Linhas="12" :Colunas="10" />
                  
                    <tbody v-else class="BORRAD-5">
                    <tr
                      v-for="(entrada, i) in infosTableAbastecimentoSLA" :key="i"
                      class="BGC-H-cinza-8 HEIGHT-5px CURSOR-pointer"
                      :class="applyTableStipedRows(i)"
                      >
                      <td class="HEIGHT-5px WIDTH-2 TEXTALI-center" scope="row"></td>
                      <td class="HEIGHT-5px WIDTH-12 TEXTALI-center TableElipsis" :title="entrada.dataHoraEntrada" >{{ entrada.dataHoraEntrada }}</td>
                      <td class="HEIGHT-5px WIDTH-10 TEXTALI-center TableElipsis" :title="entrada.codigoComponente" >{{ entrada.codigoComponente }}</td>
                      <td class="HEIGHT-5px WIDTH-27 TEXTALI-left TableElipsis" :title="entrada.descricaoComponente" >{{ entrada.descricaoComponente }}</td>
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

              <!-- Botão de VER MAIS e VER MENOS -->
              <!-- <div class="WIDTH-100 mb-2">
                <button @click="mostrarTodosAbastecimentos = !mostrarTodosAbastecimentos" class="btn btn-secondary WIDTH-100 FSIZE-11px">
                  {{ mostrarTodosAbastecimentos ? `Ver menos...` : `Ver mais... (${infosTableAbastecimentoSLA.length})` }}
                </button>
              </div> -->

              <div class="HEIGHT-10 WIDTH-100 D-flex ALITEM-center BOR-B-R-RAD-5 mb-2 totais-barra"
              :style="{
                  background: hexToRgba('#9E9E9E', 0.6),
                  paddingRight: compensacaoScroll + 'px'
                }"
              >

                <div class="WIDTH-40 FWEIGHT-bold FSIZE-14px PADDING-1">
                  TOTAL:
                </div>

                <div class="WIDTH-20 D-flex JC-center">
                  <button @click="mostrarTodosAbastecimentos = !mostrarTodosAbastecimentos" 
                  class="btn btn-soft btn-compact WIDTH-100 FSIZE-11px">
                    {{ mostrarTodosAbastecimentos ? `Ver menos...` : `Ver mais... (${infosTableAbastecimentoSLA.length})` }}
                  </button>
                </div>

                <div class="WIDTH-17"></div>

                <div
                  class="WIDTH-5 FWEIGHT-bold FSIZE-14px"
                  :style="{
                    paddingLeft: paddingTabela,
                    paddingRight: paddingTabela,
                    textAlign: 'center'
                  }"
                >
                  <span v-if="!tabelaAbastecimentoCarregada" class="loading-dots"></span>
                  <span v-else>{{ totalQuantidadeAbastecimento }}</span>
                </div>

                <div class="WIDTH-18"></div>

              </div>

            </div>

            <!-- TABELA 2 ================================================= -->
            <div class="BOR-SensacaoAfundado OFLOW-auto WIDTH-100 HEIGHT-49">

              <div class="HEIGHT-90 OFLOW-auto"  ref="tabelaWrapperConsumo" @scroll="ajustarCompensacaoScrollConsumo">
              
              <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5 table-fixed FSIZE-PADRAO-TABLE">
                <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                  <tr>
                    <!-- <th class="WIDTH-2 TEXTALI-center" scope="col"></th> -->
                    <th class="WIDTH-2 TEXTALI-center" scope="col"></th>
                    <th class="WIDTH-12 TEXTALI-center" scope="col">Data</th>
                    <th class="WIDTH-10 TEXTALI-center" scope="col">Código</th>
                    <th class="WIDTH-36 TEXTALI-center" scope="col">Descrição do Produto</th>
                    <th class="WIDTH-17 TEXTALI-center" scope="col">Motivo Saída</th>
                    <th class="WIDTH-5 TEXTALI-center" scope="col">Qtd.</th>
                    <th class="WIDTH-18 TEXTALI-center" scope="col">Complemento</th>
                  </tr>
                </thead>

                <tbody v-if="!tabelaConsumoCarregada && !(selectedCodProduto?.cNome && selectedDescProduto?.cNome)" class="BORRAD-5">
                  <tr>
                    <td colspan="10" class="HEIGHT-5px WIDTH-100 TEXTALI-center FWEIGHT-bold FSIZE-14px PADDING-2">
                      Selecione um produto para visualizar os dados de abastecimento.
                    </td>
                  </tr>
                </tbody>


                <LayoutTabelaCarregarEsqueleto  v-if="!tabelaConsumoCarregada && (selectedCodProduto?.cNome && selectedDescProduto?.cNome)"
                  :Linhas="infosTableConsumoSLA.length === 0 ? 15 : infosTableConsumoSLA.length" :Colunas="7" />
                
                  <tbody v-if="tabelaConsumoCarregada" class="BORRAD-5">
                  <tr
                    v-for="(consumo, i) in infosTableConsumoSLA" :key="i"
                    class="BGC-H-cinza-8 HEIGHT-5px CURSOR-pointer"
                    :class="applyTableStipedRows(i)"
                    >
                      <!-- <td class="HEIGHT-5px WIDTH-2 TEXTALI-center" scope="row">
                        <button
                          type="button"
                          class="in-table-button"
                          title="Visualizar pedido"
                          @click="OnClickLupa">
                          <IconsLupa corProp="currentColor" alturaProp="1" larguraProp="1"/>  
                        </button>
                      </td> -->

                      <!-- INCOMPLETO FALTA JUNTAR O REGISTRO DAQUI COM O PEDIDO  -->
                      <!-- <td class="HEIGHT-5px no-wrap-text WIDTH-2 TEXTALI-center" scope="row">
                        <button type="button" class="in-table-button" title="Visualizar Pedido" 
                        @click="abrirModalVisualizaPDFs(consumo.idSaida, 'PDF PEDIDO')">
                          <IconsLupa corProp="currentColor" alturaProp="1" larguraProp="1"/>  
                        </button>
                      </td>
                      <td class="HEIGHT-5px no-wrap-text WIDTH-2 TEXTALI-center" scope="row">
                        <button type="button" class="in-table-button" title="Visualizar Cópia do DANFE" 
                        @click="abrirModalVisualizaPDFs(consumo.idSaida, 'PDF DANFE')">
                          <IconsConsulta corProp="currentColor" alturaProp="1" larguraProp="1"/>  
                        </button>
                      </td>
                      <td class="HEIGHT-5px WIDTH-1 TEXTALI-center TableElipsis" scope="row">
                        <button
                          v-if="consumo.complementoSaida === 'SAÍDA MANUAL DO ESTOQUE' "
                          type="button"
                          class="in-table-button"
                          title="Baixar justificativa da saída"
                          @click="downloadJustificativa(consumo.idSaida)"
                          ><IconsConsulta corProp="currentColor" alturaProp="1" larguraProp="1"/>  
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
                      <td class="HEIGHT-5px WIDTH-10 TEXTALI-center TableElipsis" :title="consumo.codigoComponente" >{{ consumo.codigoComponente }}</td>
                      <td class="HEIGHT-5px WIDTH-36 TEXTALI-left TableElipsis" :title="consumo.descricaoComponente" >{{ consumo.descricaoComponente }}</td>
                      <td class="HEIGHT-5px WIDTH-17 TEXTALI-center TableElipsis" :title="consumo.complementoSaida" >{{ consumo.complementoSaida }}</td>
                      <td class="HEIGHT-5px WIDTH-5 TEXTALI-center TableElipsis" :title="consumo.quantidade" >{{ consumo.quantidade }}</td>
                      <td class="HEIGHT-5px WIDTH-18 TEXTALI-center TableElipsis" :title="consumo.motivo" >{{ consumo.motivo }}</td>
                  </tr>
                </tbody>
              </table>

              </div>
              
              <!-- <div class="WIDTH-100">
                <button @click="mostrarTodosConsumos = !mostrarTodosConsumos" class="btn btn-secondary WIDTH-100 FSIZE-11px">
                  {{ mostrarTodosConsumos ? `Ver menos...` : `Ver mais... (${infosTableConsumoSLA.length})` }}
                </button>
              </div> -->

                <!-- Botão de VER MAIS e VER MENOS -->
              <div class="HEIGHT-10 WIDTH-100 D-flex ALITEM-center BOR-B-R-RAD-5 totais-barra"
              :style="{
                  background: hexToRgba('#9E9E9E', 0.6),
                  paddingRight: compensacaoScroll + 'px'
                }"
              >

                <div class="WIDTH-40 FWEIGHT-bold FSIZE-14px PADDING-1">
                  TOTAL:
                </div>

                <div class="WIDTH-20 D-flex JC-center">
                  <button
                    @click="mostrarTodosConsumos = !mostrarTodosConsumos"
                    class="btn btn-soft btn-compact WIDTH-100 FSIZE-11px">
                    {{ mostrarTodosConsumos ? 'Ver menos...' : `Ver mais... (${infosTableConsumoSLA.length})` }}
                  </button>
                </div>

                <div class="WIDTH-17"></div>

                <div
                  class="WIDTH-5 FWEIGHT-bold FSIZE-14px"
                  :style="{
                    paddingLeft: paddingTabela,
                    paddingRight: paddingTabela,
                    textAlign: 'center'
                  }"
                >
                  <span v-if="!tabelaConsumoCarregada" class="loading-dots"></span>
                  <span v-else>{{ totalQuantidadeConsumo }}</span>
                </div>

                <div class="WIDTH-18"></div>
                  
              </div>

            </div>

          </div>

        </div>
      </div>
      
      <Rodape />

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
        <div id="insert-modal-corpo" class="BOR-B-grey-2 HEIGHT-80vh D-flex FD-column PADDING-20">
    
          <!-- DIV com PDFs -->
          <div class="D-flex WIDTH-100 HEIGHT-100">
         
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
        </div>

    </div>
  </div>
</div>


  </main>
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

</style>