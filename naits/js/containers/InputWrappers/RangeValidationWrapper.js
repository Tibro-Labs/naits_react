import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { store } from 'tibro-redux'
import { validateRange, resetValidation } from 'backend/validationActions'
import { alertUser } from 'tibro-components'
import { formatAlertType, strcmp } from 'functions/utils'

class RangeValidationWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null
    }
  }

  componentDidMount () {
    let rangeFrom = 'root_START_TAG_ID'
    let rangeTo = 'root_END_TAG_ID'
    let tagType = 'root_TAG_TYPE'
    if (strcmp(this.props.selectedObject.showGrid, 'TRANSFER')) {
      rangeFrom = 'root_transfer_range.info_START_TAG_ID'
      rangeTo = 'root_transfer_range.info_END_TAG_ID'
      tagType = 'root_transfer_range.info_TAG_TYPE'
    }
    const elementFrom = document.getElementById(rangeFrom)
    const elementTo = document.getElementById(rangeTo)
    const elementTag = document.getElementById(tagType)
    if (elementFrom && elementTo && elementTag) {
      elementFrom.onkeyup = this.validateInput
      elementTo.onkeyup = this.validateInput
      elementTag.onchange = this.validateInput
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.validationMessage &&
      this.props.validationMessage !== nextProps.validationMessage) {
      this.setState({
        alert: alertUser(
          true,
          formatAlertType(nextProps.validationMessage),
          this.context.intl.formatMessage({
            id: nextProps.validationMessage,
            defaultMessage: nextProps.validationMessage
          }),
          '',
          this.closeAlertAndResetValidation
        )
      })
    }
  }

  closeAlertAndResetValidation = () => {
    this.setState({ alert: alertUser(false, 'info', '') })
    store.dispatch(resetValidation())
  }

  validateInput = () => {
    let formData = this.props.formInstance.state.formTableData
    const tableName = this.props.selectedObject.showGrid
    let parentId = '0'
    // transfer uischema is differs from range
    if (strcmp(tableName, 'TRANSFER')) {
      parentId = this.props.selectedObject.parentId
      formData = formData['transfer_range.info']
    }
    // these field values must be entered
    const tagType = formData.TAG_TYPE
    const from = formData.START_TAG_ID
    const to = formData.END_TAG_ID

    if (tableName && parentId && tagType && from && to && (Number(from) < Number(to))) {
      store.dispatch(
        validateRange(
          this.props.svSession,
          tableName,
          parentId,
          tagType,
          from,
          to
        )
      )
    }
  }

  render () {
    // react jsonschema form
    return this.props.children
  }
}

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  validationMessage: state.validationResults.message,
  selectedObject: state.componentToDisplay.componentToDisplay[0].props.gridProps
})

RangeValidationWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(RangeValidationWrapper)
