import axios from 'axios'
import * as config from 'config/config.js'

export function resetHolding () {
  return function (dispatch) {
    dispatch({ type: 'RESET_CHANGE_STATUS_OF_HOLDING', payload: null })
  }
}

export function changeStatusOfHoldingAction (session, holdingObjId, newStatus) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.CHANGE_STATUS_OF_HOLDING
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${holdingObjId}/${newStatus}`
    axios.get(restUrl)
      .then((response) => {
        dispatch({ type: 'CHANGE_STATUS_OF_HOLDING_FULFILLED', payload: response })
      }).catch((error) => {
        dispatch({ type: 'CHANGE_STATUS_OF_HOLDING_REJECTED', payload: error })
      })
  }
}
