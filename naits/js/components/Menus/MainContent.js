import React from 'react'
import PropTypes from 'prop-types'
import { store } from 'tibro-redux'
import { Draggable } from 'tibro-components'
import createHashHistory from 'history/createHashHistory'
import {
  ComponentManager,
  FormManager,
  GridManager
} from 'components/ComponentsIndex'
import { disableAddRowConfig } from 'config/disableAddRowConfig.js'
import InputWrappers from 'containers/InputWrappers'
import { connect } from 'react-redux'
import { selectObject } from 'functions/utils'

const hashHistory = createHashHistory()

class MainContent extends React.Component {
  static propTypes = {
    gridToDisplay: PropTypes.string.isRequired
  }
  constructor (props) {
    super(props)
    this.state = {
      showPopup: false,
      popUpForm: undefined,
      renderGrid: undefined
    }
    this.generateGrid = this.generateGrid.bind(this)
    this.generateForm = this.generateForm.bind(this)
    this.insertNewRow = this.insertNewRow.bind(this)
    this.onRowSelect = this.onRowSelect.bind(this)
    this.closeWindow = this.closeWindow.bind(this)
    this.onAlertClose = this.onAlertClose.bind(this)
  }

  componentDidMount () {
    if (this.props) {
      this.generateGrid(this.props)
    }
  }

  componentWillReceiveProps (nextProps) {
    if ((this.props.gridToDisplay !== nextProps.gridToDisplay) || (nextProps.toggleCustomButton !== this.props.toggleCustomButton)) {
      this.generateGrid(nextProps)
    }
  }

  componentWillUnmount () {
    ComponentManager.cleanComponentReducerState(this.props.gridToDisplay)
  }

  generateGrid (props) {
    const gridToDisplay = props.gridToDisplay
    let toggleCustomButton = props.toggleCustomButton
    const filterBy = props.filterBy
    const enableMultiSelect = props.enableMultiSelect
    const insertRow = props.insertRow
    let insertNewRow = () => this.insertNewRow(gridId)
    const onSelectChangeFunct = props.onSelectChangeFunct
    const filterVals = props.filterVals
    const altFilterBy = props.altFilterBy
    const altFilterVals = props.altFilterVals
    const gridType = props.gridType
    const gridHeight = props.gridConfig ? (props.gridConfig.SIZE ? props.gridConfig.SIZE.HEIGHT : null) : null
    const gridWidth = props.gridConfig ? (props.gridConfig.SIZE ? props.gridConfig.SIZE.WIDTH : null) : null
    let gridTypeCall = props.methodType || 'GET_BYPARENTID'
    let gridId = gridToDisplay
    if (this.props.id) {
      gridId = this.props.id
    }

    if (gridToDisplay === 'LABORATORY') {
      if (!this.props.isAdmin) {
        insertNewRow = null
        this.customButton = null
        toggleCustomButton = false
      }
    }

    if (gridToDisplay === 'LAB_TEST_TYPE') {
      if (!this.props.isAdmin) {
        insertNewRow = null
        this.customButton = null
        toggleCustomButton = false
      } else if (this.props.isAdmin && !this.props.isFromAdmConsole) {
        insertNewRow = null
        this.customButton = null
        toggleCustomButton = false
      }
    }

    let renderGrid
    if (!filterBy && !filterVals) {
      disableAddRowConfig('DISABLE_ADD_ROW_FOR_TABLE_FIRST_LEVEL') &&
        disableAddRowConfig('DISABLE_ADD_ROW_FOR_TABLE_FIRST_LEVEL').LIST_OF_ITEMS.map((element) => {
          // Disable add button for some grids defined in disableAddRowConfig
          if (gridToDisplay === element.TABLE) {
            insertNewRow = null
            this.customButton = null
            toggleCustomButton = false
          }
        })
      if (insertRow) {
        insertNewRow = () => this.insertNewRow(gridId)
      }
      const gridParams = []

      if (gridToDisplay === 'PET' && props.customValue && props.petCustomSearchCriteria !== '') {
        gridTypeCall = props.methodType
        gridParams.push({
          PARAM_NAME: 'value',
          PARAM_VALUE: props.customValue
        }, {
          PARAM_NAME: 'objectType',
          PARAM_VALUE: props.petCustomSearchCriteria
        })
      }

      if (gridToDisplay === 'MOVEMENT_DOC' && props.customValue && props.movementDocCustomSearchCriteria !== '') {
        gridParams.push({
          PARAM_NAME: 'movementType',
          PARAM_VALUE: props.searchByObjectType
        })
      }

      if (gridToDisplay === 'INVENTORY_ITEM' && props.customValue && props.searchByObjectType) {
        gridParams.push({
          PARAM_NAME: 'rangeFrom',
          PARAM_VALUE: props.customValue
        }, {
          PARAM_NAME: 'rangeTo',
          PARAM_VALUE: props.searchByObjectType
        })
      }

      gridParams.push({
        PARAM_NAME: 'objectName',
        PARAM_VALUE: gridToDisplay
      }, {
        PARAM_NAME: 'gridConfigWeWant',
        PARAM_VALUE: gridToDisplay
      }, {
        PARAM_NAME: 'objectType',
        PARAM_VALUE: gridToDisplay
      }, {
        PARAM_NAME: 'session',
        PARAM_VALUE: this.props.session
      }, {
        PARAM_NAME: 'parentId',
        PARAM_VALUE: props.parentId || '0'
      }, {
        PARAM_NAME: 'rowlimit',
        PARAM_VALUE: 100000
      })

      if (props.customValue && this.props.gridToDisplay !== 'PET') {
        gridTypeCall = props.methodType
        gridParams.push({
          PARAM_NAME: 'value',
          PARAM_VALUE: props.customValue
        }, {
          PARAM_NAME: 'objectType',
          PARAM_VALUE: props.searchByObjectType
        })
      }

      // Added custom function for generating exportableGridWithCustomButtons f.r
      renderGrid = GridManager.generateExportableGridWithCustomBtn(
        gridToDisplay, gridToDisplay,
        'CUSTOM_GRID', gridTypeCall,
        gridParams, 'CUSTOM', this.onRowSelect,
        insertNewRow, enableMultiSelect,
        onSelectChangeFunct, gridHeight,
        gridWidth, toggleCustomButton, this.customButton
      )
    } else {
      if (props.id === 'HOLDING_SEARCH') {
        insertNewRow = null
        this.customButton = null
        toggleCustomButton = false
      }
      disableAddRowConfig('DISABLE_ADD_ROW_FOR_TABLE_FIRST_LEVEL') &&
        disableAddRowConfig('DISABLE_ADD_ROW_FOR_TABLE_FIRST_LEVEL').LIST_OF_ITEMS.map((element) => {
          // Disable add button for some grids defined in disableAddRowConfig
          if (gridToDisplay === element.TABLE) {
            insertNewRow = null
            this.customButton = null
            toggleCustomButton = false
          }
        })
      let gridParams = []
      gridParams.push({
        PARAM_NAME: 'objectName',
        PARAM_VALUE: gridToDisplay
      }, {
        PARAM_NAME: 'gridConfigWeWant',
        PARAM_VALUE: gridToDisplay
      }, {
        PARAM_NAME: 'svSession',
        PARAM_VALUE: this.props.session
      }, {
        PARAM_NAME: 'searchForValue',
        PARAM_VALUE: filterVals || altFilterVals
      }, {
        PARAM_NAME: 'rowlimit',
        PARAM_VALUE: 10000
      })
      // exclusive OR - if only one of the filters is present,
      // call the normal filtering function - by like
      if (gridType === 'LIKE') {
        if (gridToDisplay === 'HOLDING') {
          if (props.searchFromPopup) {
            if (props.userIsLinkedToOneHolding || props.userIsLinkedToTwoOrMoreHoldings) {
              gridTypeCall = 'GET_TABLE_WITH_LIKE_FILTER'
            } else {
              gridTypeCall = 'GET_TABLE_WITH_LIKE_FILTER_2'
            }
          } else {
            gridTypeCall = 'GET_TABLE_WITH_LIKE_FILTER_2'
          }
        } else {
          gridTypeCall = 'GET_TABLE_WITH_LIKE_FILTER'
        }
      }
      if (gridType === 'EQUAL') {
        // we need this because we use EQUAL filter for codelists
        gridTypeCall = 'GET_TABLE_WITH_MULTIPLE_FILTERS'
        gridParams = []
        gridParams.push({
          PARAM_NAME: 'gridConfigWeWant',
          PARAM_VALUE: gridToDisplay
        }, {
          PARAM_NAME: 'session',
          PARAM_VALUE: this.props.session
        }, {
          PARAM_NAME: 'table_name',
          PARAM_VALUE: gridToDisplay
        }, {
          PARAM_NAME: 'objectName',
          PARAM_VALUE: gridToDisplay
        }, {
          PARAM_NAME: 'objectType',
          PARAM_VALUE: gridToDisplay
        }, {
          PARAM_NAME: 'rowlimit',
          PARAM_VALUE: 10000
        }, {
          PARAM_NAME: 'fieldNames',
          PARAM_VALUE: filterBy
        }, {
          PARAM_NAME: 'fieldValues',
          PARAM_VALUE: filterVals
        }, {
          PARAM_NAME: 'no_rec',
          PARAM_VALUE: 10000
        }, {
          PARAM_NAME: 'criterumConjuction',
          PARAM_VALUE: 'AND'
        }
        )
      }
      if (filterVals && !altFilterVals) {
        gridParams.push({
          PARAM_NAME: 'searchBy',
          PARAM_VALUE: filterBy
        })
      } else if (!filterVals && altFilterVals) {
        gridParams.push({
          PARAM_NAME: 'searchBy',
          PARAM_VALUE: altFilterBy
        })
      } else if (filterVals && altFilterVals) {
        gridTypeCall = 'GET_TABLE_WITH_FILTER'
        gridParams.push(
          {
            PARAM_NAME: 'searchBy',
            PARAM_VALUE: filterBy
          }, {
            PARAM_NAME: 'parentColumn',
            PARAM_VALUE: altFilterBy
          }, {
            PARAM_NAME: 'parentId',
            PARAM_VALUE: altFilterVals
          }, {
            PARAM_NAME: 'criterumConjuction',
            PARAM_VALUE: 'AND'
          }
        )
      }
      renderGrid = GridManager.generateExportableGridWithCustomBtn(
        gridId, gridId, 'CUSTOM_GRID',
        gridTypeCall, gridParams, 'CUSTOM', this.onRowSelect, insertNewRow, enableMultiSelect, onSelectChangeFunct, gridHeight, gridWidth, toggleCustomButton, this.customButton
      )
    }
    ComponentManager.setStateForComponent(
      gridId, null,
      {
        onRowClickFunct: this.onRowSelect,
        addRowSubgrid: insertNewRow,
        toggleCustomButton,
        customButton: this.customButton
      }
    )
    this.setState({ renderGrid })
  }

  generateForm (objectId, props, enableExcludedFields) {
    if (this.state.showPopup === false) {
      this.setState({ showPopup: true })
    }
    const formFieldsToBeEcluded = props.formFieldsToBeEcluded
    const params = []
    const formWeWant = props.gridToDisplay
    let formId = `${formWeWant}_FORM`
    if (enableExcludedFields) {
      formId = `${formWeWant}_EXCLUDED_FORM`
    }
    params.push({
      PARAM_NAME: 'formWeWant',
      PARAM_VALUE: formWeWant
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: props.svSession
    }, {
      PARAM_NAME: 'table_name',
      PARAM_VALUE: formWeWant
    }, {
      PARAM_NAME: 'parent_id',
      PARAM_VALUE: props.parentId || '0'
    })
    if (objectId) {
      params.push({
        PARAM_NAME: 'object_id',
        PARAM_VALUE: objectId
      })
      formId = `${formWeWant}_FORM_${objectId}`
    } else {
      params.push({
        PARAM_NAME: 'object_id',
        PARAM_VALUE: '0'
      })
    }

    let inputWrapper
    switch (props.gridToDisplay) {
      case 'VACCINATION_EVENT':
        inputWrapper = InputWrappers.InputCampaignWrapper
        break
      case 'QUARANTINE':
        inputWrapper = InputWrappers.DisableEventsInputWrapper
        break
      case 'POPULATION':
        inputWrapper = InputWrappers.PopulationFormInputWrapper
        break
      case 'PET':
        inputWrapper = InputWrappers.PetFormInputWrapper
        break
      case 'HOLDING':
      case 'HOLDING_RESPONSIBLE':
        inputWrapper = InputWrappers.CombineDisableAndSearchWrappers
        break
      default:
        inputWrapper = InputWrappers.InputSearchWrapper
        break
    }

    const popUpForm = FormManager.generateForm(
      formId, formId, params, 'formData',
      'GET_FORM_BUILDER', 'GET_UISCHEMA', 'GET_TABLE_FORMDATA', this.closeWindow, null,
      null, null, null, null, undefined, this.onAlertClose, undefined,
      enableExcludedFields, formFieldsToBeEcluded, inputWrapper
    )
    ComponentManager.setStateForComponent(
      formId, null,
      {
        addCloseFunction: this.closeWindow,
        onAlertClose: this.onAlertClose
      }
    )
    this.setState({ popUpForm })
  }

  onRowSelect (gridId, rowIdx, row) {
    if (this.props.allowEdit) {
      this.editItemOnRowClick()
    } else {
      if (!this.props.dontMakeSelection) {
        selectObject(gridId, row)
      }
      if (!this.props.onRowSelectProp) {
        hashHistory.push('/main/data')
      } else if (this.props.onRowSelectProp instanceof Function) {
        this.props.onRowSelectProp()
      } else {
        console.warn('onRowSelectProp is defined but its not a function')
      }
    }
  }

  closeWindow () {
    this.setState({ popUpForm: undefined, showPopup: false })
  }

  onAlertClose () {
    GridManager.reloadGridData(this.props.gridToDisplay)
    this.setState({ popUpForm: undefined, showPopup: false })
  }

  insertNewRow () {
    this.generateForm(null, this.props, false)
  }

  customButton = () => {
    this.generateForm(null, this.props, true)
  }

  editItemOnRowClick () {
    const grid = this.props.gridToDisplay
    const objectId = store.getState()[grid].rowClicked[`${grid}.OBJECT_ID`]
    this.generateForm(objectId, this.props)
  }

  render () {
    return (
      <div>
        {this.props.gridToDisplay && this.state.renderGrid}
        {this.state.showPopup &&
          <div id='form_modal' className='modal' style={{ display: 'block' }}>
            <Draggable handle='.modal-header'>
              <div id='form_modal_content' className='modal-content'>
                <div className='modal-header'>
                  <button id='modal_close_btn' type='button' className='close' onClick={this.closeWindow} data-dismiss='modal'>&times;</button>
                </div>
                <div id='form_modal_body' className='modal-body'>
                  {this.state.popUpForm}
                </div>
              </div>
            </Draggable>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  isAdmin: state.userInfoReducer.isAdmin,
  userIsLinkedToOneHolding: state.linkedHolding.userIsLinkedToOneHolding,
  userIsLinkedToTwoOrMoreHoldings: state.linkedHolding.userIsLinkedToTwoOrMoreHoldings
})

export default connect(mapStateToProps)(MainContent)
