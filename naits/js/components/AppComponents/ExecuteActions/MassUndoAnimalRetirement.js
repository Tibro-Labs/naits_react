import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { GridManager, ComponentManager, alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { Loading } from 'components/ComponentsIndex'
import { massAnimalOrFlockAction } from 'backend/executeActionOnSelectedRows'
import { formatAlertType, strcmp, isValidArray } from 'functions/utils'
import * as config from 'config/config.js'
import style from './ExecuteActionOnSelectedRows.module.css'

class MassUndoAnimalRetirement extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: false,
      loading: false
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ loading: nextProps.loading })
    if ((this.props.massActionResult !== nextProps.massActionResult) &&
      nextProps.massActionResult) {
      this.setState({
        alert: alertUser(true, formatAlertType(nextProps.massActionResult), this.context.intl.formatMessage({
          id: nextProps.massActionResult,
          defaultMessage: nextProps.massActionResult
        }) || ' ', null,
        () => {
          store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
          GridManager.reloadGridData('ANIMAL')
          ComponentManager.setStateForComponent('ANIMAL', 'selectedIndexes', [])
          store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], 'ANIMAL'] })
        })
      })
    }
  }

  componentDidUpdate (nextProps) {
    if (this.props.animalStatusCriteria !== nextProps.animalStatusCriteria) {
      ComponentManager.setStateForComponent('ANIMAL', 'selectedIndexes', [])
      store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], 'ANIMAL'] })
    }
  }

  undoRetirePrompt = () => {
    if (isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' +
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.undo_animal_retire`,
            defaultMessage: `${config.labelBasePath}.actions.undo_animal_retire`
          }) + '"' + '?',
          null,
          () => {
            store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
            const objectArray = this.props.selectedGridRows
            const actionName = 'undo-retire'
            const massActionType = 'EXECUTE_ACTION_ON_ROWS'
            const paramsArray = [{
              MASS_PARAM_TBL_NAME: this.props.gridType,
              MASS_PARAM_ACTION: actionName
            }]
            store.dispatch(massAnimalOrFlockAction(
              this.props.session, massActionType, actionName, objectArray, paramsArray
            ))
          },
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
    } else {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.empty_selection`,
            defaultMessage: `${config.labelBasePath}.alert.empty_selection`
          }), null, () => this.setState({ alert: false })
        )
      })
    }
  }

  cancelMovementPrompt = () => {
    if (isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' + this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.cancel_movement`,
            defaultMessage: `${config.labelBasePath}.actions.cancel_movement`
          }) + '"' + ' ? ', null,
          () => {
            const massActionType = 'EXECUTE_ACTION_ON_ROWS'
            const actionType = 'MOVE'
            const subActionType = 'CANCEL_MOVEMENT'
            const objectArray = this.props.selectedGridRows
            const paramsArray = [{
              MASS_PARAM_TBL_NAME: this.props.gridType,
              MASS_PARAM_ACTION: actionType,
              MASS_PARAM_SUBACTION: subActionType,
              MASS_PARAM_ADDITIONAL_PARAM: '0'
            }]
            store.dispatch(massAnimalOrFlockAction(
              this.props.session, massActionType, subActionType, objectArray, paramsArray
            ))
          },
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
    } else {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.empty_selection`,
            defaultMessage: `${config.labelBasePath}.alert.empty_selection`
          }), null, () => this.setState({ alert: false })
        )
      })
    }
  }

  render () {
    const { animalStatusCriteria } = this.props
    let component = null
    if (animalStatusCriteria) {
      component = <div
        id='undo_retire'
        className={style.menuActivator}
        style={{ marginBottom: '1rem' }}
        onClick={() => {
          if (strcmp(animalStatusCriteria, 'LOST')) {
            this.undoRetirePrompt()
          } else {
            this.cancelMovementPrompt()
          }
        }}>
        <span id='undo_text' style={{ marginTop: animalStatusCriteria === 'LOST' ? '2px' : '8px' }} className={style.actionText}>
          {animalStatusCriteria === 'LOST' ? this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.undo_animal_retire`,
            defaultMessage: `${config.labelBasePath}.actions.undo_animal_retire`
          }) : animalStatusCriteria === 'TRANSITION' ? this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.cancel_movement`,
            defaultMessage: `${config.labelBasePath}.actions.cancel_movement`
          }) : ''}
        </span>
        <img id='move_img' className={style.actionImg}
          src='/naits/img/massActionsIcons/undo.png' />
      </div>
    }
    return (
      <React.Fragment>
        {this.state.loading && <Loading />}
        {component}
      </React.Fragment>
    )
  }
}

MassUndoAnimalRetirement.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  selectedGridRows: state.selectedGridRows.selectedGridRows,
  massActionResult: state.massActionResult.result,
  loading: state.massActionResult.loading,
  animalStatusCriteria: state.customSearchCriteria.animalStatusCriteria
})

export default connect(mapStateToProps)(MassUndoAnimalRetirement)
