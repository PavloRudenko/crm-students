import { Element } from "../../../utility.js"
import { Button } from "../../button.js";
import { Input } from "../../input.js";
import { Select } from "./select.js";
import { contactBtnCancel } from "./svg/contact-btn-cancel.js";


class Contact extends Element {
  constructor(options = {}) {
    super()

    this.createComponent(options)
    this.setup()
  }

  setup() {
    this.btnExit.addEventListener('click', this.destroy.bind(this))
  }

  destroy() {
    this.btnExit.removeEventListener('click', this.destroy)
    this.element.remove()

    if (this.event) {
      this.event()
    }
  }

  changeSelect() {
    const { input } = this.input
    input.dataset.type = this.select.selectedId
    input.value = ''
  }

  createComponent(options) {
    this.select = new Select([
      { type: 'phone', value: 'Телефон' },
      { type: 'email', value: 'Email' },
      { type: 'facebook', value: 'Facebook' },
      { type: 'vk', value: 'VK' },
      { type: 'other', value: 'Другое' }
    ], options.type)

    this.select.event = this.changeSelect.bind(this)

    this.input = new Input({
      attrInput: {
        class: 'contact__input',
        placeholder: 'Введите данные контакта',
        'data-type': this.select.selectedId,
        value: options.value ? options.value : ''
      },
      attrLabel: {
        class: 'contact__label'
      }
    })

    this.btnExit = new Button(
      [this.createElement('span', {class: 'contact-btn-exit__popup'}, 'Удалить контакт')],
      {
        type: 'button',
        class: 'btn contact__cancel_X contact-btn-exit',
      }
    ).addSvg(contactBtnCancel, { class: 'contact-btn-exit__icon' }).element

    this.element = this.createElement('div', { class: 'contact' },
      // contact children
      this.select.element,
      this.input.element,
      this.btnExit
    )
  }
}

export { Contact }
