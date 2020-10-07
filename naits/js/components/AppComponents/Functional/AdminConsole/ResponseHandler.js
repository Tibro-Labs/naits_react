import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import { formatAlertType } from 'functions/utils'

class ResponseHandler extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if ((nextProps.response.data || nextProps.response.error) &&
        (nextProps.response.data !== this.props.response.data ||
          nextProps.response.error !== this.props.response.error)) {
      const message = nextProps.response.data || nextProps.response.error
      if (message) {
        this.setState({
          alert: alertUser(
            true,
            formatAlertType(message),
            this.context.intl.formatMessage({
              id: message, defaultMessage: message
            }),
            null,
            this.closeAlert
          )
        })
      }
    }
  }

  closeAlert = () => {
    this.setState({ alert: alertUser(false, 'info', '') })
    if (this.props.onAlertClose && this.props.onAlertClose instanceof Function) {
      this.props.onAlertClose()
    }
  }

  render () {
    return this.state.alert || null
  }
}

const mapStateToProps = (state, ownProps) => {
  let response = null
  if (ownProps.responseState) {
    response = state[ownProps.responseState]
  }
  return {
    response: response
  }
}

ResponseHandler.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(ResponseHandler)
