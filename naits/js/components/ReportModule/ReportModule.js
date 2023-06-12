import React from 'react'
import PropTypes from 'prop-types'
import ReportMenu from './ReportMenu'
import * as config from 'config/config'
import axios from 'axios'
import { connect } from 'react-redux'
import sideMenuStyle from 'modulesCSS/SideMenu.module.css'
import consoleStyle from 'components/AppComponents/Functional/AdminConsole/AdminConsole.module.css'
import { DependencyDropdowns, alertUser } from 'tibro-components'
import { villageSpecificReports, generalReports, generalBlankReports } from './reports.js'
import Invoice from './Invoice'
import StatisticalReports from './StatisticalReports'

class ReportModule extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      tableName: 'HOLDING',
      location: '',
      objectCodeValue: null,
      reports: null,
      blankReports: null,
      displayInvoice: false,
      displayStatisticalReports: false,
      statistical_report: false,
      invoice_report: false,
      blank_report: false,
      village_specific_report: false,
      general_report: false,
      availableReportTools: ['custom.statistical_report', 'custom.invoice_report', 'custom.blank_report',
        'custom.village_specific_report', 'custom.general_report'
      ]
    }
  }

  componentDidMount () {
    // Check if the user can use any of the report module tools
    this.state.availableReportTools.forEach(reportTool => {
      this.checkIfUserCanUseReportTool(reportTool)
    })
  }

  checkIfUserCanUseReportTool = reportTool => {
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.CHECK_IF_USER_CAN_USE_REPORT_TOOL
    let url = `${server}${verbPath}`
    url = url.replace('%session', this.props.session)
    url = url.replace('%permissionType', reportTool)
    let splitReportTool = reportTool.split('.')
    const finalReportTool = splitReportTool[1]
    axios.get(url).then(res => {
      if (res.data) {
        this.setState({ [finalReportTool]: true })
      }
    }).catch(err => console.error(err))
  }

  clearSelection = () => {
    this.setState({
      objectCodeValue: null,
      reports: null,
      blankReports: null,
      displayInvoice: false,
      displayStatisticalReports: false
    })
  }

  generateVillageReports = () => {
    const list = document.getElementsByTagName('SELECT')
    const codeValue = list[list.length - 1].value
    let location = ''
    for (let i = 0; i < list.length; i++) {
      location = location + list[i].options[list[i].selectedIndex].text
      if (i < list.length - 1) location = location + ' > '
    }

    const locationArr = location.split('>')
    if (locationArr.length === 1 || locationArr[locationArr.length - 1] === ' ') {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_village_selected`,
            defaultMessage: `${config.labelBasePath}.alert.no_village_selected`
          }),
          null,
          () => this.setState({ alert: alertUser(false, 'info', '') }))
      })
    } else if (codeValue && location) {
      this.setState({
        objectCodeValue: codeValue,
        location: location,
        reports: villageSpecificReports,
        displayInvoice: false,
        displayStatisticalReports: false
      })
    }
  }

  generateGeneralReports = () => {
    const location = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.general_reports`,
      defaultMessage: `${config.labelBasePath}.main.general_reports`
    })
    this.setState({
      objectCodeValue: null,
      location,
      displayInvoice: false,
      displayStatisticalReports: false,
      reports: generalReports
    })
  }

  generateBlankReports = () => {
    const location = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.blank_reports`,
      defaultMessage: `${config.labelBasePath}.main.blank_reports`
    })
    this.setState({
      objectCodeValue: null,
      location,
      displayInvoice: false,
      displayStatisticalReports: false,
      blankReports: generalBlankReports
    })
  }

  render () {
    const { tableName, objectCodeValue, location, reports, blankReports } = this.state
    if (this.state.displayInvoice) {
      return <Invoice clearSelection={this.clearSelection} />
    } else if (this.state.displayStatisticalReports) {
      return <StatisticalReports clearSelection={this.clearSelection} />
    } else if (!reports && !blankReports) {
      return <div>
        <div className={sideMenuStyle.sideDiv}>
          {this.state.general_report && <React.Fragment>
            <div id='generalReports'>
              <label>
                {this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.main.general_reports`,
                    defaultMessage: `${config.labelBasePath}.main.general_reports`
                  }
                )}
              </label>
              <br />
              <button className={consoleStyle.conButton} onClick={this.generateGeneralReports}>
                {this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.main.display_general_reports`,
                    defaultMessage: `${config.labelBasePath}.main.display_general_reports`
                  }
                )}
              </button>
            </div>
            <br />
          </React.Fragment>}
          {this.state.blank_report && <React.Fragment>
            <div id='blankReports'>
              <label>
                {this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.main.blank_reports`,
                    defaultMessage: `${config.labelBasePath}.main.blank_reports`
                  }
                )}
              </label>
              <br />
              <button className={consoleStyle.conButton} onClick={this.generateBlankReports}>
                {this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.main.display_blank_reports`,
                    defaultMessage: `${config.labelBasePath}.main.display_blank_reports`
                  }
                )}
              </button>
            </div>
            <br />
          </React.Fragment>}
          {this.state.village_specific_report && <React.Fragment>
            <div id='villageSpecificReports'>
              <label>
                {this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.main.village_reports`,
                    defaultMessage: `${config.labelBasePath}.main.village_reports`
                  }
                )}
              </label>
              <br />
              <DependencyDropdowns tableName={tableName} spread='down' />
              <button className={consoleStyle.conButton} onClick={this.generateVillageReports}>
                {this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.main.display_village_reports`,
                    defaultMessage: `${config.labelBasePath}.main.display_village_reports`
                  }
                )}
              </button>
            </div>
            <br />
          </React.Fragment>}
          {this.state.invoice_report && <React.Fragment>
            <div id='invoices'>
              <label>
                {this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.main.invoices`,
                    defaultMessage: `${config.labelBasePath}.main.invoices`
                  }
                )}
              </label>
              <br />
              <button className={consoleStyle.conButton} onClick={() => this.setState({ displayInvoice: true })}>
                {this.context.intl.formatMessage(
                  {
                    id: `${config.labelBasePath}.main.generate_invoice`,
                    defaultMessage: `${config.labelBasePath}.main.generate_invoice`
                  }
                )}
              </button>
            </div>
            <br />
          </React.Fragment>}
          {this.state.statistical_report && <div id='statistical_reports'>
            <label>
              {this.context.intl.formatMessage(
                {
                  id: `${config.labelBasePath}.main.statistical_reports`,
                  defaultMessage: `${config.labelBasePath}.main.statistical_reports`
                }
              )}
            </label>
            <br />
            <button className={consoleStyle.conButton} onClick={() => this.setState({ displayStatisticalReports: true })}>
              {this.context.intl.formatMessage(
                {
                  id: `${config.labelBasePath}.main.generate_statistical_reports`,
                  defaultMessage: `${config.labelBasePath}.main.generate_statistical_reports`
                }
              )}
            </button>
          </div>}
        </div>
      </div>
    } else {
      return <ReportMenu
        clearSelection={this.clearSelection}
        objectCodeValue={objectCodeValue}
        location={location}
        reports={reports}
        blankReports={blankReports}
      />
    }
  }
}

ReportModule.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(ReportModule)
