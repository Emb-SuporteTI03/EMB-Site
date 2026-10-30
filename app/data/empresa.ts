export const empresa = {
  nome: 'Grupo Embalarte',
  cnpj: '03.252.307/0001-78',
  email: 'atendimento@grupoembalarte.com.br',
  cidade: 'Santana de Parnaíba',
  mapaEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d460.678557502492!2d-46.88537203440607!3d-23.403045692778065!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf1c60570bde1f%3A0x5aa53ca281712703!2sGRUPO%20EMBALARTE!5e1!3m2!1spt-BR!2sbr!4v1727880282949!5m2!1spt-BR!2sbr',
  redes: [
    { label: 'Instagram', icon: 'i-simple-icons-instagram', to: 'https://www.instagram.com/grupoembalarte' },
    { label: 'LinkedIn', icon: 'i-simple-icons-linkedin', to: 'https://www.linkedin.com/company/grupoembalarte/mycompany' }
  ],
  acessos: [
    { label: 'POP 18 01', description: 'Agendamento de recebimento e expedição (.docx)', icon: 'i-lucide-file-down', to: '/docs/pop-18-01-agendamento-recebimento-expedicao.docx', external: true },
    { label: 'Agendamento', description: 'Formulário de agendamento', icon: 'i-lucide-calendar-check', to: 'https://forms.office.com/r/1maudxn8pQ', target: '_blank' },
    { label: 'Interno', description: 'Acesso dos colaboradores', icon: 'i-lucide-lock', to: 'https://ts-embalarte-fin.skyone.guru/login', target: '_blank' }
  ]
}

export const mailtoContato = `mailto:${empresa.email}?subject=${encodeURIComponent('Contato pelo Portal')}&body=${encodeURIComponent('Olá, preciso de ajuda com:')}`
