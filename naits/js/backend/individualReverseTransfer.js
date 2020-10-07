import axios from 'axios'
import * as config from 'config/config.js'

export function individualReverseTransfer (session, tableName, objectArray) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.INDIVIDUAL_REVERSE_TRANSFER
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${tableName}/REVERSE`
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
