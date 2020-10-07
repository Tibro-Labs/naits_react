import { store, updateSelectedRows, lastSelectedItem, saveFormData } from 'tibro-redux'
import ReactGA from 'react-ga'
import { writeComponentToStoreAction } from 'backend/writeComponentToStoreAction'
import { ComponentManager } from 'components/ComponentsIndex'

export function goBack () {
  window.history.back()
}

export function strcmp (string1, string2) {
  /** Compares two strings by using upper case conversion */
  return (
    typeof string1 === 'string' &&
    typeof string2 === 'string' &&
    string1.toUpperCase() === string2.toUpperCase()
  )
}

export function isValidArray (array, minNumberOfElements) {
  /** returns true if the variable passsed as the first parameter is an array and
  there are at least X number of elements in the array, where X is the second function parameter */
  return (array && array.constructor === Array && array.length >= minNumberOfElements)
}

export function isValidObject (object, minNumberOfKeys) {
  /** returns true if the variable passsed as the first parameter is an object and
    there are at least X number of keys in the object, where X is the second function parameter */
  return (object && object.constructor === Object && Object.keys(object).length >= minNumberOfKeys)
}

export function onGridSelectionChange (selectedRows, gridId) {
  /* Update selected rows in store on selection change from grid */
  store.dispatch(updateSelectedRows(selectedRows, gridId))
}

export function handleRowSelectionChange (selectedRows, gridId, gridType, position) {
  /* Custom row exclusion method for certain grids
  Allows only one row to be seleced at a time */
  if (position) {
    let coreId = gridId.slice(0, -1)
    ComponentManager.setStateForComponent(`${coreId}1`, 'selectedIndexes', [])
    ComponentManager.setStateForComponent(`${coreId}2`, 'selectedIndexes', [])
    store.dispatch(updateSelectedRows([], null))
  }
  const validRows = []
  validRows.push(selectedRows[selectedRows.length - 1])
  const key = gridType + '.OBJECT_ID'
  const gridRows = store.getState()[gridId].rows
  if (validRows[0]) {
    for (let i = 0; i < gridRows.length; i++) {
      if (gridRows[i][key] === validRows[0][key]) {
        ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [i])
        break
      }
    }
    store.dispatch(updateSelectedRows(validRows, gridId))
  } else {
    ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [])
    store.dispatch(updateSelectedRows([], null))
  }
}

export function selectObject (gridId, row) {
  /* Set selected item when a grid row is clicked.
  Clear displayed components for previous parent from store */
  store.dispatch(writeComponentToStoreAction(null))
  store.dispatch(lastSelectedItem(gridId, row))
}

export function convertToShortDate (date, format) {
  /* Function that converts a javascript Date Object to a short object format
  The date object and the format are provided as parameters.
  -example short date format 'y-m-d' will be replaced with XXXX-XX-XX
  -example short date format y/m/d will be replaced with XXXX/XX/XX */
  try {
    let shortDate = format
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    if (month < 10) month = '0' + month
    if (day < 10) day = '0' + day
    shortDate = shortDate.replace('y', year)
    shortDate = shortDate.replace('m', month)
    shortDate = shortDate.replace('d', day)
    return shortDate
  } catch (error) {
    console.log(date + ' is not a valid date object, exiting...')
    return null
  }
}

export function formatAlertType (message) {
  /* Formats the alert type depending on web service response label */
  switch (true) {
    case message.indexOf('naits.success') > -1: {
      return 'success'
    }
    case message.indexOf('naits.error') > -1: {
      return 'error'
    }
    case message.indexOf('naits.warning') > -1: {
      return 'warning'
    }
    case message.indexOf('naits.info') > -1: {
      return 'info'
    }
    default: {
      return 'info'
    }
  }
}

export function customDelete (id, verb) {
  /* Custom delete for react-josonschema-forms */
  const session = store.getState().security.svSession
  const formState = ComponentManager.getStateForComponent(id)

  const params = []
  const currentRecord = formState.formTableData

  params.push({
    PARAM_NAME: 'session',
    PARAM_VALUE: session
  }, {
    PARAM_NAME: 'objectId',
    PARAM_VALUE: currentRecord.OBJECT_ID
  }, {
    PARAM_NAME: 'objectType',
    PARAM_VALUE: currentRecord.OBJECT_TYPE
  }, {
    PARAM_NAME: 'objectPkId',
    PARAM_VALUE: currentRecord.PKID
  }, {
    PARAM_NAME: 'jsonString',
    PARAM_VALUE: JSON.stringify(currentRecord)
  })

  saveFormData(id, verb, session, params)

  ComponentManager.setStateForComponent(id, 'deleteExecuted', true)
}

// Theese two functions (prevReduxValueIfError and errTolastError) are needed
// if you want to transform errors to a specific key
// if not used errors will be returned to the redux key that makes the request.
// They also store the previous redux value in a global window variable with the name
// of the action type as to prevent overwriting when a parallell dispatch is made
export function prevReduxValueIfError (state, action) {
  // replace action type name from / to _ so it can be declared as a global var
  const actionTypeName = action.type.replace('/', '_')
  // get previous key redux name
  const prevReduxKeyName = Object.keys(action.payload)[1]
  // get previous key value (state[prevReduxKeyName]), and set it to a global window variable
  // with a dynamic name (the name of the action type) as to prevent var clash
  window[actionTypeName] = state[prevReduxKeyName]
  // return normal (merge) values without transformation
  return Object.assign({}, state, action.payload)
}

export function errTolastError (state, action) {
  // replace action type name from / to _ so it can get the name of the global var
  const actionTypeName = action.type.replace('/', '_').split('_ERROR')[0]
  // get current redux key so it can be called
  const currentReduxKey = Object.keys(action.payload)[0]
  // call error and store to let
  const currentError = action.payload[currentReduxKey].message + ' for ' + currentReduxKey
  // return transformed data and set it to lastError, restore previous value if error
  return { ...state, lastError: currentError, [currentReduxKey]: window[actionTypeName] }
}

export function $ (id) {
  // shorthand function
  return document.getElementById(id)
}

/**
 * A helper function for swapping (changing the indexes of) items in an array
 * @param  {Array} array The array that will be mutated
 * @param  {Number} indexA The item that will change its position
 * @param  {Number} indexB The new position of the aforementioned item
 */
export function swapItems (array, indexA, indexB) {
  let tmp = array[indexA]
  array[indexA] = array[indexB]
  array[indexB] = tmp
}

/**
 * A helper function for capitalizing the first letter of a string
 * @param  {String} string The string whose first letter we want to capitalize
 */
export function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * A helper function for inserting a single space after a character
 * @param  {String} string The string in which we want to insert a space
 * @param  {String} char The character after which the space should be inserted
 */
export function insertSpaceAfterAChar (string, char) {
  return string.split(char).join(`${char} `)
}

/**
 * A function that calculates the difference between two numbers
 * @param {Number} number1 The first number
 * @param {Number} number2 The second number
 */
export function calcDifference (number1, number2) {
  return Math.abs(number1 - number2)
}

/**
 * A function used for restricting the type of value a user can enter in an
 * input of type 'text' (example: only a numeric value or a numeric value in
 * a certain range)
 * @param  {HTMLInputElement} input The input whose value we want to restrict
 * @param  {RegExp} inputFilter The filter which will be applied to the input
 * (the filter will be a regular expression)
 */
export function setInputFilter (input, inputFilter) {
  ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop'].forEach(function (event) {
    input.addEventListener(event, function () {
      if (inputFilter(this.value)) {
        this.oldValue = this.value
        this.oldSelectionStart = this.selectionStart
        this.oldSelectionEnd = this.selectionEnd
      } else if (this.hasOwnProperty('oldValue')) {
        this.value = this.oldValue
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd)
      } else {
        this.value = ''
      }
    })
  })
}

/**
 * A function for attaching a Google analytics event tracker to an element
 * @param  {String} category Event category (ex. SEARCH, REFRESH)
 * @param  {String} action Event action (ex. Clicked a search button...)
 * @param  {String} label Event label (Where the event took place, ex. Main screen, Record Info, the current NAITS version & the current environment)
 */
export function gaEventTracker (category, action, label) {
  ReactGA.event({ category, action, label })
}
