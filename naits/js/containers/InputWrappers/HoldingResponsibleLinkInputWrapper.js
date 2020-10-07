import React from 'react'

export default class HoldingResponsibleLinkInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      deleteBtn: 'delete_form_btn',
      submitBtn: 'save_form_btn'
    }
  }

  componentDidMount () {
    this.hideDeleteAndSubmitBtns()
  }

  componentDidUpdate () {
    this.hideDeleteAndSubmitBtns()
  }

  hideDeleteAndSubmitBtns = () => {
    const deleteBtn = document.getElementById(this.state.deleteBtn)
    const submitBtn = document.getElementById(this.state.submitBtn)
    if (deleteBtn && submitBtn) {
      deleteBtn.style.display = 'none'
      submitBtn.style.display = 'none'
    }
  }

  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
