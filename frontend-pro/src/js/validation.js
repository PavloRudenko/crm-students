const translate = {
  name: () => 'Имя',
  surname: () => 'Фамилия',
  phone: () => 'Телефон',
  facebook: () => 'Facebook',
  vk: () => 'VK',
  other: () => 'Другое',
}

export function validation(data) {
  const isValid = {
    ok: true,
  }

  isValid.errors = Object.keys(data)
    .filter(key => {
      return (data[key] === '' && (key === 'surname' || key === 'name')) || key === 'contacts' && data[key].length !== 0
    }).map(key => {
      if (typeof data[key] === 'string') {
        isValid.ok = false
        return {
          field: key,
          message: `Поле ${translate[key]()} обязательно для заполнения`
        }
      }

      return data[key].filter(contact => {
        return contact.value === ''
      }).map(contact => {
        isValid.ok = false
        return {
          field: contact.type,
          message: `Поле ${translate[contact.type]()} обязательно для заполнения`
        }
      })
    })

  return isValid
}

