// // token = 3616c0fcc655bc653c7601ea9eb7facf
// export const useUtils = () => {
//   const getWeather = async () => {
//     const { data, pending } = await useLazyFetch(
//       'http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=3616c0fcc655bc653c7601ea9eb7facf',
//       {
//         headers: {
//           Authorization: {

//           }
//         },
//         // O 'transform' permite que eu acesse diretamente
//         // a 'response' ou 'data' sem ter que acessar por meio
//         // de 'products.data'. Acessando somente com 'products'.
//         // transform: (_data) => _data.data,
//       }
//     );
  
//     return data.value;
//   };

//   return {
//     getWeather,
//   }
// };