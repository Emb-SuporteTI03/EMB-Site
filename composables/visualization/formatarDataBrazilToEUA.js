export function formatarDataBrazilToEUA (dataString) {
  const arrayDataStr = dataString.split('/');
  const dia = arrayDataStr[0];
  const mes = arrayDataStr[1];
  const ano = arrayDataStr[2];
  
  return `${ano}-${mes}-${dia}`;
};