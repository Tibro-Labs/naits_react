import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import sideMenuStyle from 'modulesCSS/SideMenu.module.css'
import consoleStyle from 'components/AppComponents/Functional/AdminConsole/AdminConsole.module.css'
import * as config from 'config/config'
import DatePicker from 'react-date-picker'
import { isValidArray, convertToShortDate } from 'functions/utils'
import { alertUser } from 'tibro-components'

const btnStyle = { 'marginTop': '-4px', 'marginRight': '5px' }
const textStyle = { 'marginRight': '5px' }
const textColor = { 'color': 'white' }

class ReportMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      displayReport: null,
      dateFrom: null,
      dateTo: null,
      alert: null,
      blankReport: null,
      VACCINATION_EVENTS: null
    }
  }

  componentDidMount () {
    this.getValidVaccEvents()
  }

  getValidVaccEvents = async () => {
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.GET_VALID_VACCINATION_EVENTS
    const url = server + verbPath + this.props.svSession
    try {
      const res = await axios.get(url)
      const items = res.data.items.map((element) => {
        return <option id={element.object_id} value={element.object_id} key={element.object_id}>
          {element.CAMPAIGN_NAME}
        </option>
      })
      this.setState({ VACCINATION_EVENTS: items })
    } catch (err) {
      this.setState({
        alert: alertUser(
          true,
          'error',
          this.context.intl.formatMessage({
            id: err,
            defaultMessage: err
          }),
          null,
          () => {
            this.setState({ alert: false })
          }
        )
      })
    }
  }

  generateReport = (reportName, datesEnabled, additionalParams) => {
    let url = config.svConfig.triglavRestVerbs.GET_REPORT
    url = url.replace('%session', this.props.svSession)
    url = url.replace('%objectId', this.props.objectCodeValue)
    url = url.replace('%reportName', reportName)
    let displayReport = ''
    let dateFrom = 'null'
    let dateTo = 'null'
    // status report does not require dates
    if (!datesEnabled) {
      displayReport = `${config.svConfig.restSvcBaseUrl}/${url}`
    } else {
      if (this.state.dateFrom && this.state.dateTo) {
        // convert date object to short date format
        dateFrom = String(convertToShortDate(this.state.dateFrom, 'y-m-d'))
        dateTo = String(convertToShortDate(this.state.dateTo, 'y-m-d'))
        displayReport = `${config.svConfig.restSvcBaseUrl}/${url}/${dateFrom}/${dateTo}`
      } else {
        // if no dates are selected for date-only reports, display an alert and
        // break function execuion so as not to dispatch the request
        this.setState({
          alert: alertUser(true, 'info', this.context.intl.formatMessage(
            {
              id: config.labelBasePath + '.main.dates_are_mandatory',
              defaultMessage: config.labelBasePath + '.main.dates_are_mandatory'
            }
          ))
        })
        return
      }
    }
    if (isValidArray(additionalParams, 1)) {
      if (!datesEnabled) {
        displayReport = displayReport + '/null/null'
      }
      for (let i = 0; i < additionalParams.length; i++) {
        const additionalValue = document.getElementById(additionalParams[i]).value
        if (!additionalValue) {
          return this.setState({
            alert: alertUser(true, 'warning',
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.alert.no_campaign_selected`,
                defaultMessage: `${config.labelBasePath}.alert.no_campaign_selected`
              }),
              null,
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        }
        displayReport = displayReport + `/${additionalValue}`
      }
    }
    this.setState({ displayReport })
  }

  setDateFrom = (date) => {
    this.setState({ dateFrom: date })
  }

  setDateTo = (date) => {
    this.setState({ dateTo: date })
  }

  render () {
    const frameWidth = (window.innerWidth * 78) / 100
    const frameHeight = ((window.innerHeight * 85) / 100) - 45
    const { displayReport, dateFrom, dateTo } = this.state
    const { reports, location, blankReports } = this.props
    const nowBtnText = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.now`,
      defaultMessage: `${config.labelBasePath}.main.now`
    })
    let component = null
    let menu = []
    let list = []
    for (const property in reports) {
      if (reports.hasOwnProperty(property)) {
        const id = reports[property].id
        const reportName = reports[property].reportName
        const labelCode = reports[property].labelCode
        const datesEnabled = reports[property].datesEnabled
        const additionalParams = reports[property].additionalParams
        menu.push(
          <li
            id={id}
            key={id}
            className={`list-group-item ${sideMenuStyle.li_item}`}
            onClick={() => this.generateReport(reportName, datesEnabled, additionalParams)}
          >
            {this.context.intl.formatMessage({
              id: labelCode, defaultMessage: labelCode
            })}
          </li>
        )
      }
    }
    for (const property in blankReports) {
      if (blankReports.hasOwnProperty(property)) {
        const labelCode = blankReports[property].labelCode
        const id = blankReports[property].id
        list.push(
          <li
            id={id}
            key={id}
            className={`list-group-item ${sideMenuStyle.li_item}`}
          >
            {this.context.intl.formatMessage({
              id: labelCode, defaultMessage: labelCode
            })}
          </li>
        )
      }
    }

    if (displayReport) {
      component = <iframe
        id='reportDisplayFrame'
        width={frameWidth}
        height={frameHeight}
        border='none'
        src={displayReport}
      />
    }
    const dateFields = <div id='dateSelection' style={{ padding: '5px' }}>
      <span style={textStyle}>
        {this.context.intl.formatMessage(
          {
            id: `${config.labelBasePath}.main.date_from`,
            defaultMessage: `${config.labelBasePath}.main.date_from`
          }
        )}
      </span>
      <DatePicker
        key='from'
        required
        className='datePicker'
        onChange={this.setDateFrom}
        value={dateFrom}
      />
      <button
        id='setDateFromNow'
        className='btn-success buttonNowInline'
        style={btnStyle}
        onClick={() => this.setDateFrom(new Date())}
      >
        {nowBtnText}
      </button>
      <span style={textStyle}>
        {this.context.intl.formatMessage(
          {
            id: `${config.labelBasePath}.main.date_to`,
            defaultMessage: `${config.labelBasePath}.main.date_to`
          }
        )}
      </span>
      <DatePicker
        key='to'
        required
        className='datePicker'
        onChange={this.setDateTo}
        value={dateTo}
      />
      <button
        id='setDateToNow'
        className='btn-success buttonNowInline'
        style={btnStyle}
        onClick={() => this.setDateTo(new Date())}
      >
        {nowBtnText}
      </button>
    </div>
    return (
      <div>
        <div id='reportSideMenu' className={sideMenuStyle.sideDiv}>
          {location &&
            <label id='location'>
              {location}
            </label>
          }
          <br />
          <button id='selectNew' className={consoleStyle.conButton}
            onClick={this.props.clearSelection}>
            {this.context.intl.formatMessage(
              {
                id: `${config.labelBasePath}.main.back_to_all_reports`,
                defaultMessage: `${config.labelBasePath}.main.back_to_all_reports`
              }
            )}
          </button>
          <br />
          {reports && this.props.objectCodeValue && <React.Fragment>
            <label style={{ marginTop: '1rem' }}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.vaccination_event`,
                defaultMessage: `${config.labelBasePath}.main.vaccination_event`
              })}
            </label>
            <select
              id='VACCINATION_EVENT'
              className='form-control structuredForm'
              style={{ backgroundColor: '#e3eedd' }}>
              <option value='' selected hidden>{''}</option>
              {this.state.VACCINATION_EVENTS}
            </select>
            <br />
            <br />
          </React.Fragment>}
          {reports &&
            <ul
              id='reportList'
              className={sideMenuStyle.ul_item}
              style={{ marginTop: '2rem' }}
            >
              {menu}
            </ul>
          }
          {blankReports &&
            <ul id='blankReportList' className={sideMenuStyle.ul_item}>
              <li className={`list-group-item ${sideMenuStyle.li_item}`} >
                <div >
                  <a
                    style={textColor}
                    id='doc_4'
                    href={`/UserManuals/${config.labelBasePath}.main.afr_form.pdf`}
                    target='_blank'
                  >
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.main.afr_form.pdf`,
                      defaultMessage: `${config.labelBasePath}.main.afr_form.pdf`
                    })}
                  </a>
                </div>
              </li>
              <li className={`list-group-item ${sideMenuStyle.li_item}`} >
                <div>
                  <a
                    style={textColor}
                    id='doc_4'
                    href={`/UserManuals/${config.labelBasePath}.main.hrf_form.pdf`}
                    target='_blank'
                  >
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.main.hrf_form.pdf`,
                      defaultMessage: `${config.labelBasePath}.main.hrf_form.pdf`
                    })}
                  </a>
                </div>
              </li>
              <li className={`list-group-item ${sideMenuStyle.li_item}`} >
                <div>
                  <a
                    style={textColor}
                    id='doc_4'
                    href={`/UserManuals/${config.labelBasePath}.main.suf_form.pdf`}
                    target='_blank'
                  >
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.main.suf_form.pdf`,
                      defaultMessage: `${config.labelBasePath}.main.suf_form.pdf`
                    })}
                  </a>
                </div>
              </li>
              <li className={`list-group-item ${sideMenuStyle.li_item}`} >
                <div>
                  <a
                    style={textColor}
                    id='doc_4'
                    href={`/UserManuals/${config.labelBasePath}.main.as_form.pdf`}
                    target='_blank'
                  >
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.main.as_form.pdf`,
                      defaultMessage: `${config.labelBasePath}.main.as_form.pdf`
                    })}
                  </a>
                </div>
              </li>
            </ul>
          }
        </div>
        <div id='reportDisplay' className='displayContent'>
          {this.props.objectCodeValue && dateFields}
          <br />
          {component}
        </div>
      </div>
    )
  }
}

ReportMenu.contextTypes = {
  intl: PropTypes.object.isRequired
}

ReportMenu.propTypes = {
  objectCodeValue: PropTypes.string,
  clearSelection: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  svSession: state.security.svSession
})

export default connect(mapStateToProps)(ReportMenu)
