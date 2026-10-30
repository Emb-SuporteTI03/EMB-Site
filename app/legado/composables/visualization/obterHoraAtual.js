export const obterHoraAtual = (data) => {
  const horas = String(data.getHours()).padStart(2, '0'); // Obtém as horas e garante que tenha 2 dígitos
  const minutos = String(data.getMinutes()).padStart(2, '0'); // Obtém os minutos
  const segundos = String(data.getSeconds()).padStart(2, '0'); // Obtém os segundos

  return `${horas}:${minutos}:${segundos}`; // Retorna o horário no formato 'HH:MM:SS'
}