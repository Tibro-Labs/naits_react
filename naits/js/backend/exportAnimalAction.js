import axios from 'axios'
import * as config from 'config/config.js'

export function resetAnimal () {
  return function (dispatch) {
    dispatch({ type: 'RESET_ANIMAL', payload: null })
  }
}

export function exportAnimal (session, actionName, actionParam, objectArray) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.EXPORT_ANIMAL
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${actionName}/${actionParam}`
    axios({
      method: 'post',
      url: restUrl,
      data: JSON.stringify({objectArray}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then((response) => {
        dispatch({ type: 'EXPORT_ANIMAL_FULFILLED', payload: response })
      }).catch((error) => {
        dispatch({ type: 'EXPORT_ANIMAL_REJECTED', payload: error })
      })
  }
}
