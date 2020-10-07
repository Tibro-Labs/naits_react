import axios from 'axios'
import * as config from 'config/config.js'

export function resetObject () {
  return function (dispatch) {
    dispatch({ type: 'RESET_CHANGE_STATUS', payload: null })
  }
}

export function changeStatus (session, status, objectId, tableName, objectArray) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.CHANGE_STATUS
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${status}`
    axios({
      method: 'post',
      url: restUrl,
      data: objectArray !== null ? JSON.stringify({objectArray}) : JSON.stringify({'objectId': objectId, 'tableName': tableName}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then((response) => {
        dispatch({ type: 'CHANGE_STATUS_FULFILLED', payload: response })
      }).catch((error) => {
        dispatch({ type: 'CHANGE_STATUS_REJECTED', payload: error })
      })
  }
}

export function updateStatus (session, tableName, status, objectArray) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.UPDATE_STATUS
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${tableName}/${status}`
    axios({
      method: 'post',
      url: restUrl,
      data: JSON.stringify({objectArray}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then((response) => {
        dispatch({ type: 'CHANGE_STATUS_FULFILLED', payload: response })
      }).catch((error) => {
        dispatch({ type: 'CHANGE_STATUS_REJECTED', payload: error })
      })
  }
}
