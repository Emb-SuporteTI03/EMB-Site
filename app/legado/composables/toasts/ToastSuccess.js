import { toast} from 'vue3-toastify';

export function ToastSuccess (texto) {
  toast.success(texto, {
    autoClose: 2000,
    transition: 'slide',
    toastClassName: 'toast-letters',
  });
}