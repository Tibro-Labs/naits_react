import React from 'react'
import { strcmp, setInputFilter } from 'functions/utils'

export default class HoldingFormFirstLevelInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      holdingInfoSection: 'holding.info',
      holdingTypeDropdownId: 'root_holding.info_TYPE',
      shelfLifeInputId: 'root_holding.capacitiy.info_SHELF_LIFE'
    }
  }

  componentDidMount () {
    const holdingTypeDropdown = document.getElementById(this.state.holdingTypeDropdownId)
    if (holdingTypeDropdown) {
      holdingTypeDropdown.onchange = this.handleHoldingTypeChange
    }
    const shelfLifeInput = document.getElementById(this.state.shelfLifeInputId)
    if (shelfLifeInput) {
      if (shelfLifeInput.parentElement) {
        shelfLifeInput.parentElement.style.display = 'none'
      }
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
        if (shelfLifeInput.parentElement) {
          shelfLifeInput.parentElement.style.display = 'inline-table'
        }
        // If the holding is of type slaughterhouse, allow only a maximum amount of 3 digits
        setInputFilter(shelfLifeInput, function (value) {
          return /^\d{0,3}$/.test(value)
        })
      }
    }
  }

  handleHoldingTypeChange = e => {
    this.handleShelfLifeInput(e.target.value)
  }

  render () {
    return this.props.children
  }
}
