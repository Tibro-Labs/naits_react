import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import * as config from 'config/config'
import { connect } from 'react-redux'
import { ComponentManager, ResultsGrid } from 'components/ComponentsIndex'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { menuConfig } from 'config/menuConfig'
import { disableEvents } from 'functions/utils'

class InputVetStationSelectionWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSearchPopup: false,
      elementIdName: 'root_pet_passport.basic_info_HOLDING_NAME',
      altElementIdName: 'root_pet_passport.basic_info_PET_ID',
      passportIdField: 'root_pet_passport.basic_info_PASSPORT_ID',
      fieldIdName: 'HOLDING_NAME',
      fieldIdNameAlt: 'HOLDING_OBJ_ID',
      petId: 'PET_ID',
      petIdInputValue: '',
      gridToDisplay: 'HOLDING',
      filterGrid: false
    }
    this.displayPopupOnClick = this.displayPopupOnClick.bind(this)
  }

  componentDidMount () {
    let petObjectId
    let petId
    this.props.gridHierarchy.map(singleGrid => {
      if (singleGrid.gridType === 'PET') {
        const petGrid = singleGrid
        if (petGrid.row['PET.OBJECT_ID'] && petGrid.row['PET.PET_TAG_ID']) {
          petObjectId = petGrid.row['PET.OBJECT_ID']
          petId = petGrid.row['PET.PET_TAG_ID']
        }
      }
    })

    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.CHECK_IF_PET_HAS_VALID_PASSPORT
    let url = `${server}${verbPath}`
    url = url.replace('%sessionId', this.props.svSession)
    url = url.replace('%objectId', petObjectId)

    axios.get(url).then(res => {
      if (res.data) {
        this.setState({
          alert: alertUser(
            true,
            'info',
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

    const vetStationInput = document.getElementById(this.state.elementIdName)
    const petIdInput = document.getElementById(this.state.altElementIdName)
    vetStationInput.removeAttribute('readonly')
    vetStationInput.setAttribute('required', '')
    const vetStationLabel = vetStationInput.labels[0]
    const vetStationLabelText = vetStationLabel.innerHTML
    if (vetStationLabel && vetStationLabelText) {
      vetStationLabel.innerHTML = `${vetStationLabelText}*`
    }
    petIdInput.setAttribute('disabled', '')

    if (petId) {
      petIdInput.value = petId
      this.setState({ petIdInputValue: petId })
    }

    vetStationInput.onclick = this.displayPopupOnClick
    disableEvents(vetStationInput)

    let elementPrefix = vetStationInput.id.replace('root_', '')
    elementPrefix = elementPrefix.replace(`_${this.state.fieldIdName}`, '')
    this.setState({ elementPrefix })
  }

  displayPopupOnClick (event) {
    event.preventDefault()
    this.setState({ showSearchPopup: true, filterGrid: false })
    event.target.blur()
  }

  chooseItem (comp) {
    const { elementIdName, fieldIdName, elementPrefix, petIdInputValue } = comp.state

    const grid = this.state.gridToDisplay + '_' + this.state.fieldIdName
    const chosenItemValue = store.getState()[grid].rowClicked[`${this.state.gridToDisplay}.PIC`]
    const holdingObjId = String(store.getState()[grid].rowClicked[`${this.state.gridToDisplay}.OBJECT_ID`])
    let petId
    if (petIdInputValue) {
      petId = petIdInputValue
    }

    if (chosenItemValue && holdingObjId) {
      if (elementIdName) {
        document.getElementById(elementIdName).value = chosenItemValue
      }
      const formid = comp.props.formid
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
        newTableData[this.state.fieldIdNameAlt] = holdingObjId
        newTableData[elementPrefix][this.state.petId] = petId
        ComponentManager.setStateForComponent(formid, 'formTableData', newTableData)
        comp.props.formInstance.setState({ formTableData: newTableData })
      }
      if (comp.props.handleValueChange && comp.props.handleValueChange instanceof Function) {
        let value
        let altValue
        let petIdValue
        if (chosenItemValue && holdingObjId && petId) {
          value = chosenItemValue
          altValue = holdingObjId
          petIdValue = petId
        }
        comp.props.handleValueChange(null, value)
        comp.props.handleValueChange(null, altValue)
        comp.props.handleValueChange(null, petIdValue)
      }
      comp.closeModal(comp)
    }
  }

  closeModal () {
    this.setState({ showSearchPopup: false })
    ComponentManager.cleanComponentReducerState(this.state.gridToDisplay + '_' + this.state.fieldIdName)
  }

  render () {
    const gridConfig = menuConfig('GRID_CONFIG', this.context.intl)
    const searchPopup = <div id='search_modal' className='modal to-front' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content'>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <ResultsGrid
            key={this.state.gridToDisplay + '_' + this.state.fieldIdName}
            id={this.state.gridToDisplay + '_' + this.state.fieldIdName}
            gridToDisplay={this.state.gridToDisplay}
            gridConfig={gridConfig}
            onRowSelectProp={() => this.chooseItem(this)}
            customGridDataWS='GET_VET_STATIONS'
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
        onClick={() => this.closeModal()} data-dismiss='modal' />
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

InputVetStationSelectionWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  gridHierarchy: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(InputVetStationSelectionWrapper)
