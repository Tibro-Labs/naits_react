import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import {
  ComponentManager,
  FormManager,
  GridManager
} from 'components/ComponentsIndex'
import InputWrappers from 'containers/InputWrappers'
import * as config from 'config/config'
import { menuConfig } from 'config/menuConfig.js'
import { disableAddRowConfig } from 'config/disableAddRowConfig.js'
import { selectObject, customDelete, onGridSelectionChange, strcmp } from 'functions/utils'

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
      userIsLinkedToTwoOrMoreHoldings: false
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

    this.getLinkedHoldingsForCurrentUser()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.customId !== nextProps.customId) {
      this.generateGrid(nextProps)
    }

    if (nextProps.showGrid !== this.props.showGrid ||
      nextProps.parentId !== this.props.parentId ||
      nextProps.linkName !== this.props.linkName ||
      nextProps.toggleCustomButton !== this.props.toggleCustomButton) {
      this.generateGrid(nextProps)
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.parentType === 'HOLDING_RESPONSIBLE' && prevProps.linkName !== this.props.linkName) {
      ComponentManager.cleanComponentReducerState(`${this.props.showGrid}_${this.props.parentId}_${prevProps.linkName}`)
    }

    if (this.props.coreObject === 'HOLDING_RESPONSIBLE' && prevProps.linkName !== this.props.linkName) {
      ComponentManager.cleanComponentReducerState(`${this.props.coreObject}_${this.props.parentId}_${prevProps.linkName}`)
    }

    if (prevProps.customId !== this.props.customId &&
      (prevProps.customId === 'COLLECTION_LOCATION' || prevProps.customId === 'RELEASE_LOCATION')) {
      ComponentManager.cleanComponentReducerState(`${this.props.showGrid}_${this.props.parentId}_${prevProps.customId}`)
    }
  }

  componentWillUnmount () {
    const { coreObject, showGrid, parentId, parentType, linkName, customId } = this.props
    if (coreObject === 'HOLDING_RESPONSIBLE') {
      ComponentManager.cleanComponentReducerState(`${coreObject}_${parentId}_${linkName}`)
    }

    if (parentType === 'HOLDING_RESPONSIBLE') {
      ComponentManager.cleanComponentReducerState(`${showGrid}_${parentId}_${linkName}`)
    }

    if (linkName === 'HOLDING_QUARANTINE' || linkName === 'POA' || linkName === 'CUSTOM_POA' ||
      linkName === 'ANIMAL_VACC_BOOK' || linkName === 'ANIMAL_EXPORT_CERT' || linkName === 'DISEASE_QUARANTINE' ||
      linkName === 'SUPPLY' || linkName === 'AREA_POPULATION') {
      ComponentManager.cleanComponentReducerState(`${showGrid}_${parentId}_${linkName}`)
    }

    if (showGrid === 'SPOT_CHECK' || showGrid === 'ANIMAL_MOVEMENT' || showGrid === 'EAR_TAG_REPLC' ||
      showGrid === 'INVENTORY_ITEM' || showGrid === 'PET_HEALTH_BOOK' || showGrid === 'PET_MOVEMENT' ||
      showGrid === 'SVAROG_USER_GROUPS' || showGrid === 'AREA_HEALTH' || showGrid === 'VACCINATION_RESULTS' ||
      showGrid === 'ORDER' || showGrid === 'RANGE' || showGrid === 'LAB_TEST_RESULT') {
      ComponentManager.cleanComponentReducerState(`${showGrid}_${parentId}`)
    }

    if (customId === 'COLLECTION_LOCATION' || customId === 'RELEASE_LOCATION') {
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

  generateCoreObject (gridId, rowIdx, row) {
    selectObject(this.props.coreObject, row)
    setTimeout(selectObject(this.props.coreObject, row), 300)
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
                  insertNewRow = null
                  this.customButton = null
                  toggleCustomButton = false
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
          const searchForValue = props.selectedObjects[1].row['HEALTH_PASSPORT.PET_ID']
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
          isContainer = false
          onRowClick = this.editItemOnRowClick
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
        customButton = null
        hasLinkGridInModal = false
        toggleCustomButton = false
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
      (this.props.showGrid === 'PET' && this.props.parentType === 'HOLDING_RESPONSIBLE')) {
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
    let inputWrapper = props.inputWrapper
    if (props.userIsLinkedToOneHolding || props.userIsLinkedToTwoOrMoreHoldings) {
      inputWrapper = InputWrappers.HoldingResponsibleLinkInputWrapper
    }
    const popUpForm = FormManager.generateForm(
      formId, formId, params, 'formData',
      'GET_FORM_BUILDER', 'GET_UISCHEMA', 'GET_TABLE_FORMDATA',
      this.closeWindow, null, null, null, null, null, editable,
      () => this.onAlertClose(gridId), undefined, enableExcludedFields,
      formFieldsToBeEcluded, inputWrapper, props.FormExtension
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

  onAlertClose (gridId) {
    this.setState({ popUpForm: undefined, showPopup: false, formId: null })
    GridManager.reloadGridData(gridId)
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
      </div>
    )
  }
}

GridContent.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  userCanEdit: state.userInfoReducer.isAdmin,
  selectedObjects: state.gridConfig.gridHierarchy,
  getUserGroups: state.userInfoReducer.getUsers,
  userIsLinkedToOneHolding: state.linkedHolding.userIsLinkedToOneHolding,
  userIsLinkedToTwoOrMoreHoldings: state.linkedHolding.userIsLinkedToTwoOrMoreHoldings
})

export default connect(mapStateToProps)(GridContent)
