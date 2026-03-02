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
const ID_Carteira = ref(authStore.ID_Carteira ?? 0);
const token = authStore.token;

const logoPath = `/CLIENTES/${ID_Carteira.value}.png`;
const tabelaPedidosCarregada = ref(false);
const tabelaPedidosItensCarregada = ref(false);
const infosModalPedidosItensCarregado = ref(false);

const infoPedidosTabela = ref([]);
const infoPedidosTabelaStatic = ref([]);
const infoPedidosItensTabela = ref([]);
const infoPedidosItensTabelaStatic = ref([]);

const infoPedidosItemModal = ref([]);
const bloqueandoLupaPedidosItens = ref(false);

const mostrarTodos = ref(false);
const querieProcura = ref("");
const currentTab = ref('tab1');

const dataInicio = ref(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);
const dataFim = ref(new Date().toISOString().split('T')[0]);

const infoPedidosTabelaSlice = computed(() => {
  return mostrarTodos.value
    ? infoPedidosTabela.value
    : infoPedidosTabela.value.slice(0, 50)
});
const infoPedidosItensTabelaSlice = computed(() => {
  return mostrarTodos.value
    ? infoPedidosItensTabela.value
    : infoPedidosItensTabela.value.slice(0, 50)
});

const tabToOrderType = computed(() => {
  if (currentTab.value === 'tab1') {
    return 'CORTE LÓGICO';
  } else if (currentTab.value === 'tab2') {
    return 'PENDENTES';
  } else if (currentTab.value === 'tab3') {
    return 'CANCELADOS';
  }
  return '';
});

watch(querieProcura, () => {
  filtrarPedidos();
});

// FUNÇÕES ---------------------------------------------------------------------------------------------------------------\

// AUXILIARES -----------------------------------\


  const OnChangeDataInicio = async () => {
    if (!dataInicio.value) {
      dataInicio.value = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0];
    }

    await getInfosPedidosAreaCliente(currentTab.value === 'tab1' ? 'corte-logico' : currentTab.value === 'tab2' ? 'pendentes' : 'cancelados');
  };

  const normalizar = (str) => {
    if (!str) return "";
    return str
      .normalize("NFD")               // separa acentos
      .replace(/[\u0300-\u036f]/g, "")// remove acentos
      .toLowerCase();                 // ignora case
  };

  const filtrarPedidos = () => {
    const query = normalizar(querieProcura.value);

    infoPedidosTabela.value = infoPedidosTabelaStatic.value.filter((item) => {
      return (
        normalizar(item.guiaRemessa).includes(query) ||
        normalizar(item.pedido).includes(query) ||
        normalizar(item.ov).includes(query) ||
        normalizar(item.nfe).includes(query) ||
        normalizar(item.status).includes(query) ||
        normalizar(item.destinatario).includes(query) ||
        normalizar(item.uf).includes(query)
      );
    });
  };

const toggleVerMais = () => {
  mostrarTodos.value = !mostrarTodos.value;
}

async function clickRefreshTramiteButton() {
  try {
    await getInfosPedidosAreaCliente(currentTab.value === 'tab1' ? 'corte-logico' : currentTab.value === 'tab2' ? 'pendentes' : 'cancelados');
    ToastSuccess('Informações atualizadas com sucesso!');
  } catch (error) {
    ToastError('Erro ao atualizar as informações. Tente novamente mais tarde.');
  }
}
async function showTab(tabName) {

  let infoTab = '';

  if (tabName === 'tab1') {
    infoTab = 'corte-logico';
  } else if (tabName === 'tab2') {
    infoTab = 'pendentes';
  } else if (tabName === 'tab3') {
    infoTab = 'cancelados';
  }

  await getInfosPedidosAreaCliente(infoTab);

 currentTab.value = tabName;
}
// REQUISIÇÕES ---------------------------------\

async function getInfosPedidosAreaCliente(infoTab) {

  tabelaPedidosCarregada.value = false

  try {
    const response = await axios.get(`${urlProd}/consultas-sla/area-cliente-pedidos/${infoTab}/${ID_Carteira}/${dataInicio.value}/${dataFim.value}`,
      { headers: { Authorization: `Bearer ${token}` }}
    )
    infoPedidosTabela.value = response.data
    infoPedidosTabelaStatic.value = response.data

    tabelaPedidosCarregada.value = true

    filtrarPedidos();
    return infoPedidosTabela.value
  } catch (error) {
    tabelaPedidosCarregada.value = false

    throw error
  }

}
async function getInfosPedidosInfoAreaCliente(idPedido) {

  tabelaPedidosItensCarregada.value = false

  try {
    const response = await axios.get(`${urlProd}/consultas-sla/area-cliente-pedidos/itens/${idPedido}`,
      { headers: { Authorization: `Bearer ${token}` }}
    )
    infoPedidosItensTabela.value = response.data
    infoPedidosItensTabelaStatic.value = response.data

    tabelaPedidosItensCarregada.value = true

    return infoPedidosItensTabela.value
  } catch (error) {
    tabelaPedidosItensCarregada.value = false

    throw error
  }

}

// MODAL ----------------------------------------\
async function abrirModalPedidosItens () {
  const modal = new bootstrap.Modal(document.getElementById('PedidoItensModal'));
  modal.show();
}
async function fecharModalPedidosItens() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('PedidoItensModal'));
  if (modal) modal.hide();
}
async function clickLupaPedidos(idPedido) {
  // ToastWarning('LUPA em desenvolvimento.')
  await getInfosPedidosInfoAreaCliente(idPedido);
  await abrirModalPedidosItens(idPedido);
}
async function clickXModalPedidosItens() {
  await fecharModalPedidosItens();
  infoPedidosItensTabela.value = [];
} 

// MOUNTED DA PÁGINA
onMounted(async () => {
  await showTab('tab1')
});

</script>

<template>
  <main>
    
    <!-- DIV CABEÇALHO -->
    <SetorProducaoSLAMenuSuperior 
      funcionalidadeProp="ÁREA DO CLIENTE"
      :destinoVoltarProp="`/sla`"
      :srcFoto="logoPath"
    /> 
    
    <!-- DIV CORPO -->
    <div class="D-flex FD-column HEIGHT-90vh WIDTH-100 JC-center ALITEM-center BGC-cinza-9 BOR-branca">

      <!-- QUADRADO BRANCO PARA CONTER A TABELA -->
      <div class="D-flex FD-column ALITEM-center JC-center HEIGHT-85vh WIDTH-98 BORRAD-5 BGC-branco PADDING-T5-B10">

        <!-- DIV PARA A TABELA - PARTE BRANCA - CORPO -->
        <div class="WIDTH-95 HEIGHT-100 abas-container POSITION-relative Z-INDEX-1">
        
          <!-- PARTE COM A BARRA E A O REFRESH -->
					<!-- Barra de pesquisa -->
					<div class="D-flex JC-space-between WIDTH-100 HEIGHT-5">

            <div class="abas WIDTH-50">
              <button class="aba-button FSIZE-14px" @click="showTab('tab1')" :class="{ active: currentTab === 'tab1' }">Pedidos com Corte Lógico</button>
              <button class="aba-button FSIZE-14px" @click="showTab('tab2')" :class="{ active: currentTab === 'tab2' }">Pedidos Pendentes</button>
              <button class="aba-button FSIZE-14px" @click="showTab('tab3')" :class="{ active: currentTab === 'tab3' }">Pedidos Cancelados</button>
              <span v-if="tabelaPedidosCarregada" class="FWEIGHT-bold FSIZE-18px MARGIN-L50 D-flex ALITEM-flex-end JC-flex-end">TOTAL {{ tabToOrderType }} - {{ infoPedidosTabela.length }}</span class="FWEIGHT-bold FSIZE-20px">
            </div>

						<div class="D-flex ALITEM-center WIDTH-50 JC-flex-end mb-1">
              <div class="CURSOR-pointer MARGIN-R10" @click="clickRefreshTramiteButton()" title="Atualizar informações">
                <IconsRefresh
                  corProp="rgb(24, 134, 84)"
                  alturaProp="1.6"
                  larguraProp="1.6"
                />
              </div>

              <div class="WIDTH-25 MARGIN-T-13">
                <label
                  id="data-inicio-ck-label"
                  for="data-inicio-ck-input"
                  class="form-label BGC-branco BORRAD-5 FSIZE-10px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
                >A PARTIR DE</label>
                <input
                  autocomplete="off"
                  id="data-inicio-ck-input"
                  type="date"
                  onkeydown="return false"
                  v-model="dataInicio"
                  @change="OnChangeDataInicio"
                  class="form-control BORRAD-5 BOR-grey MARGIN-T-10 FSIZE-12px BGC-branco">
              </div>

              <!-- Barra de procura -->
              <div class="input-group input-group-sm WIDTH-25 MARGIN-L5">
              <span class="btn btn-outline-secondary">
                <IconsLupa corProp="black" alturaProp="1.5" larguraProp="1.5" />
              </span>
              <input
                autocomplete="off"
                id="barra-procura"
                type="text"
                class="form-control BOR-grey"
                v-model="querieProcura"
                placeholder="Buscar"
                />
              </div>
						</div>

					</div>

          <div class="OFLOW-X-hidden WIDTH-100 HEIGHT-92 BOR-SensacaoAfundado mb-1">
          <!-- TABELA -->
            <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5 table-fixed BORRAD-5">
          
              <thead
                class="BGC-cinza-secondary POSITION-sticky TOP-1px">
                <tr>
                  <th class="TEXTALI-center WIDTH-2 TableElipsis"></th>
                  <th class="TEXTALI-center WIDTH-9 TableElipsis">DATA</th>
                  <th class="TEXTALI-center WIDTH-9 TableElipsis">GUIA REMESSA</th>
                  <th class="TEXTALI-center WIDTH-7 TableElipsis">PEDIDO</th>
                  <th class="TEXTALI-center WIDTH-8 TableElipsis">O.V.</th>
                  <th class="TEXTALI-center WIDTH-9 TableElipsis">NFE</th>
                  <th class="TEXTALI-center WIDTH-5 TableElipsis">VOL.</th>
                  <th class="TEXTALI-center WIDTH-20 TableElipsis">DESTINATÁRIO</th>
                  <th class="TEXTALI-center WIDTH-4 TableElipsis">UF</th>
                  <th class="TEXTALI-center WIDTH-8 TableElipsis">STATUS</th>
                  <th class="TEXTALI-center WIDTH-9 TableElipsis">CD. RASTREIO</th>
                  <th class="TEXTALI-center WIDTH-10 TableElipsis">STATUS RASTREIO</th>
                </tr>

              </thead>

              <LayoutTabelaCarregarEsqueleto :Linhas="infoPedidosTabelaSlice.length === 0 ? 15 : infoPedidosTabelaSlice.length" :Colunas=12 v-if="!tabelaPedidosCarregada" />
              <tbody v-if="tabelaPedidosCarregada" class="BORRAD-5">
                
                  <!-- Linha principal -->
                  <tr class="CURSOR-pointer BGC-H-cinza-8 HEIGHT-5px" v-for="(pedido, i) in infoPedidosTabelaSlice" :key="i" :class="applyTableStipedRows(i)">
                    <td class="TEXTALI-center WIDTH-2 TableElipsis">
                      <button type="button" class="in-table-button" title="Visualizar pedido" @click="clickLupaPedidos(pedido.idPedido)">  
                        <IconsLupa corProp="currentColor" alturaProp="1" larguraProp="1"/>  
                      </button>
                    </td>
                    <td class="TEXTALI-center WIDTH-9 TableElipsis">{{ pedido.data }}</td>
                    <td class="TEXTALI-center WIDTH-9 TableElipsis">{{ pedido.guiaRemessa }}</td>
                    <td class="TEXTALI-center WIDTH-7 TableElipsis">{{ pedido.pedido }}</td>
                    <td class="TEXTALI-center WIDTH-8 TableElipsis">{{ pedido.oV }}</td>                  
                    <td class="TEXTALI-center WIDTH-9 TableElipsis">{{ pedido.nFE }}</td>             
                    <td class="TEXTALI-center WIDTH-5 TableElipsis">{{ pedido.volume }}</td>             
                    <td class="TEXTALI-left WIDTH-20 TableElipsis">{{ pedido.destinatario }}</td>             
                    <td class="TEXTALI-center WIDTH-4 TableElipsis">{{ pedido.uF }}</td>             
                    <td class="TEXTALI-center WIDTH-8 TableElipsis">{{ pedido.status }}</td>  
                    <td class="TEXTALI-center WIDTH-9 TableElipsis">{{ pedido.cdRastreio }}</td>
                    <td class="TEXTALI-center WIDTH-10 TableElipsis">{{ pedido.statusRastreio }}</td>  
                  </tr>


              </tbody>

            </table>
            
          </div>
          <!-- Botão de VER MAIS e VER MENOS -  -->
          <div class="WIDTH-100">
            <button @click="toggleVerMais()" class="btn btn-secondary WIDTH-100 FSIZE-11px">
              {{ mostrarTodos ? `Ver menos...` : `Ver mais... (${infoPedidosTabela.length})` }}
            </button>
          </div>

        </div>

      </div>

    </div>

    <!-- DIV RODAPÉ -->
    <Rodape/>
    
  </main>

  <div class="modal fade" id="PedidoItensModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="PedidoItensModalLabel" aria-hidden="true">
    <div class="modal-dialog MIN-WIDTH-80  modal-dialog-scrollable">
      <div class="modal-content" id="PedidoItensModalContent">

        <div class="d-flex justify-content-between align-items-center border-bottom p-2 HEIGHT-6vh">
          <!-- Logo -->
          <img 
            src="assets/images/Logo-E-azul-enhanced.png" 
            alt="Logo Grupo Embalarte" 
            class="WIDTH-2 HEIGHT-auto" 
            title="Grupo Embalarte">

          <span class="FWEIGHT-bold FSIZE-20px">ITENS DO PEDIDO</span class="FWEIGHT-bold FSIZE-20px">

          <!-- Botão Fechar que pede confirmação -->
          <button
            title="Fechar (F4)" 
            id="update-modal-close-button" 
            type="button" 
            class="btn-close" 
            @click="clickXModalPedidosItens()"
          ></button>
        </div>

        <div class="modal-body HEIGHT-80vh">
          
          <div class="OFLOW-X-hidden WIDTH-100 HEIGHT-92 BOR-SensacaoAfundado mb-1">
            <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5 table-fixed BORRAD-5">
              <thead
                class="BGC-cinza-secondary POSITION-sticky TOP-1px">
                <tr>
                  <th class="TEXTALI-center WIDTH-12 TableElipsis">
                    SKU
                  </th>
                  <th class="TEXTALI-center WIDTH-67 TableElipsis">
                    DESCRIÇÃO
                  </th>
                  <th class="TEXTALI-center WIDTH-6 TableElipsis">
                    QTD.
                  </th>
                  <th class="TEXTALI-center WIDTH-12 TableElipsis">
                    GUIA REMESSA
                  </th>
                </tr>
              </thead>
              <LayoutTabelaCarregarEsqueleto
                :Linhas="infoPedidosItensTabelaSlice.length === 0 ? 4 : infoPedidosItensTabelaSlice.length"
                :Colunas=12 v-if="!tabelaPedidosItensCarregada" />
              <tbody v-if="tabelaPedidosItensCarregada" class="BORRAD-5">
                
                  <!-- Linha principal -->
                  <tr
                    class="CURSOR-pointer BGC-H-cinza-8 HEIGHT-5px"
                    v-for="(pedido, i) in infoPedidosItensTabelaSlice" :key="i"
                    :class="applyTableStipedRows(i)"
                  >
                    <td class="TEXTALI-center WIDTH-12 TableElipsis">
                      {{ pedido.cdProduto }}
                    </td>
                    <td class="TEXTALI-left WIDTH-67 TableElipsis">
                      {{ pedido.nmProduto }}
                    </td>
                    <td class="TEXTALI-center WIDTH-6 TableElipsis">
                      {{ pedido.quantidade }}
                    </td>
                    <td class="TEXTALI-center WIDTH-12 TableElipsis">
                      {{ pedido.guiaRemessa }}
                    </td>
                  </tr>
              </tbody>
            </table>  
          </div>

          <div class="HEIGHT-6 FSIZE-18px D-flex FD-column ALITEM-flex-end JC-flex-end bold">TOTAL DE ITENS - {{ infoPedidosItensTabela.length }}</div>

        </div>

      </div>
    </div>
  </div>

</template>