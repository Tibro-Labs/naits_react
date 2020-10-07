import React from 'react'
import PropTypes from 'prop-types'
import style from './OfflineBanner.module.css'
import { Offline } from 'react-detect-offline'
import * as config from 'config/config.js'

export default class OfflineBanner extends React.Component {
  render () {
    return (
      <Offline polling={{enabled: false}}>
        <div className={style.main + ' alert alert-danger alert-dismissible'}>
          {
            this.context.intl.formatMessage(
              {
                id: `${config.labelBasePath}.network_offline`,
                defaultMessage: `${config.labelBasePath}.network_offline`
              }
            )
          }
        </div>
      </Offline>
    )
  }
}

OfflineBanner.contextTypes = {
  intl: PropTypes.object.isRequired
}

// {navigator.onLine ? null : <div id={'zelka'} />}
