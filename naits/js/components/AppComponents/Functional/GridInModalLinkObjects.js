import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import { GridManager, ComponentManager, alertUser } from 'tibro-components'
import { store, removeAsyncReducer, dataToRedux } from 'tibro-redux'
import { Loading, ResultsGrid } from 'components/ComponentsIndex'
import style from './GridInModalLinkObjects.module.css'
import { menuConfig } from 'config/menuConfig.js'
import * as config from 'config/config'
import SearchAndLoadGrid from 'containers/SearchAndLoadGrid'
import { linkObjectsAction } from 'backend/linkObjectsAction'
import { strcmp } from 'functions/utils'

class GridInModalLinkObjects extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modalIsOpen: false,
      alert: undefined,
      renderGrid: false,
      renderCustomGrid: false,
      renderHoldingGrid: false,
      renderSheltersGrid: false,
      renderItemByRangeActionHoldingGrid: false,
      generateQuarantineDiseaseGrid: false,
      searchValue: undefined,
      searchCriteria: undefined,
      altValue: undefined,
      altCriteria: undefined,
      gridToDisplay: undefined,
      rangeFrom: '',
      rangeTo: '',
      additionalParam: undefined
    }
  }

  componentDidMount () {
    this.openModal()

    if (this.props.loadFromParent) {
      this.setState({ gridToDisplay: this.props.linkedTable })
    } else {
      if (this.props.linkName === 'DISEASE_QUARANTINE') {
        this.setState({ generateQuarantineDiseaseGrid: true, gridToDisplay: 'DISEASE', gridTypeCall: 'BASE_DATA_SECONDARY' })
      } else {
        this.loadGridModalFromConfig()
      }
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
    if (this.state.gridToDisplay !== 'INVENTORY_ITEM') {
      ComponentManager.cleanComponentReducerState(`${this.state.gridToDisplay}`)
    }
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
    this.setState({ renderGrid: false, renderCustomGrid: false, renderHoldingGrid: false },
      () => this.setState({ renderGrid: true, renderCustomGrid: false, renderHoldingGrid: false })
    )
    )
  }

  customWaitForSearch = callbackSearchData => {
    removeAsyncReducer(store, this.state.gridToDisplay)
    dataToRedux(null, 'componentIndex', this.state.gridToDisplay, '')
    localStorage.removeItem(`reduxPersist:${this.state.gridToDisplay}`)
    this.setState({
      searchValue: callbackSearchData.value,
      searchCriteria: callbackSearchData.criteria
    },
    this.setState({ renderHoldingGrid: false, renderGrid: false, renderCustomGrid: false },
      () => this.setState({ renderHoldingGrid: true, renderGrid: false, renderCustomGrid: false })
    )
    )
  }

  generateHoldingGrid = (state, props) => {
    const gridTypeCall = 'GET_TABLE_WITH_MULTIPLE_FILTERS'
    const gridParams = []

    gridParams.push({
      PARAM_NAME: 'table_name',
      PARAM_VALUE: state.gridToDisplay
    }, {
      PARAM_NAME: 'gridConfigWeWant',
      PARAM_VALUE: state.gridToDisplay
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: props.session
    }, {
      PARAM_NAME: 'fieldNames',
      PARAM_VALUE: state.searchCriteria
    }, {
      PARAM_NAME: 'fieldValues',
      PARAM_VALUE: state.searchValue
    }, {
      PARAM_NAME: 'criterumConjuction',
      PARAM_VALUE: 'AND'
    }, {
      PARAM_NAME: 'no_rec',
      PARAM_VALUE: 10000
    })

    let onRowSelect = this.onRowSelect
    if (this.props.onRowSelect && this.props.onRowSelect instanceof Function) {
      onRowSelect = () => {
        this.props.onRowSelect()
        this.closeModal()
      }
    }

    return GridManager.generateExportableGrid(
      state.gridToDisplay, state.gridToDisplay, 'CUSTOM_GRID',
      gridTypeCall, gridParams, 'CUSTOM', onRowSelect, this.props.insertNewRow,
      this.props.enableMultiSelect, this.props.onSelectChangeFunct
    )
  }

  customInvItemSearch = (rangeFrom, rangeTo, searchCriteria, searchValue) => {
    store.dispatch({ type: 'RESET_SEARCH' })
    removeAsyncReducer(store, this.state.gridToDisplay)
    dataToRedux(null, 'componentIndex', this.state.gridToDisplay, '')
    localStorage.removeItem(`reduxPersist:${this.state.gridToDisplay}`)
    this.setState({ rangeFrom, rangeTo, searchCriteria, searchValue },
      this.setState({ renderCustomGrid: false, renderGrid: false },
        () => this.setState({ renderCustomGrid: true, renderGrid: false })
      )
    )
  }

  customShelterSearch = callbackSearchData => {
    removeAsyncReducer(store, this.state.gridToDisplay)
    dataToRedux(null, 'componentIndex', this.state.gridToDisplay, '')
    localStorage.removeItem(`reduxPersist:${this.state.gridToDisplay}`)
    this.setState({
      searchValue: callbackSearchData.value,
      searchCriteria: callbackSearchData.criteria,
      additionalParam: callbackSearchData.additionalParam
    },
    this.setState({ renderSheltersGrid: false, renderHoldingGrid: false, renderGrid: false, renderCustomGrid: false },
      () => this.setState({ renderSheltersGrid: true, renderHoldingGrid: false, renderGrid: false, renderCustomGrid: false })
    )
    )
  }

  customItemByRangeActionHoldingSearch = callbackSearchData => {
    removeAsyncReducer(store, this.state.gridToDisplay)
    dataToRedux(null, 'componentIndex', this.state.gridToDisplay, '')
    localStorage.removeItem(`reduxPersist:${this.state.gridToDisplay}`)
    this.setState({
      searchValue: callbackSearchData.value,
      searchCriteria: callbackSearchData.criteria,
      additionalParam: callbackSearchData.additionalParam
    },
    this.setState({ renderSheltersGrid: false, renderHoldingGrid: false, renderGrid: false, renderCustomGrid: false, renderItemByRangeActionHoldingGrid: false },
      () => this.setState({ renderItemByRangeActionHoldingGrid: true, renderSheltersGrid: false, renderHoldingGrid: false, renderGrid: false, renderCustomGrid: false })
    )
    )
  }

  customItemByRangeActionHoldingGrid = (state, props) => {
    const gridTypeCall = 'GET_TABLE_WITH_MULTIPLE_FILTERS'
    const gridParams = []

    gridParams.push({
      PARAM_NAME: 'table_name',
      PARAM_VALUE: state.gridToDisplay
    }, {
      PARAM_NAME: 'gridConfigWeWant',
      PARAM_VALUE: state.gridToDisplay
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: props.session
    }, {
      PARAM_NAME: 'fieldNames',
      PARAM_VALUE: state.searchCriteria
    }, {
      PARAM_NAME: 'fieldValues',
      PARAM_VALUE: state.searchValue
    }, {
      PARAM_NAME: 'criterumConjuction',
      PARAM_VALUE: 'AND'
    }, {
      PARAM_NAME: 'no_rec',
      PARAM_VALUE: state.additionalParam
    })

    let onRowSelect = this.onRowSelect
    if (this.props.onRowSelect && this.props.onRowSelect instanceof Function) {
      onRowSelect = () => {
        this.props.onRowSelect()
        if (!this.props.isFromMoveSelectedItemsAction) {
          this.closeModal()
        }
      }
    }

    return GridManager.generateExportableGrid(
      state.gridToDisplay, state.gridToDisplay, 'CUSTOM_GRID',
      gridTypeCall, gridParams, 'CUSTOM', onRowSelect, this.props.insertNewRow,
      this.props.enableMultiSelect, this.props.onSelectChangeFunct
    )
  }

  generateSheltersGrid = (state, props) => {
    const gridTypeCall = 'GET_TABLE_WITH_MULTIPLE_FILTERS'
    const gridParams = []

    gridParams.push({
      PARAM_NAME: 'table_name',
      PARAM_VALUE: state.gridToDisplay
    }, {
      PARAM_NAME: 'gridConfigWeWant',
      PARAM_VALUE: state.gridToDisplay
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: props.session
    }, {
      PARAM_NAME: 'fieldNames',
      PARAM_VALUE: state.searchCriteria
    }, {
      PARAM_NAME: 'fieldValues',
      PARAM_VALUE: state.searchValue
    }, {
      PARAM_NAME: 'criterumConjuction',
      PARAM_VALUE: 'AND'
    }, {
      PARAM_NAME: 'no_rec',
      PARAM_VALUE: state.additionalParam
    })

    let onRowSelect = this.onRowSelect
    if (this.props.onRowSelect && this.props.onRowSelect instanceof Function) {
      onRowSelect = () => {
        this.props.onRowSelect()
        this.closeModal()
      }
    }

    return GridManager.generateExportableGrid(
      state.gridToDisplay, state.gridToDisplay, 'CUSTOM_GRID',
      gridTypeCall, gridParams, 'CUSTOM', onRowSelect, this.props.insertNewRow,
      this.props.enableMultiSelect, this.props.onSelectChangeFunct
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
    if (this.props.linkName === 'DISEASE_QUARANTINE') {
      const objectId = store.getState()[this.state.gridToDisplay].rowClicked[`${this.state.gridToDisplay}.OBJECT_ID`]
      const actionArguments = {
        objectId1: this.props.objectId1,
        tableName1: this.props.linkedTable,
        objectId2: objectId,
        tableName2: this.state.gridToDisplay,
        linkName: this.props.linkName,
        callback: this.alert,
        parrentGridId: this.props.gridId
      }
      store.dispatch(linkObjectsAction(actionArguments))
    } else {
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
            if (strcmp(type, 'success')) {
              GridManager.reloadGridData(parrentGridId)
              this.closeModal()
            } else {
              this.setState({ alert: alertUser(false, 'info', '') })
            }
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
      gridParams.push({
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
      })
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
        if (this.props.isFromRfidModule) {
          return true
        }
        if (this.props.isFromPetDirectMovement) {
          return true
        }
        if (this.props.isFromHerdLabSample) {
          return
        }
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
    let tagType = 'null'
    let order = 'null'
    const gridParams = []

    if (state.searchValue) {
      if (strcmp(state.searchCriteria, 'ORDER_NUMBER')) {
        order = state.searchValue
      } else if (strcmp(state.searchCriteria, 'TAG_TYPE')) {
        tagType = state.searchValue
      }
    }

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
    }, {
      PARAM_NAME: 'tagType',
      PARAM_VALUE: tagType
    }, {
      PARAM_NAME: 'order',
      PARAM_VALUE: order
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

  displayQuarantineDiseaseGrid = () => {
    const quarantineDiseaseGrid = (
      <ResultsGrid
        id={this.state.gridToDisplay}
        key={this.state.gridToDisplay}
        gridToDisplay={this.state.gridToDisplay}
        onRowSelectProp={this.onRowSelect}
        gridTypeCall={this.state.gridTypeCall}
      />
    )
    const quarantineDiseaseGridModal = (
      <Modal
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
        {quarantineDiseaseGrid}
        <div
          onClick={this.closeModal}
          className={style.close}
        />
      </Modal>
    )

    return quarantineDiseaseGridModal
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
            customWaitForSearch={this.customWaitForSearch}
            customInvItemSearch={this.customInvItemSearch}
            customShelterSearch={this.customShelterSearch}
            population={this.props.population}
            isFromPetMovement={this.props.isFromPetMovement}
            isFromMoveItemsByRangeAction={this.props.isFromMoveItemsByRangeAction}
            customItemByRangeActionHoldingSearch={this.customItemByRangeActionHoldingSearch}
            additionalParamForMoveItemsByRangeActionHoldingSearch={this.props.externalId}
            isSecondary
          />
        </div>
      }
      {this.state.renderGrid && this.generateGrid(this.state, this.props)}
      {this.state.renderHoldingGrid && this.generateHoldingGrid(this.state, this.props)}
      {this.state.renderCustomGrid && this.generateCustomGrid(this.state, this.props)}
      {this.state.renderSheltersGrid && this.generateSheltersGrid(this.state, this.props)}
      {this.state.renderItemByRangeActionHoldingGrid && this.customItemByRangeActionHoldingGrid(this.state, this.props)}
      {!noModal && <div
        onClick={this.closeModal}
        className={style.close}
      />}
      {this.state.alert}
      {this.props.isLoading && <Loading />}
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
    } else if (this.state.generateQuarantineDiseaseGrid) {
      component = this.displayQuarantineDiseaseGrid()
    }
    return component
  }
}

GridInModalLinkObjects.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  isLoading: state.linkedObjects.isLoading
})

export default connect(mapStateToProps)(GridInModalLinkObjects)
