import axios from 'axios'
import * as config from 'config/config.js'

export function massAnimalOrFlockAction (session, actionType, actionName, objectArray, paramsArray) {
  return function (dispatch) {
    dispatch({ type: `${actionType}_PENDING` })
    const verbPath = config.svConfig.triglavRestVerbs.MASS_ANIMAL_OR_FLOCK_ACTION
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
