export const enableRequiredLabel = (labelID) => {
  // Recupera a LABEL:
  const label = document.getElementById(labelID);

  // Adiciona e remove os estilos:
  label.classList.remove('BGC-input-disabled');
  label.classList.add('red-asterisk');
  label.classList.add('BGC-branco');
};