<script setup>
import axios from "axios";
import { ref } from "vue";
import { shortenInfo, applyTableStipedRows } from '~/composables/visualization';
import { ToastSuccess, ToastError, ToastWarning } from '~/composables/toasts';
import { useAuthStore } from '~/stores/auth';
// VARIÁVEIS ------------------------------------------------------------------------------------------------------------

const urlProd = useUrlProd();
const route = useRoute();

const authStore = useAuthStore();
const token = authStore.token;
const ID_Carteira = ref<number>(authStore.ID_Carteira ?? 0);
const logoPath = `/CLIENTES/${ID_Carteira.value}.png`;
const tabelaPedidosCarregada = ref(false);
const infoPedidosTabela = ref([]);

const mostrarTodos = ref(false);
const querieProcura = ref("");

// FUNÇÕES ---------------------------------------------------------------------------------------------------------------
// REQUISIÇÕES ---------------------------------\
async function getInfosPedidosAcompanhamentosCorreioSLA() {
  tabelaPedidosCarregada.value = false
  try {
    const response = await axios.get(`${urlProd}/consultas-sla/sla-acompanhamento-correios/${ID_Carteira}`,
      { headers: { Authorization: `Bearer ${token}` }}
    )
    infoPedidosTabela.value = response.data

    tabelaPedidosCarregada.value = true

    return infoPedidosTabela.value
  } catch (error) {
    tabelaPedidosCarregada.value = false

    throw error
  }
}

// MOUNTED DA PÁGINA
onMounted(async () => {
  await getInfosPedidosAcompanhamentosCorreioSLA();
});

</script>

<template>
  <main>
    
    <!-- DIV CABEÇALHO -->
    <SetorProducaoSLAMenuSuperior 
      funcionalidadeProp="ACOMPANHAMENTO CORREIOS"
      :destinoVoltarProp="`/sla`"
      :srcFoto="logoPath"
    /> 
    
    <!-- DIV CORPO -->
    <div class="D-flex FD-column HEIGHT-90vh WIDTH-100 JC-center ALITEM-center BGC-cinza-9 BOR-branca">

      <!-- QUADRADO BRANCO PARA CONTER A TABELA -->
      <div class="D-flex FD-column ALITEM-center JC-center HEIGHT-87vh WIDTH-98 BORRAD-5 BGC-branco PADDING-T5-B10">

        <!-- DIV PARA A TABELA - PARTE BRANCA - CORPO -->
        <div class="OFLOW-auto WIDTH-95 HEIGHT-90" style="position: relative; z-index: 1;">
        
          <!-- PARTE COM A BARRA E A O REFRESH -->
					<!-- Barra de pesquisa -->
					<div class="D-flex JC-space-between ALITEM-center HEIGHT-40px WIDTH-100 mb-1">

            <div></div>

						<div class="D-flex ALITEM-center">
              <div style="margin-right: 50px; cursor: pointer;" @click="clickRefreshTramiteButton()" title="Atualizar informações">
                <IconsRefresh
                  corProp="rgb(24, 134, 84)"
                  alturaProp="1.6"
                  larguraProp="1.6"
                />
              </div>

              <div class="input-group input-group-sm WIDTH-90">
              <span class="btn btn-outline-secondary">
                <IconsLupa corProp="black" alturaProp="1.5" larguraProp="1.5" />
              </span>
              <input
                autocomplete="off"
                id="barra-procura"
                type="text"
                class="form-control BOR-grey"
                placeholder="Buscar"
                />
                <!-- v-model="querieProcura" -->
              </div>
						</div>

					</div>
          <!-- TABELA -->
          <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5 BOR-SensacaoAfundado">
        
            <thead
              class="BGC-cinza-secondary POSITION-sticky TOP-0"
              style="z-index: 9999; position: sticky; top: -2px"
            >
              <tr>
                <th class="TEXTALI-center CTTABLEELPIS">
                </th>
                <th class="TEXTALI-center CTTABLEELPIS">
                  DATA
                </th>
                <th class="TEXTALI-center CTTABLEELPIS">
                  GUIA REMESSA
                </th>
                <th class="TEXTALI-center CTTABLEELPIS">
                  PEDIDO
                </th>
                <th class="TEXTALI-center CTTABLEELPIS">
                  O.V.
                </th>
                <th class="TEXTALI-center CTTABLEELPIS">
                  NFE
                </th>
                <th class="TEXTALI-center CTTABLEELPIS">
                  VOL.
                </th>
                <th class="TEXTALI-center CTTABLEELPIS">
                  DESTINATÁRIO
                </th>
                <th class="TEXTALI-center CTTABLEELPIS">
                  UF
                </th>
                <th class="TEXTALI-center CTTABLEELPIS">
                  STATUS
                </th>
                <th class="TEXTALI-center CTTABLEELPIS">
                  CÓD. RASTREIO
                </th>
                <th class="TEXTALI-center CTTABLEELPIS">
                  STATUS RASTREIO
                </th>

              </tr>

            </thead>

            <LayoutTabelaCarregarEsqueleto
              :Linhas="10"
              :Colunas=12 v-if="!tabelaPedidosCarregada" />

            <tbody v-if="tabelaPedidosCarregada" class="BORRAD-5">
              
                <!-- Linha principal -->
                <tr
                  class="CURSOR-pointer BGC-H-cinza-8 HEIGHT-5px"
                  v-for="(pedido, i) in infoPedidosTabela" :key="i"
                  :class="this.applyTableStipedRows(i)"
                >
                  <td class="TEXTALI-center CTTABLEELPIS">
                    <button type="button" class="in-table-button" title="Visualizar pedido" @click="pesquisaPorOP">  <IconsLupa corProp="currentColor" alturaProp="1" larguraProp="1"/>  </button>
                  </td>
                  <td class="TEXTALI-center CTTABLEELPIS">
                    {{ pedido.dInput }}
                  </td>
                  <td class="TEXTALI-center CTTABLEELPIS">
                    {{ pedido.iCK }}
                  </td>
                  <td class="TEXTALI-center CTTABLEELPIS">
                    {{ pedido.cGuiaRemessa }}
                  </td>
                  <td class="TEXTALI-center CTTABLEELPIS">
                    {{ pedido.cNumPedido }}
                  </td>                  
                  <td class="TEXTALI-center CTTABLEELPIS">
                    {{ pedido.cOV }}
                  </td>             
                  <td class="TEXTALI-center CTTABLEELPIS">
                    {{ pedido.cNumNFE }}
                  </td>             
                  <td class="TEXTALI-center CTTABLEELPIS">
                    {{ pedido.iVolume }}
                  </td>             
                  <td class="TEXTALI-center CTTABLEELPIS">
                    {{ pedido.cNome }}
                  </td>             
                  <td class="TEXTALI-center CTTABLEELPIS">
                    {{ pedido.cUF }}
                  </td>  
                  <td :class="['TEXTALI-center', 'CTTABLEELPIS', getStatusClass(pedido.cPedidoStatusAPI)]">
                    {{ pedido.cPedidoStatusAPI }}
                  </td>
                  <td class="TEXTALI-center CTTABLEELPIS">
                    {{ pedido.cTransportadora }}
                  </td>  

                </tr>


            </tbody>

          </table>

        </div>

        <!-- Botão de VER MAIS e VER MENOS -  -->
        <div class="WIDTH-95">
          <button @click="toggleVerMais()" class="btn btn-secondary WIDTH-100 FSIZE-14px">
            {{ mostrarTodos ? `Ver menos...` : `Ver mais... (${2})` }}
          </button>
        </div>

      </div>

    </div>

    <!-- DIV RODAPÉ -->
    <Rodape/>
    
  </main>

</template>