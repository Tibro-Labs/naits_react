import axios from 'axios'
import * as config from 'config/config.js'

export function resetObject () {
  return function (dispatch) {
    dispatch({ type: 'RESET_EXPORT_CERTIFIED_ANIMALS', payload: null })
  }
}

export function exportCertifiedAnimals (session, objectArray, objectId) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.EXPORT_CERTIFIED_ANIMALS
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${objectId}`
    axios({
      method: 'post',
      url: restUrl,
      data: JSON.stringify({objectArray}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then((response) => {
        dispatch({ type: 'EXPORT_CERTIFIED_ANIMALS_FULFILLED', payload: response })
      }).catch((error) => {
        dispatch({ type: 'EXPORT_CERTIFIED_ANIMALS_REJECTED', payload: error })
      })
  }
}
