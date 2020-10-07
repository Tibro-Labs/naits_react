import React from 'react'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'

const style = {
  'textAlign': 'center',
  'width': '50%',
  'marginLeft': '25%',
  'padding': '20px',
  'backgroundColor': 'rgba(1,1,1, 0.5)',
  'boxShadow': '1px 1px 10px black',
  'color': 'white'
}

function refresh () {
  window.location.href = '#/'
}

export default class NotFound extends React.Component {
  render () {
    return (
      <div style={style}>
        <h1 style={{ color: 'inherit' }}>
          {this.context.intl.formatMessage(
            {
              id: `${config.labelBasePath}.main.an_error_occured`,
              defaultMessage: `${config.labelBasePath}.main.an_error_occured`
            }
          )}
        </h1>
        <p>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.please_reload`,
            defaultMessage: `${config.labelBasePath}.main.please_reload`
          }
          )}
        </p>
        <button id='back' className='btn' onClick={refresh}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.reload`,
            defaultMessage: `${config.labelBasePath}.main.reload`
          }
          )}
        </button>
      </div>
    )
  }
}

NotFound.contextTypes = {
  intl: PropTypes.object.isRequired
}
