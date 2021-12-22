import { Element } from "../utility.js"

class Loader extends Element {
  constructor({ parent, child }, teg = 'div') {
    super()

    this.element = this.createComponent(parent, child, teg)
  }

  destroy() {
    this.element.remove()
  }

  createComponent(parent, child, teg) {
    return this.createElement(teg, parent,
      this.createElement(teg, child)
    )
  }
}

export { Loader }
