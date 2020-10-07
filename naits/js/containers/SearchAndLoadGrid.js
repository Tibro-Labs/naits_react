import React from 'react'
import PropTypes from 'prop-types'
import * as config from 'config/config'
import { menuConfig } from 'config/menuConfig'
import { searchCriteriaConfig } from 'config/searchCriteriaConfig'
import style from './SearchStyles.module.css'
import { formToGridResetAction } from 'backend/formToGridResetAction'
import { getSearchableDropdownForGridSearch } from 'backend/getSearchableDropdownForGridSearch'
import axios from 'axios'
import { connect } from 'react-redux'
import { store } from 'tibro-redux'
import { Select, DependencyDropdowns, alertUser } from 'tibro-components'
import Loading from 'components/Loading'
import ReactTooltip from 'react-tooltip'
import { withRouter } from 'react-router'
import InputWrappers from 'containers/InputWrappers'
import { $, isValidArray, convertToShortDate, swapItems, gaEventTracker, strcmp, setInputFilter, calcDifference } from 'functions/utils'
import DatePicker from 'react-date-picker'

class SearchAndLoadGrid extends React.Component {
  constructor (props) {
    super(props)
    const currentPath = props.location.pathname
    this.state = {
      alert: false,
      path: currentPath.substr(currentPath.lastIndexOf('/') + 1).toLowerCase(),
      isVisible: false,
      value: '',
      customValue: '',
      rangeFrom: '',
      rangeTo: '',
      customPetInputValue: '',
      customMovementDocInputValue: '',
      criteria: '',
      petCriteria: '',
      movementDocCriteria: '',
      dropdownOptions: undefined,
      isSearchButtonDisabled: false,
      emptyInputClassName: undefined,
      emptyCriteriaClassName: undefined,
      holdingTypes: null,
      selectedHoldingType: null,
      filterType: 'LIKE',
      dateSearch: false,
      userIsLinkedToOneHolding: false,
      userIsLinkedToTwoOrMoreHoldings: false
    }
    // declare timer
    this.timer = undefined
  }

  // fire a timer that enables search button, first optional parameter is a callback
  // callback will be executed only when promise is resolved
  timerEnableButton = (callback) => {
    try {
      this.timer.cancel()
    } catch (err) {
      ;
    }
    this.timer = this.promiseTimeout(1000, 'search is enabled')

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
  }

  searchComponentFromConfig = () => {
    if (searchCriteriaConfig('SEARCH_CRITERIA_FOR_TABLE') && searchCriteriaConfig('SEARCH_CRITERIA_FOR_TABLE').LIST_OF_ITEMS) {
      searchCriteriaConfig('SEARCH_CRITERIA_FOR_TABLE').LIST_OF_ITEMS.map(
        (element) => {
          if (element.TABLE === this.props.gridToDisplay) {
            // functional setState
            this.setState(
              () => {
                let options = element.CRITERIA.map(
                  criteriaElement => {
                    if (!this.props.customSearch && criteriaElement.CODE === 'VILLAGE_CODE') {
                      return null
                    } else {
                      return <option key={element.TABLE + criteriaElement.CODE} value={criteriaElement.CODE}>
                        {this.context.intl.formatMessage({ id: criteriaElement.LABEL, defaultMessage: criteriaElement.LABEL })}
                      </option>
                    }
                  }
                )
                return {
                  isVisible: true,
                  dropdownOptions: options,
                  criteria: element.SELECTED
                }
              },
              () => this.checkAndChangeInputType(element.SELECTED)
            )
          }
        }
      )
    }
  }

  loadFullInitialGrid = () => {
    if (this.props.showAll && menuConfig('LOAD_FULL_INITIAL_GRID_FOR_TABLE') && menuConfig('LOAD_FULL_INITIAL_GRID_FOR_TABLE').LIST_OF_ITEMS) {
      menuConfig('LOAD_FULL_INITIAL_GRID_FOR_TABLE').LIST_OF_ITEMS.map(
        (element) => {
          if (element.TABLE.toLowerCase() === this.state.path) {
            this.props.showAll()
          }
        }
      )
    }
  }

  loadEmptyInitialGrid = () => {
    if (this.props.showEmpty && menuConfig('LOAD_EMPTY_INITIAL_GRID_FOR_TABLE') && menuConfig('LOAD_EMPTY_INITIAL_GRID_FOR_TABLE').LIST_OF_ITEMS) {
      menuConfig('LOAD_EMPTY_INITIAL_GRID_FOR_TABLE').LIST_OF_ITEMS.map(
        (element) => {
          if (this.props.customSearch) {
            if (element.TABLE === this.props.gridToDisplay) {
              const criteria = element.DUMMY_CRITERIA
              // add an unreal value so its never found and grid is empty
              const value = 1000000000000
              this.props.showEmpty && this.props.showEmpty({ value, criteria })
            }
          } else {
            if (element.TABLE.toLowerCase() === this.state.path) {
              const criteria = element.DUMMY_CRITERIA
              // add an unreal value so its never found and grid is empty
              const value = 1000000000000
              this.props.showEmpty && this.props.showEmpty({ value, criteria })
            }
          }
        }
      )
    }
  }

  loadSavedFormIntoGrid = (nextProps) => {
    if ((this.props.HOLDINGPIC !== nextProps.HOLDINGPIC) && nextProps.HOLDINGPIC) {
      const value = nextProps.HOLDINGPIC
      const criteria = 'PIC'
      this.props.waitForSearch({ value, criteria })
      this.props.formToGridResetAction('HOLDING')
    }

    if ((this.props.HOLDING_RESPONSIBLE_REG_NUM !== nextProps.HOLDING_RESPONSIBLE_REG_NUM) && nextProps.HOLDING_RESPONSIBLE_REG_NUM) {
      const value = nextProps.HOLDING_RESPONSIBLE_REG_NUM
      const criteria = 'NAT_REG_NUMBER'
      this.props.waitForSearch({ value, criteria })
      this.props.formToGridResetAction('HOLDING_RESPONSIBLE')
    }

    if ((this.props.PET_PKID !== nextProps.PET_PKID) && nextProps.PET_PKID) {
      const value = nextProps.PET_PKID
      const criteria = 'PKID'
      const filterType = 'EQUAL'
      this.props.waitForSearch({ value, criteria, filterType })
      this.props.formToGridResetAction('PET')
    }

    if ((this.props.STRAY_PET_ID !== nextProps.STRAY_PET_ID) && nextProps.STRAY_PET_ID) {
      const value = nextProps.STRAY_PET_ID
      const criteria = 'PET_ID'
      const filterType = 'EQUAL'
      this.props.waitForSearch({ value, criteria, filterType })
      this.props.formToGridResetAction('STRAY_PET')
    }

    if ((this.props.QUARANTINE_ID !== nextProps.QUARANTINE_ID) && nextProps.QUARANTINE_ID) {
      const value = nextProps.QUARANTINE_ID
      const criteria = 'QUARANTINE_ID'
      this.props.waitForSearch({ value, criteria })
      this.props.formToGridResetAction('QUARANTINE')
    }

    if ((this.props.POPULATION_ID !== nextProps.POPULATION_ID) && nextProps.POPULATION_ID) {
      const value = nextProps.POPULATION_ID
      const criteria = 'POPULATION_ID'
      this.props.waitForSearch({ value, criteria })
      this.props.formToGridResetAction('POPULATION')
    }

    if ((this.props.LAB_SAMPLE_ID !== nextProps.LAB_SAMPLE_ID) && nextProps.LAB_SAMPLE_ID) {
      const value = nextProps.LAB_SAMPLE_ID
      const criteria = 'SAMPLE_ID'
      this.props.waitForSearch({ value, criteria })
      this.props.formToGridResetAction('LAB_SAMPLE')
    }

    if ((this.props.LAB_TEST_TYPE_PKID !== nextProps.LAB_TEST_TYPE_PKID) && nextProps.LAB_TEST_TYPE_PKID) {
      const value = nextProps.LAB_TEST_TYPE_PKID
      const criteria = 'PKID'
      const filterType = 'EQUAL'
      this.props.waitForSearch({ value, criteria, filterType })
      this.props.formToGridResetAction('LAB_TEST_TYPE')
    }
  }

  searchInputComponent = (state) => {
    const normalInput = <input
      id='searchAndLoadInputValue'
      value={state.value}
      minLength={this.state.criteria === 'PIC' && this.props.gridToDisplay === 'HOLDING' ? '4' : null}
      className={`${style.input} ${state.emptyInputClassName}`}
      onChange={this.handleValueChange}
      placeholder={
        this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.search`, defaultMessage: `${config.labelBasePath}.main.search` })
      }
      {...this.state.emptyInputClassName && {
        'data-tip': this.context.intl.formatMessage(
          {
            id: `${config.labelBasePath}.login.mandatory_login_empty`,
            defaultMessage: `${config.labelBasePath}.login.mandatory_login_empty`
          }
        )
      }}
      {...this.state.emptyInputClassName && { 'data-for': 'SearchAndLoadTooltipemptyInputClassName' }}
      {...this.state.emptyInputClassName && { 'data-offset': "{'left': 45, 'top': 8}" }}
    />

    const searchableInput = <div id='searchAndLoadDynamicSelect'
      {...this.state.emptyInputClassName && {
        'data-tip': this.context.intl.formatMessage(
          {
            id: `${config.labelBasePath}.login.mandatory_login_empty`,
            defaultMessage: `${config.labelBasePath}.login.mandatory_login_empty`
          }
        )
      }}
      {...this.state.emptyInputClassName && { 'data-for': 'SearchAndLoadTooltipemptyInputClassName' }}
      {...this.state.emptyInputClassName && { 'data-offset': "{'left': 80, 'top': -15}" }}

    >
      <Select
        className={`${style.input} ${style.dynamicSelect} ${state.emptyInputClassName}`}
        clearable={false}
        placeholder={
          this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.search`, defaultMessage: `${config.labelBasePath}.main.search` })
        }
        options={state[state.criteria]}
        onChange={(event) => this.setState({ value: event.value, emptyInputClassName: undefined })}
        onInputChange={() => this.setState({ emptyInputClassName: undefined })}
        onFocus={() => this.setState({ emptyInputClassName: undefined })}
        value={state.value}
      />
    </div>

    if (this.props.gridToDisplay === 'INVENTORY_ITEM' && this.props.customSearch) {
      const searchDiv = document.getElementById('searchandload')
      if (searchDiv) {
        searchDiv.firstChild.style.display = 'none'
      }
      const customForm = document.getElementById('customSearchAndLoadForm')
      if (customForm) {
        customForm.style.display = 'block'
      }
      const altCustomForm = document.getElementById('altCustomSearchAndLoadForm')
      if (altCustomForm) {
        altCustomForm.style.marginLeft = '0'
        altCustomForm.style.marginTop = '2rem'
      }
    } else if (this.props.gridToDisplay === 'INVENTORY_ITEM' && !this.props.customSearch) {
      const customForm = document.getElementById('customSearchAndLoadForm')
      if (customForm) {
        customForm.style.display = 'none'
      }
    }

    if (state[state.criteria]) {
      return searchableInput
    } else if (this.state.dateSearch) {
      return <DatePicker
        required
        className='datePicker leftmost'
        onChange={this.setDate}
        value={this.state.value}
      />
    } else {
      return normalInput
    }
  }

  customSearchInputComponent () {
    return <input
      id='customSearchAndLoadInputValue'
      value={this.state.customValue}
      className={`${style.input} ${this.state.emptyInputClassName}`}
      onChange={this.customHandleValueChange}
      placeholder={
        this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.search`, defaultMessage: `${config.labelBasePath}.main.search` })
      }
      {...this.state.emptyInputClassName && {
        'data-tip': this.context.intl.formatMessage(
          {
            id: `${config.labelBasePath}.login.mandatory_login_empty`,
            defaultMessage: `${config.labelBasePath}.login.mandatory_login_empty`
          }
        )
      }}
      {...this.state.emptyInputClassName && { 'data-for': 'SearchAndLoadTooltipemptyInputClassName' }}
      {...this.state.emptyInputClassName && { 'data-offset': "{'left': 45, 'top': 8}" }}
    />
  }

  customInvItemSearchInputComponent () {
    return <div style={{ display: this.props.isSecondary ? 'flex' : 'none', justifyContent: this.props.isSecondary ? 'center' : null }}>
      <input
        id='rangeFrom'
        name='rangeFrom'
        value={this.state.rangeFrom}
        className={`${style.customInvItemInput} ${this.state.emptyInputClassName}`}
        style={{ marginRight: '1px', borderBottomLeftRadius: '5px', borderTopLeftRadius: '5px' }}
        onChange={this.customHandleInvItemValueChange}
        placeholder={
          this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.range_from`, defaultMessage: `${config.labelBasePath}.main.range_from` })
        }
        {...this.state.emptyInputClassName && {
          'data-tip': this.context.intl.formatMessage(
            {
              id: `${config.labelBasePath}.login.mandatory_login_empty`,
              defaultMessage: `${config.labelBasePath}.login.mandatory_login_empty`
            }
          )
        }}
        {...this.state.emptyInputClassName && { 'data-for': 'SearchAndLoadTooltipemptyInputClassName' }}
        {...this.state.emptyInputClassName && { 'data-offset': "{'left': 45, 'top': 8}" }}
      />
      <input
        id='rangeTo'
        name='rangeTo'
        value={this.state.rangeTo}
        className={`${style.customInvItemInput} ${this.state.emptyInputClassName}`}
        onChange={this.customHandleInvItemValueChange}
        placeholder={
          this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.range_to`, defaultMessage: `${config.labelBasePath}.main.range_to` })
        }
        {...this.state.emptyInputClassName && {
          'data-tip': this.context.intl.formatMessage(
            {
              id: `${config.labelBasePath}.login.mandatory_login_empty`,
              defaultMessage: `${config.labelBasePath}.login.mandatory_login_empty`
            }
          )
        }}
        {...this.state.emptyInputClassName && { 'data-for': 'SearchAndLoadTooltipemptyInputClassName' }}
        {...this.state.emptyInputClassName && { 'data-offset': "{'left': 45, 'top': 8}" }}
      />
      <button
        className={style.button}
        onClick={(event) => this.handleCustomInvItemSearch(event)}
      >
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.search`,
          defaultMessage: `${config.labelBasePath}.main.search`
        })}
      </button>
    </div>
  }

  handleCustomInvItemSearch (event) {
    store.dispatch({ type: 'RESET_SEARCH' })
    const { rangeFrom, rangeTo } = this.state
    event.preventDefault()
    this.setState({ criteria: 'EAR_TAG_NUMBER', value: '' })
    gaEventTracker(
      'SEARCH',
      `Clicked the custom inventory item search by order button in the ${this.props.gridToDisplay} screen`,
      `RECORD_INFO | ${config.version} (${config.currentEnv})`
    )
    if (!rangeFrom && !rangeTo) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_ranges_entered`,
            defaultMessage: `${config.labelBasePath}.alert.no_ranges_entered`
          }), null, () => { this.setState({ alert: false }) }
        )
      })
    } else if (!rangeFrom) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_range_from_entered`,
            defaultMessage: `${config.labelBasePath}.alert.no_range_from_entered`
          }), null, () => { this.setState({ alert: false }) }
        )
      })
    } else if (!rangeTo) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_range_to_entered`,
            defaultMessage: `${config.labelBasePath}.alert.no_range_to_entered`
          }), null, () => { this.setState({ alert: false }) }
        )
      })
    } else {
      if (parseInt(rangeFrom) > parseInt(rangeTo)) {
        this.setState({
          alert: alertUser(true, 'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.range_from_larger_than_range_to`,
              defaultMessage: `${config.labelBasePath}.alert.range_from_larger_than_range_to`
            }), null, () => { this.setState({ alert: false }) }
          )
        })
      } else if (calcDifference(parseInt(rangeTo), parseInt(rangeFrom)) > 300) {
        this.setState({
          alert: alertUser(true, 'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.range_difference_cannot_be_more_than_three_hundred`,
              defaultMessage: `${config.labelBasePath}.alert.range_difference_cannot_be_more_than_three_hundred`
            }), null, () => { this.setState({ alert: false }) }
          )
        })
      } else {
        if (this.props.isSecondary) {
          this.props.customInvItemSearch(rangeFrom, rangeTo)
        } else {
          this.props.customSearch('GET_INVENTORY_ITEMS_BY_RANGE', rangeFrom, rangeTo)
        }
      }
    }
  }

  customPetSearchInputComponent () {
    return <input
      id='customPetSearchAndLoadInputValue'
      value={this.state.customPetInputValue}
      className={`${style.input} ${this.state.emptyInputClassName}`}
      onChange={this.customHandlePetValueChange}
      placeholder={
        this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.search`, defaultMessage: `${config.labelBasePath}.main.search` })
      }
      {...this.state.emptyInputClassName && {
        'data-tip': this.context.intl.formatMessage(
          {
            id: `${config.labelBasePath}.login.mandatory_login_empty`,
            defaultMessage: `${config.labelBasePath}.login.mandatory_login_empty`
          }
        )
      }}
      {...this.state.emptyInputClassName && { 'data-for': 'SearchAndLoadTooltipemptyInputClassName' }}
      {...this.state.emptyInputClassName && { 'data-offset': "{'left': 45, 'top': 8}" }}
    />
  }

  customMovementDocSearchInputComponent () {
    return <input
      id='customMovementDocSearchAndLoadInputValue'
      value={this.state.customMovementDocInputValue}
      className={`${style.input} ${this.state.emptyInputClassName}`}
      onChange={this.customHandleMovementDocValueChange}
      placeholder={
        this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.search`, defaultMessage: `${config.labelBasePath}.main.search` })
      }
      {...this.state.emptyInputClassName && {
        'data-tip': this.context.intl.formatMessage(
          {
            id: `${config.labelBasePath}.login.mandatory_login_empty`,
            defaultMessage: `${config.labelBasePath}.login.mandatory_login_empty`
          }
        )
      }}
      {...this.state.emptyInputClassName && { 'data-for': 'SearchAndLoadTooltipemptyInputClassName' }}
      {...this.state.emptyInputClassName && { 'data-offset': "{'left': 45, 'top': 8}" }}
    />
  }

  setDate = (date) => {
    this.setState({ value: date })
  }

  // #1 form response, #2 selected value in criteria, #3 enum or enumNames, #4 title in guimetadata (nested key name)
  findFieldValues = (response, selectedValue, fieldType, nestedKeys) => {
    // check if nested
    let withNested
    let found
    if (isValidArray(nestedKeys, 1)) {
      for (let i = 0; i < nestedKeys.length; i++) {
        withNested = nestedKeys[i] && response.properties &&
          response.properties[nestedKeys[i]] &&
          response.properties[nestedKeys[i]].properties &&
          response.properties[nestedKeys[i]].properties[selectedValue] &&
          response.properties[nestedKeys[i]].properties[selectedValue][fieldType]
        if (withNested) {
          found = i
          break
        }
      }
    }

    const notNested = response.properties && response.properties[selectedValue] &&
      response.properties[selectedValue][fieldType]

    if (withNested) {
      return response.properties[nestedKeys[found]].properties[selectedValue][fieldType]
    } else if (notNested) {
      return response.properties[selectedValue][fieldType]
    } else {
      return []
    }
  }

  checkAndChangeInputType = (selectedValue) => {
    let generatedTable = this.props.gridToDisplay
    if (generatedTable === 'HOLDING' && selectedValue === 'VILLAGE_CODE') {
      generatedTable = 'VILLAGE'
    } if (searchCriteriaConfig('SEARCHABLE_DROPDOWN_FOR_SEARCH_CRITERIA') && searchCriteriaConfig('SEARCHABLE_DROPDOWN_FOR_SEARCH_CRITERIA').LIST_OF_ITEMS) {
      // filter out table configs that are not in use
      const filteredConfig = searchCriteriaConfig('SEARCHABLE_DROPDOWN_FOR_SEARCH_CRITERIA').LIST_OF_ITEMS.filter(
        e => e.TABLE === generatedTable
      )
      // filter out all criteria that are not in use
      let filteredCriteria = []
      if (filteredConfig && filteredConfig[0] && filteredConfig[0].CRITERIA) {
        filteredCriteria = filteredConfig[0].CRITERIA.filter(
          e => e === selectedValue
        )
      }
      // if in gui metadata field is with a title (nested in reponse object) handle appropriately
      let nestedValues
      if (filteredConfig && filteredConfig[0] && filteredConfig[0].NESTED_VALUES) {
        nestedValues = filteredConfig[0].NESTED_VALUES
      }

      // memoise ilteredCriteria.length
      const filteredCriteriaLength = filteredCriteria.length

      if (filteredCriteriaLength && !this.state[selectedValue]) {
        this.setState(
          { isSearchButtonDisabled: true },
          () => {
            // fire form action that gets field labels and values for searchable dropdown
            this.props.getSearchableDropdownForGridSearch(
              this.props.svSession,
              generatedTable,
              selectedValue,
              (response) => {
                // response callback in action that uses functional setState
                this.setState(
                  () => {
                    const values = this.findFieldValues(response, selectedValue, 'enum', nestedValues)
                    const labels = this.findFieldValues(response, selectedValue, 'enumNames', nestedValues)
                    let searchableDropdownOptions
                    if (this.props.gridToDisplay === 'AREA' && this.state.criteria === 'AREA_TYPE') {
                      searchableDropdownOptions = values.map(
                        (i, e) => e = { value: '' + e, label: labels[i] } // eslint-disable-line
                      )
                    } else if (this.state.criteria === 'AREA_NAME') {
                      searchableDropdownOptions = values.map(
                        (e, i) => e = { value: '' + e, label: labels[i] } // eslint-disable-line
                      )
                    } else if (this.props.gridToDisplay === 'SVAROG_ORG_UNITS') {
                      searchableDropdownOptions = values.map(
                        (e, i) => e = { value: '' + e, label: labels[i] } // eslint-disable-line
                      )

                      swapItems(searchableDropdownOptions, 1, 0)
                      swapItems(searchableDropdownOptions, 3, 1)
                    } else {
                      searchableDropdownOptions = values.map(
                        (e, i) => e = { value: '' + e, label: labels[i] } // eslint-disable-line
                      )
                    }
                    // create key from selected value and fill with searchable data (above object)
                    return {
                      [selectedValue]: searchableDropdownOptions,
                      criteria: selectedValue,
                      value: '',
                      emptyCriteriaClassName: undefined,
                      emptyInputClassName: undefined,
                      filterType: 'EQUAL' // use EQUAL filter for codelists
                    }
                  },
                  // setState callback that enables search button
                  () => this.timerEnableButton()
                )
              }
            )
          }
        )
      } else {
        // set current selection from dropdown to state
        this.setState({
          criteria: selectedValue,
          value: '',
          emptyCriteriaClassName: undefined,
          emptyInputClassName: undefined,
          filterType: 'LIKE',
          dateSearch: false,
          date: null
        })
      }
    }
    if (searchCriteriaConfig('SEARCH_BY_DATE') && searchCriteriaConfig('SEARCH_BY_DATE').LIST_OF_ITEMS) {
      const dateFilter = searchCriteriaConfig('SEARCH_BY_DATE').LIST_OF_ITEMS.filter(
        e => e.TABLE === generatedTable
      )
      if (dateFilter && dateFilter[0] && generatedTable === dateFilter[0].TABLE &&
        dateFilter[0].CRITERIA.includes(selectedValue)) {
        this.setState({
          dateSearch: true,
          criteria: selectedValue,
          value: '',
          emptyCriteriaClassName: undefined,
          emptyInputClassName: undefined,
          filterType: 'LIKE'
        })
      }
    }
  }

  queryUrlAndSearch = (props) => {
    const urlParamValue = new URLSearchParams(props.location.search).get('v')
    const urlParamCriteria = new URLSearchParams(props.location.search).get('c')

    if (urlParamCriteria && urlParamValue) {
      // prevent user to modify url query, only the ones from config file will be used
      searchCriteriaConfig('GLOBAL_SEARCH').map((element) => {
        element.CRITERIA.map(
          (criteriaElement) => {
            if (element.TABLE.toLowerCase() === this.state.path.toLowerCase()) {
              if (criteriaElement.toLowerCase() === urlParamCriteria.toLowerCase()) {
                this.props.waitForSearch({ value: urlParamValue, criteria: urlParamCriteria })
              }
            }
          }
        )
      })
    }
  }

  fetchHoldingTypes = () => {
    this.props.getSearchableDropdownForGridSearch(
      this.props.svSession,
      'HOLDING',
      'TYPE',
      (response) => {
        // response callback in action that uses functional setState
        const values = this.findFieldValues(response, 'TYPE', 'enum', ['holding.info'])
        const labels = this.findFieldValues(response, 'TYPE', 'enumNames', ['holding.info'])
        let elements = []
        for (let i = 0; i < values.length; i++) {
          elements.push(
            <option
              id={labels[i]}
              key={labels[i]}
              value={values[i]}
            >
              {labels[i]}
            </option>
          )
        }
        this.setState({ holdingTypes: elements })
      }
    )
  }

  componentWillReceiveProps (nextProps) {
    this.loadSavedFormIntoGrid(nextProps)
    this.queryUrlAndSearch(nextProps)

    if (this.state.criteria === 'ANIMAL_ID' && this.props.noResults !== nextProps.noResults &&
      nextProps.noResults && !nextProps.aFilterHasBeenUsed && !nextProps.searchFromPopup) {
      this.setState({
        alert: alertUser(
          true, 'info',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_animal_id_found`,
            defaultMessage: `${config.labelBasePath}.alert.no_animal_id_found`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.search_replaced_ear_tags`,
            defaultMessage: `${config.labelBasePath}.alert.search_replaced_ear_tags`
          }),
          () => {
            this.props.waitForSearch({ value: this.state.value, criteria: 'OLD_EAR_TAG' })
            this.setState({ alert: false, criteria: 'OLD_EAR_TAG' })
          },
          () => {
            this.setState({ alert: false })
          }, true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.yes`,
            defaultMessage: `${config.labelBasePath}.main.yes`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.no`,
            defaultMessage: `${config.labelBasePath}.main.no`
          })
        )
      })
    }
  }

  componentDidUpdate (nextProps, nextState) {
    if (this.props.population) {
      if (nextState.CAMPAIGN_SCOPE) {
        nextState.CAMPAIGN_SCOPE.splice(2, 1)
      }
    }
  }

  componentDidMount () {
    this.searchComponentFromConfig()
    this.loadFullInitialGrid()
    this.loadEmptyInitialGrid()
    this.queryUrlAndSearch(this.props)
    this.fetchHoldingTypes()
    this.getLinkedHoldingsForCurrentUser()

    this.setState({ petCriteria: 'OWNER', movementDocCriteria: 'ANIMAL' })
    store.dispatch({ type: 'CHANGED_CUSTOM_PET_SEARCH_CRITERIA', payload: 'OWNER' })
    store.dispatch({ type: 'CHANGED_CUSTOM_MOVEMENT_DOC_SEARCH_CRITERIA', payload: 'ANIMAL' })

    // Set an input filter on the range from & range to input fields that only accepts numeric values
    if (this.props.gridToDisplay === 'INVENTORY_ITEM') {
      this.setRangeInputFilter()
    }
  }

  componentWillUnmount () {
    // cancel timer on ounmount
    try {
      this.timer.cancel()
    } catch (err) {
      ;
    }
    // Reset the animal search state
    store.dispatch({ type: 'RESET_ANIMAL_SEARCH' })
  }

  getLinkedHoldingsForCurrentUser = async () => {
    const server = config.svConfig.restSvcBaseUrl
    const session = this.props.svSession
    const verbPath = config.svConfig.triglavRestVerbs.GET_LINKED_HOLDINGS_PER_USER
    let url = `${server}${verbPath}`
    url = url.replace('%session', session)
    try {
      const res = await axios.get(url)
      if (res.data && res.data.length === 1) {
        store.dispatch({ type: 'USER_IS_LINKED_TO_ONE_HOLDING' })
        this.setState({ userIsLinkedToOneHolding: true, userIsLinkedToTwoOrMoreHoldings: false })
      } else if (res.data && res.data.length > 1) {
        store.dispatch({ type: 'USER_IS_LINKED_TO_TWO_OR_MORE_HOLDINGS' })
        this.setState({ userIsLinkedToOneHolding: false, userIsLinkedToTwoOrMoreHoldings: true })
      } else if (res.data.length === 0) {
        store.dispatch({ type: 'USER_IS_NOT_LINKED_TO_ANY_HOLDINGS' })
      }
    } catch (err) {
      console.error(err)
    }
  }

  setRangeInputFilter = () => {
    const rangeFromInput = document.getElementById('rangeFrom')
    const rangeToInput = document.getElementById('rangeTo')
    if (rangeFromInput && rangeToInput) {
      setInputFilter(rangeFromInput, function (value) {
        return /^\d*$/.test(value)
      })
      setInputFilter(rangeToInput, function (value) {
        return /^\d*$/.test(value)
      })
    }
  }

  handleValueChange = (event, value) => {
    this.setState({ value: value || event.target.value, emptyInputClassName: undefined })

    const inputEl = document.getElementById('searchAndLoadInputValue')
    if (this.props.gridToDisplay === 'HOLDING' && this.state.criteria === 'PIC' && event.target.value.length === 0) {
      inputEl.style.border = '1px solid #e9f1da'
    } else if (this.props.gridToDisplay === 'HOLDING' && this.state.criteria === 'PIC' &&
      (this.state.selectedHoldingType === null || this.state.selectedHoldingType === '') && event.target.value.length <= 3) {
      inputEl.style.border = '2px solid #d9230f'
    } else if (this.props.gridToDisplay === 'HOLDING' && this.state.criteria === 'PIC' && event.target.value.length >= 4) {
      inputEl.style.border = '1px solid #e9f1da'
    }
  }

  customHandleValueChange = (event, value) => {
    this.setState({ customValue: value || event.target.value, emptyInputClassName: undefined })
  }

  customHandleInvItemValueChange = (event, value) => {
    this.setState({ [event.target.name]: value || event.target.value, emptyInputClassName: undefined })
  }

  customHandlePetValueChange = (event, value) => {
    this.setState({ customPetInputValue: value || event.target.value, emptyInputClassName: undefined })
  }

  customHandleMovementDocValueChange = (event, value) => {
    this.setState({ customMovementDocInputValue: value || event.target.value, emptyCriteriaClassName: undefined })
  }

  handleCriteriaChange = (event) => {
    this.setState(
      { criteria: event.target.value, emptyCriteriaClassName: undefined, dateSearch: false, date: null },
      () => this.checkAndChangeInputType(this.state.criteria)
    )
  }

  handlePetCriteriaChange = (event) => {
    this.setState({ petCriteria: event.target.value, customPetInputValue: '' })
    store.dispatch({ type: 'CHANGED_CUSTOM_PET_SEARCH_CRITERIA', payload: event.target.value })
  }

  handleMovementDocCriteriaChange = (event) => {
    this.setState({ movementDocCriteria: event.target.value, customMovementDocInputValue: '' })
    store.dispatch({ type: 'CHANGED_CUSTOM_MOVEMENT_DOC_SEARCH_CRITERIA', payload: event.target.value })
  }

  handleHoldingTypeChange = (event) => {
    this.setState({ selectedHoldingType: event.target.value })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.setState({ customPetInputValue: '', customMovementDocInputValue: '', rangeFrom: '', rangeTo: '' })
    store.dispatch({ type: 'RESET_SEARCH' })
    let { value } = this.state
    const { criteria, filterType, dateSearch } = this.state
    if (dateSearch) {
      value = convertToShortDate(value, 'y-m-d')
    }

    if (strcmp(criteria, 'VILLAGE_CODE')) {
      this.props.customSearch('GET_OBJECTS_BY_LOCATION', value, this.props.gridToDisplay)
    } else if (strcmp(criteria, 'ANIMAL_ID')) {
      store.dispatch({ type: 'RESET_ANIMAL_SEARCH' })
      if (value) {
        this.props.waitForSearch({ value, criteria, filterType })
      }
    } else if (strcmp(criteria, 'TRANSPORTER_LICENSE')) {
      this.props.customSearch('GET_MOVEMENT_DOC_BY_TRANSPORTER_LICENSE', value, this.props.gridToDisplay)
    } else {
      let altCriteria
      let altValue
      const altCriteriaEl = 'TYPE'
      const altValueEl = $('altSearchValue')
      if (altCriteriaEl && altValueEl) {
        altCriteria = altCriteriaEl
        altValue = altValueEl.value
      }
      if (this.props.gridToDisplay === 'HOLDING' && this.state.criteria === 'PIC' &&
        value.length <= 3 && this.state.selectedHoldingType === null && this.state.selectedHoldingType === '') {
        return
      }
      if (value || altValue) {
        this.props.waitForSearch({ value, criteria, altValue, altCriteria, filterType })
      }
    }
  }

  render () {
    let form = null
    let InputWrapper = InputWrappers['InputSearchWrapper']
    if (this.state.isVisible) {
      form = <form
        id='searchAndLoadForm'
        className={style.search}
        style={{ width: this.props.gridToDisplay === 'INVENTORY_ITEM' ? '40rem' : null }}
      >
        {this.searchInputComponent(this.state)}
        <button
          className={`${style.button}`}
          disabled={
            this.state.isSearchButtonDisabled ||
            (this.props.gridToDisplay === 'HOLDING' && this.state.criteria === 'PIC' &&
              this.state.value.length <= 3 && (this.state.selectedHoldingType === null || this.state.selectedHoldingType === ''))
          }
          onClick={event => {
            this.handleSubmit(event)
            gaEventTracker(
              'SEARCH',
              `Clicked the search button on a record info (${this.props.gridToDisplay})`,
              `RECORD_INFO | ${config.version} (${config.currentEnv})`
            )
          }}
        >
          {this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.search`, defaultMessage: `${config.labelBasePath}.main.search` })}
        </button>

        {(this.state.criteria === 'PIC' && this.props.gridToDisplay === 'HOLDING' &&
          this.state.value !== '' && this.state.value.length <= 3 &&
          (this.state.selectedHoldingType === null || this.state.selectedHoldingType === '')) &&
          <p style={{ color: '#d9230f' }}>
            {
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.value_must_be_four_chars`,
                defaultMessage: `${config.labelBasePath}.main.value_must_be_four_chars`
              })
            }
          </p>
        }
        <p
          id='searchAndLoadParagraph'
          className={(
            this.state.criteria === 'PIC' && this.props.gridToDisplay === 'HOLDING' &&
            this.state.value !== '' && this.state.value.length <= 3 &&
            (this.state.selectedHoldingType === null || this.state.selectedHoldingType === ''))
            ? style.customSearchPrompt : style.searchPrompt
          }
        >
          {
            this.context.intl.formatMessage(
              { id: `${config.labelBasePath}.select_search_criteria`, defaultMessage: `${config.labelBasePath}.select_search_criteria` })
          }
        </p>
        <select
          id='searchAndLoadSelect'
          value={this.state.criteria}
          onChange={this.handleCriteriaChange}
          className={`${style.dropdown} ${this.state.emptyCriteriaClassName}`}
          {...this.state.emptyCriteriaClassName && {
            'data-tip': this.context.intl.formatMessage(
              {
                id: `${config.labelBasePath}.login.mandatory_login_empty`,
                defaultMessage: `${config.labelBasePath}.login.mandatory_login_empty`
              }
            )
          }}
          {...this.state.emptyCriteriaClassName && { 'data-for': 'SearchAndLoadTooltipemptyCriteriaClassName' }}
          {...this.state.emptyCriteriaClassName && { 'data-offset': "{'left': 45, 'top': 8}" }}
        >
          <option value='' />
          {this.state.dropdownOptions}
        </select>
        {this.props.gridToDisplay === 'HOLDING' &&
          <div id='selectType'
            className={style.selectType}>
            <select
              onChange={this.handleHoldingTypeChange}
              id='altSearchValue' className={style.dropdown}
              style={{ marginLeft: '-3%', marginTop: '29px' }}
            >
              <option disabled selected hidden value=''>
                {
                  this.context.intl.formatMessage(
                    {
                      id: `${config.labelBasePath}.main.select_holding_type`,
                      defaultMessage: `${config.labelBasePath}.main.select_holding_type`
                    })
                }
              </option>
              <option value=''> {' '} </option>
              {this.state.holdingTypes}
            </select>
          </div>
        }
      </form>
      if (this.state.criteria === 'VILLAGE_CODE') {
        form = <InputWrapper
          fieldIdCode='searchAndLoadInputValue'
          handleValueChange={this.handleValueChange}>
          {form}
        </InputWrapper>
      }
    }
    if ((this.props.userIsLinkedToOneHolding || this.props.userIsLinkedToTwoOrMoreHoldings) ||
      (this.state.userIsLinkedToOneHolding || this.state.userIsLinkedToTwoOrMoreHoldings)) {
      if (!this.props.searchFromPopup) {
        return null
      }
    }
    return (
      <div
        id='searchandload'
        style={{ display: this.props.gridToDisplay === 'INVENTORY_ITEM' && !this.props.customSearch ? 'flex' : null }}
      >
        {this.state.emptyInputClassName && <ReactTooltip
          id='SearchAndLoadTooltipemptyInputClassName'
          delayHide={1000}
          event='mouseover'
          eventOff='mouseout'
          className='tooltips'
          type='error'
          place='right'
          effect='solid'
        />}
        {this.state.emptyCriteriaClassName && <ReactTooltip
          id='SearchAndLoadTooltipemptyCriteriaClassName'
          delayHide={1000}
          event='mouseover'
          eventOff='mouseout'
          className='tooltips'
          type='error'
          place='right'
          effect='solid'
        />}
        {form}
        {
          this.state.isSearchButtonDisabled && <div style={{
            position: 'absolute',
            zIndex: 1001,
            top: '50%',
            left: '50%',
            transform: 'translateX(-233%) translateY(-50%)',
            transition: 'all 0.3s ease-in-out'
          }}
          >
            <Loading />
          </div>
        }
        {
          ['LAB_SAMPLE'].includes(this.props.gridToDisplay) &&
          <div className={style.search} style={{ color: 'white', marginTop: '1rem' }}>
            <p style={{ fontWeight: 'bold' }}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.search_samples_by_geographic_location`,
                defaultMessage: `${config.labelBasePath}.main.search_samples_by_geographic_location`
              })}
            </p>
            <DependencyDropdowns tableName='HOLDING' spread='down' />
            <button className={style.button} style={{ borderRadius: '5px', marginTop: '1rem' }}
              onClick={() => {
                let code = null
                code =
                  ($('root_holding.location.info_VILLAGE_CODE') && $('root_holding.location.info_VILLAGE_CODE').value) ||
                  ($('root_holding.location.info_COMMUN_CODE') && $('root_holding.location.info_COMMUN_CODE').value) ||
                  ($('root_holding.location.info_MUNIC_CODE') && $('root_holding.location.info_MUNIC_CODE').value) ||
                  ($('root_holding.location.info_REGION_CODE') && $('root_holding.location.info_REGION_CODE').value)
                if (!code) {
                  this.setState({
                    alert: alertUser(true, 'warning',
                      this.context.intl.formatMessage({
                        id: `${config.labelBasePath}.alert.no_region_selected_admconsole`,
                        defaultMessage: `${config.labelBasePath}.alert.no_region_selected_admconsole`
                      }), null,
                      () => {
                        this.setState({ alert: false })
                      }
                    )
                  })
                } else {
                  this.props.customSearch('GET_OBJECTS_BY_LOCATION', code, this.props.gridToDisplay)
                }
              }}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.search`,
                defaultMessage: `${config.labelBasePath}.main.search`
              })}
            </button>
          </div>
        }
        {
          ['PET'].includes(this.props.gridToDisplay) &&
          <form
            id='customPetSearchAndLoadForm'
            className='js-containers-SearchStyles-module-search'
            style={{ marginTop: '0.5rem' }}
          >
            <label htmlFor='customPetSearchAndLoadInputValue' style={{ color: '#ffffff', marginBottom: '1rem', marginTop: '1rem' }}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.search_by_owner_or_passport_id`,
                defaultMessage: `${config.labelBasePath}.main.search_by_owner_or_passport_id`
              })}
            </label>
            {this.customPetSearchInputComponent()}
            <button
              className={style.button}
              onClick={(e) => {
                e.preventDefault()
                this.setState({ value: '', criteria: 'PET_ID' })
                this.props.customSearch(null, this.state.customPetInputValue, this.state.petCriteria)
                gaEventTracker(
                  'SEARCH',
                  `Clicked the custom pet search button in the ${this.props.gridToDisplay} screen`,
                  `RECORD_INFO | ${config.version} (${config.currentEnv})`
                )
              }}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.search`,
                defaultMessage: `${config.labelBasePath}.main.search`
              })}
            </button>
            <p
              id='searchAndLoadPetParagraph'
              className={`${style.searchPrompt}`}
            >
              {
                this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.select_search_criteria`,
                  defaultMessage: `${config.labelBasePath}.select_search_criteria`
                })
              }
            </p>
            <select
              id='searchAndLoadPetSelect'
              value={this.state.petCriteria}
              onChange={this.handlePetCriteriaChange}
              className={`${style.dropdown} ${this.state.emptyCriteriaClassName}`}
              {...this.state.emptyCriteriaClassName && {
                'data-tip': this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.login.mandatory_login_empty`,
                    defaultMessage: `${config.labelBasePath}.login.mandatory_login_empty`
                  }
                )
              }}
              {...this.state.emptyCriteriaClassName && { 'data-for': 'SearchAndLoadTooltipemptyCriteriaClassName' }}
              {...this.state.emptyCriteriaClassName && { 'data-offset': "{'left': 45, 'top': 8}" }}
            >
              <option value='OWNER'>
                {
                  this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.search_by_pet_owner_id`,
                    defaultMessage: `${config.labelBasePath}.main.search_by_pet_owner_id`
                  })
                }
              </option>
              <option value='PET_PASSPORT'>
                {
                  this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.search_by_pet_passport_id`,
                    defaultMessage: `${config.labelBasePath}.main.search_by_pet_passport_id`
                  })
                }
              </option>
            </select>
          </form>
        }
        {
          ['INVENTORY_ITEM'].includes(this.props.gridToDisplay) &&
          <React.Fragment>
            <form id='customSearchAndLoadForm' className='js-containers-SearchStyles-module-search'>
              <label htmlFor='customSearchAndLoadInputValue' style={{ color: '#ffffff', marginBottom: '1rem', marginTop: '1rem' }}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.search_by_ear_tag_id`,
                  defaultMessage: `${config.labelBasePath}.main.search_by_ear_tag_id`
                })}
              </label>
              {this.customSearchInputComponent()}
              <button
                className={style.button}
                onClick={(e) => {
                  e.preventDefault()
                  this.setState({ rangeFrom: '', rangeTo: '' })
                  this.props.customSearch('SEARCH_BY_EAR_TAG_ID', this.state.customValue)
                  gaEventTracker(
                    'SEARCH',
                    `Clicked the custom search button in the ${this.props.gridToDisplay} screen`,
                    `RECORD_INFO | ${config.version} (${config.currentEnv})`
                  )
                }}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.search`,
                  defaultMessage: `${config.labelBasePath}.main.search`
                })}
              </button>
            </form>
            <form
              id='altCustomSearchAndLoadForm'
              className='js-containers-SearchStyles-module-search'
              style={{
                display: !this.props.isSecondary ? 'none' : null,
                marginLeft: '3rem',
                width: this.props.isSecondary ? '30rem' : null
              }}
            >
              <p style={{ color: '#ffffff', marginBottom: '1rem', marginTop: '1rem' }}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.search_by_ear_tag_range`,
                  defaultMessage: `${config.labelBasePath}.main.search_by_ear_tag_range`
                })}
              </p>
              {this.customInvItemSearchInputComponent()}
            </form>
          </React.Fragment>
        }
        {
          ['MOVEMENT_DOC'].includes(this.props.gridToDisplay) &&
          <form id='customMovementDocSearchAndLoadForm' className='js-containers-SearchStyles-module-search'>
            <label
              htmlFor='customMovementDocSearchAndLoadInputValue'
              style={{ color: '#ffffff', marginBottom: '1rem', marginTop: '1rem' }}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.search_by_animal_or_flock_id`,
                defaultMessage: `${config.labelBasePath}.main.search_by_animal_or_flock_id`
              })}
            </label>
            {this.customMovementDocSearchInputComponent()}
            <button
              className={style.button}
              onClick={(e) => {
                e.preventDefault()
                this.setState({ value: '', criteria: 'MOVEMENT_DOC_ID' })
                this.props.customSearch('GET_MOVEMENT_DOC_BY_ANIMAL_OR_FLOCK_ID', this.state.customMovementDocInputValue, this.state.movementDocCriteria)
                gaEventTracker(
                  'SEARCH',
                  `Clicked the custom search button in the ${this.props.gridToDisplay} screen`,
                  `RECORD_INFO | ${config.version} (${config.currentEnv})`
                )
              }}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.search`,
                defaultMessage: `${config.labelBasePath}.main.search`
              })}
            </button>
            <p
              id='searchAndLoadPetParagraph'
              className={`${style.searchPrompt}`}
            >
              {
                this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.select_movement_type`,
                  defaultMessage: `${config.labelBasePath}.main.select_movement_type`
                })
              }
            </p>
            <select
              id='searchAndLoadMovementDocSelect'
              value={this.state.movementDocCriteria}
              onChange={this.handleMovementDocCriteriaChange}
              className={`${style.dropdown} ${this.state.emptyCriteriaClassName}`}
              {...this.state.emptyCriteriaClassName && {
                'data-tip': this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.login.mandatory_login_empty`,
                    defaultMessage: `${config.labelBasePath}.login.mandatory_login_empty`
                  }
                )
              }}
              {...this.state.emptyCriteriaClassName && { 'data-for': 'SearchAndLoadTooltipemptyCriteriaClassName' }}
              {...this.state.emptyCriteriaClassName && { 'data-offset': "{'left': 45, 'top': 8}" }}
            >
              <option value='ANIMAL'>
                {
                  this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.animal`,
                    defaultMessage: `${config.labelBasePath}.main.animal`
                  })
                }
              </option>
              <option value='FLOCK'>
                {
                  this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.flock`,
                    defaultMessage: `${config.labelBasePath}.main.flock`
                  })
                }
              </option>
            </select>
          </form>
        }
      </div>
    )
  }
}

SearchAndLoadGrid.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  HOLDINGPIC: state.formToGridAfterSaveReducer.HOLDINGPIC,
  HOLDING_RESPONSIBLE_REG_NUM: state.formToGridAfterSaveReducer.HOLDING_RESPONSIBLE_REG_NUM,
  PET_PKID: state.formToGridAfterSaveReducer.PET_PKID,
  STRAY_PET_ID: state.formToGridAfterSaveReducer.STRAY_PET_ID,
  QUARANTINE_ID: state.formToGridAfterSaveReducer.QUARANTINE_ID,
  POPULATION_ID: state.formToGridAfterSaveReducer.POPULATION_ID,
  LAB_SAMPLE_ID: state.formToGridAfterSaveReducer.LAB_SAMPLE_ID,
  LAB_TEST_TYPE_PKID: state.formToGridAfterSaveReducer.LAB_TEST_TYPE_PKID,
  selectedGridRows: state.selectedGridRows.gridId,
  noResults: state.searchAndLoad.noResults,
  aFilterHasBeenUsed: state.searchAndLoad.aFilterHasBeenUsed,
  userIsLinkedToOneHolding: state.linkedHolding.userIsLinkedToOneHolding,
  userIsLinkedToTwoOrMoreHoldings: state.linkedHolding.userIsLinkedToTwoOrMoreHoldings
})

const mapDispatchToProps = dispatch => ({
  formToGridResetAction: (table) => {
    dispatch(formToGridResetAction(table))
  },
  getSearchableDropdownForGridSearch: (session, table, field, callback) => {
    dispatch(getSearchableDropdownForGridSearch(session, table, field, callback))
  }
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchAndLoadGrid)
)
