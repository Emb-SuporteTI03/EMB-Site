export interface Servico {
  id: string
  titulo: string
  paragrafos: string[]
  imagem: string
}

export const servicos: Servico[] = [
  {
    id: 'armazenagem',
    titulo: 'Armazenagem',
    imagem: '/images/servicos/armazenagem.jpg',
    paragrafos: [
      'Na nossa matriz, contamos com uma estrutura verticalizada e moderna que maximiza o uso do espaço, proporcionando uma solução eficiente para armazenagem em diversos segmentos. O controle de estoque é realizado com precisão através de leitura de códigos e aplicativos mobile, permitindo uma gestão em tempo real e otimizada.',
      'Nossa abordagem flexível atende a uma ampla gama de necessidades, desde produtos de consumo até itens industriais. Com tecnologia avançada e uma infraestrutura adaptável, garantimos uma armazenagem segura e eficiente, oferecendo um serviço confiável e de alta qualidade para nossos clientes.'
    ]
  },
  {
    id: 'picking-packing',
    titulo: 'Picking e Packing e Cross-Docking',
    imagem: '/images/servicos/picking-packing.jpg',
    paragrafos: [
      'Nosso processo de picking e packing é realizado com coletores avançados, o que aumenta significativamente nossa capacidade de produção e eficiência. O tempo de coleta e separação é gerido de acordo com o SLA acordado com o cliente, garantindo precisão e pontualidade em cada etapa do processo.',
      'Além disso, oferecemos controle e visibilidade total das operações por meio de nossa plataforma web em tempo real. Essa tecnologia permite monitorar o progresso e a eficácia das operações, proporcionando uma gestão transparente e eficiente para atender às suas necessidades com a máxima agilidade.'
    ]
  },
  {
    id: 'e-commerce',
    titulo: 'Atendimento E-commerce',
    imagem: '/images/servicos/e-commerce.jpg',
    paragrafos: [
      'Oferecemos toda a infraestrutura necessária para o atendimento completo da sua loja virtual, cobrindo desde o recebimento dos pedidos até a embalagem, separação e envio dos produtos. Nosso serviço é projetado para garantir um processo eficiente e sem falhas, assegurando a satisfação de seus clientes.',
      'Para uma integração perfeita com diversos sistemas e plataformas, disponibilizamos soluções via API. Além disso, realizamos coletas diárias de grandes marketplaces como Mercado Livre, Magazine Luiza e Amazon, garantindo que seus pedidos sejam processados e enviados com rapidez e precisão.'
    ]
  },
  {
    id: 'manuseio-kits',
    titulo: 'Manuseios Diversos e Montagem de Kits',
    imagem: '/images/servicos/manuseio-kits.png',
    paragrafos: [
      'Realizamos uma ampla gama de operações manuais, incluindo encaixotamento, colagem de etiquetas, inserção de lâminas e encartes, entre outros serviços. Nossa abordagem flexível permite adaptar nossas operações às necessidades específicas de cada cliente.',
      'Além disso, utilizamos tecnologia avançada para a colagem de Sniffs e outros itens, oferecendo soluções automatizadas que aumentam a eficiência e a precisão dos processos. Combinando experiência e inovação, garantimos um serviço de manuseio diversificado e de alta qualidade.'
    ]
  },
  {
    id: 'logistica-promocional',
    titulo: 'Logística Promocional',
    imagem: '/images/servicos/logistica-promocional.jpg',
    paragrafos: [
      'Somos especializados na montagem de kits promocionais e diversos, oferecendo um serviço completo que abrange desde o planejamento e a estratégia até a criação e a disponibilização dos itens.',
      'Nossos serviços incluem a personalização dos kits, com opções como gravação Inkjet, etiquetagem e a elaboração de peças personalizadas em MDF. Garantimos que cada kit seja montado com atenção aos detalhes e alinhado às suas necessidades específicas.'
    ]
  },
  {
    id: 'envase-blister',
    titulo: 'Envase e Blister',
    imagem: '/images/servicos/envase-blister.png',
    paragrafos: [
      'Oferecemos envase automático em bisnagas ou frascos, utilizando equipamentos de última geração para garantir precisão e eficiência no processo. Além disso, realizamos o processo de blisterização em cartelas com nossa avançada máquina Carrossel, proporcionando um acabamento profissional e seguro para seus produtos.'
    ]
  },
  {
    id: 'encadernacao',
    titulo: 'Encadernações em Espiral',
    imagem: '/images/servicos/encadernacao.png',
    paragrafos: [
      'Somos especializados em acabamentos em espiral plástico e metálico para livros e apostilas, oferecendo uma solução de encadernação durável e esteticamente agradável. Utilizamos perfuração semi-automática para criar furos oblongos ou redondos, garantindo precisão e consistência no acabamento.',
      'Disponibilizamos espirais em diversas cores, podendo também atender a especificações de pantone escolhidas pelo cliente. Nossa operação é caracterizada por alta produtividade, assegurando eficiência e rapidez no atendimento às suas demandas de encadernação.'
    ]
  },
  {
    id: 'etiquetagem',
    titulo: 'Etiquetagem e Rotulagem',
    imagem: '/images/servicos/etiquetagem.png',
    paragrafos: [
      'Oferecemos serviços completos de etiquetagem e rotulagem para uma ampla gama de produtos. Produzimos etiquetas QR Code, códigos de barras e etiquetas promocionais, adaptando-nos às necessidades específicas de cada cliente.',
      'Utilizamos impressoras Zebra para garantir a melhor qualidade de leitura e codificação, assegurando a precisão e durabilidade das informações nas etiquetas. Nossa abordagem detalhista e tecnológica proporciona soluções eficazes para o etiquetamento de seus produtos.'
    ]
  },
  {
    id: 'gravacao-inkjet',
    titulo: 'Gravação Inkjet',
    imagem: '/images/servicos/inkjet.png',
    paragrafos: [
      'Oferecemos gravação Inkjet para produtos e caixas, permitindo a impressão clara e durável de informações como lote e validade. Nosso serviço de personalização atende a diversas necessidades, garantindo que cada item seja marcado com precisão.',
      'Utilizamos equipamentos automáticos de gravação para assegurar eficiência e consistência, proporcionando uma solução rápida e de alta qualidade para suas necessidades de marcação e personalização.'
    ]
  },
  {
    id: 'distribuicao',
    titulo: 'Distribuição em Nível Nacional',
    imagem: '/images/servicos/distribuicao.png',
    paragrafos: [
      'Oferecemos serviços completos de logística e distribuição para todo o Brasil, garantindo que seus produtos cheguem de maneira eficiente e segura a qualquer local do país. Nossas operações incluem opções de frete fracionado ou dedicado, adaptando-se às suas necessidades específicas.',
      'Realizamos envios via Correios com um sistema integrado para rastreamento e entrega porta-a-porta. Além disso, disponibilizamos operações de Cross-Docking em nossa matriz, otimizando o fluxo de mercadorias e acelerando o processo de distribuição.'
    ]
  }
]
