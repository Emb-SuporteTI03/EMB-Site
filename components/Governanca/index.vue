<template>
  <div> 
    <div class="container-history-pc">
      <h1 class="gov_titulo" id="titulo-container" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        GOVERNANÇA E AGENDA ESG
      </h1>
      <div class="gov_paragrafo" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        
        <div class="section">
          <div class="image-content">
            <img draggable="false" src="../../assets/images/esg.png" v-motion-fade-visible-once class="gov_imagem">
          </div>
          <div class="text-content">
            <ul class="styled-list">
              <li style="font-size: 2rem;">Em 2022 reforçamos nosso compromisso com os <strong>padrões de Governança Corporativa</strong>, 
                tomamos diversas medidas que impactaram positivamente a empresa para a conformidade da Agenda ESG.</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <div class="text-content">
            <ul class="styled-list">

              <li style="font-size: 1.5rem;"><br> • Criamos o conselho de Administração onde suas
              principais funções são: fixar a orientação geral dos
              negócios, decidir sobre temas de relevância estratégica,
              entre outras competências.</li>
              <li><br></li>

              <li style="font-size: 1.5rem;"> • A nossa empresa possui um serviço personalizado de consultoria, desde 2020, 
                realizado pela MS Rezende.</li>
              <li><br></li>
              
              <li style="font-size: 1.5rem;">• Promovemos reuniões períodicas de conselho para
              analisar resultados, impactos e estratégias.
              </li>
              <li><br></li>

            </ul>
          </div>
          <div class="image-content">
            <img draggable="false" src="../../assets/images/esg2.png" class="gov_imagem" style="width: 80%;">
          </div>
        </div>

        <div class="section centered-section" style="display: block;">
          <h1 style="font-size: 5rem;">RESPEITO</h1>
          
          <ul class="styled-list">
          <li style="font-size: 1.5rem; margin-bottom: 10%;">O <strong>GRUPO EMBALARTE</strong> respeita a individualidade de cada
              pessoa, não discrimina identidade de gênero e orientação
              sexual, religião, raça, etnia, deficiência, cultura, nacionalidade,
              classe social, idade, características físicas, opinião ou qualquer
              outra forma de discriminação, assédio, hostilidade, abuso ou
              injustiça.</li>
            </ul>


        </div>

        <div class="section">

          <div class="text-content">

            <ul class="styled-list">

              <li style="font-size: 1.5rem;"><strong>Repudiamos toda e qualquer </strong>forma degradante de trabalho:
              infantil, forçado, escravo, bem como <strong>qualquer</strong> tipo de assédio
              ou a prática de abusos físicos e psicológicos,
              independentemente de seu nível hierárquico, nesse sentido
              respeitamos:</li>

            </ul>
          </div>
          
          <div class="text-content" style="margin-left: 10%;">
            <ul class="styled-list">
              <li style="font-size: 1.5rem;">• O direito à dignidade e à privacidade;</li>
              <li style="font-size: 1.5rem;">• O direito à vida e à liberdade;</li>
              <li style="font-size: 1.5rem;">• Liberdade de opinião e de expressão;</li>
              <li style="font-size: 1.5rem;">• Liberdade de associação; e</li>
              <li style="font-size: 1.5rem;">• O direito ao trabalho e à educação.</li>

            </ul>
          </div>

        </div>

        <div class="section centered-section" style="display: block; margin-top: 10%">
          <h1 style="font-size: 5rem;">SUSTENTABILIDADE</h1>
          
          <ul class="styled-list">
          <li style="font-size: 1.5rem; margin-bottom: 10%;">
            <strong>O sol</strong>, é a grande aposta para nossas futuras
            gerações, Desde de Junho de 2022 <strong>toda a energia utilizada em
            nossa matriz é proveniente de placas solares</strong>.Além disso, sua produção não emite
            qualquer tipo de poluição ou gases de efeito
            estufa, garantindo o compromisso do país na
            diminuição de CO2. Também pensando na sustentabilidade,  
            os poucos resíduos gerados de nosso processo
            produtivo (papel e plástico) são coletados por
            empresa especializada em reciclagem.
          </li>
           
          </ul>

        </div>
        
      </div>
    </div>
  </div>
</template>

<style>
/* Contêiner de imagens */
.container-history-cellphone {
  display: none;
}
.container-history-pc {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Espaço entre linhas de imagens */
}

.gov_titulo {
  font-size: 8vh;
  text-align: center; /* Justifica o texto no centro */
  color: #01385C;
}

.gov_titulo2 {
  font-size: 5vh;
  text-align: center; /* Justifica o texto no centro */
  color: #01385C;
}

#titulo-container {
  margin-top: 6%;
}

.gov_paragrafo {
  padding: 0px 15%;
  font-size: 1rem;
  text-align: left; /* Alinha o texto à esquerda */
}

/* Estilização da lista */
.styled-list {
  list-style-type: none; /* Remove marcadores da lista */
  padding-left: 0;
}

.styled-list li {
  margin-bottom: 10px; /* Espaçamento entre itens da lista */
  font-size: 2.5vh;
}

.section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px; /* Espaçamento entre seções */
}

/* Texto à esquerda */
.text-content {
  width: 60%;
}

/* Imagem à direita */
.image-content {
  width: 35%;
  display: flex;
  justify-content: center;
}

.gov_imagem {
  width: 20vh; /* Faz com que a imagem ocupe toda a largura do contêiner */
  height: auto; /* Mantém a proporção da imagem */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
}

.centered-section {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center; /* Centraliza o texto dentro da seção */
}


@media only screen and (max-width: 768px){
  .container-history-pc {
    display: none;
  }

  .container-history-cellphone {
    display: block;
    margin-top: 10vh;
  }

  .section {
    display: flex;
    align-items: center;
    justify-content: center;  
    margin-bottom: 1vh; /* Espaçamento entre seções */
  }

  .gov_titulo2 {
  font-size: 5vh;
  display: flex;
  text-align: center; /* Justifica o texto no centro */
  justify-content: center;  
  color: #01385C;
  margin-left: -7.5vh;
  margin-right: -7.5vh;
}

}
</style>
