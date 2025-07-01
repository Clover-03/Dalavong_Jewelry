import { ref } from 'vue';

export function useSnackbar() {
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  });

  const showSnackbar = (message, color = 'success') => {
    snackbar.value.message = message;
    snackbar.value.color = color;
    snackbar.value.show = true;
  };

  return { snackbar, showSnackbar };
} 
 
 
 
 
 
 
 
 
 
 
 