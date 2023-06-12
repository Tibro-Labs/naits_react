import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import style from './ExecuteActionOnSelectedRows.module.css'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import { formatAlertType, strcmp, isValidArray } from 'functions/utils'
import { standAloneAction, reset } from 'backend/standAloneAction'
import * as config from 'config/config'
import { ComponentManager, GridManager } from 'components/ComponentsIndex'

class StandAloneAction extends React.Component {
  /** This component provides a single action on the selected object
  * Requires object parent ID
  * KNI 18.10.2018
  */
  constructor (props) {
    super(props)
    this.state = {
      alert: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if ((this.props.massActionResult !== nextProps.massActionResult) &&
      nextProps.massActionResult) {
      this.setState({
        alert: alertUser(true, formatAlertType(nextProps.massActionResult), this.context.intl.formatMessage({
          id: nextProps.massActionResult,
          defaultMessage: nextProps.massActionResult
        }) || ' ', null,
        () => {
          store.dispatch(reset(nextProps.actionParams))
        })
      })
      this.reloadData(nextProps)
    }
  }

  reloadData = (props) => {
    let gridId, key
    let { componentToDisplay } = this.props
    if (componentToDisplay.length > 0) {
      for (let i = 0; i < componentToDisplay.length; i++) {
        key = componentToDisplay[i].key
        if (key) {
          gridId = key
        }
      }
    }
    ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [])
    GridManager.reloadGridData(gridId)
  }

  executeAction = () => {
    const areAnyRowsSelected = isValidArray(this.props.selectedGridRows, 1)
    let actionParams = Object.assign({}, this.props.actionParams)
    if (strcmp(actionParams.method, 'post') && !areAnyRowsSelected) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.empty_selection`,
            defaultMessage: `${config.labelBasePath}.alert.empty_selection`
          }), null,
          () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
      return
    } else if (strcmp(actionParams.method, 'post') && areAnyRowsSelected) {
      actionParams.objectArray = this.props.selectedGridRows
    }
    if (this.props.hasPrompt) {
      // if action should be prompted;
      // will display a default action prompt title and message if none are provided through props
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: this.props.promptTitle || `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: this.props.promptTitle || `${config.labelBasePath}.actions.prompt_text`
          }),
          this.context.intl.formatMessage({
            id: this.props.promptMessage || ' ',
            defaultMessage: this.props.promptMessage || ' '
          }),
          () => store.dispatch(standAloneAction(actionParams)),
          () => this.setState({ alert: alertUser(false, 'info', '') }),
          true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }),
          true,
          null,
          true
        )
      })
    } else {
      store.dispatch(standAloneAction(actionParams))
    }
  }

  render () {
    const { imgSrc, actionParams } = this.props
    return (
      <div
        id={actionParams.urlCode}
        className={style.menuActivator}
        style={{ width: 'auto' }}
        onClick={this.executeAction}>
        {this.state.alert}
        <span id='undo_text' className={style.actionText} style={{ width: '100px', marginTop: '2px', marginLeft: '-2px' }}>
          {this.context.intl.formatMessage({
            id: actionParams.nameLabel,
            defaultMessage: actionParams.nameLabel
          })}
        </span>
        <img id='move_img' className={style.actionImg} src={imgSrc} />
      </div>
    )
  }
}

StandAloneAction.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  massActionResult: state.massAction.result,
  selectedGridRows: state.selectedGridRows.selectedGridRows,
  componentToDisplay: state.componentToDisplay.componentToDisplay
})

export default connect(mapStateToProps)(StandAloneAction)
