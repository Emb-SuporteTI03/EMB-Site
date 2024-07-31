  <template>
    <main>
  <head>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.3/font/bootstrap-icons.min.css" rel="stylesheet">
  </head>
      <header class="header">
        <div class="container-logo">
          <NuxtLink to="/">
            <a class="logo-imagem">
              <img src="../../assets/images/logo-embalarte-sem-fundo.jpg" alt="Logo Embalarte">
            </a>
          </NuxtLink>
          <div class="menu">
            <ul class="ul-header">

              <!-- Sobre Nós -->
              <li class="drop-hover" ref="dropdownToggle" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
            <a style="color: black; text-decoration: none;">
              SOBRE NÓS <i class="bi" :class="{'bi-caret-right-fill': !isDropdownActive, 'bi-caret-down-fill': isDropdownActive}"></i>
            </a>
            <div class="drop" v-show="isDropdownActive">
              <a style="color: black; text-decoration: none;" href="#linhaInv">QUEM SOMOS</a>
              <hr class="custom-hr2">
              <a style="color: black; text-decoration: none;" href="#linhaQmSomos">NOSSOS SERVIÇOS</a>
            </div>
          </li>

              <!-- Login Cliente -->
              <li><a data-bs-toggle="modal" data-bs-target="#acessoClienteModal" href="" style="color: black; text-decoration: none;">LOGIN CLIENTE</a></li>

              <!-- Contato -->
              <li><a data-bs-toggle="modal" data-bs-target="#contatoModal" href="" style="color: black; text-decoration: none;">CONTATO</a></li>

              <!-- Instagram -->
              <li>
                <a href="https://www.instagram.com/grupoembalarte" target="_blank" title="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                    <path fill="rgb(58, 106, 141)" d="M12 9.52A2.48 2.48 0 1 0 14.48 12A2.48 2.48 0 0 0 12 9.52m9.93-2.45a6.53 6.53 0 0 0-.42-2.26a4 4 0 0 0-2.32-2.32a6.53 6.53 0 0 0-2.26-.42C15.64 2 15.26 2 12 2s-3.64 0-4.93.07a6.53 6.53 0 0 0-2.26.42a4 4 0 0 0-2.32 2.32a6.53 6.53 0 0 0-.42 2.26C2 8.36 2 8.74 2 12s0 3.64.07 4.93a6.86 6.86 0 0 0 .42 2.27a3.94 3.94 0 0 0 .91 1.4a3.89 3.89 0 0 0 1.41.91a6.53 6.53 0 0 0 2.26.42C8.36 22 8.74 22 12 22s3.64 0 4.93-.07a6.53 6.53 0 0 0 2.26-.42a3.89 3.89 0 0 0 1.41-.91a3.94 3.94 0 0 0 .91-1.4a6.6 6.6 0 0 0 .42-2.27C22 15.64 22 15.26 22 12s0-3.64-.07-4.93m-2.54 8a5.73 5.73 0 0 1-.39 1.8A3.86 3.86 0 0 1 16.87 19a5.73 5.73 0 0 1-1.81.35H8.94A5.73 5.73 0 0 1 7.13 19a3.51 3.51 0 0 1-1.31-.86A3.51 3.51 0 0 1 5 16.87a5.49 5.49 0 0 1-.34-1.81V8.94A5.49 5.49 0 0 1 5 7.13a3.51 3.51 0 0 1 .86-1.31A3.59 3.59 0 0 1 7.13 5a5.73 5.73 0 0 1 1.81-.35h6.12a5.73 5.73 0 0 1 1.81.35a3.51 3.51 0 0 1 1.31.86A3.51 3.51 0 0 1 19 7.13a5.73 5.73 0 0 1 .35 1.81V12c0 2.06.07 2.27.04 3.06Zm-1.6-7.44a2.38 2.38 0 0 0-1.41-1.41A4 4 0 0 0 15 6H9a4 4 0 0 0-1.38.26a2.38 2.38 0 0 0-1.41 1.36A4.27 4.27 0 0 0 6 9v6a4.27 4.27 0 0 0 .26 1.38a2.38 2.38 0 0 0 1.41 1.41a4.27 4.27 0 0 0 1.33.26h6a4 4 0 0 0 1.38-.26a2.38 2.38 0 0 0 1.41-1.41a4 4 0 0 0 .26-1.38V9a3.78 3.78 0 0 0-.26-1.38ZM12 15.82A3.81 3.81 0 0 1 8.19 12A3.82 3.82 0 1 1 12 15.82m4-6.89a.9.9 0 0 1 0-1.79a.9.9 0 0 1 0 1.79"></path></svg>
                </a>
              </li>

              <!-- LinkedIn -->
              <li>
                <a href="https://www.linkedin.com/company/grupoembalarte/mycompany" target="_blank" title="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                    <path fill="rgb(58, 106, 141)" d="M18.336 18.339h-2.665v-4.177c0-.996-.02-2.278-1.39-2.278c-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387c2.7 0 3.2 1.778 3.2 4.092v4.714zM7.004 8.575a1.546 1.546 0 0 1-1.548-1.549a1.548 1.548 0 1 1 1.547 1.549m1.336 9.764H5.667V9.75H8.34zM19.67 3H4.33C3.594 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.339C20.4 21 21 20.42 21 19.703V4.297C21 3.581 20.4 3 19.666 3z"></path></svg>
                </a>
              </li>

            </ul>
          </div>
        </div>
      </header>
      
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <NuxtLink to="/">
            <a class="logo-imagem">
              <img src="../../assets/images/logo-embalarte-sem-fundo.jpg" alt="Logo Embalarte">
            </a>
      </NuxtLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
          </li>
          <hr class="custom-hr2">
          <li class="nav-item">
            <a style="color: black; text-decoration: none;" href="#linhaInv">QUEM SOMOS</a>
            <hr class="custom-hr2">
          </li>

          <li class="nav-item">
            <a style="color: black; text-decoration: none;" href="#linhaQmSomos">NOSSOS SERVIÇOS</a>
            <hr class="custom-hr2">
          </li>
          <li><a data-bs-toggle="modal" data-bs-target="#acessoClienteModal" href="" style="color: black; text-decoration: none;">LOGIN CLIENTE</a>
          <hr class="custom-hr2">
          </li>

<!-- Contato -->
<li><a data-bs-toggle="modal" data-bs-target="#contatoModal" href="" style="color: black; text-decoration: none;">CONTATO</a>
</li>

        </ul>
      </div>
    </div>
  </nav>

      <!-- Modal de contato -->
      <div class="modal fade" id="contatoModal" tabindex="-1" aria-labelledby="contatoModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="contatoModalLabel">Entre em contato</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Conte-nos como podemos ajudar. Nós responderemos em breve!</p>
              <form @submit.prevent="insertContato()">
                <div class="mb-3">
                  <label for="nome" class="form-label">Nome</label>
                  <input type="text" class="form-control" id="nome" v-model="contato.nome" required>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">E-mail</label>
                  <input type="email" class="form-control" id="email" v-model="contato.email" required>
                </div>
                <div class="mb-3">
                  <label for="mensagem" class="form-label">Mensagem</label>
                  <textarea class="form-control" id="mensagem" v-model="contato.mensagem" rows="3" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Enviar mensagem</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de acesso cliente -->
      <div class="modal fade" id="acessoClienteModal" tabindex="-1" aria-labelledby="acessoClienteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="acessoClienteModalLabel">Acesso Cliente</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Entre com suas credenciais para acessar sua conta de cliente.</p>
              <form @submit.prevent="verificarLogin()">
                <div class="mb-3">
                  <label for="usuario" class="form-label">Usuário</label>
                  <input type="text" class="form-control" id="usuario" v-model="login.usuario" required>
                </div>
                <div class="mb-3">
                  <label for="senha" class="form-label">Senha</label>
                  <input type="password" class="form-control" id="senha" v-model="login.senha" required>
                </div>
                <button type="submit" class="btn btn-primary">Entrar</button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </main>
  </template>

  <script>
  export default {
    data() {
      return {
        isDropdownActive: false,
        contato: {
          nome: '',
          email: '',
          mensagem: ''
        },
        login: {
          usuario: '',
          senha: ''
        }
      };
    },
    methods: {
      toggleDropdown() {
        this.isDropdownActive = !this.isDropdownActive;
      },
      handleMouseEnter() {
        this.isDropdownActive = true;
      },
      handleMouseLeave() {
        this.isDropdownActive = false;
      },
      insertContato() {
        // Lógica para inserir o contato
        console.log('Enviando mensagem de contato:', this.contato);
        // Aqui você pode implementar o código para enviar os dados do formulário para o backend
        // Resetar o formulário após o envio
        this.contato = {
          nome: '',
          email: '',
          mensagem: ''
        };
        // Fechar o modal
        $('#contatoModal').modal('hide');
      },
      verificarLogin() {
        // Lógica para verificar o login do cliente
        console.log('Verificando login do cliente:', this.login);
        // Aqui você pode implementar o código para verificar as credenciais do cliente no backend
        // Resetar o formulário após o envio
        this.login = {
          usuario: '',
          senha: ''
        };
        // Fechar o modal
        $('#acessoClienteModal').modal('hide');
      }
    }
  };
  </script>

  <style scoped>

  .navbar {
    display: none;
  }


  @media (max-width: 768px) {
    /* Estilos para telas menores */
    .header{
      display: none; 
    }

  .navbar {
    display: block;
    background-color: #f1f1f1;
    color: #f1f1f1;
  }
  }

  .header {
    background-color: white;
    padding: 10px 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .container-logo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
  }

  .logo-imagem img {
    max-width: 150px;
  }

  .menu {
    display: flex;
    align-items: center;
  }

  .ul-header {
    list-style-type: none;
    display: flex;
    gap: 20px;
  }

  .ul-header a {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    line-height: 3.4; /* Ajuste a linha de altura conforme necessário */
    text-decoration: none;
    color: black;
  }

  .drop {
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    display: none;
    z-index: 1;
    text-align: left;
  }

  .drop a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  .drop a:hover {
    background-color: #f1f1f1;
  }

  .drop-hover:hover .drop {
    display: block;
  }

  /* Estilos dos modais */
  .modal-body {
    padding: 20px;
  }

  .modal-content {
    border-radius: 0;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
  }

  .btn-primary:hover {
    background-color: #0069d9;
    border-color: #0062cc;
  }

  .btn-close {
    color: #000;
  }

  .custom-hr2 {
    height: 1px;
    background-color: black;
    border: none;
    margin: 5px 0px 5px;
  }

  </style>
