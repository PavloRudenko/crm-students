const API_LINK = 'http://localhost:3000/api/clients'

class Model {

  async patchClient(id, client) {
    return await fetch(API_LINK + `/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.formatFullName(client))
    })
  }

  async addClient(client) {
    return await fetch(API_LINK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.formatFullName(client))
    })
  }

  deleteClient(id) {
    fetch(API_LINK + `/${id}`, { method: 'DELETE' })
  }

  async getClient(id) {
    const response = await fetch(API_LINK + `/${id}`)
    const client = await response.json()
    return this.formatFullName(this.formatDate(client))
  }

  async getClientsList() {
    const response = await fetch(API_LINK)
    const clientList = await response.json()
    return clientList.map(client => this.formatFullName(this.formatDate(client)))
  }

  toUpperFirstLetter(word) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase()
  }

  formatFullName(data) {
    return {
      ...data,
      name: this.toUpperFirstLetter(data.name).trim(),
      surname: this.toUpperFirstLetter(data.surname).trim(),
      lastName: data.lastName ? this.toUpperFirstLetter(data.lastName).trim() : ''
    }
  }

  formatDate(data) {
    const format = (date) => new Date(date).
      toLocaleString().
      split(',').
      join('').
      slice(0, -3)

    const { createdAt, updatedAt } = data

    return {
      ...data,
      createdAt: format(createdAt),
      updatedAt: format(updatedAt),
    }
  }
}

export { Model }
