export const enableButton = (buttonID) => {
  // Recupera o botão:
  const button = document.getElementById(buttonID);

  // Habilita se existir:
  if (button) {
    button.disabled = false;
  }
};