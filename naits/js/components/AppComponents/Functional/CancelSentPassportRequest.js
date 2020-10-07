import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import * as config from 'config/config.js'
import { GridManager } from 'components/ComponentsIndex'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import { formatAlertType, isValidArray } from 'functions/utils'

class CancelSentPassportRequest extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null
    }
  }

  componentDidUpdate (nextProps) {
    if (this.props.passportRequestHasBeenCanceled !== nextProps.passportRequestHasBeenCanceled) {
      let gridId = this.props.selectedGridId
      GridManager.reloadGridData(gridId)
      let altGridId = null
      altGridId = gridId.slice(0, -1)
      altGridId = `${altGridId}2`
      GridManager.reloadGridData(altGridId)
      store.dispatch({ type: 'CANCEL_PASSPORT_REQUEST_RESET' })
    }
  }

  cancelPassportRequest = () => {
    const objectArray = this.props.selectedGridRows
    const actionType = 'UPDATE_STATUS'
    const paramsArray = [{
      MASS_PARAM_TBL_NAME: this.props.selectedObject,
      MASS_PARAM_ACTION: actionType,
      MASS_PARAM_SUBACTION: 'CANCEL_REQUEST'
    }]
    const verbPath = config.svConfig.triglavRestVerbs.MASS_OBJECT_HANDLER
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${this.props.session}`

    axios({
      method: 'post',
      url: url,
      data: JSON.stringify({ objectArray, paramsArray })
    }).then((res) => {
      if (res.data.includes('error')) {
        store.dispatch({ type: 'CANCEL_PASSPORT_REQUEST_REJECTED', payload: res.data })
      } else if (res.data.includes('success')) {
        store.dispatch({ type: 'CANCEL_PASSPORT_REQUEST_FULFILLED', payload: res.data })
      }
      const responseType = formatAlertType(res.data)
      this.setState({
        alert: alertUser(
          true,
          responseType,
          this.context.intl.formatMessage({
            id: res.data,
            defaultMessage: res.data
          }),
          null
        )
      })
    })
  }

  showAlert = () => {
    if (isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.cancel_passport_request_prompt`,
            defaultMessage: `${config.labelBasePath}.main.cancel_passport_request_prompt`
          }),
          null,
          () => {
            this.cancelPassportRequest()
          },
          () => {
            this.close()
          },
          true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.confirm`,
            defaultMessage: `${config.labelBasePath}.main.confirm`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }),
          true,
          null,
          true
        )
      })
    } else {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.empty_selection`,
            defaultMessage: `${config.labelBasePath}.alert.empty_selection`
          }), null,
          () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    }
  }

  close = () => {
    this.setState({ alert: false, showAlert: false })
  }

  render () {
    return (
      <div
        id='cancel_passport_request'
        className={styles.container}
        style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
        onClick={this.showAlert}
      >
        <p>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.cancel_passport_request`,
            defaultMessage: `${config.labelBasePath}.main.cancel_passport_request`
          })}
        </p>
        <div id='cancel_passport_request' className={styles['gauge-container']}>
          <img
            id='change_status_img' className={style.actionImg}
            style={{ height: '45px', marginTop: '7%', marginLeft: '14px' }}
            src='/naits/img/massActionsIcons/kill_animal.png'
          />
        </div>
      </div>
    )
  }
}

CancelSentPassportRequest.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  selectedGridRows: state.selectedGridRows.selectedGridRows,
  selectedGridId: state.selectedGridRows.gridId,
  session: state.security.svSession,
  passportRequestHasBeenCanceled: state.passportRequest.passportRequestHasBeenCanceled
})

export default connect(mapStateToProps)(CancelSentPassportRequest)
