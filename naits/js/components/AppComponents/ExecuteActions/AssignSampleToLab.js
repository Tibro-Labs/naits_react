import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { store, updateSelectedRows } from 'tibro-redux'
import * as config from 'config/config'
import badge from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import { alertUser } from 'tibro-components'
import { GridManager, ComponentManager, GridInModalLinkObjects } from 'components/ComponentsIndex'
import { labSampleAction, resetLabSample } from 'backend/labSampleAction.js'
import * as utils from 'functions/utils'

class AssignSampleToLab extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      modal: null
    }
  }

  componentWillReceiveProps (nextProps) {
    let responseDestination = nextProps.massActionResult || nextProps.actionResult
    if (responseDestination &&
      (this.props.massActionResult !== nextProps.massActionResult ||
        this.props.actionResult !== nextProps.actionResult)) {
      const responseType = utils.formatAlertType(responseDestination)
      this.setState({
        alert: alertUser(
          true,
          responseType,
          this.context.intl.formatMessage({
            id: responseDestination,
            defaultMessage: responseDestination
          }),
          null
        )
      })
      this.props.updateSelectedRows([], null)
      store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
      this.props.resetLabSample()
      ComponentManager.setStateForComponent('LAB_SAMPLE', 'selectedIndexes', [])
      GridManager.reloadGridData('LAB_SAMPLE')
    }
  }

  assign = () => {
    const labName = encodeURIComponent(store.getState()['LABORATORY'].rowClicked['LABORATORY.LAB_NAME'])
    this.props.labSampleAction(
      this.props.svSession,
      'sample_action',
      'ASSIGN_LAB',
      labName,
      this.props.selectedGridRows)
    this.closeModal()
  }

  closeModal = () => {
    this.setState({ modal: null })
  }

  chooseLab = () => {
    if (!utils.isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.empty_selection`,
            defaultMessage: `${config.labelBasePath}.alert.empty_selection`
          }), null,
          () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    } else {
      this.setState({
        modal: <GridInModalLinkObjects
          loadFromParent
          linkedTable='LABORATORY'
          onRowSelect={this.assign}
          key='LABORATORY_SEARCH'
          closeModal={this.closeModal}
        />
      })
    }
  }

  render () {
    return <div>
      {this.state.alert}
      {this.state.modal}
      <button
        id='set_activity_period'
        className={badge.container}
        style={{ cursor: 'pointer', color: 'white', marginLeft: '0', marginBottom: '1rem' }}
        onClick={() => this.chooseLab(this.assign)}
      >
        <span id='set_activity_txt' className={style.actionText} style={{ cursor: 'pointer' }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.assign_sample_to_laboratory`,
            defaultMessage: `${config.labelBasePath}.assign_sample_to_laboratory`
          })}
        </span>
        <img id='set_activity_img' src='/naits/img/massActionsIcons/animal_health.png' />
      </button>
    </div>
  }
}

AssignSampleToLab.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    svSession: state.security.svSession,
    selectedGridRows: state.selectedGridRows.selectedGridRows,
    massActionResult: state.massActionResult.result,
    actionResult: state.massAction.result
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateSelectedRows: (...params) => {
    dispatch(updateSelectedRows(...params))
  },
  labSampleAction: (...params) => {
    dispatch(labSampleAction(...params))
  },
  resetLabSample: (...params) => {
    dispatch(resetLabSample(...params))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AssignSampleToLab)
