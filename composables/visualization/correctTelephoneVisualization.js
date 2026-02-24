export const correctTelephoneVisualization = (numero) => {
  // Remover todos os caracteres não numéricos do número
  const numeroLimpo = numero.toString().replace(/\D/g, '');

  // Verificar o comprimento do número para determinar o formato
  if (numeroLimpo.length === 8) {
      return `${numeroLimpo.substring(0, 4)}-${numeroLimpo.substring(4)}`;
  } else if (numeroLimpo.length === 9) {
      return `${numeroLimpo.substring(0, 1)} ${numeroLimpo.substring(1, 5)}-${numeroLimpo.substring(5)}`;
  } else if (numeroLimpo.length === 11) {
      return `(${numeroLimpo.substring(0, 2)}) ${numeroLimpo.substring(2, 3)} ${numeroLimpo.substring(3, 7)}-${numeroLimpo.substring(7)}`;
  } else if (numeroLimpo.length === 13) {
      return `+${numeroLimpo.substring(0, 2)} (${numeroLimpo.substring(2, 4)}) ${numeroLimpo.substring(4, 5)} ${numeroLimpo.substring(5, 9)}-${numeroLimpo.substring(9)}`;
  } else {
      return "";
  }
}