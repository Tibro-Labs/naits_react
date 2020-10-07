import axios from 'axios'
import { store, lastSelectedItem } from 'tibro-redux'
import { getAdditionalHoldingData } from 'backend/additionalDataActions'
import * as config from 'config/config'
import * as utils from 'functions/utils'

export function reloadCachedSelectedObjectsData () {
  const gridHierarchy = store.getState().gridConfig.gridHierarchy
  const verbPath = config.svConfig.triglavRestVerbs.GET_BYOBJECTID
  const url = `${config.svConfig.restSvcBaseUrl}${verbPath}`
  const session = store.getState().security.svSession

  for (let i = 0; i < gridHierarchy.length; i++) {
    const active = gridHierarchy[i].active
    const gridType = gridHierarchy[i].gridType
    const gridId = gridHierarchy[i].gridId
    const objectId = gridHierarchy[i].row[gridType + '.OBJECT_ID']

    if (active) {
      if (utils.strcmp(gridType, 'HOLDING')) {
        store.dispatch(getAdditionalHoldingData(session, objectId))
      }
      fetchData(url, session, gridId, gridType, objectId)
    }
  }
}

function fetchData (url, session, gridId, objectName, objectId) {
  url = url.replace('%session', session)
  url = url.replace('%objectId', objectId)
  url = url.replace('%objectName', objectName)
  axios.get(url)
    .then((response) => {
      const resData = response.data
      // Check if the holding name or address values have been removed, and if so, set their value to N/A
      if (!resData[0]['HOLDING.NAME']) {
        resData[0]['HOLDING.NAME'] = 'N/A'
      }
      if (!resData[0]['HOLDING.PHYSICAL_ADDRESS']) {
        resData[0]['HOLDING.PHYSICAL_ADDRESS'] = 'N/A'
      }
      store.dispatch(lastSelectedItem(gridId, resData[0]))
    })
    .catch((error) => {
      console.warn(error)
    })
}
