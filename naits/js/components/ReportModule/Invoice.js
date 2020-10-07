import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { DependencyDropdowns, Select, alertUser } from 'tibro-components'
import { Loading } from 'components/ComponentsIndex'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import { addDays, subDays } from 'date-fns'
import * as config from 'config/config'
import sideMenuStyle from 'modulesCSS/SideMenu.module.css'
import consoleStyle from 'components/AppComponents/Functional/AdminConsole/AdminConsole.module.css'
import style from './Invoice.module.css'
import { convertToShortDate, gaEventTracker } from 'functions/utils'

class Invoice extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      loading: false,
      users: [],
      selectedUser: null,
      showUserSpecific: true,
      showNonUserSpecific: false,
      dateFrom: null,
      dateTo: null,
      reportUrl: ''
    }
  }

  componentDidMount () {
    this.getAllUsers()
  }

  getAllUsers = async () => {
    this.setState({ loading: true })
    const { session } = this.props
    let server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.GET_BYPARENTID_SYNC_WITH_ORDER
    let restUrl = `${server}${verbPath}`

    restUrl = restUrl.replace('%s1', session)
    restUrl = restUrl.replace('%s2', 0)
    restUrl = restUrl.replace('%s3', 'SVAROG_USERS')
    restUrl = restUrl.replace('%s4', 100000)
    restUrl = restUrl.replace('%order', 'USER_NAME')

    const users = await axios.get(restUrl)
    let usernamesArr = []
    users.data.map(user => usernamesArr.push({
      value: user['SVAROG_USERS.USER_NAME'],
      label: user['SVAROG_USERS.USER_NAME']
    }))

    if (users.data === undefined || users.data.length === 0) {
      this.setState({ users: [], loading: false })
    } else {
      this.setState({ users: usernamesArr, loading: false })
    }
  }

  setDateFrom = (date) => {
    this.setState({ dateFrom: date })
  }

  setDateTo = (date) => {
    this.setState({ dateTo: date })
  }

  handleUserSelection = (selectedUser) => {
    this.setState({ selectedUser })
  }

  close = () => {
    this.setState({ alert: false })
  }

  generateInvoice = (reportName, selectedUser, isExcel) => {
    const { showNonUserSpecific, showUserSpecific, dateFrom, dateTo } = this.state
    let fullName = null
    let location = null
    let regionElement = null
    let municipalityElement = null
    let communityElement = null
    let villageElement = null
    let region = null
    let municipality = null
    let community = null
    let village = null

    if (!selectedUser) {
      fullName = null
    } else {
      fullName = selectedUser.value
      fullName = fullName.replace(/\./g, '-')
      fullName = encodeURIComponent(fullName)
    }

    regionElement = document.getElementById('root_holding.location.info_REGION_CODE')
    region = regionElement.options[regionElement.selectedIndex].value
    municipalityElement = document.getElementById('root_holding.location.info_MUNIC_CODE')
    if (!municipalityElement) {
      municipality = null
    } else {
      municipality = municipalityElement.options[municipalityElement.selectedIndex].value
    }
    communityElement = document.getElementById('root_holding.location.info_COMMUN_CODE')
    if (!communityElement) {
      community = null
    } else {
      community = communityElement.options[communityElement.selectedIndex].value
    }
    villageElement = document.getElementById('root_holding.location.info_VILLAGE_CODE')
    if (!villageElement) {
      village = null
    } else {
      village = villageElement.options[villageElement.selectedIndex].value
    }
    location = village || community || municipality || region

    if (showUserSpecific && !fullName) {
      return this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.parameters_missing`,
            defaultMessage: `${config.labelBasePath}.alert.parameters_missing`
          }),
          this.context.intl.formatMessage({
            id: config.labelBasePath + '.main.search.form_labels.user_name',
            defaultMessage: config.labelBasePath + '.main.search.form_labels.user_name'
          }),
          () => this.setState({ alert: alertUser(false, 'info', '') }))
      })
    }

    if (!dateFrom) {
      return this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_date_selected`,
            defaultMessage: `${config.labelBasePath}.alert.no_date_selected`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_starting_date_selected`,
            defaultMessage: `${config.labelBasePath}.alert.no_starting_date_selected`
          }),
          () => this.setState({ alert: alertUser(false, 'info', '') }))
      })
    }

    if (!dateTo) {
      return this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_date_selected`,
            defaultMessage: `${config.labelBasePath}.alert.no_date_selected`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_ending_date_selected`,
            defaultMessage: `${config.labelBasePath}.alert.no_ending_date_selected`
          }),
          () => this.setState({ alert: alertUser(false, 'info', '') }))
      })
    }

    if (!region) {
      return this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.parameters_missing`,
            defaultMessage: `${config.labelBasePath}.alert.parameters_missing`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_region_selected`,
            defaultMessage: `${config.labelBasePath}.alert.no_region_selected`
          }),
          () => this.setState({ alert: alertUser(false, 'info', '') }))
      })
    }

    if (showNonUserSpecific && !municipality) {
      return this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.parameters_missing`,
            defaultMessage: `${config.labelBasePath}.alert.parameters_missing`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_municipality_selected`,
            defaultMessage: `${config.labelBasePath}.alert.no_municipality_selected`
          }),
          () => this.setState({ alert: alertUser(false, 'info', '') }))
      })
    }

    const shortDateFrom = convertToShortDate(dateFrom, 'y-m-d')
    const shortDateTo = convertToShortDate(dateTo, 'y-m-d')
    const { session } = this.props
    let method
    let url
    if (isExcel) {
      method = config.svConfig.triglavRestVerbs.GET_INVOICE_XLS
      if (showUserSpecific && fullName && location) {
        url = `${config.svConfig.restSvcBaseUrl}/${method}/${session}/${location}/${isExcel}/${shortDateFrom}/${shortDateTo}/${fullName.toUpperCase()}/${reportName}`
        window.open(url, '_blank')
      } else if (showNonUserSpecific && location) {
        url = `${config.svConfig.restSvcBaseUrl}/${method}/${session}/${location}/${isExcel}/${shortDateFrom}/${shortDateTo}/null/${reportName}`
        window.open(url, '_blank')
      }
    } else {
      method = config.svConfig.triglavRestVerbs.GET_INVOICE
      if (showUserSpecific && fullName && location) {
        url = `${config.svConfig.restSvcBaseUrl}/${method}/${session}/${location}/${reportName}/${shortDateFrom}/${shortDateTo}/${fullName.toUpperCase()}`
        this.setState({ reportUrl: url })
      } else if (showNonUserSpecific && location) {
        url = `${config.svConfig.restSvcBaseUrl}/${method}/${session}/${location}/${reportName}/${shortDateFrom}/${shortDateTo}/null`
        this.setState({ reportUrl: url })
      }
    }
  }

  render () {
    const frameWidth = (window.innerWidth * 78) / 100
    const frameHeight = ((window.innerHeight * 85) / 100) - 45
    const nowBtnText = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.now`,
      defaultMessage: `${config.labelBasePath}.main.now`
    })

    const {
      dateFrom, dateTo, loading, reportUrl, selectedUser,
      showNonUserSpecific, showUserSpecific, users
    } = this.state

    return (
      <div>
        <div id='reportSideMenu' className={sideMenuStyle.sideDiv}>
          <label id='location'>
            {this.context.intl.formatMessage(
              {
                id: `${config.labelBasePath}.main.invoices`,
                defaultMessage: `${config.labelBasePath}.main.invoices`
              }
            )}
          </label>
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
        </div>
        <div id='invoice_container' className={`displayContent ${style['invoice-container']}`}>
          <button
            id='generateUserSpecificInvoice'
            className={`btn-success buttonNowInline ${showUserSpecific ? 'active' : ''} ${style['invoice-button']}`}
            style={{ marginBottom: '1.5rem' }}
            onClick={() => {
              this.setState({ selectedUser: null, showUserSpecific: true, showNonUserSpecific: false, dateFrom: null, dateTo: null })
              gaEventTracker(
                'CHOICE',
                'Clicked the User-specific button',
                `REPORTS | ${config.version} (${config.currentEnv})`
              )
            }}
          >
            {this.context.intl.formatMessage(
              {
                id: `${config.labelBasePath}.main.generate_user_specific_invoice`,
                defaultMessage: `${config.labelBasePath}.main.generate_user_specific_invoice`
              }
            )}
          </button>
          <button
            id='generateNonUserSpecificInvoice'
            className={`btn-success buttonNowInline ${showNonUserSpecific ? 'active' : ''} ${style['invoice-button']}`}
            style={{ marginBottom: '1.5rem' }}
            onClick={() => {
              this.setState({ selectedUser: null, showUserSpecific: false, showNonUserSpecific: true, dateFrom: null, dateTo: null })
              gaEventTracker(
                'CHOICE',
                'Clicked the Non-user-specific button',
                `REPORTS | ${config.version} (${config.currentEnv})`
              )
            }}
          >
            {this.context.intl.formatMessage(
              {
                id: `${config.labelBasePath}.main.generate_non_user_specific_invoice`,
                defaultMessage: `${config.labelBasePath}.main.generate_non_user_specific_invoice`
              }
            )}
          </button>
          <div className='form-group'>
            <span className={style['invoice-date-label']} style={{ padding: '0.9rem 2px' }}>
              {this.context.intl.formatMessage(
                {
                  id: config.labelBasePath + '.main.search.form_labels.user_name',
                  defaultMessage: config.labelBasePath + '.main.search.form_labels.user_name'
                }
              )}:
            </span>
            {
              loading
                ? <Loading />
                : <Select
                  className={style.CustomDropdown}
                  removeSelected
                  disabled={showNonUserSpecific}
                  onChange={this.handleUserSelection}
                  options={users}
                  value={selectedUser}
                  noResultsText={this.context.intl.formatMessage(
                    {
                      id: config.labelBasePath + '.main.no_username_found',
                      defaultMessage: config.labelBasePath + '.main.no_username_found'
                    }
                  )}
                  placeholder={
                    this.context.intl.formatMessage(
                      {
                        id: config.labelBasePath + '.main.search.form_labels.select_user_name',
                        defaultMessage: config.labelBasePath + '.main.search.form_labels.select_user_name'
                      }
                    )
                  }
                />
            }
          </div>
          <div className='form-group' style={{ display: 'inline-flex', marginTop: '1rem' }}>
            <span className={style['invoice-date-label']} style={{ padding: '0.9rem 2px' }}>
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
              minDate={showNonUserSpecific ? subDays(dateTo, 30) : null}
              maxDate={
                (showNonUserSpecific && dateTo ? dateTo
                  : showUserSpecific && dateTo ? dateTo : null) ||
                (showNonUserSpecific && !dateTo ? new Date()
                  : showUserSpecific && !dateTo ? new Date() : dateTo)
              }
              style={{ padding: '0.9rem' }}
              onChange={this.setDateFrom}
              selected={dateFrom}
            />
            <button
              id='setDateToNow'
              className={`btn-success buttonNowInline ${style['invoice-button']}`}
              style={{ marginTop: '1px' }}
              disabled={
                (showNonUserSpecific &&
                  dateTo &&
                  (dateTo < subDays(new Date(), 1) ||
                    dateTo < subDays(new Date(), 30) ||
                    dateTo > addDays(new Date(), 30))) ||
                (showUserSpecific &&
                  dateTo &&
                  dateTo < subDays(new Date(), 1))
              }
              onClick={() => this.setDateFrom(new Date())}
            >
              {nowBtnText}
            </button>
            <span className={`${style['invoice-date-label']} ${style['invoice-date-label2']}`} style={{ padding: '0.9rem 2px' }}>
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
              minDate={
                showNonUserSpecific ? dateFrom
                  : showUserSpecific && dateFrom ? dateFrom : null
              }
              maxDate={
                (showNonUserSpecific && dateFrom && dateFrom > subDays(new Date(), 30) ? new Date() : null) ||
                (showNonUserSpecific && dateFrom ? addDays(dateFrom, 30) : null) ||
                (showUserSpecific && !dateFrom ? new Date()
                  : showNonUserSpecific && !dateFrom ? new Date() : null) ||
                (showUserSpecific && dateFrom ? new Date()
                  : showNonUserSpecific && dateFrom ? new Date() : null)
              }
              style={{ padding: '0.9rem' }}
              onChange={this.setDateTo}
              selected={dateTo}
            />
            <button
              id='setDateToNow'
              className={`btn-success buttonNowInline ${style['invoice-button']}`}
              style={{ marginTop: '1px' }}
              disabled={
                (showNonUserSpecific &&
                  dateFrom &&
                  (dateFrom > new Date() ||
                    dateFrom < subDays(new Date(), 30) ||
                    dateFrom > addDays(new Date(), 30))) ||
                (showUserSpecific &&
                  dateFrom &&
                  dateFrom > new Date())
              }
              onClick={() => this.setDateTo(new Date())}
            >
              {nowBtnText}
            </button>
          </div>
          <br />
          <DependencyDropdowns tableName='HOLDING' />
          <br />
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ color: '#ffffff', textAlign: 'center' }}>
                {this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.main.generate_invoice`,
                    defaultMessage: `${config.labelBasePath}.main.generate_invoice`
                  }
                )}
              </h4>
              <div style={{ textAlign: 'center' }}>
                <button
                  id='generateInvoice'
                  className={`btn-success btn-sm buttonNowInline ${style['invoice-button']}`}
                  onClick={() => {
                    this.generateInvoice('INV_main', selectedUser, null)
                    gaEventTracker(
                      'GENERATE',
                      'Clicked the Generate invoice button',
                      `REPORTS | ${config.version} (${config.currentEnv})`
                    )
                  }}
                  style={{ width: '70px', height: '30px' }}
                >
                  {this.context.intl.formatMessage(
                    {
                      id: `${config.labelBasePath}.main.short_as_pdf`,
                      defaultMessage: `${config.labelBasePath}.main.short_as_pdf`
                    }
                  )}
                </button>
                <button
                  id='generateInvoiceXls'
                  className={`btn-success btn-sm buttonNowInline ${style['invoice-button']}`}
                  onClick={() => {
                    this.generateInvoice('INV_main', selectedUser, 'EXCEL')
                    gaEventTracker(
                      'GENERATE',
                      'Clicked the Generate invoice button (.xls)',
                      `REPORTS | ${config.version} (${config.currentEnv})`
                    )
                  }}
                  style={{ width: '70px', height: '30px' }}
                >
                  {this.context.intl.formatMessage(
                    {
                      id: `${config.labelBasePath}.main.short_as_xls`,
                      defaultMessage: `${config.labelBasePath}.main.short_as_xls`
                    }
                  )}
                </button>
              </div>
            </div>
            <div style={{ marginTop: '1rem', marginLeft: '3rem' }}>
              <h4 style={{ color: '#ffffff', textAlign: 'center' }}>
                {this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.main.generate_invoice_detailed`,
                    defaultMessage: `${config.labelBasePath}.main.generate_invoice_detailed`
                  }
                )}
              </h4>
              <div style={{ textAlign: 'center' }}>
                <button
                  id='generateInvoiceDetailed'
                  className={`btn-success btn-sm buttonNowInline ${style['invoice-button']}`}
                  onClick={() => {
                    this.generateInvoice('INV2_main', selectedUser, null)
                    gaEventTracker(
                      'GENERATE',
                      'Clicked the Generate detailed invoice button',
                      `REPORTS | ${config.version} (${config.currentEnv})`
                    )
                  }}
                  style={{ width: '70px', height: '30px' }}
                >
                  {this.context.intl.formatMessage(
                    {
                      id: `${config.labelBasePath}.main.short_as_pdf`,
                      defaultMessage: `${config.labelBasePath}.main.short_as_pdf`
                    }
                  )}
                </button>
                <button
                  id='generateInvoiceDetailedXls'
                  className={`btn-success btn-sm buttonNowInline ${style['invoice-button']}`}
                  onClick={() => {
                    this.generateInvoice('INV2_main', selectedUser, 'EXCEL')
                    gaEventTracker(
                      'GENERATE',
                      'Clicked the Generate detailed invoice button (.xls)',
                      `REPORTS | ${config.version} (${config.currentEnv})`
                    )
                  }}
                  style={{ width: '70px', height: '30px' }}
                >
                  {this.context.intl.formatMessage(
                    {
                      id: `${config.labelBasePath}.main.short_as_xls`,
                      defaultMessage: `${config.labelBasePath}.main.short_as_xls`
                    }
                  )}
                </button>
              </div>
            </div>
          </div>

          {reportUrl &&
            <iframe
              id='reportDisplayFrame'
              width={frameWidth}
              height={frameHeight}
              border='none'
              src={reportUrl}
            />
          }
        </div>
      </div>
    )
  }
}

Invoice.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(Invoice)
