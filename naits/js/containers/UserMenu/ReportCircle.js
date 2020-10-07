import React from 'react'
import PropTypes from 'prop-types'
import style from './item.module.css'
import animations from './animations.module.css'
import * as config from 'config/config.js'
import createHashHistory from 'history/createHashHistory'

const hashHistory = createHashHistory()

export default class ReportCircle extends React.Component {
  redirectToReportModule () {
    hashHistory.push('/main/reports')
  }

  render () {
    return (
      <div className={animations.fadeIn}>
        <div
          onClick={this.redirectToReportModule}
          className={style.mainDiv}
          data-tip={this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.show_prints`, defaultMessage: `${config.labelBasePath}.main.show_prints` })}
          data-effect='float'
          data-event-off='mouseout'
        >
          <svg style={{ transform: 'scale(0.65)' }}
            viewBox='0 0 429.279 429.279'>
            <path fill='none' d='M113.161 34.717h202.957V149.67H113.161zm292.118 163.758c0-13.677-11.127-24.805-24.805-24.805H48.805C35.127 173.67 24 184.797 24 198.475v7.961h381.279v-7.961zm-21.156.067a12.091 12.091 0 0 1-8.48 3.51c-3.16 0-6.25-1.28-8.49-3.51a12.115 12.115 0 0 1-3.51-8.49c0-3.16 1.28-6.25 3.51-8.48 2.24-2.24 5.33-3.52 8.49-3.52 3.15 0 6.25 1.28 8.48 3.52a12.04 12.04 0 0 1 3.52 8.48 12.086 12.086 0 0 1-3.52 8.49zM110.846   394.563h207.588v-128.03H110.846v128.03zm31.152-101.655h140.514c6.627 0 12 5.372 12 12 0 6.627-5.373 12-12 12H141.998c-6.627 0-12-5.373-12-12s5.373-12 12-12zm0 51.281h65.641c6.628 0 12 5.373 12 12s-5.372 12-12 12h-65.641c-6.627 0-12-5.373-12-12s5.373-12 12-12z' />
            <path fill='none' d='M24 327.508c0 13.676 11.127 24.803 24.805 24.803h38.041v-97.777c0-6.628 5.372-12 12-12h231.588c6.628 0 12 5.372 12 12v97.777h38.041c13.678 0 24.805-11.126 24.805-24.803v-97.072H24v97.072z' />
            <path fill='#f2f2f2' d='M380.475 149.67h-40.357V22.717c0-6.627-5.372-12-12-12H101.161c-6.628 0-12 5.373-12 12V149.67H48.805C21.893 149.67 0 171.563 0 198.475v129.033c0 26.91 21.893 48.803 48.805 48.803h38.041v30.252c0 6.627 5.372 12 12 12h231.588c6.628 0 12-5.373 12-12V376.31h38.041c26.911 0 48.805-21.893 48.805-48.803V198.475c-.001-26.912-21.894-48.805-48.805-48.805zm24.804 177.838c0 13.676-11.127 24.803-24.805 24.803h-38.041v-97.777c0-6.628-5.372-12-12-12H98.846c-6.628 0-12 5.372-12   12v97.777H48.805C35.127 352.31 24 341.184 24 327.508v-97.072h381.279v97.072zM113.161 34.717h202.957V149.67H113.161V34.717zM24 198.475c0-13.677 11.127-24.805 24.805-24.805h331.67c13.678 0 24.805 11.127 24.805 24.805v7.961H24v-7.961zm294.434 196.088H110.846v-128.03h207.588v128.03z' />
            <path fill='#f2f2f2' d='M375.642 178.052c-3.16 0-6.25 1.28-8.49 3.52a12.074 12.074 0 0 0-3.51 8.48c0 3.16 1.28 6.25 3.51 8.49 2.24 2.23 5.33 3.51 8.49 3.51 3.15 0 6.25-1.28 8.48-3.51 2.24-2.24 3.52-5.33 3.52-8.49s-1.279-6.25-3.52-8.48a12.057 12.057 0 0 0-8.48-3.52zM141.998 316.908h140.514c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12H141.998c-6.627 0-12 5.372-12 12s5.373 12 12 12zm0 51.281h65.641c6.628 0 12-5.373 12-12s-5.372-12-12-12h-65.641c-6.627 0-12 5.373-12 12 0 6.628 5.373 12   12 12z' />
          </svg>
        </div>
      </div>
    )
  }
}

ReportCircle.contextTypes = {
  intl: PropTypes.object.isRequired
}
