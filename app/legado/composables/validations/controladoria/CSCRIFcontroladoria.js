import { addElementClass } from "../addElementClass";
import { removeElementClass } from "../removeElementClass";

export const CSCRIFcontroladoria = (inputValue, inputID) => {
  if (inputValue === '' | inputValue === null | inputValue === 0) {
    addElementClass(inputID, 'required-red-border');
    document.getElementById(inputID).focus();
  } else {
    removeElementClass(inputID, 'required-red-border');
  }
}