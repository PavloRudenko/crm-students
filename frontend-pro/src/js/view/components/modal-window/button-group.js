import { Button } from "../button.js";
import { Element } from "../../utility.js";

export default function createButtonGroup(textBtnSubmit, doingBtnSubmit, texBtnCancel = ['Отмена'], doingBtnCancel = 'closeModalWindow', id = '') {
  return new Element().createElement('div', { class: 'form__btn-group' },
    // form__btn-group children
    new Button(textBtnSubmit, {
      'data-doing': doingBtnSubmit,
      class: 'btn form__submit btn-primary',
      type: 'submit'
    }).element,
    new Button(
      texBtnCancel,
      {
        class: 'btn form__cancel',
        type: 'reset',
        'data-doing': doingBtnCancel,
        'data-id': id,
      }).element,
    new Button('',
      {
        class: 'btn form__cancel_X',
        type: 'reset',
        'data-doing': 'closeModalWindow'
      }).element
  )
}
