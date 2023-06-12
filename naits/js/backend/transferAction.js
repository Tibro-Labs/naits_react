import axios from 'axios'
import * as config from 'config/config.js'

export function resetTransferAnimal () {
  return function (dispatch) {
    dispatch({ type: 'RESET_TRANSFER_ANIMAL', payload: null })
  }
}

export function transferAnimalOrFlock (session, paramsArray) {
  return function (dispatch) {
    const actionType = 'TRANSFER_ANIMAL'
    dispatch({ type: `${actionType}_PENDING` })
    const verbPath = config.svConfig.triglavRestVerbs.TRANSFER_ANIMAL
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}`
    axios({
      method: 'post',
      url: url,
      data: JSON.stringify({ paramsArray })
    }).then((response) => {
      dispatch({ type: `${actionType}_FULFILLED`, payload: response })
    }).catch((error) => {
      dispatch({ type: `${actionType}_REJECTED`, payload: error })
    })
  }
}

export function transferAnimal (session, animalId, animalClass, holdingId, admissionDate,
  transporterId, totalUnits, maleUnits, femaleUnits, adultsUnits) {
  return function (dispatch) {
    dispatch({ type: 'TRANSFER_ANIMAL_PENDING' })
    const verbPath = config.svConfig.triglavRestVerbs.TRANSFER_ANIMAL
    let restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${animalId}/${holdingId}/${admissionDate}/${transporterId}`
    if (totalUnits || maleUnits || femaleUnits || adultsUnits) {
      restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${animalId}/${animalClass}/${holdingId}/${admissionDate}/${transporterId}/${totalUnits}/${maleUnits}/${femaleUnits}/${adultsUnits}`
    }
    axios.get(restUrl)
      .then((response) => {
        dispatch({ type: 'TRANSFER_ANIMAL_FULFILLED', payload: response })
      }).catch((error) => {
        dispatch({ type: 'TRANSFER_ANIMAL_REJECTED', payload: error })
      })
  }
}
