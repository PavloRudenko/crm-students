const API_LINK = 'http://localhost:3000/api/clients'

class Model {

  async patchClient (id, client) {
    return await fetch(API_LINK + `/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(client)
    })
  }

  async addClient(client) {
    return await fetch(API_LINK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(client)
    })
  }

  deleteClient(id) {
    fetch(API_LINK + `/${id}`, { method: 'DELETE' })
  }

  async getClient(id) {
    const response = await fetch(API_LINK + `/${id}`)

    return await response.json()
  }

  async getClientsList() {
    const response = await fetch(API_LINK)

    return await response.json()
  }
}

export { Model }
