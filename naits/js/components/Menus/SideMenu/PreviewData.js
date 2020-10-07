import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isValidObject } from 'functions/utils'

class PreviewData extends React.Component {
  render () {
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
        if (key.startsWith('naits') && this.props.objectType === 'SVAROG_USERS') {
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
      <div id='previewData' className='preview-data-holder'>
        {splitString.length > 0 ? splitString : data}
      </div>
    )
  }
}

PreviewData.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  svSession: state.security.svSession,
  additionalData: state.additionalData[ownProps.objectType]
})

export default connect(mapStateToProps)(PreviewData)
