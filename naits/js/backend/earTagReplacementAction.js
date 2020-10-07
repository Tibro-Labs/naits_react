import axios from 'axios'
import * as config from 'config/config.js'

export function replaceEarTag () {
  return function (dispatch) {
    dispatch({ type: 'RESET_EAR_TAG_REPLACEMENT', payload: null })
  }
}

export function earTagReplacementAction (session, objectId, newEarTag, replacementDate, reason, note) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs.EAR_TAG_REPLACEMENT
    const restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${objectId}/${newEarTag}/${replacementDate}/${reason}/${note}`
    axios.get(restUrl)
      .then((response) => {
        dispatch({ type: 'EAR_TAG_REPLACEMENT_FULFILLED', payload: response })
      }).catch((error) => {
        dispatch({ type: 'EAR_TAG_REPLACEMENT_REJECTED', payload: error })
      })
  }
}
