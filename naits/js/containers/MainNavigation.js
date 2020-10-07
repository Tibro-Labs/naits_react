import React from 'react'
import { connect } from 'react-redux'
import { store, removeAsyncReducer, dataToRedux } from 'tibro-redux'
import { RecordInfo, MainContent } from 'components/ComponentsIndex'
import createHashHistory from 'history/createHashHistory'
import recordConfig from 'config/recordConfig'
import { menuConfig } from 'config/menuConfig'
import { sideMenuConfig } from 'config/sideMenuConfig'
import SearchAndLoadGrid from './SearchAndLoadGrid'
import FilterByObjectType from './FilterByObjectType'
import style from './MainNavigation.module.css'
import * as utils from 'functions/utils'
import AssignSampleToLab from 'components/AppComponents/ExecuteActions/AssignSampleToLab'

class MainNavigation extends React.Component {
  constructor (props) {
    super(props)
    const currentPath = this.props.location.pathname
    this.state = {
      navigateTo: currentPath.substr(currentPath.lastIndexOf('/') + 1),
      toggleCustomButton: false,
      formFieldsToBeEcluded: [],
      renderGrid: false,
      searchValue: undefined,
      searchCriteria: undefined,
      altSearchCriteria: undefined,
      altSearchValue: undefined,
      subModuleComponents: [],
      methodType: 'GET_BYPARENTID', // default grid type data call
      gridType: 'LIKE',
      customValue: null,
      searchByObjectType: null
    }
    this.hashHistory = createHashHistory()
  }

  componentWillUnmount () {
    localStorage.removeItem(`reduxPersist:${this.props.gridToDisplay}`)
  }

  componentDidMount () {
    if (store.getState().gridConfig.gridHierarchy.length > 0) utils.selectObject('resetState')

    let toggleCustomButton = false
    let formFieldsToBeEcluded
    menuConfig('SIMPLE_FORM_EXCLUDE').LIST_OF_ITEMS.map((element) => {
      if (this.state.navigateTo.match(element.TABLE.toLowerCase())) {
        toggleCustomButton = true
        formFieldsToBeEcluded = element.EXCLUDED_FIELDS
      }
    })
    this.setState({ toggleCustomButton, formFieldsToBeEcluded })
  }

  // Generate submodules depending on core object configuration
  genSubModules = () => {
    let components = []
    const { gridToDisplay } = this.props
    const configedMenu = sideMenuConfig('SIDE_MENU_' + gridToDisplay, this.context.intl)
    const subModules = configedMenu.SUB_MODULES
    if (utils.isValidObject(subModules, 1) && gridToDisplay === 'HOLDING') {
      for (const property in subModules) {
        if (subModules.hasOwnProperty(property)) {
          components.push(
            <FilterByObjectType
              key={subModules[property].ID}
              subObjectId={subModules[property].ID}
              subObjectType={subModules[property].TYPE}
              mainObjectType={gridToDisplay}
              showFilteredData={this.showFilteredData}
            />
          )
        }
      }
    }
    return components
  }

  transitionToDataScreen = path => () => {
    this.hashHistory.push(`/main/data/${path}`)
  }

  // Get search value and criteria from search input
  waitForSearch = (callbackSearchData) => {
    let methodType = 'GET_BYPARENTID'
    let gridType = 'LIKE'
    if (utils.strcmp(callbackSearchData.criteria, 'BAR_CODE_ID')) {
      methodType = 'SEARCH_ANIMAL_BY_BAR_CODE'
      gridType = 'CUSTOM'
    } else if (utils.strcmp(callbackSearchData.criteria, 'OLD_EAR_TAG')) {
      methodType = 'SEARCH_ANIMAL_BY_OLD_EAR_TAG'
      gridType = 'CUSTOM'
    }
    if (callbackSearchData.filterType === 'EQUAL') {
      // use EQUAL filter for codelists
      methodType = 'GET_TABLE_WITH_MULTIPLE_FILTERS'
      gridType = 'EQUAL'
    }
    // Following two lines reset redux state
    removeAsyncReducer(store, this.props.gridToDisplay)
    dataToRedux(null, 'componentIndex', this.props.gridToDisplay, '')
    localStorage.removeItem(`reduxPersist:${this.props.gridToDisplay}`)
    this.setState({
      searchValue: callbackSearchData.value,
      searchCriteria: callbackSearchData.criteria,
      altSearchCriteria: callbackSearchData.altCriteria,
      altSearchValue: callbackSearchData.altValue
    },
    this.setState({ renderGrid: false },
      () => this.setState({ methodType: methodType, gridType: gridType, renderGrid: true, customValue: null }))
    )
  }
  // Show all data in grid
  showAll = () => {
    this.setState({ renderGrid: true, searchValue: undefined, searchCriteria: undefined, customValue: null })
    // Following two lines reset redux state
    removeAsyncReducer(store, this.props.gridToDisplay)
    dataToRedux(null, 'componentIndex', this.props.gridToDisplay, '')
  }

  // Generate filtered grid
  showFilteredData = (filterCriteria, filterValue) => {
    removeAsyncReducer(store, this.props.gridToDisplay)
    dataToRedux(null, 'componentIndex', this.props.gridToDisplay, '')
    this.setState({
      renderGrid: true,
      searchCriteria: filterCriteria,
      searchValue: filterValue,
      customValue: null
    })
  }

  // Show empty grid
  showEmpty = (callbackSearchData) => {
    // Following two lines reset redux state
    removeAsyncReducer(store, this.props.gridToDisplay)
    dataToRedux(null, 'componentIndex', this.props.gridToDisplay, '')
    localStorage.removeItem(`reduxPersist:${this.props.gridToDisplay}`)
    if (callbackSearchData && callbackSearchData.value) {
      this.setState({ searchValue: callbackSearchData.value, searchCriteria: callbackSearchData.criteria },
        this.setState({ renderGrid: true, customValue: null })
      )
    }
  }

  customSearch = (methodType, value, searchByObjectType) => {
    store.dispatch({ type: 'RESET_SEARCH' })
    if (methodType === 'GET_MOVEMENT_DOC_BY_ANIMAL_OR_FLOCK_ID') {
      if (value) {
        removeAsyncReducer(store, this.props.gridToDisplay)
        dataToRedux(null, 'componentIndex', this.props.gridToDisplay, '')
        this.setState({ renderGrid: false }, () =>
          this.setState({
            renderGrid: true,
            searchCriteria: undefined,
            searchValue: undefined,
            methodType: methodType,
            customValue: value,
            searchByObjectType: this.props.movementDocCriteria
          })
        )
      }
    } else {
      if (methodType && value) {
        removeAsyncReducer(store, this.props.gridToDisplay)
        dataToRedux(null, 'componentIndex', this.props.gridToDisplay, '')
        this.setState({ renderGrid: false }, () =>
          this.setState({
            renderGrid: true,
            searchCriteria: undefined,
            searchValue: undefined,
            methodType: methodType,
            customValue: value,
            searchByObjectType: searchByObjectType
          })
        )
      } else if (!methodType && value && searchByObjectType) {
        let methodType = 'SEARCH_BY_OWNER_OR_PASSPORT_ID'
        removeAsyncReducer(store, this.props.gridToDisplay)
        dataToRedux(null, 'componentIndex', this.props.gridToDisplay, '')
        this.setState({ renderGrid: false }, () =>
          this.setState({
            renderGrid: true,
            searchCriteria: undefined,
            searchValue: undefined,
            methodType: methodType,
            customValue: value,
            searchByObjectType: this.props.petCriteria
          })
        )
      }
    }
  }

  render () {
    const { gridToDisplay, parentId, className } = this.props
    const gridConfig = menuConfig('GRID_CONFIG', this.context.intl)
    return (
      <div className={className}>
        {gridToDisplay &&
          <div style={{ height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'row' }} >
            <div id='sideDiv' className='sideDiv'>
              <RecordInfo configuration={recordConfig} menuType={gridToDisplay} />
              <SearchAndLoadGrid
                gridToDisplay={gridToDisplay}
                showAll={this.showAll}
                waitForSearch={this.waitForSearch}
                showEmpty={this.showEmpty}
                customSearch={this.customSearch}
              />
              {this.state.subModuleComponents}
            </div>
            {/* Component where all the selected menu items will be displayed KNI 28.03.2017 */}
            <div id='displayContent' className='displayContent'>
              <span className={style.imgGeorgia}> <img src='img/georgia_coat_of_arms.png' /></span>
              {gridToDisplay.includes('LAB_SAMPLE') &&
                <AssignSampleToLab gridType={gridToDisplay} />
              }
              {this.state.renderGrid && <MainContent
                methodType={this.state.methodType}
                toggleCustomButton={this.state.toggleCustomButton}
                formFieldsToBeEcluded={this.state.formFieldsToBeEcluded}
                key={gridToDisplay + this.state.searchCriteria + this.state.searchValue}
                gridToDisplay={gridToDisplay}
                filterBy={this.state.searchCriteria}
                filterVals={this.state.searchValue}
                altFilterBy={this.state.altSearchCriteria}
                altFilterVals={this.state.altSearchValue}
                gridType={this.state.gridType}
                filterType={100000}
                enableMultiSelect
                onSelectChangeFunct={utils.onGridSelectionChange}
                parentId={parentId}
                gridConfig={gridConfig}
                onRowSelectProp={this.transitionToDataScreen(this.state.navigateTo)}
                customValue={this.state.customValue}
                searchByObjectType={this.state.searchByObjectType}
                petCustomSearchCriteria={this.props.petCriteria}
                movementDocCustomSearchCriteria={this.props.movementDocCriteria}
              />}
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  petCriteria: state.customSearchCriteria.petCriteria,
  movementDocCriteria: state.customSearchCriteria.movementDocCriteria
})

export default connect(mapStateToProps)(MainNavigation)
