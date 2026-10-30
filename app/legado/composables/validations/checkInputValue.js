import { addElementClass } from './addElementClass';
import { removeElementClass } from './removeElementClass';

export const checkInputValue = (inputValue, inputID) => {
  if (inputValue === '-' | inputValue === '' | inputValue === 0) {
    // addElementClass(inputID, 'required-red-border');
  } else {
    removeElementClass(inputID, 'required-red-border');
  }
}