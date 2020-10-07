import React from 'react'

export default class DisableHolderTypeDropdownInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      holderTypeDropdownEl: 'root_holding_responsible.personal.info_HOLDER_TYPE'
    }
  }

  componentDidMount () {
    const holderTypeDropdown = document.getElementById(this.state.holderTypeDropdownEl)
    if (holderTypeDropdown) {
      holderTypeDropdown.setAttribute('disabled', '')
    }
  }

  render () {
    return this.props.children
  }
}
