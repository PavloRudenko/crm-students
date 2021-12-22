import { Element } from '../utility.js';

class Button extends Element {
  constructor(children, attributes) {
    super()

    this.element = this.createComponent(children, attributes)
  }

  createComponent(children, attributes) {
    return this.createElement('button', attributes, ...children)
  }
}

export { Button }
