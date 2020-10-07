export function notificationReducer (state = {
  count: undefined,
  messages: undefined
}, action) {
  switch (action.type) {
    case 'NOTIFICATION_DATA_PENDING': {
      return {
        ...state, count: undefined, messages: undefined
      }
    }
    case 'NOTIFICATION_DATA_FULFILLED': {
      let count
      const messages = []
      if (Object.keys(action.payload)[0] && action.payload[Object.keys(action.payload)[0]].items) {
        // set notification count
        count = action.payload[Object.keys(action.payload)[0]].items.length
        // black magic iteration svarog dbdata array
        // basically just get notification messages values
        Object.keys(action.payload[Object.keys(action.payload)[0]].items).forEach(
          (e, i) => {
            messages.push(
              action.payload[Object.keys(action.payload)[0]]
                .items[i][Object.keys(action.payload[Object.keys(action.payload)[0]].items[0])[0]]
                .values
            )
          }
        )
      }
      return {
        ...state, count, messages
      }
    }
    case 'NOTIFICATION_DATA_REJECTED': {
      return {
        ...state, error: action.payload
      }
    }
  }
  return state
}
