import React from 'react'
import { store } from 'tibro-redux'
import { ComponentManager } from 'components/ComponentsIndex'
import { strcmp, setInputFilter } from 'functions/utils'

export default class HoldingFormSecondLevelInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      holdingInfoSection: 'holding.info',
      holdingTypeDropdownId: 'root_holding.info_TYPE',
      shelfLifeInputId: 'root_holding.capacitiy.info_SHELF_LIFE',
      initialHoldingType: '',
      changedHoldingType: null
    }
  }

  componentDidMount () {
    this.getCurrentHoldingType()

    const holdingTypeDropdown = document.getElementById(this.state.holdingTypeDropdownId)
    if (holdingTypeDropdown) {
      holdingTypeDropdown.onchange = this.handleHoldingTypeChange
    }
  }

  handleShelfLifeInput = (holdingType) => {
    const { shelfLifeInputId } = this.state
    const shelfLifeInput = document.getElementById(shelfLifeInputId)
    if (shelfLifeInput) {
      // Hide the input and its parent and sibling elements if the holding is not of type slaughterhouse
      if (!strcmp(holdingType, '7')) {
        if (shelfLifeInput.parentElement) {
          shelfLifeInput.parentElement.style.display = 'none'
        }
      } else {
        // If the holding is of type slaughterhouse, allow only a maximum amount of 3 digits
        setInputFilter(shelfLifeInput, function (value) {
          return /^\d{0,3}$/.test(value)
        })
      }
    }
  }

  getCurrentHoldingType = () => {
    const formId = this.props.formid
    if (formId) {
      const { holdingInfoSection } = this.state
      let formTableData = ComponentManager.getStateForComponent(formId, 'formTableData')
      if (formTableData && formTableData[holdingInfoSection].TYPE) {
        this.handleShelfLifeInput(formTableData[holdingInfoSection].TYPE)
        this.setState({ initialHoldingType: formTableData[holdingInfoSection].TYPE })
      }
    }
  }

  handleHoldingTypeChange = e => {
    this.setState({ changedHoldingType: e.target.value })
  }

  componentDidUpdate (nextProps, nextState) {
    if (nextState.changedHoldingType && (nextState.changedHoldingType !== nextState.initialHoldingType)) {
      if (nextProps.formInstance.props.saveExecuted) {
        store.dispatch({ type: 'HOLDING_TYPE_HAS_CHANGED' })
        this.getCurrentHoldingType()
        this.setState({ changedHoldingType: null })
      }
    }
  }

  render () {
    return this.props.children
  }
}
