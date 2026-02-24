export const extrairHorasDataFromDB = (dataString) => {
  const partes = dataString.split('T');
  return partes[1];
}
