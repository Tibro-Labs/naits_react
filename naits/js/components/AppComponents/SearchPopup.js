import React from 'react'
import PropTypes from 'prop-types'
import { store, removeAsyncReducer, dataToRedux } from 'tibro-redux'
import { MainContent } from 'components/ComponentsIndex'
import { menuConfig } from 'config/menuConfig'
import SearchAndLoadGrid from 'containers/SearchAndLoadGrid'
import popupStyle from './SearchPopup.module.css'

export default class SearchPopup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      toggleCustomButton: false,
      formFieldsToBeEcluded: [],
      renderGrid: false,
      searchValue: undefined,
      searchCriteria: undefined,
      altSearchCriteria: undefined,
      altSearchValue: undefined,
      alert: null
    }
    this.searchGridId = `${this.props.gridToDisplay}_SEARCH`
  }

  componentWillUnmount () {
    localStorage.removeItem(`reduxPersist:${this.searchGridId}`)
  }

  // Get search value and criteria from search input
  waitForSearch = (callbackSearchData) => {
    // Following two lines reset redux state since our spaggeti code is the best
    removeAsyncReducer(store, this.searchGridId)
    dataToRedux(null, 'componentIndex', this.searchGridId, '')
    localStorage.removeItem(`reduxPersist:${this.searchGridId}`)
    this.setState({
      searchValue: callbackSearchData.value,
      searchCriteria: callbackSearchData.criteria,
      altSearchCriteria: callbackSearchData.altCriteria,
      altSearchValue: callbackSearchData.altValue
    },
    this.setState({ renderGrid: false },
      () => this.setState({ renderGrid: true }))
    )
  }
  // Show all data in grid
  showAll = () => {
    this.setState({ renderGrid: true, searchValue: undefined, searchCriteria: undefined })
    // Following two lines reset redux state since our spaggeti code is the best
    removeAsyncReducer(store, this.searchGridId)
    dataToRedux(null, 'componentIndex', this.searchGridId, '')
  }

  // Show empty grid
  showEmpty = (callbackSearchData) => {
    // Following two lines reset redux state since our spaggeti code is the best
    removeAsyncReducer(store, this.searchGridId)
    dataToRedux(null, 'componentIndex', this.searchGridId, '')
    localStorage.removeItem(`reduxPersist:${this.searchGridId}`)
    if (callbackSearchData && callbackSearchData.value) {
      this.setState({ searchValue: callbackSearchData.value, searchCriteria: callbackSearchData.criteria },
        this.setState({ renderGrid: true })
      )
    }
  }

  render () {
    const gridConfig = menuConfig('GRID_CONFIG', this.context.intl)
    const gridToDisplay = this.props.gridToDisplay
    return (
      <div>
        {this.state.alert}
        {this.searchGridId &&
          <div className={popupStyle.main} >
            <SearchAndLoadGrid
              gridToDisplay={gridToDisplay}
              showAll={this.showAll}
              waitForSearch={this.waitForSearch}
              showEmpty={this.showEmpty}
              customSearch={this.props.customSearch}
              searchFromPopup
            />
            <div style={{ float: 'none', display: 'inline-flex' }}>
              {this.props.datePicker || null}
              {this.props.dateFields || null}
              {this.props.CustomForm && <this.props.CustomForm style={popupStyle} />}
            </div>
            {/* Component where all the selected menu items will be displayed KNI 28.03.2017 */}
            <div id='displayContent' className='displayContent'>
              {this.state.renderGrid && <MainContent
                toggleCustomButton={this.state.toggleCustomButton}
                formFieldsToBeEcluded={this.state.formFieldsToBeEcluded}
                id={this.searchGridId}
                key={this.searchGridId}
                gridToDisplay={gridToDisplay}
                filterBy={this.state.searchCriteria}
                filterVals={this.state.searchValue}
                altFilterBy={this.state.altSearchCriteria}
                altFilterVals={this.state.altSearchValue}
                gridType='LIKE'
                filterType={100000}
                gridConfig={gridConfig}
                dontMakeSelection
                onRowSelectProp={this.props.onRowSelect}
                searchFromPopup
              />}
            </div>
          </div>
        }
      </div>
    )
  }
}

SearchPopup.contextTypes = {
  intl: PropTypes.object.isRequired
}
