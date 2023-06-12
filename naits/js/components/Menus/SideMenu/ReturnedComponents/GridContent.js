import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import { store, updateSelectedRows } from 'tibro-redux'
import {
  ComponentManager,
  FormManager,
  GridManager
} from 'components/ComponentsIndex'
import { CustomPetCollectFormWrapper } from 'containers/InputWrappers'
import * as config from 'config/config'
import { menuConfig } from 'config/menuConfig.js'
import { disableAddRowConfig } from 'config/disableAddRowConfig.js'
import { selectObject, customDelete, onGridSelectionChange, strcmp, isValidArray, formatAlertType } from 'functions/utils'

class GridContent extends React.Component {
  static propTypes = {
    showGrid: PropTypes.string.isRequired,
    parentId: PropTypes.number.isRequired,
    linkName: PropTypes.string
  }
  constructor (props) {
    super(props)
    this.state = {
      showPopup: false,
      popUpForm: undefined,
      renderGrid: undefined,
      formId: null,
      recObjId: null,
      userIsLinkedToOneHolding: false,
      userIsLinkedToTwoOrMoreHoldings: false,
      showPetQuarantinePopup: false,
      petQuarantinePopup: undefined,
      showCollectionDetailsForm: false,
      collectionDetailsForm: undefined
    }
    this.generateGrid = this.generateGrid.bind(this)
    this.generateForm = this.generateForm.bind(this)
    this.insertNewRow = this.insertNewRow.bind(this)
    this.editItemOnRowClick = this.editItemOnRowClick.bind(this)
    this.generateObjectsForParent = this.generateObjectsForParent.bind(this)
    this.closeWindow = this.closeWindow.bind(this)
    this.onAlertClose = this.onAlertClose.bind(this)
    this.generateCoreObject = this.generateCoreObject.bind(this)
  }

  componentDidMount () {
    if (this.props.showGrid) {
      this.generateGrid(this.props)
    }
    const navigationType = window.performance.getEntriesByType('navigation')[0]
    if (navigationType.type && strcmp(navigationType.type, 'reload')) {
      this.getLinkedHoldingsForCurrentUser()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.customId !== nextProps.customId) {
      this.generateGrid(nextProps)
    }

    if (nextProps.showGrid !== this.props.showGrid ||
      nextProps.parentId !== this.props.parentId ||
      nextProps.linkName !== this.props.linkName ||
      nextProps.customGridId !== this.props.customGridId ||
      nextProps.toggleCustomButton !== this.props.toggleCustomButton) {
      this.generateGrid(nextProps)
    }

    if ((this.props.filterTheTerminatedAnimalsGrid !== nextProps.filterTheTerminatedAnimalsGrid) && nextProps.filterTheTerminatedAnimalsGrid) {
      store.dispatch({ type: 'RESET_FILTERING_THE_TERMINATED_ANIMALS_GRID' })
      ComponentManager.cleanComponentReducerState(`${nextProps.showGrid}_${nextProps.parentId}_${nextProps.customId}`)
      this.setState({ renderGrid: undefined }, () => this.generateGrid(nextProps))
    }

    if ((this.props.filterTheFinishedMovementDocumentsGrid !== nextProps.filterTheFinishedMovementDocumentsGrid) && nextProps.filterTheFinishedMovementDocumentsGrid) {
      store.dispatch({ type: 'RESET_FILTERING_THE_FINISHED_MOVEMENT_DOCUMENTS_GRID' })
      ComponentManager.cleanComponentReducerState(`${nextProps.showGrid}_${nextProps.parentId}_${nextProps.customGridId}`)
      this.setState({ renderGrid: undefined }, () => this.generateGrid(nextProps))
    }

    if ((this.props.filterTheFinishedMovementsGrid !== nextProps.filterTheFinishedMovementsGrid) && nextProps.filterTheFinishedMovementsGrid) {
      store.dispatch({ type: 'RESET_FILTERING_THE_FINISHED_MOVEMENTS_GRID' })
      ComponentManager.cleanComponentReducerState(`${nextProps.showGrid}_${nextProps.parentId}_${nextProps.linkName}_${nextProps.customId}`)
      this.setState({ renderGrid: undefined }, () => this.generateGrid(nextProps))
    }

    if ((this.props.filterTheOutgoingTransferGrid !== nextProps.filterTheOutgoingTransferGrid) && nextProps.filterTheOutgoingTransferGrid) {
      ComponentManager.cleanComponentReducerState(`${nextProps.showGrid}_${nextProps.parentId}_${nextProps.customId}`)
      this.setState({ renderGrid: undefined }, () => this.generateGrid(nextProps))
    }

    if ((this.props.filterTheIncomingTransferGrid !== nextProps.filterTheIncomingTransferGrid) && nextProps.filterTheIncomingTransferGrid) {
      ComponentManager.cleanComponentReducerState(`${nextProps.showGrid}_${nextProps.parentId}_${nextProps.customId}`)
      this.setState({ renderGrid: undefined }, () => this.generateGrid(nextProps))
    }

    if ((this.props.filterTheTerminatedPetsGrid !== nextProps.filterTheTerminatedPetsGrid) && nextProps.filterTheTerminatedPetsGrid) {
      store.dispatch({ type: 'RESET_FILTERING_THE_TERMINATED_PETS_GRID' })
      ComponentManager.cleanComponentReducerState(`${nextProps.showGrid}_${nextProps.parentId}_${nextProps.customId}`)
      this.setState({ renderGrid: undefined }, () => this.generateGrid(nextProps))
    }

    if ((this.props.filterTheReleasedPetsGrid !== nextProps.filterTheReleasedPetsGrid) && nextProps.filterTheReleasedPetsGrid) {
      store.dispatch({ type: 'RESET_FILTERING_THE_RELEASED_PETS_GRID' })
      ComponentManager.cleanComponentReducerState(`${nextProps.showGrid}_${nextProps.parentId}_${nextProps.customId}`)
      this.setState({ renderGrid: undefined }, () => this.generateGrid(nextProps))
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.parentType === 'HOLDING_RESPONSIBLE' && prevProps.linkName !== this.props.linkName) {
      ComponentManager.cleanComponentReducerState(`${this.props.showGrid}_${this.props.parentId}_${prevProps.linkName}`)
    }

    if (this.props.coreObject === 'HOLDING_RESPONSIBLE' && prevProps.linkName !== this.props.linkName) {
      ComponentManager.cleanComponentReducerState(`${this.props.coreObject}_${this.props.parentId}_${prevProps.linkName}`)
    }

    if (((this.props.showGrid === 'ANIMAL_MOVEMENT' && this.props.linkName === 'ANIMAL_MOVEMENT_HOLDING') ||
      (this.props.showGrid === 'FLOCK_MOVEMENT' && this.props.linkName === 'FLOCK_MOVEMENT_HOLDING')) &&
      prevProps.customId !== this.props.customId) {
      ComponentManager.cleanComponentReducerState(`${this.props.showGrid}_${this.props.parentId}_${prevProps.linkName}_${prevProps.customId}`)
    }

    if ((this.props.showGrid === 'ANIMAL_MOVEMENT' || this.props.showGrid === 'FLOCK_MOVEMENT') && prevProps.customId !== this.props.customId) {
      ComponentManager.cleanComponentReducerState(`${this.props.showGrid}_${this.props.parentId}_${prevProps.customId}`)
    }

    if (prevProps.customGridId !== this.props.customGridId) {
      ComponentManager.cleanComponentReducerState(`${this.props.showGrid}_${this.props.parentId}_${prevProps.customGridId}`)
    }

    if (prevProps.customId !== this.props.customId &&
      (prevProps.customId === 'COLLECTION_LOCATION' || prevProps.customId === 'RELEASE_LOCATION' || prevProps.customId === 'TRANSFER_OUTCOME' ||
        prevProps.customId === 'TRANSFER_INCOME' || prevProps.customId === 'OUTGOING_MOVEMENT' || prevProps.customId === 'TERMINATED_ANIMALS' ||
        prevProps.customId === 'ALL_PETS' || prevProps.customId === 'TERMINATED_PETS')) {
      ComponentManager.cleanComponentReducerState(`${this.props.showGrid}_${this.props.parentId}_${prevProps.customId}`)
    }
  }

  componentWillUnmount () {
    const { coreObject, showGrid, parentId, parentType, linkName, customId, customGridId } = this.props
    if (coreObject === 'HOLDING_RESPONSIBLE') {
      ComponentManager.cleanComponentReducerState(`${coreObject}_${parentId}_${linkName}`)
    }

    if (parentType === 'HOLDING_RESPONSIBLE') {
      ComponentManager.cleanComponentReducerState(`${showGrid}_${parentId}_${linkName}`)
    }

    if (showGrid === 'ANIMAL_MOVEMENT' || showGrid === 'FLOCK_MOVEMENT') {
      ComponentManager.cleanComponentReducerState(`${showGrid}_${parentId}_${customId}`)
      ComponentManager.cleanComponentReducerState(`${showGrid}_${parentId}_${linkName}_${customId}`)
    }

    if (showGrid === 'MOVEMENT_DOC' && customGridId) {
      ComponentManager.cleanComponentReducerState(`${showGrid}_${parentId}_${customGridId}`)
    }

    if (linkName === 'HOLDING_QUARANTINE' || linkName === 'POA' || linkName === 'CUSTOM_POA' ||
      linkName === 'ANIMAL_VACC_BOOK' || linkName === 'ANIMAL_EXPORT_CERT' || linkName === 'DISEASE_QUARANTINE' ||
      linkName === 'SUPPLY' || linkName === 'AREA_POPULATION' || linkName === 'ANIMAL_HERD') {
      ComponentManager.cleanComponentReducerState(`${showGrid}_${parentId}_${linkName}`)
    }

    if (showGrid === 'SPOT_CHECK' || showGrid === 'ANIMAL_MOVEMENT' || showGrid === 'EAR_TAG_REPLC' ||
      showGrid === 'INVENTORY_ITEM' || showGrid === 'PET_HEALTH_BOOK' || showGrid === 'PET_MOVEMENT' ||
      showGrid === 'SVAROG_USER_GROUPS' || showGrid === 'AREA_HEALTH' || showGrid === 'VACCINATION_RESULTS' ||
      showGrid === 'ORDER' || showGrid === 'RANGE' || showGrid === 'LAB_TEST_RESULT' || showGrid === 'RFID_INPUT_RESULT' ||
      showGrid === 'RFID_INPUT_STATE' || showGrid === 'PET_QUARANTINE') {
      ComponentManager.cleanComponentReducerState(`${showGrid}_${parentId}`)
    }

    if (customId === 'COLLECTION_LOCATION' || customId === 'RELEASE_LOCATION' || customId === 'TRANSFER_INCOME' ||
      customId === 'TRANSFER_OUTCOME' || customId === 'OUTGOING_MOVEMENT' || customId === 'HERD_LAB_SAMPLE' ||
      customId === 'TERMINATED_ANIMALS' || customId === 'ALL_PETS' || customId === 'TERMINATED_PETS') {
      ComponentManager.cleanComponentReducerState(`${showGrid}_${parentId}_${customId}`)
    }
  }

  getLinkedHoldingsForCurrentUser = async () => {
    const server = config.svConfig.restSvcBaseUrl
    const session = this.props.svSession
    const verbPath = config.svConfig.triglavRestVerbs.GET_LINKED_HOLDINGS_PER_USER
    let url = `${server}${verbPath}`
    url = url.replace('%session', session)
    try {
      const res = await axios.get(url)
      if (res.data && res.data instanceof Array) {
        if (res.data && res.data.length === 1) {
          store.dispatch({ type: 'USER_IS_LINKED_TO_ONE_HOLDING' })
          this.setState({ userIsLinkedToOneHolding: true, userIsLinkedToTwoOrMoreHoldings: false })
        } else if (res.data && res.data.length > 1) {
          store.dispatch({ type: 'USER_IS_LINKED_TO_TWO_OR_MORE_HOLDINGS' })
          this.setState({ userIsLinkedToOneHolding: false, userIsLinkedToTwoOrMoreHoldings: true })
        } else if (res.data.length === 0) {
          store.dispatch({ type: 'USER_IS_NOT_LINKED_TO_ANY_HOLDINGS' })
        }
      } else {
        store.dispatch({ type: 'USER_IS_NOT_LINKED_TO_ANY_HOLDINGS' })
      }
    } catch (err) {
      console.error(err)
    }
  }

  generateCoreObject (gridId, rowIdx, row) {
    selectObject(this.props.coreObject, row)
    setTimeout(selectObject(this.props.coreObject, row), 300)
  }

  removePetFromQuarantine = (petQuarantineObjId) => {
    this.setState({ loading: true })
    const { svSession, selectedGridRows } = this.props
    const objectArray = selectedGridRows
    const paramsArray = [{
      MASS_PARAM_ACTION: 'PET_ACTIONS',
      MASS_PARAM_SUBACTION: 'REMOVE_PET_FROM_QUARANTINE',
      MASS_PARAM_PET_QUARANTINE_OBJ_ID: petQuarantineObjId
    }]
    const verbPath = config.svConfig.triglavRestVerbs.MANAGE_PET_QUARANTINE
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${svSession}`
    const reqConfig = { method: 'post', url, data: JSON.stringify({ objectArray, paramsArray }) }
    axios(reqConfig).then(res => {
      if (res.data) {
        this.setState({ loading: false })
        const resType = formatAlertType(res.data)
        alertUser(true, resType, this.context.intl.formatMessage({ id: res.data, defaultMessage: res.data }))
        if (strcmp(resType, 'success')) {
          const gridId = 'PETS_IN_QUARANTINE'
          store.dispatch(updateSelectedRows([], null))
          ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [])
          GridManager.reloadGridData(gridId)
        }
      }
    }).catch(err => {
      console.error(err)
      alertUser(true, 'error', err)
      this.setState({ loading: false })
    })
  }

  petQuarantineGridCustomButton = (petQuarantineObjId) => {
    const { selectedGridRows } = this.props
    if (!isValidArray(selectedGridRows, 1)) {
      alertUser(true, 'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.empty_selection`,
          defaultMessage: `${config.labelBasePath}.alert.empty_selection`
        })
      )
    } else {
      const promptLabel = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.alert.remove_pet_from_quarantine_prompt`,
        defaultMessage: `${config.labelBasePath}.alert.remove_pet_from_quarantine_prompt`
      })
      const yesLabel = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.yes`,
        defaultMessage: `${config.labelBasePath}.main.yes`
      })
      const noLabel = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.no`,
        defaultMessage: `${config.labelBasePath}.main.no`
      })

      alertUser(true, 'warning', promptLabel, '', () => this.removePetFromQuarantine(petQuarantineObjId), () => { }, true, yesLabel, noLabel)
    }
  }

  closePetQuarantinePopup = () => {
    this.setState({ showPetQuarantinePopup: false, petQuarantinePopup: undefined })
    store.dispatch(updateSelectedRows([], null))
    ComponentManager.cleanComponentReducerState('PETS_IN_QUARANTINE')
  }

  onPetQuarantineAlertClose = (gridId) => {
    this.setState({ showPetQuarantinePopup: false, petQuarantinePopup: undefined })
    GridManager.reloadGridData(gridId)
    store.dispatch(updateSelectedRows([], null))
    ComponentManager.cleanComponentReducerState('PETS_IN_QUARANTINE')
  }

  generatePetQuarantinePopup = (gridId, petQuarantineObjId) => {
    const { showGrid, parentId, gridConfig, svSession } = this.props
    const params = []
    const formId = `${showGrid}_FORM_${parentId}`
    params.push({
      PARAM_NAME: 'formWeWant',
      PARAM_VALUE: showGrid
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: svSession
    }, {
      PARAM_NAME: 'table_name',
      PARAM_VALUE: showGrid
    }, {
      PARAM_NAME: 'object_id',
      PARAM_VALUE: petQuarantineObjId || '0'
    }, {
      PARAM_NAME: 'parent_id',
      PARAM_VALUE: parentId
    })

    const popUpForm = FormManager.generateForm(
      formId, formId, params, 'formData',
      'GET_FORM_BUILDER', 'GET_UISCHEMA', 'GET_TABLE_FORMDATA',
      this.closePetQuarantinePopup, null, null, null, null, null, 'close',
      () => this.onPetQuarantineAlertClose(gridId), undefined, null,
      null, null, null
    )
    ComponentManager.setStateForComponent(formId, null, {
      addCloseFunction: this.closePetQuarantinePopup,
      onAlertClose: () => this.onPetQuarantineAlertClose(gridId)
    })

    const gridWidth = gridConfig ? (gridConfig.SIZE ? gridConfig.SIZE.WIDTH : null) : null
    const gridParams = []
    gridParams.push({
      PARAM_NAME: 'session',
      PARAM_VALUE: svSession
    }, {
      PARAM_NAME: 'parentId',
      PARAM_VALUE: petQuarantineObjId
    }, {
      PARAM_NAME: 'objectType',
      PARAM_VALUE: 'PET'
    }, {
      PARAM_NAME: 'gridConfigWeWant',
      PARAM_VALUE: 'PET'
    }, {
      PARAM_NAME: 'linkName',
      PARAM_VALUE: 'PET_QUARANTINE'
    }, {
      PARAM_NAME: 'rowlimit',
      PARAM_VALUE: 10000
    })
    const petsInQuarantineGridId = 'PETS_IN_QUARANTINE'
    const petsInQuarantineGrid = GridManager.generateExportableGridWithCustomBtn(
      petsInQuarantineGridId, petsInQuarantineGridId, 'CUSTOM_GRID',
      'GET_BYLINK', gridParams, 'CUSTOM', () => { }, null,
      true, onGridSelectionChange, 300, gridWidth, false, () => { }, false
    )

    const popup = (
      <div id='form_modal' className='modal pets-in-quarantine-modal' style={{ display: 'block' }}>
        <div id='form_modal_content' className='modal-content'>
          <div className='modal-header'>
            <button
              id='modal_close_btn'
              type='button'
              className='close'
              onClick={this.closePetQuarantinePopup}
              data-dismiss='modal'>
              &times;
            </button>
          </div>
          <div id='form_modal_body' className='modal-body'>
            {popUpForm}
            <div className='pets-in-quarantine-grid-container'>
              <button
                className='btn pets-in-quarantine-remove-btn'
                style={{
                  float: 'right',
                  marginTop: '1rem',
                  marginRight: '1rem',
                  marginBottom: '0.5rem',
                  backgroundColor: 'rgb(240, 223, 171)',
                  border: 'none'
                }}
                onClick={() => this.petQuarantineGridCustomButton(petQuarantineObjId)}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.remove_pet_from_quarantine`,
                  defaultMessage: `${config.labelBasePath}.main.remove_pet_from_quarantine`
                })}
              </button>
              {petsInQuarantineGrid}
            </div>
          </div>
        </div>
      </div>
    )

    this.setState({ showPetQuarantinePopup: true, petQuarantinePopup: popup })
  }

  onPetQuarantineRowClick = (gridId, idx, row) => {
    const petQuarantineObjId = row['PET_QUARANTINE.OBJECT_ID']
    this.generatePetQuarantinePopup(gridId, petQuarantineObjId)
  }

  generateGrid (props) {
    if (props) {
      const {
        showGrid, parentId, linkName, gridConfig, linkedTable,
        coreObject, parentType } = props
      let isContainer = this.props.isContainer
      let toggleCustomButton = this.props.toggleCustomButton
      let insertNewRow = () => this.insertNewRow(gridId)
      let gridId = `${showGrid}_${parentId}`
      let enableMultiSelect = this.props.enableMultiSelect
      if (parentType === 'PET' && showGrid === 'INVENTORY_ITEM') {
        enableMultiSelect = false
      }
      const onSelectChangeFunct = this.props.onSelectChangeFunct || onGridSelectionChange
      let methodType = 'GET_BYPARENTID'
      let onRowClick = this.editItemOnRowClick
      if (props.disableEdit && !props.userCanEdit) {
        if (parentType === 'PET' && showGrid === 'INVENTORY_ITEM') {
          onRowClick = this.editItemOnRowClick
        } else {
          onRowClick = null
        }
      }
      // following line disables add grid button if enabled by SUB_MODULES
      if (props.disableEditForSubmodules || props.disableAddRow) {
        insertNewRow = null
        this.customButton = null
        toggleCustomButton = false
      }

      if (props.disableChechBoxFromGrid) {
        enableMultiSelect = false
      }

      if (coreObject) {
        onRowClick = this.generateCoreObject
      }

      if (strcmp(props.customId, 'PET_QUARANTINE')) {
        onRowClick = this.onPetQuarantineRowClick
      }

      const gridHeight = gridConfig ? (gridConfig.SIZE ? gridConfig.SIZE.HEIGHT : null) : null
      const gridWidth = gridConfig ? (gridConfig.SIZE ? gridConfig.SIZE.WIDTH : null) : null
      let params = []

      disableAddRowConfig('DISABLE_ADD_ROW_FOR_TABLE_SECOND_LEVEL') &&
        disableAddRowConfig('DISABLE_ADD_ROW_FOR_TABLE_SECOND_LEVEL').LIST_OF_ITEMS.map((element) => {
          // Disable add button for some grids defined in disableAddRowConfig
          if (element.PARENT_SUBTYPE && element.PARENT_TYPE && showGrid === element.TABLE) {
            props.selectedObjects.map(singleObj => {
              if (singleObj.active) {
                if (singleObj.row[element.PARENT_TYPE + '.TYPE'] === element.PARENT_SUBTYPE) {
                  insertNewRow = null
                  this.customButton = null
                  toggleCustomButton = false
                } else if (props.selectedObjects.length === 1 && singleObj.gridId === element.PARENT_TYPE) {
                  if (parentType === 'POPULATION' && showGrid === 'AREA') {
                    insertNewRow = null
                    this.customButton = null
                    toggleCustomButton = false
                  } else {
                    insertNewRow = null
                    this.customButton = null
                    toggleCustomButton = true
                  }
                } else {
                  if (!strcmp(showGrid, 'PET') && !strcmp(parentType, 'HOLDING')) {
                    insertNewRow = null
                    this.customButton = null
                    toggleCustomButton = false
                  } else {
                    if (strcmp(showGrid, 'PET') && strcmp(parentType, 'HOLDING') && !strcmp(props.customId, 'ALL_PETS')) {
                      insertNewRow = null
                      this.customButton = null
                      toggleCustomButton = false
                    }
                  }
                }
              }
            })
          } else if (showGrid === element.TABLE) {
            insertNewRow = null
            this.customButton = null
            // toggleCustomButton = false
          }
        })

      disableAddRowConfig('DISABLE_ADD_ROW_FOR_SUBMODULES') &&
        disableAddRowConfig('DISABLE_ADD_ROW_FOR_SUBMODULES').LIST_OF_ITEMS.map(element => {
          const selectedObjects = props.selectedObjects
          if (showGrid === element.TABLE) {
            selectedObjects.map(singleObj => {
              if (singleObj.active) {
                const gridType = singleObj.gridType
                const objId = singleObj.row[gridType + '.OBJECT_ID']
                let verbPath
                let restUrl
                verbPath = config.svConfig.triglavRestVerbs.IS_ANIMAL_IN_SLAUGHTERHOUSE
                restUrl = config.svConfig.restSvcBaseUrl + verbPath + `/${this.props.svSession}` + `/${objId}`
                axios.get(restUrl).then((response) => {
                  if (response.data) { // ws returns true if animal belongs in slaughterhouse
                    ComponentManager.setStateForComponent(
                      gridId, null,
                      {
                        addRowSubgrid: null,
                        toggleCustomButton: false,
                        customButton: null
                      }
                    )
                  }
                })
              }
            })
          }
        })

      params.push({
        PARAM_NAME: 'gridConfigWeWant',
        PARAM_VALUE: showGrid
      }, {
        PARAM_NAME: 'session',
        PARAM_VALUE: props.svSession
      }, {
        PARAM_NAME: 'parentId',
        PARAM_VALUE: parentId
      }, {
        PARAM_NAME: 'objectType',
        PARAM_VALUE: showGrid
      }, {
        PARAM_NAME: 'rowlimit',
        PARAM_VALUE: 10000
      })
      if (linkName) {
        methodType = 'GET_BYLINK'
        params.push({
          PARAM_NAME: 'linkName',
          PARAM_VALUE: linkName
        })
        gridId = `${showGrid}_${parentId}_${linkName}`
      }
      if (props.customWs) {
        methodType = props.customWs
        if (methodType === 'GET_TABLE_WITH_MULTIPLE_FILTERS' && showGrid === 'STRAY_PET_LOCATION' &&
          props.customId === 'COLLECTION_LOCATION') {
          gridId = `${showGrid}_${parentId}_${props.customId}`
          params = []
          params.push({
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'table_name',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'fieldNames',
            PARAM_VALUE: 'LOCATION_REASON,PARENT_ID'
          }, {
            PARAM_NAME: 'criterumConjuction',
            PARAM_VALUE: 'AND'
          }, {
            PARAM_NAME: 'fieldValues',
            PARAM_VALUE: `1,${props.parentId}`
          }, {
            PARAM_NAME: 'no_rec',
            PARAM_VALUE: 10000
          })
        } else if (methodType === 'GET_TABLE_WITH_MULTIPLE_FILTERS' && showGrid === 'STRAY_PET_LOCATION' &&
          props.customId === 'RELEASE_LOCATION') {
          gridId = `${showGrid}_${parentId}_${props.customId}`
          params = []
          params.push({
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'table_name',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'fieldNames',
            PARAM_VALUE: 'LOCATION_REASON,PARENT_ID'
          }, {
            PARAM_NAME: 'criterumConjuction',
            PARAM_VALUE: 'AND'
          }, {
            PARAM_NAME: 'fieldValues',
            PARAM_VALUE: `2,${props.parentId}`
          }, {
            PARAM_NAME: 'no_rec',
            PARAM_VALUE: 10000
          })
        } else if (methodType === 'GET_TABLE_WITH_MULTIPLE_FILTERS' && showGrid === 'PET' && props.customId === 'ALL_PETS') {
          gridId = `${showGrid}_${parentId}_${props.customId}`
          params = []
          params.push({
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'table_name',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'fieldNames',
            PARAM_VALUE: 'PARENT_ID,STATUS'
          }, {
            PARAM_NAME: 'criterumConjuction',
            PARAM_VALUE: 'AND'
          }, {
            PARAM_NAME: 'fieldValues',
            PARAM_VALUE: `${props.parentId},NOTIN-RELEASED-DIED-EUTHANIZED-EXPORTED`
          }, {
            PARAM_NAME: 'no_rec',
            PARAM_VALUE: 10000
          })
        } else if (methodType === 'GET_TABLE_WITH_MULTIPLE_FILTERS' && showGrid === 'PET' && props.customId === 'TERMINATED_PETS') {
          enableMultiSelect = false
          gridId = `${showGrid}_${parentId}_${props.customId}`
          params = []
          methodType = 'GET_TERMINATED_PETS'
          params.push({
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'table_name',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'objectId',
            PARAM_VALUE: props.parentId
          }, {
            PARAM_NAME: 'dateFrom',
            PARAM_VALUE: props.terminatedPetsDateFrom || null
          }, {
            PARAM_NAME: 'dateTo',
            PARAM_VALUE: props.terminatedPetsDateTo || null
          }, {
            PARAM_NAME: 'rowlimit',
            PARAM_VALUE: 5000
          })
        } else if (methodType === 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED' && props.customId === 'TRANSFER_INCOME') {
          gridId = `${showGrid}_${parentId}_${props.customId}`
          params = []
          if (!strcmp(parentType, 'HOLDING')) {
            store.dispatch({ type: 'RESET_FILTERING_THE_INCOMING_TRANSFER_GRID' })
            methodType = 'GET_INCOMING_TRANSFERS_PER_ORG_UNIT'
            params.push({
              PARAM_NAME: 'gridConfigWeWant',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'table_name',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'parentId',
              PARAM_VALUE: parentId
            }, {
              PARAM_NAME: 'tagType',
              PARAM_VALUE: props.incomingTransferTagType || null
            }, {
              PARAM_NAME: 'startTagId',
              PARAM_VALUE: props.incomingTransferStartTagId || null
            }, {
              PARAM_NAME: 'endTagId',
              PARAM_VALUE: props.incomingTransferEndTagId || null
            }, {
              PARAM_NAME: 'dateFrom',
              PARAM_VALUE: props.incomingTransferDateFrom || null
            }, {
              PARAM_NAME: 'dateTo',
              PARAM_VALUE: props.incomingTransferDateTo || null
            }, {
              PARAM_NAME: 'rowlimit',
              PARAM_VALUE: 5000
            })
          } else {
            params.push({
              PARAM_NAME: 'gridConfigWeWant',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'table_name',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'fieldNames',
              PARAM_VALUE: 'DESTINATION_OBJ_ID'
            }, {
              PARAM_NAME: 'criterumConjuction',
              PARAM_VALUE: 'AND'
            }, {
              PARAM_NAME: 'fieldValues',
              PARAM_VALUE: `${props.parentId}`
            }, {
              PARAM_NAME: 'no_rec',
              PARAM_VALUE: 10000
            }, {
              PARAM_NAME: 'sortOrder',
              PARAM_VALUE: 'DESC'
            })
          }
        } else if (methodType === 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED' && props.customId === 'TRANSFER_OUTCOME') {
          gridId = `${showGrid}_${parentId}_${props.customId}`
          params = []
          if (!strcmp(parentType, 'HOLDING')) {
            store.dispatch({ type: 'RESET_FILTERING_THE_OUTGOING_TRANSFER_GRID' })
            methodType = 'GET_OUTGOING_TRANSFERS_PER_ORG_UNIT'
            params.push({
              PARAM_NAME: 'gridConfigWeWant',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'table_name',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'parentId',
              PARAM_VALUE: parentId
            }, {
              PARAM_NAME: 'tagType',
              PARAM_VALUE: props.outgoingTransferTagType || null
            }, {
              PARAM_NAME: 'startTagId',
              PARAM_VALUE: props.outgoingTransferStartTagId || null
            }, {
              PARAM_NAME: 'endTagId',
              PARAM_VALUE: props.outgoingTransferEndTagId || null
            }, {
              PARAM_NAME: 'dateFrom',
              PARAM_VALUE: props.outgoingTransferDateFrom || null
            }, {
              PARAM_NAME: 'dateTo',
              PARAM_VALUE: props.outgoingTransferDateTo || null
            }, {
              PARAM_NAME: 'rowlimit',
              PARAM_VALUE: 5000
            })
          } else {
            params.push({
              PARAM_NAME: 'gridConfigWeWant',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'table_name',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'fieldNames',
              PARAM_VALUE: 'PARENT_ID'
            }, {
              PARAM_NAME: 'criterumConjuction',
              PARAM_VALUE: 'AND'
            }, {
              PARAM_NAME: 'fieldValues',
              PARAM_VALUE: `${props.parentId}`
            }, {
              PARAM_NAME: 'no_rec',
              PARAM_VALUE: 10000
            }, {
              PARAM_NAME: 'sortOrder',
              PARAM_VALUE: 'DESC'
            })
          }
        } else if (methodType === 'GET_TABLE_WITH_MULTIPLE_FILTERS' && props.customId === 'OUTGOING_MOVEMENT') {
          enableMultiSelect = false
          gridId = `${showGrid}_${parentId}_${props.customId}`
          params = []
          methodType = 'GET_RELEASED_PETS'
          params.push({
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'table_name',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'objectId',
            PARAM_VALUE: props.parentId
          }, {
            PARAM_NAME: 'dateFrom',
            PARAM_VALUE: props.releasedPetsDateFrom || null
          }, {
            PARAM_NAME: 'dateTo',
            PARAM_VALUE: props.releasedPetsDateTo || null
          }, {
            PARAM_NAME: 'rowlimit',
            PARAM_VALUE: 5000
          })
        } else if (methodType === 'GET_TABLE_WITH_MULTIPLE_FILTERS' && props.customId === 'HERD_LAB_SAMPLE') {
          gridId = `${showGrid}_${parentId}_${props.customId}`
          params = []
          params.push({
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'table_name',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'fieldNames',
            PARAM_VALUE: 'HERD_OBJ_ID,STATUS'
          }, {
            PARAM_NAME: 'criterumConjuction',
            PARAM_VALUE: 'AND'
          }, {
            PARAM_NAME: 'fieldValues',
            PARAM_VALUE: `${props.parentId},COLLECTED`
          }, {
            PARAM_NAME: 'no_rec',
            PARAM_VALUE: 10000
          })
        } else if (methodType === 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED' && props.customId === 'TERMINATED_ANIMALS') {
          gridId = `${showGrid}_${parentId}_${props.customId}`
          toggleCustomButton = false
          params = []
          methodType = 'GET_TERMINATED_ANIMALS'
          params.push({
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'table_name',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'objectId',
            PARAM_VALUE: props.parentId
          }, {
            PARAM_NAME: 'dateFrom',
            PARAM_VALUE: props.terminatedAnimalsDateFrom || null
          }, {
            PARAM_NAME: 'dateTo',
            PARAM_VALUE: props.terminatedAnimalsDateTo || null
          }, {
            PARAM_NAME: 'rowlimit',
            PARAM_VALUE: 5000
          })
        } else if (methodType === 'GET_BYLINK_PER_STATUSES_SORTED' && (props.customId === 'VALID_ANIMAL_MOVEMENTS' || props.customId === 'FINISHED_ANIMAL_MOVEMENTS')) {
          let filterValues = 'VALID'
          if (strcmp(props.customId, 'FINISHED_ANIMAL_MOVEMENTS')) {
            filterValues = 'FINISHED,CANCELED,REJECTED'
            enableMultiSelect = false
          }
          gridId = `${showGrid}_${parentId}_${linkName}_${props.customId}`
          params = []
          if (strcmp(props.holdingType, '7') && strcmp(props.customId, 'FINISHED_ANIMAL_MOVEMENTS')) {
            methodType = 'GET_FINISHED_MOVEMENTS'
            params.push({
              PARAM_NAME: 'gridConfigWeWant',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'table_name',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'objectId',
              PARAM_VALUE: parentId
            }, {
              PARAM_NAME: 'dateFrom',
              PARAM_VALUE: props.finishedMovementsDateFrom || null
            }, {
              PARAM_NAME: 'dateTo',
              PARAM_VALUE: props.finishedMovementsDateTo || null
            }, {
              PARAM_NAME: 'rowlimit',
              PARAM_VALUE: 5000
            })
          } else {
            params.push({
              PARAM_NAME: 'gridConfigWeWant',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'objectId',
              PARAM_VALUE: parentId
            }, {
              PARAM_NAME: 'statuses',
              PARAM_VALUE: filterValues
            }, {
              PARAM_NAME: 'table_name',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'linkName',
              PARAM_VALUE: linkName
            }, {
              PARAM_NAME: 'rowlimit',
              PARAM_VALUE: 10000
            }, {
              PARAM_NAME: 'sortOrder',
              PARAM_VALUE: 'DESC'
            }, {
              PARAM_NAME: 'link_status',
              PARAM_VALUE: 'VALID'
            })
          }
        } else if (methodType === 'GET_BYLINK_PER_STATUSES_SORTED' && (props.customId === 'VALID_FLOCK_MOVEMENTS' || props.customId === 'FINISHED_FLOCK_MOVEMENTS')) {
          let filterValues = 'VALID'
          if (strcmp(props.customId, 'FINISHED_FLOCK_MOVEMENTS')) {
            filterValues = 'FINISHED,CANCELED,REJECTED'
            enableMultiSelect = false
          }
          gridId = `${showGrid}_${parentId}_${linkName}_${props.customId}`
          params = []
          params.push({
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'objectId',
            PARAM_VALUE: parentId
          }, {
            PARAM_NAME: 'statuses',
            PARAM_VALUE: filterValues
          }, {
            PARAM_NAME: 'table_name',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'linkName',
            PARAM_VALUE: linkName
          }, {
            PARAM_NAME: 'rowlimit',
            PARAM_VALUE: 10000
          }, {
            PARAM_NAME: 'sortOrder',
            PARAM_VALUE: 'DESC'
          }, {
            PARAM_NAME: 'link_status',
            PARAM_VALUE: 'VALID'
          })
        } else if (methodType === 'GET_BYLINK_PER_STATUSES_SORTED' && (props.customId === 'VALID_HERD_MOVEMENTS' || props.customId === 'FINISHED_HERD_MOVEMENTS')) {
          let filterValues = 'VALID'
          if (strcmp(props.customId, 'FINISHED_HERD_MOVEMENTS')) {
            filterValues = 'FINISHED,CANCELED,REJECTED'
            enableMultiSelect = false
          }
          gridId = `${showGrid}_${parentId}_${linkName}_${props.customId}`
          params = []
          params.push({
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'objectId',
            PARAM_VALUE: parentId
          }, {
            PARAM_NAME: 'statuses',
            PARAM_VALUE: filterValues
          }, {
            PARAM_NAME: 'table_name',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'linkName',
            PARAM_VALUE: linkName
          }, {
            PARAM_NAME: 'rowlimit',
            PARAM_VALUE: 10000
          }, {
            PARAM_NAME: 'sortOrder',
            PARAM_VALUE: 'DESC'
          }, {
            PARAM_NAME: 'link_status',
            PARAM_VALUE: 'VALID'
          })
        } else if ((methodType === 'GET_TABLE_WITH_MULTIPLE_FILTERS' || methodType === 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED') &&
          ((props.customId === 'VALID_OUTGOING_ANIMAL_MOVEMENTS' || props.customId === 'FINISHED_OUTGOING_ANIMAL_MOVEMENTS') ||
            (props.customId === 'VALID_OUTGOING_FLOCK_MOVEMENTS' || props.customId === 'FINISHED_OUTGOING_FLOCK_MOVEMENTS') ||
            (props.customId === 'VALID_OUTGOING_HERD_MOVEMENTS' || props.customId === 'FINISHED_OUTGOING_HERD_MOVEMENTS'))) {
          let filterValue = 'VALID'
          if (strcmp(props.customId, 'FINISHED_OUTGOING_ANIMAL_MOVEMENTS') || strcmp(props.customId, 'FINISHED_OUTGOING_FLOCK_MOVEMENTS') ||
            strcmp(props.customId, 'FINISHED_OUTGOING_HERD_MOVEMENTS')) {
            filterValue = 'NOTVALID'
            enableMultiSelect = false
          }
          let holdingPic = ''
          this.props.selectedObjects.forEach(obj => {
            if (obj.active && obj.gridType === 'HOLDING') {
              holdingPic = obj.row['HOLDING.PIC']
            }
          })
          gridId = `${showGrid}_${parentId}_${props.customId}`
          params = []
          params.push({
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'table_name',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'fieldNames',
            PARAM_VALUE: 'SOURCE_HOLDING_ID,STATUS'
          }, {
            PARAM_NAME: 'criterumConjuction',
            PARAM_VALUE: 'AND'
          }, {
            PARAM_NAME: 'fieldValues',
            PARAM_VALUE: `${holdingPic},${filterValue}`
          }, {
            PARAM_NAME: 'no_rec',
            PARAM_VALUE: 10000
          }, {
            PARAM_NAME: 'sortOrder',
            PARAM_VALUE: 'DESC'
          })
        } else if (methodType === 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED' && showGrid === 'MOVEMENT_DOC' && props.customGridId) {
          let fieldName = 'PARENT_ID'
          let fieldValue = parentId
          let filterValue = 'DRAFT'
          if (strcmp(props.customGridId, 'incoming_movement_doc') || strcmp(props.customGridId, 'finished_incoming_movement_doc')) {
            fieldName = 'DESTINATION_HOLDING_PIC'
            let holdingPic = ''
            this.props.selectedObjects.forEach(obj => {
              if (obj.active && obj.gridType === 'HOLDING') {
                holdingPic = obj.row['HOLDING.PIC']
              }
            })
            fieldValue = holdingPic
          }
          if (strcmp(props.customGridId, 'finished_incoming_movement_doc') || strcmp(props.customGridId, 'finished_outgoing_movement_doc')) {
            filterValue = 'NOTIN-DRAFT'
            enableMultiSelect = false
          }
          gridId = `${showGrid}_${parentId}_${props.customGridId}`
          params = []
          if (strcmp(props.holdingType, '7') && strcmp(props.customGridId, 'finished_incoming_movement_doc')) {
            methodType = 'GET_FINISHED_MOVEMENT_DOCS'
            params.push({
              PARAM_NAME: 'gridConfigWeWant',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'table_name',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'destinationHoldingPic',
              PARAM_VALUE: fieldValue
            }, {
              PARAM_NAME: 'dateFrom',
              PARAM_VALUE: props.finishedMovementDocumentsDateFrom || null
            }, {
              PARAM_NAME: 'dateTo',
              PARAM_VALUE: props.finishedMovementDocumentsDateTo || null
            }, {
              PARAM_NAME: 'rowlimit',
              PARAM_VALUE: 5000
            })
          } else {
            params.push({
              PARAM_NAME: 'gridConfigWeWant',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'table_name',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'fieldNames',
              PARAM_VALUE: `${fieldName},STATUS`
            }, {
              PARAM_NAME: 'criterumConjuction',
              PARAM_VALUE: 'AND'
            }, {
              PARAM_NAME: 'fieldValues',
              PARAM_VALUE: `${fieldValue},${filterValue}`
            }, {
              PARAM_NAME: 'no_rec',
              PARAM_VALUE: 10000
            }, {
              PARAM_NAME: 'sortOrder',
              PARAM_VALUE: 'DESC'
            })
          }
        } else if (methodType === 'GET_TABLE_WITH_LIKE_FILTER') {
          let searchForValue = 'null'
          let searchBy = props.searchParams.SEARCH_CRITERIA
          props.selectedObjects.map(singleObj => {
            if (strcmp(singleObj.gridType, parentType)) {
              if (singleObj.row[parentType + '.' + 'OBJECT_ID'] === parentId) {
                searchForValue = singleObj.row[parentType + '.' + searchBy]
              }
            }
          })
          params = []
          params.push({
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'svSession',
            PARAM_VALUE: props.svSession
          }, {
            PARAM_NAME: 'objectName',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'searchBy',
            PARAM_VALUE: encodeURIComponent(searchBy)
          }, {
            PARAM_NAME: 'searchForValue',
            PARAM_VALUE: encodeURIComponent(searchForValue)
          }, {
            PARAM_NAME: 'rowlimit',
            PARAM_VALUE: 10000
          })
        } else if (methodType === 'GET_DATA_WITH_FILTER') {
          let fieldName = props.searchParams.SEARCH_CRITERIA
          let searchForValue = ''
          if (props.selectedObjects) {
            props.selectedObjects.forEach(object => {
              if (object.gridType === 'HEALTH_PASSPORT') {
                searchForValue = object.row['HEALTH_PASSPORT.PET_ID']
              } else if (object.gridType === 'HOLDING') {
                searchForValue = object.row['HOLDING.OBJECT_ID']
              }
            })
          }
          params = []
          params.push({
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'table_name',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'fieldNAme',
            PARAM_VALUE: fieldName
          }, {
            PARAM_NAME: 'fieldValue',
            PARAM_VALUE: searchForValue
          }, {
            PARAM_NAME: 'no_rec',
            PARAM_VALUE: 10000
          })
        } else if (methodType === 'GET_LINKED_USER_GROUPS_PER_USER') {
          params = []
          params.push({
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'session',
            PARAM_VALUE: props.svSession
          }, {
            PARAM_NAME: 'userObjectId',
            PARAM_VALUE: parentId
          })
        } else if (methodType === 'GET_BY_PARENTID_ASC_OR_DESC') {
          params = []
          params.push({
            PARAM_NAME: 'gridConfigWeWant',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'parentId',
            PARAM_VALUE: parentId
          }, {
            PARAM_NAME: 'objectType',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'orderByField',
            PARAM_VALUE: 'pkid'
          }, {
            PARAM_NAME: 'ascOrDesc',
            PARAM_VALUE: 'DESC'
          })
        }
      }
      if (props.customWs && this.props.getUserGroups === 'LABORANT') {
        methodType = props.customWs
        if (methodType === 'SHOW_LABORATORY_PER_USER') {
          params = []
          params.push({
            PARAM_NAME: 'session',
            PARAM_VALUE: props.svSession
          }
          )
          gridId = `${showGrid}_${parentId}`
        }
      }

      if (isContainer) {
        if ((this.props.userIsLinkedToOneHolding || this.props.userIsLinkedToTwoOrMoreHoldings) ||
          (this.state.userIsLinkedToOneHolding || this.state.userIsLinkedToTwoOrMoreHoldings)) {
          if (props.customId && props.customId === 'TERMINATED_ANIMALS') {
            onRowClick = this.generateObjectsForParent
          } else {
            isContainer = false
            onRowClick = this.editItemOnRowClick
          }
        } else if ((!this.props.userIsLinkedToOneHolding && !this.props.userIsLinkedToTwoOrMoreHoldings) ||
          (!this.state.userIsLinkedToOneHolding && !this.state.userIsLinkedToTwoOrMoreHoldings)) {
          onRowClick = this.generateObjectsForParent
        }
      }

      let customButton = this.customButton // props.gridInModal ? this.generateGridInModal(props, gridId) : this.customButton(gridId)
      let hasLinkGridInModal
      menuConfig('SHOW_GRIDMODAL_TO_LINK_TO_TABLE') && menuConfig('SHOW_GRIDMODAL_TO_LINK_TO_TABLE').map((element) => {
        if (linkedTable === element.TABLE && (showGrid === element.LINKEDTABLE) && element.LINKS) {
          customButton = () => this.generateGridInModal(props, gridId)
          hasLinkGridInModal = true
          toggleCustomButton = true
        }
      })

      if (this.props.userIsLinkedToOneHolding || this.props.userIsLinkedToTwoOrMoreHoldings) {
        if (this.props.showGrid === 'HOLDING_RESPONSIBLE') {
          insertNewRow = null
        } else {
          customButton = null
          hasLinkGridInModal = false
          toggleCustomButton = false
        }
      }

      let renderGrid = GridManager.generateExportableGridWithCustomBtn(
        gridId, gridId, 'CUSTOM_GRID',
        methodType, params, 'CUSTOM', onRowClick, insertNewRow,
        enableMultiSelect, onSelectChangeFunct, gridHeight, gridWidth,
        toggleCustomButton, customButton, hasLinkGridInModal
      )

      ComponentManager.setStateForComponent(
        gridId, null,
        {
          onRowClickFunct: onRowClick,
          addRowSubgrid: insertNewRow,
          toggleCustomButton,
          customButton: customButton,
          hasLinkGridInModal
        }
      )
      GridManager.reloadGridData(gridId)
      this.setState({ renderGrid })
    }
  }

  insertNewRow (gridId) {
    this.generateForm(null, gridId, this.props, false)
  }

  customButton = (gridId) => {
    this.generateForm(null, gridId, this.props, true)
  }

  generateGridInModal = (props, gridId) => {
    const linkData = {
      linkName: props.linkName,
      linkedTable: props.linkedTable,
      objectId1: props.parentId,
      gridId: gridId
    }
    this.setState(
      { gridInModal: '' },
      () => this.setState({ gridInModal: <this.props.gridInModal {...linkData} /> })
    )
  }

  generateObjectsForParent (gridId, rowIdx, row) {
    selectObject(gridId, row)
    if ((this.props.showGrid === 'QUARANTINE' && this.props.parentType === 'HOLDING') ||
      (this.props.showGrid === 'HOLDING' && this.props.parentType === 'HOLDING_RESPONSIBLE') ||
      (this.props.showGrid === 'PET' && this.props.parentType === 'HOLDING_RESPONSIBLE') ||
      (this.props.showGrid === 'PET' && this.props.parentType === 'HOLDING')) {
      setTimeout(selectObject(gridId, row), 300)
    }
  }

  editItemOnRowClick (gridId, rowIdx, row) {
    const objectId = row[`${this.props.showGrid}.OBJECT_ID`]
    this.generateForm(objectId, gridId, this.props)
  }

  generateForm (objectId, gridId, props, enableExcludedFields) {
    if (this.state.showPopup === false) {
      this.setState({ showPopup: true, recObjId: objectId })
    }
    const formFieldsToBeEcluded = props.formFieldsToBeEcluded
    const params = []
    let formWeWant = props.showGrid
    let formId = `${formWeWant}_FORM_${props.parentId}`
    if (strcmp(this.props.parentType, 'HOLDING') && strcmp(this.props.showGrid, 'PET')) {
      formId = `${formWeWant}_FORM`
    }
    if (enableExcludedFields) {
      formId = `${formWeWant}_EXCLUDED_FORM_${props.parentId}`
    }
    if (props.linkName) {
      params.push({
        'PARAM_NAME': 'link_name',
        'PARAM_VALUE': props.linkName
      }, {
        'PARAM_NAME': 'link_note',
        'PARAM_VALUE': props.linkNote
      }, {
        'PARAM_NAME': 'table_name_to_link',
        'PARAM_VALUE': props.linkedTable
      }, {
        'PARAM_NAME': 'object_id_to_link',
        'PARAM_VALUE': props.parentId
      }, {
        'PARAM_NAME': 'parent_id',
        'PARAM_VALUE': '0'
      })
    } else {
      params.push({
        'PARAM_NAME': 'parent_id',
        'PARAM_VALUE': props.parentId
      })
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
      PARAM_NAME: 'object_id',
      PARAM_VALUE: objectId || '0'
    })
    if (objectId) {
      formId = `${formWeWant}_FORM_${objectId}`
    }
    let editable = props.hideBtns || 'close'
    if (props.customDelete && props.customDelete !== 'DROP_LINK_OBJECTS') {
      // hide default delete buton if there's a custom delete in config
      editable = 'delete'
    }
    const popUpForm = FormManager.generateForm(
      formId, formId, params, 'formData',
      'GET_FORM_BUILDER', 'GET_UISCHEMA', 'GET_TABLE_FORMDATA',
      this.closeWindow, null, null, null, null, null, editable,
      () => this.onAlertClose(gridId), undefined, enableExcludedFields,
      formFieldsToBeEcluded, props.inputWrapper, props.FormExtension
    )
    ComponentManager.setStateForComponent(formId, null, {
      addCloseFunction: this.closeWindow,
      onAlertClose: () => this.onAlertClose(gridId)
    })
    this.setState({ popUpForm: popUpForm, formId: formId })
  }

  closeWindow () {
    this.setState({ popUpForm: undefined, showPopup: false, formId: null })
  }

  displayCollectionLocationForm = petObjId => {
    const formId = 'STRAY_PET_LOCATION_ADDITIONAL_FORM'
    const params = []
    params.push({
      PARAM_NAME: 'formWeWant',
      PARAM_VALUE: 'STRAY_PET_LOCATION'
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: this.props.svSession
    }, {
      PARAM_NAME: 'table_name',
      PARAM_VALUE: 'STRAY_PET_LOCATION'
    }, {
      PARAM_NAME: 'object_id',
      PARAM_VALUE: '0'
    }, {
      PARAM_NAME: 'parent_id',
      PARAM_VALUE: petObjId
    }, {
      PARAM_NAME: 'locationReason',
      PARAM_VALUE: '1'
    })

    const collectionDetailsForm = FormManager.generateForm(
      formId, formId, params, 'formData',
      'GET_FORM_BUILDER', 'GET_UISCHEMA', 'CUSTOM_GET_TABLE_FORMDATA',
      this.closeCollectionDetailsForm, null, null, null, null, null, 'closeAndDelete',
      () => this.closeCollectionDetailsForm(), undefined, undefined,
      undefined, CustomPetCollectFormWrapper
    )

    this.setState({ showCollectionDetailsForm: true, collectionDetailsForm })
  }

  closeCollectionDetailsForm = () => {
    const gridId = `${this.props.showGrid}_${this.props.parentId}_${this.props.customId}`
    GridManager.reloadGridData(gridId)
    store.dispatch({ type: 'RESET_PET_FORM_AFTER_SAVE' })
    this.setState({ showCollectionDetailsForm: false, collectionDetailsForm: undefined })
  }

  onAlertClose (gridId) {
    if (strcmp(this.props.parentType, 'HOLDING') && strcmp(this.props.showGrid, 'PET')) {
      if (strcmp(this.props.isStrayPet, '1')) {
        this.setState({ popUpForm: undefined, showPopup: false, formId: null })
        store.dispatch({ type: 'RESET_IS_STRAY_PET_SELECTION' })
        this.displayCollectionLocationForm(this.props.createdPetObjId)
      } else {
        this.setState({ popUpForm: undefined, showPopup: false, formId: null })
        GridManager.reloadGridData(gridId)
      }
    } else if (strcmp(this.props.parentType, 'HOLDING') && strcmp(this.props.showGrid, 'PET_QUARANTINE')) {
      this.setState({ popUpForm: undefined, showPopup: false, formId: null })
      GridManager.reloadGridData(gridId)
    }
  }

  initiateDelete = () => {
    this.setState({
      alert: alertUser(
        true,
        'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.delete_record_prompt_title`,
          defaultMessage: `${config.labelBasePath}.main.delete_record_prompt_title`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.delete_record_prompt_message`,
          defaultMessage: `${config.labelBasePath}.main.delete_record_prompt_message`
        }),
        () => customDelete(this.state.formId, this.props.customDelete),
        () => alertUser(false, 'info', ''),
        true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.forms.delete`,
          defaultMessage: `${config.labelBasePath}.main.forms.delete`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.forms.cancel`,
          defaultMessage: `${config.labelBasePath}.main.forms.cancel`
        }),
        true,
        '#8d230f',
        true
      )
    })
  }

  initiateCustomDelete = () => {
    const currentGrid = this.props.showGrid.toLowerCase()
    this.setState({
      alert: alertUser(
        true,
        'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.delete_record_prompt_title_${currentGrid}`,
          defaultMessage: `${config.labelBasePath}.main.delete_record_prompt_title_${currentGrid}`
        }),
        null,
        () => this.customDropLinkDelete(this.props),
        () => alertUser(false, 'info', ''),
        true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.forms.remove`,
          defaultMessage: `${config.labelBasePath}.main.forms.remove`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.forms.cancel`,
          defaultMessage: `${config.labelBasePath}.main.forms.cancel`
        }),
        true,
        '#8d230f',
        true
      )
    })
  }

  customDropLinkDelete = (props) => {
    const server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.DROP_LINK_OBJECTS
    verbPath = verbPath.replace('%session', props.svSession)
    verbPath = verbPath.replace('%objectId1', this.state.recObjId)
    verbPath = verbPath.replace('%tableName1', props.showGrid)
    verbPath = verbPath.replace('%objectId2', props.parentId)
    verbPath = verbPath.replace('%tableName2', props.linkedTable)
    verbPath = verbPath.replace('%linkName', props.linkName)
    let url = `${server}${verbPath}`
    axios.get(url).then(res => {
      this.setState({
        alert: alertUser(
          true,
          'success',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.record_deleted_success`,
            defaultMessage: `${config.labelBasePath}.main.forms.record_deleted_success`
          }),
          null,
          () => {
            alertUser(false, 'info', '')
            this.closeWindow()
            this.reloadGridData(this.props)
          }
        )
      })
    }).catch(() => {
      this.setState({
        alert: alertUser(
          true,
          'error',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.record_deleted_error`,
            defaultMessage: `${config.labelBasePath}.main.forms.record_deleted_error`
          }),
          null,
          () => {
            alertUser(false, 'info', '')
            this.closeWindow()
            this.reloadGridData(this.props)
          }
        )
      })
    })
  }

  reloadGridData = (props) => {
    GridManager.reloadGridData(`${props.showGrid}_${props.parentId}_${props.linkName}`)
  }

  render () {
    return (
      <div>
        {this.props.showGrid ? this.state.renderGrid : null}
        {this.state.showPetQuarantinePopup && this.state.petQuarantinePopup}
        {this.state.showPopup &&
          <div id='form_modal' className='modal' style={{ display: 'block' }}>
            <div id='form_modal_content' className='modal-content'>
              <div className='modal-header'>
                <button
                  id='modal_close_btn'
                  type='button'
                  className='close'
                  onClick={this.closeWindow}
                  data-dismiss='modal'>
                  &times;
                </button>
              </div>
              <div id='form_modal_body' className='modal-body'>
                {this.state.popUpForm}
                {this.props.customDelete && this.state.popUpForm && this.state.recObjId &&
                  this.props.customDelete !== 'DROP_LINK_OBJECTS' &&
                  <button
                    id='customDelete'
                    className='btn_delete_form'
                    style={{ marginTop: '-45px', marginLeft: '20px' }}
                    onClick={this.initiateDelete}>
                    {this.context.intl.formatMessage(
                      {
                        id: `${config.labelBasePath}.main.forms.delete`,
                        defaultMessage: `${config.labelBasePath}.main.forms.delete`
                      }
                    )}
                  </button>
                }
                {this.props.customDelete && this.state.popUpForm && this.state.recObjId &&
                  this.props.customDelete === 'DROP_LINK_OBJECTS' &&
                  <button
                    id='customDeleteAdmConsole'
                    className='btn_delete_form'
                    style={{ marginTop: '-45px', marginLeft: '20px', display: 'none' }}
                    onClick={this.initiateCustomDelete}>
                    {this.props.showGrid === 'SVAROG_ORG_UNITS'
                      ? this.context.intl.formatMessage(
                        {
                          id: `${config.labelBasePath}.main.remove_org_unit_from_user`,
                          defaultMessage: `${config.labelBasePath}.main.remove_org_unit_from_user`
                        }
                      ) : this.props.showGrid === 'LABORATORY'
                        ? this.context.intl.formatMessage(
                          {
                            id: `${config.labelBasePath}.main.remove_laboratory_from_user`,
                            defaultMessage: `${config.labelBasePath}.main.remove_laboratory_from_user`
                          }
                        ) : this.props.showGrid === 'HOLDING'
                          ? this.context.intl.formatMessage(
                            {
                              id: `${config.labelBasePath}.main.remove_holding_from_user`,
                              defaultMessage: `${config.labelBasePath}.main.remove_holding_from_user`
                            }
                          ) : this.props.showGrid === 'AREA'
                            ? this.context.intl.formatMessage(
                              {
                                id: `${config.labelBasePath}.main.remove_geo_filter_population`,
                                defaultMessage: `${config.labelBasePath}.main.remove_geo_filter_population`
                              }
                            ) : ''
                    }
                  </button>
                }
              </div>
            </div>
          </div>
        }
        {this.state.gridInModal}
        {this.state.showCollectionDetailsForm &&
          <div id='form_modal' className='modal' style={{ display: 'block' }}>
            <div id='form_modal_content' className='modal-content'>
              <div id='form_modal_body' className='modal-body' style={{ marginTop: '1rem' }}>
                {this.state.collectionDetailsForm}
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

GridContent.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  selectedGridRows: state.selectedGridRows.selectedGridRows,
  userCanEdit: state.userInfoReducer.isAdmin,
  filterTheTerminatedAnimalsGrid: state.terminatedAnimals.filterTheGrid,
  terminatedAnimalsDateFrom: state.terminatedAnimals.dateFrom,
  terminatedAnimalsDateTo: state.terminatedAnimals.dateTo,
  filterTheTerminatedPetsGrid: state.terminatedPets.filterTheGrid,
  terminatedPetsDateFrom: state.terminatedPets.dateFrom,
  terminatedPetsDateTo: state.terminatedPets.dateTo,
  filterTheReleasedPetsGrid: state.releasedPets.filterTheGrid,
  releasedPetsDateFrom: state.releasedPets.dateFrom,
  releasedPetsDateTo: state.releasedPets.dateTo,
  filterTheFinishedMovementDocumentsGrid: state.finishedMovementDocuments.filterTheGrid,
  finishedMovementDocumentsDateFrom: state.finishedMovementDocuments.dateFrom,
  finishedMovementDocumentsDateTo: state.finishedMovementDocuments.dateTo,
  filterTheFinishedMovementsGrid: state.finishedMovements.filterTheGrid,
  finishedMovementsDateFrom: state.finishedMovements.dateFrom,
  finishedMovementsDateTo: state.finishedMovements.dateTo,
  filterTheOutgoingTransferGrid: state.outgoingTransferFilter.filterTheGrid,
  outgoingTransferTagType: state.outgoingTransferFilter.tagType,
  outgoingTransferStartTagId: state.outgoingTransferFilter.startTagId,
  outgoingTransferEndTagId: state.outgoingTransferFilter.endTagId,
  outgoingTransferDateFrom: state.outgoingTransferFilter.dateFrom,
  outgoingTransferDateTo: state.outgoingTransferFilter.dateTo,
  filterTheIncomingTransferGrid: state.incomingTransferFilter.filterTheGrid,
  incomingTransferTagType: state.incomingTransferFilter.tagType,
  incomingTransferStartTagId: state.incomingTransferFilter.startTagId,
  incomingTransferEndTagId: state.incomingTransferFilter.endTagId,
  incomingTransferDateFrom: state.incomingTransferFilter.dateFrom,
  incomingTransferDateTo: state.incomingTransferFilter.dateTo,
  selectedObjects: state.gridConfig.gridHierarchy,
  getUserGroups: state.userInfoReducer.getUsers,
  userIsLinkedToOneHolding: state.linkedHolding.userIsLinkedToOneHolding,
  userIsLinkedToTwoOrMoreHoldings: state.linkedHolding.userIsLinkedToTwoOrMoreHoldings,
  isStrayPet: state.petForm.isStrayPet,
  createdPetObjId: state.petForm.createdPetObjId
})

export default connect(mapStateToProps)(GridContent)
