import axios from 'axios'
import { formatAlertType, strcmp } from 'functions/utils'
import * as config from 'config/config.js'

export function resetAnimal () {
  return function (dispatch) {
    dispatch({ type: 'RESET_GENERATE_ANIMALS', payload: null })
  }
}

export function generateAnimalsAction (session, objectId, startEarTagId, endEarTagId,
  animalClass, animalBreed, animalGender, birthDate) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.GENERATE_ANIMALS
    const params = `${startEarTagId}/${endEarTagId}/${animalClass}/${animalBreed}/${animalGender}/${birthDate}`
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${objectId}/${params}`
    axios.get(restUrl).then((response) => {
      const resType = formatAlertType(response.data)
      if (strcmp(resType, 'success')) {
        dispatch({ type: 'GENERATE_ANIMALS_FULFILLED', payload: response })
      } else {
        dispatch({ type: 'GENERATE_ANIMALS_REJECTED', payload: response })
      }
    }).catch((error) => {
      dispatch({ type: 'GENERATE_ANIMALS_REJECTED', payload: error })
    })
  }
}
