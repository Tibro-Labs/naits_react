import React from 'react'
import * as config from 'config/config.js'
import PropTypes from 'prop-types'
import styles from './Badges.module.css'
import Circle from './PercentageCircle'

export default class HealthBadge extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      icon: 'gray',
      gauge: 'gray',
      percent: '0'
    }
  }

  componentWillReceiveProps (nextProps) {
    let status = null
    if (nextProps.status) {
      status = Number(nextProps.status.slice(0, -1))
    }

    switch (true) {
      case (status <= 100 && status > 80): {
        this.setState({ icon: 'red', gauge: 'green', percent: String(status) })
        break
      }
      case (status <= 80 && status > 60): {
        this.setState({ icon: 'red', gauge: 'yellow', percent: String(status) })
        break
      }
      case (status <= 60 && status > 40): {
        this.setState({ icon: 'red', gauge: 'orange', percent: String(status) })
        break
      }
      case (status <= 40 && status >= 0): {
        this.setState({ icon: 'red', gauge: 'red', percent: String(status) })
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
        <p>{this.context.intl.formatMessage({ id: `${config.labelBasePath}.health_status`, defaultMessage: `${config.labelBasePath}.health_status` })}</p>
        <div className={styles['gauge-container']}>
          <Circle
            className={styles['gauge-container']}
            percent={this.state.percent}
            trailWidth='5'
            strokeWidth='10'
            strokeColor={this.state.gauge}
            trailColor='gray'
          />
          <svg className={styles.heart} viewBox='0 0 50 50'>
            <path
              fill={this.state.icon}
              d='M24.85 10.126c2.018-4.783 6.628-8.125 11.99-8.125 7.223 0 12.425 6.179 13.079 13.543 0 0 .353 1.828-.424 5.119-1.058 4.482-3.545 8.464-6.898 11.503L24.85 48 7.402 32.165c-3.353-3.038-5.84-7.021-6.898-11.503-.777-3.291-.424-5.119-.424-5.119C.734 8.179 5.936 2 13.159 2c5.363 0 9.673 3.343 11.691 8.126z'
            />
            <text x='25' y='30' fill='white' fontSize='2rem' fontWeight='bold' textAnchor='middle'>
              {this.state.percent + '%'}
            </text>
          </svg>
        </div>
      </div>
    )
  }
}

HealthBadge.contextTypes = {
  intl: PropTypes.object.isRequired
}
