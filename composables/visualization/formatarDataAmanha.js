export const formatarDataAmanha = (dataString) => {
  const data = new Date(dataString);
  data.setDate(data.getDate() + 1); // Adiciona 1 dia corretamente

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return `${dia}/${mes}/${ano}`;
};
