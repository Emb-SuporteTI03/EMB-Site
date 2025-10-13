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
const token = useToken();
const dataInicial = ref("")
const dataFinal = ref("")
dataInicial.value = new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0];
dataFinal.value = new Date().toISOString().split('T')[0];

const nfProcura = ref("");
const nfModal = ref("");
const mostrarTodos = ref(false);

const tabelaNOTASCarregada = ref(false);

const infosTableNotasSLA = ref([]);
const staticinfosTableNotasSLA = ref([]); // Para manter os dados originais e poder limpar os filtros

const arquivoSelecionado = ref(null);
const preview = ref(null);

const cliente = ref({
  iD_Cliente: '',
  cNmFantasia: '',
});

const informarEntregaRequest = ref({
  cDocRecebedor: '',
  cNomeRecebedor: '',
  cNFTransp: '',
  iIdCliente: null,
});

// FUNÇÕES ---------------------------------------------------------------------------------------------------------------
// Computeds ----------------\

// --------------------------/

// FUNÇÕES DO FILTRO


// REQUISIÇÕES
async function fetchCliente() {
  
  try {
    const response = await axios.get(`${urlProd.value}/usuario-externo/cliente`, {
      headers: { Authorization: `Bearer ${useToken().value}` }
    });
    
    const data = response.data;

    cliente.iD_Cliente = data.iD_Cliente;
    cliente.cNmFantasia = data.cNmFantasia;
    informarEntregaRequest.value.iIdCliente = cliente.iD_Cliente;

  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
  }
}
async function carregaTabelaNOTAS() {
  try 
  {
    tabelaNOTASCarregada.value = false;

    const response = await axios.get(`${urlProd.value}/entrega/lista-notas?idCliente=${cliente.iD_Cliente}`, {
      headers: { Authorization: `Bearer ${useToken().value}` }
    });

    infosTableNotasSLA.value = response.data;
    staticinfosTableNotasSLA.value = response.data; // Mantém uma cópia dos dados originais

    tabelaNOTASCarregada.value = true;
  } 
  catch (error) 
  {
    console.error("Erro ao carregar tabela de ENTREGAS:", error);
    ToastError("Erro ao carregar tabela de ENTREGAS.");
  }
}
async function buscaNFEntrega(NFEntrega) {
  try 
  {
    const response = await axios.get(`${this.urlProd}/entrega/confere-nota?nfEntrega=${NFEntrega}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  } 
  catch (error) 
  {
    console.error("Erro ao buscar NF de Entrega:", error);
    ToastError("Erro ao buscar NF de Entrega.");
  }
}
async function informarEntregaReq(formData) {
  try {
    const response = await axios.post(
      `${urlProd.value}/entrega/sla-informar-entrega`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    ToastSuccess("Entrega informada com sucesso!");

    console.log("Resposta da API:", response.data);

    return response.data;
  } catch (error) {
    ToastError("Erro ao informar entrega:");
    console.log(error);
  }
}


// FUNÇÕES DO MODAL
async function abrirModalInformarEntrega(nfEntrega) {

  nfModal.value = nfEntrega;

  const modalEl = document.getElementById('entregaModal');
  
  if (modalEl) {
    // Verifica se o modal já tem uma instância
    let modalInstance = bootstrap.Modal.getInstance(modalEl);

    // Se não tiver, cria uma nova instância
    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(modalEl);
    }

    // Exibe o modal
    modalInstance.show();
  }
}
async function confirmarEntregaBtnClick() {
  // Atualiza o DTO com os valores do formulário
  informarEntregaRequest.value.cNFTransp = nfModal.value;

  // Cria FormData
  const formData = new FormData();
  // Adiciona campos do DTO
  for (const key in informarEntregaRequest.value) {
    formData.append(key, informarEntregaRequest.value[key]);
  }

  // Adiciona o arquivo
  if (arquivoSelecionado.value) {
    formData.append("canhoto", arquivoSelecionado.value);
  }

  const respostaApi = await informarEntregaReq(formData);

  console.log(respostaApi)

  if(respostaApi.message == "Entrega atualizada com sucesso!") {
    
    const modalEl = document.getElementById('entregaModal');
  
    if (modalEl) {

      // Verifica se o modal já tem uma instância
      let modalInstance = bootstrap.Modal.getInstance(modalEl);

      // Se não tiver, cria uma nova instância
      if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalEl);
      }

      // Fecha o modal
      modalInstance.hide();
    }

  }

  await carregaTabelaNOTAS();

}

// FUNÇÕES AUXILIARES
function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  arquivoSelecionado.value = file;

  // Cria preview da imagem
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.value = e.target.result;
  };
  reader.readAsDataURL(file);
}
function removerImagem() {
  arquivoSelecionado.value = null;
  preview.value = null;

  // Limpa o input file
  const input = document.getElementById('fileInput');
  if (input) input.value = '';
}

// MOUNTED DA PÁGINA
onMounted(async () => {
  await fetchCliente();
  await carregaTabelaNOTAS();
});

</script>


<template>
  
  <main class="D-flex">

    <!-- Todo o Conteúdo da página -->
    <div class="D-flex FD-column WIDTH-100 HEIGHT-100vh OFLOW-auto">

      <!-- Menu Superior -->
      <MenuSuperiorEstoque
        funcionalidadeProp="INFORMAR ENTREGA"
        destinoVoltarProp="/"
      />
      
      <!-- ESPAÇO CORPO -->
      <div class="D-flex FD-column HEIGHT-90vh WIDTH-100 JC-center ALITEM-center BGC-cinza-9 BOR-branca">
        <div class="D-flex FD-column ALITEM-center HEIGHT-90 WIDTH-98 BORRAD-5 BGC-branco PADDING-T5-B10">

            <!-- Filtros -->
            <div class="D-flex JC-space-between WIDTH-98 mb-1 ">
            
              <!-- DIV esquerda -->
              <div class="D-flex WIDTH-100">
              
                <!-- Inputs de Filtro + Toggle de Estado do material -->
                <div class="D-flex WIDTH-89 BORRAD-5">
                  <!-- Inputs de Filtro -->
                  <div class="WIDTH-100 ">
                  <!-- OFLOW-Y-scroll -->

                    <!-- EDIÇÃO -->
                    <div class="row">
                      
                      <!-- INFORMAÇÃO ADICIONAL -->
                      <div class="input-group input-group-sm WIDTH-30 ">
                        <span class="btn btn-outline-secondary" @click="abrirModalInformarEntrega()">
                          <IconsLupa corProp="black" alturaProp="1.5" larguraProp="1.5" />
                        </span>
                        <input
                          autocomplete="off"
                          id="barra-procura"
                          type="text"
                          class="form-control BOR-grey"
                          placeholder="Buscar Nota Fiscal de Entrega"
                          v-model="nfProcura"
                          />
                      </div>
                      
                    </div>

                  </div>

                </div>

              </div>

            </div>

            <!-- Tabela -->
            <div class="OFLOW-auto WIDTH-98 HEIGHT-85 BOR-SensacaoAfundado mb-1">
            
              <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5 table-fixed">
                <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                  <tr>
                    <th class="WIDTH-3 TEXTALI-center" scope="col"></th>
                    <th class="WIDTH-7 TEXTALI-center" scope="col">Data NF</th>
                    <th class="WIDTH-6 TEXTALI-center" scope="col">NF Entrega</th>
                    <th class="WIDTH-7 TEXTALI-center" scope="col">Recebidor</th>
                    <th class="WIDTH-8 TEXTALI-center" scope="col">Doc. Recebidor</th>
                    <th class="WIDTH-10 TEXTALI-center" scope="col">Data Entrega</th>
                    <th class="WIDTH-3 TEXTALI-center" scope="col"></th>
                  </tr>
                </thead>
                <LayoutTabelaCarregarEsqueleto v-if="!tabelaNOTASCarregada"
                  :Linhas="12" :Colunas="7" />
                
                  <tbody v-if="tabelaNOTASCarregada" class="BORRAD-5">
                  <tr
                    v-for="(nota, i) in infosTableNotasSLA" :key="i"
                    class="BGC-H-cinza-8 HEIGHT-5px CURSOR-pointer"
                    :class="applyTableStipedRows(i)"
                    >
                    <td class="HEIGHT-5px WIDTH-3 TEXTALI-center" scope="row" :title="nota.dataTramite" >
                        <button type="button" class="in-table-button" title="Visualizar detalhes do Trâmite" @click="abrirModalInformarEntrega(nota.nfEntrega)">
                          <IconsCaminhao v-if="!nota.dataEntrega" corProp="currentColor" alturaProp="1" larguraProp="1"/>  
                          <IconsLapis v-else corProp="currentColor" alturaProp="1" larguraProp="1"/>  

                        </button>
                      </td>
                      <td class="HEIGHT-5px WIDTH-7 TEXTALI-center" scope="row" :title="nota.dataTramite" >{{ nota.dataNF }}</td>
                      <td class="HEIGHT-5px WIDTH-6 TEXTALI-center" :title="nota.idTramite" >{{ nota.nfEntrega }}</td>
                      <td class="HEIGHT-5px WIDTH-7 TEXTALI-left" :title="nota.protocoloProduto" >{{ nota.recebidor }}</td>
                      <td class="HEIGHT-5px WIDTH-8 TEXTALI-center" :title="nota.numeroNFE" >{{ nota.docRecebidor }}</td>
                      <td class="HEIGHT-5px WIDTH-10 TEXTALI-center" :title="nota.codigoComponente" >{{ nota.dataEntrega }}</td>
                      <td class="HEIGHT-5px WIDTH-3 TEXTALI-center" scope="row" :title="nota.dataTramite" >
                        <button type="button" class="in-table-button" title="Visualizar detalhes do Trâmite" @click="AbrirModalDetalhesTramite(nota.idTramite)">
                          <IconsLupa corProp="currentColor" alturaProp="1" larguraProp="1"/>  
                        </button>
                      </td>
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
      
    </div>
    <Rodape />

  </main>

  <div class="modal fade" id="entregaModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="entregaModalLabel">
    <div class="modal-dialog modal-xl WIDTH-35">
      <div class="modal-content" id="modalTableClick">

        <div class="d-flex justify-content-between align-items-center border-bottom p-2" style="height: 6%;" id="modal-header">	

          <!-- Título -->
          <h1 class="modal-title fs-5 flex-grow-1 text-center" id="entregaModalLabel">
            INFORMAR ENTREGA - {{ nfModal }}
          </h1>

          <!-- Botão Fechar -->
          <button title="Fechar (F4)" id="update-modal-close-button" 
            type="button" class="btn-close" data-bs-dismiss="modal" 
            aria-label="Close">
              <!-- @click="clickUpdateModalFecharButton()" -->
          </button>

        </div>

        <div class="BOR-B-grey-2" style="flex-grow: 1; display: flex; flex-direction: column; height: 77.5vh;">
    
          <div class="D-flex">
            
            <!-- OBS NOTA FISCAL -->
            <div class="WIDTH-90" style="margin-left: 5%;">
              <label
                id="adicionais-post-label"
                for="adicionais-post-input"
                class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-enabled"
              >NOME RECEBEDOR</label>
              <input
                id="adicionais-post-input"
                v-model="informarEntregaRequest.cNomeRecebedor"
                type="text"
                class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
            </div>

          </div>

          <div class="D-flex">
            
            <!-- OBS NOTA FISCAL -->
            <div class="WIDTH-44" style="margin-left: 5%;">
              <label
                id="adicionais-post-label"
                for="adicionais-post-input"
                class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-enabled"
              >DOC. RECEBEDOR</label>
              <input
                id="adicionais-post-input"
                v-model="informarEntregaRequest.cDocRecebedor"
                type="text"
                class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
            </div>

            <!-- OBS NOTA FISCAL -->
            <div class="WIDTH-45" style="margin-left: 1%;">
              <label
                id="adicionais-post-label"
                for="adicionais-post-input"
                class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 BGC-input-enabled"
              >DATA ENTREGA</label>
              <input
                id="adicionais-post-input"
                type="text"
                class="form-control BOR-grey HEIGHT-70 MARGIN-T-10 FSIZE-12px InputUPPERCASE">
            </div>

          </div>

          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 60%; border: 1px solid #ccc; border-radius: 8px; padding: 20px; margin: 5%;">
            
            <!-- Se não tiver imagem, mostra a área de upload -->
            <div v-if="!preview" class="upload-area">
              <label for="fileInput">
                <span>Insira um arquivo (aceita imagens)</span>
                <input id="fileInput" type="file" accept="image/*" @change="handleFileChange" hidden>
              </label>
            </div>

            <!-- Se tiver imagem, mostra o preview e botão de excluir -->
            <div v-else class="preview-container">
              <img :src="preview" alt="Preview da imagem" style="max-width: 300px; max-height: 200px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #ccc;">
              <button @click="removerImagem" style="padding: 5px 10px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Excluir
              </button>
            </div>

          </div>

          <div>
              <!-- Botão fixo na parte inferior -->
            <button type="button" class="btn btn-success WIDTH-90 FSIZE-14px " style="margin-left: 5%; margin-bottom: 2%; margin-top: 2%;" @click="confirmarEntregaBtnClick()">
              CONFIRMAR ENTREGA
            </button>
          </div>


        </div>

      </div>
    </div>
  </div>

</template>