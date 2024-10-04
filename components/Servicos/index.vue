<script>
export default {
  data() {
    return {
      initial: {
        scale: 0.5, // Começa pequeno
        x: 100, // Começa da direita
        opacity: 0,
      },
      enter: {
        scale: 1, // Fica no tamanho normal
        x: 0, // Move para a posição final
        opacity: 1,
        transition: {
          scale: {
            duration: 5000, // Duração da animação de escala
            ease: 'ease-out', // Tipo de easing
          },
          x: {
            duration: 7000, // Duração da animação de movimento
            ease: 'ease-out', // Tipo de easing
          },
          opacity: {
            duration: 1000, // Duração da animação de opacidade
          },
        },
        mounted() {
          window.addEventListener('scroll', this.handleScroll);
        },
        unmounted() {
          window.removeEventListener('scroll', this.handleScroll);
        },
      },
    };
    
  },
  methods: {

    
  }
}
</script>

<template>
  <div class = "pc">
    <div class="container-history">
        <h1 class="titulo-nossos-servicos" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          NOSSOS SERVIÇOS
        </h1>  
        <div class="texto-intro">
          <img draggable="false" src="../../assets/images/deposito_sf.png" class="imagem-intro" />
          <p style="font-family: 'Outfit', sans-serif;">
            Bem-vindo à Embalarte, 
            uma empresa inovadora 
            e versátil no setor 
            de embalagens. Com um 
            portfólio diversificado 
            de produtos, nos dedicamos 
            a fornecer soluções de 
            embalagem de alta qualidade 
            que atendem às necessidades 
            específicas de cada cliente. <br>
          </p>
          <img draggable="false" id="galpao_direita" src="../../assets/images/deposito_sf.png" class="imagem-intro" />
        </div>
        <hr class="custom-hr" id="Armazenagem">   
        <hr class="custom-hr">
        
        <div class="texto-servicos">

        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <h2>Armazenagem</h2>
        Na nossa matriz, contamos com uma estrutura verticalizada e moderna que maximiza o uso do espaço, proporcionando uma solução eficiente para armazenagem em diversos segmentos. O controle de estoque é realizado com precisão através de leitura de códigos e aplicativos mobile, permitindo uma gestão em tempo real e otimizada.
        <br>
        <br>
        Nossa abordagem flexível atende a uma ampla gama de necessidades, desde produtos de consumo até itens industriais. Com tecnologia avançada e uma infraestrutura adaptável, garantimos uma armazenagem segura e eficiente, oferecendo um serviço confiável e de alta qualidade para nossos clientes.
        </p>
          <img draggable="false"src="../../assets/images/armazenagem_servicos.jpg" class="nossos_servicos-img">
        </div>
        <hr class="custom-hr"  id="Picking_Packing">
        <hr class="custom-hr">
       

        <div class="nossos_servicos">
        <img src="../../assets/images/pickPack.jpg">
        <p 
        class="paragrafo-nossos-servicos_direita" 
        style="font-family: 'Outfit', sans-serif;"
        v-motion-slide-visible-once-bottom>
        <h2>Picking e Packing e Cross-Docking</h2>
        Nosso processo de picking e packing é realizado com coletores avançados, o que aumenta significativamente nossa capacidade de produção e eficiência. O tempo de coleta e separação é gerido de acordo com o SLA acordado com o cliente, garantindo precisão e pontualidade em cada etapa do processo.
        <br>
        <br>
        Além disso, oferecemos controle e visibilidade total das operações por meio de nossa plataforma web em tempo real. Essa tecnologia permite monitorar o progresso e a eficácia das operações, proporcionando uma gestão transparente e eficiente para atender às suas necessidades com a máxima agilidade.
        </p>
        </div>

        <hr class="custom-hr" id="Atendimento_E-Commerce">   
        <hr class="custom-hr">
        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <h2>Atendimento E-commerce</h2>
        Oferecemos toda a infraestrutura necessária para o atendimento completo da sua loja virtual, cobrindo desde o recebimento dos pedidos até a embalagem, separação e envio dos produtos. Nosso serviço é projetado para garantir um processo eficiente e sem falhas, assegurando a satisfação de seus clientes.
        <br>
        <br>
        Para uma integração perfeita com diversos sistemas e plataformas, disponibilizamos soluções via API. Além disso, realizamos coletas diárias de grandes marketplaces como Mercado Livre, Magazine Luiza e Amazon, garantindo que seus pedidos sejam processados e enviados com rapidez e precisão.
          </p>
          <img draggable="false" src="../../assets/images/e-commerce.jpg" v-motion-fade-visible-once class = "nossos_servicos-img">  
        </div>


        <hr class="custom-hr" id="Manuseio_e_Kits">   
        <hr class="custom-hr">

        <div class="nossos_servicos">
          <img draggable="false"  src="../../assets/images/manuseio7.png" 
          v-motion-fade-visible-once class = "nossos_servicos-img"> 
          <p class="paragrafo-nossos-servicos_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <h2>Manuseios Diversos e Montagem de Kits</h2>
        Realizamos uma ampla gama de operações manuais, incluindo encaixotamento, colagem de etiquetas, inserção de lâminas e encartes, entre outros serviços. Nossa abordagem flexível permite adaptar nossas operações às necessidades específicas de cada cliente.
        <br>
        <br>
        Além disso, utilizamos tecnologia avançada para a colagem de Sniffs e outros itens, oferecendo soluções automatizadas que aumentam a eficiência e a precisão dos processos. Combinando experiência e inovação, garantimos um serviço de manuseio diversificado e de alta qualidade.
          </p>
        </div> 

        <hr class="custom-hr" id="Logistica_Promocional">   
        <hr class="custom-hr">

        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <h2>Logistica Promocional</h2>
        Especializamos na montagem de kits promocionais e diversos, oferecendo um serviço completo que abrange desde o planejamento e a estratégia até a criação e a disponibilização dos itens.
        <br>
        <br>
        Nossos serviços incluem a personalização dos kits, com opções como gravação Inkjet, etiquetagem e a elaboração de peças personalizadas em MDF. Garantimos que cada kit seja montado com atenção aos detalhes e alinhado às suas necessidades específicas.
          </p>
          <img draggable="false" src="../../assets/images/logistica.jpg" v-motion-fade-visible-once class = "nossos_servicos-img"> 
        </div>

        <hr class="custom-hr" id="Envaze_e_Blister">   
        <hr class="custom-hr">

        <div class="nossos_servicos">
          <img draggable="false" src="../../assets/images/bisnaga.png" v-motion-fade-visible-once class = "nossos_servicos-img"> 
          <p class="paragrafo-nossos-servicos_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <h2>Envaze e Blister</h2>

        Envase e Blister
        Oferecemos envase automático em bisnagas ou frascos, utilizando equipamentos de última geração para garantir precisão e eficiência no processo. Além disso, realizamos o processo de blisterização em cartelas com nossa avançada máquina Carrossel, proporcionando um acabamento profissional e seguro para seus produtos.
          </p>
        </div>

        <hr class="custom-hr" id="Encadernacao">   
        <hr class="custom-hr">


        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            <h2>Encadernações em Espiral</h2>
            Especializamos em acabamentos em espiral plástico e metálico para livros e apostilas, oferecendo uma solução de encadernação durável e esteticamente agradável. Utilizamos perfuração semi-automática para criar furos oblongos ou redondos, garantindo precisão e consistência no acabamento.
            <br>
            <br>
            Disponibilizamos espirais em diversas cores, podendo também atender a especificações de pantone escolhidas pelo cliente. Nossa operação é caracterizada por alta produtividade, assegurando eficiência e rapidez no atendimento às suas demandas de encadernação.
          </p>
          <img draggable="false" src="../../assets/images/caderno.png" v-motion-fade-visible-once class = "nossos_servicos-img"> 

        </div>

        <hr class="custom-hr" id="Etiquetagem">   
        <hr class="custom-hr">

        <div class="nossos_servicos">
          <img draggable="false" src="../../assets/images/etiquetagem.png" v-motion-fade-visible-once class = "nossos_servicos-img"> 
          <p class="paragrafo-nossos-servicos_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            <h2>Etiquetagem e Rótulagem</h2>
            Oferecemos serviços completos de etiquetagem e rotulagem para uma ampla gama de produtos. Produzimos etiquetas QR Code, códigos de barras e etiquetas promocionais, adaptando-nos às necessidades específicas de cada cliente.
            <br>
            <br>
            Utilizamos impressoras Zebra para garantir a melhor qualidade de leitura e codificação, assegurando a precisão e durabilidade das informações nas etiquetas. Nossa abordagem detalhista e tecnológica proporciona soluções eficazes para o etiquetamento de seus produtos.
          </p>
        </div>

        <hr class="custom-hr" id="Gravacao">   
        <hr class="custom-hr">


        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            <h2>Gravação Inkjet</h2>
            Oferecemos gravação Inkjet para produtos e caixas, permitindo a impressão clara e durável de informações como lote e validade. Nosso serviço de personalização atende a diversas necessidades, garantindo que cada item seja marcado com precisão.
            <br>
            <br>
            Utilizamos equipamentos automáticos de gravação para assegurar eficiência e consistência, proporcionando uma solução rápida e de alta qualidade para suas necessidades de marcação e personalização.
          </p>
          <img draggable="false" src="../../assets/images/inkjet-removebg-preview.png" v-motion-fade-visible-once class = "nossos_servicos-img"> 
        </div>
        
        <hr class="custom-hr" id="Distribuicao">   
        <hr class="custom-hr">


        <div class="nossos_servicos">
          <img draggable="false"src="../../assets/images/Novo Projeto (1).png" 
          v-motion
          :initial="initial"
          :enter="enter"
          class="animado">
          <p class="paragrafo-nossos-servicos_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            <h2>Distribuição em Nível Nacional</h2>
            Oferecemos serviços completos de logística e distribuição para todo o Brasil, garantindo que seus produtos cheguem de maneira eficiente e segura a qualquer local do país. Nossas operações incluem opções de frete fracionado ou dedicado, adaptando-se às suas necessidades específicas.
            <br>
            <br>
            Realizamos envios via Correios com um sistema integrado para rastreamento e entrega porta-a-porta. Além disso, disponibilizamos operações de Cross-Docking em nossa matriz, otimizando o fluxo de mercadorias e acelerando o processo de distribuição.
          </p>
        </div>
      </div>
    </div>


  <div class="container-tecnologia" id="Secao_Tecnologia">
    <hr class="custom-hr">   
    <hr class="custom-hr">   
    <hr class="custom-hr">   
    <hr class="custom-hr">   

    <h1 class="titulo-nossas-tecnologias" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
      NOSSAS TECNOLOGIAS
    </h1>  

    <div class="texto-intro-tecnologias">
      <div class="item-tecnologia">
        <img draggable="false" id="celular" src="../../assets/images/celular.png" class="imagem-intro-tec"/>
      </div>
      <div class="item-tecnologia">
        <p class="paragrafo-tecnologias-intro" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          Bem-vindo à Embalarte, uma empresa inovadora e versátil 
          no setor de embalagens. Com um portfólio diversificado de produtos, 
          nos dedicamos a fornecer soluções de embalagem de alta qualidade 
          que atendem às necessidades específicas de cada cliente. <br>
        </p>
      </div>
      <div class="item-tecnologia">
        <img draggable="false" id="notebook" src="../../assets/images/notebook.png" class="imagem-intro-tec"/>
      </div>
    </div> 
    
    <div class="texto-tecnologias">

    <div class="nossas_tecnologias">
      <p class="paragrafo-nossas-tecnologias_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
      <strong>USO DE TABLETS E DE OUTRAS TECNOLOGIAS</strong> <br>
      Utilizamos tablets e outras tecnologias avançadas para otimizar nossos processos operacionais e melhorar a eficiência. Os tablets são empregados para facilitar o acesso a informações em tempo real, controle de inventário e execução de tarefas, garantindo precisão e agilidade nas operações.
      <br>
      <br>
      Além dos tablets, incorporamos tecnologias modernas para automatizar e monitorar diferentes aspectos do nosso serviço. Essas inovações permitem uma gestão mais eficaz, melhorando a comunicação, a coleta de dados e o acompanhamento de tarefas, resultando em um serviço mais ágil e eficiente.
      </p>
      <img draggable="false" src="../../assets/images/tablet.png" v-motion-fade-visible-once class="nossas_tecnologias-img">  
    </div>   

    <div class="nossas_tecnologias">
      <img draggable="false" src="../../assets/images/solucoes.jpg" v-motion-fade-visible-once class="nossas_tecnologias-img">  
      <p class="paragrafo-nossas-tecnologias_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
      <strong>DESENVOLVIMENTO DE SOLUÇÕES MOBILE</strong> <br>
      Estamos na vanguarda do uso de tablets e outras tecnologias avançadas para otimizar nossos processos e operações. A integração de dispositivos móveis em nosso fluxo de trabalho permite uma gestão mais ágil e eficiente das tarefas diárias, desde o controle de inventário até a comunicação interna.
      <br>
      <br>
      Nossos sistemas são projetados para aproveitar ao máximo a tecnologia disponível, oferecendo uma experiência mais conectada e produtiva. A adoção de tecnologias inovadoras garante que possamos atender às demandas do mercado com rapidez e precisão, mantendo-nos sempre à frente nas melhores práticas de gestão e operação.
    </p>
    </div>

    <div class="nossas_tecnologias">
      <p class="paragrafo-nossas-tecnologias_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <strong>USO E DESENVOLVIMENTO DE API</strong><br>
        No uso e desenvolvimento de APIs, focamos em criar soluções que permitem integração eficiente e comunicação fluida entre diferentes sistemas e plataformas. Nossas APIs são projetadas para garantir que os dados sejam transmitidos com segurança e precisão, facilitando a interoperabilidade e a automação de processos.
        <br>
        <br>
        Desenvolvemos APIs personalizadas para atender às necessidades específicas de nossos clientes, melhorando a funcionalidade e a escalabilidade dos sistemas existentes. Com uma abordagem voltada para a inovação e a eficiência, garantimos que nossas soluções de API ofereçam suporte robusto e flexível, promovendo uma integração perfeita e um fluxo contínuo de informações.
      </p>
      <img draggable="false" src="../../assets/images/api.png" v-motion-fade-visible-once class="nossas_tecnologias-img">  
    </div>

    <div class="nossas_tecnologias">
      <img draggable="false" id="appEmb" src="../../assets/images/app.jpeg" v-motion-fade-visible-once class="nossas_tecnologias-img">  
      <p class="paragrafo-nossas-tecnologias_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
      <strong>APLICATIVO PRÓPRIO</strong> <br>
      Desenvolvemos um aplicativo próprio para oferecer uma experiência personalizada e eficiente aos nossos clientes. Com nosso aplicativo, você tem acesso fácil e rápido a todas as funcionalidades e serviços que oferecemos, desde o acompanhamento de pedidos até a gestão de operações.
      <br>
      <br>
      O aplicativo é projetado para integrar-se perfeitamente aos nossos sistemas, proporcionando uma interface intuitiva e recursos avançados para otimizar a sua experiência. Com ele, você pode monitorar em tempo real, acessar informações detalhadas e realizar ações de forma prática e segura.
    </p>
    </div>
  </div>



</div>
  </div>  
  <div class = "celular">
    <div class="container-history">
        <h1 class="titulo-nossos-servicos" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          NOSSOS SERVIÇOS
        </h1>  
        <div class="texto-intro">
          <p style="font-family: 'Outfit', sans-serif;">
            Bem-vindo à Embalarte, 
            uma empresa inovadora 
            e versátil no setor 
            de embalagens. Com um 
            portfólio diversificado 
            de produtos, nos dedicamos 
            a fornecer soluções de 
            embalagem de alta qualidade 
            que atendem às necessidades 
            específicas de cada cliente. <br>
          </p>
        </div>
        <hr class="custom-hr" id="Armazenagem">   
        <hr class="custom-hr">
        
        <div class="texto-servicos">

        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <h2>Armazenagem</h2>
        Na nossa matriz, contamos com uma estrutura verticalizada e moderna que maximiza o uso do espaço, proporcionando uma solução eficiente para armazenagem em diversos segmentos. O controle de estoque é realizado com precisão através de leitura de códigos e aplicativos mobile, permitindo uma gestão em tempo real e otimizada.
        <br>
        <br>
        Nossa abordagem flexível atende a uma ampla gama de necessidades, desde produtos de consumo até itens industriais. Com tecnologia avançada e uma infraestrutura adaptável, garantimos uma armazenagem segura e eficiente, oferecendo um serviço confiável e de alta qualidade para nossos clientes.
        </p>
        </div>
        <hr class="custom-hr"  id="Picking_Packing">
        <hr class="custom-hr">
       

        <img src="../../assets/images/pickPack.jpg" class ="nossos_servicos-img">
        <div class="nossos_servicos">
        <p 
        class="paragrafo-nossos-servicos_direita" 
        style="font-family: 'Outfit', sans-serif;"
        v-motion-slide-visible-once-bottom>
        <h2>Picking e Packing e Cross-Docking</h2>
        Nosso processo de picking e packing é realizado com coletores avançados, o que aumenta significativamente nossa capacidade de produção e eficiência. O tempo de coleta e separação é gerido de acordo com o SLA acordado com o cliente, garantindo precisão e pontualidade em cada etapa do processo.
        <br>
        <br>
        Além disso, oferecemos controle e visibilidade total das operações por meio de nossa plataforma web em tempo real. Essa tecnologia permite monitorar o progresso e a eficácia das operações, proporcionando uma gestão transparente e eficiente para atender às suas necessidades com a máxima agilidade.
        </p>
        </div>

        <hr class="custom-hr" id="Atendimento_E-Commerce">   
        <hr class="custom-hr">
        <img draggable="false" src="../../assets/images/e-commerce.jpg" v-motion-fade-visible-once class ="nossos_servicos-img">  
        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <h2>Atendimento E-commerce</h2>
        Oferecemos toda a infraestrutura necessária para o atendimento completo da sua loja virtual, cobrindo desde o recebimento dos pedidos até a embalagem, separação e envio dos produtos. Nosso serviço é projetado para garantir um processo eficiente e sem falhas, assegurando a satisfação de seus clientes.
        <br>
        <br>
        Para uma integração perfeita com diversos sistemas e plataformas, disponibilizamos soluções via API. Além disso, realizamos coletas diárias de grandes marketplaces como Mercado Livre, Magazine Luiza e Amazon, garantindo que seus pedidos sejam processados e enviados com rapidez e precisão.
          </p>
        </div>


        <hr class="custom-hr" id="Manuseio_e_Kits">   
        <hr class="custom-hr">

        <img draggable="false"  src="../../assets/images/manuseio7.png" 
        v-motion-fade-visible-once class = "nossos_servicos-img"> 
        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <h2>Manuseios Diversos e Montagem de Kits</h2>
        Realizamos uma ampla gama de operações manuais, incluindo encaixotamento, colagem de etiquetas, inserção de lâminas e encartes, entre outros serviços. Nossa abordagem flexível permite adaptar nossas operações às necessidades específicas de cada cliente.
        <br>
        <br>
        Além disso, utilizamos tecnologia avançada para a colagem de Sniffs e outros itens, oferecendo soluções automatizadas que aumentam a eficiência e a precisão dos processos. Combinando experiência e inovação, garantimos um serviço de manuseio diversificado e de alta qualidade.
          </p>
        </div> 

        <hr class="custom-hr" id="Logistica_Promocional">   
        <hr class="custom-hr">

        <img draggable="false" src="../../assets/images/logistica.jpg" v-motion-fade-visible-once class = "nossos_servicos-img"> 
        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <h2>Logistica Promocional</h2>
        Especializamos na montagem de kits promocionais e diversos, oferecendo um serviço completo que abrange desde o planejamento e a estratégia até a criação e a disponibilização dos itens.
        <br>
        <br>
        Nossos serviços incluem a personalização dos kits, com opções como gravação Inkjet, etiquetagem e a elaboração de peças personalizadas em MDF. Garantimos que cada kit seja montado com atenção aos detalhes e alinhado às suas necessidades específicas.
          </p>
        </div>

        <hr class="custom-hr" id="Envaze_e_Blister">   
        <hr class="custom-hr">

        <img draggable="false" src="../../assets/images/bisnaga.png" v-motion-fade-visible-once class = "nossos_servicos-img"> 
        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <h2>Envase e Blister</h2>

        Envase e Blister
        Oferecemos envase automático em bisnagas ou frascos, utilizando equipamentos de última geração para garantir precisão e eficiência no processo. Além disso, realizamos o processo de blisterização em cartelas com nossa avançada máquina Carrossel, proporcionando um acabamento profissional e seguro para seus produtos.
          </p>
        </div>

        <hr class="custom-hr" id="Encadernacao">   
        <hr class="custom-hr">


        <img draggable="false" src="../../assets/images/caderno.png" v-motion-fade-visible-once class = "nossos_servicos-img"> 
        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            <h2>Encadernações em Espiral</h2>
            Especializamos em acabamentos em espiral plástico e metálico para livros e apostilas, oferecendo uma solução de encadernação durável e esteticamente agradável. Utilizamos perfuração semi-automática para criar furos oblongos ou redondos, garantindo precisão e consistência no acabamento.
            <br>
            <br>
            Disponibilizamos espirais em diversas cores, podendo também atender a especificações de pantone escolhidas pelo cliente. Nossa operação é caracterizada por alta produtividade, assegurando eficiência e rapidez no atendimento às suas demandas de encadernação.
          </p>

        </div>

        <hr class="custom-hr" id="Etiquetagem">   
        <hr class="custom-hr">

        <img draggable="false" src="../../assets/images/etiquetagem.png" v-motion-fade-visible-once class = "nossos_servicos-img"> 
        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            <h2>Etiquetagem e Rótulagem</h2>
            Oferecemos serviços completos de etiquetagem e rotulagem para uma ampla gama de produtos. Produzimos etiquetas QR Code, códigos de barras e etiquetas promocionais, adaptando-nos às necessidades específicas de cada cliente.
            <br>
            <br>
            Utilizamos impressoras Zebra para garantir a melhor qualidade de leitura e codificação, assegurando a precisão e durabilidade das informações nas etiquetas. Nossa abordagem detalhista e tecnológica proporciona soluções eficazes para o etiquetamento de seus produtos.
          </p>
        </div>

        <hr class="custom-hr" id="Gravacao">   
        <hr class="custom-hr">


        <img draggable="false" src="../../assets/images/inkjet-removebg-preview.png" v-motion-fade-visible-once class = "nossos_servicos-img"> 
        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            <h2>Gravação Inkjet</h2>
            Oferecemos gravação Inkjet para produtos e caixas, permitindo a impressão clara e durável de informações como lote e validade. Nosso serviço de personalização atende a diversas necessidades, garantindo que cada item seja marcado com precisão.
            <br>
            <br>
            Utilizamos equipamentos automáticos de gravação para assegurar eficiência e consistência, proporcionando uma solução rápida e de alta qualidade para suas necessidades de marcação e personalização.
          </p>
        </div>
        
        <hr class="custom-hr" id="Distribuicao">   
        <hr class="custom-hr">


        <img draggable="false"src="../../assets/images/Novo Projeto (1).png" 
        v-motion
        :initial="initial"
        :enter="enter"
        class="animado">
        <div class="nossos_servicos">
          <p class="paragrafo-nossos-servicos_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
            <h2>Distribuição em Nível Nacional</h2>
            Oferecemos serviços completos de logística e distribuição para todo o Brasil, garantindo que seus produtos cheguem de maneira eficiente e segura a qualquer local do país. Nossas operações incluem opções de frete fracionado ou dedicado, adaptando-se às suas necessidades específicas.
            <br>
            <br>
            Realizamos envios via Correios com um sistema integrado para rastreamento e entrega porta-a-porta. Além disso, disponibilizamos operações de Cross-Docking em nossa matriz, otimizando o fluxo de mercadorias e acelerando o processo de distribuição.
          </p>
        </div>
      </div>
    </div>


  <div class="container-tecnologia" id="Secao_Tecnologia">
    <hr class="custom-hr">   
    <hr class="custom-hr">   
    <hr class="custom-hr">   
    <hr class="custom-hr">   

    <h1 class="titulo-nossas-tecnologias" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
      NOSSAS TECNOLOGIAS
    </h1>  

    <div class="texto-intro-tecnologias">
      <div class="item-tecnologia imagem-superior">
        <img draggable="false" id="celular" src="../../assets/images/celular.png" class="imagem-intro-tec"/>
      </div>
      <div class="item-tecnologia texto-central">
        <p class="paragrafo-tecnologias-intro" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
          Bem-vindo à Embalarte, uma empresa inovadora e versátil 
          no setor de embalagens. Com um portfólio diversificado de produtos, 
          nos dedicamos a fornecer soluções de embalagem de alta qualidade 
          que atendem às necessidades específicas de cada cliente. <br>
        </p>
      </div>
      <div class="item-tecnologia imagem-inferior">
        <img draggable="false" id="notebook" src="../../assets/images/notebook.png" class="imagem-intro-tec"/>
      </div>
    </div>

    
    <div class="texto-tecnologias">

      <img draggable="false" src="../../assets/images/tablet.png" v-motion-fade-visible-once class="nossas_tecnologias-img">  
    <div class="nossas_tecnologias">
      <p class="paragrafo-nossas-tecnologias_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
      <strong>USO DE TABLETS E DE OUTRAS TECNOLOGIAS</strong> <br>
      Utilizamos tablets e outras tecnologias avançadas para otimizar nossos processos operacionais e melhorar a eficiência. Os tablets são empregados para facilitar o acesso a informações em tempo real, controle de inventário e execução de tarefas, garantindo precisão e agilidade nas operações.
      <br>
      <br>
      Além dos tablets, incorporamos tecnologias modernas para automatizar e monitorar diferentes aspectos do nosso serviço. Essas inovações permitem uma gestão mais eficaz, melhorando a comunicação, a coleta de dados e o acompanhamento de tarefas, resultando em um serviço mais ágil e eficiente.
      </p>
    </div>   

    <img draggable="false" src="../../assets/images/solucoes.jpg" v-motion-fade-visible-once class="nossas_tecnologias-img">  
    <div class="nossas_tecnologias">
      <p class="paragrafo-nossas-tecnologias_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
      <strong>DESENVOLVIMENTO DE SOLUÇÕES MOBILE</strong> <br>
      Estamos na vanguarda do uso de tablets e outras tecnologias avançadas para otimizar nossos processos e operações. A integração de dispositivos móveis em nosso fluxo de trabalho permite uma gestão mais ágil e eficiente das tarefas diárias, desde o controle de inventário até a comunicação interna.
      <br>
      <br>
      Nossos sistemas são projetados para aproveitar ao máximo a tecnologia disponível, oferecendo uma experiência mais conectada e produtiva. A adoção de tecnologias inovadoras garante que possamos atender às demandas do mercado com rapidez e precisão, mantendo-nos sempre à frente nas melhores práticas de gestão e operação.
    </p>
    </div>

    <img draggable="false" src="../../assets/images/api.png" v-motion-fade-visible-once class="nossas_tecnologias-img">  

    <div class="nossas_tecnologias">
      <p class="paragrafo-nossas-tecnologias_esquerda" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
        <strong>USO E DESENVOLVIMENTO DE API</strong><br>
        No uso e desenvolvimento de APIs, focamos em criar soluções que permitem integração eficiente e comunicação fluida entre diferentes sistemas e plataformas. Nossas APIs são projetadas para garantir que os dados sejam transmitidos com segurança e precisão, facilitando a interoperabilidade e a automação de processos.
        <br>
        <br>
        Desenvolvemos APIs personalizadas para atender às necessidades específicas de nossos clientes, melhorando a funcionalidade e a escalabilidade dos sistemas existentes. Com uma abordagem voltada para a inovação e a eficiência, garantimos que nossas soluções de API ofereçam suporte robusto e flexível, promovendo uma integração perfeita e um fluxo contínuo de informações.
      </p>
    </div>

    <img draggable="false" id="appEmb" src="../../assets/images/app.jpeg" v-motion-fade-visible-once class="nossas_tecnologias-img">  
    <div class="nossas_tecnologias">
      <p class="paragrafo-nossas-tecnologias_direita" style="font-family: 'Outfit', sans-serif;" v-motion-slide-visible-once-bottom>
      <strong>APLICATIVO PRÓPRIO</strong> <br>
      Desenvolvemos um aplicativo próprio para oferecer uma experiência personalizada e eficiente aos nossos clientes. Com nosso aplicativo, você tem acesso fácil e rápido a todas as funcionalidades e serviços que oferecemos, desde o acompanhamento de pedidos até a gestão de operações.
      <br>
      <br>
      O aplicativo é projetado para integrar-se perfeitamente aos nossos sistemas, proporcionando uma interface intuitiva e recursos avançados para otimizar a sua experiência. Com ele, você pode monitorar em tempo real, acessar informações detalhadas e realizar ações de forma prática e segura.
    </p>
    </div>
  </div>



</div>
  </div>

  </template>
  
<style>
.celular {
  display: none;
}

#galpao_direita {
    transform: scaleX(-1); /* Reverte a imagem horizontalmente */
}
#armazenagem {
  transform: scaleX(-1); /* Reverte a imagem horizontalmente */

}
.texto-intro {
    display: flex; /* Flexbox for images and text layout */
    align-items: center; /* Center items vertically */
    justify-content: space-between;
    width: 100%; /* Full width of the parent container */
    height: 40%;
    overflow: hidden; /* Hide overflow if images are too large */
    background-color: rgb(154, 191, 207);

  }
.texto-intro p {
  font-size: 1.4rem;
}

.texto-intro img {
  height: 50%;
}

.imagem-intro {
  padding: -5%;
  margin: -5%;
  display: block; /* Remove o espaço extra causado pelo modo inline padrão */
}

.imagem-intro img {
  height: 15%;
  width: 10px;
}

.nossos_servicos img {
  width: 30%; /* Ajuste para a largura desejada */
  height: auto; /* Mantém a proporção da imagem */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
}

.nossos_servicos p {
  font-size: 1rem;
}

.nossos_servicos h2 {
  font-size: 3rem;
}

.nossos_servicos{
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5% 10%; /* Ajuste o espaçamento vertical */
}

.separador {
    width: 100px; /* Make it full-width or adjust as needed */
}
/* Contêiner de imagens */
.nossos_servicos {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5% 10%; /* Ajuste o espaçamento vertical */
}

.texto-servicos {
  margin-left: 12%; /* Espaço à esquerda */
  margin-right: 12%; /* Espaço à direita */  
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
#caminhao {
  width: 30%; /* Ajuste para a largura desejada */
  height: auto; /* Mantém a proporção da imagem */
}

#blister {
  width: 30%; /* Ajuste para a largura desejada */
  height: auto; /* Mantém a proporção da imagem */
}
#caderno {
  margin-top: 5%;
  width: 20%; /* Ajuste para a largura desejada */
  height: auto; /* Mantém a proporção da imagem */
  margin-left: 10%;
}
.animado {
  width: 30%; /* Ajuste para a largura desejada */
  height:  30%; /* Mantém a proporção da imagem */
  margin-bottom: 10%;
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
  border-radius: 10px; 
  display: inline-block; /* Para permitir o efeito de transformação */
  animation: pulsar 2s infinite; /* Adiciona a animação de pulsação */
}
/* Define a animação de pulsação */
@keyframes pulsar {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1); /* Aumenta um pouco */
  }
  100% {
    transform: scale(1);
  }
}
.container-history {
  display: flex;
  flex-direction: column; /* Alinha os elementos em coluna */
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Alinha verticalmente */
  text-align: center; /* Centraliza o texto dentro do contêiner */
}
.titulo-nossos-servicos {
  font-size: 5rem;
  color:#01395E;
  justify-content: center; /* Centraliza os parágrafos dentro do contêiner */
  align-items: center; /* Alinha verticalmente os parágrafos no centro */
  margin-top: 70px;
}

.paragrafo-nossos-servicos_esquerda {
  margin-left: 5%; /* Espaço à esquerda */
  margin-right: 7%; /* Espaço à direita */  
}

.paragrafo-nossos-servicos_direita {
  margin-left: 5%; 
  margin-right: 7%;  
}
.custom-hr {
  border: none; /* Remove qualquer borda padrão */
  height: 2%; /* Altura da linha (pode ser ajustada conforme necessário) */
  background-color: transparent; /* Torna a linha transparente */
  margin: 0; /* Remove qualquer margem padrão */
}
  /* Contêiner de imagens individuais */

/* Estilo das imagens */
.imagem-nossos-servicos-img {
  width: 30%; /* Ajuste para a largura desejada */
  height:  30%; /* Mantém a proporção da imagem */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
  border-radius: 10px; 
}
/* Contêiner para centralizar imagens e texto */
.imagem-nossos-servicos {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Alinha o conteúdo à esquerda */
  margin: 15px 100px; /* Ajuste o espaçamento vertical */
}
.titulo-nossas-tecnologias {
  font-size: 5rem;
  color:#01395E;
  justify-content: center; /* Centraliza os parágrafos dentro do contêiner */
  align-items: center; /* Alinha verticalmente os parágrafos no centro */
}

.item-tecnologia {
  flex: 1; /* Faz com que cada item ocupe uma parte igual do espaço disponível */
  display: flex;
  justify-content: center; /* Centraliza o conteúdo dentro do item */
  align-items: center; /* Alinha verticalmente o conteúdo no centro */
}

.imagem-intro-tec {
  max-width: 100%; /* Garante que as imagens não excedam o tamanho do contêiner */
  height: auto; /* Mantém a proporção das imagens */
}

#notebook {
  transform: scaleX(-1); /* Reverte a imagem horizontalmente */
  width: 40%; /* Ensure images do not exceed viewport width */
  margin-right: 6%;
}

#celular {
  height: 200px; /* Maintain aspect ratio */
  width: auto; /* Ensure images do not exceed viewport width */
  margin-left: 6%;
}

.texto-intro-tecnologias {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 35%;
  background-color: rgb(154, 191, 207);
}

/* Contêiner para centralizar imagens e texto */
.nossas_tecnologias {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5% 10%; /* Ajuste o espaçamento vertical */
}

.paragrafo-tecnologias-intro {
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}


.texto-tecnologias {
  margin-left: 12%; /* Espaço à esquerda */
  margin-right: 12%; /* Espaço à direita */  
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

#appEmb {
  border: 2px solid #01395E; /* Borda tracejada de 2px com cor azul */
}

.paragrafo-nossas-tecnologias_esquerda {
  margin-left: 5%; /* Espaço à esquerda */
  margin-right: 7%; /* Espaço à direita */  
}

.paragrafo-nossas-tecnologias_direita {
  margin-left: 5%; /* Espaço à esquerda */
  margin-right: 7%; /* Espaço à direita */  
}

.animado {
  display: inline-block; /* Para permitir o efeito de transformação */
  animation: pulsar 2s infinite; /* Adiciona a animação de pulsação */
}

/* Define a animação de pulsação */
@keyframes pulsar {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1); /* Aumenta um pouco */
  }
  100% {
    transform: scale(1);
  }
}

.container-tecnologia {
  display: flex;
  flex-direction: column; /* Alinha os elementos em coluna */
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Alinha verticalmente */
  text-align: center; /* Centraliza o texto dentro do contêiner */
}

.titulo-nassas-tecnologias {
  font-size: 6rem;
  color:#01395E;
  justify-content: center; /* Centraliza os parágrafos dentro do contêiner */
  align-items: center; /* Alinha verticalmente os parágrafos no centro */
}

.titulo-nassas-tecnologias2 {
  font-size: 4rem; 
}

/* Estilo das imagens */
.nossas_tecnologias-img {
  width: 25%; /* Ajuste para a largura desejada */
  height: auto; /* Mantém a proporção da imagem */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
}

.nossas_tecnologias-img img{
  width: 30%; /* Ajuste para a largura desejada */
}

.nossas_tecnologias p {
  font-size: 1rem;
}

@media only screen and (max-width: 768px){
  .pc {
    display: none;
  }
  .celular {
    display: block;
  }
  .texto-intro-tecnologias {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* Espaça os elementos de forma a posicionar o texto no centro e as imagens nos extremos */
  width: 100%;
  height: 100vh;
  background-color: rgb(154, 191, 207);
  padding: 20px 0; /* Adiciona um pouco de padding para dar espaço nas bordas superior e inferior */
}

.item-tecnologia {
  text-align: center; /* Centraliza o conteúdo horizontalmente */
}

.imagem-superior img, .imagem-inferior img {
  width: 10vh; /* Define um tamanho máximo para as imagens */
}

.texto-central {
  flex-grow: 1; /* Permite que o texto ocupe o espaço restante disponível entre as imagens */
  display: flex;
  align-items: center; /* Alinha o texto verticalmente no meio do espaço disponível */
  justify-content: center; /* Centraliza o texto horizontalmente */
}

.paragrafo-tecnologias-intro {
  margin: 0; /* Remove o margin padrão para garantir o posicionamento correto */
  font-size: 1.2rem; /* Ajusta o tamanho da fonte conforme necessário */
  color: #000000; /* Exemplo de cor de texto */
}

.titulo-nossas-tecnologias {
  font-size: 7vh;
  color:#01395E;
  justify-content: center; /* Centraliza os parágrafos dentro do contêiner */
  align-items: center; /* Alinha verticalmente os parágrafos no centro */
}
/* Estilo das imagens */
.nossos_servicos-img {
  width: 25vh; /* Ajuste para a largura desejada */
  height: 25vh; /* Mantém a proporção da imagem */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
  border-radius: 10px; 
}

.animado {
  width: 25vh; /* Ajuste para a largura desejada */
  height: 25vh; /* Mantém a proporção da imagem */
  object-fit: contain; /* Ajusta a imagem para caber no contêiner sem cortar */
}

}
  </style>