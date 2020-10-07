import React from 'react'
import * as config from 'config/config.js'
import PropTypes from 'prop-types'
import styles from './Badges.module.css'
import Circle from './PercentageCircle'
import { gaEventTracker } from 'functions/utils'

export default class PrintBadge extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      icon: 'gray',
      gauge: 'gray',
      percent: '0'
    }
  }

  componentDidMount () {
    // animation
    if (this.props.status === 'normal') {
      this.setState({
        icon: 'white',
        gauge: 'white',
        percent: '100'
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.status === 'inactive') {
      this.setState({ icon: 'gray', gauge: 'gray', percent: '0' })
    }
    if (nextProps.status === 'normal') {
      this.setState({
        icon: 'white',
        gauge: 'white',
        percent: '100'
      })
    }
  }

  reportLinks = (label, reportName, func) => {
    // Replace all underscores with spaces
    let formattedReportName = reportName.replace(/_/g, ' ')
    return (
      <div
        key={`${label}print`}
        onClick={() => {
          func()
          gaEventTracker(
            'GENERATE',
            `Clicked the ${formattedReportName} report button (${this.props.gridToDisplay})`,
            `REPORTS | ${config.version} (${config.currentEnv})`
          )
        }}
      >
        {
          this.context.intl.formatMessage({
            id: label,
            defaultMessage: label
          })
        }
      </div>
    )
  }

  configureReports = (props) => {
    if (props.reports) {
      props.gridHierarchy.map((singleGrid, index) => {
        // Checks for scenarios when a pet is selected
        if (props.gridToDisplay === 'PET' && props.gridType === 'PET' && singleGrid.active &&
          (!singleGrid.row['PET.IS_ADOPTED'] || singleGrid.row['PET.IS_ADOPTED'] !== 'yes')
        ) {
          props.reports.splice(2, 1)
        } else if (props.gridToDisplay === 'HOLDING' && props.gridType === 'PET' && singleGrid.active &&
          (!singleGrid.row['PET.IS_ADOPTED'] || singleGrid.row['PET.IS_ADOPTED'] !== 'yes')
        ) {
          props.reports.splice(2, 1)
        }

        // Checks for scenarios when an animal is selected
        if ((props.gridToDisplay === 'ANIMAL' || props.gridToDisplay === 'HOLDING' ||
          props.gridToDisplay === 'HOLDING_RESPONSIBLE' || props.gridToDisplay === 'QUARANTINE') &&
          props.gridType === 'ANIMAL') {
          if (singleGrid.active && singleGrid.gridType === 'ANIMAL' && singleGrid.row['ANIMAL.STATUS'] !== 'POSTMORTEM') {
            props.reports.splice(1, 3)
          }
        }

        // Checks for scenarios when a flock is selected
        if (props.gridType === 'FLOCK') {
          if ((singleGrid.row['HOLDING.TYPE'] === '7' ||
            (!singleGrid.row['HOLDING.TYPE'] || singleGrid.row['HOLDING.TYPE'] !== '7')) &&
            (singleGrid.active && singleGrid.gridType === 'FLOCK' && singleGrid.row['FLOCK.STATUS'] !== 'POSTMORTEM')
          ) {
            props.reports.splice(1, 1)
          }
        }

        // Checks for scenarios when a holding (which is not a shelter nor a vet station) is selected
        if (props.gridToDisplay === 'HOLDING' && props.gridType === 'HOLDING' && singleGrid.active &&
          ((singleGrid.row['HOLDING.TYPE'] !== '15' && singleGrid.row['HOLDING.TYPE'] !== '16') || !singleGrid.row['HOLDING.TYPE']) &&
          props.componentToDisplay && (props.componentToDisplay[0] || props.componentToDisplay[1] || props.componentToDisplay[index]) &&
          (props.componentToDisplay[0].props || props.componentToDisplay[1].props || props.componentToDisplay[index].props) &&
          (props.componentToDisplay[0].props.selectedObject === 'ANIMAL' || props.componentToDisplay[1].props.selectedObject === 'ANIMAL')) {
          props.reports.splice(1, 4)
        } else if (props.gridToDisplay === 'ANIMAL' && props.gridType === 'HOLDING' && singleGrid.active &&
          ((singleGrid.row['HOLDING.TYPE'] !== '15' && singleGrid.row['HOLDING.TYPE'] !== '16') || !singleGrid.row['HOLDING.TYPE']) &&
          props.componentToDisplay && (props.componentToDisplay[0] || props.componentToDisplay[1] || props.componentToDisplay[index]) &&
          (props.componentToDisplay[0].props || props.componentToDisplay[1].props || props.componentToDisplay[index].props) &&
          (props.componentToDisplay[0].props.selectedObject === 'ANIMAL' || props.componentToDisplay[1].props.selectedObject === 'ANIMAL')) {
          props.reports.splice(1, 4)
        } else if (props.gridToDisplay === 'HOLDING_RESPONSIBLE' && props.gridType === 'HOLDING' && singleGrid.active &&
          ((singleGrid.row['HOLDING.TYPE'] !== '15' && singleGrid.row['HOLDING.TYPE'] !== '16') || !singleGrid.row['HOLDING.TYPE']) &&
          props.componentToDisplay && (props.componentToDisplay[0] || props.componentToDisplay[1] || props.componentToDisplay[index]) &&
          (props.componentToDisplay[0].props || props.componentToDisplay[1].props || props.componentToDisplay[index].props) &&
          (props.componentToDisplay[0].props.selectedObject === 'ANIMAL' || props.componentToDisplay[1].props.selectedObject === 'ANIMAL')) {
          props.reports.splice(1, 4)
        } else if (props.gridToDisplay === 'QUARANTINE' && props.gridType === 'HOLDING' && singleGrid.active &&
          ((singleGrid.row['HOLDING.TYPE'] !== '15' && singleGrid.row['HOLDING.TYPE'] !== '16') ||
            !singleGrid.row['HOLDING.TYPE']) && props.componentToDisplay && props.componentToDisplay[index] &&
          (props.componentToDisplay[index].props.showGrid === 'ANIMAL' || props.componentToDisplay[index].props.selectedObject === 'ANIMAL')) {
          props.reports.splice(1, 4)
        } else if (props.gridToDisplay === 'HOLDING' && props.gridType === 'HOLDING' && singleGrid.active &&
          ((singleGrid.row['HOLDING.TYPE'] !== '15' && singleGrid.row['HOLDING.TYPE'] !== '16') ||
            !singleGrid.row['HOLDING.TYPE'])
        ) {
          props.reports.splice(3, 2)
        } else if (props.gridToDisplay === 'ANIMAL' && props.gridType === 'HOLDING' && singleGrid.active &&
          ((singleGrid.row['HOLDING.TYPE'] !== '15' && singleGrid.row['HOLDING.TYPE'] !== '16') ||
            !singleGrid.row['HOLDING.TYPE'])
        ) {
          props.reports.splice(3, 2)
        } else if (props.gridToDisplay === 'HOLDING_RESPONSIBLE' && props.gridType === 'HOLDING' && singleGrid.active &&
          ((singleGrid.row['HOLDING.TYPE'] !== '15' && singleGrid.row['HOLDING.TYPE'] !== '16') ||
            !singleGrid.row['HOLDING.TYPE'])) {
          props.reports.splice(3, 2)
        } else if (props.gridToDisplay === 'QUARANTINE' && props.gridType === 'HOLDING' && singleGrid.active &&
          ((singleGrid.row['HOLDING.TYPE'] !== '15' && singleGrid.row['HOLDING.TYPE'] !== '16') ||
            !singleGrid.row['HOLDING.TYPE'])) {
          props.reports.splice(3, 2)
        }

        // Checks for scenarios when a holding of type pet shelter is selected
        if (props.gridToDisplay === 'HOLDING' && props.gridType === 'HOLDING' &&
          singleGrid.active && singleGrid.row['HOLDING.TYPE'] === '15'
        ) {
          props.reports.splice(0, 4)
        } else if (props.gridToDisplay === 'PET' && props.gridType === 'HOLDING' &&
          singleGrid.active && singleGrid.row['HOLDING.TYPE'] === '15'
        ) {
          props.reports.splice(0, 4)
        }

        // Checks for scenarios when a holding of type vet station is selected
        if (props.gridToDisplay === 'HOLDING' && props.gridType === 'HOLDING' &&
          singleGrid.active && singleGrid.row['HOLDING.TYPE'] === '16'
        ) {
          props.reports.splice(0, 3)
          props.reports.pop()
        }
      })

      const reportLinks = props.reports.map(
        (reportsElement) => {
          let url = config.svConfig.triglavRestVerbs.GET_REPORT
          props.svSession && (url = url.replace('%session', props.svSession))
          props.objectId && (url = url.replace('%objectId', props.objectId))
          url = url.replace('%reportName', reportsElement.REPORT_NAME)

          if (reportsElement.ADDITIONAL_PARAM) {
            // find table type in grid hierarchy
            const element = props.gridHierarchy.find((item) => {
              return item.gridType === props.table
            })
            // get the name value and encode empty spaces
            const name = encodeURIComponent(element.row[reportsElement.ADDITIONAL_PARAM])
            // add the name to URL
            url = url + `/${name}/null`
          }

          function openPDFwindow () {
            window.open(`${config.svConfig.restSvcBaseUrl}/${url}`, '_blank')
          }
          return this.reportLinks(reportsElement.LABEL, reportsElement.REPORT_NAME, openPDFwindow)
        }
      )

      return reportLinks
    }
  }

  render () {
    return (
      <div
        id='printBadge'
        style={{
          cursor: this.props.status === 'normal' ? 'pointer' : null,
          marginRight: '7px'
        }}
        className={styles.container}
      >
        <p>{this.context.intl.formatMessage({ id: `${config.labelBasePath}.print`, defaultMessage: `${config.labelBasePath}.print` })}</p>
        <div id='showPrint' className={styles['gauge-container']}>
          <Circle
            className={styles['gauge-container']}
            percent={this.state.percent}
            trailWidth='5'
            strokeWidth='5'
            strokeColor={this.state.gauge}
            trailColor='gray'
          />
          <svg className={styles.print} viewBox='0 0 429.279 429.279'>
            <path fill='none' d='M113.161 34.717h202.957V149.67H113.161zm292.118 163.758c0-13.677-11.127-24.805-24.805-24.805H48.805C35.127 173.67 24 184.797 24 198.475v7.961h381.279v-7.961zm-21.156.067a12.091 12.091 0 0 1-8.48 3.51c-3.16 0-6.25-1.28-8.49-3.51a12.115 12.115 0 0 1-3.51-8.49c0-3.16 1.28-6.25 3.51-8.48 2.24-2.24 5.33-3.52 8.49-3.52 3.15 0 6.25 1.28 8.48 3.52a12.04 12.04 0 0 1 3.52 8.48 12.086 12.086 0 0 1-3.52 8.49zM110.846 394.563h207.588v-128.03H110.846v128.03zm31.152-101.655h140.514c6.627 0 12 5.372 12 12 0 6.627-5.373 12-12 12H141.998c-6.627 0-12-5.373-12-12s5.373-12 12-12zm0 51.281h65.641c6.628 0 12 5.373 12 12s-5.372 12-12 12h-65.641c-6.627 0-12-5.373-12-12s5.373-12 12-12z' />
            <path fill='#170be940' d='M24 327.508c0 13.676 11.127 24.803 24.805 24.803h38.041v-97.777c0-6.628 5.372-12 12-12h231.588c6.628 0 12 5.372 12 12v97.777h38.041c13.678 0 24.805-11.126 24.805-24.803v-97.072H24v97.072z' />
            <path fill={this.state.icon} d='M380.475 149.67h-40.357V22.717c0-6.627-5.372-12-12-12H101.161c-6.628 0-12 5.373-12 12V149.67H48.805C21.893 149.67 0 171.563 0 198.475v129.033c0 26.91 21.893 48.803 48.805 48.803h38.041v30.252c0 6.627 5.372 12 12 12h231.588c6.628 0 12-5.373 12-12V376.31h38.041c26.911 0 48.805-21.893 48.805-48.803V198.475c-.001-26.912-21.894-48.805-48.805-48.805zm24.804 177.838c0 13.676-11.127 24.803-24.805 24.803h-38.041v-97.777c0-6.628-5.372-12-12-12H98.846c-6.628 0-12 5.372-12 12v97.777H48.805C35.127 352.31 24 341.184 24 327.508v-97.072h381.279v97.072zM113.161 34.717h202.957V149.67H113.161V34.717zM24 198.475c0-13.677 11.127-24.805 24.805-24.805h331.67c13.678 0 24.805 11.127 24.805 24.805v7.961H24v-7.961zm294.434 196.088H110.846v-128.03h207.588v128.03z' />
            <path fill={this.state.icon} d='M375.642 178.052c-3.16 0-6.25 1.28-8.49 3.52a12.074 12.074 0 0 0-3.51 8.48c0 3.16 1.28 6.25 3.51 8.49 2.24 2.23 5.33 3.51 8.49 3.51 3.15 0 6.25-1.28 8.48-3.51 2.24-2.24 3.52-5.33 3.52-8.49s-1.279-6.25-3.52-8.48a12.057 12.057 0 0 0-8.48-3.52zM141.998 316.908h140.514c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12H141.998c-6.627 0-12 5.372-12 12s5.373 12 12 12zm0 51.281h65.641c6.628 0 12-5.373 12-12s-5.372-12-12-12h-65.641c-6.627 0-12 5.373-12 12 0 6.628 5.373 12 12 12z' />
          </svg>

          <div className={styles['dropdown-content']}>
            {this.configureReports(this.props)}
          </div>

        </div>
      </div>
    )
  }
}

PrintBadge.contextTypes = {
  intl: PropTypes.object.isRequired
}
