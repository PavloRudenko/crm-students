import { Input } from "./input.js"
const TIMER = 500

class SearchInput extends Input {
  constructor(params, callback) {
    super(params)

    this.setup(callback)
    this.callback = callback
  }

  createDropdown() {
    this.overlay = this.createElement('div', { class: 'DD-overlay' })
    this.dropdown = this.createElement('div', { class: 'search-input__drop-down' })
    this.element.append(this.overlay, this.dropdown)

    this.overlay.addEventListener('click', this.handleCloseDD.bind(this))
  }

  handleCloseDD() {
    this.element.classList.remove('open')
  }

  destroyDropdown() {
    this.overlay.removeEventListener('click', this.handleCloseDD)
    this.dropdown.remove()
    delete this.dropdown
  }

  handleClickDDItem({ target }) {
    this.input.value = target.innerText
    this.element.classList.remove('open')
    this.callback(true)
  }

  destroyAutoItem() {
    this.dropdown.childNodes.forEach(child => {
      child.removeEventListener('click', this.handleClickDDItem)
    })
    this.dropdown.innerHTML = ''
  }

  createAutoItem(item, value) {
    const client = {
      id: item.id,
      fullName: `${item.surname} ${item.name} ${item.lastName}`.trim(),
      createdAt: item.createdAt,
      updatedAT: item.updatedAt
    }

    const title = Object.values(client).find(prop => prop.toLowerCase().includes(value.toLowerCase()))
    const dropdownItem = this.createElement('div', { class: 'autocomplete__item' }, title)
    this.dropdown.append(dropdownItem)

    dropdownItem.addEventListener('click', this.handleClickDDItem.bind(this))
  }

  findAuto(data, value) {
    return data.filter(client => {
      client = {
        id: client.id,
        fullName: `${client.surname} ${client.name} ${client.lastName}`.trim(),
        createdAt: client.createdAt,
        updatedAT: client.updatedAt,
        contacts: client.contacts
      }
      return Object.values(client).find(prop => {
        if (typeof prop === 'string') {
          return prop.toLowerCase().includes(value.toLowerCase())
        }
      })
    })
  }

  setup(callback) {
    this.createDropdown()
    let timerID
    this.input.addEventListener('keyup', () => {
      clearTimeout(timerID);
      timerID = setTimeout(() => {
        callback()
      }, TIMER);
    })
  }
}

export { SearchInput }
