import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as config from 'config/config'

class LoggedInAs extends React.Component {
  render () {
    const style = {
      'display': this.props.display || 'inline',
      'color': this.props.textColor || '#e0ab10',
      'marginRight': '5px',
      'fontWeight': 'bold'
    }
    return (
      <div id='show_current_user' style={style}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.logged_in_as`,
          defaultMessage: `${config.labelBasePath}.main.logged_in_as`
        })}: {this.props.currentUser}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.security.currentUser
})

LoggedInAs.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(LoggedInAs)
