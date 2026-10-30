export const enableStringWriting = (inputID) => {
  document.getElementById(inputID).removeEventListener('keypress', function (e) {
    // Verifica se o caractere não está entre 0 e 9 e não é "/"
    if ((e.key < '0' || e.key > '9') && e.key !== '/') {
      e.preventDefault(); // Impede a entrada do caractere
    }
  });
}