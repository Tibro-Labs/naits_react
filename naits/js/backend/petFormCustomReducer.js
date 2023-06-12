export function petFormCustomReducer (state = {
  isStrayPet: '',
  createdPetObjId: undefined
}, action) {
  switch (action.type) {
    case 'IS_STRAY_PET_SELECTION':
      return { ...state, isStrayPet: action.payload }
    case 'RESET_IS_STRAY_PET_SELECTION':
      return { ...state, isStrayPet: '' }
    case 'PET_FORM/SAVE_FORM_DATA':
      return { ...state, createdPetObjId: action.payload.object_id, isStrayPet: action.payload.IS_STRAY_PET }
    case 'RESET_PET_FORM_AFTER_SAVE':
      return { ...state, createdPetObjId: undefined, isStrayPet: '' }
    default:
      return state
  }
}
