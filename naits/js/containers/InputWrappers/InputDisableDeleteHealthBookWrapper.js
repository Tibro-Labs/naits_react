import React from 'react'
import { connect } from 'react-redux'

class InputDisableDeleteHealthBookWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      fieldIdName: 'delete_form_btn'
    }
  }

  componentDidMount () {
    if (!this.props.isAdmin) {
      const deleteBtn = document.getElementById(this.state.fieldIdName)
      if (deleteBtn) {
        deleteBtn.style.display = 'none'
      }
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

const mapStateToProps = (state) => ({
  isAdmin: state.userInfoReducer.isAdmin
})

export default connect(mapStateToProps)(InputDisableDeleteHealthBookWrapper)
