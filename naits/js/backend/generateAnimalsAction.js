import axios from 'axios'
import * as config from 'config/config.js'

export function resetAnimal () {
  return function (dispatch) {
    dispatch({ type: 'RESET_GENERATE_ANIMALS', payload: null })
  }
}

export function generateAnimalsAction (session, objectId, startEarTagId, endEarTagId,
  animalClass) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.GENERATE_ANIMALS
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${objectId}/${startEarTagId}/${endEarTagId}/${animalClass}`
    axios.get(restUrl)
      .then((response) => {
        dispatch({ type: 'GENERATE_ANIMALS_FULFILLED', payload: response })
      }).catch((error) => {
        dispatch({ type: 'GENERATE_ANIMALS_REJECTED', payload: error })
      })
  }
}
