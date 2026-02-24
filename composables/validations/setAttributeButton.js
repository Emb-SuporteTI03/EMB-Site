export function setAttributeButton (buttonID, openClose) {
  document.getElementById(buttonID).setAttribute('data-bs-dismiss', openClose);
}