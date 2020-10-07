import axios from 'axios'
import * as config from 'config/config.js'
import { searchCriteriaConfig } from 'config/searchCriteriaConfig'

// GET_FORM_BUILDER: '/ReactElements/getTableJSONSchema/%session/%formWeWant',
export function getSearchableDropdownForGridSearch (session, formWeWant, field, callback) {
  return function (dispatch) {
    let verbPath
    let restUrl

    const tempVar = 'getJsonSchemaForField'

    verbPath = config.svConfig.triglavRestVerbs.GET_FORM_BUILDER
    restUrl = config.svConfig.restSvcBaseUrl + verbPath

    restUrl = restUrl.replace('%session', session)
    restUrl = restUrl.replace('%formWeWant', formWeWant)

    if (searchCriteriaConfig('SEARCHABLE_DROPDOWN_FOR_SEARCH_CRITERIA') && searchCriteriaConfig('SEARCHABLE_DROPDOWN_FOR_SEARCH_CRITERIA').LIST_OF_ITEMS) {
      searchCriteriaConfig('SEARCHABLE_DROPDOWN_FOR_SEARCH_CRITERIA').LIST_OF_ITEMS.map(
        (upperMostElement) => {
          if (upperMostElement.TABLE === formWeWant) {
            upperMostElement.CRITERIA.map(
              criteriaElement => {
                if (criteriaElement === field) {
                  dispatch({ type: `${tempVar}_DATA_PENDING`, payload: undefined })
                  axios.get(restUrl)
                    .then((response) => {
                      dispatch({ type: `${tempVar}_DATA_FULFILLED`, payload: response.data })
                      if (callback instanceof Function && !(response.data instanceof Error)) {
                        // give callback response data from axios
                        callback(response.data)
                      }
                    }).catch((err) => {
                      dispatch({ type: `${tempVar}_DATA_REJECTED`, payload: err })
                      if (callback instanceof Function) {
                        // give callback response data from axios
                        callback(err)
                      }
                    })
                }
              }
            )
          }
        }
      )
    }
  }
}
