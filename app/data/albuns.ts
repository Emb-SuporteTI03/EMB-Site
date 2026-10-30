export interface Album {
  titulo: string
  descricao?: string
  fotos: { src: string, alt: string }[]
}

// A chave é o slug da URL: /albuns/<chave>
export const albuns: Record<string, Album> = {
  encadernacao: {
    titulo: 'Encadernação',
    fotos: [
      { src: '/images/albuns/encadernacao/espirais.jpg', alt: 'Encadernação de espirais' },
      { src: '/images/albuns/encadernacao/maquina-1.jpg', alt: 'Encadernação: máquina 1' },
      { src: '/images/albuns/encadernacao/maquina-2.jpg', alt: 'Encadernação: máquina 2' },
      { src: '/images/albuns/encadernacao/maquina-3.jpg', alt: 'Encadernação: máquina 3' },
      { src: '/images/albuns/encadernacao/maquina-4.jpg', alt: 'Encadernação: máquina 4' },
      { src: '/images/albuns/encadernacao/caderno.jpg', alt: 'Encadernação de caderno' }
    ]
  },
  manuseio: {
    titulo: 'Manuseio e Montagem de Kits',
    descricao: 'Conjunto promocional do tipo leve três e pague dois ou a agregação de um brinde ao pacote original do produto.',
    fotos: [
      { src: '/images/albuns/manuseio/manuseio-1.jpg', alt: 'Manuseio de produtos' },
      { src: '/images/albuns/manuseio/manuseio-2.jpg', alt: 'Manuseio de produtos' },
      { src: '/images/albuns/manuseio/manuseio-3.jpg', alt: 'Manuseio de produtos' },
      { src: '/images/albuns/manuseio/manuseio-4.jpg', alt: 'Manuseio de produtos' },
      { src: '/images/albuns/manuseio/manuseio-5.jpg', alt: 'Manuseio de produtos' },
      { src: '/images/servicos/manuseio-kits.png', alt: 'Montagem de kits' }
    ]
  },
  shrink: {
    titulo: 'Shrink e Manuseios Diversos',
    fotos: [
      { src: '/images/albuns/shrink/shrink-1.jpg', alt: 'Shrink e manuseios' },
      { src: '/images/albuns/shrink/shrink-3.jpg', alt: 'Shrink e manuseios' },
      { src: '/images/albuns/shrink/shrink-4.jpg', alt: 'Shrink e manuseios' },
      { src: '/images/albuns/shrink/shrink-5.jpg', alt: 'Shrink e manuseios' },
      { src: '/images/servicos/manuseio-kits.png', alt: 'Montagem de kits' },
      { src: '/images/albuns/shrink/shrink-2.jpg', alt: 'Shrink e manuseios' }
    ]
  }
}
