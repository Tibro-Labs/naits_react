import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import { store, removeAsyncReducer, updateSelectedRows } from 'tibro-redux'
import { ComponentManager, FormManager, GridManager, Loading } from 'components/ComponentsIndex'
import { CustomPetCollectFormWrapper } from 'containers/InputWrappers'
import * as config from 'config/config'
import { menuConfig } from 'config/menuConfig.js'
import { disableAddRowConfig } from 'config/disableAddRowConfig.js'
import { strcmp, selectObject, customDelete, handleRowSelectionChange } from 'functions/utils'

class MultiGrid extends React.Component {
  static propTypes = {
    showGrid: PropTypes.string.isRequired,
    parentId: PropTypes.number.isRequired,
    linkName: PropTypes.string
    // isContainer: PropTypes.bool
  }
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      showPopup: false,
      popUpForm: undefined,
      renderGrid: [],
      formId: null,
      recObjId: null,
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
  }

  componentDidMount () {
    if (this.props.showGrid) {
      this.generateMultipleGrids(this.props)
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.customId !== this.props.customId &&
      (prevProps.customId === 'TRANSFER_INCOME' || prevProps.customId === 'TRANSFER_OUTCOME' ||
        prevProps.customId === 'INCOMING_MOVEMENT' || prevProps.customId === 'OUTGOING_MOVEMENT')) {
      ComponentManager.cleanComponentReducerState(`${prevProps.customId}_${this.props.parentId}_1`)
      ComponentManager.cleanComponentReducerState(`${prevProps.customId}_${this.props.parentId}_2`)
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ loading: nextProps.isLoading })
    if (nextProps.showGrid !== this.props.showGrid ||
      nextProps.parentId !== this.props.parentId ||
      nextProps.linkName !== this.props.linkName ||
      nextProps.toggleCustomButton !== this.props.toggleCustomButton ||
      nextProps.multiGrid.CRITERIA !== this.props.multiGrid.CRITERIA) {
      if (this.state.renderGrid.length >= 2) {
        if (nextProps.showGrid === 'MOVEMENT_DOC') {
          // we need this because different movement-doc grids which are FILTERED have the same ID in store
          removeAsyncReducer(store, `${nextProps.showGrid}_${nextProps.parentId}1`)
          removeAsyncReducer(store, `${nextProps.showGrid}_${nextProps.parentId}2`)
        }
        this.setState({ renderGrid: [] }, () => { this.generateMultipleGrids(nextProps) })
      } else {
        this.generateMultipleGrids(nextProps)
      }
    }

    if (this.props.customId !== nextProps.customId) {
      this.props.updateSelectedRows([], null)
    }

    if (this.props.selectedGridRows.gridId !== nextProps.selectedGridRows.gridId) {
      const { customId, parentType, parentId, showGrid } = this.props
      let gridIdPrime, gridIdSec
      if (customId && customId === 'TRANSFER_INCOME' &&
        (parentType === 'SVAROG_ORG_UNITS' || parentType === 'HOLDING')) {
        gridIdPrime = `${customId}_${parentId}_1`
        gridIdSec = `${customId}_${parentId}_2`

        if (nextProps.selectedGridRows.gridId === gridIdPrime) {
          ComponentManager.setStateForComponent(gridIdSec, null, {
            selectedIndexes: []
          })
        } else if (nextProps.selectedGridRows.gridId === gridIdSec) {
          ComponentManager.setStateForComponent(gridIdPrime, null, {
            selectedIndexes: []
          })
        }
      } else if (customId && customId === 'TRANSFER_OUTCOME' &&
        (parentType === 'SVAROG_ORG_UNITS' || parentType === 'HOLDING')) {
        gridIdPrime = `${customId}_${parentId}_1`
        gridIdSec = `${customId}_${parentId}_2`

        if (nextProps.selectedGridRows.gridId === gridIdPrime) {
          ComponentManager.setStateForComponent(gridIdSec, null, {
            selectedIndexes: []
          })
        } else if (nextProps.selectedGridRows.gridId === gridIdSec) {
          ComponentManager.setStateForComponent(gridIdPrime, null, {
            selectedIndexes: []
          })
        }
      }

      if (parentType === 'HOLDING' && (showGrid === 'ANIMAL' || showGrid === 'FLOCK' || showGrid === 'HERD')) {
        gridIdPrime = `${showGrid}_${parentId}1`
        gridIdSec = `${showGrid}_${parentId}2`

        if (nextProps.selectedGridRows.gridId === gridIdPrime) {
          ComponentManager.setStateForComponent(gridIdSec, null, {
            selectedIndexes: []
          })
        } else if (nextProps.selectedGridRows.gridId === gridIdSec) {
          ComponentManager.setStateForComponent(gridIdPrime, null, {
            selectedIndexes: []
          })
        }
      }
    }
  }

  componentWillUnmount () {
    const { showGrid, parentId, linkName, customId } = this.props
    if (showGrid === 'ANIMAL' || showGrid === 'FLOCK' || showGrid === 'HERD' || showGrid === 'MOVEMENT_DOC' || showGrid === 'ANIMAL_MOVEMENT' ||
      showGrid === 'FLOCK_MOVEMENT' || showGrid === 'LAB_SAMPLE' || showGrid === 'PET' || showGrid === 'HEALTH_PASSPORT') {
      ComponentManager.cleanComponentReducerState(`${showGrid}_${parentId}1`)
      ComponentManager.cleanComponentReducerState(`${showGrid}_${parentId}2`)
    }

    if (linkName === 'ANIMAL_MOVEMENT_HOLDING' || linkName === 'FLOCK_MOVEMENT_HOLDING') {
      ComponentManager.cleanComponentReducerState(`${showGrid}_${parentId}_${linkName}1`)
      ComponentManager.cleanComponentReducerState(`${showGrid}_${parentId}_${linkName}2`)
    }

    if (customId === 'TRANSFER_INCOME' || customId === 'TRANSFER_OUTCOME' || customId === 'INCOMING_MOVEMENT' ||
      customId === 'OUTGOING_MOVEMENT') {
      ComponentManager.cleanComponentReducerState(`${customId}_${parentId}_1`)
      ComponentManager.cleanComponentReducerState(`${customId}_${parentId}_2`)
    }
  }

  generateMultipleGrids = (props) => {
    this.generateGrid(props, props.multiGrid.CRITERIA, null, null, props.multiGrid.FIRST_VALUE, '1')
    this.generateGrid(
      props, props.multiGrid.CRITERIA, props.multiGrid.SECONDARY_CRITERIA,
      props.multiGrid.CONJUNCTION, props.multiGrid.SECOUND_VALUE, '2'
    )
  }

  generateGrid (props, filterByCol, altCriteria, conjunction, filterValue, position) {
    if (props) {
      const {
        showGrid, parentId, linkName, isContainer, gridConfig, linkedTable
      } = props
      let toggleCustomButton = this.props.toggleCustomButton
      let insertNewRow = () => this.insertNewRow(gridId)
      let gridId = `${showGrid}_${parentId}${position}`
      let enableMultiSelect = this.props.enableMultiSelect
      let onSelectChangeFunct = this.props.onSelectChangeFunct
      let methodType = 'GET_TABLE_WITH_FILTER'
      let onRowClick = this.editItemOnRowClick
      let gridHeight = gridConfig ? (gridConfig.SIZE ? gridConfig.SIZE.HEIGHT : null) : null
      let gridWidth = gridConfig ? (gridConfig.SIZE ? gridConfig.SIZE.WIDTH : null) : null

      // gridHeight = ((window.innerHeight - 150) * 0.95) / 2
      var parent = document.getElementById('displayContent')
      gridWidth = (parent.offsetWidth * 48) / 100
      gridHeight = parent.offsetHeight - 200

      if (props.disableEdit && !props.userCanEdit) {
        onRowClick = null
      }

      let params = []
      if (props.disableEditForSubmodules || props.disableAddRow) {
        insertNewRow = null
        this.customButton = null
        toggleCustomButton = false
      }
      let customButton = this.customButton // props.gridInModal ? this.generateGridInModal(props, gridId) : this.customButton(gridId)
      let hasLinkGridInModal
      menuConfig('SHOW_GRIDMODAL_TO_LINK_TO_TABLE') && menuConfig('SHOW_GRIDMODAL_TO_LINK_TO_TABLE').map((element) => {
        if (linkedTable === element.TABLE && (showGrid === element.LINKEDTABLE) && element.LINKS) {
          customButton = () => this.generateGridInModal(props, gridId)
          hasLinkGridInModal = true
        }
      })
      disableAddRowConfig('DISABLE_ADD_ROW_FOR_TABLE_SECOND_LEVEL') &&
        disableAddRowConfig('DISABLE_ADD_ROW_FOR_TABLE_SECOND_LEVEL').LIST_OF_ITEMS.map((element) => {
          // Disable add button for some grids defined in disableAddRowConfig
          if (element.PARENT_SUBTYPE && element.PARENT_TYPE && showGrid === element.TABLE) {
            props.selectedObjects.forEach(grid => {
              if (grid.active) {
                if (grid.row[element.PARENT_TYPE + '.TYPE'] === element.PARENT_SUBTYPE) {
                  insertNewRow = null
                  this.customButton = null
                  toggleCustomButton = false
                }
              }
            })
          } else if (showGrid === element.TABLE) {
            insertNewRow = null
            this.customButton = null
            toggleCustomButton = false
          }
        })
      disableAddRowConfig('DISABLE_ADD_ROW_FOR_TABLE_THIRD_LEVEL') &&
        disableAddRowConfig('DISABLE_ADD_ROW_FOR_TABLE_THIRD_LEVEL').LIST_OF_ITEMS.map((element) => {
          // Disable add button for some grids defined in disableAddRowConfig
          if (element.PARENT_TYPE && showGrid === element.TABLE) {
            props.selectedObjects.forEach(grid => {
              if (grid.active) {
                if (grid.gridId === element.PARENT_TYPE) {
                  insertNewRow = null
                  this.customButton = null
                  toggleCustomButton = false
                }
              }
            })
          }
        })
      if (filterValue === props.multiGrid.SECOUND_VALUE) {
        insertNewRow = null
        this.customButton = null
        toggleCustomButton = false
        enableMultiSelect = false
        onSelectChangeFunct = null
        if ((props.isSpecificType || ['TRANSFER'].includes(showGrid)) && props.showGrid !== 'PASSPORT_REQUEST') {
          enableMultiSelect = true
          onSelectChangeFunct = this.props.onSelectChangeFunct
        }
        if (props.showGrid === 'PET_MOVEMENT' && props.parentType === 'HOLDING') {
          enableMultiSelect = false
          onSelectChangeFunct = this.props.onSelectChangeFunct
        }
        if (props.showGrid === 'PET' && props.parentType === 'HOLDING') {
          enableMultiSelect = false
        }
      }
      params.push({
        PARAM_NAME: 'gridConfigWeWant',
        PARAM_VALUE: showGrid
      }, {
        PARAM_NAME: 'session',
        PARAM_VALUE: props.svSession
      }, {
        PARAM_NAME: 'parentColumn',
        PARAM_VALUE: 'PARENT_ID'
      }, {
        PARAM_NAME: 'parentId',
        PARAM_VALUE: parentId
      }, {
        PARAM_NAME: 'objectName',
        PARAM_VALUE: showGrid
      }, {
        PARAM_NAME: 'objectType',
        PARAM_VALUE: showGrid
      }, {
        PARAM_NAME: 'rowlimit',
        PARAM_VALUE: 10000
      }, {
        PARAM_NAME: 'searchBy',
        PARAM_VALUE: filterByCol
      }, {
        PARAM_NAME: 'searchForValue',
        PARAM_VALUE: filterValue
      }, {
        PARAM_NAME: 'criterumConjuction',
        PARAM_VALUE: 'AND'
      })
      if (linkName) {
        methodType = 'GET_BYLINK'
        params.push({
          PARAM_NAME: 'linkName',
          PARAM_VALUE: linkName
        })
        gridId = `${showGrid}_${parentId}_${linkName}${position}`
      }
      if (props.customWs) {
        methodType = props.customWs
        params.push(
          {
            PARAM_NAME: 'objectId',
            PARAM_VALUE: parentId
          }, {
            PARAM_NAME: 'statuses',
            PARAM_VALUE: filterValue
          }, {
            PARAM_NAME: 'table_name',
            PARAM_VALUE: showGrid
          }, {
            PARAM_NAME: 'link_status',
            PARAM_VALUE: 'VALID'
          }
        )
        gridId = `${showGrid}_${parentId}_${linkName}${position}`
      }
      if (props.customWs === 'GET_TABLE_WITH_MULTIPLE_FILTERS' || props.customWs === 'GET_TABLE_WITH_MULTIPLE_FILTERS_SORTED') {
        methodType = props.customWs
        let gridType, mainVal
        for (let i = 0; i < props.selectedObjects.length; i++) {
          if (props.selectedObjects[i].active) {
            gridType = this.props.selectedObjects[i].gridType
            /* this is the main criteria config for the multifilter table;
            value located in the MAIN_CRIT key
            column name is in the first criteria item before the comma ","
            example: CRITERIA: 'SOURCE_HOLDING_ID, ...', MAIN_CRIT: 'PIC' */
            mainVal = this.props.selectedObjects[i].row[`${gridType}.${props.multiGrid.MAIN_CRIT}`]
          }
        }

        let multipleCriteria = 'AND'
        let altMultipleCriteria = 'AND,AND'
        if (altCriteria) {
          filterByCol = `${filterByCol},${altCriteria}`
          multipleCriteria = conjunction
        }

        if (strcmp(props.showGrid, 'ANIMAL') && strcmp(props.parentType, 'HOLDING') && props.holdingType && strcmp(props.holdingType, '7')) {
          if (filterValue.includes('NOTIN')) {
            filterValue = 'NOTIN-VALID-PREMORTEM-POSTMORTEM-DESTROYED'
          }
        }

        // if (props.showGrid === 'ANIMAL' && props.parentType === 'HOLDING') {
        //   multipleCriteria = 'AND,AND'
        // }
        if (mainVal) {
          if (props.customId === 'RELEASE_LOCATION') {
            params = []
            params.push({
              PARAM_NAME: 'gridConfigWeWant',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'session',
              PARAM_VALUE: props.svSession
            }, {
              PARAM_NAME: 'table_name',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'objectName',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'objectType',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'rowlimit',
              PARAM_VALUE: 10000
            }, {
              PARAM_NAME: 'fieldNames',
              PARAM_VALUE: filterByCol
            }, {
              PARAM_NAME: 'fieldValues',
              PARAM_VALUE: filterValue + ',' + mainVal
            }, {
              PARAM_NAME: 'no_rec',
              PARAM_VALUE: 10000
            }, {
              PARAM_NAME: 'criterumConjuction',
              PARAM_VALUE: altMultipleCriteria
            })
          } else if (props.customId === 'COLLECTION_LOCATION') {
            params = []
            params.push({
              PARAM_NAME: 'gridConfigWeWant',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'session',
              PARAM_VALUE: props.svSession
            }, {
              PARAM_NAME: 'table_name',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'objectName',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'objectType',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'rowlimit',
              PARAM_VALUE: 10000
            }, {
              PARAM_NAME: 'fieldNames',
              PARAM_VALUE: filterByCol
            }, {
              PARAM_NAME: 'fieldValues',
              PARAM_VALUE: mainVal + ',' + filterValue
            }, {
              PARAM_NAME: 'no_rec',
              PARAM_VALUE: 10000
            }, {
              PARAM_NAME: 'criterumConjuction',
              PARAM_VALUE: altMultipleCriteria
            })
          } else {
            params = []
            params.push({
              PARAM_NAME: 'gridConfigWeWant',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'session',
              PARAM_VALUE: props.svSession
            }, {
              PARAM_NAME: 'table_name',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'objectName',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'objectType',
              PARAM_VALUE: showGrid
            }, {
              PARAM_NAME: 'rowlimit',
              PARAM_VALUE: 10000
            }, {
              PARAM_NAME: 'fieldNames',
              PARAM_VALUE: filterByCol
            }, {
              PARAM_NAME: 'fieldValues',
              PARAM_VALUE: mainVal + ',' + filterValue
            }, {
              PARAM_NAME: 'no_rec',
              PARAM_VALUE: 10000
            }, {
              PARAM_NAME: 'sortOrder',
              PARAM_VALUE: 'DESC'
            }, {
              PARAM_NAME: 'criterumConjuction',
              PARAM_VALUE: multipleCriteria
            })
          }
        }
        gridId = `${showGrid}_${parentId}${position}`
      }
      if (isContainer) {
        onRowClick = this.generateObjectsForParent
      }

      if (props.customId) {
        gridId = `${props.customId}_${parentId}_${position}`
      }
      if (props.customRowSelect) {
        onSelectChangeFunct = (selectedRows, gridId) => handleRowSelectionChange(selectedRows, gridId, showGrid, position)
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
          hasLinkGridInModal,
          minWidth: gridWidth,
          minHeight: gridHeight
        }
      )
      GridManager.reloadGridData(gridId)
      let grids = this.state.renderGrid
      grids.push(renderGrid)
      this.setState({ renderGrid: grids })
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
    if ((this.props.showGrid === 'ANIMAL' && this.props.parentType === 'HOLDING') ||
      (this.props.showGrid === 'PET' && this.props.parentType === 'HOLDING') ||
      (this.props.showGrid === 'HEALTH_PASSPORT' && this.props.parentType === 'PET') ||
      (this.props.showGrid === 'LAB_SAMPLE' && this.props.parentType === 'ANIMAL') ||
      (this.props.showGrid === 'LAB_SAMPLE' && this.props.parentType === 'HERD')) {
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
    if (strcmp(props.parentType, 'HOLDING') && strcmp(props.showGrid, 'PET')) {
      formId = `${formWeWant}_FORM`
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
    let editable = props.hideBtns || undefined
    if (props.customDelete) {
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

  onAlertClose (gridId) {
    if (gridId.includes('HEALTH_PASSPORT')) {
      let secondGridId = `${gridId.slice(0, -1)}2`
      this.setState({ popUpForm: undefined, showPopup: false, formId: null })
      GridManager.reloadGridData(gridId)
      GridManager.reloadGridData(secondGridId)
    } else if (strcmp(this.props.parentType, 'HOLDING') && strcmp(this.props.showGrid, 'PET')) {
      if (strcmp(this.props.isStrayPet, '1')) {
        this.setState({ popUpForm: undefined, showPopup: false, formId: null })
        store.dispatch({ type: 'RESET_IS_STRAY_PET_SELECTION' })
        this.displayCollectionLocationForm(this.props.createdPetObjId)
      } else {
        let secondGridId = `${gridId.slice(0, -1)}2`
        this.setState({ popUpForm: undefined, showPopup: false, formId: null })
        GridManager.reloadGridData(gridId)
        GridManager.reloadGridData(secondGridId)
        store.dispatch({ type: 'RESET_IS_STRAY_PET_SELECTION' })
      }
    } else {
      this.setState({ popUpForm: undefined, showPopup: false, formId: null })
      GridManager.reloadGridData(gridId)
    }
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
    const firstGridId = `PET_${this.props.parentId}1`
    const secondGridId = `PET_${this.props.parentId}2`
    GridManager.reloadGridData(firstGridId)
    GridManager.reloadGridData(secondGridId)
    store.dispatch({ type: 'RESET_PET_FORM_AFTER_SAVE' })
    this.setState({ showCollectionDetailsForm: false, collectionDetailsForm: undefined })
  }

  initiateDelete = () => {
    this.setState({
      alert: alertUser(
        true,
        'warning',
        this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.delete_record_prompt_title`, defaultMessage: `${config.labelBasePath}.main.delete_record_prompt_title` }),
        this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.delete_record_prompt_message`, defaultMessage: `${config.labelBasePath}.main.delete_record_prompt_message` }),
        () => customDelete(this.state.formId, this.props.customDelete),
        () => alertUser(false, 'info', ''),
        true,
        this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.forms.delete`, defaultMessage: `${config.labelBasePath}.main.forms.delete` }),
        this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.forms.cancel`, defaultMessage: `${config.labelBasePath}.main.forms.cancel` }),
        true,
        '#8d230f',
        true
      )
    })
  }

  render () {
    const grids = this.state.renderGrid.map((element, index) =>
      <li key={index} id={`grid${index}`} style={{ display: 'inline-block' }}>
        {element}
      </li>
    )
    return (
      <div>
        {this.state.loading ? <Loading /> : null}
        <ul id='grids' style={{ listStyleType: 'none', padding: '0', marginTop: '1rem' }}>
          {grids}
        </ul>
        {this.state.showPopup &&
          <div id='form_modal' className='modal' style={{ display: 'block' }}>
            <div id='form_modal_content' className='modal-content'>
              <div className='modal-header'>
                <button id='modal_close_btn' type='button' className='close' onClick={this.closeWindow} data-dismiss='modal'>&times;</button>
              </div>
              <div id='form_modal_body' className='modal-body'>
                {this.state.popUpForm}
                {this.props.customDelete && this.state.popUpForm && this.state.recObjId &&
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

MultiGrid.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => ({
  updateSelectedRows: (...params) => {
    dispatch(updateSelectedRows(...params))
  }
})

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  selectedObjects: state.gridConfig.gridHierarchy,
  isLoading: state.massActionResult.loading,
  selectedGridRows: state.selectedGridRows,
  isStrayPet: state.petForm.isStrayPet,
  createdPetObjId: state.petForm.createdPetObjId
})

export default connect(mapStateToProps, mapDispatchToProps)(MultiGrid)
