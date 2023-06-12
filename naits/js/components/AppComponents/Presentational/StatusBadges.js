import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { store } from 'tibro-redux'
import axios from 'axios'
import * as config from 'config/config'
import HealthBadge from 'components/AppComponents/Presentational/Badges/HealthBadge'
import MovementBadge from 'components/AppComponents/Presentational/Badges/MovementBadge'
import QuarantineBadge from 'components/AppComponents/Presentational/Badges/QuarantineBadge'
import PrintBadge from 'components/AppComponents/Presentational/Badges/PrintBadge'
import ObjectSummaryInfoBadge from 'components/AppComponents/Presentational/Badges/ObjectSummaryInfoBadge'
import QuestionnairesPerObject from 'components/Questionnaire/QuestionnairesPerObject'
import styles from './Badges/Badges.module.css'
import { menuConfig } from 'config/menuConfig'
import createHashHistory from 'history/createHashHistory'
import { writeComponentToStoreAction } from 'backend/writeComponentToStoreAction'
import { gaEventTracker } from 'functions/utils'

class StatusBadges extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      health: 'normal',
      movement: 'normal',
      quarantine: 'normal',
      shouldRenderPrintBadge: false
    }
  }

  componentDidMount () {
    // if (this.props.menuType === 'HOLDING') {
    //   this.fetchData(this.props)
    // }

    if (this.props.menuType === 'EXPORT_CERT' || this.props.isFromExportCert) {
      this.shouldRenderExportCertPrintBadge()
    }

    if (this.props.menuType !== 'EXPORT_CERT') {
      this.setState({ shouldRenderPrintBadge: true })
    }
  }

  componentWillReceiveProps (nextProps) {
    // if (nextProps.menuType === 'HOLDING') {
    //   this.fetchData(nextProps)
    // }

    if (nextProps.menuType === 'EXPORT_CERT') {
      this.shouldRenderExportCertPrintBadge()
    }

    if (nextProps.shouldRefreshPrintBadgeAndSummaryInfo) {
      this.generateBadges()
      store.dispatch({ type: 'RESET_PRINT_BADGE_AND_SUMMARY_INFO_REFRESH' })
    }

    if (nextProps.menuType !== 'EXPORT_CERT') {
      this.setState({ shouldRenderPrintBadge: true })
    }
  }

  shouldRenderExportCertPrintBadge = () => {
    const server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.DISPLAY_EXPORT_CERT_PRINT_BADGE
    verbPath = verbPath.replace('%session', this.props.svSession)
    verbPath = verbPath.replace('%objectId', this.props.objectId)
    let url = `${server}${verbPath}`
    axios.get(url)
      .then(res => this.setState({ shouldRenderPrintBadge: res.data }))
      .catch(err => console.error(err))
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

  showQuestionnaires = () => {
    if (this.props.questionnaireComponent) {
      store.dispatch({ type: 'CLOSE_QUESTIONNAIRES' })
    } else {
      store.dispatch(writeComponentToStoreAction(null))
      store.dispatch({ type: 'DISPLAY_QUESTIONNAIRES', payload: <QuestionnairesPerObject {...this.props} /> })
      document.getElementById('clearReturnedComponentSideMenu') && document.getElementById('clearReturnedComponentSideMenu').click()
      // Hack for hiding some holding side menu button when toggling the questionnaires...
      const terminatedAnimalsBtn = document.getElementById('list_item_terminated_animals')
      const incomingAnimalsBtn = document.getElementById('list_item_animal_movement')
      const finishedIncomingAnimalsBtn = document.getElementById('list_item_finished_animal_movement')
      const outgoingAnimalsBtn = document.getElementById('list_item_outgoing_animals')
      const incomingFlocksBtn = document.getElementById('list_item_flock_movement')
      const finishedIncomingFlockBtn = document.getElementById('list_item_finished_flock_movement')
      const outgoingFlocksBtn = document.getElementById('list_item_outgoing_flocks')
      const finishedOutgoingFlockBtn = document.getElementById('list_item_finished_outgoing_flocks')
      const incomingHerdsBtn = document.getElementById('list_item_herd_movement')
      const finishedIncomingHerdsBtn = document.getElementById('list_item_finished_herd_movement')
      const outgoingHerdsBtn = document.getElementById('list_item_outgoing_herds')
      const finishedOutgoingHerdsBtn = document.getElementById('list_item_finished_outgoing_herds')
      if (terminatedAnimalsBtn) {
        terminatedAnimalsBtn.style.display = 'none'
      }
      if (incomingAnimalsBtn) {
        incomingAnimalsBtn.style.display = 'none'
      }
      if (finishedIncomingAnimalsBtn) {
        finishedIncomingAnimalsBtn.style.display = 'none'
      }
      if (outgoingAnimalsBtn) {
        outgoingAnimalsBtn.style.display = 'none'
      }
      if (incomingFlocksBtn) {
        incomingFlocksBtn.style.display = 'none'
      }
      if (finishedIncomingFlockBtn) {
        finishedIncomingFlockBtn.style.display = 'none'
      }
      if (outgoingFlocksBtn) {
        outgoingFlocksBtn.style.display = 'none'
      }
      if (finishedOutgoingFlockBtn) {
        finishedOutgoingFlockBtn.style.display = 'none'
      }
      if (incomingHerdsBtn) {
        incomingHerdsBtn.style.display = 'none'
      }
      if (finishedIncomingHerdsBtn) {
        finishedIncomingHerdsBtn.style.display = 'none'
      }
      if (outgoingHerdsBtn) {
        outgoingHerdsBtn.style.display = 'none'
      }
      if (finishedOutgoingHerdsBtn) {
        finishedOutgoingHerdsBtn.style.display = 'none'
      }
    }
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
                    this.props.gridHierarchy[1].row['HOLDING.TYPE'] === '16')) ||
                ((this.props.gridHierarchy[0] && this.props.gridHierarchy[0].row['HOLDING.TYPE'] &&
                  this.props.gridHierarchy[0].row['HOLDING.TYPE'] === '17') ||
                  (this.props.gridHierarchy[1] && this.props.gridHierarchy[1].row['HOLDING.TYPE'] &&
                    this.props.gridHierarchy[1].row['HOLDING.TYPE'] === '17'))
                ? null
                : <div id='activateStatuses' className={styles.activateStatuses}>
                  <div id='statusImgHolder' className={styles.imgTxtHolder}>
                    <span id='move_text' style={{ marginTop: '10px' }} className={styles.statusText}>
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
              wordwrap: 'break-word', width: '55px', margin: '16px 7px 7px 7px', padding: '0', float: 'left'
            }}
            >
              {this.context.intl.formatMessage({ id: `${config.labelBasePath}.show_map`, defaultMessage: `${config.labelBasePath}.show_map` })}
            </p>
            <img style={{ height: '50px', width: '55px', marginTop: '2px' }} src='/naits/img/globe.png' />
          </div>
        )

      menuConfig('SHOW_QUESTIONNAIRES') && menuConfig('SHOW_QUESTIONNAIRES').includes(gridType) &&
        badges.push(
          <div id='showQuestionnaires' className={styles.container} style={{ width: '180px' }}
            onClick={() => {
              this.showQuestionnaires()
              gaEventTracker(
                'QUESTIONNAIRES',
                `Clicked the Questionnaires button (${props.gridType})`,
                `${props.gridType} | ${config.version}`
              )
            }}
          >
            <p style={{ wordWrap: 'unset', width: '72px', margin: '16px 15px 7px 7px', padding: '0', float: 'left' }}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.questionnaire.list`,
                defaultMessage: `${config.labelBasePath}.main.questionnaire.list`
              })}
            </p>
            <img style={{ height: '50px', width: '55px', marginTop: '2px' }} src='/naits/img/massActionsIcons/stratify.png' />
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
    if (!this.state.shouldRenderPrintBadge) {
      return null
    }
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
    svSession: state.security.svSession,
    shouldRefreshPrintBadgeAndSummaryInfo: state.changeStatus.shouldRefreshPrintBadgeAndSummaryInfo,
    questionnaireComponent: state.questionnaire.component
  }
}

export default connect(mapStateToProps)(StatusBadges)
