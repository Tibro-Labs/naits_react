import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ComponentManager, GridInModalLinkObjects, ResultsGrid } from 'components/ComponentsIndex'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import * as config from 'config/config'
import { menuConfig } from 'config/menuConfig'

class OldRfidFormInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      events: ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop'],
      isSecondLevel: false,
      shouldRemoveDestination: false,
      alert: false,
      displayPopup: false,
      displayCampaignPopup: false,
      gridToDisplay: 'VACCINATION_EVENT',
      fieldIdName: 'CAMPAIGN_NAME',
      fieldIdNameAlt: 'CAMPAIGN_OBJ_ID',
      holdingGrid: 'HOLDING',
      exportCertGrid: 'EXPORT_CERT',
      sectionName: 'rfid.animal_type_info',
      altSectionName: 'rfid.action_type',
      earTagSectionName: 'rfid.tag_information',
      destinationNumber: 'DESTINATION_NUMBER',
      subActionType: 'SUBACTION_TYPE',
      formSectionsClassName: 'form-group field field-object',
      destinationInputId: 'root_rfid.animal_type_info_DESTINATION_NUMBER',
      actionTypeDropdownId: 'root_rfid.action_type_ACTION_TYPE',
      subActionTypeDropdownId: 'root_rfid.action_type_SUBACTION_TYPE',
      campaignNameInputId: 'root_rfid.action_type_CAMPAIGN_NAME',
      importTypeDropdownId: 'root_rfid.animal_type_info_IMPORT_TYPE',
      earTagsTextareaId: 'root_rfid.tag_information_ANIMAL_EAR_TAGS',
      selectedActionType: '',
      selectedSubActionType: '',
      selectedDestination: '',
      selectedImportType: ''
      // tagInfoSection: null
    }
  }

  componentDidMount () {
    const formSections = document.getElementsByClassName(this.state.formSectionsClassName)
    const formSectionsArr = Array.from(formSections)
    formSectionsArr[3].id = 'earTagsSection'

    // const tagInfo = document.getElementById('root_rfid.tag_information__title')
    // if (tagInfo && tagInfo.parentElement) {
    //   this.setState({ tagInfoSection: tagInfo.parentElement })
    // }

    const destinationInput = document.getElementById(this.state.destinationInputId)
    if (destinationInput) {
      destinationInput.onclick = this.displaySearchPopup
      destinationInput.onchange = this.handleDestinationInputChange
      this.state.events.forEach(event => {
        destinationInput.addEventListener(event, function (e) { e.preventDefault() })
      })

      if (destinationInput.value) {
        this.setState({ selectedDestination: destinationInput.value })
      }
    }

    const actionTypeDropdown = document.getElementById(this.state.actionTypeDropdownId)
    if (actionTypeDropdown) {
      actionTypeDropdown.onchange = this.handleActionSelectionChange

      if (actionTypeDropdown.value) {
        this.setState({ selectedActionType: actionTypeDropdown.value })
      }
    }

    const subActionTypeDropdown = document.getElementById(this.state.subActionTypeDropdownId)
    if (subActionTypeDropdown) {
      subActionTypeDropdown.onchange = this.handleSubActionSelectionChange

      if (subActionTypeDropdown.value) {
        this.setState({ selectedSubActionType: subActionTypeDropdown.value })
      }

      if (subActionTypeDropdown.parentElement) {
        subActionTypeDropdown.parentElement.style.display = 'none'
      }
    }

    const campaignNameInput = document.getElementById(this.state.campaignNameInputId)
    if (campaignNameInput) {
      campaignNameInput.onclick = this.displayCampaignPopup
      this.state.events.forEach(event => {
        campaignNameInput.addEventListener(event, function (e) { e.preventDefault() })
      })

      if (campaignNameInput.parentElement) {
        campaignNameInput.parentElement.style.display = 'none'
      }
    }

    const importTypeDropdown = document.getElementById(this.state.importTypeDropdownId)
    if (importTypeDropdown) {
      importTypeDropdown.onchange = this.handleImportTypeSelection

      if (importTypeDropdown.value) {
        this.setState({ selectedImportType: importTypeDropdown.value })
      }
    }

    const earTagsTextarea = document.getElementById(this.state.earTagsTextareaId)
    if (earTagsTextarea) {
      earTagsTextarea.style.overflow = 'hidden'
      earTagsTextarea.style.height = '52px'
      earTagsTextarea.oninput = function () {
        earTagsTextarea.style.height = 'auto'
        earTagsTextarea.style.height = `${earTagsTextarea.scrollHeight}px`
      }
    }

    let tableData
    if (this.props.formid) {
      tableData = ComponentManager.getStateForComponent(this.props.formid, 'formTableData')
    }
    if (tableData && tableData[this.state.altSectionName]) {
      this.setState({ isSecondLevel: true })

      if (this.props.gridHierarchy) {
        const saveBtn = document.getElementById('save_form_btn')
        const currentRfidStatus = this.props.gridHierarchy[0].row['RFID.STATUS']
        if (currentRfidStatus && currentRfidStatus === 'PROCESSED') {
          if (saveBtn) {
            saveBtn.style.display = 'none'
          }
        }
      }
    }
  }

  componentDidUpdate (nextProps, nextState) {
    let newTableData
    if (nextProps.formid) {
      newTableData = ComponentManager.getStateForComponent(this.props.formid, 'formTableData')
    }

    const subActionTypeDropdown = document.getElementById(this.state.subActionTypeDropdownId)
    let subActionTypeDropdownParent, subActionOptions
    if (subActionTypeDropdown) {
      subActionOptions = subActionTypeDropdown.getElementsByTagName('OPTION')
      if (subActionTypeDropdown.parentElement) {
        subActionTypeDropdownParent = subActionTypeDropdown.parentElement
      }
    }
    if (nextState.selectedActionType) {
      if (subActionTypeDropdownParent) {
        subActionTypeDropdownParent.style.display = 'inline-table'
        if (nextState.selectedActionType === 'EXPORT') {
          for (let i = 0; i < subActionOptions.length; i++) {
            subActionTypeDropdown.children[i].style.display = null
            if (subActionOptions[i].value) {
              if (subActionOptions[i].value !== 'EXPORT') {
                subActionTypeDropdown.children[i].style.display = 'none'
                subActionTypeDropdown.setAttribute('disabled', '')
                subActionTypeDropdown.selectedIndex = 4
                if (newTableData && newTableData[this.state.altSectionName]) {
                  newTableData[this.state.altSectionName][this.state.subActionType] = 'EXPORT'
                }
              }
            }
          }
        } else if (nextState.selectedActionType === 'ACTION') {
          if (subActionTypeDropdown.value === 'EXPORT' || subActionTypeDropdown.value === 'REGISTER' ||
            subActionTypeDropdown.value === 'TRANSFER') {
            subActionTypeDropdown.selectedIndex = 0
          }
          for (let i = 0; i < subActionOptions.length; i++) {
            subActionTypeDropdown.children[i].style.display = null
            subActionTypeDropdown.removeAttribute('disabled')
            if (subActionOptions[i].value) {
              if (subActionOptions[i].value === 'EXPORT' || subActionOptions[i].value === 'REGISTER' ||
                subActionOptions[i].value === 'TRANSFER') {
                subActionTypeDropdown.children[i].style.display = 'none'
              }
            }
          }
        } else if (nextState.selectedActionType === 'REGISTRATION') {
          for (let i = 0; i < subActionOptions.length; i++) {
            subActionTypeDropdown.children[i].style.display = null
            if (subActionOptions[i].value) {
              if (subActionOptions[i].value !== 'REGISTER') {
                subActionTypeDropdown.children[i].style.display = 'none'
                subActionTypeDropdown.setAttribute('disabled', '')
                subActionTypeDropdown.selectedIndex = 9
                if (newTableData && newTableData[this.state.altSectionName]) {
                  newTableData[this.state.altSectionName][this.state.subActionType] = 'REGISTER'
                }
              }
            }
          }
        } else if (nextState.selectedActionType === 'TRANSFER') {
          for (let i = 0; i < subActionOptions.length; i++) {
            subActionTypeDropdown.children[i].style.display = null
            if (subActionOptions[i].value) {
              if (subActionOptions[i].value !== 'TRANSFER') {
                subActionTypeDropdown.children[i].style.display = 'none'
                subActionTypeDropdown.setAttribute('disabled', '')
                subActionTypeDropdown.selectedIndex = 12
                if (newTableData && newTableData[this.state.altSectionName]) {
                  newTableData[this.state.altSectionName][this.state.subActionType] = 'TRANSFER'
                }
              }
            }
          }
        }
      }
    } else {
      if (subActionTypeDropdownParent) {
        subActionTypeDropdownParent.style.display = 'none'
      }
    }

    const campaignNameInput = document.getElementById(this.state.campaignNameInputId)
    if (nextState.selectedSubActionType === 'VACCINATE') {
      if (campaignNameInput) {
        if (campaignNameInput.parentElement) {
          campaignNameInput.parentElement.style.display = 'inline-table'
        }
      }
    } else {
      if (campaignNameInput) {
        if (campaignNameInput.parentElement) {
          campaignNameInput.parentElement.style.display = 'none'
        }
      }
    }

    if (nextState.shouldRemoveDestination) {
      if (newTableData[this.state.sectionName]) {
        if (newTableData[this.state.sectionName].DESTINATION_NUMBER) {
          newTableData[this.state.sectionName].DESTINATION_NUMBER = undefined
        }
      }
    }

    const earTagsSection = document.getElementById('earTagsSection')
    if (earTagsSection) {
      if (nextState.selectedImportType === 'VIA_FILE') {
        earTagsSection.style.display = 'none'
      } else {
        earTagsSection.style.display = 'table'
        earTagsSection.style.animationName = 'slide-in-up'
        earTagsSection.style.animationIterationCount = '1'
        earTagsSection.style.animationTimingFunction = 'ease-in'
        earTagsSection.style.animationDuration = '0.5s'
      }
    }

    if (this.props.rfidStatusHasChanged !== nextProps.rfidStatusHasChanged) {
      const saveBtn = document.getElementById('save_form_btn')
      if (saveBtn) {
        saveBtn.style.display = 'none'
      }
    }
  }

  handleActionSelectionChange = e => {
    this.setState({ selectedActionType: e.target.value })

    if (this.state.selectedSubActionType) {
      this.setState({ selectedSubActionType: '' })
    }

    if (this.state.selectedDestination) {
      this.setState({ selectedDestination: '', shouldRemoveDestination: true })
      const destinationInput = document.getElementById(this.state.destinationInputId)
      if (destinationInput) {
        destinationInput.value = ''
      }
    }
  }

  handleSubActionSelectionChange = e => {
    this.setState({ selectedSubActionType: e.target.value })

    if (this.state.isSecondLevel) {
      store.dispatch({ type: 'RFID_ACTION_AND_SUBACTION_TYPE_HAS_CHANGED' })
    }
  }

  handleImportTypeSelection = e => {
    this.setState({ selectedImportType: e.target.value })
    let formTableData
    if (this.props.formid) {
      formTableData = ComponentManager.getStateForComponent(this.props.formid, 'formTableData')
    }
    const earTagsTextarea = document.getElementById(this.state.earTagsTextareaId)
    if (earTagsTextarea) {
      if (earTagsTextarea.value && e.target.value === 'VIA_FILE') {
        earTagsTextarea.value = ''

        if (formTableData && formTableData[this.state.earTagSectionName]) {
          if (formTableData[this.state.earTagSectionName].ANIMAL_EAR_TAGS) {
            formTableData[this.state.earTagSectionName].ANIMAL_EAR_TAGS = undefined
          }
        }
      }
    }
  }

  handleDestinationInputChange = e => {
    this.setState({ selectedDestination: e.target.value })
  }

  displaySearchPopup = () => {
    const { selectedActionType, selectedSubActionType } = this.state
    if (!selectedActionType || (selectedActionType === 'ACTION' && !selectedSubActionType)) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.select_action_and_subaction_type`,
            defaultMessage: `${config.labelBasePath}.alert.select_action_and_subaction_type`
          }), null, () => this.setState({ alert: false })
        )
      })
    } else {
      this.setState({ displayPopup: true })
    }
  }

  closePopup = () => {
    this.setState({ displayPopup: false })
  }

  chooseItem = () => {
    const {
      holdingGrid,
      exportCertGrid,
      sectionName,
      destinationNumber,
      selectedActionType,
      actionTypeDropdownId,
      subActionTypeDropdownId,
      isSecondLevel } = this.state
    const actionTypeDropdown = document.getElementById(actionTypeDropdownId)
    const subActionTypeDropdown = document.getElementById(subActionTypeDropdownId)
    let chosenItemValue
    if (selectedActionType === 'EXPORT') {
      chosenItemValue = store.getState()[exportCertGrid].rowClicked[`${exportCertGrid}.EXP_CERTIFICATE_ID`]
    } else {
      chosenItemValue = store.getState()[holdingGrid].rowClicked[`${holdingGrid}.PIC`]
    }

    if (chosenItemValue) {
      const destinationInput = document.getElementById(this.state.destinationInputId)
      if (destinationInput) {
        destinationInput.value = chosenItemValue
        this.setState({ selectedDestination: chosenItemValue })
      }

      if (this.props.formid) {
        let newTableData = ComponentManager.getStateForComponent(this.props.formid, 'formTableData')
        if (newTableData && newTableData.constructor === Object && !newTableData[sectionName]) {
          newTableData[sectionName] = {}
          newTableData[sectionName][destinationNumber] = chosenItemValue
        } else {
          if (!newTableData) {
            newTableData = {}
            newTableData[sectionName] = {}
          }
          newTableData[sectionName][destinationNumber] = chosenItemValue
        }
        ComponentManager.setStateForComponent(this.props.formid, 'formTableData', newTableData)
        this.props.formInstance.setState({ formTableData: newTableData })
      }
      if (this.props.handleValueChange && this.props.handleValueChange instanceof Function) {
        let value
        if (chosenItemValue) {
          value = chosenItemValue
        }
        this.props.handleValueChange(null, value)
      }

      if (actionTypeDropdown && subActionTypeDropdown && !isSecondLevel) {
        actionTypeDropdown.setAttribute('disabled', '')
        subActionTypeDropdown.setAttribute('disabled', '')
      }

      this.setState({ shouldRemoveDestination: false })
    }
    this.closePopup()
  }

  displayCampaignPopup = e => {
    e.preventDefault()
    this.setState({ displayCampaignPopup: true })
  }

  closeCampaignPopup = () => {
    this.setState({ displayCampaignPopup: false })
    ComponentManager.cleanComponentReducerState(`${this.state.gridToDisplay}_RFID`)
  }

  chooseCampaign = () => {
    const { campaignNameInputId, fieldIdName, altSectionName } = this.state

    const grid = `${this.state.gridToDisplay}_RFID`
    const chosenItemValue = store.getState()[grid].rowClicked[`${this.state.gridToDisplay}.CAMPAIGN_NAME`]
    const campaignObjectId = store.getState()[grid].rowClicked[`${this.state.gridToDisplay}.OBJECT_ID`]

    if (chosenItemValue && campaignObjectId) {
      document.getElementById(campaignNameInputId).value = chosenItemValue
      const formid = this.props.formid
      if (formid) {
        let newTableData = ComponentManager.getStateForComponent(formid, 'formTableData')
        if (newTableData && newTableData.constructor === Object && !newTableData[altSectionName]) {
          newTableData[altSectionName] = {}
          newTableData[altSectionName][fieldIdName] = chosenItemValue
        } else {
          if (!newTableData) {
            newTableData = {}
            newTableData[altSectionName] = {}
          }
          newTableData[altSectionName][fieldIdName] = chosenItemValue
        }
        newTableData[this.state.fieldIdNameAlt] = campaignObjectId
        ComponentManager.setStateForComponent(formid, 'formTableData', newTableData)
        this.props.formInstance.setState({ formTableData: newTableData })
      }
      if (this.props.handleValueChange && this.props.handleValueChange instanceof Function) {
        let value
        let altValue
        if (chosenItemValue && campaignObjectId) {
          value = chosenItemValue
          altValue = campaignObjectId
        }
        this.props.handleValueChange(null, value)
        this.props.handleValueChange(null, altValue)
      }
      this.closeCampaignPopup()
    }
  }

  render () {
    let searchType
    if (this.state.selectedActionType === 'EXPORT') {
      searchType = 'EXPORT_CERT'
    } else {
      searchType = 'HOLDING'
    }

    // const testBtn = (<React.Fragment>
    //   <br />
    //   <button
    //     id='testBtn'
    //     type='button'
    //     className='btn-success'
    //     onClick={() => console.log('test')}
    //   >
    //     Preprocess the entered RFIDs
    //   </button>
    // </React.Fragment>)

    const searchPopup = <div id='search_modal' className='modal' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <GridInModalLinkObjects
            loadFromParent
            linkedTable={searchType}
            onRowSelect={this.chooseItem}
            key={`${searchType}_${this.props.formid}`}
            closeModal={this.closePopup}
          />
        </div>
      </div>
    </div>

    const gridConfig = menuConfig('GRID_CONFIG', this.context.intl)
    const campaignPopup = <div id='search_modal' className='modal to-front' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <ResultsGrid
            key={`${this.state.gridToDisplay}_RFID`}
            id={`${this.state.gridToDisplay}_RFID`}
            gridToDisplay={this.state.gridToDisplay}
            gridConfig={gridConfig}
            onRowSelectProp={this.chooseCampaign}
            customGridDataWS='GET_VALID_CAMPAIGN_EVENTS'
          />
        </div>
      </div>
      <div id='modal_close_btn' type='button' className='js-components-AppComponents-Functional-GridInModalLinkObjects-module-close'
        style={{
          position: 'absolute',
          right: 'calc(11% - 9px)',
          top: '44px',
          width: '32px',
          height: '32px',
          opacity: '1'
        }}
        onClick={() => this.closeCampaignPopup()} data-dismiss='modal' />
    </div>

    return (
      <React.Fragment>
        {this.state.displayPopup &&
          ReactDOM.createPortal(searchPopup, document.getElementById('app'))
        }
        {this.state.displayCampaignPopup &&
          ReactDOM.createPortal(campaignPopup, document.getElementById('app'))
        }
        {/* {this.state.tagInfoSection &&
          ReactDOM.createPortal(testBtn, this.state.tagInfoSection)
        } */}
        {this.props.children}
      </React.Fragment>
    )
  }
}

OldRfidFormInputWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  gridHierarchy: state.gridConfig.gridHierarchy,
  rfidStatusHasChanged: state.rfidStatus.rfidStatusHasChanged
})

export default connect(mapStateToProps)(OldRfidFormInputWrapper)
