import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as config from 'config/config.js'
import { isValidObject } from 'functions/utils'
import styles from './Badges.module.css'

class ObjectSummaryInfoBadge extends React.Component {
  showObjectSummaryInfo = () => {
    let splitString = []
    let data = null
    if (this.props.additionalData) {
      const items = this.props.additionalData.orderedItems
      if (isValidObject(items, 1)) {
        data = items
      }
    }
    if (data) {
      let unformattedData = Object.assign({}, data)
      for (const key in unformattedData) {
        let decodedLabel
        if (key.startsWith('naits') && this.props.gridType === 'SVAROG_USERS') {
          decodedLabel = this.context.intl.formatMessage({
            id: key.replace(':', ''),
            defaultMessage: key.replace(':', '')
          })
        } else {
          decodedLabel = this.context.intl.formatMessage({
            id: key,
            defaultMessage: key
          })
        }
        let element = ''
        let value = unformattedData[key]
        element = element + decodedLabel + ' ' + value
        splitString.push(element)
        splitString.push(<br id={key} key={key} />)
      }
    }
    return (
      <div id='previewData' className='show-data'>
        {splitString.length > 0 ? splitString : data}
      </div>
    )
  }

  render () {
    return (
      <div id='objectInfoSummary' className={styles.container}
      >
        <p>{this.context.intl.formatMessage({ id: `${config.labelBasePath}.objectSummaryInfo`, defaultMessage: `${config.labelBasePath}.objectSummaryInfo` })}</p>
        <div id='showObjectInfoSummary' className={styles['gauge-container']}>
          <img id='information' className='actionImg' style={{ height: '45px', marginTop: '7%' }}
            src='/naits/img/massActionsIcons/info-sign.png' />

          <div className={styles['show-dropdown']}>
            {this.showObjectSummaryInfo()}
          </div>
        </div>
      </div>
    )
  }
}

ObjectSummaryInfoBadge.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  svSession: state.security.svSession,
  additionalData: state.additionalData[ownProps.objectType]
})

export default connect(mapStateToProps)(ObjectSummaryInfoBadge)
