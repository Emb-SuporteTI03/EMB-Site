<!-- Página que contem o  ESTOQUE ANALITICO E ESTOQUE SINTETICO -->
<script>
import axios from 'axios';
import { formatarData, formatarDataEUA, applyTableStipedRows, shortenInfo } from '~/composables/visualization';
import { ToastSuccess, ToastWarning, ToastError } from '~/composables/toasts';

export default {
  data() {
    return {
      // Variáveis estáticas: ----------------------------\
      ID_ComponenteState: useIDComponente(),
      token: useToken(),
      urlProd: useUrlProd(),
      // //////////////////////////////////////////////////

      infoEstoque: [],
      staticInfoEstoque: [],
      
      tabelaCOMPONENTEsCarregada: false,
      isEstoqueAnalitico: true,
      isButtonBomSelecionado: false,
      isButtonRuimSelecionado: false,
      querieProcuraFiltroCliente: '',
      querieProcuraFiltroCodigo: '',
      querieProcuraFiltroDescricao: '',
      querieProcuraFiltroEdicao: '',
      querieProcuraFiltroVao: '',
      querieProcuraFiltroFamilia: '',
      querieProcuraFiltroLote: '',
			mostrarTodos: false,
      modalAberto: false,

      // PARA O MODAL ----\
      urlEstoque: useUrlEstoque(),
      componenteAtual: {},
      componenteAtualEstatico: {},
      entradas: [],
      totalEntradas: '',
      saidas: [],
      totalSaidas: '',
      imagemComponente: '',
      tabelaEntradasCarregada: false,
      tabelaSaidasCarregada: false,

      tableContainerStyle: {
        width: '100%',
        maxHeight: '0px', // Inicializa com valor padrão até que o cálculo seja feito
      },
      cliente: {
        iD_Cliente: '',
        cNmFantasia: '',
      },
      // -----------------/
    };
  },

  computed: {
    infoEstoqueSlice() {
      return this.mostrarTodos
        ? this.infoEstoque
        : this.infoEstoque.slice(0, 50);
    },
  },

  methods: {
    // Métodos de LIMPEZA: -----------------------------------------------------------------------\
    onClickLimparFiltros() {
      // Limpa a requisição:
      this.exportaPDFEXCELEstoqueRequestDTO = {
        cNmFantasia: '',
        cCodComponente: '',
        cDescricao: '',
        cFamilia: '',
        cEstadoMaterial: '',
        cVao: '',
        cLote: '',
        cEdicao: '',
      },

      // Limpa o HTML e JS da página:
      document.getElementById('filtro-cliente-input').value = '';
      document.getElementById('filtro-codigo-input').value = '';
      document.getElementById('filtro-descricao-input').value = '';
      document.getElementById('filtro-familia-input').value = '';
      document.getElementById('filtro-lote-input').value = '';
      document.getElementById('filtro-edicao-input').value = '';

      const inputVao = document.getElementById('filtro-vao-input')
      if (inputVao) {
        inputVao.value = '';
      }

      this.querieProcuraFiltroCliente = '';
      this.querieProcuraFiltroCodigo = '';
      this.querieProcuraFiltroDescricao = '';
      this.querieProcuraFiltroEdicao = '';
      this.querieProcuraFiltroVao = '';
      this.querieProcuraFiltroFamilia = '';
      this.querieProcuraFiltroLote = '';
      
      // Botões de estado do material:
      this.isButtonBomSelecionado = false;
      this.isButtonRuimSelecionado = false;
      this.atualizarEstilosBotoes();
      
      // Aplica os filtros:
      this.aplicarFiltros();
    },
    // -------------------------------------------------------------------------------------------/

    // GET: --------------------------------------------------------------------------------------\
    // Por VÃO (Tem mais registros):
    async fetchEstoqueAnalitico() {
      this.isEstoqueAnalitico = true;
      this.tabelaCarregada(false);

      try {
        const response = await axios.get(`${this.urlProd}/estoque/componente/estoque-analitico-web`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        
        this.infoEstoque = response.data;
        this.staticInfoEstoque = response.data;

        this.tabelaCarregada(true);
      } catch (error) {
        console.error(error);
        this.tabelaCarregada(true);
      } finally {
        this.tabelaCarregada(true);
      }
    },
    // Por COMPONENTE (Tem menos registros):
    async fetchEstoqueSintetico() {
      this.tabelaCarregada(false);
      this.isEstoqueAnalitico = false;

      try {
        const response = await axios.get(`${this.urlProd}/estoque/componente/estoque-sintetico-web`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        
        this.infoEstoque = response.data;
        this.staticInfoEstoque = response.data;

        this.tabelaCarregada(true);
      } catch (error) {
        console.error(error);
        this.tabelaCarregada(true);
      } finally {
        this.tabelaCarregada(true);
      }
    },
    async clicaRefreshButton () {
      // Aqui deve buscar novamente do banco de dados e aplicar os filtros:
      try {
        this.isEstoqueAnalitico ? await this.fetchEstoqueAnalitico() : await this.fetchEstoqueSintetico();

        this.aplicarFiltros();
      } catch (error) {

      }
    },
    async fetchCliente() {
      try {
        const response = await axios.get(`${this.urlProd}/usuario-externo/cliente`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        
        const data = response.data;

        this.cliente.iD_Cliente = data.iD_Cliente;
        this.cliente.cNmFantasia = data.cNmFantasia;
        this.cliente.iD_Lote = data.iD_Lote;
        this.cliente.cLote = data.cLote;

      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
      }
    },
    // -------------------------------------------------------------------------------------------/

    // Métodos que lidam com os 3 filtros: -------------------------------------------------------\
    onKeyupFiltroCliente() {
      this.querieProcuraFiltroCliente = document.getElementById('filtro-cliente-input').value;
      this.aplicarFiltros();
    },
    onKeyupFiltroCodigo() {
      this.querieProcuraFiltroCodigo = document.getElementById('filtro-codigo-input').value;
      this.aplicarFiltros();
    },

    onKeyupFiltroDescricao() {
      this.querieProcuraFiltroDescricao = document.getElementById('filtro-descricao-input').value;
      this.aplicarFiltros();
    },

    onKeyupFiltroEdicao() {
      this.querieProcuraFiltroEdicao = document.getElementById('filtro-edicao-input').value;
      this.aplicarFiltros();
    },
    
    onKeyupFiltroVao() {
      this.querieProcuraFiltroVao = document.getElementById('filtro-vao-input').value;
      this.aplicarFiltros();
    },

    onKeyupFiltroFamilia() {
      this.querieProcuraFiltroFamilia = document.getElementById('filtro-familia-input').value;
      this.aplicarFiltros();
    },

    onKeyupFiltroLote() {
      this.querieProcuraFiltroLote = document.getElementById('filtro-lote-input').value;
      this.aplicarFiltros();
    },

    aplicarFiltros() {
      const cliente = this.querieProcuraFiltroCliente.toLowerCase();
      const codigo = this.querieProcuraFiltroCodigo.toLowerCase();
      const descricao = this.querieProcuraFiltroDescricao.toLowerCase();
      const edicao = this.querieProcuraFiltroEdicao.toLowerCase();
      const vao = this.querieProcuraFiltroVao.toUpperCase().replace(/-/g, "").trim();
      const familia = this.querieProcuraFiltroFamilia.toLowerCase();
      const lote = this.querieProcuraFiltroLote.toLowerCase();
      const filtrarBom = this.isButtonBomSelecionado;
      const filtrarRuim = this.isButtonRuimSelecionado;


      this.infoEstoque = this.staticInfoEstoque.filter(comp => {
        let vaoNormalizado;
        if (comp.cVao !== undefined) {
          vaoNormalizado = comp.cVao.toUpperCase().replace(/-/g, "").trim();
        }
        return (
          (cliente ? comp.cNmFantasia.toLowerCase().includes(cliente) : true) &&
          (codigo ? comp.cCodComponente.toLowerCase().includes(codigo) : true) &&
          (descricao ? comp.cDescricao.toLowerCase().includes(descricao) : true) &&
          (edicao ? comp.cEdicao?.toLowerCase().includes(edicao) : true) &&
          (vao ? vaoNormalizado.includes(vao) : true) &&
          (familia ? comp.cFamilia.toLowerCase().includes(familia) : true) &&
          (lote ? comp.cLote.toLowerCase().includes(lote) : true) &&
          (filtrarBom ? comp.cEstadoMaterial === 'BOM' : true) &&
          (filtrarRuim ? comp.cEstadoMaterial === 'RUIM' : true)
        );
      });
    },
    // -------------------------------------------------------------------------------------------/

    // Métodos que lidam com os botões de estado do material: ------------------------------------\
    onClickButtonBom() {
      this.isButtonBomSelecionado = !this.isButtonBomSelecionado;
      this.isButtonRuimSelecionado = false;
      this.atualizarEstilosBotoes();
      this.aplicarFiltros();
    },
    onClickButtonRuim() {
      this.isButtonRuimSelecionado = !this.isButtonRuimSelecionado;
      this.isButtonBomSelecionado = false;
      this.atualizarEstilosBotoes();
      this.aplicarFiltros();
    },
    atualizarEstilosBotoes() {
      this.isButtonBomSelecionado 
        ? this.aplicaEstiloSelecionado('bom-estadoMaterial-button') 
        : this.removeEstiloSelecionado('bom-estadoMaterial-button');

      this.isButtonRuimSelecionado 
        ? this.aplicaEstiloSelecionado('ruim-estadoMaterial-button') 
        : this.removeEstiloSelecionado('ruim-estadoMaterial-button');
    },
    aplicaEstiloSelecionado(buttonID) {
      const botao = document.getElementById(buttonID);
      botao.classList.remove('BGC-branco', 'COLOR-black', 'BOR-grey');
      botao.classList.add('BGC-amarelo-0', 'COLOR-white', 'BOR-amarelo');
    },
    removeEstiloSelecionado(buttonID) {
      const botao = document.getElementById(buttonID);
      botao.classList.remove('BGC-amarelo-0', 'COLOR-white', 'BOR-amarelo');
      botao.classList.add('BGC-branco', 'COLOR-black', 'BOR-grey');
    },
    // -------------------------------------------------------------------------------------------/

    // Botões que alternam entre os estoques: ----------------------------------------------------\
    async onEstoqueAnaliticoClicked() {
      await this.fetchEstoqueAnalitico();

      // Deve aplicar os filtros:
      this.aplicarFiltros();
    },

    async onEstoqueSinteticoClicked() {
      await this.fetchEstoqueSintetico();

      this.querieProcuraFiltroVao = '';
      const inputVao = document.getElementById('filtro-vao-input')
      if (inputVao) {
        inputVao.value = '';
      }

      // Deve aplicar os filtros:
      this.aplicarFiltros();
    },
    // -------------------------------------------------------------------------------------------/

    // Métodos de EXPORTAÇÃO: --------------------------------------------------------------------\
    // Exportar EXCEL:
    async onClickExportarExcel() {
      if (this.infoEstoque.length === 0) {
        ToastError('Não há dados para exportar!');
        return;
      }

      // Bloqueia ambos botoes e Avisa o usuario e bloqueia o botao:
      ToastWarning('Aguarde enquanto o documento é gerado...');
      document.getElementById("exportar-PDF-button").disabled = true;
      document.getElementById("exportar-EXCEL-button").disabled = true;

      // Faz a chamada:
      this.isEstoqueAnalitico ? await this.fetchEXCELEstoqueAnalitico() : await this.fetchEXCELEstoqueSintetico();

      // Desbloqueia ambos botões:
      ToastSuccess('Documento baixado com sucesso!');
      document.getElementById("exportar-PDF-button").disabled = false;
      document.getElementById("exportar-EXCEL-button").disabled = false;
    },
    // Exportar PDF:
    async onClickExportarPDF() {
      if (this.infoEstoque.length === 0) {
        ToastError('Não há dados para exportar!');
        return;
      }

      // Bloqueia ambos botoes e Avisa o usuario e bloqueia o botao:
      ToastWarning('Aguarde enquanto o documento é gerado...');
      document.getElementById("exportar-PDF-button").disabled = true;
      document.getElementById("exportar-EXCEL-button").disabled = true;

      this.isEstoqueAnalitico ? await this.fetchPDFEstoqueAnalitico() : await this.fetchPDFEstoqueSintetico();

      // Desbloqueia ambos botões:
      ToastSuccess('Documento baixado com sucesso!');
      document.getElementById("exportar-PDF-button").disabled = false;
      document.getElementById("exportar-EXCEL-button").disabled = false;
    },
    async fetchPDFEstoqueAnalitico() {
      try {
        // Faz a requisição para o endpoint configurando o responseType como 'blob':
        let response = await axios.post(`${this.urlProd}/estoque/componente/estoque-analitico-PDF`,
          this.infoEstoque, // Passando o objeto diretamente
          { headers: { Authorization: `Bearer ${this.token}`  },
            responseType: 'blob' // Importante para tratar a resposta como arquivo
          }
        );

        // Cria um Blob a partir dos dados da resposta:
        let blob = new Blob([response.data], { type: 'application/pdf' }); // Alterado para tipo PDF

        // Cria um URL de objeto para o Blob:
        let url = window.URL.createObjectURL(blob);

        // Cria um link temporário e configura o URL:
        let link = document.createElement('a');
        link.href = url;

        // Define o atributo de download para o nome do arquivo desejado:
        link.download = `ESTOQUE_ANALITICO.pdf`; // Alterado para PDF

        // Simula um clique no link para iniciar o download:
        link.click();

        // Libera recursos do URL de objeto:
        window.URL.revokeObjectURL(url);

      } catch (error) { console.error(error) }
    },
    async fetchPDFEstoqueSintetico() {
      try {
        // Faz a requisição para o endpoint configurando o responseType como 'blob':
        let response = await axios.post(`${this.urlProd}/estoque/componente/estoque-sintetico-PDF`,
          this.infoEstoque, // Passando o objeto diretamente
          { headers: { Authorization: `Bearer ${this.token}`  },
            responseType: 'blob' // Importante para tratar a resposta como arquivo
          }
        );

        // Cria um Blob a partir dos dados da resposta:
        let blob = new Blob([response.data], { type: 'application/pdf' }); // Alterado para tipo PDF

        // Cria um URL de objeto para o Blob:
        let url = window.URL.createObjectURL(blob);

        // Cria um link temporário e configura o URL:
        let link = document.createElement('a');
        link.href = url;

        // Define o atributo de download para o nome do arquivo desejado:
        link.download = `ESTOQUE_SINTETICO.pdf`; // Alterado para PDF

        // Simula um clique no link para iniciar o download:
        link.click();

        // Libera recursos do URL de objeto:
        window.URL.revokeObjectURL(url);

      } catch (error) { console.error(error) }
    },
    async fetchEXCELEstoqueAnalitico() {
      try {
        // Faz a requisição para o endpoint configurando o responseType como 'blob':
        let response = await axios.post(`${this.urlProd}/estoque/componente/estoque-analitico-EXCEL`,
          this.infoEstoque,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              'Content-Type': 'application/json' // Adicionando o Content-Type adequado
            },
            responseType: 'blob', // Importante para tratar a resposta como arquivo
          }
        );

        // Cria um Blob a partir dos dados da resposta:
        let blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Cria um URL de objeto para o Blob:
        let url = window.URL.createObjectURL(blob);

        // Cria um link temporário e configura o URL:
        let link = document.createElement('a');
        link.href = url;

        // Define o atributo de download para o nome do arquivo desejado:
        link.download = `ESTOQUE_ANALITICO.xlsx`;

        // Simula um clique no link para iniciar o download:
        link.click();

        // Libera recursos do URL de objeto:
        window.URL.revokeObjectURL(url);
      } catch (error) { console.error(error); }
    },
    async fetchEXCELEstoqueSintetico() {
      try {
        // Faz a requisição para o endpoint configurando o responseType como 'blob':
        let response = await axios.post(`${this.urlProd}/estoque/componente/estoque-sintetico-EXCEL`,
          this.infoEstoque,
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json' // Adicionando o Content-Type adequado
              },
              responseType: 'blob', // Importante para tratar a resposta como arquivo
            }
        );

        // Cria um Blob a partir dos dados da resposta:
        let blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Cria um URL de objeto para o Blob:
        let url = window.URL.createObjectURL(blob);

        // Cria um link temporário e configura o URL:
        let link = document.createElement('a');
        link.href = url;

        // Define o atributo de download para o nome do arquivo desejado:
        link.download = `ESTOQUE_SINTETICO.xlsx`;

        // Simula um clique no link para iniciar o download:
        link.click();

        // Libera recursos do URL de objeto:
        window.URL.revokeObjectURL(url);
      } catch (error) { console.error(error); }
    },
    // -------------------------------------------------------------------------------------------/

    // Métodos gerais: ---------------------------------------------------------------------------\
    applyTableStipedRows,
    shortenInfo,

    toggleVerMais() {
			this.mostrarTodos = !this.mostrarTodos;
		},	

    tabelaCarregada(bool) { this.tabelaCOMPONENTEsCarregada = bool; },
    aplicaCorAoEstado (estado) {
      if (estado === 'BOM') {
        return 'BGC-verde-5 COLOR-green';
      } else {
        return 'BGC-vermelho-5 COLOR-red';
      }
    },
    clickComponentOnTheList(iD_Componente) {
      this.ID_ComponenteState = iD_Componente;
      this.$router.push({
        path: '/',
        query: { ID_Componente: iD_Componente }
      });
    },

    // -------------------------------------------------------------------------------------------/
    // MÉTODOS QUE LIDAM COM O MODAL: -----------------------------------------------------\
    async getGenerico(url, params = {}) {
			try {
				const response = await axios.get(url, {
					headers: { Authorization: `Bearer ${this.token}` },
					params, // Adiciona parâmetros de query se necessário
				});
				return response.data;
			} catch (error) {
				console.error("Erro na requisição:", error);
				return error;
			}
		},
    async fillUpdateDeleteModal(IDComponente) {
			this.modalAberto = true;
			
			await this.getComponenteByID(IDComponente);
			await this.getImagemComponente(IDComponente);

			await nextTick(); // Aguarda Vue atualizar o DOM

			setTimeout(() => {
					this.adjustTableHeight();
			}, 100); // Aguarda um curto período antes de calcular

			window.addEventListener('resize', this.adjustTableHeight);
			this.ativarBotoesTabelaEntrada();
		},
    async getComponenteByID (IDComponente) {
			this.componenteAtual = await this.getGenerico(`${this.urlEstoque}/componente/get-componente/${IDComponente}`);
	
      this.componenteAtualEstatico = {
				iD_Componente: this.componenteAtual.iD_Componente,
				data: this.componenteAtual.data,
				codigoCliente: this.componenteAtual.codigoCliente,
				descricao: this.componenteAtual.descricao,
				iD_Familia: this.componenteAtual.iD_Familia,
				familia: this.componenteAtual.familia,
				edicao: this.componenteAtual.edicao,
				codComponente: this.componenteAtual.codComponente,
				padraoCaixa: this.componenteAtual.padraoCaixa,
				pesoIndividual: this.componenteAtual.pesoIndividual,
				quantidade: this.componenteAtual.quantidade,
				urlImagem: this.componenteAtual.urlImagem,
				saldoBom: this.componenteAtual.saldoBom,
				saldoOutros: this.componenteAtual.saldoOutros,
			};
		},
    async adjustTableHeight() {
			await nextTick(); // Aguarda Vue atualizar o DOM
			// Altura total do modal (91% da altura da tela)
			const modalHeight = window.innerHeight * 0.91;

			// Altura do cabeçalho
			const headerHeight = document.getElementById('modal-header') ? document.getElementById('modal-header').offsetHeight : 0;

			// Altura do formulário (se presente)
			const formHeight = document.getElementById('update-form-componente') ? document.getElementById('update-form-componente').offsetHeight : 0;

			// Calcular altura disponível para a tabela
				const bodyHeight = modalHeight - headerHeight - formHeight - 30;

			// Ajusta a altura máxima da tabela
			this.tableContainerStyle = {
				maxHeight: `${bodyHeight}px`,
				overflowY: 'auto'
			};
		},
    ativarBotoesTabelaEntrada() {
			document.querySelectorAll(".buttonTableEntradas").forEach(botao => {
				botao.classList.remove("disabled-button");
				botao.disabled = false;
			});
		},
    ativarBotoesTabelaSaida() {
			document.querySelectorAll(".buttonTableSaidas").forEach(botao => {
				botao.classList.remove("disabled-button");
				botao.disabled = false;
			});
		},
    async getImagemComponente(IDComponente) {
			try {
				const url = `${this.urlEstoque}/foto-componente/get-foto/${IDComponente}`;

				// Faz uma requisição direta para verificar se a imagem existe
				const response = await axios.get(url, {
					headers: { Authorization: `Bearer ${this.token}` }, // Inclui cabeçalho de autenticação
					responseType: "blob", // Garante que a resposta será tratada como um arquivo binário
				});

				if (response.status === 200) {
					// Cria um URL temporário para exibir o blob como imagem
					this.imagemComponente = URL.createObjectURL(response.data);
				} else {
					this.imagemComponente = null;
				}
			} catch (error) {
				console.error("Erro ao recuperar a imagem:", error);
				this.imagemComponente = null;
			}
		},
    async clickUpdateModalFecharButton() {
			// Remove o listener de redimensionamento quando o modal for fechado
			window.removeEventListener('resize', this.adjustTableHeight);

      this.modalAberto = false;
			this.entradas = [];
			this.saidas = [];
      this.imagemComponente = null;
		},
    escolheIconePelaExtensao(caminho) {
			const extensaoMap = {
				'jpeg': 'jpg',
				'jpg': 'jpg',
				'png': 'jpg',
				'webp': 'jpg',
				'heif': 'jpg',
				'xlsx': 'csv',
				'xls': 'csv',
				'csv': 'csv',
				'pdf': 'pdf',
				'eml': 'eml',
				'msg': 'msg'
			};

			let extensao = caminho && caminho.includes('.') ? caminho.split('.').pop().toLowerCase() : null;

			return extensaoMap[extensao] || 'outro';
		},
  },

  async mounted() {
    await this.fetchEstoqueAnalitico();
    await this.fetchCliente(); 
  },
};
</script>

<template>
  <!-- Corpo (OK) -->
  <main class="D-flex">

    <!-- Todo o Conteúdo da página -->
    <div class="D-flex FD-column WIDTH-100 HEIGHT-100vh OFLOW-auto">

      <!-- Menu Superior -->
      <MenuSuperiorEstoque
        funcionalidadeProp="CONSULTA DO ESTOQUE"
        destinoVoltarProp="/"
      />

      <!-- Tabela de COMPONENTES -->
      <div class="D-flex FD-column HEIGHT-90vh WIDTH-100 JC-center ALITEM-center BGC-cinza-9 BOR-branca">

        <!-- COMPONENTE -->
        <div class="D-flex FD-column ALITEM-center JC-center HEIGHT-85vh WIDTH-98 BORRAD-5 BGC-branco PADDING-5">
          
          <!-- Filtros -->
          <div class="D-flex JC-space-between HEIGHT-30 WIDTH-95 mb-1">
            <!-- DIV esquerda -->
            <div class="D-flex WIDTH-70 JC-space-between">
              <!-- Decoração FILTROS -->
              <div class="WIDTH-10 BGC-azul-esverdeado COLOR-white ALITEM-center BORRAD-5 FWEIGHT-bold D-flex FD-column JC-space-between">
                <p>Filtros</p>
                <button type="button" class="btn btn-dark WIDTH-75 FSIZE-12px mb-1" @click="this.onClickLimparFiltros()">Limpar</button>
              </div>

              <!-- Inputs de Filtro + Toggle de Estado do material -->
              <div class="D-flex WIDTH-89 BORRAD-5">
                <!-- Inputs de Filtro -->
                <div class="WIDTH-70">
                <!-- OFLOW-Y-scroll -->

                  <!-- Cliente e Familia -->
                  <div class="row">
                    <!-- Cliente -->
                    <div class="col-6 input-group-sm" style="margin-top: -2px;">
                      <label
                        id="filtro-cliente-label"
                        for="filtro-cliente-input"
                        class="form-label BGC-input-disabled BORRAD-5 FWEIGHT-bold FSIZE-14px MARGIN-T-15-L7 PADDING-R2-L2"
                      >Cliente</label>
                      <input
                        disabled
                        id="filtro-cliente-input"
                        autocomplete="off"
                        type="text"
                        class="form-control BOR-grey MARGIN-T-10"
                        v-model="this.cliente.cNmFantasia"
                        >
                    </div>
                    
                    <!-- Família -->
                    <div class="col-6 input-group-sm" style="margin-top: -2px;">
                      <label
                        id="filtro-familia-label"
                        for="filtro-familia-input"
                        class="form-label BGC-branco BORRAD-5 FWEIGHT-bold FSIZE-14px MARGIN-T-15-L7 PADDING-R2-L2"
                      >Família</label>
                      <input
                        id="filtro-familia-input"
                        type="text"
                        autocomplete="off"
                        style="text-transform: uppercase;"
                        class="form-control BOR-grey MARGIN-T-10"
                        @keyup="this.onKeyupFiltroFamilia()">
                    </div>
                  </div>

                  <!-- Código e vão -->
                  <div class="row">
                    <!-- código -->
                    <div class="col-6 input-group-sm" style="margin-top: -2px;">
                      <label
                        id="filtro-codigo-label"
                        for="filtro-codigo-input"
                        class="form-label BGC-branco BORRAD-5 FWEIGHT-bold FSIZE-14px MARGIN-T-15-L7 PADDING-R2-L2"
                      >Código</label>
                      <input
                        id="filtro-codigo-input"
                        type="text"
                        autocomplete="off"
                        style="text-transform: uppercase;"
                        class="form-control BOR-grey MARGIN-T-10"
                        @keyup="this.onKeyupFiltroCodigo()">
                    </div>

                    <!-- vão -->
                    <div class="col-6 input-group-sm" style="margin-top: -2px;" v-if="this.isEstoqueAnalitico">
                      <label
                        id="filtro-vao-label"
                        for="filtro-vao-input"
                        class="form-label BGC-branco BORRAD-5 FWEIGHT-bold FSIZE-14px MARGIN-T-15-L7 PADDING-R2-L2"
                      >Vão</label>
                      <input
                        id="filtro-vao-input"
                        type="text"
                        autocomplete="off"
                        style="text-transform: uppercase;"
                        class="form-control BOR-grey MARGIN-T-10"
                        @keyup="this.onKeyupFiltroVao()">
                    </div>
                  </div>

                  <!-- Descrição e LOTE -->
                  <div class="row">
                    <!-- Descrição -->
                    <div class="col-6 input-group-sm" style="margin-top: -2px;">
                      <label
                        id="filtro-descricao-label"
                        for="filtro-descricao-input"
                        class="form-label BGC-branco BORRAD-5 FWEIGHT-bold FSIZE-14px MARGIN-T-15-L7 PADDING-R2-L2"
                      >Descrição</label>
                      <input
                        id="filtro-descricao-input"
                        type="text"
                        autocomplete="off"
                        style="text-transform: uppercase;"
                        class="form-control BOR-grey MARGIN-T-10"
                        @keyup="this.onKeyupFiltroDescricao()">
                    </div>

                    <!-- LOTE -->
                    <div class="col-6 input-group-sm" style="margin-top: -2px;">
                      <label v-if="cliente.cLote || cliente.iD_Lote"
                        id="filtro-lote-label"
                        for="filtro-lote-input"
                        class="form-label BGC-input-disabled BORRAD-5 FWEIGHT-bold FSIZE-14px MARGIN-T-15-L7 PADDING-R2-L2"
                      >Lote</label>
                      <label v-else
                        id="filtro-lote-label"
                        for="filtro-lote-input"
                        class="form-label BGC-branco BORRAD-5 FWEIGHT-bold FSIZE-14px MARGIN-T-15-L7 PADDING-R2-L2"
                      >Lote</label>
                      <input v-if="cliente.cLote || cliente.iD_Lote"
                        disabled
                        id="filtro-lote-input"
                        type="text"
                        autocomplete="off"
                        style="text-transform: uppercase;"
                        class="form-control BOR-grey MARGIN-T-10"
                        v-model="cliente.cLote"
                        >
                        <input v-else
                        id="filtro-lote-input"
                        type="text"
                        autocomplete="off"
                        style="text-transform: uppercase;"
                        class="form-control BOR-grey MARGIN-T-10"
                        @keyup="this.onKeyupFiltroLote()">
                    </div>
                    
                  </div>

                  <!-- EDIÇÃO -->
                  <div class="row">
                    <!-- Descrição -->
                    <div class="col-6 input-group-sm" style="margin-top: -2px;">
                      <label
                        id="filtro-edicao-label"
                        for="filtro-edicao-input"
                        class="form-label BGC-branco BORRAD-5 FWEIGHT-bold FSIZE-14px MARGIN-T-15-L7 PADDING-R2-L2"
                      >Complemento</label>
                      <input
                        id="filtro-edicao-input"
                        type="text"
                        autocomplete="off"
                        style="text-transform: uppercase;"
                        class="form-control BOR-grey MARGIN-T-10"
                        @keyup="this.onKeyupFiltroEdicao()">
                    </div>
                  </div>

                </div>

                <!-- Toggle de Estado do material -->
                <div class="WIDTH-30 TEXTALI-center MARGIN-T5">
                  <h5 class="">Estado do Material:</h5>
                  <div class=" D-flex JC-space-around">
                    <div></div>
                    <button id="bom-estadoMaterial-button" class="BOR-grey BORRAD-5 WIDTH-30 BGC-branco"
                    @click="this.onClickButtonBom()"
                    >BOM</button>

                    <button id="ruim-estadoMaterial-button" class="BOR-grey BORRAD-5 WIDTH-30 BGC-branco"
                    @click="this.onClickButtonRuim()"
                    >RUIM</button>
                    <div></div>
                  </div>

                </div>

              </div>
            </div>

            <!-- DIV direita -->
            <div class="D-flex FD-column WIDTH-30 BOR-L-solidgrey ALITEM-center">
              <!-- ESTOQUE: ANALÍTICO e SINTÉTICO -->
              <div class="HEIGHT-50 TEXTALI-center MARGIN-T5 WIDTH-100">
                <div class="btn-group WIDTH-95" role="group" aria-label="Basic radio toggle button group">
                  <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" checked @click="this.onEstoqueAnaliticoClicked()">
                  <label class="btn btn-outline-secondary" for="btnradio2">Estoque Analítico</label>

                  <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" @click="this.onEstoqueSinteticoClicked()">
                  <label class="btn btn-outline-secondary" for="btnradio3">Estoque Sintético</label>
                </div>
              </div>

              <!-- Botões -->
              <div class="HEIGHT-50 D-flex JC-space-between ALITEM-flex-end WIDTH-95">
                <!-- Botão de REFRESH -->
                <div class="" style="cursor: pointer;" @click="this.clicaRefreshButton()" title="Atualizar informações">
                  <IconsRefresh corProp="rgb(24, 134, 84)" alturaProp="1.6" larguraProp="1.6" />
                </div>
                
                <!-- Botões de EXPORTAR -->
                <div>
                  <button id="exportar-EXCEL-button" type="button" class="btn btn-success MARGIN-R5 FSIZE-14px" @click="this.onClickExportarExcel()">
                    <IconsExcel corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                    Exportar EXCEL</button>
                    
                    <button id="exportar-PDF-button" type="button" class="btn btn-warning FSIZE-14px" @click="this.onClickExportarPDF()">
                      <IconsPDF corProp="currentColor" alturaProp="1" larguraProp="1"/> 
                      Exportar PDF
                    </button>
                  </div>
              </div>

            </div>
          </div>

          <!-- Tabela -->
          <div class="OFLOW-auto WIDTH-98 HEIGHT-70 BOR-SensacaoAfundado mb-1">
            <!-- Analítico -->
            <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5" v-if="this.isEstoqueAnalitico">
              <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                <tr>
                  <th class="WIDTH-8 TEXTALI-center" scope="col">Cliente</th>
                  <th class="WIDTH-10 TEXTALI-center" scope="col">Código</th>
                  <th class="WIDTH-30 TEXTALI-center" scope="col">Descrição do Produto</th>
                  <th class="WIDTH-9 TEXTALI-center" scope="col">Família</th>
                  <th class="WIDTH-9 TEXTALI-center" scope="col">Comp.</th>
                  <th class="WIDTH-10 TEXTALI-center" scope="col">Lote</th>
                  <th class="WIDTH-8 TEXTALI-center" scope="col">Total</th>
                  <th class="WIDTH-6 TEXTALI-center" scope="col">Estado</th>
                  <th class="WIDTH-10 TEXTALI-center" scope="col">Vão</th>
                </tr>
              </thead>
              <LayoutTabelaCarregarEsqueleto v-if="!this.tabelaCOMPONENTEsCarregada"
                :Linhas="infoEstoqueSlice.length === 0 ? 12 : infoEstoqueSlice.length" :Colunas=9 />
              <tbody v-if="this.tabelaCOMPONENTEsCarregada" class="BORRAD-5">
                <tr
                  v-for="(comp, i) in this.infoEstoqueSlice" :key="i"
                  class="BGC-H-cinza-8 HEIGHT-5px CURSOR-pointer"
                  :class="this.applyTableStipedRows(i)"
                  :id="comp.cCodComponente + ': ' + comp.cVao"
                  data-bs-toggle="modal" data-bs-target="#updateComponenteModal"
									@click="this.fillUpdateDeleteModal(comp.iD_Componente)"
                  >
                  <!-- @click="this.clickComponentOnTheList(comp.iD_Componente)" -->
                  <td class="HEIGHT-5px WIDTH-8 TEXTALI-center no-wrap-text" scope="row" :title="comp.cNmFantasia" >{{ comp.cNmFantasia }}</td>
                  <td class="HEIGHT-5px WIDTH-10 TEXTALI-center no-wrap-text" :title="comp.cCodComponente" >{{ comp.cCodComponente }}</td>
                  <td class="HEIGHT-5px WIDTH-30 TEXTALI-left no-wrap-text" :title="comp.cDescricao" >{{ comp.cDescricao, 45 }}</td>
                  <td class="HEIGHT-5px WIDTH-9 TEXTALI-center no-wrap-text" :title="comp.cFamilia" >{{ shortenInfo(comp.cFamilia, 10) }}</td>
                  <td class="HEIGHT-5px WIDTH-9 TEXTALI-center no-wrap-text" :title="comp.cEdicao" >{{ shortenInfo(comp.cEdicao, 10) }}</td>
                  <td class="HEIGHT-5px WIDTH-10 TEXTALI-center no-wrap-text" :title="comp.cLote" >{{ shortenInfo(comp.cLote, 10) }}</td>
                  <td class="HEIGHT-5px WIDTH-8 TEXTALI-right no-wrap-text" >{{ comp.iQuantidade }}</td>
                  <td class="HEIGHT-5px WIDTH-6 TEXTALI-center no-wrap-text" :class="this.aplicaCorAoEstado(comp.cEstadoMaterial)" >{{ comp.cEstadoMaterial }}</td>
                  <td class="HEIGHT-5px WIDTH-10 TEXTALI-center no-wrap-text BGC-amarelo-intenso-3" style="padding-top: 1px;">{{ comp.cVao }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Sintético -->
            <table class="table-responsive table-sm table-striped WIDTH-100 BORRAD-5" v-if="!this.isEstoqueAnalitico">
              <thead class="BGC-cinza-secondary POSITION-sticky TOP-0">
                <tr>
                  <th class="WIDTH-8 TEXTALI-center" scope="col">Cliente</th>
                  <th class="WIDTH-10 TEXTALI-center" scope="col">Código</th>
                  <th class="WIDTH-40 TEXTALI-center" scope="col">Descrição do Produto</th>
                  <th class="WIDTH-9 TEXTALI-center" scope="col">Família</th>
                  <th class="WIDTH-9 TEXTALI-center" scope="col">Comp.</th>
                  <th class="WIDTH-10 TEXTALI-center" scope="col">Lote</th>
                  <th class="WIDTH-8 TEXTALI-center" scope="col">Total</th>
                  <th class="WIDTH-6 TEXTALI-center" scope="col">Estado</th>
                </tr>
              </thead>
              <LayoutTabelaCarregarEsqueleto v-if="!this.tabelaCOMPONENTEsCarregada" :Linhas=15 :Colunas=8 />
              <tbody v-if="this.tabelaCOMPONENTEsCarregada" class="BORRAD-5">
                <tr
                  v-for="(comp, i) in this.infoEstoqueSlice" :key="i"
                  class="BGC-H-cinza-8 HEIGHT-5px CURSOR-pointer"
                  :class="this.applyTableStipedRows(i)"
                  :id="comp.cCodComponente + ': ' + comp.cVao"
                  data-bs-toggle="modal" data-bs-target="#updateComponenteModal"
									@click="this.fillUpdateDeleteModal(comp.iD_Componente)"
                  >
                  <!-- @click="this.clickComponentOnTheList(comp.iD_Componente)" -->
                  <td class="HEIGHT-5px WIDTH-8 TEXTALI-center" scope="row" >{{ comp.cNmFantasia }}</td>
                  <td class="HEIGHT-5px WIDTH-10 TEXTALI-center" :title="comp.cCodComponente" >{{ comp.cCodComponente }}</td>
                  <td class="HEIGHT-5px WIDTH-40 TEXTALI-left" :title="comp.cDescricao" >{{ shortenInfo(comp.cDescricao, 45) }}</td>
                  <td class="HEIGHT-5px WIDTH-9 TEXTALI-center" :title="comp.cFamilia" >{{ shortenInfo(comp.cFamilia, 10) }}</td>
                  <td class="HEIGHT-5px WIDTH-9 TEXTALI-center" :title="comp.cEdicao" >{{ shortenInfo(comp.cEdicao, 10) }}</td>
                  <td class="HEIGHT-5px WIDTH-10 TEXTALI-center" :title="comp.cLote" >{{ shortenInfo(comp.cLote, 10) }}</td>
                  <td class="HEIGHT-5px WIDTH-8 TEXTALI-right" >{{ comp.iTotal }}</td>
                  <td class="HEIGHT-5px WIDTH-6 TEXTALI-center" :class="this.aplicaCorAoEstado(comp.cEstadoMaterial)">{{ comp.cEstadoMaterial }}</td>
                </tr>
              </tbody>
            </table>

          </div>

          <div class="WIDTH-95">
						<button @click="toggleVerMais" class="btn btn-secondary WIDTH-100 FSIZE-14px">
							{{ mostrarTodos ? `Ver menos...` : `Ver mais... (${this.infoEstoque.length})` }}
						</button>
					</div>

        </div>

      </div>

      <Rodape />

    </div>

    		<!-- Update COMPONENTE Modal -->
		<div class="modal fade" id="updateComponenteModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="updateComponenteModalLabel">
			<div class="modal-dialog modal-xl MIN-WIDTH-97">
				<div class="modal-content" id="modalTableClick">

          <!-- Cabeçalho MODAL -->
					<div class="d-flex justify-content-between align-items-center border-bottom p-2" style="height: 6%;" id="modal-header">	
						<!-- Logo -->
						<img 
						src="assets\images\Logo-E-azul-enhanced.png" 
						alt="Logo Grupo Embalarte" 
						class="WIDTH-2" 
						style="height: auto;" 
						title="Grupo Embalarte">

						<!-- Título -->
						<h1 class="modal-title fs-5 flex-grow-1 text-center" id="updateComponenteModalLabel">
							COMPONENTE
						</h1>

						<div style="margin-right: 50px; cursor: pointer;" @click="fillUpdateDeleteModal(componenteAtual.iD_Componente)" title="Atualizar informações">
							<IconsRefresh
								corProp="rgb(24, 134, 84)"
								alturaProp="1.6"
								larguraProp="1.6"
							/>
						</div>

						<!-- Botão Fechar -->
						<button title="Fechar (F4)" id="update-modal-close-button" 
							type="button" class="btn-close" data-bs-dismiss="modal" 
							aria-label="Close" @click="clickUpdateModalFecharButton()">
						</button>
					</div>

          <!-- Corpo MODAL -->
					<div class="BOR-B-grey-2" style="flex-grow: 1; display: flex; flex-direction: column; height: 75vh;">

						<!-- Formulário Componente -->
						<form id="update-form-componente" class="PADDING-T5-R10-B5-L10 mb-1 BGC-cinza-9 D-flex D-flex JC-space-between" style="flex-shrink: 0;">

							<!-- DIV da esquerda com as informações -->
							<div class="WIDTH-40 MARGIN-R5" style="height: 75vh;">
								<!-- Linha 1 -->
								<div class="mb-1 row">
									<!-- ID -->
									<div class="col-2 input-group-sm">
										<label
											id="update-ID-componente-label"
											for="update-ID-componente-input"
											class="form-label BGC-input-disabled BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 update-label-OS"
										>N°</label>
										<input
											id="update-ID-componente-input"
											type="number"
											class="form-control BOR-grey MARGIN-T-10 update-input-OS"
											disabled
											v-model="componenteAtual.iD_Componente">
									</div>

                  <div class="col-3 input-group-sm">
										<label
											id="update-cliente-componente-label"
											for="update-cliente-componente-input"
											class="form-label BGC-input-disabled BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 PADDING-R5-L5 update-label-OS"
										>CLIENTE</label>
										<input
											id="update-cliente-componente-input"
											type="text"
											class="form-control BOR-grey MARGIN-T-10 update-input-OS"
											disabled
											v-model="cliente.cNmFantasia">
									</div>

									<!-- Data -->
									<div class="col-3 input-group-sm">
										<label
											id="update-data-componente-label"
											for="update-data-componente-select"
											class="form-label BGC-input-disabled BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 FSIZE-12px PADDING-R5-L5 update-label-componente"
										>DATA CRIAÇÃO</label>
										<input
											id="update-data-componente-select"
											type="text"
											class="form-control BOR-grey MARGIN-T-10 update-input-componente"
											v-model="componenteAtual.data"
											disabled />
									</div>


									<!-- Família -->
									<div class="col-4 input-group-sm">
										
										<label
											id="update-familia-componente-label"
											for="update-familia-componente-input"
											class="form-label BGC-input-disabled BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 FSIZE-14px PADDING-R5-L5 update-label-OS-dataCriacao"
										>FAMÍLIA</label>

										<input
											id="update-familia-componente-input"
											class="form-control BOR-grey MARGIN-T-10 update-input-componente"
											v-model="componenteAtual.iD_Familia"
											disabled
										>
										</input>

									</div>
									
								</div>

								<!-- Linha 2 -->
								<div class="mb-1 row">

                  
                  <!-- Edição -->
									<div class="col-3 input-group-sm">
										<label
											id="update-edicao-componente-label"
											for="update-edicao-componente-input"
											class="form-label BGC-input-disabled BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 FSIZE-12px PADDING-R5-L5 update-label-OS-dataCriacao"
										>COMPLEMENTO</label>
										<input
											id="update-edicao-componente-input"
											class="form-control BOR-grey MARGIN-T-10 no-calendar-date-input input-OS-dataCriacao"
											type="text"
											maxlength="50"
											disabled
											style="text-transform:uppercase"
											:title="componenteAtual.edicao"
											v-model="componenteAtual.edicao"
											@keyup="this.onKeyupEditarComponentePesoIndividualInput()">
									</div>

									<!-- Código Componente -->
									<div class="col-3 input-group-sm">
										<label
											id="update-codigo-componente-label"
											for="update-codigo-componente-input"
											class="form-label BGC-input-disabled BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 FSIZE-14px PADDING-R5-L5 update-label-OS-dataCriacao"
										>CÓDIGO</label>
										<input
											id="update-codigo-componente-input"
											class="form-control BOR-grey MARGIN-T-10 no-calendar-date-input input-OS-dataCriacao"
											type="text"
											disabled
											:title="componenteAtual.codComponente"
											v-model="componenteAtual.codComponente"
											@keyup="this.confereCampoTemInformacaoEAplicaBordaVermelha('update-codigo-componente-input', componenteAtual.codComponente)">
									</div>

                  <!-- Padrão caixa -->
									<div class="col-3 input-group-sm">
										<label
											id="update-padraoCaixa-componente-label"
											for="update-padraoCaixa-componente-input"
											class="form-label BGC-input-disabled BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 FSIZE-11px PADDING-R5-L5 update-label-OS-dataCriacao"
										>PADRÃO CAIXA</label>
										<input
											id="update-padraoCaixa-componente-input"
											class="form-control BOR-grey MARGIN-T-10 no-calendar-date-input input-OS-dataCriacao"
											type="number"
											disabled
											v-model="componenteAtual.padraoCaixa"
											@keyup="this.confereCampoTemInformacaoEAplicaBordaVermelha('update-padraoCaixa-componente-input', componenteAtual.padraoCaixa)">
									</div>

									<!-- Peso Individual -->
									<div class="col-3 input-group-sm">
										<label
											id="update-pesoIndividual-componente-label"
											for="update-pesoIndividual-componente-input"
											class="form-label BGC-input-disabled BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 FSIZE-14px PADDING-R5-L5 update-label-OS-dataCriacao"
										>PESO (KG.)</label>
										<input
											id="update-pesoIndividual-componente-input"
											class="form-control BOR-grey MARGIN-T-10 no-calendar-date-input input-OS-dataCriacao"
											type="number"
											disabled
											v-model="componenteAtual.pesoIndividual"
											@keyup="this.onKeyupEditarComponentePesoIndividualInput()">
									</div>

								</div>

								<div class="mb-1 row">


										<!-- Descrição -->
									<div class="col-12 input-group-sm">
										<label
											id="update-descricao-componente-label"
											for="update-descricao-componente-input"
											class="form-label BGC-input-disabled BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 FSIZE-14px PADDING-R5-L5 update-label-OS-dataCriacao"
										>DESCRIÇÃO</label>
										<input
											id="update-descricao-componente-input"
											class="form-control BOR-grey MARGIN-T-10 no-calendar-date-input input-OS-dataCriacao"
											type="text"
											maxlength="75"
											disabled
											style="text-transform:uppercase"
											:title="componenteAtual.descricao"
											v-model="componenteAtual.descricao"
											@keyup="this.confereCampoTemInformacaoEAplicaBordaVermelha('update-descricao-componente-input', componenteAtual.descricao)">
									</div>

								</div>

								<!-- Linha 3 -->
								<div class="mb-2 row">

									<!-- Ajustar visualização -->

									<!-- Quantidade -->
									<div class="col-4 input-group-sm">
										<label
											id="update-quantidade-componente-label"
											for="update-quantidade-componente-input"
											class="form-label BGC-input-disabled BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 FSIZE-12px PADDING-R5-L5 update-label-OS-dataCriacao"
										>QUANTIDADE</label>
										<input
											id="update-quantidade-componente-input"
											class="form-control BOR-grey MARGIN-T-10 no-calendar-date-input input-OS-dataCriacao"
											type="number"
											disabled
											v-model="componenteAtual.quantidade">
									</div>

									<!-- Saldo Bom -->
									<div class="col-4 input-group-sm">
										<label
											id="update-saldoBom-componente-label"
											for="update-saldoBom-componente-input"
											class="form-label BGC-input-disabled BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 FSIZE-12px PADDING-R5-L5 update-label-OS-dataCriacao"
										>SALDO BOM</label>
										<input
											id="update-saldoBom-componente-input"
											class="form-control BOR-grey MARGIN-T-10 no-calendar-date-input input-OS-dataCriacao"
											type="number"
											disabled
											v-model="componenteAtual.saldoBom">
									</div>

									<!-- Saldo Outros -->
									<div class="col-4 input-group-sm">
										<label
											id="update-saldoOutros-componente-label"
											for="update-saldoOutros-componente-input"
											class="form-label BGC-input-disabled BORRAD-5 FWEIGHT-bold MARGIN-T-15-L7 FSIZE-11px PADDING-R5-L5 update-label-OS-dataCriacao"
										>SALDO RUINS</label>
										<input
											id="update-saldoOutros-componente-input"
											class="form-control BOR-grey MARGIN-T-10 no-calendar-date-input input-OS-dataCriacao"
											type="number"
											disabled
											v-model="componenteAtual.saldoOutros">
									</div>
								</div>

							</div>

							<!-- DIV da direita com a FOTO -->
							<div class="WIDTH-60 D-flex JC-center ALITEM-center BGC-cinza-8 BORRAD-5" style="height: 75vh;">
								<!-- Se a imagem estiver carregada, mostra-a. Caso contrário, exibe um texto alternativo -->
								<a v-if="imagemComponente" :href="imagemComponente" target="_blank">
									<img 
										:src="imagemComponente" 
										alt="Imagem do componente" 
										class="MIN-HEIGHT-150px BORRAD-5 rb" 
										style="cursor: pointer; height: 60vh;"
									/>
								</a>
								<p v-else>Imagem não disponível</p>
							</div>

						</form>
						
					</div>

        </div>
      </div>
    </div>

  </main>
</template>


<style scoped>  /* STYLE DO CORPO DA PÁGINA */
.abas-movimentacoes-container {
display: flex;
justify-content: flex-start;
flex-direction: column;
width: 100%;
padding: 10px;
margin: 0 auto; 
}

.conteudo-home-controladoria {
color: rgb(0, 0, 0);
background-color: rgb(255, 255, 255);
}

.corpo-pagina {
	display: block;
	margin-top: 0%; /* Isso é feito para tirar a diferença de altura do cabeçalho */ 
}

.tabela-wrapper {
	flex-grow: 1; /* Faz a tabela ocupar o máximo de espaço restante */
	overflow-y: auto; /* Permite rolagem vertical */
	overflow-x: hidden; /* Evita rolagem horizontal */
	padding-bottom: 10px; /* Pequena margem para evitar que a tabela fique colada no rodapé */
}

.tabela-wrapper th {
	font-size: 0.9rem; /* Ajuste o tamanho da fonte conforme necessário */
}

.table td {
	font-size: 1rem;
}

/* Ajustes no tamanho do cabeçalho */
.table thead {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
}

/* Corrige o problema das linhas ficarem grandes demais */
.table tbody tr {
	height: auto; /* Garante que as linhas tenham apenas o tamanho necessário */
}

.botoes-fixos {
	position: sticky;
	bottom: 0;
	background: white;
	padding-top: 10px;
	/* border-top: 1px solid #ccc; */
	display: flex;
	justify-content: center;
}

.tabela-container {
	flex-grow: 1; /* Faz a tabela ocupar o espaço restante */
	overflow-y: auto; /* Garante que a tabela tenha rolagem vertical */
	height: 100%; /* Garante que a tabela ocupe 100% da altura do container */
}

.botoes-final {
	margin-top: 1%;
	margin-left: 1%;
	margin-right: 1%;
	margin-bottom: 1%;
	width: 200px; /* Ajuste a largura do botão */
	height: 40px; /* Ajuste a altura do botão */
	border: 1px solid #ccc; /* Adicione uma borda ao botão */
	border-radius: 10px;
	background-color: #eaf3f5; /* Cor de fundo do botão */
	display: flex; /* Usa flexbox para alinhamento */
	align-items: center; /* Centraliza o conteúdo verticalmente */
	justify-content: center; /* Centraliza o conteúdo horizontalmente */
	box-sizing: border-box; /* Inclui a borda e o preenchimento na largura e altura totais do botão */
}


.botoes-final h1 {
	font-size: 0.7rem;
	margin-top: 7.5%;
}

.botoes-final:hover {
	background-color: #dad9d9; /* Muda a cor de fundo ao passar o mouse */
}

.disabled-button {
	cursor: default;
	opacity: 0.5;
}

/* Modal e conteúdo */
.modal-content {
	display: flex;
	flex-direction: column;
}

/* Cabeçalho do modal */
#modal-header {
	height: 10%;  /* Altere conforme necessário */
}

/* Contêiner da Tabela */
#table-container {
	overflow-y: auto;
	margin-bottom: 10px;
}

</style>