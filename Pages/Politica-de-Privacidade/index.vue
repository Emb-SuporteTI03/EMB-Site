<script setup lang="ts">
const DownloadPDFPoliticaPrivacidade = () => {
  const url = '/Política de Privacidade.pdf';

  const link = document.createElement('a');
  link.href = url;
  link.download = 'Politica de Privacidade Grupo Embalarte.pdf';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <MenuSuperior />

  <main class="pagina-politica">
    <div class="container" style="margin-top: 6vh;">

      <header class="cabecalho">
        <h1>Política de Privacidade</h1>
        <p>
          O GRUPO EMBALARTE valoriza a privacidade e a proteção dos dados pessoais
          de seus usuários, clientes e visitantes.
        </p>
      </header>

      <button id="exportar-EXCEL-button" type="button" class="btn btn-success FSIZE-14px PADDING-4" style="margin-bottom: 20px;" @click="DownloadPDFPoliticaPrivacidade()">
        <IconsPDF corProp="currentColor" alturaProp="1.5" larguraProp="1.5"/> 
        Download Política de Privacidade
      </button>

      <section class="secao">
        <h2>1. Introdução</h2>
        <p>
          Esta Política de Privacidade descreve como coletamos, utilizamos,
          armazenamos e protegemos as informações fornecidas por meio do nosso
          site e serviços.
        </p>
        <p>
          Ao utilizar nosso site, você concorda com os termos descritos nesta
          Política de Privacidade.
        </p>
      </section>

      <section class="secao">
        <h2>2. Dados coletados</h2>

        <h3>Dados fornecidos pelo usuário</h3>
        <ul>
          <li>Nome</li>
          <li>E-mail</li>
          <li>Telefone</li>
          <li>Empresa</li>
          <li>Informações enviadas através de formulários</li>
        </ul>

        <h3>Dados coletados automaticamente</h3>
        <ul>
          <li>Endereço IP</li>
          <li>Dados de navegação</li>
          <li>Cookies</li>
          <li>Informações do navegador e dispositivo</li>
          <li>Páginas acessadas no site</li>
        </ul>
      </section>

      <section class="secao">
        <h2>3. Finalidade da coleta de dados</h2>
        <ul>
          <li>Responder solicitações do usuário</li>
          <li>Fornecer informações sobre produtos ou serviços</li>
          <li>Melhorar a experiência de navegação</li>
          <li>Realizar análises estatísticas</li>
          <li>Cumprir obrigações legais</li>
        </ul>
      </section>

      <section class="secao">
        <h2>4. Compartilhamento de dados</h2>
        <p>O GRUPO EMBALARTE não comercializa dados pessoais.</p>
        <ul>
          <li>Prestadores de serviço necessários para o site</li>
          <li>Cumprimento de obrigação legal</li>
          <li>Ordem judicial ou autoridade competente</li>
        </ul>
      </section>

      <section class="secao">
        <h2>5. Armazenamento e segurança</h2>
        <p>
          O GRUPO EMBALARTE adota medidas técnicas e organizacionais para proteger
          os dados pessoais contra acessos não autorizados, perda ou divulgação.
        </p>
      </section>

      <section class="secao">
        <h2>6. Uso de cookies</h2>
        <p>
          Nosso site pode utilizar cookies para melhorar a experiência de navegação
          e coletar informações estatísticas.
        </p>
      </section>

      <section class="secao">
        <h2>7. Direitos do titular</h2>
        <ul>
          <li>Confirmação da existência de tratamento</li>
          <li>Acesso aos dados pessoais</li>
          <li>Correção de dados</li>
          <li>Anonimização ou eliminação</li>
          <li>Portabilidade dos dados</li>
          <li>Revogação do consentimento</li>
        </ul>
      </section>

      <section class="secao">
        <h2>8. Canal LGPD</h2>
        <p>
          Email para solicitações:  
          <strong>atendimento@grupoembalarte.com.br</strong>
        </p>
      </section>

      <section class="secao">
        <h2>9. Alterações nesta política</h2>
        <p>
          Esta política pode ser atualizada periodicamente para refletir mudanças
          em práticas ou requisitos legais.
        </p>
      </section>

      <section class="secao">

        <h2>10. Contato</h2>

        <p class="texto-contato">
          Em caso de dúvidas sobre esta Política de Privacidade ou sobre o
          funcionamento do site, entre em contato com:
        </p>

        <div class="box-contato">
          <span class="label">Email de atendimento:&nbsp;</span>
          <strong>
            <a href="mailto:atendimento@grupoembalarte.com.br?subject=Contato pelo Portal&body=Olá, preciso de ajuda com:">atendimento@grupoembalarte.com.br
            </a>
          </strong>
        </div>

        <div class="lgpd-box">

          <h3>Canal para exercício de direitos do titular</h3>

          <p>
            O titular dos dados pessoais poderá exercer seus direitos previstos na
            Lei Geral de Proteção de Dados, tais como confirmação de tratamento,
            acesso, correção, anonimização ou eliminação de dados pessoais, mediante
            solicitação ao GRUPO EMBALARTE.
          </p>

          <p>
            As solicitações poderão ser realizadas por meio do seguinte canal:
          </p>

          <div class="box-contato lgpd-email">
            <span class="label">Canal LGPD&nbsp;</span>
            <strong>atendimento@grupoembalarte.com.br</strong>
          </div>

          <p>
            Para garantir a segurança das informações, o GRUPO EMBALARTE poderá
            solicitar dados adicionais para confirmação da identidade do solicitante.
          </p>

          <p>
            As solicitações serão analisadas e respondidas dentro dos prazos
            previstos na legislação aplicável.
          </p>

        </div>

</section>

    </div>

    
  </main>

  <Rodape />
</template>

<style>
.pagina-politica {
  background: #f6f7fb;
  padding: 60px 20px;
}

.container {
  max-width: 900px;
  margin: auto;
}

.cabecalho {
  margin-bottom: 20px;
}

.cabecalho h1 {
  font-size: 36px;
  margin-bottom: 10px;
}

.cabecalho p {
  color: #666;
  font-size: 16px;
}

.secao {
  background: white;
  padding: 25px 30px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.secao h2 {
  margin-bottom: 15px;
  font-size: 20px;
}

.secao h3 {
  margin-top: 15px;
  font-size: 16px;
}

.secao ul {
  padding-left: 20px;
}

.secao li {
  margin-bottom: 6px;
}
</style>