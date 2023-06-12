import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { format } from 'date-fns'
import { enUS, ka } from 'date-fns/locale'
import { DependencyDropdowns, alertUser } from 'tibro-components'
import { Loading } from 'components/ComponentsIndex'
import * as config from 'config/config.js'
import containerStyle from 'components/ReportModule/Invoice.module.css'
import { strcmp, isValidArray, gaEventTracker } from 'functions/utils'

class AnimalCount extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      animalCountOptions: ['species', 'statuses', 'ages', 'flocks'],
      animalCountOption: '',
      datesForAnimalCount: [],
      datesForAnimalCountDropdown: null,
      dateForAnimalCount: ''
    }
  }

  componentDidMount () {
    this.setDateLocale(this.props.locale)
  }

  setDateLocale = locale => strcmp(locale, 'en-US') ? this.setState({ dateLocale: enUS }) : this.setState({ dateLocale: ka })

  handleAnimalCountOptionChange = e => {
    this.setState({ [e.target.name]: e.target.value }, () => this.getDatesForAnimalCountReport())
  }

  handleDateForAnimalCountSelection = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  generateDatesForAnimalCountDropdown = () => {
    const { datesForAnimalCount } = this.state

    const datesForAnimalCountDropdown = (
      <select name='dateForAnimalCount' id='dateForAnimalCount' className='form-control' onChange={this.handleDateForAnimalCountSelection}>
        <option id='blankPlaceholder' key='blankPlaceholder' value='' selected disabled hidden>
          {this.context.intl.formatMessage({
            id: config.labelBasePath + '.main.select_animal_count_date',
            defaultMessage: config.labelBasePath + '.main.select_animal_count_date'
          })}
        </option>
        {datesForAnimalCount.map((date, i) => {
          return <option key={i + 1} value={date.date}>{date.formattedDate}</option>
        })}
      </select>
    )

    this.setState({ datesForAnimalCountDropdown })
  }

  getDatesForAnimalCountReport = () => {
    this.setState({ loading: true })
    const { session } = this.props
    const { animalCountOption, dateLocale } = this.state
    const wsPath = `naits_triglav_plugin/ApplicationServices/getDatesForStatisticalReports/${session}/${animalCountOption}/ASC`
    const url = `${config.svConfig.restSvcBaseUrl}/${wsPath}`
    axios.get(url).then(res => {
      this.setState({ loading: false, datesForAnimalCountDropdown: null, dateForAnimalCount: '' })
      if (res.data && isValidArray(res.data, 1)) {
        let datesForAnimalCount = []
        res.data.map(date => {
          const formattedDate = format(new Date(date), 'do MMMM yyyy', { locale: dateLocale })
          const dateForAnimalCount = { date, formattedDate, reportType: animalCountOption }
          datesForAnimalCount.push(dateForAnimalCount)
        })

        this.setState({ datesForAnimalCount }, () => this.generateDatesForAnimalCountDropdown())
      } else {
        const noDataFoundLabel = this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.no_data_found`,
          defaultMessage: `${config.labelBasePath}.main.no_data_found`
        })
        alertUser(true, 'info', noDataFoundLabel)
      }
    }).catch(err => {
      console.error(err)
      this.setState({ loading: false, datesForAnimalCountDropdown: null, dateForAnimalCount: '' })
      alertUser(true, 'error', err)
    })
  }

  downloadAnimalCountPdfOrExcel = printType => {
    const { session } = this.props
    const { animalCountOption, dateForAnimalCount } = this.state
    const missingParamsLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.parameters_missing`,
      defaultMessage: `${config.labelBasePath}.alert.parameters_missing`
    })
    const noReportSelectedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.no_report_selected`,
      defaultMessage: `${config.labelBasePath}.alert.no_report_selected`
    })
    const noVillageSelectedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.no_village_selected`,
      defaultMessage: `${config.labelBasePath}.alert.no_village_selected`
    })
    const noDateForAnimalCountSelectedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.no_date_for_animal_count_report_selected`,
      defaultMessage: `${config.labelBasePath}.alert.no_date_for_animal_count_report_selected`
    })

    let regionElement = null
    let municipalityElement = null
    let communityElement = null
    let villageElement = null
    // eslint-disable-next-line no-unused-vars
    let region = null
    let municipality = null
    // eslint-disable-next-line no-unused-vars
    let community = null
    let village = null

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

    let reportName = ''
    switch (animalCountOption) {
      case 'species':
        if (strcmp(printType, 'DETAILED_EXCEL')) {
          reportName = 'STAT2_AC'
        } else {
          reportName = 'STAT3_AC'
        }
        break
      case 'statuses':
        if (strcmp(printType, 'DETAILED_EXCEL')) {
          reportName = 'STAT2_AS'
        } else {
          reportName = 'STAT3_AS'
        }
        break
      case 'ages':
        if (strcmp(printType, 'DETAILED_EXCEL')) {
          reportName = 'STAT2_AA'
        } else {
          reportName = 'STAT3_AA'
        }
        break
      case 'flocks':
        if (strcmp(printType, 'DETAILED_EXCEL')) {
          reportName = 'STAT2_AF'
        } else {
          reportName = 'STAT3_AF'
        }
        break
      default:
        break
    }

    let location = '0'
    if (region && !municipality && !community && !village) {
      location = region
    } else if (region && municipality && !community && !village) {
      location = municipality
    } else if (region && municipality && community && !village) {
      location = community
    } else if (region && municipality && community && village) {
      location = village
    }

    if (strcmp(printType, 'DETAILED_EXCEL')) {
      if (!animalCountOption) {
        alertUser(true, 'warning', missingParamsLabel, noReportSelectedLabel)
      } else if (!dateForAnimalCount) {
        alertUser(true, 'warning', missingParamsLabel, noDateForAnimalCountSelectedLabel)
      } else if (!village) {
        alertUser(true, 'warning', missingParamsLabel, noVillageSelectedLabel)
      } else {
        const wsPath = `naits_triglav_plugin/report/generatePdfOrExcel/${session}/${reportName}/EXCEL/${location}/${dateForAnimalCount}`
        const url = `${config.svConfig.restSvcBaseUrl}/${wsPath}`
        window.open(url, '_blank')
      }
    } else {
      if (!animalCountOption) {
        alertUser(true, 'warning', missingParamsLabel, noReportSelectedLabel)
      } else if (!dateForAnimalCount) {
        alertUser(true, 'warning', missingParamsLabel, noDateForAnimalCountSelectedLabel)
      } else {
        const wsPath = `naits_triglav_plugin/report/generatePdfOrExcel/${session}/${reportName}/EXCEL/${location}/${dateForAnimalCount}`
        const url = `${config.svConfig.restSvcBaseUrl}/${wsPath}`
        window.open(url, '_blank')
      }
    }
  }

  render () {
    const { loading, animalCountOptions, datesForAnimalCountDropdown } = this.state
    const reportLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.stat_reports.animal_count`,
      defaultMessage: `${config.labelBasePath}.stat_reports.animal_count`
    })
    const reportHeading = <h2 className={containerStyle.header}>{reportLabel}</h2>
    const dependencyDropdown = <DependencyDropdowns tableName='HOLDING' />
    const animalCountDownloadBtns = (
      <React.Fragment>
        <button
          id='excel_download'
          className={`btn-success buttonNowInline ${containerStyle['invoice-button']}`}
          style={{ marginTop: '1.5rem' }}
          key='excel_download'
          onClick={() => {
            this.downloadAnimalCountPdfOrExcel('EXCEL')
            gaEventTracker(
              'DOWNLOAD_EXCEL',
              `Clicked the Download as .xls button for the Animal count report`,
              `BANKS_AND_INSURANCE | ${config.version} (${config.currentEnv})`
            )
          }}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.download_as_xls`,
            defaultMessage: `${config.labelBasePath}.main.download_as_xls`
          })}
        </button>
        <button
          id='detailed_excel_download'
          className={`btn-success buttonNowInline ${containerStyle['invoice-button']}`}
          style={{ marginTop: '1.5rem' }}
          key='detailed_excel_download'
          onClick={() => {
            this.downloadAnimalCountPdfOrExcel('DETAILED_EXCEL')
            gaEventTracker(
              'DOWNLOAD_EXCEL',
              `Clicked the Download as detailed .xls button for the Animal count report`,
              `BANKS_AND_INSURANCE | ${config.version} (${config.currentEnv})`
            )
          }}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.download_as_detailed_xls`,
            defaultMessage: `${config.labelBasePath}.main.download_as_detailed_xls`
          })}
        </button>
      </React.Fragment>
    )
    // Report containers
    const animalCountContainer = (
      <div id='animalCountContainer' className={`displayContent ${containerStyle['invoice-container']}`} style={{ width: '98%' }}>
        {reportHeading}
        <div className='form-group' style={{ display: 'inline-table', marginBottom: '1rem' }}>
          <span className={containerStyle['invoice-date-label']} style={{ padding: '0.9rem 2px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.select_report`,
              defaultMessage: `${config.labelBasePath}.main.select_report`
            })}
          </span>
          <select id='animalCountOption' name='animalCountOption' className='form-control' onChange={this.handleAnimalCountOptionChange}>
            <option id='blankPlaceholder' key='blankPlaceholder' value='' selected disabled hidden>
              {this.context.intl.formatMessage({
                id: config.labelBasePath + '.main.select_animal_count_report',
                defaultMessage: config.labelBasePath + '.main.select_animal_count_report'
              })}
            </option>
            {animalCountOptions.map(option => {
              return (
                <option key={option} value={option}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.stat_reports.${option}`,
                    defaultMessage: `${config.labelBasePath}.stat_reports.${option}`
                  })}
                </option>
              )
            })}
          </select>
        </div>
        {datesForAnimalCountDropdown && (
          <React.Fragment>
            <br />
            <div className='form-group' style={{ display: 'inline-table', marginBottom: '1rem' }}>
              <span className={containerStyle['invoice-date-label']} style={{ padding: '0.9rem 2px' }}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.select_date_form_animal_count_report`,
                  defaultMessage: `${config.labelBasePath}.main.select_date_form_animal_count_report`
                })}
              </span>
              {datesForAnimalCountDropdown}
            </div>
          </React.Fragment>
        )}
        <br />
        {dependencyDropdown}
        <br />
        {animalCountDownloadBtns}
      </div>
    )

    return (
      <React.Fragment>
        {animalCountContainer}
        {loading && <Loading />}
      </React.Fragment>
    )
  }
}

AnimalCount.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  locale: state.intl.locale
})

export default connect(mapStateToProps)(AnimalCount)
