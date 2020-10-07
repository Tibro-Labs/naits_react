import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { store, updateSelectedRows, removeAsyncReducer, dataToRedux } from 'tibro-redux'
import { MainContent, RecordInfo } from 'components/ComponentsIndex'
import SearchAndLoadGrid from 'containers/SearchAndLoadGrid'
import createHashHistory from 'history/createHashHistory'
import sideMenuStyle from 'modulesCSS/SideMenu.module.css'
import style from 'containers/MainNavigation.module.css'

const hashHistory = createHashHistory()

class ExportCertificate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeItem: null,
      displayGrid: 'EXPORT_CERT',
      alert: null,
      parentId: null,
      enableEditForm: false,
      searchValue: undefined,
      searchCriteria: undefined,
      renderGrid: false,
      enableNextMenu: true
    }
    this.gridConfig = {
      SIZE: {
        HEIGHT: window.innerHeight - 300,
        WIDTH: '100%'
      }
    }
  }

  waitForSearch = (callbackSearchData) => {
    removeAsyncReducer(store, this.state.displayGrid)
    dataToRedux(null, 'componentIndex', this.state.displayGrid, '')
    localStorage.removeItem(`reduxPersist:${this.state.displayGrid}`)
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
  onRowSelect = () => {
    if (this.state.enableNextMenu) {
      let gridId
      if (this.props.lastSelectedRow.length > 0) {
        for (let i = 0; i < this.props.lastSelectedRow.length; i++) {
          if (this.props.lastSelectedRow[i].active) {
            gridId = this.props.lastSelectedRow[i].gridId
          }
        }
      } if (gridId === 'EXPORT_CERT') {
        hashHistory.push('/main/export_cert')
      }
    }
  }
  componentWillUnmount () {
    store.dispatch(updateSelectedRows([], null))
    localStorage.removeItem(`reduxPersist:${this.props.gridToDisplay}`)
  }
  generateGrid (activeItem, objectType, enableNextMenu) {
    if (this.state.displayGrid !== objectType) {
      store.dispatch(updateSelectedRows([], null))
    }
    this.setState({
      activeItem: activeItem,
      displayGrid: objectType,
      form: null,
      newForm: null,
      isVisible: true,
      enableNextMenu: enableNextMenu
    })
  }

  render () {
    return (
      <div>
        <div id='consoleSideMenu' className={sideMenuStyle.sideDiv}>
          <div id='exportCertificateSearchMenu' className={sideMenuStyle.ul_item} >
            {/* No config is sent to RecordInfo here so as not to display previously cliked rows */}
            <RecordInfo menuType={this.state.displayGrid} />
            <SearchAndLoadGrid
              gridToDisplay={this.state.displayGrid}
              customSearch={this.props.customSearch}
              waitForSearch={this.waitForSearch}
              showAll={this.showAll}
              showEmpty={this.showEmpty}
            />

          </div>
        </div>
        <div id='displayAllRecords' className='displayContent'>
          <span className={style.imgGeorgia}> <img src='img/georgia_coat_of_arms.png' /></span>
          {this.state.renderGrid && <MainContent
            enableMultiSelect
            gridToDisplay={this.state.displayGrid}
            gridConfig={this.gridConfig}
            onRowSelectProp={this.onRowSelect}
            parentId={this.state.parentId}
            filterBy={this.state.searchCriteria}
            filterVals={this.state.searchValue}
            gridType='LIKE'
            filterType={100000}
          />
          }
        </div>
      </div>
    )
  }
}

ExportCertificate.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  lastSelectedRow: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(ExportCertificate)
