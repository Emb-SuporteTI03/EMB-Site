export const disableButton = (buttonID) => {
  // Recupera o botão:
  const button = document.getElementById(buttonID);

  // Desabilita se ele existir:
  if (button) { 
    button.disabled = true;
  }
};