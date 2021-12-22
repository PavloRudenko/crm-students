import { Input } from "./input.js"
const TIMER = 500

class SearchInput extends Input {
  constructor(params, callback) {
    super(params)

    this.setup(callback)
  }

  setup(callback) {
    let timerID
    this.input.addEventListener('keyup', () => {
      clearTimeout(timerID);
        timerID = setTimeout(() => {
          this.value = this.input.value
          callback()
        }, TIMER);
    })
  }
}

export { SearchInput }
