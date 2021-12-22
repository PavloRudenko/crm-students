import { Element } from '../../utility.js'
import { Button } from '../button.js';
import { Input } from '../input.js'
import createButtonGroup from "./button-group.js";
import { Contact } from './contact/contact.js';


class Form extends Element {
  constructor() {
    super()

    this.inputs = []
  }

  newError(errors = [{ message: 'Что-то пошло не так..' }]) {

    this.error && this.error.remove()
    this.inputs.forEach(input => input.classList.remove('form__input_error'))

    const errorsList = errors.flat()
      .map((error, i) => {
        return this.createElement('span', { class: 'errors__item' }, `${error.message}${i !== errors.length - 1 ? ',' : '.'}`)
      })

    this.error = this.createElement('div', { class: 'errors' },
      this.createElement('span', { class: 'errors__item' }, 'Ошибка: '),
      ...errorsList)

    errors.flat().forEach(error => {
      this.inputs.forEach(input => {
        if (error.field === input.dataset.type && input.value === '') {
          input.classList.add('form__input_error')
        }
      })
    })

    this.btnGroup.before(this.error)
  }

  modalDelete(dataId) {
    this.element = this.createElement('form', { class: 'form modalDelete' },
      // form children
      this.createElement('h3', { class: 'form__title modal-delete__title' }, 'Удалить клиента'),
      this.createElement('p', { class: 'form__text' }, 'Вы действительно хотите удалить данного клиента?'),
      createButtonGroup('Удалить', 'deleteStudent')
    )
    this.studentId = +dataId

    return this
  }

  changeStudent(student) {
    this.btnAddContact = new Button('Добавить контакт', { class: 'btn form__add-contact', type: 'button' }).element
    this.btnGroup = createButtonGroup('Сохранить', 'changeStudent', 'Удалить клиента', 'modalDeleteStudentOpen', student.id)
    this.element = this.createElement('form', { class: 'form' },
      // form children
      this.createElement('div', { class: 'form_top' },
        this.createElement('h3', { class: 'form__title' },
          // form__title children
          'Изменить данные',
          this.createElement('span', { class: 'form__id' }, `ID: ${student.id}`)
        ),
        this.createElement('div', { class: 'form__top' },
          // form__top children
          ...this.createTopInputs([
            { value: student.surname, 'data-type': 'surname' },
            { value: student.name, 'data-type': 'name' },
            { value: student.lastName, 'data-type': 'lastName' }
          ], ['Фамилия*', 'Имя*', 'Отчество'])
        )
      ),
      // form children
      this.createElement('div', { class: 'form__add-contact-wrap' },
        this.btnAddContact
      ),
      this.btnGroup
    )
    student.contacts.forEach(contact => this.addContact(contact))
    this.studentId = +student.id

    this.setup()

    return this
  }

  addStudentForm() {
    this.btnAddContact = new Button('Добавить контакт', { class: 'btn form__add-contact btn-add-contact', type: 'button' }).element
    this.btnGroup = createButtonGroup(['Сохранить'], 'addStudent')
    this.element = this.createElement('form', { class: 'form' },
      // form children
      this.createElement('h3', { class: 'form__title' }, 'Новый клиент'),
      this.createElement('div', { class: 'form__top' },
        // form-top children
        ...this.createTopInputs([
          { placeholder: 'Фамилия*', 'data-type': 'surname' },
          { placeholder: 'Имя*', 'data-type': 'name' },
          { placeholder: 'Отчество', 'data-type': 'lastName' }
        ])
      ),
      this.createElement('div', { class: 'form__add-contact-wrap' },
        this.btnAddContact
      ),
      this.btnGroup
    )
    this.setup()

    return this
  }

  createTopInputs(optionsInputList = [], textList = []) {
    const inputs = optionsInputList.map((option, i) => {

      const attrInput = {}

      Object.keys(option).forEach(key => {
        attrInput[key] = option[key]
      })

      const input = new Input({
        attrInput: {
          class: 'form__input',
          ...attrInput
        },
        attrLabel: {
          class: 'form__label'
        }
      }, textList[i])

      this.inputs.push(input.input)

      return input.element
    })

    return inputs
  }

  handleAddContact() {
    this.addContact()

    if (this.inputs.length > 12) {
      this.btnAddContact.classList.add('form__add-contact_more-then-10')
    }
  }

  addContact(options) {
    const contact = new Contact(options)
    contact.event = this.removeContact(this)
    this.inputs.push(contact.input.input)
    this.btnAddContact.insertAdjacentElement('beforebegin', contact.element)
  }

  removeContact(form) {
    return function () {
      form.btnAddContact.classList.remove('form__add-contact_more-then-10')
      const index = form.inputs.findIndex(input => input === this.input.input)
      form.inputs.splice(index, 1)
    }
  }

  setup() {
    this.btnAddContact.addEventListener('click', this.handleAddContact.bind(this))
  }

  checkValid() {
    this.inputs.forEach(input => input.addEventListener('input', this.handleInputAfterError))
  }

  handleInputAfterError() {
    this.classList.remove('form__input_error')
  }

  destroy() {
    this.removeClass('open')
    this.inputs.forEach(input => input.removeEventListener('input', this.handleInputAfterError))

    setTimeout(() => {
      this.element.parentElement.remove()
      if (this.btnAddContact) {
        this.btnAddContact.removeEventListener('click', this.handleAddContact)
      }
    }, 350)
  }

  addClass(className) {
    this.element.parentElement.classList.add(className)
    this.element.classList.add(className)
  }

  removeClass(className) {
    this.element.parentElement.classList.remove(className)
    this.element.classList.remove(className)
  }

  createComponent(typeFunction, props) {
    const elem = this[typeFunction](props)
      .toWrapp({
        class: 'overlay form__overlay',
        'data-doing': 'closeModalWindow'
      })

    setTimeout(this.addClass.bind(this), 100, 'open')

    return elem
  }
}

export { Form }

