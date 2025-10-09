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
const mostrarTodos = ref(false);

const tabelaNOTASCarregada = ref(false);

const infosTableNotasSLA = ref([]);
const staticinfosTableNotasSLA = ref([]); // Para manter os dados originais e poder limpar os filtros

const cliente = ref({
  iD_Cliente: '',
  cNmFantasia: '',
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

    console.log(staticinfosTableNotasSLA.value)

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

    console.log(response.data);
  } 
  catch (error) 
  {
    console.error("Erro ao buscar NF de Entrega:", error);
    ToastError("Erro ao buscar NF de Entrega.");
  }
}

// FUNÇÕES DO MODAL
async function abrirModalInformarEntrega() {
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

// FUNÇÕES AUXILIARES

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
                        <button type="button" class="in-table-button" title="Visualizar detalhes do Trâmite" @click="AbrirModalDetalhesTramite(nota.idTramite)">
                          <IconsLupa corProp="currentColor" alturaProp="1" larguraProp="1"/>  
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
      
      <Rodape />

   </div>
  </main>

  <div class="modal fade" id="entregaModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="entregaModalLabel">
    <div class="modal-dialog modal-xl MIN-WIDTH-20">
      <div class="modal-content" id="modalTableClick">

        <div class="d-flex justify-content-between align-items-center border-bottom p-2" style="height: 6%;" id="modal-header">	
          <!-- Logo -->
          <img 
          src="assets\images\Logo-E-azul-enhanced.png" 
          alt="Logo Grupo Embalarte" 
          class="WIDTH-2" 
          style="height: auto;" 
          title="Grupo Embalarte">

          <!-- Título -->
          <h1 class="modal-title fs-5 flex-grow-1 text-center" id="entregaModalLabel">
            INFORMAR ENTREGA
          </h1>

          <!-- Botão Fechar -->
          <button title="Fechar (F4)" id="update-modal-close-button" 
            type="button" class="btn-close" data-bs-dismiss="modal" 
            aria-label="Close">
              <!-- @click="clickUpdateModalFecharButton()" -->
          </button>

        </div>

        <div class="BOR-B-grey-2" style="flex-grow: 1; display: flex; flex-direction: column; height: 77.5vh;">
        </div>

      </div>
    </div>
  </div>

</template>