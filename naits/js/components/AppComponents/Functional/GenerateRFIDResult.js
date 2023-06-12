import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import { GridManager, Loading } from 'components/ComponentsIndex'
import { formatAlertType } from 'functions/utils'
import * as config from 'config/config.js'
import Circle from 'components/AppComponents/Presentational/Badges/PercentageCircle'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

export default class GenerateRFIDResult extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: false,
      loading: false,
      reRender: false
    }
  }

  generateRfidResultPrompt = () => {
    this.setState({
      alert: alertUser(
        true, 'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.generate_rfid_result_prompt`,
          defaultMessage: `${config.labelBasePath}.alert.generate_rfid_result_prompt`
        }), null, () => this.generateRfidResult(), () => this.close(), true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.generate`,
          defaultMessage: `${config.labelBasePath}.main.generate`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.forms.cancel`,
          defaultMessage: `${config.labelBasePath}.main.forms.cancel`
        })
      )
    })
  }

  generateRfidResult = () => {
    this.setState({ loading: true })
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.GENERATE_RFID_RESULT
    let url = `${server}${verbPath}`
    url = url.replace('%session', this.props.svSession)
    url = url.replace('%objectId', this.props.objectId)
    axios.get(url).then(res => {
      this.setState({ loading: false, reRender: true })
      store.dispatch({ type: 'RFID_RESULT_HAS_BEEN_GENERATED' })
      const responseType = formatAlertType(res.data)
      this.setState({
        alert: alertUser(
          true, responseType,
          this.context.intl.formatMessage({
            id: res.data,
            defaultMessage: res.data
          }), null, () => {
            GridManager.reloadGridData(`RFID_RESULT_${this.props.objectId}`)
            store.dispatch({ type: 'RESET_RFID_STATUS_CHANGE' })
            this.setState({ reRender: false })
            this.close()
          }
        )
      })
    }).catch(err => {
      this.setState({ loading: false })
      this.setState({
        alert: alertUser(
          true, 'error',
          this.context.intl.formatMessage({
            id: err,
            defaultMessage: err
          }), null, () => { this.close() }
        )
      })
    })
  }

  close = () => {
    this.setState({ alert: false })
  }

  render () {
    const currentRfidStatus = this.props.componentStack[0].row['RFID.STATUS']
    return (
      <React.Fragment>
        {this.state.loading && <Loading />}
        <div
          id='generate_rfid_result'
          className={styles.container}
          style={{
            cursor: 'pointer',
            marginRight: '7px',
            color: currentRfidStatus === 'PROCESSED' ? '#66717E' : '#FFFFFF',
            backgroundColor: currentRfidStatus === 'PROCESSED' ? '#333333' : 'rgba(36, 19, 8, 0.9)',
            pointerEvents: currentRfidStatus === 'PROCESSED' ? 'none' : null
          }}
          onClick={this.generateRfidResultPrompt}
        >
          <p>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.generate_rfid_result`,
              defaultMessage: `${config.labelBasePath}.main.generate_rfid_result`
            })}
          </p>
          <div id='generate_rfid_result' className={styles['gauge-container']}>
            <Circle
              className={styles['gauge-container']}
              trailWidth='2'
              strokeWidth='2'
              strokeColor={currentRfidStatus === 'PROCESSED' ? '#66717E' : '#FFFFFF'}
              trailColor='gray'
            />
            <svg viewBox='0 0 482.81 482.81' className={styles.print}>
              <g>
                <path
                  fill={currentRfidStatus === 'PROCESSED' ? '#66717E' : '#FFFFFF'}
                  d='M464.764,25.771H18.037C8.086,25.771,0,33.869,0,43.808v395.196c0,6.106,3.068,11.491,7.729,14.76v2.843h6.469
                    c1.241,0.272,2.518,0.432,3.839,0.432h446.738c1.318,0,2.595-0.159,3.83-0.432h0.887v-0.271
                    c7.654-2.093,13.317-9.032,13.317-17.331V43.813C482.81,33.869,474.717,25.771,464.764,25.771z M467.347,43.813v51.979H348.363
                    v-54.56h116.4C466.194,41.233,467.347,42.392,467.347,43.813z M466.105,441.145H348.363V392.18h118.983v46.824
                    C467.347,439.92,466.832,440.695,466.105,441.145z M15.457,439.004V392.18h55.842v48.965H16.698
                    C15.971,440.695,15.457,439.92,15.457,439.004z M201.448,256.87v53.61H86.758v-53.61H201.448z M86.758,241.407v-57.99h114.689
                    v57.99H86.758z M201.448,325.943v50.773H86.758v-50.773H201.448z M201.448,392.18v48.965H86.758V392.18H201.448z M216.913,392.18
                    H332.9v48.965H216.913V392.18z M216.913,376.717v-50.779H332.9v50.779H216.913z M216.913,310.48v-53.61H332.9v53.61H216.913z
                    M216.913,241.407v-57.99H332.9v57.99H216.913z M216.913,167.954v-56.702H332.9v56.702H216.913z M216.913,95.787v-54.56H332.9
                    v54.56H216.913z M201.448,95.787H86.758v-54.56h114.689V95.787z M201.448,111.252v56.702H86.758v-56.702H201.448z M71.299,167.954
                    H15.457v-56.702h55.842V167.954z M71.299,183.417v57.99H15.457v-57.99H71.299z M71.299,256.87v53.61H15.457v-53.61H71.299z
                    M71.299,325.943v50.773H15.457v-50.773H71.299z M348.363,376.717v-50.779h118.983v50.779H348.363z M348.363,310.48v-53.61h118.983
                    v53.61H348.363z M348.363,241.407v-57.99h118.983v57.99H348.363z M348.363,167.954v-56.702h118.983v56.702H348.363z'
                />
              </g>
              <g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g />
            </svg>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

GenerateRFIDResult.contextTypes = {
  intl: PropTypes.object.isRequired
}
