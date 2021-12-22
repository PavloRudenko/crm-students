import { Element } from "../utility.js";

class Input extends Element {
  constructor({ attrInput, attrLabel }, text = '') {
    super()

    this.element = this.createComponent(attrInput, attrLabel, text)
  }

  createComponent(attrInput, attrLabel, text) {
    this.input = this.createElement('input', attrInput)
    const title = text ? this.createElement('span', {class: 'label-title'}, text) : ''
    return this.createElement('label', attrLabel, title, this.input)
  }
}

export { Input }
