import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import * as config from 'config/config.js'
import containerStyle from 'components/ReportModule/Invoice.module.css'
import { convertToShortDate, gaEventTracker } from 'functions/utils'

class SlaughteredAnimalsByDisease extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dateFrom: null,
      dateTo: null
    }
  }

  setDateFrom = dateFrom => this.setState({ dateFrom })

  setDateTo = dateTo => this.setState({ dateTo })

  downloadPdfOrExcel = (printType, printName) => {
    const { dateFrom, dateTo } = this.state
    const missingParamsLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.parameters_missing`,
      defaultMessage: `${config.labelBasePath}.alert.parameters_missing`
    })
    const noStartingDateSelectedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.no_starting_date_selected`,
      defaultMessage: `${config.labelBasePath}.alert.no_starting_date_selected`
    })
    const noEndingDateSelectedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.no_ending_date_selected`,
      defaultMessage: `${config.labelBasePath}.alert.no_ending_date_selected`
    })

    switch (printName) {
      case 'STAT_SABD':
        if (!dateFrom) {
          return this.setState({
            alert: alertUser(true, 'warning', missingParamsLabel, noStartingDateSelectedLabel,
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        }
        if (!dateTo) {
          return this.setState({
            alert: alertUser(true, 'warning', missingParamsLabel, noEndingDateSelectedLabel,
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        }
        break
    }

    const shortDateFrom = convertToShortDate(dateFrom, 'y-m-d')
    const shortDateTo = convertToShortDate(dateTo, 'y-m-d')
    const server = config.svConfig.restSvcBaseUrl
    let url = config.svConfig.triglavRestVerbs.GENERATE_PDF_OR_EXCEL
    url = url.replace('%sessionId', this.props.session)

    if (printName === 'STAT_SABD') {
      url = url.replace('%objectId', null)
      url = url.replace('%campaignId', null)
      url = url.replace('%customDate', shortDateFrom)
      url = url.replace('%customDate2', shortDateTo)
    }

    url = url.replace('%reportName', printName)
    url = url.replace('%printType', printType)

    let downloadUrl = `${server}/${url}`
    window.open(downloadUrl)
    this.setState({
      dateFrom: null,
      dateTo: null
    })
  }

  render () {
    const { dateFrom, dateTo } = this.state
    const nowBtnText = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.now`,
      defaultMessage: `${config.labelBasePath}.main.now`
    })
    const reportLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.stat_reports.sabd`,
      defaultMessage: `${config.labelBasePath}.stat_reports.sabd`
    })
    const reportHeading = <h2 className={containerStyle.header}>{reportLabel}</h2>
    const selectDateFromLabelEl = (
      <span className={containerStyle['invoice-date-label']} style={{ padding: '0.9rem 2px' }}>
        {this.context.intl.formatMessage(
          {
            id: `${config.labelBasePath}.main.date_from`,
            defaultMessage: `${config.labelBasePath}.main.date_from`
          }
        )}
      </span>
    )
    const selectDateToLabelEl = (
      <span className={containerStyle['invoice-date-label']} style={{ padding: '0.9rem 2px', marginLeft: '1rem' }}>
        {this.context.intl.formatMessage(
          {
            id: `${config.labelBasePath}.main.date_to`,
            defaultMessage: `${config.labelBasePath}.main.date_to`
          }
        )}
      </span>
    )
    // Date from date picker & Now button for the From date
    const setDateFromDatePicker = <DatePicker
      key='from'
      required
      className='datePicker'
      style={{ padding: '0.9rem', marginTop: '1.5rem' }}
      onChange={this.setDateFrom}
      selected={dateFrom}
    />
    const dateFromNowBtn = (
      <button
        id='setDateFromNow'
        className={`btn-success buttonNowInline ${containerStyle['invoice-button']}`}
        style={{ marginTop: '1px' }}
        onClick={() => this.setDateFrom(new Date())}
      >
        {nowBtnText}
      </button>
    )
    // Date to date picker & Now button for the To date
    const dateToDatePicker = <DatePicker
      key='to'
      required
      className='datePicker'
      style={{ padding: '0.9rem', marginTop: '1.5rem' }}
      onChange={this.setDateTo}
      selected={dateTo}
    />
    const dateToNowBtn = (
      <button
        id='setDateToNow'
        className={`btn-success buttonNowInline ${containerStyle['invoice-button']}`}
        style={{ marginTop: '1px' }}
        onClick={() => this.setDateTo(new Date())}
      >
        {nowBtnText}
      </button>
    )

    // Download pdf & xls buttons
    const downloadBtns = <React.Fragment>
      <button
        id='pdf_download'
        className={`btn-success buttonNowInline ${containerStyle['invoice-button']}`}
        style={{ marginTop: '1.5rem' }}
        key='pdf_download'
        onClick={() => {
          this.downloadPdfOrExcel('PDF', 'STAT_SABD')
          gaEventTracker(
            'DOWNLOAD_PDF',
            `Clicked the Download as .pdf button for the 'STAT_SABD' report`,
            `BANKS_AND_INSURANCE | ${config.version} (${config.currentEnv})`
          )
        }}
      >
        {
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.download_as_pdf`,
            defaultMessage: `${config.labelBasePath}.main.download_as_pdf`
          })
        }
      </button>
      <button
        id='excel_download'
        className={`btn-success buttonNowInline ${containerStyle['invoice-button']}`}
        style={{ marginTop: '1.5rem' }}
        key='excel_download'
        onClick={() => {
          this.downloadPdfOrExcel('EXCEL', 'STAT_SABD')
          gaEventTracker(
            'DOWNLOAD_EXCEL',
            `Clicked the Download as .xls button for the 'STAT_SABD' report`,
            `BANKS_AND_INSURANCE | ${config.version} (${config.currentEnv})`
          )
        }}
      >
        {
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.download_as_xls`,
            defaultMessage: `${config.labelBasePath}.main.download_as_xls`
          })
        }
      </button>
    </React.Fragment>

    const twoDateParamsContainerWithoutDepDropdown = (
      <div id='twoDateParamsContainerWithoutDepDropdown' className={`displayContent ${containerStyle['invoice-container']}`} style={{ width: '98%' }}>
        {reportHeading}
        <div className={`form-group ${containerStyle.flexMargin}`}>
          {selectDateFromLabelEl}
          {setDateFromDatePicker}
          {dateFromNowBtn}
        </div>
        <div className={`form-group ${containerStyle.flexMargin}`}>
          {selectDateToLabelEl}
          {dateToDatePicker}
          {dateToNowBtn}
        </div>
        <br />
        {downloadBtns}
      </div>
    )

    return (
      <React.Fragment>
        {twoDateParamsContainerWithoutDepDropdown}
      </React.Fragment>
    )
  }
}

SlaughteredAnimalsByDisease.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(SlaughteredAnimalsByDisease)
