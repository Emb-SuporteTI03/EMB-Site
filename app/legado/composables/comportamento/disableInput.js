export const disableInput = (inputID) => {
  // Recupera o input:
  const input = document.getElementById(inputID);

  // Confere se o input é amarelo, se for, remove esse fundo:
  const existsBGCAmarelo = Object.values(input.classList).some(element => element === 'BGC-amarelo-claro');
  existsBGCAmarelo ? input.classList.remove('BGC-amarelo-claro') : null;

  // Confere se tem borda amarela, se tiver remove:
  const existsBORAmarelo = Object.values(input.classList).some(element => element === 'BOR-amarelo');
  existsBORAmarelo ? input.classList.remove('BOR-amarelo') : null;

  // Desabilita:
  if (input) {
    input.disabled = true;
    input.style.backgroundColor = '';
  }
};