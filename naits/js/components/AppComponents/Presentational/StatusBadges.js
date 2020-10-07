import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import * as config from 'config/config'
import HealthBadge from 'components/AppComponents/Presentational/Badges/HealthBadge'
import MovementBadge from 'components/AppComponents/Presentational/Badges/MovementBadge'
import QuarantineBadge from 'components/AppComponents/Presentational/Badges/QuarantineBadge'
import PrintBadge from 'components/AppComponents/Presentational/Badges/PrintBadge'
import ObjectSummaryInfoBadge from 'components/AppComponents/Presentational/Badges/ObjectSummaryInfoBadge'
import styles from './Badges/Badges.module.css'
import { menuConfig } from 'config/menuConfig'
import createHashHistory from 'history/createHashHistory'
import { gaEventTracker } from 'functions/utils'

class StatusBadges extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      health: 'normal',
      movement: 'normal',
      quarantine: 'normal'
    }
  }

  componentDidMount () {
    if (this.props.menuType === 'HOLDING') {
      this.fetchData(this.props)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.menuType === 'HOLDING') {
      this.fetchData(nextProps)
    }
  }

  fetchData = (props) => {
    const verbPath = config.svConfig.triglavRestVerbs.HOLDING_STATUS
    let restUrl = config.svConfig.restSvcBaseUrl + verbPath
    restUrl = restUrl + `/${props.svSession}/${props.holdingObjId}`
    axios.get(restUrl).then(response => {
      const json = response.data
      if (json) {
        this.setState({
          health: json.health_status,
          movement: json.movement_status,
          quarantine: json.quarantine_status
        })
      } else {
        this.setState({
          health: 'normal',
          movement: 'normal',
          quarantine: 'normal'
        })
      }
    }).catch(error => {
      console.error(error)
      this.setState({
        health: 'normal',
        movement: 'normal',
        quarantine: 'normal'
      })
    })
  }

  showMap = () => {
    createHashHistory().push('/main/gis')
  }

  generateBadges = () => {
    const props = this.props
    let gridType = null
    let badges = []
    if (props.gridHierarchy.length > 0) {
      for (let i = 0; i < props.gridHierarchy.length; i++) {
        if (props.gridHierarchy[i].active) {
          // grid type is undefined on first render cycle for some reason
          gridType = props.gridHierarchy[i].gridType
        }
      }

      (menuConfig('SHOW_OBJECT_SUMMARY_INFO') && menuConfig('SHOW_OBJECT_SUMMARY_INFO').includes(gridType) &&
        badges.push(
          <ObjectSummaryInfoBadge objectType={props.menuType} {...props} />
        )
      )

      menuConfig('SHOW_STATUS_BADGES') && menuConfig('SHOW_STATUS_BADGES').includes(gridType) &&
        badges.push(
          <React.Fragment>
            {/* Holding status - first button group */}
            {
              ((this.props.gridHierarchy[0] && this.props.gridHierarchy[0].row['HOLDING.TYPE'] &&
                this.props.gridHierarchy[0].row['HOLDING.TYPE'] === '15') ||
                (this.props.gridHierarchy[1] && this.props.gridHierarchy[1].row['HOLDING.TYPE'] &&
                  this.props.gridHierarchy[1].row['HOLDING.TYPE'] === '15')) ||
                ((this.props.gridHierarchy[0] && this.props.gridHierarchy[0].row['HOLDING.TYPE'] &&
                  this.props.gridHierarchy[0].row['HOLDING.TYPE'] === '16') ||
                  (this.props.gridHierarchy[1] && this.props.gridHierarchy[1].row['HOLDING.TYPE'] &&
                    this.props.gridHierarchy[1].row['HOLDING.TYPE'] === '16'))
                ? null
                : <div id='activateStatuses' className={styles.activateStatuses}>
                  <div id='statusImgHolder' className={styles.imgTxtHolder}>
                    <span id='move_text' className={styles.statusText}>
                      {this.context.intl.formatMessage({
                        id: `${config.labelBasePath}.main.holding_status`,
                        defaultMessage: `${config.labelBasePath}.main.holding_status`
                      })}
                    </span>
                    <img id='move_img' className={styles.statusImg}
                      src='/naits/img/holding_status.png' />
                  </div>
                  <ul id='badgeGroup' className={styles.ul_group}>
                    <li id='badgeHealth'><HealthBadge status={this.state.health} /></li>
                    <li id='badgeMovement'><MovementBadge status={this.state.movement} /></li>
                    <li id='badgeQuarantine'><QuarantineBadge status={this.state.quarantine} /></li>
                  </ul>
                </div>
            }
          </React.Fragment>
        )

      menuConfig('SHOW_MAP') && menuConfig('SHOW_MAP').includes(gridType) &&
        badges.push(
          <div
            id='showMap'
            className={styles.container}
            onClick={() => {
              this.showMap()
              gaEventTracker(
                'GIS',
                `Clicked the Map button (${props.gridType})`,
                `${props.gridType} | ${config.version}`
              )
            }}
          >
            <p style={{
              wordwrap: 'break-word', width: '55px', margin: '7px', padding: '0', float: 'left'
            }}
            >
              {this.context.intl.formatMessage({ id: `${config.labelBasePath}.show_map`, defaultMessage: `${config.labelBasePath}.show_map` })}
            </p>
            <img style={{ height: '50px', width: '55px' }} src='/naits/img/globe.png' />
          </div>
        )

      if (menuConfig('SHOW_PRINT_BADGE') && menuConfig('SHOW_PRINT_BADGE').LIST_OF_ITEMS) {
        menuConfig('SHOW_PRINT_BADGE').LIST_OF_ITEMS.map(
          (element) => {
            if (gridType === element.TABLE) {
              badges.push(
                <PrintBadge
                  {...props}
                  key={`${gridType}${props.menuType}`}
                  reports={element.REPORTS}
                  table={element.TABLE}
                  status='normal'
                  gridHierarchy={props.gridHierarchy}
                />
              )
            }
          }
        )
      }
      return badges
    }
  }

  render () {
    return (
      <React.Fragment>
        {this.generateBadges()}
      </React.Fragment>
    )
  }
}

StatusBadges.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    gridHierarchy: state.gridConfig.gridHierarchy,
    svSession: state.security.svSession
  }
}

export default connect(mapStateToProps)(StatusBadges)
