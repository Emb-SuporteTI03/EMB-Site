import { toast} from 'vue3-toastify';

export function ToastError (texto) {
  toast.error(texto, {
    autoClose: 4000,
    transition: 'slide',
    toastClassName: 'toast-letters',
  });
}