import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import * as config from 'config/config'
import { connect } from 'react-redux'
import { ComponentManager, GridInModalLinkObjects } from 'components/ComponentsIndex'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { disableEvents } from 'functions/utils'

class InputPetSelectionWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSearchPopup: false,
      elementIdName: 'root_pet_passport.basic_info_HOLDING_NAME',
      petIdInputElement: 'root_pet_passport.basic_info_PET_ID',
      petObjectId: null,
      fieldIdName: 'PET_ID',
      parentId: 'PARENT_ID',
      holdingName: 'HOLDING_NAME',
      fieldNameAlt: 'HOLDING_OBJ_ID',
      gridToDisplay: 'PET',
      filterGrid: false
    }

    this.checkIfPetHasValidPassport = this.checkIfPetHasValidPassport.bind(this)
  }

  componentDidMount () {
    const vetStationInput = document.getElementById(this.state.elementIdName)
    const petIdInput = document.getElementById(this.state.petIdInputElement)
    petIdInput.onblur = this.checkIfPetHasValidPassport
    petIdInput.setAttribute('required', '')
    const petIdLabel = petIdInput.labels[0]
    const petIdLabelText = petIdLabel.innerHTML
    if (petIdLabel && petIdLabelText) {
      petIdLabel.innerHTML = `${petIdLabelText}*`
    }
    vetStationInput.setAttribute('disabled', '')
    vetStationInput.value = this.props.gridHierarchy[0].row['HOLDING.PIC']
    petIdInput.onclick = this.displayPopupOnClick
    disableEvents(petIdInput)

    let elementPrefix = petIdInput.id.replace('root_', '')
    elementPrefix = elementPrefix.replace(`_${this.state.fieldIdName}`, '')
    this.setState({ elementPrefix })

    const formid = this.props.formid
    if (formid) {
      let newTableData = ComponentManager.getStateForComponent(formid, 'formTableData')
      if (newTableData && newTableData.constructor === Object && !newTableData[elementPrefix]) {
        newTableData[elementPrefix] = {}
        newTableData[this.state.holdingName] = this.props.gridHierarchy[0].row['HOLDING.PIC']
        newTableData[elementPrefix][this.state.holdingName] = this.props.gridHierarchy[0].row['HOLDING.PIC']
      } else {
        if (!newTableData) {
          newTableData = {}
          newTableData[elementPrefix] = {}
        }
      }
      ComponentManager.setStateForComponent(formid, 'formTableData', newTableData)
      this.props.formInstance.setState({ formTableData: newTableData })
    }
  }

  displayPopupOnClick = (event) => {
    event.preventDefault()
    const errorMsg = document.getElementById('errorMsg')
    if (errorMsg) {
      errorMsg.style.display = 'none'
      const petIdInput = document.getElementById(this.state.petIdInputElement)
      petIdInput.style.border = 'none'
    }
    this.setState({ showSearchPopup: true, filterGrid: false })
    event.target.blur()
  }

  chooseItem = () => {
    const { gridToDisplay, petIdInputElement, fieldIdName, elementPrefix } = this.state

    const grid = gridToDisplay
    const clickedGrid = 'PET'
    const chosenItemValue = store.getState()[grid].rowClicked[`${this.state.gridToDisplay}.PET_ID`]
    const holdingObjId = String(this.props.gridHierarchy[0].row['HOLDING.OBJECT_ID'])
    const parentId = String(store.getState()[clickedGrid].rowClicked[`${clickedGrid}.OBJECT_ID`])
    this.setState({ petObjectId: parentId })
    const holdingName = this.props.gridHierarchy[0].row['HOLDING.PIC']

    if (chosenItemValue && holdingObjId && parentId) {
      const petIdInput = document.getElementById(petIdInputElement)
      petIdInput.style.border = 'none'
      const errorMsg = document.getElementById('errorMsg')
      if (errorMsg) {
        errorMsg.style.display = 'none'
      }

      if (petIdInput) {
        document.getElementById(petIdInputElement).value = chosenItemValue
      }
      const formid = this.props.formid
      if (formid) {
        let newTableData = ComponentManager.getStateForComponent(formid, 'formTableData')
        if (newTableData && newTableData.constructor === Object && !newTableData[elementPrefix]) {
          newTableData[elementPrefix] = {}
          newTableData[elementPrefix][fieldIdName] = chosenItemValue
        } else {
          if (!newTableData) {
            newTableData = {}
            newTableData[elementPrefix] = {}
          }
          newTableData[elementPrefix][fieldIdName] = chosenItemValue
        }
        newTableData[this.state.holdingName] = holdingName
        newTableData[this.state.fieldNameAlt] = holdingObjId
        newTableData[this.state.parentId] = parentId
        newTableData[this.state.elementPrefix][this.state.holdingName] = holdingName
        ComponentManager.setStateForComponent(formid, 'formTableData', newTableData)
        this.props.formInstance.setState({ formTableData: newTableData })
      }
      if (this.props.handleValueChange && this.props.handleValueChange instanceof Function) {
        let value
        let altValue
        let passportParentId
        let holdingNameValue
        if (chosenItemValue && holdingObjId && parentId && holdingName) {
          value = chosenItemValue
          altValue = holdingObjId
          passportParentId = parentId
          holdingNameValue = holdingName
        }
        this.props.handleValueChange(null, value)
        this.props.handleValueChange(null, altValue)
        this.props.handleValueChange(null, passportParentId)
        this.props.handleValueChange(null, holdingNameValue)
      }
      this.closeModal(this)
    } else if (!chosenItemValue) {
      let errorMsg = `
      <p id="errorMsg" style="color: red">
        ${this.context.intl.formatMessage({
        id: `${config.labelBasePath}.error.select_pet_with_valid_id`,
        defaultMessage: `${config.labelBasePath}.error.select_pet_with_valid_id`
      })}
      </p>
    `
      const petIdInput = document.getElementById(petIdInputElement)
      petIdInput.style.border = '1px solid red'
      petIdInput.value = ''
      petIdInput.insertAdjacentHTML('afterend', errorMsg)
      this.closeModal()
    }
  }

  checkIfPetHasValidPassport () {
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.CHECK_IF_PET_HAS_VALID_PASSPORT
    let url = `${server}${verbPath}`
    url = url.replace('%sessionId', this.props.svSession)
    url = url.replace('%objectId', this.state.petObjectId)

    axios.get(url).then(res => {
      if (res.data) {
        this.setState({
          alert: alertUser(
            true,
            'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.petAlreadyHasValidPassport`,
              defaultMessage: `${config.labelBasePath}.main.petAlreadyHasValidPassport`
            }),
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.invalidateTheOldPetPassport`,
              defaultMessage: `${config.labelBasePath}.main.invalidateTheOldPetPassport`
            }),
            () => {
              this.setState({ alert: alertUser(false, 'info', '') })
            },
            () => {
              document.getElementById('modal_close_btn').click()
            },
            true,
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.forms.continue`,
              defaultMessage: `${config.labelBasePath}.main.forms.continue`
            }),
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.forms.cancel`,
              defaultMessage: `${config.labelBasePath}.main.forms.cancel`
            }),
            false,
            '#5C821A',
            null
          )
        })
      }
    })
  }

  closeModal = () => {
    this.setState({ showSearchPopup: false })
    ComponentManager.cleanComponentReducerState(this.state.gridToDisplay)
    ComponentManager.cleanComponentReducerState(this.state.gridToDisplay + '_' + this.props.formId)
  }

  render () {
    const searchPopup = <div id='search_modal' className='modal' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <GridInModalLinkObjects
            loadFromParent
            linkedTable={this.state.gridToDisplay}
            onRowSelect={this.chooseItem}
            key={this.state.gridToDisplay + '_' + this.state.fieldIdName}
            closeModal={this.closeModal}
          />
        </div>
      </div>
    </div>
    return (
      <div>
        {this.state.showSearchPopup &&
          ReactDOM.createPortal(searchPopup, document.getElementById('app'))
        }
        {this.props.children}
      </div>
    )
  }
}

InputPetSelectionWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  gridHierarchy: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(InputPetSelectionWrapper)
