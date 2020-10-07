import React from 'react'

export default class LabTestTypeDisableSaveInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      saveBtnId: 'save_form_btn'
    }
  }

  componentDidMount () {
    const saveBtn = document.getElementById(this.state.saveBtnId)
    if (saveBtn) {
      saveBtn.style.display = 'none'
    }
  }

  render () {
    return this.props.children
  }
}
