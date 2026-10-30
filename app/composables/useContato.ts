// Estado do modal de contato, compartilhado entre o menu, as seções e o layout
export function useContato() {
  const aberto = useState('contato-aberto', () => false)

  return {
    aberto,
    abrir: () => {
      aberto.value = true
    }
  }
}
