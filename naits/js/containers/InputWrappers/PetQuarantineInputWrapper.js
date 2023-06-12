import React from 'react'
import { ComponentManager, GridInModalLinkObjects } from 'components/ComponentsIndex'
import { store } from 'tibro-redux'

export default class PetQuarantineInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inputElementId: 'root_quarantine.sociological_test_TEST_RESP_PERSON',
      sectionName: 'quarantine.sociological_test',
      fieldName: 'TEST_RESP_PERSON',
      secondaryFieldName: 'TEST_RESP_PERSON_ID',
      gridToDisplay: 'HOLDING_RESPONSIBLE',
      displayModal: false
    }
  }

  componentDidMount () {
    const testResponsiblePersonInput = document.getElementById(this.state.inputElementId)
    if (testResponsiblePersonInput) {
      testResponsiblePersonInput.onclick = this.displayModal
      testResponsiblePersonInput.style.cursor = 'pointer'
      testResponsiblePersonInput.setAttribute('readonly', 'readonly')
      testResponsiblePersonInput.addEventListener('keydown', e => e.preventDefault())
    }
  }

  displayModal = () => {
    this.setState({ displayModal: true })
  }

  chooseItem = () => {
    const { formid } = this.props
    const { gridToDisplay, sectionName, fieldName, secondaryFieldName, inputElementId } = this.state
    const personName = store.getState()[gridToDisplay].rowClicked[`${gridToDisplay}.FULL_NAME`]
    const personObjectId = store.getState()[gridToDisplay].rowClicked[`${gridToDisplay}.OBJECT_ID`]

    const testResponsiblePersonInput = document.getElementById(inputElementId)
    if (testResponsiblePersonInput) {
      testResponsiblePersonInput.value = personName
    }

    if (formid) {
      let newTableData = ComponentManager.getStateForComponent(formid, 'formTableData')
      if (newTableData && newTableData.constructor === Object && !newTableData[sectionName]) {
        newTableData[sectionName] = {}
        newTableData[sectionName][fieldName] = personName
        newTableData[sectionName][secondaryFieldName] = personObjectId
      } else {
        if (!newTableData) {
          newTableData = {}
          newTableData[sectionName] = {}
        }
        newTableData[sectionName][fieldName] = personName
        newTableData[sectionName][secondaryFieldName] = personObjectId
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
