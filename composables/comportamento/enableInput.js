export const enableInput = (inputID) => {
  // Recupera o input:
  const input = document.getElementById(inputID);

  // Desabilita:
  if (input) {
    input.disabled = false;
  }
};