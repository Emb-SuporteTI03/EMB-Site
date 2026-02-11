import axios from 'axios';
export const GetGenerico = async (url, params = {}, token) => {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params, // Adiciona parâmetros de query se necessário
      });
      return response.data;
    } catch (error) {
      console.error("Erro na requisição:", error);
      return error;
    }
  };
  