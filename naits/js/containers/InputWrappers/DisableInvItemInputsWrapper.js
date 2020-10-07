import React from 'react'
import { $ } from 'functions/utils'

class DisableInvItemInputsWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tagTypeDropdownId: 'root_TAG_TYPE',
      earTagNumberInputId: 'root_EAR_TAG_NUMBER',
      earTagStatusDropdownId: 'root_TAG_STATUS',
      orderNumberInputId: 'root_ORDER_NUMBER'
    }
  }

  componentDidMount () {
    const {
      tagTypeDropdownId,
      earTagNumberInputId,
      orderNumberInputId
    } = this.state

    const tagTypeDropdown = $(tagTypeDropdownId)
    const earTagNumberInput = $(earTagNumberInputId)
    const orderNumberInput = $(orderNumberInputId)

    if (tagTypeDropdown && earTagNumberInput && orderNumberInput) {
      tagTypeDropdown.setAttribute('disabled', '')
      earTagNumberInput.setAttribute('disabled', '')
      orderNumberInput.setAttribute('disabled', '')
    }
  }

  render () {
    return this.props.children
  }
}

export default DisableInvItemInputsWrapper
