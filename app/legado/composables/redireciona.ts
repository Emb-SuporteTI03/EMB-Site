import { useRouter } from 'vue-router';

export const redireciona = () => {
  const router = useRouter();

  const redirecionaHome = () => router.push('/');

  const redirecionaLogin = () => router.push('/login');
  
  return {
    redirecionaHome,
    redirecionaLogin,
  }

};