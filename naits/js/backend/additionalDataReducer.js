export function additionalDataReducer (state = {
  populationHasBeenUpdated: false,
  HOLDING_KEEPER: null,
  HOLDING_VILLAGE: null,
  HOLDING: {},
  ANIMAL: {},
  SVAROG_USERS: {},
  SVAROG_USER_GROUPS: {},
  SVAROG_ORG_UNITS: {}
}, action) {
  switch (action.type) {
    case 'GET_KEEPER_FULFILLED': {
      return {
        ...state,
        HOLDING_KEEPER: action.payload.data
      }
    }
    case 'GET_KEEPER_REJECTED': {
      return {
        ...state,
        HOLDING_KEEPER: null
      }
    }
    case 'GET_VILLAGE_FULFILLED': {
      return {
        ...state,
        HOLDING_VILLAGE: action.payload
      }
    }
    case 'GET_VILLAGE_REJECTED': {
      return {
        ...state,
        HOLDING_VILLAGE: null
      }
    }
    case 'GET_OBJECT_SUMMARY_FULFILLED': {
      return {
        ...state,
        [action.object]: action.payload.data
      }
    }
    case 'GET_OBJECT_SUMMARY_REJECTED': {
      return {
        ...state,
        [action.object]: null
      }
    }
    case 'POPULATION_FORM_HAS_BEEN_UPDATED':
      return {
        ...state, populationHasBeenUpdated: true
      }
    case 'RESET_STATE_AFTER_POPULATION_FORM_UPDATE':
      return {
        ...state, populationHasBeenUpdated: false
      }
    default: {
      return state
    }
  }
}
