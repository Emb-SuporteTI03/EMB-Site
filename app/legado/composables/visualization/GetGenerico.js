import axios from 'axios';
export const GetGenerico = async (url, params = {}, token = null) => {
  // const authStore = useAuthStore();
  const tokenFinal = token ?? authStore.token;
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${tokenFinal}` },
      params
    })

    return response.data
  } catch (error) {
    console.error('Erro na requisição:', error)
    return error
  }
};