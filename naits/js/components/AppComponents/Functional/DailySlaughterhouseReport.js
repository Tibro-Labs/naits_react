import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import { alertUser } from 'tibro-components'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class DailySlaughterhouseReport extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      date: null
    }
  }

  close = () => {
    this.setState({ popup: false })
  }

  setDate = event => {
    this.setState({ date: event.target.value })
  }

  generateDailySlaReport = (props, date) => {
    let url = config.svConfig.triglavRestVerbs.GET_DAILY_SLA_REPORT
    url = url.replace('%session', props.svSession)
    url = url.replace('%objectId', props.objectId)
    url = url.replace('%reportName', 'sla_daily')
    url = url.replace('%dateFrom', date)
    url = url.replace('%dateTo', null)
    window.open(`${config.svConfig.restSvcBaseUrl}/${url}`, '_blank')
    this.setState({ date: null })
  }

  generateReport = () => {
    let wrapper = document.createElement('div')
    ReactDOM.render(
      <div style={{ marginLeft: '12px' }}>
        <label htmlFor='dateFrom' style={{ marginRight: '8px' }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.date_from`,
            defaultMessage: `${config.labelBasePath}.main.date_from`
          })}
        </label>
        <input
          style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
          type='date'
          name='dateFrom'
          onChange={this.setDate}
          value={this.state.date}
        />
        <br />
      </div>,
      wrapper
    )

    this.setState({
      alert: alertUser(
        true,
        'info',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.print.sla_daily`,
          defaultMessage: `${config.labelBasePath}.print.sla_daily`
        }),
        null,
        () => {
          this.generateDailySlaReport(this.props, this.state.date)
          this.close()
        },
        () => {
          this.setState({ date: null })
          this.close()
        },
        true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.generate`,
          defaultMessage: `${config.labelBasePath}.main.generate`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.forms.cancel`,
          defaultMessage: `${config.labelBasePath}.main.forms.cancel`
        }),
        true,
        null,
        true,
        wrapper
      )
    })
  }

  render () {
    return (
      <div
        id='sla_daily'
        className={styles.container}
        style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
        onClick={this.generateReport}
      >
        <p>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.sla_daily`,
            defaultMessage: `${config.labelBasePath}.main.sla_daily`
          })}
        </p>
        <div id='sla_daily' className={styles['gauge-container']}>
          <img
            id='change_status_img'
            className={style.actionImg}
            style={{ height: '45px', marginTop: '7%' }}
            src='/naits/img/massActionsIcons/actions_general.png'
          />
        </div>
      </div>
    )
  }
}

DailySlaughterhouseReport.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default DailySlaughterhouseReport
