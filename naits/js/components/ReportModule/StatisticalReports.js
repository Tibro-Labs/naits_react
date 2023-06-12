import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { format } from 'date-fns'
import { enUS, ka } from 'date-fns/locale'
import { store } from 'tibro-redux'
import { DependencyDropdowns, alertUser } from 'tibro-components'
import { GridInModalLinkObjects, Loading } from 'components/ComponentsIndex'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import * as config from 'config/config.js'
import sideMenuStyle from 'modulesCSS/SideMenu.module.css'
import consoleStyle from 'components/AppComponents/Functional/AdminConsole/AdminConsole.module.css'
import containerStyle from 'components/ReportModule/Invoice.module.css'
import { strcmp, isValidArray, convertToShortDate, gaEventTracker } from 'functions/utils'

class StatisticalReports extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      reportsArr: [
        'STAT_ANIMAL_COUNT', 'STAT_AEBV', 'STAT_AEBC', 'STAT_IABC', 'STAT_ECBC',
        'STAT_SABC', 'STAT_CMPV', 'STAT_CMPF', 'STAT_FCBC', 'STAT_FCBV', 'STAT_HTBC', 'STAT_HTBV', 'STAT_HTGT',
        'STAT_SABD', 'STAT_TAG_REPLACEMENT'
      ],
      reportsAbbrArr: [
        'animal_count', 'aebv', 'aebc', 'iabc', 'ecbc',
        'sabc', 'cmpv', 'cmpf', 'fcbc', 'fcbv', 'htbc', 'htbv', 'htgt',
        'sabd', 'ear_tag_replc'
      ],
      animalCountOptions: ['species', 'statuses', 'ages', 'flocks'],
      animalCountOption: '',
      datesForAnimalCount: [],
      datesForAnimalCountDropdown: null,
      dateForAnimalCount: '',
      alert: null,
      showCampaignModal: false,
      showHoldingModal: false,
      gridToDisplay: 'HOLDING',
      altGridToDisplay: 'VACCINATION_EVENT',
      abbr: '',
      activeElementId: '',
      isActive: false,
      displayReport: '',
      date: null,
      dateFrom: null,
      dateTo: null,
      holdingObjId: '',
      holdingPic: '',
      campaignObjId: '',
      campaignName: '',
      dateLocale: undefined
    }
  }

  componentDidMount () {
    const { locale } = this.props
    this.setDateLocale(locale)
  }

  componentDidUpdate (nextProps, nextState) {
    if (this.state.displayReport !== nextState.displayReport) {
      this.setState({
        date: null,
        dateFrom: null,
        dateTo: null,
        holdingObjId: '',
        holdingPic: '',
        campaignObjId: '',
        campaignName: '',
        animalCountOption: '',
        datesForAnimalCount: [],
        dateForAnimalCount: '',
        datesForAnimalCountDropdown: null
      })
    }
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

  setActiveElementId = elementId => this.setState({ isActive: true, activeElementId: elementId, displayReport: elementId })

  setDate = date => this.setState({ date })

  setDateFrom = dateFrom => this.setState({ dateFrom })

  setDateTo = dateTo => this.setState({ dateTo })

  showHoldingModal = () => this.setState({ showHoldingModal: true })

  showCampaignModal = () => this.setState({ showCampaignModal: true })

  closeHoldingModal = () => {
    this.setState({ showHoldingModal: false })
    document.getElementById('selectHolding').blur()
  }

  closeCampaignModal = () => {
    this.setState({ showCampaignModal: false })
    document.getElementById('selectCampaign').blur()
  }

  chooseHolding = () => {
    const { gridToDisplay } = this.state
    const holdingObjId = String(store.getState()[gridToDisplay].rowClicked[gridToDisplay + '.OBJECT_ID'])
    const holdingPic = String(store.getState()[gridToDisplay].rowClicked[gridToDisplay + '.PIC'])
    this.setState({ holdingObjId, holdingPic })
    this.closeHoldingModal()
  }

  chooseCampaign = () => {
    const { altGridToDisplay } = this.state
    const campaignObjId = String(store.getState()[altGridToDisplay].rowClicked[altGridToDisplay + '.OBJECT_ID'])
    const campaignName = String(store.getState()[altGridToDisplay].rowClicked[altGridToDisplay + '.CAMPAIGN_NAME'])
    this.setState({ campaignObjId, campaignName })
    this.closeCampaignModal()
  }

  downloadPdfOrExcel = (printType, printName) => {
    const { date, dateFrom, dateTo, holdingObjId, campaignObjId } = this.state
    const missingParamsLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.parameters_missing`,
      defaultMessage: `${config.labelBasePath}.alert.parameters_missing`
    })
    const noRegionSelectedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.no_region_selected`,
      defaultMessage: `${config.labelBasePath}.alert.no_region_selected`
    })
    const noVillageSelectedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.no_village_selected`,
      defaultMessage: `${config.labelBasePath}.alert.no_village_selected`
    })
    const noMunicipalitySelectedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.stat_report_no_municipality_selected`,
      defaultMessage: `${config.labelBasePath}.alert.stat_report_no_municipality_selected`
    })
    const noDateSelectedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.no_date_selected`,
      defaultMessage: `${config.labelBasePath}.alert.no_date_selected`
    })
    const noStartingDateSelectedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.no_starting_date_selected`,
      defaultMessage: `${config.labelBasePath}.alert.no_starting_date_selected`
    })
    const noEndingDateSelectedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.no_ending_date_selected`,
      defaultMessage: `${config.labelBasePath}.alert.no_ending_date_selected`
    })
    const noHoldingSelectedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.select_a_holding`,
      defaultMessage: `${config.labelBasePath}.alert.select_a_holding`
    })
    const noCampaignSelectedLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.no_campaign_selected`,
      defaultMessage: `${config.labelBasePath}.alert.no_campaign_selected`
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

    if (printName === 'STAT_ACBV' || printName === 'STAT_ACBM' || printName === 'STAT_ASBV' ||
      printName === 'STAT_AEBV' || printName === 'STAT_CMPV' || printName === 'STAT_CMPF' ||
      printName === 'STAT_FCBV' || printName === 'STAT_HTBV' || printName === 'STAT_TAG_REPLACEMENT') {
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
    }

    switch (printName) {
      case 'STAT_ACBV':
      case 'STAT_ASBV':
      case 'STAT_FCBV':
      case 'STAT_HTBV':
        if (!village) {
          return this.setState({
            alert: alertUser(true, 'warning', missingParamsLabel, noVillageSelectedLabel,
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        }
        if (!date) {
          return this.setState({
            alert: alertUser(true, 'warning', noDateSelectedLabel, null,
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        }
        break
      case 'STAT_ACBM':
        if (!municipality) {
          return this.setState({
            alert: alertUser(true, 'warning', missingParamsLabel, noMunicipalitySelectedLabel,
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        }
        if (!date) {
          return this.setState({
            alert: alertUser(true, 'warning', noDateSelectedLabel, null,
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        }
        break
      case 'STAT_ACBH':
        if (!holdingObjId) {
          return this.setState({
            alert: alertUser(true, 'warning', missingParamsLabel, noHoldingSelectedLabel,
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        }
        if (!date) {
          return this.setState({
            alert: alertUser(true, 'warning', noDateSelectedLabel, null,
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        }
        break
      case 'STAT_AEBV':
      case 'STAT_TAG_REPLACEMENT':
        if (!village) {
          return this.setState({
            alert: alertUser(true, 'warning', missingParamsLabel, noVillageSelectedLabel,
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        }
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
      case 'STAT_AEBC':
      case 'STAT_IABC':
      case 'STAT_SABC':
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
      case 'STAT_ECBC':
      case 'STAT_FCBC':
      case 'STAT_HTBC':
      case 'STAT_HTGT':
        if (!date) {
          return this.setState({
            alert: alertUser(true, 'warning', noDateSelectedLabel, null,
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        }
        break
      case 'STAT_CMPV':
      case 'STAT_CMPF':
        if (!region) {
          return this.setState({
            alert: alertUser(true, 'warning', missingParamsLabel, noRegionSelectedLabel,
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        }
        if (!campaignObjId) {
          return this.setState({
            alert: alertUser(true, 'warning', noCampaignSelectedLabel, null,
              () => this.setState({ alert: alertUser(false, 'info', '') }))
          })
        }
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

    const shortDate = convertToShortDate(date, 'y-m-d')
    const shortDateFrom = convertToShortDate(dateFrom, 'y-m-d')
    const shortDateTo = convertToShortDate(dateTo, 'y-m-d')
    const server = config.svConfig.restSvcBaseUrl
    let url = config.svConfig.triglavRestVerbs.GENERATE_PDF_OR_EXCEL
    url = url.replace('%sessionId', this.props.session)
    if (printName === 'STAT_ACBV' || printName === 'STAT_ASBV' || printName === 'STAT_AEBV' ||
      printName === 'STAT_FCBV' || printName === 'STAT_HTBV' || printName === 'STAT_TAG_REPLACEMENT') {
      url = url.replace('%objectId', village)
      url = url.replace('%campaignId', null)
    } else if (printName === 'STAT_CMPV' || printName === 'STAT_CMPF') {
      if (region && !municipality && !community && !village) {
        url = url.replace('%objectId', region)
      } else if (region && municipality && !community && !village) {
        url = url.replace('%objectId', municipality)
      } else if (region && municipality && community && !village) {
        url = url.replace('%objectId', community)
      } else if (region && municipality && community && village) {
        url = url.replace('%objectId', village)
      }
      url = url.replace('%campaignId', campaignObjId)
    } else if (printName === 'STAT_ACBM') {
      url = url.replace('%objectId', municipality)
      url = url.replace('%campaignId', null)
    } else if (printName === 'STAT_ACBH') {
      url = url.replace('%objectId', holdingObjId)
      url = url.replace('%campaignId', null)
    } else if (printName === 'STAT_AEBC' || printName === 'STAT_IABC' || printName === 'STAT_ECBC' ||
      printName === 'STAT_SABC' || printName === 'STAT_FCBC' || printName === 'STAT_HTBC' || printName === 'STAT_HTGT' ||
      printName === 'STAT_SABD') {
      url = url.replace('%objectId', null)
      url = url.replace('%campaignId', null)
    }

    if (printName === 'STAT_AEBV' || printName === 'STAT_AEBC' || printName === 'STAT_IABC' ||
      printName === 'STAT_SABC' || printName === 'STAT_SABD' || printName === 'STAT_TAG_REPLACEMENT') {
      url = url.replace('%customDate', shortDateFrom)
      url = url.replace('%campaignId', null)
    } else if (printName === 'STAT_CMPV' || printName === 'STAT_CMPF') {
      url = url.replace('%customDate', shortDateFrom)
      url = url.replace('%customDate2', shortDateTo)
    } else {
      url = url.replace('%customDate', shortDate)
      url = url.replace('%campaignId', null)
    }

    if (printName === 'STAT_ACBV' || printName === 'STAT_ACBM' || printName === 'STAT_ACBH' ||
      printName === 'STAT_ASBV' || printName === 'STAT_ECBC' || printName === 'STAT_FCBC' ||
      printName === 'STAT_FCBV' || printName === 'STAT_HTBC' || printName === 'STAT_HTBV' ||
      printName === 'STAT_HTGT') {
      url = url.replace('%customDate2', null)
      url = url.replace('%campaignId', null)
    } else if (printName === 'STAT_AEBV' || printName === 'STAT_AEBC' || printName === 'STAT_IABC' ||
      printName === 'STAT_SABC' || printName === 'STAT_SABD' || printName === 'STAT_TAG_REPLACEMENT') {
      url = url.replace('%customDate2', shortDateTo)
      url = url.replace('%campaignId', null)
    }
    url = url.replace('%reportName', printName)
    url = url.replace('%printType', printType)

    let downloadUrl = `${server}/${url}`
    window.open(downloadUrl)
    this.setState({
      date: null,
      dateFrom: null,
      dateTo: null,
      holdingObjId: '',
      holdingPic: '',
      campaignName: '',
      campaignObjId: ''
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
    const {
      reportsArr, reportsAbbrArr, animalCountOptions, date, dateFrom, dateTo, isActive, abbr,
      activeElementId, displayReport, campaignName, altGridToDisplay, showCampaignModal, loading, datesForAnimalCountDropdown
    } = this.state
    const nowBtnText = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.now`,
      defaultMessage: `${config.labelBasePath}.main.now`
    })
    const reportLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.stat_reports.${abbr}`,
      defaultMessage: `${config.labelBasePath}.stat_reports.${abbr}`
    })
    const selectDateLabelEl = (
      <span className={containerStyle['invoice-date-label']} style={{ padding: '0.9rem 2px' }}>
        {this.context.intl.formatMessage(
          {
            id: `${config.labelBasePath}.main.select_date`,
            defaultMessage: `${config.labelBasePath}.main.select_date`
          }
        )}
      </span>
    )
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
    // Date picker & Now button for reports that have one date param
    const setDateDatePicker = <DatePicker
      key='from'
      required
      className='datePicker'
      style={{ padding: '0.9rem', marginTop: '1.5rem' }}
      onChange={this.setDate}
      selected={date}
    />
    const dateNowBtn = (
      <button
        id='setDateNow'
        className={`btn-success buttonNowInline ${containerStyle['invoice-button']}`}
        style={{ marginTop: '1px' }}
        onClick={() => this.setDate(new Date())}
      >
        {nowBtnText}
      </button>
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
    const reportHeading = <h2 className={containerStyle.header}>{reportLabel}</h2>
    const dependencyDropdown = <DependencyDropdowns tableName='HOLDING' />
    // Download pdf & xls buttons
    const downloadBtns = <React.Fragment>
      <button
        id='pdf_download'
        className={`btn-success buttonNowInline ${containerStyle['invoice-button']}`}
        style={{ marginTop: '1.5rem' }}
        key='pdf_download'
        onClick={() => {
          this.downloadPdfOrExcel('PDF', displayReport)
          gaEventTracker(
            'DOWNLOAD_PDF',
            `Clicked the Download as .pdf button for the ${displayReport} report`,
            `STATISTICAL_REPORTS | ${config.version} (${config.currentEnv})`
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
          this.downloadPdfOrExcel('EXCEL', displayReport)
          gaEventTracker(
            'DOWNLOAD_EXCEL',
            `Clicked the Download as .xls button for the ${displayReport} report`,
            `STATISTICAL_REPORTS | ${config.version} (${config.currentEnv})`
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
              `Clicked the Download as .xls button for the ${displayReport} report`,
              `STATISTICAL_REPORTS | ${config.version} (${config.currentEnv})`
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
              `Clicked the Download as detailed .xls button for the ${displayReport} report`,
              `STATISTICAL_REPORTS | ${config.version} (${config.currentEnv})`
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
      <div id='animalCountContainer' className={`displayContent ${containerStyle['invoice-container']}`}>
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
    const oneDateParamContainer = (
      <div id='oneDateParamContainer' className={`displayContent ${containerStyle['invoice-container']}`}>
        {reportHeading}
        {dependencyDropdown}
        <br />
        <div className={`form-group ${containerStyle.flexMargin}`}>
          {selectDateLabelEl}
          {setDateDatePicker}
          {dateNowBtn}
        </div>
        <br />
        {downloadBtns}
      </div>
    )
    const oneDateParamContainerWithoutDepDropdown = (
      <div id='oneDateParamContainerWithoutDepDropdown' className={`displayContent ${containerStyle['invoice-container']}`}>
        {reportHeading}
        <div className={`form-group ${containerStyle.flexMargin}`}>
          {selectDateLabelEl}
          {setDateDatePicker}
          {dateNowBtn}
        </div>
        <br />
        {downloadBtns}
      </div>
    )
    const twoDateParamsContainer = (
      <div id='twoDateParamsContainer' className={`displayContent ${containerStyle['invoice-container']}`}>
        {reportHeading}
        {dependencyDropdown}
        <br />
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
    const twoDateParamsContainerWithoutDepDropdown = (
      <div id='twoDateParamsContainerWithoutDepDropdown' className={`displayContent ${containerStyle['invoice-container']}`}>
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
    const twoDateParamsContainerWithCampaignSelector = (
      <div id='twoDateParamsContainerWithCampaignSelector' className={`displayContent ${containerStyle['invoice-container']}`}>
        {reportHeading}
        {dependencyDropdown}
        <br />
        <input
          type='text'
          name='selectCampaign'
          id='selectCampaign'
          value={campaignName}
          className={consoleStyle.dropdown}
          style={{ marginTop: '1rem' }}
          onClick={this.showCampaignModal}
          placeholder={
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.select_campaign`,
              defaultMessage: `${config.labelBasePath}.main.select_campaign`
            })
          }
        />
        <br />
        {showCampaignModal &&
          <GridInModalLinkObjects
            loadFromParent
            linkedTable={altGridToDisplay}
            onRowSelect={this.chooseCampaign}
            key={altGridToDisplay}
            closeModal={this.closeCampaignModal}
          />
        }
        <br />
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
      <div>
        <div id='reportSideMenu' className={sideMenuStyle.sideDiv}>
          <label id='location'>
            {this.context.intl.formatMessage(
              {
                id: `${config.labelBasePath}.main.statistical_reports`,
                defaultMessage: `${config.labelBasePath}.main.statistical_reports`
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
          <br />
          <ul id='reportsList' className={sideMenuStyle.ul_item}>
            {reportsArr.map((report, index) => {
              return <li
                {...isActive && activeElementId === report
                  ? { className: `list-group-item ${sideMenuStyle.li_item} ${sideMenuStyle.li_item_clicked}` }
                  : { className: `list-group-item ${sideMenuStyle.li_item}` }
                }
                key={report}
                id={report}
                onClick={() => {
                  this.setState({ isActive: true, abbr: reportsAbbrArr[index] })
                  this.setActiveElementId(report)
                }}
              >
                {this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.stat_reports.${reportsAbbrArr[index]}`,
                    defaultMessage: `${config.labelBasePath}.stat_reports.${reportsAbbrArr[index]}`
                  }
                )}
              </li>
            })}
          </ul>
        </div>
        {displayReport === 'STAT_ANIMAL_COUNT' && animalCountContainer}
        {displayReport === 'STAT_AEBV' && twoDateParamsContainer}
        {displayReport === 'STAT_AEBC' && twoDateParamsContainerWithoutDepDropdown}
        {displayReport === 'STAT_IABC' && twoDateParamsContainerWithoutDepDropdown}
        {displayReport === 'STAT_ECBC' && oneDateParamContainerWithoutDepDropdown}
        {displayReport === 'STAT_SABC' && twoDateParamsContainerWithoutDepDropdown}
        {displayReport === 'STAT_CMPV' && twoDateParamsContainerWithCampaignSelector}
        {displayReport === 'STAT_CMPF' && twoDateParamsContainerWithCampaignSelector}
        {displayReport === 'STAT_FCBC' && oneDateParamContainerWithoutDepDropdown}
        {displayReport === 'STAT_FCBV' && oneDateParamContainer}
        {displayReport === 'STAT_HTBC' && oneDateParamContainerWithoutDepDropdown}
        {displayReport === 'STAT_HTBV' && oneDateParamContainer}
        {displayReport === 'STAT_HTGT' && oneDateParamContainerWithoutDepDropdown}
        {displayReport === 'STAT_SABD' && twoDateParamsContainerWithoutDepDropdown}
        {displayReport === 'STAT_TAG_REPLACEMENT' && twoDateParamsContainer}
        {loading && <Loading />}
      </div>
    )
  }
}

StatisticalReports.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  locale: state.intl.locale
})

export default connect(mapStateToProps)(StatisticalReports)
