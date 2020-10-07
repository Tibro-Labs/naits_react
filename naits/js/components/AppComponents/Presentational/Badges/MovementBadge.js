import React from 'react'
import * as config from 'config/config.js'
import PropTypes from 'prop-types'
import styles from './Badges.module.css'
import Circle from './PercentageCircle'

export default class MovementBadge extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      percent: '0',
      icon: 'gray',
      gauge: 'gray',
      animation: null,
      needleTop: 'gray transparent',
      needleBottom: 'gray transparent'
    }
  }

  componentWillReceiveProps (nextProps) {
    const movementStatus = nextProps.status || null
    switch (movementStatus) {
      case '1': {
        this.setState({
          icon: 'red',
          gauge: 'green',
          animation: styles.waggle,
          needleTop: 'orangered transparent',
          needleBottom: '#888 transparent',
          percent: '100'
        })
        break
      }
      case '0': {
        this.setState({
          icon: 'red',
          gauge: 'red',
          animation: null,
          needleTop: 'gray transparent',
          needleBottom: 'gray transparent',
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
        <p>{this.context.intl.formatMessage({ id: `${config.labelBasePath}.movement_status`, defaultMessage: `${config.labelBasePath}.movement_status` })}</p>
        <div className={styles['gauge-container']}>
          <Circle
            className={styles['gauge-container']}
            percent={this.state.percent}
            trailWidth='5'
            strokeWidth='10'
            strokeColor={this.state.gauge}
            trailColor='gray'
          />
          <div style={{ animationName: this.state.animation }} className={styles.needle}>
            <div style={{ borderColor: this.state.needleTop }} className={styles.needleTop} />
            <div style={{ borderColor: this.state.needleBottom }} className={styles.needleBottom} />
          </div>
        </div>
      </div>
    )
  }
}

MovementBadge.contextTypes = {
  intl: PropTypes.object.isRequired
}
