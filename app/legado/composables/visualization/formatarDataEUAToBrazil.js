export function formatarDataEUAToBrazil (dataString) {
  const arrayDataStr = dataString.split('-');
  const ano = arrayDataStr[0];
  const mes = arrayDataStr[1];
  const dia = arrayDataStr[2];
  
  return `${dia}/${mes}/${ano}`;
};