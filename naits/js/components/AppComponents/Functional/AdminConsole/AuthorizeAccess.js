import React from 'react'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import { goBack } from 'functions/utils'

/** Access authorization class - allows mounting of children compoenets
  * if the user has successfully passed the validation web service
  * KNI 09.10.2018
*/

class AuthorizeAccess extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (nextProps.isAdmin === false) {
      alertUser(true, 'error', 'User not authorized', null, () => goBack())
    }
  }

  render () {
    let component = null
    if (this.props.isAdmin) {
      component = this.props.children
    }
    return component
  }
}

const mapStateToProps = (state) => ({
  isAdmin: state.userInfoReducer.isAdmin
})

export default connect(mapStateToProps)(AuthorizeAccess)
