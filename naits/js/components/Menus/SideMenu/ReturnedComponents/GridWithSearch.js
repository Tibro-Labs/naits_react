import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import {
  ComponentManager,
  FormManager,
  GridManager,
  GridInModalLinkObjects
} from 'components/ComponentsIndex'
import * as config from 'config/config'
import { selectObject, customDelete, onGridSelectionChange } from 'functions/utils'

class GridWithSearch extends React.Component {
  static propTypes = {
    showGrid: PropTypes.string.isRequired,
    parentId: PropTypes.number.isRequired,
    linkName: PropTypes.string
    // isContainer: PropTypes.bool
  }
  constructor (props) {
    super(props)
    this.state = {
      showPopup: false,
      popUpForm: undefined,
      renderGrid: undefined,
      formId: null,
      recObjId: null
    }
  }

  componentDidMount () {
    if (this.props.showGrid) {
      this.generateGrid(this.props)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.showGrid !== this.props.showGrid ||
      nextProps.parentId !== this.props.parentId ||
      nextProps.linkName !== this.props.linkName ||
      nextProps.toggleCustomButton !== this.props.toggleCustomButton) {
      this.generateGrid(nextProps)
    }
  }

  generateGrid = (props) => {
    const onSelectChangeFunct = props.onSelectChangeFunct || onGridSelectionChange
    let parentId = null
    for (let i = 0; i < props.selectedObjects.length; i++) {
      if (props.selectedObjects[i].active) {
        const gridType = this.props.selectedObjects[i].gridType
        /* this is the main criteria config for the multifilter table;
        value located in the MAIN_CRIT key
        column name is in the first criteria item before the comma ","
        example: CRITERIA: 'SOURCE_HOLDING_ID, ...', MAIN_CRIT: 'PIC' */
        const val = props.valueForCol || 'OBJECT_ID'
        parentId = this.props.selectedObjects[i].row[`${gridType}.${val}`]
      }
    }

    if (props) {
      const renderGrid = <GridInModalLinkObjects
        noModal
        loadFromParent
        onRowSelect={this.editItemOnRowClick}
        linkedTable={props.showGrid}
        key={props.showGrid}
        enableMultiSelect
        onSelectChangeFunct={onSelectChangeFunct}
        searchFromComponentProps
        altCriteria={props.column || 'PARENT_ID'}
        altValue={parentId}
      />

      this.setState({ renderGrid })
    }
  }

  insertNewRow = (gridId) => {
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

  generateObjectsForParent = (gridId, rowIdx, row) => {
    selectObject(gridId, row)
  }

  editItemOnRowClick = () => {
    const gridId = this.props.showGrid
    const objectId = store.getState()[gridId].rowClicked[`${this.props.showGrid}.OBJECT_ID`]
    this.generateForm(objectId, gridId, this.props)
  }

  generateForm = (objectId, gridId, props, enableExcludedFields) => {
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

  closeWindow = () => {
    this.setState({ popUpForm: undefined, showPopup: false, formId: null })
  }

  onAlertClose = (gridId) => {
    this.setState({ popUpForm: undefined, showPopup: false, formId: null })
    GridManager.reloadGridData(gridId)
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
    return (
      <div style={{ marginTop: this.props.showGrid === 'INVENTORY_ITEM' ? '2rem' : null }}>
        {this.props.showGrid ? this.state.renderGrid : null}
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
      </div>
    )
  }
}

GridWithSearch.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  userCanEdit: state.userInfoReducer.isAdmin,
  selectedObjects: state.gridConfig.gridHierarchy,
  getUserGroups: state.userInfoReducer.getUsers
})

export default connect(mapStateToProps)(GridWithSearch)
