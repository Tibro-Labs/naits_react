import axios from 'axios'
import * as config from 'config/config.js'

export function resetValidation () {
  return function (dispatch) {
    dispatch({ type: 'RESET_VALIDATION', payload: null })
  }
}

export function validateAnimalId (session, animalObjId, animalTagId, animalClass, holdingId) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.VALIDATE_ANIMAL_ID
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${animalObjId}/${animalTagId}/${animalClass}/${holdingId}`
    axios.get(restUrl)
      .then((response) => {
        dispatch({ type: 'VALIDATE_ANIMAL_ID_FULFILLED', payload: response })
      }).catch((err) => {
        dispatch({ type: 'VALIDATE_ANIMAL_ID_REJECTED', payload: err })
      })
  }
}

export function validateRange (session, tableName, parentId, tagType, rangeFrom, rangeTo) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.VALIDATE_RANGE
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${tableName}/${parentId}/${tagType}/${rangeFrom}/${rangeTo}`
    axios.get(restUrl)
      .then((response) => {
        dispatch({ type: 'VALIDATE_RANGE_FULFILLED', payload: response })
      }).catch((err) => {
        dispatch({ type: 'VALIDATE_RANGE_REJECTED', payload: err })
      })
  }
}
