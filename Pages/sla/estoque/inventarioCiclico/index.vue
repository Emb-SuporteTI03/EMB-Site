<script setup lang="ts">
  // IMPORTS: ======================================================\
  import axios from "axios";
  import { shortenInfo, applyTableStipedRows } from '~/composables/visualization';
  import type { BasicElementVue3SelectPequeno } from '#components';
  import { ToastSuccess, ToastError, ToastWarning } from '~/composables/toasts';
  import { ref, nextTick } from 'vue'
  import { toRaw } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAuthStore } from '~/stores/auth';
  // ===============================================================/

  // INTERFACES: ===================================================\
  interface InventarioResponseDTO {
    iD_Inventario: number | null;
    cID_Inventario: string | null;
    iD_Carteira: number | null;
    iD_Status: number | null;
    iD_Tipo_Inventario: number | null;
    iD_Usuario: number | null;
    cNmFantasia: string | null;
    cTitulo: string | null;
    cTipoInventario: string | null;
    cAuditoriaStatus: string | null;
    cNmUsuario: string | null;
    dCriacao: string | null;
    dInicio: string | null;
    dFim: string | null;
    dPrazo: string | null;
    iContagemAtual: number | null;
    iTotalItensSistema: number | null;
    iTotalItensUltimaContagem: number | null;
    nXMeta: number | null;
    nXReal: number | null;
    bAprovado: boolean | null;
    cStatusAprovado: string | null;
    cMotivoReprovacao: string | null;

    // Crivo interno do cliente 4182
    bValidadoInterno: boolean | null;
    cStatusValidacaoInterna: string | null;
    cCorStatusValidacaoInterna: string | null;

    bPodeRequisitarNovaContagem: boolean | null;
    bPodeValidarContagem: boolean | null;

    cCorStatusAuditoria: string | null;
    cCorXReal: string;
    cCorStatusAprovado: string;
  };

  interface ContagemResponseDTO {
    iD_Inventario: number;
    iD_Inventario_Contagem: number;
    iD_Status: number;
    iD_Usuario_Responsavel: number;
    iNumeroContagem: number;
    cNmUsuario: string;
    dInicio: string | null;
    dFim: string | null;
    nXReal: number;
    cXReal: string | null;
    bAprovado: boolean | null;
    iTipoContagem: number;
    cStatusAprovado: string;
    cNumeroContagem: string;
    cAuditoriaStatus: string;

    // CORES:
    cCorXReal: string;
    cCorStatusAprovado: string;
    cCorStatusAuditoria: string;
  };

  interface ContagemItemResponseDTO {
    // IDs - exclusivos da Query 2 ficam nullable
    id_Inventario_Item: number;
    id_Inventario: number;
    id_Inventario_Contagem_Item: number | null; // só Query 2
    id_Inventario_Contagem: number | null;      // só Query 2
    iTipoConsulta: 1 | 2;                       // 1 - sistema | 2 - humana

    // Chaves estrangeiras
    id_Componente: number;
    id_Vao: number;
    id_Estado_Material: number;
    id_Lote: number;

    // Descrições
    cCodComponente: string;
    cDescricao: string;
    cVao: string;
    cRua: string;
    cEstadoMaterial: string;
    cLote: string;

    // Quantidades
    iQuantidadeAnterior: number;        // 0 fixo na Query 1
    iQuantidadeSolicitada: number | null; // só Query 1
    iQuantidadeEncontrada: number | null; // só Query 2

    bDivergencia: boolean;
    bAprovado: boolean;

    cStatusAprovado: string;
    cStatusDivergente: string;
    cCorStatusAprovado: string;
    cCorStatusDivergente: string;
  };

  interface QuantidadeContagem {
    iNumeroContagem: number | null;
    iQuantidadeEncontrada: number | null;
    bAprovado: boolean | null;
  };

  interface InventarioAnaliseItemDTO {
    iD_Inventario_Item: number | null;
    iD_Componente: number | null;
    cCodComponente: string | null;   // mostra
    cDescComponente: string | null;  // mostra

    iD_Vao: number | null;
    cVao: string | null;             // mostra

    iD_Lote: number | null;
    cLote: string | null;            // mostra

    iD_Estado_Material: number | null;
    cEstadoMaterial: string | null;  // mostra

    iQuantidadeSistema: number | null; // mostra
    contagens: QuantidadeContagem[];   // lista de contagens do item

    iDiferenca: number | null;         // mostra

    bAprovado: boolean | null;
    iContagem: number | null;          // número da contagem aprovada

    cAcaoSugerida: string | null;      // mostra
    cCorAcao: string | null;           // usa pra pintar o fundo
  };

  interface FiltrosInventarioCiclicoExcelRequestDTO {
    dataInicio: string | null;
    dataFim: string | null;
    iD_Carteira: number | null;
    iD_Tipo_Inventario: number | null;
    cTitulo: string | null;
    cID_Inventario: string | null;
    bFiltrarAndamento: boolean;
    bFiltrarAprovado: boolean;
    bFiltrarReprovado: boolean;
    bFiltrarPendente: boolean;
    bFiltrarFinalizada: boolean;
  };

  // ===============================================================/

  // VARIÁVEIS: ====================================================\
  const urlProd = useUrlProd();
  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  // const userID = ref(authStore.id_usuario);
  // const userNome = ref(authStore.nome);
  // Carteira do cliente logado — é o que define "só os inventários dele"
  // const ID_Carteira = ref(authStore.idCarteira ?? 0);
  // const token = ref(authStore.token ?? "");

  const dataInicio = ref(new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0]);
  const dataFim = ref(new Date().toISOString().split('T')[0]);
  const referenciaBlack = ref<string>("#212121");
  const linhaExpandidaDaTabelaInventario = ref<Number | null>(null);
  const linhaExpandidaDaTabelaInventarioContagem = ref<Number | null>(null);
  const ID_Carteira = ref(authStore.idCarteira ?? 0);
  const token = ref(authStore.token ?? "");
  const logoPath = `/CLIENTES/${ID_Carteira.value}.png`

  // ===============================================================/

  // FILTROS: ======================================================\
  const infoID_Inventario = ref<objetoPadrao[]>([]);
  const infoID_InventarioStatic = ref<objetoPadrao[]>([]);
  const selectedInventario = ref<objetoPadrao | null>(null);
  const selectedInventarioRef = ref<InstanceType<typeof BasicElementVue3SelectPequeno> | null>(null);

  const infoTipoInventarioFiltro = ref<objetoPadrao[]>([]);
  const infoTipoInventarioFiltroStatic = ref<objetoPadrao[]>([]);
  const selectedTipoInventarioFiltro = ref<objetoPadrao | null>(null);
  const selectedTipoInventarioFiltroRef = ref<InstanceType<typeof BasicElementVue3SelectPequeno> | null>(null);

  const infoTituloFiltro = ref<objetoPadrao[]>([]);
  const infoTituloFiltroStatic = ref<objetoPadrao[]>([]);
  const selectedTituloFiltro = ref<objetoPadrao | null>(null);
  const selectedTituloFiltroRef = ref<InstanceType<typeof BasicElementVue3SelectPequeno> | null>(null);

  const isButtonAndamentoSelecionado = ref<boolean>(false);
  const isButtonAprovadoSelecionado = ref<boolean>(false);
  const isButtonReprovadoSelecionado = ref<boolean>(false);
  const isButtonStatusPendenteSelecionado = ref<boolean>(false);
  const isButtonStatusFinalizadaSelecionado = ref<boolean>(false);

  const onClickLimparFiltros = async () => {
    // Resetar selects
    selectedInventario.value = null;
    selectedTipoInventarioFiltro.value = null;
    selectedTituloFiltro.value = null;

    // Resetar botões de filtro
    isButtonStatusPendenteSelecionado.value = false;
    isButtonStatusFinalizadaSelecionado.value = false;
    isButtonAndamentoSelecionado.value = false;
    isButtonAprovadoSelecionado.value = false;
    isButtonReprovadoSelecionado.value = false;

    atualizarEstilosBotoesAND_APR_REP();
    atualizarEstilosBotoesPENFIN();

    // Resetar datas → volta 2 meses atrás no início
    dataInicio.value = new Date(
      new Date().setMonth(new Date().getMonth() - 2)
    ).toISOString().split("T")[0];

    // Resetar outros estados auxiliares
    linhaExpandidaDaTabelaInventario.value = null;
    linhaExpandidaDaTabelaInventarioContagem.value = null;

    await FetchInventarios();
  };

  const OnChangeDataInicio = async () => {
    await FetchInventarios();
  };

  const AplicarFiltros = () => {
    preencherFiltros();

    const ID_Inventario = selectedInventario?.value?.cNome;
    const cTipo = selectedTipoInventarioFiltro?.value?.cNome;
    const cTitulo = selectedTituloFiltro?.value?.cNome;

    const filtrarAndamento = isButtonAndamentoSelecionado.value;
    const filtrarAprovado = isButtonAprovadoSelecionado.value;
    const filtrarReprovado = isButtonReprovadoSelecionado.value;

    const filtrarStatusPendente = isButtonStatusPendenteSelecionado.value;
    const filtrarStatusFinalizada = isButtonStatusFinalizadaSelecionado.value;

    infoInventarios.value = infoInventariosStatic.value.filter(ck => {

      const passaFiltroColuna1 =
        (cTipo ? ck.cTipoInventario === cTipo : true) &&
        (cTitulo ? ck.cTitulo === cTitulo : true) &&
        (ID_Inventario ? ck.cID_Inventario === ID_Inventario : true);

      const passaFiltroColuna2 =
        (filtrarAndamento ? ck.cStatusAprovado === '#212121' : true) &&
        (filtrarAprovado ? ck.cStatusAprovado === 'APROVADO' : true) &&
        (filtrarReprovado ? ck.cStatusAprovado === 'REPROVADO' : true) &&
        (filtrarStatusFinalizada ? ck.cAuditoriaStatus === 'FINALIZADO' : true) &&
        (filtrarStatusPendente ? ck.cAuditoriaStatus === 'PENDENTE' : true);

      return passaFiltroColuna1 && passaFiltroColuna2;
    });

    aplicarFiltrosNosFiltros();
  };

  const aplicarFiltrosNosFiltros = (): void => {
    const cID_InventarioSet = new Set(
      infoInventarios.value
        .map(ck => ck.cID_Inventario?.trim().toLowerCase())
        .filter(nome => nome)
    );

    infoID_Inventario.value = infoID_InventarioStatic.value.filter(pcp =>
      cID_InventarioSet.has(pcp.cNome.trim().toLowerCase())
    );

    const tipoInventarioSet = new Set(
      infoInventarios.value
        .map(ck => ck.cTipoInventario?.trim().toLowerCase())
        .filter(nome => nome)
    );

    infoTipoInventarioFiltro.value = infoTipoInventarioFiltroStatic.value.filter(pcp =>
      tipoInventarioSet.has(pcp.cNome.trim().toLowerCase())
    );

    const tituloSet = new Set(
      infoInventarios.value
        .map(ck => ck.cTitulo?.trim().toLowerCase())
        .filter(nome => nome)
    );

    infoTituloFiltro.value = infoTituloFiltroStatic.value.filter(pcp =>
      tituloSet.has(pcp.cNome.trim().toLowerCase())
    );
  };

  const preencherFiltros = () => {
    infoID_Inventario.value =
      infoID_InventarioStatic.value =
        gerarFiltroDistinct(infoInventariosStatic.value, x => x.cID_Inventario);

    infoTipoInventarioFiltro.value =
      infoTipoInventarioFiltroStatic.value =
        gerarFiltroDistinct(infoInventariosStatic.value, x => x.cTipoInventario);

    infoTituloFiltro.value =
      infoTituloFiltroStatic.value =
        gerarFiltroDistinct(infoInventariosStatic.value, x => x.cTitulo);
  };

  const gerarFiltroDistinct = (lista: any[], seletor: (item: any) => string | null | undefined): objetoPadrao[] => {
    let idFake = 1;
    const valores = new Set<string>();

    lista.forEach(item => {
      const valor = seletor(item);
      if (valor) valores.add(valor);
    });

    return Array.from(valores).map(v => ({
      id: idFake++,
      cNome: v
    }));
  };

  const onChangeID_InventarioSelectREF = () => {
    AplicarFiltros();
  };
  const onChangeTipoInventarioFiltroSelectREF = () => {
    AplicarFiltros();
  };
  const onChangeTituloFiltroSelectREF = () => {
    AplicarFiltros();
  };

  const onClickButtonPENDENTE = (): void => {
    isButtonStatusPendenteSelecionado.value = !isButtonStatusPendenteSelecionado.value;
    isButtonStatusFinalizadaSelecionado.value = false;
    atualizarEstilosBotoesPENFIN();

    AplicarFiltros();
  };
  const onClickButtonFINALIZADO = (): void => {
    isButtonStatusFinalizadaSelecionado.value = !isButtonStatusFinalizadaSelecionado.value;
    isButtonStatusPendenteSelecionado.value = false;
    atualizarEstilosBotoesPENFIN();

    AplicarFiltros();
  };
  const atualizarEstilosBotoesPENFIN = (): void => {
    isButtonStatusPendenteSelecionado.value
      ? aplicaEstiloSelecionado('somente-PEN-button')
      : removeEstiloSelecionado('somente-PEN-button');

    isButtonStatusFinalizadaSelecionado.value
      ? aplicaEstiloSelecionado('somente-FIN-button')
      : removeEstiloSelecionado('somente-FIN-button');
  };

  const atualizarEstilosBotoesAND_APR_REP = (): void => {
    isButtonAndamentoSelecionado.value
      ? aplicaEstiloSelecionado('somente-andamento-button')
      : removeEstiloSelecionado('somente-andamento-button');

    isButtonAprovadoSelecionado.value
      ? aplicaEstiloSelecionado('somente-aprovado-button')
      : removeEstiloSelecionado('somente-aprovado-button');

    isButtonReprovadoSelecionado.value
      ? aplicaEstiloSelecionado('somente-reprovado-button')
      : removeEstiloSelecionado('somente-reprovado-button');
  };

  const onClickButtonAndamento = (): void => {
    isButtonAndamentoSelecionado.value = !isButtonAndamentoSelecionado.value;
    isButtonAprovadoSelecionado.value = false;
    isButtonReprovadoSelecionado.value = false;
    atualizarEstilosBotoesAND_APR_REP();

    AplicarFiltros();
  };

  const onClickButtonAprovado = (): void => {
    isButtonAprovadoSelecionado.value = !isButtonAprovadoSelecionado.value;
    isButtonAndamentoSelecionado.value = false;
    isButtonReprovadoSelecionado.value = false;
    atualizarEstilosBotoesAND_APR_REP();

    AplicarFiltros();
  };

  const onClickButtonReprovado = (): void => {
    isButtonReprovadoSelecionado.value = !isButtonReprovadoSelecionado.value;
    isButtonAndamentoSelecionado.value = false;
    isButtonAprovadoSelecionado.value = false;
    atualizarEstilosBotoesAND_APR_REP();

    AplicarFiltros();
  };

  const aplicaEstiloSelecionado = (buttonID: string): void => {
    const botao = document.getElementById(buttonID);
    botao?.classList.remove('BGC-branco', 'COLOR-black', 'BOR-grey');
    botao?.classList.add('BGC-amarelo-0', 'COLOR-white', 'BOR-amarelo');
  };
  const removeEstiloSelecionado = (buttonID: string): void => {
    const botao = document.getElementById(buttonID);
    botao?.classList.remove('BGC-amarelo-0', 'COLOR-white', 'BOR-amarelo');
    botao?.classList.add('BGC-branco', 'COLOR-black', 'BOR-grey');
  };
  // ===============================================================/

  // INVENTARIO (leitura) ==========================================\
  const mostrarTodosInventario = ref<boolean>(false);
  const isTabelaInventarioCarregada = ref<boolean>(false);

  const infoInventarios = ref<InventarioResponseDTO[]>([]);
  const infoInventariosStatic = ref<InventarioResponseDTO[]>([]);

  const infoInventariosSlice = computed(() => {
    return mostrarTodosInventario.value
      ? infoInventarios.value
      : infoInventarios.value.slice(0, 50)
  });

  const toggleVerMaisInventarios = () => {
    mostrarTodosInventario.value = !mostrarTodosInventario.value;
  };

  const FetchInventarios = async () => {
    const authStore2 = useAuthStore();
    try {
      isTabelaInventarioCarregada.value = false;

      const response = await axios.get<InventarioResponseDTO[]>(
        `${urlProd}/estoque/inventario/get-all-inventarios/${dataInicio.value}/${dataFim.value}`,
        { headers: { Authorization: `Bearer ${token.value}` }, }
      );

      // Filtra pela carteira do próprio cliente logado, assim que os dados chegam.
      const somenteDoCliente = response.data.filter(i => i.iD_Carteira === ID_Carteira.value);

      infoInventarios.value = somenteDoCliente;
      infoInventariosStatic.value = somenteDoCliente;

      linhaExpandidaDaTabelaInventario.value = null;
      linhaExpandidaDaTabelaInventarioContagem.value = null;

      AplicarFiltros();

      } catch (error: any) {
        if (error.response?.status === 401) {
          authStore2.$patch({
            token: null,
            idUsuario: null,
            idCarteira: null,
            idFuncao: null
          });
          LimpaLocalStor();
          return navigateTo('/');
        }
      } finally {
      isTabelaInventarioCarregada.value = true;
    }
  };

  const OnClickExportarExcelGeral = async () => {
    try {
      DisableButtonById('exportar-EXCEL-button', true);

      const filtros: FiltrosInventarioCiclicoExcelRequestDTO = {
        dataInicio: dataInicio.value,
        dataFim: dataFim.value,
        iD_Carteira: ID_Carteira.value,
        iD_Tipo_Inventario: null,
        cTitulo: selectedTituloFiltro.value?.cNome ?? null,
        cID_Inventario: selectedInventario.value?.cNome ?? null,
        bFiltrarAndamento: isButtonAndamentoSelecionado.value,
        bFiltrarAprovado: isButtonAprovadoSelecionado.value,
        bFiltrarReprovado: isButtonReprovadoSelecionado.value,
        bFiltrarPendente: isButtonStatusPendenteSelecionado.value,
        bFiltrarFinalizada: isButtonStatusFinalizadaSelecionado.value,
      };

      const url = `${urlProd}/estoque/inventario/excel-inventario-ciclico`;
      const response = await axios.post(
        url,
        filtros,
        {
          headers: { Authorization: `Bearer ${token.value}` },
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `INVENTARIO_CICLICO.xlsx`;
      link.click();

      window.URL.revokeObjectURL(objectUrl);
    } catch (err: any) {
      console.error(err);
      ToastError('Erro ao exportar EXCEL do INVENTÁRIO.\nConsulte a TI.');
    } finally {
      DisableButtonById('exportar-EXCEL-button', false);
    }
  };
  // ===============================================================/

  // INVENTÁRIO CONTAGEM (somente leitura): ========================\
  const infoContagens = ref<ContagemResponseDTO[]>([]);
  const infoContagensStatic = ref<ContagemResponseDTO[]>([]);

  const FetchInventarioContagens = async (ID_Inventario: number) => {
    try {
      const url = `${urlProd}/estoque/inventario/get-inventario-contagens/${ID_Inventario}`;
      const response = await axios.get<ContagemResponseDTO[]>(
        url,
        { headers: { Authorization: `Bearer ${token.value}` }, }
      );

      infoContagens.value = response.data;
      infoContagensStatic.value = response.data;

    } catch (error) {

    } finally {
    }
  };
  // ===============================================================/

  // CONTAGEM ITENS (somente leitura): =============================\
  const infoContagemItens = ref<ContagemItemResponseDTO[]>([]);
  const infoContagemItensStatic = ref<ContagemItemResponseDTO[]>([]);

  const ativarSubLinhaInventarioContagem = async (contagem: ContagemResponseDTO): Promise<void> => {
    const { iD_Inventario_Contagem } = contagem;

    if (linhaExpandidaDaTabelaInventarioContagem.value === iD_Inventario_Contagem) {
      linhaExpandidaDaTabelaInventarioContagem.value = null;
    } else {
      linhaExpandidaDaTabelaInventarioContagem.value = iD_Inventario_Contagem;
      await FetchInventarioContagemItens(contagem);
    }
  };

  const FetchInventarioContagemItens = async (contagem: ContagemResponseDTO) => {
    try {
      infoContagemItens.value = [];
      infoContagemItensStatic.value = [];

      const { iTipoContagem, iD_Inventario, iD_Inventario_Contagem } = contagem;

      const response = await axios.get<ContagemItemResponseDTO[]>(
        `${urlProd}/estoque/inventario/get-inventario-contagem-itens/${iTipoContagem}/${iD_Inventario}/${iD_Inventario_Contagem}`,
        { headers: { Authorization: `Bearer ${token.value}` }, }
      );
      infoContagemItens.value = response.data;
      infoContagemItensStatic.value = response.data;

    } catch (error) {

    } finally {
    }
  };
  // ===============================================================/

  // VALIDAR (única ação do cliente) ===============================\
  interface ValidarInventarioItensRequestDTO {
    iD_Inventario_Item: number;
    cAcaoSugerida: string | null;
    iD_Componente: number;
    iD_Estado_Material: number;
    iD_Lote: number;
    iD_Vao: number;
    iDiferenca: number;
  };

  interface ValidarInventarioRequestDTO {
    iD_Inventario: number;
    listaItens: ValidarInventarioItensRequestDTO[] | null;
  };

  const validarInventarioRequest = ref<ValidarInventarioRequestDTO>({
    iD_Inventario: 0,
    listaItens: null
  });

  const infoAnaliseItens = ref<InventarioAnaliseItemDTO[]>([]);

  const FetchAnaliseItens = async (ID_Inventario: number | null) => {
    try {
      const response = await axios.get<InventarioAnaliseItemDTO[]>(
        `${urlProd}/estoque/inventario/get-analise-itens/${ID_Inventario}`,
        { headers: { Authorization: `Bearer ${token.value}` }, }
      );

      infoAnaliseItens.value = response.data;

    } catch (error) {

    } finally {
    }
  };

  const clearInfoValidarInventario = () => {
    validarInventarioRequest.value = {
      iD_Inventario: 0,
      listaItens: null
    };

    tipoConfirmacao.value = null;
  };

  const OnClickFecharModalValidarInventario = () => {
    clearInfoValidarInventario();

    showModal('ValidarInventarioModal', false);
  };

  const FetchPodeValidarInventario = async (ID_Inventario: number | null): Promise<Boolean> => {
    try {
      const response = await axios.get<Boolean>(
        `${urlProd}/estoque/inventario/pode-validar-inventario/${ID_Inventario}`,
        { headers: { Authorization: `Bearer ${token.value}` }, }
      );

      return response.data;

    } catch (err: any) {
      console.error(err);
      return false;
    } finally { }
  };

  const OnClickValidarInventario = async (ID_Inventario: number | null) => {
    // Primeira coisa é verificar se o inventario ainda se encontrar nesse estado:
    const podeValidar = await FetchPodeValidarInventario(ID_Inventario);

    if (!podeValidar) {
      ToastWarning('INVENTÁRIO já validado por outro usuário.')
      return;
    }

    // Abre o modal:
    showModal('ValidarInventarioModal', true);

    // Abastece o DTO:
    validarInventarioRequest.value.iD_Inventario = ID_Inventario ?? 0;

    // Busca os itens:
    await FetchAnaliseItens(ID_Inventario);

    // Monta a lista do DTO:
    validarInventarioRequest.value.listaItens = infoAnaliseItens.value
      .filter(item => item.cAcaoSugerida !== 'OK')
      .map(item => ({
        iD_Inventario_Item: item.iD_Inventario_Item ?? 0,
        cAcaoSugerida: item.cAcaoSugerida ?? null,
        iD_Componente: item.iD_Componente ?? 0,
        iD_Estado_Material: item.iD_Estado_Material ?? 0,
        iD_Lote: item.iD_Lote ?? 0,
        iD_Vao: item.iD_Vao ?? 0,
        iDiferenca: item.iDiferenca ?? 0
      }));

    DisableButtonById('handle-aprovar-button', false);
    DisableButtonById('handle-reprovar-button', false);
  };

  // REPROVAR (dentro da própria validação — parte da "validação final")
  interface reprovarCancelarInventarioRequestDTO {
    iD_Inventario: number;
    cMotivoReprovacao: string | null;
  }

  const reprovarCancelarInventarioRequest = ref<reprovarCancelarInventarioRequestDTO>({
    iD_Inventario: 0,
    cMotivoReprovacao: null
  });

  const clearInfoCancelarReprovarInventario = () => {
    reprovarCancelarInventarioRequest.value = {
      iD_Inventario: 0,
      cMotivoReprovacao: null
    };
  };

  const CancelarReprovarInventarioDB = async (): Promise<boolean> => {
    try {
      const url = `${urlProd}/estoque/inventario/cancela-reprova-inventario`;

      const response = await axios.put(
        url,
        reprovarCancelarInventarioRequest.value,
        { headers: { Authorization: `Bearer ${token.value}` }, }
      );

      ToastSuccess('INVENTÁRIO reprovado com sucesso');
      await FetchInventarios();

      return true;
    } catch (err: any) {
      console.error(err);
      ToastError('Erro ao reprovar SOLICITAÇÃO de INVENTARIO.\nConsulte a TI.');
      return false;
    } finally {
    }
  };

  const OnClickConfirmarValidarReprovarInventario = async () => {
    reprovarCancelarInventarioRequest.value.iD_Inventario = validarInventarioRequest.value.iD_Inventario;
    reprovarCancelarInventarioRequest.value.cMotivoReprovacao = 'VALIDAÇÃO REPROVADA';

    await CancelarReprovarInventarioDB();

    showModal('ValidarInventarioModal', false);
    clearInfoCancelarReprovarInventario();
    clearInfoValidarInventario();
  };

  const OnClickConfirmarValidarAprovarInventario = async () => {
    const deuCerto = await AprovaInventarioDB();

    if (deuCerto) {
      showModal('ValidarInventarioModal', false);
      clearInfoValidarInventario();
    }
  };

  const AprovaInventarioDB = async (): Promise<boolean> => {
    try {
      const url = `${urlProd}/estoque/inventario/validar-inventario`;

      const response = await axios.put(
        url,
        validarInventarioRequest.value,
        { headers: { Authorization: `Bearer ${token.value}` }, }
      );

      ToastSuccess('INVENTÁRIO aprovado com sucesso');
      await FetchInventarios();

      return true;
    } catch (err: any) {
      console.error(err);
      ToastError('Erro ao aprovar SOLICITAÇÃO de INVENTARIO.\nConsulte a TI.');
      return false;
    } finally {
    }
  };

  const tipoConfirmacao = ref<'APROVAR' | 'REPROVAR' | null>(null);

  const handleAprovar = () => {
    if (tipoConfirmacao.value === 'APROVAR') {
      DisableButtonById('handle-aprovar-button', true);
      OnClickConfirmarValidarAprovarInventario();
      return;
    }

    tipoConfirmacao.value = 'APROVAR';
  };

  const handleReprovar = () => {
    if (tipoConfirmacao.value === 'REPROVAR') {
      DisableButtonById('handle-reprovar-button', true);
      OnClickConfirmarValidarReprovarInventario();
      tipoConfirmacao.value = null;
      return;
    }

    tipoConfirmacao.value = 'REPROVAR';
  };
  // ===============================================================/

  // GERAIS: =======================================================\
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const ativarSubLinhaInventario = async (ID_Inventario: number): Promise<void> => {
    linhaExpandidaDaTabelaInventarioContagem.value = null;

    if (linhaExpandidaDaTabelaInventario.value === ID_Inventario) {
      linhaExpandidaDaTabelaInventario.value = null;

      infoContagens.value = [];
      infoContagensStatic.value = [];
    } else {
      linhaExpandidaDaTabelaInventario.value = ID_Inventario;

      await FetchInventarioContagens(ID_Inventario);
    }
  };
  // ===============================================================/

  onMounted(async () => {
    await FetchInventarios();
  });

</script>

<template>

  <!-- Modal VALIDAR INVENTÁRIO (única ação disponível pro cliente) -->
	<div class="modal fade" id="ValidarInventarioModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="ValidarInventarioModalLabel">
    <div class="modal-dialog modal-dialog-centered MIN-WIDTH-40">
      <div class="modal-content">

        <!-- Cabecalho -->
        <div id="modal-header"
          class="D-flex JC-between ALITEM-center border-bottom HEIGHT-5vh MIN-HEIGHT-5vh PADDING-R5-L5">
          <img src="assets/images/Logo-E-azul-enhanced.png"
            alt="Logo Grupo Embalarte"
            class="WIDTH-4 HEIGHT-60"
            title="Grupo Embalarte">

          <h1 class="modal-title fs-5 flex-grow-1 text-center" id="ValidarInventarioModalLabel">
            VALIDAR INVENTÁRIO  • {{ validarInventarioRequest.iD_Inventario }}
          </h1>

          <button id="modal-close-button"
            type="button"
            class="btn-close"
            @click="OnClickFecharModalValidarInventario()"
            ></button>
        </div>

        <!-- Corpo -->
        <div class="modal-body HEIGHT-50vh  BGC-cinza-9">
          <div class="WIDTH-100 PADDING-10 OFLOW-auto D-flex flex-column GAP-10 HEIGHT-100 BOR-SensacaoAfundadoCompleto BGC-branco">

            <div
              v-for="(item, i) in infoAnaliseItens" :key="i"
              class="card shadow-sm BORDER-RADIUS-10 PADDING-10 MARGIN-B5"
              :style="{ backgroundColor: item.cCorAcao || '#ffffff' }"
            >
              <div class="D-flex JC-space-between ALITEM-center MARGIN-B5">
                <div class="D-flex ALITEM-center">
                  <strong>{{ item.cCodComponente }}</strong>
                  <span>&nbsp;&nbsp;&nbsp;</span>
                  <div class="FSIZE-13px">
                    {{ item.cDescComponente }}
                  </div>
                </div>
                <span
                  class="badge"
                  :class="{
                    'bg-success': item.bAprovado === true,
                    'bg-danger': item.bAprovado === false,
                    'bg-secondary': item.bAprovado === null
                  }"
                >
                  {{
                    item.bAprovado === true
                      ? 'APROVADO'
                      : item.bAprovado === false
                      ? 'APROVADO COM DIVERGÊNCIA!'
                      : 'PENDENTE'
                  }}
                </span>
              </div>

              <div class="D-flex flex-wrap GAP-10 FSIZE-13px MARGIN-B5">
                <span><b>Vão:</b> {{ item.cVao }}</span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <span><b>Lote:</b> {{ item.cLote }}</span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <span><b>Estado:</b> {{ item.cEstadoMaterial }}</span>
              </div>

              <div class="D-flex align-items-center flex-wrap GAP-6 FSIZE-13px MARGIN-B5">
                <b>Quantidade:</b>
                <span>&nbsp;</span>

                <span class="FSIZE-12px">
                  (Sistema: <b>{{ item.iQuantidadeSistema }}</b>)
                </span>

                <span>&nbsp;&nbsp;&nbsp;</span>

                <span v-for="(contagem, i) in item.contagens" :key="i" class="FSIZE-12px">
                  <span :style="contagem.bAprovado ? 'color: #198754; font-weight: bold;' : ''">
                    (Contagem{{ contagem.iNumeroContagem }}: {{ contagem.iQuantidadeEncontrada }}{{ contagem.bAprovado ? ' ✓' : '' }})
                  </span>
                  <span>&nbsp;&nbsp;&nbsp;</span>
                </span>

                <span class="badge bg-dark FSIZE-12px">
                  Diferença: {{ item.iDiferenca }}
                </span>
              </div>
              <div class="D-flex JC-between ALITEM-center FSIZE-13px">
                <span class="fw-bold text-primary">
                  {{ item.cAcaoSugerida }}
                </span>
                <span>&nbsp;&nbsp;&nbsp;</span>
              </div>
            </div>

            <div v-if="!infoAnaliseItens.length" class="text-center text-muted">
              Nenhum item encontrado
            </div>

          </div>
        </div>

        <!-- Rodapé -->
        <div class="PADDING-T5-R10-B5-L10 D-flex flex-column GAP-10 BOR-T-grey-5">

          <div class="confirm-wrapper" :class="{ open: tipoConfirmacao }">
            <div
              class="alert shadow-sm BORDER-RADIUS-10 PADDING-10 D-flex flex-column GAP-5 confirm-card"
              :class="{
                'alert-success': tipoConfirmacao === 'APROVAR',
                'alert-danger': tipoConfirmacao === 'REPROVAR'
              }"
            >
              <strong>
                {{ tipoConfirmacao === 'APROVAR' ? 'Confirmar aprovação do inventário' : 'Confirmar reprovação do inventário' }}
              </strong>

              <span class="FSIZE-13px">
                {{
                  tipoConfirmacao === 'APROVAR'
                    ? 'Ao aprovar o inventário, o sistema poderá gerar movimentações de entrada e saída automaticamente para ajustar os saldos.'
                    : 'Ao reprovar o inventário, todas as quantidades serão revertidas para os valores originais do sistema.'
                }}
              </span>
            </div>
          </div>

          <div class="D-flex JC-space-between ALITEM-center">
            <button
              id="handle-reprovar-button"
              class="btn btn-danger FSIZE-12px"
              @click="handleReprovar"
            >
              {{ tipoConfirmacao === 'REPROVAR' ? 'CONFIRMAR REPROVAÇÃO' : 'REPROVAR' }}
            </button>

            <button
              id="handle-aprovar-button"
              class="btn btn-success FSIZE-12px"
              @click="handleAprovar"
            >
              {{ tipoConfirmacao === 'APROVAR' ? 'CONFIRMAR APROVAÇÃO' : 'APROVAR' }}
            </button>
          </div>

        </div>

      </div>
    </div>

  </div>

  <main class="D-flex">

    <div class="D-flex FD-column WIDTH-100 HEIGHT-100vh OFLOW-auto">

      <!-- TODO: trocar pelo componente de cabeçalho/menu do portal do cliente -->
      <SetorProducaoSLAMenuSuperior 
        funcionalidadeProp="INVENTÁRIO CÍCLICO"
        :destinoVoltarProp="`/sla/estoque`"
        :srcFoto="logoPath"
      /> 

      <div class="D-flex FD-column HEIGHT-90vh WIDTH-100 JC-center ALITEM-center BGC-cinza-9 BOR-branca">
        <div class="D-flex FD-column ALITEM-center JC-space-around HEIGHT-95 WIDTH-98 BORRAD-5 BGC-branco PADDING-T5-B10">

          <!-- FILTROS -->
          <div class="D-flex JC-space-between HEIGHT-24 WIDTH-98 mb-1">

            <div class="D-flex WIDTH-35 JC-space-between HEIGHT-100">

              <div class="WIDTH-15 MARGIN-2 BGC-azul-esverdeado COLOR-white ALITEM-center BORRAD-5 FWEIGHT-bold D-flex FD-column JC-space-between">
                <p>Filtros</p>
                <button id="limpar-filtros-button" type="button" class="btn btn-dark WIDTH-75 FSIZE-10px mb-1 D-flex JC-center ALITEM-center" @click="onClickLimparFiltros()">Limpar</button>
              </div>

              <div class="D-flex HEIGHT-100 FD-column JC-space-between WIDTH-85 BORRAD-5 mb-1">

                <div class="D-flex WIDTH-100 FD-column HEIGHT-100 PADDING-T5-L10 MARGIN-T2 JC-flex-start">
                  <div class="WIDTH-98 MARGIN-T-13 HEIGHT-35" >
                    <label
                      id="data-inicio-ck-label"
                      for="data-inicio-ck-input"
                      class="form-label BGC-branco BORRAD-5 FSIZE-12px FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5"
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

                  <div class="WIDTH-100 D-flex JC-space-between ALITEM-center HEIGHT-35 ">
                    <BasicElementVue3SelectPequeno
                      ref="selectedInventarioRef"

                      :options="infoID_Inventario"
                      optionLabel="cNome"
                      v-model="selectedInventario"

                      @update:modelValue="onChangeID_InventarioSelectREF"

                      label="INVENTÁRIO"
                      :titulo="selectedInventario?.cNome"

                      :divClass="'WIDTH-48 col-1 MARGIN-T28-R5'"
                      :selectClass="''"
                      :labelClass="'FSIZE-12px MARGIN-T-15'"
                      :widthLista="''"
                    />

                    <BasicElementVue3SelectPequeno
                      ref="selectedTipoInventarioFiltroRef"

                      :options="infoTipoInventarioFiltro"
                      optionLabel="cNome"
                      v-model="selectedTipoInventarioFiltro"

                      @update:modelValue="onChangeTipoInventarioFiltroSelectREF"

                      label="TIPO"
                      :titulo="selectedTipoInventarioFiltro?.cNome"

                      :divClass="'WIDTH-48 MARGIN-T28'"
                      :selectClass="''"
                      :labelClass="'FSIZE-12px MARGIN-T-15'"
                      :widthLista="''"
                    />
                  </div>

                  <BasicElementVue3SelectPequeno
                    ref="selectedTituloFiltroRef"

                    :options="infoTituloFiltro"
                    optionLabel="cNome"
                    v-model="selectedTituloFiltro"

                    @update:modelValue="onChangeTituloFiltroSelectREF"

                    label="TÍTULO"
                    :titulo="selectedTituloFiltro?.cNome"

                    :divClass="'WIDTH-100 col-1 MARGIN-T28-R5'"
                    :selectClass="''"
                    :labelClass="'FSIZE-12px MARGIN-T-15'"
                    :widthLista="''"
                  />

                </div>

              </div>

            </div>

            <!-- Toggle STATUS / SITUAÇÃO -->
            <div class="D-flex HEIGHT-100 FD-column WIDTH-30 ALITEM-center JC-space-around BOR-L-solidgrey-1 PADDING-L10">

              <div class="WIDTH-90 TEXTALI-center">
                <h5 class="FSIZE-12px">STATUS:</h5>
                <div class=" D-flex JC-space-around" style="gap: 5px;">
                  <button id="somente-PEN-button" class="BOR-grey FSIZE-12px BORRAD-5 WIDTH-50 BGC-branco"
                  @click="onClickButtonPENDENTE()"
                  >PENDENTE</button>

                  <button id="somente-FIN-button" class="BOR-grey FSIZE-12px BORRAD-5 WIDTH-50 BGC-branco"
                  @click="onClickButtonFINALIZADO()"
                  >FINALIZADO</button>
                </div>
              </div>

              <div class="WIDTH-90 TEXTALI-center">
                <h5 class="FSIZE-12px">SITUAÇÃO:</h5>
                <div class="D-flex FD-column" style="gap: 5px;">

                  <button id="somente-andamento-button" class="BOR-grey FSIZE-12px BORRAD-5 BGC-branco"
                    @click="onClickButtonAndamento()">
                    ANDAMENTO
                  </button>

                  <div class="D-flex JC-space-around" style="gap: 5px;">
                    <button id="somente-aprovado-button" class="BOR-grey FSIZE-12px BORRAD-5 WIDTH-50 BGC-branco"
                      @click="onClickButtonAprovado()">
                      APROVADO
                    </button>

                    <button id="somente-reprovado-button" class="BOR-grey FSIZE-12px BORRAD-5 WIDTH-50 BGC-branco"
                      @click="onClickButtonReprovado()">
                      REPROVADO
                    </button>
                  </div>

                </div>
              </div>
            </div>

            <!-- DIV direita -->
            <div class="D-flex FD-column WIDTH-30 ALITEM-center">

              <div class="HEIGHT-100 D-flex JC-flex-end ALITEM-flex-end WIDTH-100">
                <div style="margin-right: 20px; cursor: pointer;" @click="FetchInventarios()" title="Atualizar informações">
                  <IconsRefresh
                    corProp="rgb(24, 134, 84)"
                    alturaProp="1.6"
                    larguraProp="1.6"
                  />
                </div>

                <button id="exportar-EXCEL-button" type="button" class="btn btn-success MARGIN-R5 FSIZE-12px PADDING-T2-R5-B2-L5" @click="OnClickExportarExcelGeral">
                  <IconsExcel corProp="currentColor" alturaProp="1" larguraProp="1" />
                  Exportar EXCEL</button>
              </div>

            </div>

          </div>

          <!-- Tabela -->
          <div class="OFLOW-auto WIDTH-98 HEIGHT-70 BOR-SensacaoAfundado BGC-branco" style="overflow-x: hidden; ">
            <table class="table-responsive  table-striped WIDTH-100 BORRAD-5 FSIZE-PADRAO-TABLE" style="overflow-x: hidden; ">

              <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                <tr>
                  <th class="WIDTH-2 TEXTALI-center FSIZE-12px no-wrap-text" scope="col"></th>  <!-- botao de ativar + -->
                  <th class="WIDTH-1 TEXTALI-center FSIZE-12px no-wrap-text" scope="col"></th>  <!-- botao de validar -->
                  <th class="WIDTH-4 TEXTALI-center FSIZE-12px no-wrap-text" scope="col">ID</th>
                  <th class="WIDTH-8 TEXTALI-center FSIZE-12px no-wrap-text"  scope="col">CRIAÇÃO</th>
                  <th class="WIDTH-6 TEXTALI-center FSIZE-12px no-wrap-text"  scope="col">TIPO</th>
                  <th class="WIDTH-14 TEXTALI-center FSIZE-12px no-wrap-text"  scope="col">TÍTULO</th>
                  <th class="WIDTH-8 TEXTALI-center FSIZE-12px no-wrap-text"  scope="col">INÍCIO</th>
                  <th class="WIDTH-8 TEXTALI-center FSIZE-12px no-wrap-text"  scope="col">FIM</th>
                  <th class="WIDTH-8 TEXTALI-center FSIZE-12px no-wrap-text"  scope="col">PRAZO</th>
                  <th class="WIDTH-9 TEXTALI-center FSIZE-12px no-wrap-text"  scope="col">RESPONSÁVEL</th>
                  <th class="WIDTH-5 TEXTALI-center FSIZE-12px no-wrap-text"  scope="col" title="STATUS COLETA">STATUS</th>
                  <th class="WIDTH-4 TEXTALI-center FSIZE-12px no-wrap-text"  scope="col">X META</th>
                  <th class="WIDTH-4 TEXTALI-center FSIZE-12px no-wrap-text"  scope="col">X REAL</th>
                  <th class="WIDTH-9 TEXTALI-center FSIZE-12px no-wrap-text"  scope="col">SITUAÇÃO</th>
                </tr>
              </thead>

              <LayoutTabelaCarregarEsqueleto
                :Linhas="infoInventariosSlice.length === 0 ? 15 : infoInventariosSlice.length"
                :Colunas=14 v-if="!isTabelaInventarioCarregada" />

              <tbody v-if="isTabelaInventarioCarregada" class="BORRAD-5">
                <template v-for="(inventario, i) in infoInventariosSlice" :key="i">

                  <!-- LINHA PRINCIPAL -->
                  <tr class="CURSOR-default BGC-H-cinza-8" :class="applyTableStipedRows(i)" :id="`${i}`" >
                    <!-- BOTÃO EXPANDIR (só leitura, mostra as contagens) -->
                    <td class="WIDTH-2 TEXTALI-center ALITEM-center">
                      <button
                        title="Mais informações"
                        class="custom-button"
                        style="height: 15px; width: 15px; margin: 0 auto;"
                        @click.stop.prevent="ativarSubLinhaInventario(inventario.iD_Inventario ?? 0)"
                      >{{ linhaExpandidaDaTabelaInventario === inventario.iD_Inventario ? '-' : '+' }}
                      </button>
                    </td>

                    <!-- ÚNICA AÇÃO DO CLIENTE: validar (só aparece quando é a vez dele) -->
                    <td class="WIDTH-1 FSIZE-12px TEXTALI-center JC-center no-wrap-text BORRAD-2">
                      <button
                        v-if="inventario.bPodeValidarContagem && inventario.cStatusValidacaoInterna !== 'AGUARDANDO VALIDAÇÃO INTERNA'"
                        @click="OnClickValidarInventario(inventario.iD_Inventario)"
                        class="BOR-none BGC-transparent"
                        title="Validar inventário"
                      >
                        <IconsLapis corProp="#B8860B" alturaProp="1.5" larguraProp="1.5" />
                      </button>
                    </td>

                    <td class="WIDTH-4  TEXTALI-center CTTABLEELPIS">{{ inventario.cID_Inventario }}</td>
                    <td class="WIDTH-8  TEXTALI-center CTTABLEELPIS ">{{ inventario.dCriacao }}</td>
                    <td class="WIDTH-6  TEXTALI-center CTTABLEELPIS" :title="`${inventario.cTipoInventario}`" >{{ shortenInfo(inventario.cTipoInventario, 4) }}</td>
                    <td class="WIDTH-14  TEXTALI-left CTTABLEELPIS" :title="`${inventario.cTitulo}`" >{{ shortenInfo(inventario.cTitulo, 20) }}</td>
                    <td class="WIDTH-8  TEXTALI-left CTTABLEELPIS">{{ inventario.dInicio }}</td>
                    <td class="WIDTH-8  TEXTALI-right CTTABLEELPIS">{{ inventario.dFim }}</td>
                    <td class="WIDTH-8  TEXTALI-right CTTABLEELPIS">{{ inventario.dPrazo  }}</td>
                    <td class="WIDTH-9  TEXTALI-center CTTABLEELPIS" :title="`${inventario.cNmUsuario}`" >{{ shortenInfo(inventario.cNmUsuario, 15) }}</td>
                    <td class="WIDTH-5  FSIZE-12px TEXTALI-center no-wrap-text BORRAD-2 COLOR-white  BGC-transparent"
                      :title="`${inventario.cAuditoriaStatus}`"
                      :style="{
                        backgroundColor: inventario.cCorStatusAuditoria
                          ? hexToRgba(inventario.cCorStatusAuditoria, 0.75)
                          : ''
                      }"
                    >{{ inventario.cAuditoriaStatus }}</td>

                    <td class="WIDTH-4  TEXTALI-center CTTABLEELPIS">{{ inventario.nXMeta }}</td>

                    <td class="WIDTH-4  FSIZE-12px TEXTALI-center no-wrap-text BORRAD-2  BGC-transparent"
                      :title="`${inventario.nXReal}`"
                      :style="{
                        backgroundColor: (inventario.nXReal != 0) ?
                          hexToRgba(inventario.cCorXReal, 0.75) : '',
                        color: (inventario.nXReal != 0)
                          ? '#FFFFFF'
                          : '#000000'
                      }"
                    >{{ inventario.nXReal }}</td>

                    <!-- SITUAÇÃO — prioriza o status intermediário do crivo interno (4182) quando existir -->
                    <td class="WIDTH-9  FSIZE-12px TEXTALI-center no-wrap-text BORRAD-2 COLOR-white  BGC-transparent"
                      :title="`${inventario.cStatusValidacaoInterna || (inventario.cStatusAprovado === referenciaBlack ? '' : inventario.cStatusAprovado)}`"
                      :style="{
                        backgroundColor: inventario.cStatusValidacaoInterna
                          ? hexToRgba(inventario.cCorStatusValidacaoInterna ?? referenciaBlack, 0.75)
                          : (inventario.cCorStatusAprovado ? hexToRgba(inventario.cCorStatusAprovado, 0.75) : '')
                      }"
                    >{{ inventario.cStatusValidacaoInterna || (inventario.cStatusAprovado === referenciaBlack ? '' : inventario.cStatusAprovado) }}</td>
                  </tr>

                  <!-- Linha expandida (contagens — só leitura) -->
                  <tr v-if="linhaExpandidaDaTabelaInventario === inventario.iD_Inventario">
                    <td colspan="14" class="expanded-row" style="background-color: #fff0f0;">
                      <div class="expanded-content PADDING-2" style="display: flex">
                        <table class="table table-sm" style="overflow-x: hidden; width: 100%;  border-collapse: collapse; z-index: 1">

                          <thead>
                            <tr style="text-align: center" class="FSIZE-13px">
                              <th style="background-color: #97b6b8" class="WIDTH-2 TEXTALI-center CTTABLEELPIS" scope="col"></th>
                              <th style="background-color: #97b6b8" class="WIDTH-6 TEXTALI-center CTTABLEELPIS" scope="col">CONTAGEM</th>
                              <th style="background-color: #97b6b8" class="WIDTH-30 TEXTALI-center  CTTABLEELPIS" scope="col">AUDITOR</th>
                              <th style="background-color: #97b6b8" class="WIDTH-9 TEXTALI-center CTTABLEELPIS" scope="col">INÍCIO</th>
                              <th style="background-color: #97b6b8" class="WIDTH-9 TEXTALI-center CTTABLEELPIS" scope="col">FIM</th>
                              <th style="background-color: #97b6b8" class="WIDTH-9 TEXTALI-center CTTABLEELPIS" scope="col">STATUS</th>
                              <th style="background-color: #97b6b8" class="WIDTH-6 TEXTALI-center CTTABLEELPIS" scope="col">X REAL</th>
                              <th style="background-color: #97b6b8" class="WIDTH-8 TEXTALI-center CTTABLEELPIS" scope="col">SITUAÇÃO</th>
                            </tr>
                          </thead>

                          <tbody>
                            <template v-for="contagem in infoContagens" :key="i">

                              <tr class="FSIZE-12px">
                                <td style="background-color: #e0e0e0;" class="WIDTH-2 BOR-B-grey-4 TEXTALI-left no-wrap-text BORRAD-2">
                                  <button
                                    title="Mais informações"
                                    class="custom-button"
                                    style="height: 15px; width: 15px;"
                                    @click.stop.prevent="ativarSubLinhaInventarioContagem(contagem)"
                                    >{{ linhaExpandidaDaTabelaInventarioContagem === contagem.iD_Inventario_Contagem ? '-' : '+' }}
                                  </button>
                                </td>

                                <td class="HEIGHT-5px BOR-B-grey-4 WIDTH-6  TEXTALI-center CTTABLEELPIS BORRAD-2"
                                  :title="`${contagem.iTipoContagem === 1 ? '' : contagem.cNumeroContagem}`"
                                  :style="{
                                    backgroundColor: contagem.iTipoContagem === 1
                                      ? hexToRgba(referenciaBlack, 0.4)
                                      : '#e0e0e0'
                                  }"
                                >{{ contagem.iTipoContagem === 1 ? '' : contagem.cNumeroContagem }}</td>

                                <td style="background-color: #e0e0e0;" class="HEIGHT-5px BOR-B-grey-4 WIDTH-30 TEXTALI-left   CTTABLEELPIS BORRAD-2"
                                  :title="``" >{{ contagem.cNmUsuario }}</td>

                                <td class="HEIGHT-5px BOR-B-grey-4 WIDTH-6  TEXTALI-center CTTABLEELPIS BORRAD-2"
                                  :title="`${contagem.iTipoContagem === 1 ? '' : contagem.dInicio}`"
                                  :style="{
                                    backgroundColor: contagem.iTipoContagem === 1
                                      ? hexToRgba(referenciaBlack, 0.4)
                                      : '#e0e0e0'
                                  }"
                                >{{ contagem.iTipoContagem === 1 ? '' : contagem.dInicio }}</td>

                                <td class="HEIGHT-5px BOR-B-grey-4 WIDTH-6  TEXTALI-center CTTABLEELPIS BORRAD-2"
                                  :title="`${contagem.iTipoContagem === 1 ? '' : contagem.dFim}`"
                                  :style="{
                                    backgroundColor: contagem.iTipoContagem === 1
                                      ? hexToRgba(referenciaBlack, 0.4)
                                      : '#e0e0e0'
                                  }"
                                >{{ contagem.iTipoContagem === 1 ? '' : contagem.dFim }}</td>

                                <td class="HEIGHT-5px BOR-B-grey-4 WIDTH-6 TEXTALI-center CTTABLEELPIS BORRAD-2"
                                  :title="`${contagem.cAuditoriaStatus}`"
                                  style="color: white;"
                                  :style="{
                                    backgroundColor: contagem.iTipoContagem === 1 ?
                                      hexToRgba(referenciaBlack, 0.4) :
                                      contagem.cCorStatusAuditoria ?
                                      hexToRgba(contagem.cCorStatusAuditoria, 0.75)
                                      : ''
                                  }"
                                >{{ contagem.cAuditoriaStatus }}</td>

                                <td class="HEIGHT-5px BOR-B-grey-4 WIDTH-6  TEXTALI-center CTTABLEELPIS BORRAD-2"
                                  :title="`${contagem.nXReal}`"
                                  :style="{
                                    backgroundColor: contagem.iTipoContagem === 1 ?
                                      hexToRgba(referenciaBlack, 0.4) :
                                      (contagem.nXReal != 0) ?
                                      hexToRgba(contagem.cCorXReal, 0.75) : '#e0e0e0',
                                    color: (contagem.nXReal != 0)
                                      ? ''
                                      : '#000000'
                                  }"
                                >{{ contagem.iTipoContagem === 1 ? '' : contagem.nXReal }}</td>

                                <td class="HEIGHT-5px BOR-B-grey-4 WIDTH-6 TEXTALI-center CTTABLEELPIS BORRAD-2  BGC-transparent"
                                  :title="`${contagem.cStatusAprovado === referenciaBlack ? '' : contagem.cStatusAprovado}`"
                                  style="color: white;"
                                  :style="{
                                    backgroundColor: contagem.iTipoContagem === 1 ?
                                      hexToRgba(referenciaBlack, 0.4) :
                                      contagem.cCorStatusAprovado != referenciaBlack ?
                                        hexToRgba(contagem.cCorStatusAprovado, 0.75)
                                        : hexToRgba(contagem.cCorStatusAprovado, 0.4)
                                  }"
                                >{{ contagem.cStatusAprovado === referenciaBlack ? '' : contagem.cStatusAprovado }}</td>
                              </tr>

                              <!-- Linha expandida 2 -->
                              <tr v-if="linhaExpandidaDaTabelaInventarioContagem === contagem.iD_Inventario_Contagem">
                                <td colspan="8" class="expanded-row" style="background-color: #fff4f4;">
                                  <div class="expanded-content" style="display: flex;">
                                    <table class="table table-sm" style="overflow-x: hidden; border: 2px 0px 0px 0px solid #000; width: 100%; border-collapse: collapse; z-index: 1">

                                      <thead>
                                        <tr style="text-align: center" class="FSIZE-12px">
                                          <th style="background-color: #d4e6e7" class="WIDTH-10 TEXTALI-center CTTABLEELPIS" scope="col">CÓDIGO</th>
                                          <th style="background-color: #d4e6e7" class="WIDTH-25 TEXTALI-center  CTTABLEELPIS" scope="col">DESCRIÇÃO</th>
                                          <th style="background-color: #d4e6e7" class="WIDTH-6 TEXTALI-center CTTABLEELPIS" scope="col">VÃO</th>
                                          <th style="background-color: #d4e6e7" class="WIDTH-6 TEXTALI-center CTTABLEELPIS" scope="col">RUA</th>
                                          <th style="background-color: #d4e6e7" class="WIDTH-6 TEXTALI-center CTTABLEELPIS" scope="col">LOTE</th>
                                          <th style="background-color: #d4e6e7" class="WIDTH-6 TEXTALI-center CTTABLEELPIS" scope="col">ESTADO</th>
                                          <th style="background-color: #d4e6e7" class="WIDTH-8 TEXTALI-center CTTABLEELPIS" scope="col">QTDE. ANTERIOR</th>
                                          <th style="background-color: #d4e6e7" class="WIDTH-8 TEXTALI-center CTTABLEELPIS" scope="col">
                                            {{ contagem.iTipoContagem === 1 ? 'QTDE. SOLICITADA' : 'QTDE. ENCONTRADA' }}
                                          </th>
                                          <th style="background-color: #d4e6e7" class="WIDTH-7 TEXTALI-center CTTABLEELPIS" scope="col">DIVERGÊNCIA</th>
                                          <th style="background-color: #d4e6e7" class="WIDTH-7 TEXTALI-center CTTABLEELPIS" scope="col">SITUAÇÃO</th>
                                        </tr>
                                      </thead>

                                      <tbody class="FSIZE-11px">
                                        <template v-for="item in infoContagemItens" :key="i">

                                          <tr class="">
                                            <td style="background-color: #efefef;" class="HEIGHT-5px WIDTH-10  TEXTALI-center CTTABLEELPIS BORRAD-2"
                                            >{{ item.cCodComponente }}</td>
                                            <td style="background-color: #efefef;" class="HEIGHT-5px WIDTH-25  TEXTALI-left CTTABLEELPIS BORRAD-2"
                                            >{{ item.cDescricao }}</td>
                                            <td style="background-color: #efefef;" class="HEIGHT-5px WIDTH-6  TEXTALI-center CTTABLEELPIS BORRAD-2"
                                            >{{ item.cVao }}</td>
                                            <td style="background-color: #efefef;" class="HEIGHT-5px WIDTH-6  TEXTALI-center CTTABLEELPIS BORRAD-2"
                                            >{{ item.cRua }}</td>
                                            <td style="background-color: #efefef;" class="HEIGHT-5px WIDTH-6  TEXTALI-center CTTABLEELPIS BORRAD-2"
                                            >{{ item.cLote }}</td>
                                            <td class="HEIGHT-5px WIDTH-6  TEXTALI-center CTTABLEELPIS BORRAD-2"
                                              :style="{
                                                backgroundColor: item.cEstadoMaterial === 'BOM' ? 'rgba(0, 177, 64, 0.1)' : 'rgba(228, 28, 56, 0.1)',
                                                color: item.cEstadoMaterial === 'BOM' ? 'green' : 'red'
                                              }"
                                            >{{ item.cEstadoMaterial }}</td>

                                            <td style="background-color: #efefef;" class="HEIGHT-5px WIDTH-8  TEXTALI-center CTTABLEELPIS BORRAD-2"
                                              :title="`${contagem.iTipoContagem === 1 ? '' : item.iQuantidadeAnterior}`"
                                              :style="{
                                                backgroundColor: contagem.iTipoContagem === 1
                                                  ? hexToRgba(referenciaBlack, 0.4)
                                                  : '#efefef'
                                              }"
                                            >{{ contagem.iTipoContagem === 1 ? '' : item.iQuantidadeAnterior }}</td>

                                            <td style="background-color: #efefef;" class="HEIGHT-5px WIDTH-8  TEXTALI-center CTTABLEELPIS BORRAD-2"
                                              :title="`${contagem.iTipoContagem === 1 ? item.iQuantidadeSolicitada : item.iQuantidadeEncontrada}`"
                                            >{{ contagem.iTipoContagem === 1 ? item.iQuantidadeSolicitada : item.iQuantidadeEncontrada }}</td>

                                            <td class="HEIGHT-5px WIDTH-7 TEXTALI-center CTTABLEELPIS BORRAD-2  BGC-transparent"
                                              :title="`${item.cStatusDivergente === referenciaBlack ? '' : item.cStatusDivergente}`"
                                              style="color: white;"
                                              :style="{
                                                backgroundColor: contagem.iTipoContagem === 1 ?
                                                  hexToRgba(referenciaBlack, 0.4) :
                                                    item.cCorStatusDivergente != referenciaBlack ?
                                                      hexToRgba(item.cCorStatusDivergente, 0.75)
                                                      : hexToRgba(item.cCorStatusDivergente, 0.4)
                                              }"
                                            >{{ item.cStatusDivergente === referenciaBlack ? '' : item.cStatusDivergente }}</td>

                                            <td class="HEIGHT-5px WIDTH-7 TEXTALI-center CTTABLEELPIS BORRAD-2  BGC-transparent"
                                              :title="`${item.cStatusAprovado === referenciaBlack ? '' : item.cStatusAprovado}`"
                                              style="color: white;"
                                              :style="{
                                                  backgroundColor:
                                                    item.cCorStatusAprovado != referenciaBlack ?
                                                      hexToRgba(item.cCorStatusAprovado, 0.75)
                                                      : hexToRgba(item.cCorStatusAprovado, 0.4)
                                              }"
                                            >{{ item.cStatusAprovado === referenciaBlack ? '' : item.cStatusAprovado }}</td>
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
                    </td>
                  </tr>

                </template>

              </tbody>

            </table>
          </div>

          <!-- Botão de VER MAIS e VER MENOS -->
          <div class="WIDTH-98 mb-1">
            <button @click="toggleVerMaisInventarios" class="btn btn-secondary WIDTH-100 FSIZE-10px">
              {{ mostrarTodosInventario ? `Ver menos...` : `Ver mais... (${infoInventarios.length})` }}
            </button>
          </div>

        </div>
      </div>

      <Rodape />

   </div>

  </main>

</template>

<style>
.custom-button {
  background-color: #dadada;
  border: none;
  padding: 2px;
  border-radius: 25%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  outline: none;
  width: 16px;
  height: 16px;
  font-size: 12px;
  text-align: center;
}

.confirm-wrapper {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.75s ease;
}

.confirm-wrapper.open {
  max-height: 120px;
}

.confirm-card {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.75s ease;
}

.confirm-wrapper.open .confirm-card {
  opacity: 1;
  transform: translateY(0);
}

</style>