import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as config from 'config/config.js'
import { alertUser } from 'tibro-components'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import { isValidArray } from 'functions/utils'

class MultiPrintSlaughterhouseLabels extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: undefined
    }
  }

  prompt = () => {
    if (this.props.selectedGridRows.length > 20) {
      this.setState({
        alert: alertUser(true, 'warning', this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.max_20_animal_can_be_selected`,
          defaultMessage: `${config.labelBasePath}.alert.max_20_animal_can_be_selected`
        }))
      })
    } else if (!isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({
        alert: alertUser(true, 'warning', this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.empty_selection`,
          defaultMessage: `${config.labelBasePath}.alert.empty_selection`
        }))
      })
    } else {
      let selectedAnimalsStatuses = []
      this.props.selectedGridRows.forEach(row => {
        selectedAnimalsStatuses.push(row['ANIMAL.STATUS'])
      })
      if (selectedAnimalsStatuses) {
        if (selectedAnimalsStatuses.includes('VALID') || selectedAnimalsStatuses.includes('PREMORTEM') ||
          selectedAnimalsStatuses.includes('DESTROYED') || selectedAnimalsStatuses.includes('SLAUGHTRD') ||
          selectedAnimalsStatuses.includes('TRANSITION')
        ) {
          this.setState({
            alert: alertUser(true, 'warning', this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.only_postmortem_animals_can_be_selected`,
              defaultMessage: `${config.labelBasePath}.alert.only_postmortem_animals_can_be_selected`
            }))
          })
        } else {
          this.setState({
            alert: alertUser(
              true, 'warning', this.context.intl.formatMessage({
                id: `${config.labelBasePath}.alert.multiprint_slaughterhouse_labels_prompt`,
                defaultMessage: `${config.labelBasePath}.alert.multiprint_slaughterhouse_labels_prompt`
              }), null, () => { this.generateLabels() }, () => { this.closeAlert() }, true,
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.yes`,
                defaultMessage: `${config.labelBasePath}.main.yes`
              }),
              this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.no`,
                defaultMessage: `${config.labelBasePath}.main.no`
              })
            )
          })
        }
      }
    }
  }

  closeAlert = () => {
    this.setState({ alert: undefined })
  }

  generateLabels = () => {
    let selectedAnimalsObjectIds = []
    if (this.props.selectedGridRows) {
      this.props.selectedGridRows.forEach(row => {
        if (row['ANIMAL.OBJECT_ID']) {
          selectedAnimalsObjectIds.push(row['ANIMAL.OBJECT_ID'])
        }
      })
    }

    const selectedAnimalObjectIdsToSend = selectedAnimalsObjectIds.toString()
    let verbPath = config.svConfig.triglavRestVerbs.GET_REPORT
    verbPath = verbPath.replace('%session', this.props.session)
    verbPath = verbPath.replace('%objectId', selectedAnimalObjectIdsToSend)
    verbPath = verbPath.replace('%reportName', 'master_1in1_final_geo')
    const url = `${config.svConfig.restSvcBaseUrl}/${verbPath}`
    window.open(url, '_blank')
  }

  render () {
    return (
      <div id='multiprint_slaughterhouse_labels_container' className={styles.container}
        style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
        onClick={this.prompt}
      >
        <p style={{ marginTop: '2px' }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.multiprint_slaughterhouse_labels`,
            defaultMessage: `${config.labelBasePath}.main.multiprint_slaughterhouse_labels`
          })}
        </p>
        <div id='multiprint_slaughterhouse_labels' className={styles['gauge-container']}>
          <img
            id='change_status_img'
            className={style.actionImg}
            style={{ height: '45px', marginTop: '7%' }}
            src='/naits/img/massActionsIcons/actions_general.png'
          />
        </div>
      </div>
    )
  }
}

MultiPrintSlaughterhouseLabels.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  selectedGridRows: state.selectedGridRows.selectedGridRows
})

export default connect(mapStateToProps)(MultiPrintSlaughterhouseLabels)
