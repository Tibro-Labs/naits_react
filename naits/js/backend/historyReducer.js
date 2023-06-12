import { menuConfig } from 'config/menuConfig'

function checkConfig (action) {
  const iterateConfig = menuConfig('HISTORY_FOR_MAIN_MENU_TOP') && menuConfig('HISTORY_FOR_MAIN_MENU_TOP').filter(
    element => {
      // black magic since table name is not known from the response
      let table
      // get table name from other keys in response
      if (action && action.payload && Object.keys(action.payload)[0]) {
        table = Object.keys(action.payload)[0].split('.')[0]
      }
      // return true if table is in config (menuConfig)
      if (table === element.TABLE && new RegExp(element.TABLE + '.*/ROW_CLICKED').test(action.type)) {
        return true
      }
    }
  )[0] // access first element since there is only ever one element
  // return the action type if everything is ok
  if (iterateConfig && iterateConfig.TABLE) {
    return action.type
  }
}

export function historyReducer (state = {
  count: 0,
  history: [],
  wasClickedFromRecentTab: false
}, action) {
  switch (action.type) {
    case checkConfig(action): {
      let objectIdKey
      let table
      let combinedArrays = []
      let deduplicatedArray = []
      if (action && action.payload && Object.keys(action.payload)[0]) {
        // get table name from first element in response
        table = Object.keys(action.payload)[0].split('.')[0]
        objectIdKey = `${table}.OBJECT_ID` // example: HOLDING.OBJECT_ID
      }
      if (state && state.history && action && action.payload) {
        // add keys to new object (OBJECTID and TABLE) since response does not contain same keys across all tables,
        // if there are keys which are not present in every object deduplication fails
        const payloadAndIndentifier = { ...action.payload, OBJECTID: action.payload[objectIdKey], TABLE: table }
        // combine previous state and new state
        combinedArrays = [...state.history, ...[payloadAndIndentifier]]
      }
      // drop indentical objects based on object id
      deduplicatedArray = combinedArrays.filter(
        (element, index, currentArray) => {
          return currentArray.findIndex(
            (findElement) => {
              if (findElement && findElement['OBJECTID'] && element && element['OBJECTID']) {
                return findElement['OBJECTID'] === element['OBJECTID']
              }
            }
          ) === index
        }
      )

      return {
        history: deduplicatedArray,
        count: deduplicatedArray.length
      }
    }
    case 'CLEAR_HISTORY_DATA': {
      return { count: 0, history: [] }
    }
    case 'persist/REHYDRATE': {
      let historyReducer
      if (action.payload.historyReducer) {
        historyReducer = action.payload.historyReducer
      } else {
        historyReducer = state
      }
      return { ...historyReducer }
    }
    case 'WAS_CLICKED_FROM_RECENT_TAB':
    case 'THE_KEEPER_HAS_BEEN_REMOVED':
      return { ...state, wasClickedFromRecentTab: true }
    case 'RESET_HISTORY_TAB':
      return { ...state, wasClickedFromRecentTab: false }
  }
  return state
}
