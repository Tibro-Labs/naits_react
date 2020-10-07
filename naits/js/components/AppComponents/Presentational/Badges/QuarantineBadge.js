import React from 'react'
import * as config from 'config/config.js'
import PropTypes from 'prop-types'
import styles from './Badges.module.css'
import Circle from './PercentageCircle'

export default class QuarantineBadge extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      icon: 'gray',
      gauge: 'gray',
      percent: '0'
    }
  }

  componentWillReceiveProps (nextProps) {
    const quarantineStatus = nextProps.status || null
    switch (quarantineStatus) {
      case '1': {
        this.setState({
          icon: 'darkorange',
          gauge: 'red',
          percent: '100'
        })
        break
      }
      case '0': {
        this.setState({
          icon: 'gray',
          gauge: 'green',
          percent: '100'
        })
        break
      }
      default: {
        break
      }
    }
  }

  render () {
    return (
      <div className={styles.container}>
        <p>{this.context.intl.formatMessage({ id: `${config.labelBasePath}.quarantine_status`, defaultMessage: `${config.labelBasePath}.quarantine_status` })}</p>
        <div className={styles['gauge-container']}>
          <Circle
            className={styles['gauge-container']}
            percent={this.state.percent}
            trailWidth='5'
            strokeWidth='10'
            strokeColor={this.state.gauge}
            trailColor='gray'
          />
          <svg className={styles.biohazard}>
            <path
              fill={this.state.icon}
              d='M25.267 13.247c-.425-.122-.878-.129-1.321-.146.121-.311 3.326-8.258-5.136-11.408-.004.071-.01.143-.021.211 5.438 3.268 2.922 8.502   2.717 8.731a8.824 8.824 0 0 0-5.403-1.84 8.817 8.817 0 0 0-5.483 1.904 7.318 7.318 0 0 1-.847-2.087c-.15-1.351-.056-2.565.533-3.821a6.671 6.671 0 0 1   2.64-2.744 2.281 2.281 0 0 1-.031-.19c-1.24.501-2.369 1.34-3.381 2.422-.44.615-3.073 3.782-1.408 8.617a8.908 8.908 0 0 0-1.335.146c-1.751.372-4.534   1.878-5.845 4.467-.439.74-.612 1.496-.819 2.226-.212 1.464-.166 2.87.215 4.153.056-.034.111-.066.168-.096a6.666 6.666 0 0 1 .5-3.774c.614-1.246 1.504-2.075   2.654-2.798 1.937-.908 3.564-.656 3.631-.645a9.175 9.175 0 0 0-.068 1.096c0 3.549 2.095 6.615 5.113 8.035l-.045.125c-.056.103-2.85 4.651-8.252   2.619-.048.051-.099.1-.151.147.663.51 6.303 4.29 11.497-2.086.235.021.473.034.714.034.145 0 .289-.006.433-.012 1.097 1.525 5.3 6.244 11.633 2.268a2.112   2.112 0 0 1-.15-.149c-5.652 2.11-8.312-2.776-8.342-2.86 3.361-1.528 5.302-4.5 5.302-8.121 0-.312-.017-.617-.047-.922a.285.285 0 0 0 .035-.008c1.099-.074   2.275.139 3.429.68 1.15.726 2.04 1.556 2.654 2.801a6.68 6.68 0 0 1 .499 3.773c.058.029.112.06.168.096.461-1.451 1.616-8.529-6.45-10.844zm-13.674   5.945l-.015-.018.012.014.003.004zm2.21-1.521a2.3 2.3 0 0 1 4.597-.001c0 .949-.579 1.77-1.404 2.119a2.296 2.296 0 0 1-3.193-2.118zm2.298-6.462c1.373 0   2.646.434 3.694 1.167-1.165.825-4.743 2.123-7.496.078a6.415 6.415 0 0 1 3.802-1.245zm-6.459 6.462c0-.092.004-.185.006-.277.107.061 2.999 1.621 3.221   5.865a6.463 6.463 0 0 1-3.227-5.588zm9.546 5.672c.002-.108.239-4.016 3.369-5.824.001.05.004.102.004.152a6.464 6.464 0 0 1-3.373 5.672z'
            />
          </svg>
        </div>
      </div>
    )
  }
}

QuarantineBadge.contextTypes = {
  intl: PropTypes.object.isRequired
}
