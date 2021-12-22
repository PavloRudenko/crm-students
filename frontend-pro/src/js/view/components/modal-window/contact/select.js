import { Element } from "../../../utility.js";

class Select extends Element {
  constructor(options, type) {
    super()

    this.options = options
    this.createComponent(type)
    this.setup()
  }

  handlerClick({ target }) {
    const { type } = target.dataset
    if (type === 'input') {
      this.select.classList.toggle('open')
    } else if (type === 'item') {
      this.selected(target)
    }
    this.overlay.classList.toggle('overlay')
  }

  selected(target) {
    this.selectedId = target.dataset.id
    this.previousItem.classList.remove('selected')
    this.input.textContent = target.textContent
    target.classList.add('selected')
    this.previousItem = target

    this.close()

    if (this.event) {
      this.event()
    }
  }


  destroy() {
    this.select.removeEventListener('click', this.handlerClick)
    this.overlay.removeEventListener('click', this.handlerClick)
    this.element.remove()
  }

  setup() {
    // this.selected(this.previousItem)
    this.select.addEventListener('click', this.handlerClick.bind(this))
    this.overlay.addEventListener('click', this.handlerClick.bind(this))
  }

  open() {
    this.select.classList.add('open')
  }

  close() {
    this.select.classList.remove('open')
  }

  createComponent(type = 'phone') {

    this.items = this.options.map(item => {
      return this.createElement('div', {
        class: 'select__item',
        'data-type': 'item',
        'data-id': item.type
      }, item.value)
    })

    this.input = this.createElement('div', { class: 'select__input', 'data-type': 'input' })
    this.select = this.createElement('div', { class: 'select' },
      // select children
      this.input,
      this.createElement('div', { class: 'select__dropdown' },
        // select_drop children
        ...this.items
      )
    )
    this.overlay = this.createElement('div', { 'data-type': 'input' })
    this.element = this.createElement('div', { class: 'select__wrapper' }, this.overlay, this.select)

    this.previousItem = this.items[this.options.findIndex(item => item.type === type)]

    this.selected(this.previousItem)
  }
}

export { Select }
