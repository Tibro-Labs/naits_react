export function admConsoleReducer (state = {
  data: null,
  message: null,
  error: null,
  isBusy: false,
  isLoadingOrgUnits: false,
  userGroups: null,
  userOrgUnits: null,
  groupPermissions: null,
  userActionsResult: null,
  laboratory: null,
  filterId: null
}, action) {
  switch (action.type) {
    case 'ATTACH_PERMISSION_PENDING':
    case 'ASSIGN_PACKAGE_PENDING':
    case 'ADD_GROUP_PENDING':
    case 'ADD_ORG_UNIT_PENDING':
    case 'ADD_LABORATORY_PENDING':
    case 'REMOVE_GROUP_PENDING':
    case 'REMOVE_LABORATORY_PENDING':
    case 'FETCH_USER_GROUPS_PENDING':
    case 'FETCH_ORG_UNITS_PENDING':
    case 'FETCH_LABORATORY_PENDING':
    case 'FETCH_CRITERIA_TYPE_PENDING':
    case 'FETCH_PERMISSIONS_PENDING':
    case 'RESET_PASS_PENDING':
    case 'REMOVE_USERS_FROM_GROUP_PENDING':
    case 'CHANGE_STATUS_PENDING':
    case 'LINK_HOLDING_AND_USER_PENDING':
    case 'UNLINK_HOLDING_AND_USER_PENDING':
    case 'ATTACH_NOTIFICATION_PENDING': {
      return { ...state, isBusy: true }
    }
    case 'ATTACH_PERMISSION_FULFILLED':
    case 'ASSIGN_PACKAGE_FULFILLED':
    case 'ADD_GROUP_FULFILLED':
    case 'REMOVE_LABORATORY_FULFILLED':
    case 'ADD_LABORATORY_FULFILLED':
    case 'ADD_ORG_UNIT_FULFILLED':
    case 'REMOVE_GROUP_FULFILLED':
    case 'RESET_PASS_FULFILLED':
    case 'CHANGE_STATUS_FULFILLED':
    case 'FETCH_CRITERIA_TYPE_FULFILLED':
    case 'LINK_HOLDING_AND_USER_FULFILLED':
    case 'UNLINK_HOLDING_AND_USER_FULFILLED':
    case 'ATTACH_NOTIFICATION_FULFILLED': {
      return { ...state, data: action.payload.data, error: null, isBusy: false, filterId: action.payload.data }
    }
    case 'ATTACH_PERMISSION_REJECTED':
    case 'ASSIGN_PACKAGE_REJECTED':
    case 'ADD_GROUP_REJECTED':
    case 'REMOVE_LABORATORY_REJECTED':
    case 'ADD_LABORATORY_REJECTED':
    case 'REMOVE_GROUP_REJECTED':
    case 'RESET_PASS_REJECTED':
    case 'CHANGE_STATUS_REJECTED':
    case 'FETCH_CRITERIA_TYPE_REJECTED':
    case 'LINK_HOLDING_AND_USER_REJECTED':
    case 'UNLINK_HOLDING_AND_USER_REJECTED':
    case 'ATTACH_NOTIFICATION_REJECTED': {
      return { ...state, data: null, error: action.payload.data, isBusy: false, filterId: null }
    }
    case 'RESET_CONSOLE_REDUCER_STATE': {
      return { ...state, data: null, error: null, isBusy: false }
    }
    case 'FETCH_USER_GROUPS_FULFILLED': {
      return { ...state, userGroups: action.payload.data, isBusy: false }
    }
    case 'FETCH_USER_GROUPS_REJECTED': {
      return { ...state, userGroups: null, error: action.payload.data, isBusy: false }
    }
    case 'FETCH_LABORATORY_FULFILLED': {
      return { ...state, laboratory: action.payload.data, isBusy: false }
    }
    case 'FETCH_LABORATORY_REJECTED': {
      return { ...state, laboratory: null, error: action.payload.data, isBusy: false }
    }
    case 'FETCH_ORG_UNITS_FULFILLED': {
      return { ...state, userOrgUnits: action.payload.data, isBusy: false }
    }
    case 'FETCH_ORG_UNITS_REJECTED': {
      return { ...state, userOrgUnits: null, error: action.payload.data, isBusy: false }
    }
    case 'FETCH_PERMISSIONS_FULFILLED': {
      return { ...state, groupPermissions: action.payload.data, isBusy: false }
    }
    case 'FETCH_PERMISSIONS_REJECTED': {
      return { ...state, groupPermissions: null, error: action.payload.data, isBusy: false }
    }
    case 'RESET_MASS_USER_ACTION': {
      return { ...state, userActionsResult: null }
    }
    case 'MASS_USER_ACTION_FULFILLED':
    case 'MASS_USER_ACTION_ITEM_REJECTED': {
      return { ...state, userActionsResult: action.payload.data }
    }
    case 'REMOVE_ORG_UNIT_PENDING':
      return { ...state, isBusy: true, isLoadingOrgUnits: true }
    case 'REMOVE_ORG_UNIT_FULFILLED':
      return {
        ...state,
        data: action.payload.data,
        error: null,
        isBusy: false,
        isLoadingOrgUnits: false,
        filterId: action.payload.data
      }
    case 'REMOVE_ORG_UNIT_REJECTED': {
      return {
        ...state,
        data: null,
        error: action.payload.data,
        isBusy: false,
        isLoadingOrgUnits: false,
        filterId: null
      }
    }
    default: return state
  }
}
