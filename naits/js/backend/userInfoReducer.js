function compareAndSort (a, b) {
  // Use toUpperCase() to ignore character casing
  const idA = a.ID.toUpperCase()
  const idB = b.ID.toUpperCase()

  let comparison = 0
  if (idA > idB) {
    comparison = 1
  } else if (idA < idB) {
    comparison = -1
  }
  return comparison
}

export function userInfoReducer (state = {
  info: undefined,
  userObjId: undefined,
  error: undefined,
  isBusy: false,
  allowedObjects: { LIST_OF_ITEMS: [] },
  isAdmin: null,
  getUsers: '',
  localeObjId: null
}, action) {
  switch (action.type) {
    case String(action.type.match(/^.*_USER_DATA_PENDING/)): {
      return {
        ...state, info: undefined, error: undefined, isBusy: true
      }
    }
    case String(action.type.match(/^GET_BASIC_USER_DATA_FULFILLED|GET_FULL_USER_DATA_FULFILLED/)): {
      // converts comma separated values to json
      const result = Object.assign.apply(
        null,
        action.payload.split(';').map(element => element.split(':').reduce((accumulator, currentValue) => ({ [accumulator]: currentValue })))
      )
      return {
        ...state, ...result, error: undefined, isBusy: false
      }
    }
    case String(action.type.match(/^EDIT_USER_DATA_FULFILLED|SAVE_USER_DATA_FULFILLED|CHANGEPASS_USER_DATA_FULFILLED/)): {
      return {
        ...state, info: action.payload, error: undefined, isBusy: false
      }
    }
    case String(action.type.match(/^ALLOWED_CUSTOM_OBJECTS_USER_DATA_FULFILLED/)): {
      const tables = []
      const labels = []
      const tempObject = { LIST_OF_ITEMS: [] }
      JSON.parse(
        JSON.stringify(action.payload),
        (key, value) => {
          if (typeof (value) !== 'object') {
            if (key === 'TABLE_NAME') {
              tables.push(value)
            }
          }
        }
      )
      JSON.parse(
        JSON.stringify(action.payload),
        (key, value) => {
          if (typeof (value) !== 'object') {
            if (key === 'LABEL_CODE') {
              labels.push(value)
            }
          }
        }
      )
      tables.map((element, index) => {
        tempObject.LIST_OF_ITEMS.push({
          ID: element,
          LABEL: labels[index],
          FLOATHELPER: '',
          ROUTE: element.toLowerCase()
        })
      })

      tempObject.LIST_OF_ITEMS.sort(compareAndSort)

      return {
        ...state, allowedObjects: tempObject, error: undefined, isBusy: false
      }
    }
    case String(action.type.match(/^.*_USER_DATA_REJECTED/)): {
      return { ...state, error: action.payload, isBusy: false }
    }
    case 'IS_USER_ADMIN_FULFILLED': {
      return { ...state, isAdmin: action.payload }
    }
    case 'IS_USER_ADMIN_REJECTED': {
      return { ...state, isAdmin: null }
    }
    case 'GET_USER_GROUPS_FULFILLED': {
      return { ...state, getUsers: action.payload }
    }
    case 'GET_USER_GROUPS_REJECTED': {
      return { ...state, getUsers: null }
    }
    case 'GET_LOCALE_OBJ_ID_FULFILLED': {
      return { ...state, localeObjId: action.payload }
    }
    case 'GET_LOCALE_OBJ_ID_REJECTED': {
      return { ...state, localeObjId: null }
    }
  }
  return state
}
