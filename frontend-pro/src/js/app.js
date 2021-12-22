import { Button } from './view/components/button.js'
import { Element } from './view/utility.js'
import { Listeners } from './listeners.js'
import { Loader } from './view/components/loader.js'

class App {
  constructor(selector) {
    this.app = document.querySelector(selector)
    this.container = new Element().createElement('div', { class: 'container' })
    this.mainTitle = new Element().createElement('h1', { class: 'title' }, 'Клиенты')
    this.addButton = new Button(['Добавить клиента'], {
      class: 'btn button-add btn-secondary',
      'data-doing': 'addModalWindow',
    })

    this.listeners = new Listeners()
    this.loader = new Loader({ parent: { class: 'loader-wrapper' }, child: { class: 'loader' } })
  }

  render() {
    this.container.append(
      this.mainTitle,
      this.listeners.table.toWrapp({ class: 'wrapper' }),
      this.addButton.element
    )

    this.addButton.element.before(this.loader.element)

    this.listeners.model.getClientsList().then((data) => {
      this.loader.destroy()
      this.listeners.table.addStudent(data)
    })

    this.app.append(
      this.listeners.header.element,
      this.container
    )

    this.setup()
  }

  setup() {
    document.addEventListener('click', this.listeners.listenerClick.bind(this.listeners))
    document.addEventListener('input', this.listeners.listenerClick.bind(this.listeners))
    window.addEventListener('hashchange', this.listeners.changeForm.bind(this.listeners))
  }

  destroy() {
    document.removeEventListener('click', this.listeners.listenerClick)
    document.removeEventListener('input', this.listeners.listenerClick)
    this.container.remove()
  }
}

export { App }
