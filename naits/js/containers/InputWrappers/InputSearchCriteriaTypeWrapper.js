import React from 'react'
import PropTypes from 'prop-types'
import { ComponentManager, GridInModalLinkObjects } from 'components/ComponentsIndex'
import { store } from 'tibro-redux'

export default class InputSearchCriteriaTypeWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSearchPopup: false,
      elementIdCode: null,
      fieldIdCode: props.fieldIdCode || 'root_CRITERIA_TYPE_ID',
      gridToDisplay: props.gridToDisplay || 'CRITERIA_TYPE',
      searchByCol: props.searchByCol || 'OBJECT_ID'
    }
    this.displayPopupOnClick = this.displayPopupOnClick.bind(this)
  }

  componentDidMount () {
    const inputs = Array.from(document.getElementsByTagName('input'))
    inputs.forEach((element, index) => {
      // find village name and village code IDs
      if (element.id.includes(this.state.fieldIdCode)) {
        let elementIdCode = element.id.replace('root_', '')
        this.setState({
          elementIdCode: elementIdCode
        })
        element.onclick = this.displayPopupOnClick
        // element.onfocus = this.displayPopupOnClick
      }
    })
  }

  displayPopupOnClick (event) {
    event.preventDefault()
    this.setState({ showSearchPopup: true })
    event.target.blur()
  }

  chooseItem = () => {
    const { elementIdCode, gridToDisplay, fieldIdCode, searchByCol } = this.state

    const row = store.getState()[gridToDisplay].rowClicked
    const chosenItemCode = row[`${gridToDisplay}.${searchByCol}`]

    if (chosenItemCode) {
      const element = document.getElementById(fieldIdCode)
      if (fieldIdCode) {
        element.value = chosenItemCode
      }
      const formid = this.props.formid
      if (formid) {
        let newTableData = ComponentManager.getStateForComponent(formid, 'formTableData')
        if (newTableData.constructor === Object && !newTableData[elementIdCode]) {
          newTableData[elementIdCode] = {}
          newTableData[elementIdCode] = chosenItemCode
        } else {
          newTableData[elementIdCode] = chosenItemCode
        }
        ComponentManager.setStateForComponent(formid, 'formTableData', newTableData)
        this.props.formInstance.setState({ formTableData: newTableData })
      }
      if (this.props.handleValueChange && this.props.handleValueChange instanceof Function) {
        let value
        if (elementIdCode) {
          value = chosenItemCode
        }
        this.props.handleValueChange(null, value)
      }
      this.closeModal()
    }
  }

  closeModal = () => {
    this.setState({ showSearchPopup: false })
    ComponentManager.cleanComponentReducerState(this.state.gridToDisplay)
  }

  render () {
    return (
      <div>
        {this.state.showSearchPopup &&
          <GridInModalLinkObjects
            loadFromParent
            linkedTable={this.state.gridToDisplay}
            onRowSelect={this.chooseItem}
            key={this.state.gridToDisplay}
            closeModal={this.closeModal}
          />
        }
        {this.props.children}
      </div>
    )
  }
}

InputSearchCriteriaTypeWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}
