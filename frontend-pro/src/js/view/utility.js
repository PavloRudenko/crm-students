  class Element {
    createElement(teg = 'div', attributes = {}, ...children) {
      const element = document.createElement(teg)

      Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]))

      children.forEach(child => element.append(child))

      return element
    }

    addSvg(html, attributes = {}) {
      const svg = this.createElement('span', attributes)
      svg.innerHTML = html
      this.element.append(svg)

      return this
    }

    toWrapp(attributes) {
      return this.createElement('div', attributes, this.element)
    }
  }

export { Element }
