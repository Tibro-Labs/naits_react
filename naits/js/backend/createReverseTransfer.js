import axios from 'axios'
import * as config from 'config/config.js'

export function createReverseTransfer (session, rangeFrom, rangeTo, objectArray) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.CREATE_REVERSE_TRANSFER
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${rangeFrom}/${rangeTo}`
    axios({
      method: 'post',
      url: restUrl,
      data: JSON.stringify({ objectArray }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then((response) => {
        dispatch({ type: 'EXECUTE_ACTION_ON_ROWS', payload: response.data })
      }).catch((error) => {
        dispatch({ type: 'EXECUTE_ACTION_ON_ROWS', payload: error })
      })
  }
}
