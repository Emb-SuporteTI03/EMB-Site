<script>

</script>

<template>
  <main>

    
    <div class="conteudo-quem-somos">
      <hr class="custom-hr" id="aaaaa">
      <!-- Caixa de texto -->
      <div class="texto-quem-somos">
        <h1 class="titulo">QUEM SOMOS</h1>
        <p class="paragrafo" style="padding: 0px 10px 0px 10px;">
          A EMBALARTE nasceu do sonho de Fernando Alves Vieira em criar uma empresa forte e sólida,
          para oferecer ao mercado soluções completas e personalizadas. Fundada em 1999 e com 16
          anos de experiência, vem conquistado seu espaço como uma das melhores empresas no segmento.
          Situada na Cidade de Santana de Paranaíba no Estado de São Paulo, dispõe em sua planta própria,
          4.000m2 de área. Localizada próximo as rodovias Anhanguera e Bandeirantes e de fácil acesso ao
          Rodoanel, possibilita agilidade no processo de distribuição e transporte dos materiais.
          Equipamentos de ponta, funcionários treinados e qualificados, gestão e tecnologia completam
          a estrutura voltada para atingir excelência em todas as operações realizadas. Tudo isto atrelado
          ao atendimento personalizado dos gestores que são treinados para buscar a melhor solução de
          acordo com a necessidade dos nossos clientes.
        </p>
      </div>

      <!-- imagem -->
      <div class="imagem-quem-somos">
        <img src="../../assets/images/manuseio7.png" class="imagem" alt="Quem Somos">
      </div>
        
    </div>

     <Rodape />
  
  </main>
</template>

<style>

.conteudo-quem-somos {
  display: flex;
}

.texto-quem-somos {
  display: flex;
  width: 50%;
  flex-direction: column;
  /* items = tags */
  align-items: center;
}

.paragrafo {
  display: flex;
  text-align: justify;
  width: 75%;
} 

.titulo {
  display: flex;
  color: rgb(58, 106, 141);
  justify-content: center;
  width: 50%;
}

@media only screen and (max-width: 768px) {  
  .conteudo-quem-somos {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .texto-quem-somos {
    padding: 30px 0px 0px 0px;
    width: 100%;
  }

  .imagem-quem-somos {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }

  .imagem {
    width: 350px;
    height: 350px;
  }

  .paragrafo {
    display: flex;
    text-align: justify;
    width: 95%;
  } 
}

.rb {
  border: 1px solid red;
}

.imagem-quem-somos {
  display: flex;
  width: 50%;
  justify-content: center;
}


</style>