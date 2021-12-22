import { SearchInput } from "./searchInput.js"
import { Element } from "../utility.js"

class Header extends Element {
  constructor(logo = {}, input = {}, callback, attributes) {
    super()

    this.logo = this.createLogo(logo)
    this.searchInput = new SearchInput(input, callback)
    this.element = this.createComponent(attributes, this.logo, this.searchInput.element)
  }

  createLogo({ title = '', attributes }) {
    return this.createElement('div', attributes,
      this.createElement('a', { href: '#', class: 'logo__link' }, title))
  }

  createComponent(attributes, ...children) {
    return this.createElement('header', attributes, ...children)
  }
}

export { Header }
