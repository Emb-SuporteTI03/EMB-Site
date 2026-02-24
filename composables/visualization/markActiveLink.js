export const markActiveLink = () => {
  const itemNavegacaoExtenso = document.getElementsByClassName('icone-item-navegacao')[0];
  const itemNavegacaoIcone = document.getElementsByClassName('icone-item-navegacao-pequena')[0];
  const itemNavegacaoCLicado = document.getElementsByClassName('router-link-active')[0];

  if (itemNavegacaoExtenso) {
    itemNavegacaoCLicado.children[0].classList.add('selected-item-navegacao');
  } else if (itemNavegacaoIcone) {
    itemNavegacaoCLicado.parentElement.classList.add('selected-item-navegacao');
  }
}