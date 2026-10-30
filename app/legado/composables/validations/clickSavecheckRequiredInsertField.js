import { addElementClass } from "./addElementClass";
import { removeElementClass } from "./removeElementClass";

export const clickSavecheckRequiredInsertField = (inputValue, inputID, labelID) => {
  if (inputValue === '-' | inputValue === '') {
    addElementClass(inputID, 'required-red-border');
    addElementClass(labelID, 'campo-obrigatorio-warning');
  } else {
    removeElementClass(inputID, 'required-red-border');
    removeElementClass(labelID, 'campo-obrigatorio-warning');
  }
}