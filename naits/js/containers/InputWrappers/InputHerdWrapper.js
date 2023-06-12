import React from 'react'
import { ComponentManager, GridInModalLinkObjects } from 'components/ComponentsIndex'
import { store } from 'tibro-redux'

export default class InputHerdWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inputElementId: 'root_herd.basic_info_CONTACT_PERSON_ID',
      sectionName: 'herd.basic_info',
      fieldName: 'CONTACT_PERSON_ID',
      gridToDisplay: 'HOLDING_RESPONSIBLE',
      displayModal: false
    }
  }

  componentDidMount () {
    const contactPersonInput = document.getElementById(this.state.inputElementId)
    if (contactPersonInput) {
      contactPersonInput.onclick = this.displayModal
      contactPersonInput.style.cursor = 'pointer'
      contactPersonInput.setAttribute('readonly', 'readonly')
      contactPersonInput.addEventListener('keydown', e => e.preventDefault())
    }
  }

  displayModal = () => {
    this.setState({ displayModal: true })
  }

  chooseItem = () => {
    const { formid } = this.props
    const { gridToDisplay, sectionName, fieldName, inputElementId } = this.state
    const herderName = store.getState()[gridToDisplay].rowClicked[`${gridToDisplay}.FULL_NAME`]
    const herderObjectId = store.getState()[gridToDisplay].rowClicked[`${gridToDisplay}.OBJECT_ID`]

    const contactPersonInput = document.getElementById(inputElementId)
    if (contactPersonInput) {
      contactPersonInput.value = herderName
      // contactPersonInput.setAttribute('placeholder', herderName)
    }

    if (formid) {
      let newTableData = ComponentManager.getStateForComponent(formid, 'formTableData')
      if (newTableData && newTableData.constructor === Object && !newTableData[sectionName]) {
        newTableData[sectionName] = {}
        newTableData[sectionName][fieldName] = herderObjectId
      } else {
        if (!newTableData) {
          newTableData = {}
          newTableData[sectionName] = {}
        }
        newTableData[sectionName][fieldName] = herderObjectId
      }
      ComponentManager.setStateForComponent(formid, 'formTableData', newTableData)
      this.props.formInstance.setState({ formTableData: newTableData })
    }

    this.closeModal()
  }

  closeModal = () => {
    this.setState({ displayModal: false })
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
            key={this.state.gridToDisplay + '_' + this.state.inputElementId}
            closeModal={this.closeModal}
          />
        </div>
      </div>
    </div>
    return <React.Fragment>
      {this.props.children}
      {this.state.displayModal && searchPopup}
    </React.Fragment>
  }
}
