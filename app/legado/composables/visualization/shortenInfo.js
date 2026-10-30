// P15 - M22 - G30
export const shortenInfo = (string, number) => {

  if (!string || typeof string !== "string") return ""; // Retorna uma string vazia se o valor for inválido

  const array = string.split('');
  let smallArray = [];
  if (string.length > number) {
    for (let i = 0; i < number; i ++) {
      smallArray.push(array[i]);
    }
    smallArray.push('...');
    smallArray = smallArray.join('');
    return smallArray;
  } else {
    return string
  }
};