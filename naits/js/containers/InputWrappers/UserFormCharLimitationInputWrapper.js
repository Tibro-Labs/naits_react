import React from 'react'
import { $ } from 'functions/utils'

export default class UserFormCharLimitationInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      firstNameField: 'root_FIRST_NAME',
      lastNameField: 'root_LAST_NAME'
    }
  }

  componentDidMount () {
    const { firstNameField, lastNameField } = this.state
    const firstNameInput = $(firstNameField)
    const lastNameInput = $(lastNameField)
    if (firstNameInput && lastNameInput) {
      firstNameInput.setAttribute('maxlength', '15')
      lastNameInput.setAttribute('maxlength', '15')
      firstNameInput.setAttribute('minlength', '3')
      lastNameInput.setAttribute('minlength', '3')
    }
  }

  render () {
    return this.props.children
  }
}
