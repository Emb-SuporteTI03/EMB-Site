export const formataOS = (valor) => {
  // Converte o valor para string, independentemente do tipo
  const valorStr = typeof valor === 'string' ? valor : String(valor);

  // Adiciona padding à esquerda
  return valorStr.padStart(5, '0');
};
