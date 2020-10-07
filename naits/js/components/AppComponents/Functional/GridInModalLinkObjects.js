import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import { GridManager, ComponentManager, alertUser } from 'tibro-components'
import { store, removeAsyncReducer, dataToRedux } from 'tibro-redux'
import style from './GridInModalLinkObjects.module.css'
import { menuConfig } from 'config/menuConfig.js'
import * as config from 'config/config'
import SearchAndLoadGrid from 'containers/SearchAndLoadGrid'
import { linkObjectsAction } from 'backend/linkObjectsAction'

class GridInModalLinkObjects extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modalIsOpen: false,
      alert: undefined,
      renderGrid: false,
      renderCustomGrid: false,
      searchValue: undefined,
      searchCriteria: undefined,
      altValue: undefined,
      altCriteria: undefined,
      gridToDisplay: undefined,
      rangeFrom: '',
      rangeTo: ''
    }
  }

  componentDidMount () {
    this.openModal()

    if (this.props.loadFromParent) {
      this.setState({ gridToDisplay: this.props.linkedTable })
    } else {
      this.loadGridModalFromConfig()
    }
  }

  componentDidUpdate () {
    if (this.state.gridToDisplay === 'PET') {
      const petSearchForm = document.getElementById('searchAndLoadForm')
      const petCustomSearchForm = document.getElementById('customPetSearchAndLoadForm')
      if (petCustomSearchForm) {
        petCustomSearchForm.style.display = 'none'
        petSearchForm.style.marginBottom = '1.5rem'
      }
    }
  }

  loadGridModalFromConfig = () => {
    if (menuConfig('SHOW_GRIDMODAL_TO_LINK_TO_TABLE')) {
      menuConfig('SHOW_GRIDMODAL_TO_LINK_TO_TABLE').map(
        element => {
          if (element.TABLE === this.props.linkedTable) {
            if (element.LINKS) {
              element.LINKS.map(
                linksElement => {
                  if (linksElement === this.props.linkName) {
                    this.setState({ gridToDisplay: element.LINKEDTABLE })
                  }
                }
              )
            }
          }
        }
      )
    }
  }

  openModal = () => {
    this.setState({ modalIsOpen: true })
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
    if (this.props.closeModal && this.props.closeModal instanceof Function) {
      this.props.closeModal()
    }
    ComponentManager.cleanComponentReducerState(`${this.state.gridToDisplay}`)
  }

  // Get search value and criteria from search input
  waitForSearch = (callbackSearchData) => {
    // Following two lines reset redux state since our spaggeti code is the best
    removeAsyncReducer(store, this.state.gridToDisplay)
    dataToRedux(null, 'componentIndex', this.state.gridToDisplay, '')
    localStorage.removeItem(`reduxPersist:${this.state.gridToDisplay}`)
    this.setState({
      searchValue: callbackSearchData.value,
      searchCriteria: callbackSearchData.criteria,
      altCriteria: callbackSearchData.altCriteria,
      altValue: callbackSearchData.altValue,
      rangeFrom: '',
      rangeTo: ''
    },
    this.setState({ renderGrid: false, renderCustomGrid: false },
      () => this.setState({ renderGrid: true, renderCustomGrid: false })
    )
    )
  }

  customInvItemSearch = (rangeFrom, rangeTo) => {
    store.dispatch({ type: 'RESET_SEARCH' })
    removeAsyncReducer(store, this.state.gridToDisplay)
    dataToRedux(null, 'componentIndex', this.state.gridToDisplay, '')
    localStorage.removeItem(`reduxPersist:${this.state.gridToDisplay}`)
    this.setState({ rangeFrom, rangeTo },
      this.setState({ renderCustomGrid: false, renderGrid: false },
        () => this.setState({ renderCustomGrid: true, renderGrid: false })
      )
    )
  }

  // Show empty grid
  showEmpty = (callbackSearchData) => {
    if (callbackSearchData && callbackSearchData.value && menuConfig('LOAD_EMPTY_INITIAL_GRID_FOR_TABLE') && menuConfig('LOAD_EMPTY_INITIAL_GRID_FOR_TABLE').LIST_OF_ITEMS) {
      menuConfig('LOAD_EMPTY_INITIAL_GRID_FOR_TABLE').LIST_OF_ITEMS.map(
        (element) => {
          if (element.TABLE === this.state.gridToDisplay) {
            const criteria = element.DUMMY_CRITERIA

            // Following two lines reset redux state since our spaggeti code is the best
            removeAsyncReducer(store, this.state.gridToDisplay)
            dataToRedux(null, 'componentIndex', this.state.gridToDisplay, '')
            localStorage.removeItem(`reduxPersist:${this.state.gridToDisplay}`)

            this.setState({
              searchValue: callbackSearchData.value,
              searchCriteria: criteria,
              altValue: callbackSearchData.altValue,
              altCriteria: callbackSearchData.altCriteria,
              renderGrid: true
            })
          }
        }
      )
    }
  }

  onRowSelect = (gridId, rowIdx, row) => {
    const actionArguments = {
      objectId1: this.props.objectId1,
      tableName1: this.props.linkedTable,
      objectId2: row[`${gridId}.OBJECT_ID`],
      tableName2: gridId,
      linkName: this.props.linkName,
      callback: this.alert,
      parrentGridId: this.props.gridId
    }
    store.dispatch(linkObjectsAction(actionArguments))
  }

  alert = (type, msg, parrentGridId) => {
    this.setState({
      alert: alertUser(
        true,
        type,
        this.context.intl.formatMessage({ id: msg, defaultMessage: msg }),
        '',
        () => this.setState(
          {
            alert: alertUser(false)
          },
          () => {
            GridManager.reloadGridData(parrentGridId)
            this.closeModal()
          }
        ),
        () => {
          GridManager.reloadGridData(parrentGridId)
          this.closeModal()
        }
      )
    })
  }

  generateGrid = (state, props) => {
    let gridTypeCall = this.props.gridTypeCall || 'GET_TABLE_WITH_LIKE_FILTER'
    const gridParams = []

    gridParams.push({
      PARAM_NAME: 'objectName',
      PARAM_VALUE: state.gridToDisplay
    }, {
      PARAM_NAME: 'gridConfigWeWant',
      PARAM_VALUE: state.gridToDisplay
    }, {
      PARAM_NAME: 'svSession',
      PARAM_VALUE: props.session
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: props.session
    }, {
      PARAM_NAME: 'searchForValue',
      PARAM_VALUE: state.searchValue || state.altValue
    }, {
      PARAM_NAME: 'rowlimit',
      PARAM_VALUE: 10000
    })
    // exclusive OR - if only one of the filters is present,
    // call the normal filtering function - by like
    if (state.searchValue && !state.altValue) {
      gridParams.push({
        PARAM_NAME: 'searchBy',
        PARAM_VALUE: state.searchCriteria
      })
    } else if (!state.searchValue && state.altValue) {
      gridParams.push({
        PARAM_NAME: 'searchBy',
        PARAM_VALUE: state.altCriteria
      })
    } else if (state.searchValue && state.altValue) {
      gridTypeCall = 'GET_TABLE_WITH_FILTER'
      gridParams.push(
        {
          PARAM_NAME: 'searchBy',
          PARAM_VALUE: state.searchCriteria
        }, {
          PARAM_NAME: 'parentColumn',
          PARAM_VALUE: state.altCriteria
        }, {
          PARAM_NAME: 'parentId',
          PARAM_VALUE: state.altValue
        }, {
          PARAM_NAME: 'criterumConjuction',
          PARAM_VALUE: 'AND'
        }
      )
    }

    if (props.searchFromComponentProps) {
      gridTypeCall = 'GET_TABLE_WITH_MULTIFILTER'
      gridParams.push({
        PARAM_NAME: 'fieldNames',
        PARAM_VALUE: `${state.searchCriteria},${props.altCriteria}`
      }, {
        PARAM_NAME: 'fieldValues',
        PARAM_VALUE: `${state.searchValue},${props.altValue}`
      }, {
        PARAM_NAME: 'criterumConjuction',
        PARAM_VALUE: 'AND'
      })
    }

    let onRowSelect = this.onRowSelect
    if (this.props.onRowSelect && this.props.onRowSelect instanceof Function) {
      onRowSelect = () => {
        this.props.onRowSelect()
        this.closeModal()
      }
    }

    return GridManager.generateExportableGrid(
      state.searchCriteria + state.searchValue + state.gridToDisplay, state.gridToDisplay, 'CUSTOM_GRID',
      gridTypeCall, gridParams, 'CUSTOM', onRowSelect, this.props.insertNewRow,
      this.props.enableMultiSelect, this.props.onSelectChangeFunct
    )
  }

  generateCustomGrid = (state, props) => {
    let gridTypeCall = 'GET_INVENTORY_ITEMS_BY_RANGE'
    const gridParams = []

    gridParams.push({
      PARAM_NAME: 'session',
      PARAM_VALUE: props.session
    }, {
      PARAM_NAME: 'gridConfigWeWant',
      PARAM_VALUE: state.gridToDisplay
    }, {
      PARAM_NAME: 'parentId',
      PARAM_VALUE: props.altValue
    }, {
      PARAM_NAME: 'rangeFrom',
      PARAM_VALUE: state.rangeFrom
    }, {
      PARAM_NAME: 'rangeTo',
      PARAM_VALUE: state.rangeTo
    })

    let onRowSelect = this.onRowSelect
    if (this.props.onRowSelect && this.props.onRowSelect instanceof Function) {
      onRowSelect = () => {
        this.props.onRowSelect()
        this.closeModal()
      }
    }

    return GridManager.generateExportableGrid(
      state.gridToDisplay + state.rangeFrom + state.rangeTo, state.gridToDisplay, 'CUSTOM_GRID',
      gridTypeCall, gridParams, 'CUSTOM', onRowSelect, this.props.insertNewRow,
      this.props.enableMultiSelect, this.props.onSelectChangeFunct
    )
  }

  render () {
    const noModal = this.props.noModal
    const core = <React.Fragment>
      <p
        className={style.paragraph}
        {...noModal && {
          style: {
            display: this.state.gridToDisplay === 'INVENTORY_ITEM' ? 'none' : null,
            width: '50rem',
            marginTop: '1.5rem'
          }
        }}
      >
        {
          this.context.intl.formatMessage(
            { id: `${config.labelBasePath}.select_search_criteria`, defaultMessage: `${config.labelBasePath}.select_search_criteria` })
        }
      </p>
      {this.state.gridToDisplay &&
        <div {...noModal && {
          style: {
            width: this.state.gridToDisplay === 'INVENTORY_ITEM' ? null : '50rem',
            display: this.state.gridToDisplay === 'INVENTORY_ITEM' ? 'flex' : null
          }
        }}>
          <SearchAndLoadGrid
            gridToDisplay={this.state.gridToDisplay}
            showEmpty={this.showEmpty}
            waitForSearch={this.waitForSearch}
            customInvItemSearch={this.customInvItemSearch}
            population={this.props.population}
            isSecondary
          />
        </div>
      }
      {this.state.renderGrid && this.generateGrid(this.state, this.props)}
      {this.state.renderCustomGrid && this.generateCustomGrid(this.state, this.props)}
      {!noModal && <div
        onClick={this.closeModal}
        className={style.close}
      />}
      {this.state.alert}
    </React.Fragment>

    const modal = <Modal
      ariaHideApp={false}
      isOpen={this.state.modalIsOpen}
      shouldCloseOnOverlayClick={false}
      className={{
        base: style.main,
        afterOpen: 'myClass_after-open',
        beforeClose: 'myClass_before-close'
      }}
      contentLabel='User Profile'
      overlayClassName={{
        base: style.overlay,
        afterOpen: 'myOverlayClass_after-open',
        beforeClose: 'myOverlayClass_before-close'
      }}
    >
      {core}
    </Modal>
    let component = modal
    if (noModal) {
      component = core
    }
    return component
  }
}

GridInModalLinkObjects.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(GridInModalLinkObjects)
