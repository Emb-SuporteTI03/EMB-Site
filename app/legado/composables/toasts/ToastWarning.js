import { toast} from 'vue3-toastify';

export function ToastWarning (texto) {
  toast.warning(texto, {
    autoClose: 3000,
    transition: 'slide',
    toastClassName: 'toast-letters',
  });
};