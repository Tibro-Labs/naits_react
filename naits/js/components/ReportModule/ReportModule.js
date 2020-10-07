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
      userCanUseStatisticalReportTool: null
    }
  }

  componentDidMount () {
    // Check if the current user can use the statistical reports tool
    this.checkIfCurrentUserCanUseTheStatReportsTool()
  }

  checkIfCurrentUserCanUseTheStatReportsTool = async () => {
    const server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.CHECK_IF_USER_CAN_USE_STATISTICAL_REPORT_TOOL
    verbPath = verbPath.replace('%sessionId', this.props.session)
    let url = `${server}${verbPath}`

    try {
      const res = await axios.get(url)
      this.setState({ userCanUseStatisticalReportTool: res.data })
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
          {this.state.userCanUseStatisticalReportTool && <div id='statistical_reports'>
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
