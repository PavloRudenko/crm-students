import { Header } from './view/components/header.js'
import { Table } from './view/components/table.js'
import { Form } from "./view/components/modal-window/index.js"
import { Model } from './model.js'
import { validation } from "./validation.js";
import { Loader } from './view/components/loader.js';

class Listeners {
  constructor() {
    this.header = new Header({
      title: 'skb.',
      attributes: {
        class: 'logo'
      }
    }, {
      attrInput: {
        placeholder: 'Введите запрос',
        class: 'search-input',
        id: 'search',
      },
      attrLabel: {
        class: 'header__label',
        for: 'search'
      }
    }, this.searchStudent.bind(this)
      , { class: 'header' })

    this.table = new Table({
      attributes: {
        class: 'tHead'
      },
      headCellsList: [
        { title: 'ID', class: 'thead__title_color_purple', doing: 'sortById', index: 0, arrow: true },
        { title: 'Фамилия Имя Отчество', doing: 'sortByFullName', index: 1, arrow: true, alphabet: true },
        { title: 'Дата и время создания', doing: 'sortByCreateAt', index: 2, arrow: true },
        { title: 'Последние изменения', doing: 'sortByUpdateAt', index: 3, arrow: true },
        { title: 'Контакты' },
        { title: 'Действия' },
      ]
    },
      {
        attributes: {
          class: 'tBody'
        }
      },
      { class: 'table' })

    this.model = new Model()

    this.loader = new Loader({ parent: { class: 'loader-wrapper' }, child: { class: 'loader' } })

    history.pushState('', document.title, window.location.pathname)
  }

  handleToggleContactPopup({ target }) {
    target.firstChild.classList.toggle('contact-icon__popup_d_none')
  }

  async searchStudent() {
    this.table.deleteAllStudents()
    const { value } = this.header.searchInput

    this.table.element.parentElement.after(this.loader.element)

    this.model.getClientsList().then(data => {
      this.loader.destroy()

      if (!value) {
        return this.table.studentsRender(data)
      }

      const studentList = data.filter(client => {
        return Object.values(client).find(prop => {
          if (typeof prop === 'string') {
            return prop.toLowerCase().includes(value.toLowerCase())
          }
        })
      })
      this.table.studentsRender(studentList)
    })
  }

  deleteStudent(event) {
    event.preventDefault()
    const { studentId } = this.form
    this.model.deleteClient(studentId)
    this.table.deleteStudent(studentId)
    this.closeModalWindow()
  }

  async changeForm() {
    const id = location.hash.slice(1)

    this.model.getClient(id).then(data => {
      this.btnTarget.classList.remove('loading')
      this.form = new Form()
      document.body.append(this.form.createComponent(
        'changeStudent',
        data
      ))
    })
  }

  hashChange({ target }) {
    target.classList.add('loading')
    const { id } = target.dataset
    location.hash = `#${id}`

    target.disabled = true
    this.btnTarget = target
  }

  copyHash({ target }) {
    target.classList.add('clicked')
    navigator.clipboard.writeText(location.href + '#' + target.dataset.id)

    setTimeout(() => target.classList.remove('clicked'), 2500)
  }

  modalDeleteStudentOpen({ target }) {
    this.btnTarget ? this.btnTarget.disabled = false : ''
    target.disabled = true
    this.btnTarget = target
    const { id } = target.dataset
    if (this.form) {
      this.closeModalWindow()
    }
    this.form = new Form()

    document.body.append(
      this.form.createComponent(
        'modalDelete',
        id
      )
    )
  }

  addModalWindow({ target }) {
    target.disabled = true
    this.btnTarget = target
    this.form = new Form()

    document.body.append(this.form.createComponent(
      'addStudentForm',
      {
        surname: 'Фамилия*',
        name: 'Имя*',
        lastName: 'Отчество'
      }
    ))
  }

  closeModalWindow() {
    history.pushState('', document.title, window.location.pathname)
    const { form } = this
    this.btnTarget ? this.btnTarget.disabled = false : ''
    form.destroy()
    delete this.form
  }

  createDataStudent(inputs) {
    const student = {
      contacts: []
    }

    inputs.forEach((input, i) => {
      const { type } = input.dataset
      const { value } = input
      i < 3 ? student[type] = value
        : student.contacts.push({
          type,
          value
        })
    })

    return student
  }

  async changeStudent(event) {
    event.preventDefault()

    const { form, model, table } = this
    form.checkValid()

    const data = this.createDataStudent(form.inputs)

    const isValid = validation(data)
    if (!isValid.ok) {
      const { errors } = isValid
      return form.newError(errors)
    }

    const response = await model.patchClient(form.studentId, data)
    if (!response.ok) {
      const { errors } = await response.json()
      return form.newError(errors)
    }

    table.changeStudent(await response.json())
    this.closeModalWindow()
  }

  async addStudent(event) {
    event.preventDefault()

    const { form, model, table } = this
    form.checkValid()

    const data = this.createDataStudent(form.inputs)

    const isValid = validation(data)
    if (!isValid.ok) {
      const { errors } = isValid
      return form.newError(errors)
    }

    const response = await model.addClient(data)
    if (!response.ok) {
      const { errors } = await response.json()
      return form.newError(errors)
    }

    table.addStudent([await response.json()])
    this.closeModalWindow()
  }

  listenerClick(event) {
    const { doing } = event.target.dataset
    if (doing) {
      this[doing](event)
    }
  }
}

export { Listeners }

