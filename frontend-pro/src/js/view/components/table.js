import { Element } from "../utility.js";
import { Button } from "./button.js";
import { Loader } from "./loader.js";

class Table extends Element {
  constructor(tHeader = {}, tBody = {}, attributes) {
    super()

    this.tHeader = this.createTHeader(tHeader)
    this.tBody = this.createTBody(tBody)
    this.element = this.createComponent(attributes)
    this.studentsRowList = {}
    this.studentsCellList = {}
    this.loaders = {}
    this.flags = {
      sortById: false,
      sortByFullName: false,
      sortByCreateAt: false,
      sortByUpdateAt: false
    }
  }

  sortStudents(index, flagsName) {
    const { currentTarget } = event
    currentTarget.firstChild.classList.toggle('sort')
    const alphabet = currentTarget.querySelector('.bg__alphabet')
    if (alphabet) {
      alphabet.innerText = alphabet.innerText.split('').reverse().join('')
    }

    this.flags[flagsName] = !this.flags[flagsName]
    if (this.flags[flagsName]) {
      const newSortList = Object.values(this.studentsCellList).sort((a, b) => {
        if (a[index] < b[index]) return -1
        if (a[index] > b[index]) return 1
        return 0
      })
      this.tBody.innerHTML = ''
      return newSortList.forEach(id => {
        this.tBody.append(this.studentsRowList[id[0]])
      })
    }

    const newSortList = Object.values(this.studentsCellList).sort((a, b) => {
      if (a[index] > b[index]) return -1
      if (a[index] < b[index]) return 1
      return 0
    })
    this.tBody.innerHTML = ''
    newSortList.forEach(id => {
      this.tBody.append(this.studentsRowList[id[0]])
    })
  }

  studentsRender(studentList) {
    this.addStudent(studentList)
    if (studentList.length === 0) {
      this.tBody.innerHTML = `<div class="nothing">Никого не найдено</div>`
    }
  }

  createContacts(contacts) {
    return contacts.map(({ type, value }) => {
      const popup = this.createElement('span', { class: 'contact-icon__popup contact-icon__popup_d_none' }, value)
      return this.createElement('span', { 'data-doing': 'handleToggleContactPopup', class: `contact-icon contact-icon_type_${type}` }, popup)
    })
  }

  createButtons(id) {
    this.loaders[id] =  new Loader({ parent: { class: 'btn-change__loader-wrapper' }, child: { class: 'btn-change__loader' } }, 'span')
    return [
      new Button(['Изменить', this.loaders[id].element], { class: 'btn btn-in-table btn-change', 'data-doing': 'hashChange', 'data-id': `${id}` }).element,
      new Button(['Удалить'], { class: 'btn btn-in-table btn-delete', 'data-doing': 'modalDeleteStudentOpen', 'data-id': `${id}` }).element,
      new Button(['Копировать'], { class: 'btn btn-in-table btn-copy', 'data-doing': 'copyHash', 'data-id': `${id}` }).element
    ]
  }

  changeStudent(client) {
    const { id, name, surname, lastName, contacts, updatedAt, createdAt } = client
    const $contacts = this.createContacts(contacts)
    const $buttons = this.createButtons(id)
    this.studentsCellList[id] = [id, `${surname} ${name} ${lastName}`, this.formatDate(createdAt), this.formatDate(updatedAt), $contacts, $buttons]

    const cells = this.studentsCellList[id].map(studentProp => this.createCell(studentProp))
    this.studentsRowList[id].innerHTML = ''
    this.studentsRowList[id].append(...cells)

  }

  addStudent(clients) {
    clients.forEach(client => {
      const { id, name, surname, lastName, contacts, updatedAt, createdAt } = client
      const $contacts = this.createContacts(contacts)
      const $buttons = this.createButtons(id)
      const student = [id, `${surname} ${name} ${lastName}`, this.formatDate(createdAt), this.formatDate(updatedAt), $contacts, $buttons]

      const cells = student.map(studentProp => this.createCell(studentProp))
      const row = this.createElement('tr', { class: 'trow', 'data-id': `${client.id}` }, ...cells)

      this.studentsRowList[id] = row
      this.studentsCellList[id] = student

      this.tBody.append(row)
    })
  }

  deleteAllStudents() {
    this.studentsCellList = {}
    this.studentsRowList = {}
    this.tBody.innerHTML = ''
  }

  deleteStudent(id) {
    this.studentsRowList[id].remove()
    delete this.studentsRowList[id]
    delete this.studentsCellList[id]
  }

  createCell(innerText) {
    const cell = this.createElement('td', { class: 'cell' }, ...innerText)

    return cell
  }

  createComponent(attributes) {
    const table = this.createElement('table', attributes, this.tHeader, this.tBody)

    return table
  }

  createTHeader({ attributes = {}, headCellsList = [] }) {
    const columns = headCellsList.map(cell => {
      const column = this.createElement('th', { class: 'th-cell' },
        this.createElement('span', { class: 'thead__cell' },
          this.createElement('span', { class: `thead__title ${cell.class || ''}` }, cell.title,),
          cell.arrow ? this.createElement('span', { class: 'bg__arrow' }) : '',
          cell.alphabet ? this.createElement('span', { class: 'bg__alphabet' }, 'Я-A') : '')
      )
      column.addEventListener('click', this.sortStudents.bind(this, cell.index, cell.doing))

      return column
    })
    const row = this.createElement('tr', undefined, ...columns)

    return this.createElement('thead', attributes, row)
  }

  createTBody({ attributes = {} }) {
    return this.createElement('tbody', attributes)
  }

  formatDate(date) {
    return new Date(date).
      toLocaleString().
      split(',').
      join(' ').
      slice(0, -3)
  }
}

export { Table }



