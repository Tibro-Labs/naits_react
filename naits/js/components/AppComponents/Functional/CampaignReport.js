import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import * as config from 'config/config.js'
import { dropdownConfig } from 'config/dropdownConfig'
import { alertUser } from 'tibro-components'
import { Loading } from 'components/ComponentsIndex'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import consoleStyle from 'components/AppComponents/Functional/AdminConsole/AdminConsole.module.css'

class CampaignReport extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      municipalities: [],
      months: [],
      loading: false,
      municValue: '',
      monthValue: ''
    }
  }

  componentDidMount () {
    // Get all the available municipalities
    this.getMunicipalities()
    // Get all the months from config
    this.setState({ months: dropdownConfig('MONTHS_DROPDOWN') })
  }

  getMunicipalities = async () => {
    this.setState({ loading: true })
    let server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.GET_MUNIC_WITH_CAMPAIGN
    let restUrl = `${server}${verbPath}`

    restUrl = restUrl.replace('%sessionId', this.props.svSession)
    restUrl = restUrl.replace('%objectId', this.props.objectId)

    const municipalities = await axios.get(restUrl)
    let municsObjArr = []
    municipalities.data.forEach(munic => municsObjArr.push({
      externalId: munic['SVAROG_ORG_UNITS.EXTERNAL_ID'],
      name: munic['SVAROG_ORG_UNITS.NAME']
    }))

    if (municipalities.data === undefined || municipalities.data.length === 0) {
      this.setState({ municipalities: [], loading: false })
    } else {
      this.setState({ municipalities: municsObjArr, loading: false })
    }
  }

  handleMunicipalitySelection = (e) => {
    this.setState({ municValue: e.target.value })
  }

  handleMonthSelection = (e) => {
    this.setState({ monthValue: e.target.value })
  }

  close = () => {
    this.setState({ alert: false })
  }

  showAlert = () => {
    if (this.state.municipalities === undefined || this.state.municipalities.length === 0) {
      this.setState({
        alert: alertUser(
          true,
          'error',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.no_campaign_report_to_generate`,
            defaultMessage: `${config.labelBasePath}.main.no_campaign_report_to_generate`
          }),
          null, null,
          () => {
            this.close()
          }
        )
      })
    } else {
      let wrapper = document.createElement('div')
      ReactDOM.render(
        <div style={{ marginLeft: '12px' }}>
          <label htmlFor='municipalities' style={{ padding: '0.9rem 2px' }}>
            {this.context.intl.formatMessage(
              {
                id: config.labelBasePath + '.grid_labels.village.munic_code',
                defaultMessage: config.labelBasePath + '.grid_labels.village.munic_code'
              }
            )}:
          </label>
          <select
            name='municipalities'
            id='municipalities'
            className={consoleStyle.campaignDropdown}
            style={{ marginLeft: '1rem' }}
            onClick={this.handleMunicipalitySelection}
          >
            <option
              id='blankPlaceholder'
              key='blankPlaceholder'
              value={''}
              disabled selected hidden
            >
              {this.context.intl.formatMessage(
                {
                  id: config.labelBasePath + '.main.select_municipality',
                  defaultMessage: config.labelBasePath + '.main.select_municipality'
                }
              )}
            </option>
            {this.state.municipalities.map(municipality => {
              return <option key={municipality.externalId} value={municipality.externalId}>
                {municipality.name}
              </option>
            })}
          </select>
          <br />
          <label
            htmlFor='months'
            style={{ padding: '0.9rem 2px', marginLeft: '3px' }}
          >
            {this.context.intl.formatMessage(
              {
                id: config.labelBasePath + '.main.month',
                defaultMessage: config.labelBasePath + '.main.month'
              }
            )}:
          </label>
          <select
            name='months'
            id='months'
            className={consoleStyle.campaignDropdown}
            style={{ marginLeft: '0.8rem' }}
            onClick={this.handleMonthSelection}
          >
            <option
              id='blankPlaceholder'
              key='blankPlaceholder'
              value={''}
              disabled selected hidden
            >
              {this.context.intl.formatMessage(
                {
                  id: config.labelBasePath + '.main.select_month',
                  defaultMessage: config.labelBasePath + '.main.select_month'
                }
              )}
            </option>
            {this.state.months.map(month => {
              return <option key={month.VALUE} value={month.VALUE}>
                {this.context.intl.formatMessage(
                  {
                    id: month.LABEL,
                    defaultMessage: month.LABEL
                  }
                )}
              </option>
            })}
          </select>
        </div>,
        wrapper
      )

      this.setState({
        alert: alertUser(
          true,
          'info',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.campaign_report`,
            defaultMessage: `${config.labelBasePath}.main.campaign_report`
          }),
          null,
          () => {
            this.generateCampaignReport()
            this.setState({ municValue: '', monthValue: '' })
          },
          () => {
            this.close()
            this.setState({ municValue: '', monthValue: '' })
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
  }

  generateCampaignReport = () => {
    let municCode = this.state.municValue
    let month = this.state.monthValue
    if ((municCode === '' && month === '') || (municCode === '' || month === '')) {
      this.close()
    } else {
      let url = config.svConfig.triglavRestVerbs.GET_CAMPAIGN_REPORT
      url = url.replace('%session', this.props.svSession)
      url = url.replace('%objectId', this.props.objectId)
      url = url.replace('%reportName', 'vaccEventSummary')
      url = url.replace('%param1', null)
      url = url.replace('%param2', month)
      url = url.replace('%param3', municCode)
      window.open(`${config.svConfig.restSvcBaseUrl}/${url}`, '_blank')
    }
  }

  render () {
    return (
      <React.Fragment>
        {this.state.loading ? <Loading />
          : <React.Fragment>
            <div
              id='campaign_report'
              className={styles.container}
              style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
              onClick={this.showAlert}
            >
              <p>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.campaign_report`,
                  defaultMessage: `${config.labelBasePath}.main.campaign_report`
                })}
              </p>
              <div id='campaign_report' className={styles['gauge-container']}>
                <img
                  id='change_status_img'
                  className={style.actionImg}
                  style={{ height: '45px', marginTop: '7%', marginLeft: '14px' }}
                  src='/naits/img/massActionsIcons/actions_general.png'
                />
              </div>
            </div>
          </React.Fragment>}
      </React.Fragment>
    )
  }
}

CampaignReport.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default CampaignReport
