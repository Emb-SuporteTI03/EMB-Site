export const disableLabel = (labelID) => {
  // Recupera a LABEL:
  const label = document.getElementById(labelID);

  // Confere se essa LABEL tem o asterisco vermelho (Se tiver, remove-o):
  const existsRedAsterisk = Object.values(label.classList).some(element => element === 'red-asterisk');
  existsRedAsterisk ? label.classList.remove('red-asterisk') : null;

  // Confere se o fundo é amarelo (Se tiver, remove-o):
  const existsYellowBGC = Object.values(label.classList).some(element => element === 'BGC-amarelo-claro');
  existsYellowBGC ? label.classList.remove('BGC-amarelo-claro') : label.classList.add('BGC-input-disabled');

  // Confere se o fundo é branco (Se tiver, remove-o):
  const existsWhiteBGC = Object.values(label.classList).some(element => element === 'BGC-branco');
  existsWhiteBGC ? label.classList.remove('BGC-branco') : label.classList.add('BGC-input-disabled');  
};