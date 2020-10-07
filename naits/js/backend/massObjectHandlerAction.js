import axios from 'axios'
import * as config from 'config/config.js'

export function massObjectHandlerAction (session, actionType, actionName, objectArray, paramsArray) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.MASS_OBJECT_HANDLER
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}`
    axios({
      method: 'post',
      url: url,
      data: JSON.stringify({ objectArray, paramsArray })
    }).then((response) => {
      dispatch({ type: actionType, payload: response.data, executedActionType: actionName })
    }).catch((error) => {
      console.log(error)
    })
  }
}
