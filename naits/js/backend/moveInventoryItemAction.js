import axios from 'axios'
import * as config from 'config/config.js'

export function resetObject () {
  return function (dispatch) {
    dispatch({ type: 'RESET_MOVE_INVENTORY_ITEM', payload: null })
  }
}

export function moveInventoryItem (session, objectArray) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.MOVE_INVENTORY_ITEM
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}`
    axios({
      method: 'post',
      url: restUrl,
      data: JSON.stringify({objectArray}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then((response) => {
        dispatch({ type: 'MOVE_INVENTORY_ITEM_FULFILLED', payload: response })
      }).catch((error) => {
        dispatch({ type: 'MOVE_INVENTORY_ITEM_REJECTED', payload: error })
      })
  }
}
