import React from 'react'
import PropTypes from 'prop-types'
import Tour from 'react-user-tour'
import style from './UserTour.module.css'
import { connect } from 'react-redux'
import { guideConfig } from 'config/guideConfig.js'
import * as config from 'config/config'

const buttonStyle = {
  padding: '1rem',
  backgroundColor: '#e0ab10',
  color: 'rgb(73, 73, 73)',
  fontWeight: '700',
  display: 'inline-block',
  textAlign: 'center',
  cursor: 'pointer',
  float: 'right',
  marginRight: '1rem',
  marginTop: '1rem',
  borderRadius: '0.5rem'
}

class UserTour extends React.Component {
  constructor () {
    super()
    this.state = {
      tourStep: 1,
      steps: [],
      stateTooltip: undefined
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.stateTooltip !== nextProps.stateTooltip) {
      this.setState({ stateTooltip: nextProps.stateTooltip })
    }
    let gridType
    if (this.props.menuType.length > 0) {
      for (let i = 0; i < this.props.menuType.length; i++) {
        if (this.props.menuType[i].active) {
          gridType = this.props.menuType[i].gridType
        }
      }
    }
    if ((this.state.path !== nextProps.path && nextProps.path) && (this.props.getUserGroups === 'ADMINISTRATORS' || this.props.getUserGroups === 'LABORANT')) {
      if (guideConfig('GUIDE' + '_' + gridType) && guideConfig('GUIDE' + '_' + gridType).LIST_OF_ITEMS.length > 0) {
        this.setState({ steps: guideConfig('GUIDE' + '_' + gridType).LIST_OF_ITEMS })
      }
    } else {
      if (guideConfig('GUIDE' + '_' + gridType + '_' + 'USER') && guideConfig('GUIDE' + '_' + gridType + '_' + 'USER').LIST_OF_ITEMS.length > 0) {
        this.setState({ steps: guideConfig('GUIDE' + '_' + gridType + '_' + 'USER').LIST_OF_ITEMS })
      }
    }
  }

  componentDidMount () {
    if (guideConfig('GUIDE') && guideConfig('GUIDE').LIST_OF_ITEMS.length > 0) {
      this.setState({ steps: guideConfig('GUIDE').LIST_OF_ITEMS })
      if (this.props.stateTooltip) {
        this.setState({ stateTooltip: this.props.stateTooltip })
      }
    }
  }

  steps = step => this.setState({ tourStep: step })

  close = () => {
    this.props.showReactTooltip()
    this.setState({ tourStep: 1 })
  }

  render () {
    return (
      <div className={style.container}>
        <Tour
          active={this.state.stateTooltip}
          step={this.state.tourStep}
          onNext={this.steps}
          onBack={this.steps}
          onCancel={this.close}
          onDone={this.close}
          steps={this.state.steps}
          buttonStyle={buttonStyle}
          nextButtonText={
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.tour.next`,
              defaultMessage: `${config.labelBasePath}.tour.next`
            })
          }
          backButtonText={
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.tour.back`,
              defaultMessage: `${config.labelBasePath}.tour.back`
            })
          }
          doneButtonText={
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.tour.done`,
              defaultMessage: `${config.labelBasePath}.tour.done`
            })
          }
          closeButtonText={
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.tour.close`,
              defaultMessage: `${config.labelBasePath}.tour.close`
            })
          }
        />
      </div>
    )
  }
}

UserTour.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  stateTooltip: state.stateTooltip.stateTooltip,
  getUserGroups: state.userInfoReducer.getUsers,
  menuType: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(UserTour)
