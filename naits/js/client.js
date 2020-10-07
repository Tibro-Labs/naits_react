import React from 'react'
import ReactDOM from 'react-dom'
import * as config from 'config/config.js'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { addLocaleData } from 'react-intl'
import { IntlProvider, updateIntl } from 'react-intl-redux'
import { store, dataToRedux, injectAsyncReducer } from 'tibro-redux'
import { checkIfUserHasAdmGroup } from 'backend/checkIfUserHasAdmGroup'
import { getUserGroups } from 'backend/getUserGroups'

import en from 'react-intl/locale-data/en'
import ka from 'react-intl/locale-data/ka'

import Routes from 'containers/Routes'
import OfflineBanner from 'containers/OfflineBanner'
import ResetGridDataLabels from 'containers/ResetGridDataLabels'

import { Loading } from 'components/ComponentsIndex'
import { userInfoReducer } from 'backend/userInfoReducer'
import { notificationReducer } from 'backend/notificationReducer'
import { historyReducer } from 'backend/historyReducer'
import { documentsReducer } from 'backend/documentsReducer'
import { formToGridAfterSaveReducer } from 'backend/formToGridAfterSaveReducer'
import { additionalDataReducer } from 'backend/additionalDataReducer'
import { validationReducer } from 'backend/validationReducer'
import { transferAnimalReducer } from 'backend/transferAnimalReducer'
import { exportCertifiedAnimalsReducer } from 'backend/exportCertifiedAnimalsReducer'
import { generateAnimalsReducer } from 'backend/generateAnimalsReducer'
import { changeStatusOfHoldingReducer } from 'backend/changeStatusOfHoldingReducer'
import { earTagReplacementReducer } from 'backend/earTagReplacementReducer'
import { dropLinkReducer } from 'backend/dropLinkReducer'
import { linkObjectsReducer } from 'backend/linkObjectsReducer'
import { getHoldingPicReducer } from 'backend/getHoldingPicReducer'
import { writeObjectToStoreReducer } from 'backend/writeObjectToStoreReducer'
import { admConsoleReducer } from 'components/AppComponents/Functional/AdminConsole/admConsoleReducer'
import { writeComponentToStoreReducer } from 'backend/writeComponentToStoreReducer'
import { getLocaleObjectId } from 'backend/userInfoAction'
import { parentSource } from 'backend/parentSource'
import { massActionResult } from 'backend/massActionResultDefaultReducer'
import { massActionReducer } from 'backend/massActionReducer'
import { passportRequestReducer } from 'backend/passportRequestReducer'
import { petPassportChangeStatusReducer } from 'backend/petPassportChangeStatusReducer'
import { petAdoptionReducer } from 'backend/petAdoptionReducer'
import { customSearchCriteriaReducer } from 'backend/customSearchCriteriaReducer'
import { replacePetIdReducer } from 'backend/replacePetIdReducer'
import { returnPetToSourceHoldingReducer } from 'backend/returnPetToSourceHoldingReducer'
import { petDirectMovementReducer } from 'backend/petDirectMovementReducer'
import { noteDescriptionReducer } from 'backend/noteDescriptionReducer'
import { updatePopulationStatusReducer } from 'backend/updatePopulationStatusReducer'
import { populationStratificationReducer } from 'backend/populationStratificationReducer'
import { linkedHoldingReducer } from 'backend/linkedHoldingReducer'
import { messagesReducer } from 'backend/messagesReducer'
import { getOrgUnitByObjectIdReducer } from 'backend/getOrgUnitByObjectIdReducer'
import { searchAndLoadReducer } from 'backend/searchAndLoadReducer'
import { moveToOrgUnitReducer } from 'backend/moveToOrgUnitReducer'
import { security } from 'backend/security'

import IdleTimer from 'react-idle-timer'
import ReactGA from 'react-ga'

import createHashHistory from 'history/createHashHistory'

const hashHistory = createHashHistory()

const app = document.getElementById('app')

const persistConfig = {
  whitelist: [
    'additionalData',
    'gis',
    'lpis',
    'historyReducer',
    'userInfoReducer',
    'notificationReducer',
    'documentsReducer',
    'formToGridAfterSaveReducer',
    'checkForInvalidSession',
    'configurator',
    'gridConfig',
    'intl',
    'security',
    'stateTooltip',
    'selectedObjects'
  ]
}

// initialize security redux key
injectAsyncReducer(store, 'security', security)

// this is needed so webiste does not bounce on first usage
function initReduxCache () {
  localStorage.clear()
  // push empty items to cache
  localStorage.setItem(
    'reduxPersist:security',
    JSON.stringify({
      currentUser: undefined,
      isBusy: false,
      lastError: undefined,
      svSession: undefined,
      svSessionMsg: undefined,
      userId: undefined,
      userInfo: undefined,
      userType: undefined
    })
  )
  injectAsyncReducer(store, 'security', security)
  persistStore(store, persistConfig)
}

export function getLocaleId (locale) {
  const session = store.getState().security.svSession
  if (session && locale) {
    const verbPath = config.svConfig.triglavRestVerbs.GET_LOCALE_OBJ_ID
    let restUrl = `${config.svConfig.restSvcBaseUrl}${verbPath}`
    restUrl = `${restUrl}/${session}/${locale}`
    store.dispatch(getLocaleObjectId(restUrl))
  }
}

export function getLabels (callback, locale) {
  let dblocale = locale.replace('-', '_')
  dataToRedux(
    (response) => {
      store.dispatch(updateIntl({
        locale,
        messages: response
      }))
      if (callback instanceof Function) {
        callback()
      }
    },
    'security',
    'temp',
    'MAIN_LABELS',
    dblocale,
    config.labelBasePath
  )
  dataToRedux(
    () => getLocaleId(dblocale),
    'null',
    'temp',
    'MAIN_LABELS2',
    store.getState().security.svSession,
    dblocale
  )
}

// Google Analytics init function
function initGA () {
  ReactGA.initialize(config.gaTrackingCode)
  ReactGA.pageview(`/${config.labelBasePath}`)
}

function logout () {
  dataToRedux(null, 'security', 'svSessionMsg', 'MAIN_LOGOUT', store.getState().security.svSession)
  localStorage.clear()
  hashHistory.push('/')
}

function loadApplication () {
  injectAsyncReducer(store, 'historyReducer', historyReducer)
  injectAsyncReducer(store, 'userInfoReducer', userInfoReducer)
  injectAsyncReducer(store, 'notificationReducer', notificationReducer)
  injectAsyncReducer(store, 'documentsReducer', documentsReducer)
  injectAsyncReducer(store, 'formToGridAfterSaveReducer', formToGridAfterSaveReducer)
  injectAsyncReducer(store, 'additionalData', additionalDataReducer)
  injectAsyncReducer(store, 'validationResults', validationReducer)
  injectAsyncReducer(store, 'selectedObjects', writeObjectToStoreReducer)
  injectAsyncReducer(store, 'admConsoleRequests', admConsoleReducer)
  injectAsyncReducer(store, 'componentToDisplay', writeComponentToStoreReducer)
  injectAsyncReducer(store, 'directTransfer', transferAnimalReducer)
  injectAsyncReducer(store, 'exportCertifiedAnimals', exportCertifiedAnimalsReducer)
  injectAsyncReducer(store, 'generateAnimals', generateAnimalsReducer)
  injectAsyncReducer(store, 'changeStatus', changeStatusOfHoldingReducer)
  injectAsyncReducer(store, 'earTagReplacement', earTagReplacementReducer)
  injectAsyncReducer(store, 'dropLink', dropLinkReducer)
  injectAsyncReducer(store, 'linkedObjects', linkObjectsReducer)
  injectAsyncReducer(store, 'getHoldingPic', getHoldingPicReducer)
  injectAsyncReducer(store, 'parentSource', parentSource)
  injectAsyncReducer(store, 'massActionResult', massActionResult)
  injectAsyncReducer(store, 'massAction', massActionReducer)
  injectAsyncReducer(store, 'passportRequest', passportRequestReducer)
  injectAsyncReducer(store, 'petPassportStatusChange', petPassportChangeStatusReducer)
  injectAsyncReducer(store, 'petAdoption', petAdoptionReducer)
  injectAsyncReducer(store, 'customSearchCriteria', customSearchCriteriaReducer)
  injectAsyncReducer(store, 'replacePetId', replacePetIdReducer)
  injectAsyncReducer(store, 'returnPetToSourceHolding', returnPetToSourceHoldingReducer)
  injectAsyncReducer(store, 'petDirectMovement', petDirectMovementReducer)
  injectAsyncReducer(store, 'noteDescription', noteDescriptionReducer)
  injectAsyncReducer(store, 'updatePopulationStatus', updatePopulationStatusReducer)
  injectAsyncReducer(store, 'populationStratification', populationStratificationReducer)
  injectAsyncReducer(store, 'linkedHolding', linkedHoldingReducer)
  injectAsyncReducer(store, 'messagesModule', messagesReducer)
  injectAsyncReducer(store, 'getOrgUnitByObjectId', getOrgUnitByObjectIdReducer)
  injectAsyncReducer(store, 'searchAndLoad', searchAndLoadReducer)
  injectAsyncReducer(store, 'moveToOrgUnit', moveToOrgUnitReducer)

  const server = `${config.svConfig.restSvcBaseUrl}${config.svConfig.triglavRestVerbs.IS_USER_ADMIN}`
  const session = store.getState().security.svSession
  const params = `/${session}`
  store.dispatch(checkIfUserHasAdmGroup(server + params))

  const verbPath = `${config.svConfig.restSvcBaseUrl}${config.svConfig.triglavRestVerbs.GET_USER_GROUPS}`
  store.dispatch(getUserGroups(verbPath + params))

  // Initialize Google Analytics
  initGA()

  getLabels(() => {
    ReactDOM.render(
      <Provider store={store}>
        <ResetGridDataLabels>
          <IntlProvider>
            <IdleTimer
              element={document}
              onActive={() => console.log('ACTIVE')}
              onIdle={() => logout()}
              timeout={580000}
            >
              <OfflineBanner />
              <Routes />
            </IdleTimer>
          </IntlProvider>
        </ResetGridDataLabels>
      </Provider>,
      app
    )
  }, 'en-US')
}

// check if session is valid from cookie,
// if session is valid rexydrate redux store,
// if session is not valid lose redux state, init security to null
// and continiue to login
addLocaleData([...ka, ...en])

let sessionToken
const sessionObj = JSON.parse(localStorage.getItem('reduxPersist:security'))
if (sessionObj) {
  sessionToken = sessionObj.svSession
}

dataToRedux(
  (response) => {
    // if response is not error, validate token
    if (!(response instanceof Error) && JSON.parse(localStorage.getItem('reduxPersist:security')).svSession) {
      console.log(response, 'Session OK Already logedIn')
      // persistant redux store wrapper
      persistStore(store, persistConfig, () => {
        // continiue to load application after redux rexydratation
        loadApplication()
      })
    } else {
      // main application render function
      // if cant validate cookie go to login screen
      console.log('Session not valid')
      // Initialise redux cache from local storage
      initReduxCache()
      loadApplication()
    }
  },
  // arguments of first dispatch (validate token)
  'security',
  'svSessionMsg',
  'MAIN_VALIDATE',
  sessionToken
)

// initially show loader
ReactDOM.render(
  <Loading />,
  app
)
