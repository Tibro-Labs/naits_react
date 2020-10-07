import React from 'react'
import { $ } from 'functions/utils'

class DisableDeleteAdmConsoleWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      fieldIdName: 'save_form_btn',
      customDeleteBtnId: 'customDeleteAdmConsole'
    }
  }

  componentDidMount () {
    const { fieldIdName, customDeleteBtnId } = this.state

    const saveBtn = $(fieldIdName)
    if (saveBtn) {
      saveBtn.style.display = 'none'
    }

    const customDeleteBtn = $(customDeleteBtnId)
    if (customDeleteBtn) {
      customDeleteBtn.style.display = 'block'
    }
  }

  render () {
    return this.props.children
  }
}

export default DisableDeleteAdmConsoleWrapper
