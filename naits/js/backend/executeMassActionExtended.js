import axios from 'axios'
import * as config from 'config/config.js'

export function executeMassActionExtended (verb, session, gridType, actionType,
  actionName, subActionName, objectArray, actionParam, dateOfMovement,
  dateOfAdmittance, transporterPerson, transportType, transporterLicense,
  estimateDayOfArrival, estimateDayOfDeparture, disinfectionDate, animalMvmReason,
  totalUnits, maleUnits, femaleUnits, adultsUnits) {
  return function (dispatch) {
    const verbPath = config.svConfig.triglavRestVerbs[verb]
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${gridType}/${actionName}/${subActionName}/${actionParam}/${dateOfMovement}/${dateOfAdmittance}/${transporterPerson}/${transportType}/${transporterLicense}/${estimateDayOfArrival}/${estimateDayOfDeparture}/${disinfectionDate}/${animalMvmReason}/${totalUnits}/${maleUnits}/${femaleUnits}/${adultsUnits}`
    axios({
      method: 'post',
      url: url,
      data: JSON.stringify({objectArray})
    }).then((response) => {
      dispatch({type: actionType, payload: response.data, executedActionType: subActionName || actionName})
    }).catch((error) => {
      console.log(error)
    })
  }
}
