import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import style from './ExecuteActionOnSelectedRows.module.css'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import { Loading } from 'components/ComponentsIndex'
import { strcmp, formatAlertType } from 'functions/utils'
import { massAnimalOrFlockAction } from 'backend/executeActionOnSelectedRows.js'

class UndoAnimalRetirement extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      loading: false
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ loading: nextProps.loading })
    if ((this.props.massActionResult !== nextProps.massActionResult) && nextProps.massActionResult) {
      if (strcmp(formatAlertType(nextProps.massActionResult), 'success')) {
        store.dispatch({ type: 'UNDO_ANIMAL_RETIREMENT_FULFILLED' })
      }
      this.setState({
        alert: alertUser(true, formatAlertType(nextProps.massActionResult), this.context.intl.formatMessage({
          id: nextProps.massActionResult,
          defaultMessage: nextProps.massActionResult
        }) || ' ', null,
        () => {
          store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
          store.dispatch({ type: 'RESET_UNDO_ANIMAL_RETIREMENT' })
        })
      })
    }
  }

  undoRetirePrompt = () => {
    let type = this.props.gridType.toLowerCase()
    this.setState({
      alert: alertUser(
        true,
        'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.prompt_text`,
          defaultMessage: `${config.labelBasePath}.actions.prompt_text`
        }) + ' ' + '"' +
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.undo_${type}_retire`,
          defaultMessage: `${config.labelBasePath}.actions.undo_${type}_retire`
        }) + '"' + '?',
        null,
        () => this.executeUndoRetireAction(),
        () => this.setState({ alert: alertUser(false, 'info', '') }),
        true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.actions.execute`,
          defaultMessage: `${config.labelBasePath}.actions.execute`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.forms.cancel`,
          defaultMessage: `${config.labelBasePath}.main.forms.cancel`
        })
      )
    })
  }

  executeUndoRetireAction = () => {
    store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
    this.props.selectedObjects.forEach(grid => {
      if (grid.active) {
        const objectArray = Array(grid.row)
        const actionName = 'undo-retire'
        const massActionType = 'EXECUTE_ACTION_ON_ROWS'
        const paramsArray = [{
          MASS_PARAM_TBL_NAME: this.props.gridType,
          MASS_PARAM_ACTION: actionName
        }]
        store.dispatch(massAnimalOrFlockAction(
          this.props.svSession, massActionType, actionName, objectArray, paramsArray
        ))
      }
    })
  }

  render () {
    const { gridType, selectedObjects } = this.props
    let component = null
    let type = gridType.toLowerCase()
    // double active flag hack
    if (gridType) {
      selectedObjects.forEach(grid => {
        const isActive = grid.active
        const status = grid.row[gridType + '.STATUS']
        if (isActive && status && status !== 'VALID') {
          component = <div
            id='undo_retire'
            className={style.menuActivator}
            onClick={() => this.undoRetirePrompt()}>
            {this.state.alert}
            <span
              id='undo_text'
              style={{ marginLeft: '10px', marginTop: gridType === 'ANIMAL' && '0' }}
              className={style.actionText}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.actions.undo_${type}_retire`,
                defaultMessage: `${config.labelBasePath}.actions.undo_${type}_retire`
              })}
            </span>
            <img id='move_img' className={style.actionImg}
              src='/naits/img/massActionsIcons/undo.png' />
          </div>
        }
      })
    }
    return (
      <React.Fragment>
        {this.state.loading && <Loading />}
        {component}
      </React.Fragment>
    )
  }
}

UndoAnimalRetirement.contextTypes = {
  intl: PropTypes.object.isRequired
}

UndoAnimalRetirement.propTypes = {
  gridType: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  selectedObjects: state.gridConfig.gridHierarchy,
  massActionResult: state.massActionResult.result,
  loading: state.massActionResult.loading
})

export default connect(mapStateToProps)(UndoAnimalRetirement)
