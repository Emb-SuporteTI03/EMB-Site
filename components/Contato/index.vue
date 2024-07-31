<template>
  <main>
    <div class="titulo-conheca-servicos">
      <hr class="custom-hr1">
      <strong class="tituloConheca" 
        v-motion-slide-visible-once-bottom 
        style="font-size: 2rem; display: block; margin-top: 20px; color:rgb(75, 75, 75)">
        ENTRE EM CONTATO CONOSCO 
      </strong>
      <hr class="custom-hr2">
      <h1 style="font-size: 1.5rem;" class="texto-contato">
        Entre em contato para as <strong class="negrito">melhores</strong> 
        <br>
        soluções em <strong class="negrito">logística</strong> e embalamento
      </h1>
      <hr class="custom-hr2">
      <hr class="custom-hr2">
      <img data-bs-toggle="modal" data-bs-target="#contatoModal" href="" src="../../assets/images/contato.png" alt="Contact Icon" class="contact-icon" />
      <hr class="custom-hr2">
      <hr class="custom-hr2">
    </div>
  </main>
</template>

<style>
/* Estilo para o título "CONHEÇA NOSSOS SERVIÇOS" */
.titulo-conheca-servicos {
  text-align: center;
  margin-top: 40px;
}

.negrito {
  color: rgb(43, 43, 43);
}

.texto-contato {
  color: rgb(75, 75, 75);
}

.contact-icon {
  cursor: pointer;
  display: block;
  max-width: 200px; /* Define a largura máxima da imagem */
  height: auto; /* Mantém a proporção da imagem */
  margin: 0 auto; /* Centraliza horizontalmente */
  max-height: 100vh; /* Define a altura máxima como 100% da altura da tela */
}

/* Media Query para telas menores */
@media (max-width: 768px) {
  .contact-icon {
    max-width: 70%; /* Ajusta a largura máxima da imagem para telas menores */
  }
}

@media (max-width: 480px) {
  .contact-icon {
    max-width: 90%; /* Ajusta ainda mais a largura máxima da imagem para telas muito pequenas */
  }
}

.custom-hr1 {
  margin: 20px 0px 5px 0px;
  border: 0;
  height: 3px;
  background-color: rgb(58, 106, 141);
}

.custom-hr2 {
  margin: 20px 0px 5px 0px;
  border: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0);
}
</style>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import axios from 'axios';

export default {
  data() {
    return {
      infoContato: [],
      contato: {
        nome: '',
        email: '',
        assunto: '',
        mensagem: '',
      },
      infoAcessoClientes: [], 
      acessoCliente: {
        nome: '',
        senha: ''
      },
    }
  },
  methods: {
    clearData() {
      this.contato = {
        nome: '',
        email: '',
        assunto: '',
        mensagem: '',
      };
      this.acessoCliente = {
        nome: '',
        senha: '',
      };
    },
    fetchInfoContato(callback) {
      axios.get('https://localhost:7266/api/v1/SITE_Contato'
      ).then((res) => {
        this.infoContato = res.data;
        if (callback) callback();
      }).catch((error) => {
        console.log(error);
      });
    },
    insertContato() {
      axios.post('https://localhost:7266/api/v1/SITE_Contato',
        {
          nome: this.contato.nome,
          email: this.contato.email,
          assunto: this.contato.assunto,
          mensagem: this.contato.mensagem
        }
      ).then((res) => {
        toast.success("Enviado com sucesso!", {
          autoClose: 10000,
        });
      }).catch((error) => {
        toast.error("Erro", {
          autoClose: 1000,
        });
        console.error('Erro ao inserir contato:', error);
      });
      this.clearData();     
    },
    fetchInfoAcessoClientes(callback) {
      axios.get('https://localhost:7266/api/v1/SITE_AcessoClientes'
      ).then((res) => {
        this.infoAcessoClientes = res.data;
        if (callback) callback();
      }).catch((error) => {
        console.log(error);
      });
    },
    insertAcessoCliente() {
      axios.post('https://localhost:7266/api/v1/SITE_AcessoClientes',
      {
          Nome: this.acessoCliente.nome,
          Senha: this.acessoCliente.senha
      }).then((res) => {
      }).catch((error) => {
        console.error('Erro ao inserir contato:', error);
      });
      this.clearData();
    },
    verificarLogin() {
      let encontrouCombinacaoValida = false;
      for (let i = 0; i < this.infoAcessoClientes.length; i++) {
        if (String(this.acessoCliente.nome) === String(this.infoAcessoClientes[i].nome) && 
            String(this.acessoCliente.senha) === String(this.infoAcessoClientes[i].senha)) {
            toast.success("Login realizado com sucesso!", {
                autoClose: 10000,
            });
            return;
        }
      }
      toast.error("Usuário ou Senha Incorretos!", {
        autoClose: 10000,
      });
    },
  },
  mounted() {
    this.fetchInfoAcessoClientes(() => {});
  }
}
</script>
