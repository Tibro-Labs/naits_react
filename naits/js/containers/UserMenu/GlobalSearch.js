import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Autosuggest from 'react-autosuggest'
import createHashHistory from 'history/createHashHistory'
import * as config from 'config/config'

import { globalSearchAction } from 'backend/globalSearchAction'
import Loading from 'components/Loading'
import { searchCriteriaConfig } from 'config/searchCriteriaConfig'
import { gaEventTracker } from 'functions/utils'

const hashHistory = createHashHistory()

export class GlobalSearch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      suggestions: [],
      searchableData: [],
      activeSearch: 'active',
      isSearchButtonDisabled: false
    }
    this.timer = undefined

    // define css for search dropdown
    this.theme = {
      container: '',
      containerOpen: {
        top: '75px',
        bottom: '0',
        position: 'fixed',
        height: '44rem',
        width: '350px',
        // top: '120%'
        borderRadius: '50px',
        paddingBottom: '24px',
        paddingTop: '29px',
        paddingRight: '4px',
        backgroundImage: 'url(img/BG_MainContent.png)'
      },
      input: 'search-input',
      inputOpen: '',
      inputFocused: '',
      suggestionsContainer: '',
      suggestionsContainerOpen: '',
      suggestionsList: '',
      suggestion: {
        color: '#fff',
        textShadow: '0 1px 0 rgba(0,0,0,0.1)'
      },
      suggestionFirst: '',
      suggestionHighlighted: {
        backgroundImage: 'url(img/BG_MainContent.png)',
        width: '86%'
      },
      sectionContainer: {

        height: 'auto',
        width: '350px'
      },
      sectionContainerFirst: {
        borderTop: '0'
      },
      sectionTitle: {
        padding: '10px 0 0 10px',
        fontSize: '12px',
        color: '#777'
      }
    }
  }
  // check Documentation of react-autosuggest package
  escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  getSuggestions = (value) => {
    const escapedValue = this.escapeRegexCharacters(value.trim())

    if (escapedValue === '') {
      return this.state.suggestions
    }

    const regex = new RegExp(`^${escapedValue}`, 'i')

    return this.state.searchableData
      .map(section => ({
        title: section.title,
        searchResults: section.searchResults.filter(searchResults => regex.test(searchResults.name))
      }))
      .filter(section => section.searchResults.length > 0)
  }

  getSuggestionValue = suggestion => suggestion.name

  renderSuggestion = suggestion =>
    (<span>
      {suggestion.criteria}: {suggestion.name}
    </span>)

  renderSectionTitle = section =>
    (<strong style={{ color: 'white' }}>
      {section.title}
    </strong>)

  getSectionSuggestions = section => section.searchResults

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    })
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    })
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  onSuggestionSelected = (event, {
    suggestion, suggestionValue, suggestionIndex, sectionIndex, method
  }) => {
    event.preventDefault()
    // send to other window after selected result
    hashHistory.push(`/main/dynamic/${suggestion.table.toLowerCase()}?c=${suggestion.criteria}&v=${suggestion.name}`)
  }

  // fire a timer that enables search button, first optional parameter is a callback
  // callback will be executed only when promise is resolved
  timerEnableButton = (callback) => {
    try {
      this.timer.cancel()
    } catch (err) {

    }
    this.timer = this.promiseTimeout(4000, 'search is enabled')

    this.timer.promise
      .then((msg) => {
        this.setState({
          isSearchButtonDisabled: false
        })
        if (callback instanceof Function) {
          callback()
        }
        console.log(msg)
      })
      .catch((e) => { })
  }
  // promise that cancels the timeout
  promiseTimeout = (delay, value) => {
    let timer = 0
    let reject2 = null
    const promise = new Promise((resolve, reject) => {
      reject2 = reject
      timer = setTimeout(resolve, delay, value)
    })
    return {
      get promise () { return promise },
      cancel () {
        if (timer) {
          clearTimeout(timer)
          timer = 0
          reject2()
          reject2 = null
        }
      }
    }
  };

  componentWillUnmount () {
    // cancel timer on ounmount
    try {
      this.timer.cancel()
    } catch (err) {

    }
  }

  startSearch = (event) => {
    event.preventDefault()
    const searchInput = document.getElementById('globalSearchInput')
    searchInput.blur()
    if (this.state.activeSearch === undefined) {
      this.setState({ activeSearch: 'active' })
    } else if (this.state.activeSearch === 'active') {
      if ((this.state.value.length >= 4) && !this.state.isSearchButtonDisabled) {
        // reset mergedResponse
        let mergedResponse = []
        this.setState(
          { isSearchButtonDisabled: true },
          // iterate from config file
          () => searchCriteriaConfig('GLOBAL_SEARCH').map(
            (element) => {
              element.CRITERIA.map(
                (criteriaElement) => {
                  // if user does not have access to a table just enable search again
                  !this.state[element.TABLE] && this.timerEnableButton()
                  // if user does have access continiue to search and fire redux action
                  this.state[element.TABLE] && this.props.globalSearchAction(this.props.svSession, element.TABLE, criteriaElement, this.state.value, 1000,
                    // Get response from callback
                    (response) => {
                      // check if data is present (when nothing found WS returns an empty array, so filter thoose out)
                      if (response.length > 0) {
                        // create a temporrary array
                        const tempArray = [
                          {
                            TABLE: element.TABLE,
                            CRITERIA: criteriaElement,
                            DATA: response,
                            SEARCH_VALUE: this.state.value
                          }
                        ]
                        // and add to previous tempArray
                        mergedResponse = [...mergedResponse, tempArray]

                        let searchableData = []
                        searchableData = []
                        // iterate mergedResponse (tempArray)
                        mergedResponse.map((tempArrayElement) => {
                          tempArrayElement[0].DATA.map((rowElement) => {
                            Object.values(rowElement).map((e, i) => {
                              // filter only results that match criteria
                              if (Object.keys(rowElement)[i].toString() === (`${tempArrayElement[0].TABLE}.${tempArrayElement[0].CRITERIA}`)) {
                                // searchableData is the final result that will be set to component state for searching
                                searchableData.push({
                                  title: tempArrayElement[0].TABLE,
                                  searchResults: [
                                    {
                                      name: Object.values(rowElement)[i].toString(),
                                      criteria: tempArrayElement[0].CRITERIA,
                                      table: tempArrayElement[0].TABLE,
                                      searchValue: tempArrayElement[0].SEARCH_VALUE
                                    }
                                  ]
                                })
                              }
                              // if last cycle enable button and stop loading spinner
                              this.timerEnableButton(
                                () => this.setState({
                                  // this is not needed but after search is complete this will open the search dropdown
                                  value: tempArrayElement[0].SEARCH_VALUE,
                                  suggestions: this.getSuggestions(tempArrayElement[0].SEARCH_VALUE)
                                }, () => searchInput.focus())
                              )
                            })
                          })
                        })

                        // set search results to component state
                        this.setState({ searchableData }, () => searchInput.focus())
                      } else {
                        // if no result is found enable search again
                        // clearTimeout(this.timer)
                        this.timerEnableButton()
                      }
                    }, false
                  )
                }
              )
            }
          )
        )
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    // map table name (that the current user has access) to component state with a true value
    if (this.props.allowedObjects !== nextProps.allowedObjects) {
      nextProps.allowedObjects.LIST_OF_ITEMS.filter(
        (id) => {
          this.setState({ [id.ID]: true })
        }
      )
    }
  }

  render () {
    const { value, suggestions } = this.state
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      id: 'globalSearchInput',
      placeholder: 'Type to search',
      value,
      onChange: this.onChange
    }

    return (
      <div className={`search-wrapper ${this.state.activeSearch} `} >
        <div className='input-holder '>
          <form>
            <Autosuggest
              theme={this.theme}
              multiSection
              alwaysRenderSuggestions
              suggestions={suggestions}
              onSuggestionSelected={this.onSuggestionSelected}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={this.getSuggestionValue}
              renderSuggestion={this.renderSuggestion}
              renderSectionTitle={this.renderSectionTitle}
              getSectionSuggestions={this.getSectionSuggestions}
              inputProps={inputProps}
            />
            <button
              type='submit'
              className='search-icon'
              onClick={event => {
                this.startSearch(event)
                gaEventTracker(
                  'SEARCH',
                  'Clicked the search button on the main screen',
                  `MAIN_SCREEN | ${config.version} (${config.currentEnv})`
                )
              }}
              disabled={this.state.isSearchButtonDisabled}
            >
              <span />
            </button>
          </form>
        </div>
        {
          this.state.isSearchButtonDisabled && <div style={{
            position: 'absolute',
            zIndex: 101,
            top: '128%',
            left: '110%',
            transform: 'translateX(-233%) translateY(-50%)',
            transition: 'all 0.3s ease-in-out'
          }}
          >
            <Loading />
          </div>
        }
      </div>
    )
  }
}

GlobalSearch.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  allowedObjects: state.userInfoReducer.allowedObjects,
  svSession: state.security.svSession
})

const mapDispatchToProps = dispatch => ({
  globalSearchAction: (svSession, tableName, searchCriteria, searchValue, rowLimit, callback, altParam) => {
    dispatch(globalSearchAction(svSession, tableName, searchCriteria, searchValue, rowLimit, callback, altParam))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearch)
