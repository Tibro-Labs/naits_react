export function petAdoptionReducer (state = {
  newPetObjId: null,
  responseMessage: null,
  strayPetHasBeenAdopted: false
}, action) {
  switch (action.type) {
    case 'PET_ADOPTION_FULFILLED':
      return {
        ...state, newPetObjId: action.payload[1], responseMessage: action.payload, strayPetHasBeenAdopted: true
      }
    case 'PET_ADOPTION_REJECTED':
      return {
        ...state, newPetObjId: null, responseMessage: action.payload, strayPetHasBeenAdopted: false
      }
    default:
      return state
  }
}
