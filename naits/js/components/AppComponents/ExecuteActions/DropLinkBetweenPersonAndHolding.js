import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import { dropLinkAction, resetLink } from 'backend/dropLinkAction'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import { isValidArray, gaEventTracker } from 'functions/utils'
import { ComponentManager, GridManager } from 'components/ComponentsIndex'

class DropLinkBetweenHoldingAndPerson extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.linkName !== nextProps.linkName) {
      this.reloadData(nextProps)
    }
    if ((this.props.dropLinkMessage !== nextProps.dropLinkMessage) &&
      nextProps.dropLinkMessage) {
      this.setState({
        alert: alertUser(true, 'success', this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.forms.record_deleted_success`,
          defaultMessage: `${config.labelBasePath}.main.forms.record_deleted_success`
        }) || ' ', null,
        () => {
          store.dispatch(resetLink())
        })
      })
      this.reloadData(nextProps)
    }
    if ((this.props.dropLinkError !== nextProps.dropLinkError) &&
      nextProps.dropLinkError) {
      this.setState({
        alert: alertUser(true, 'error', this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.forms.record_deleted_error`,
          defaultMessage: `${config.labelBasePath}.main.forms.record_deleted_error`
        }) || ' ', null,
        () => {
          store.dispatch(resetLink())
        })
      })
      this.reloadData(nextProps)
    }
  }

  reloadData = (props) => {
    let currentHoldingObjId, gridId
    props.selectedObjects.map(singleObj => {
      if (singleObj.active && singleObj.gridType === 'HOLDING') {
        currentHoldingObjId = singleObj.row[`${props.gridType}.OBJECT_ID`]
        gridId = `${props.selectedObject}_${currentHoldingObjId}_${props.linkName}`
      }
    })
    ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [])
    GridManager.reloadGridData(gridId)
    store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], gridId] })
  }

  dropLink = () => {
    let componentToDisplay = this.props.componentToDisplay
    let linkName
    if (isValidArray(componentToDisplay, 1)) {
      linkName = componentToDisplay[0].props.gridProps.linkName
    }
    let type = linkName.toLowerCase()
    store.dispatch({ type: 'CLEAN_ACTION_STATE', payload: null })
    function prompt (component, onConfirmCallback) {
      component.setState({
        alert: alertUser(
          true,
          'warning',
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.remove_${type}`,
            defaultMessage: `${config.labelBasePath}.main.remove_${type}`
          }),
          null,
          onConfirmCallback,
          () => component.setState({ alert: alertUser(false, 'info', '') }),
          true,
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.execute`,
            defaultMessage: `${config.labelBasePath}.actions.execute`
          }),
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.forms.cancel`,
            defaultMessage: `${config.labelBasePath}.main.forms.cancel`
          }),
          true,
          null,
          true
        )
      })
    }
    if (this.props.selectedGridRows.length > 0) {
      this.props.selectedObjects.map(singleObj => {
        if (singleObj.active) {
          prompt(this, () => this.props.dropLinkAction(this.props.svSession))
        }
      })
    } else {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.check_${type}`,
            defaultMessage: `${config.labelBasePath}.alert.check_${type}`
          }), null,
          () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    }
  }

  render () {
    const { gridType, componentToDisplay } = this.props
    let linkName
    if (isValidArray(componentToDisplay, 1)) {
      linkName = componentToDisplay[0].props.gridProps.linkName
    }
    let type = linkName.toLowerCase()

    // Formatting the link type (keeper, holder etc.) for google analytics purposes
    let splitTypeArr = type.split('_')
    let typeString = splitTypeArr.toString()
    typeString = typeString.replace(',', ' ')

    let btn = null
    if (gridType) {
      btn = <div>
        <button
          id='drop_link'
          className={styles.container} style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
          onClick={() => {
            this.dropLink()
            gaEventTracker(
              'REMOVE',
              `Clicked the Remove ${typeString} button`,
              `${this.props.gridType} | ${config.version} (${config.currentEnv})`
            )
          }}
        >
          <span
            id='drop_link_between_person_and_holding'
            className={style.actionText} style={{ marginLeft: '-7%', marginTop: '0.5%', cursor: 'pointer' }}
          >
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.remove_${type}`,
              defaultMessage: `${config.labelBasePath}.remove_${type}`
            })}
          </span>
          <img id='drop_link_between_person_and_holding' src='/naits/img/massActionsIcons/x-button.png' />
        </button>
      </div>
    }
    return btn
  }
}

DropLinkBetweenHoldingAndPerson.contextTypes = {
  intl: PropTypes.object.isRequired
}

DropLinkBetweenHoldingAndPerson.propTypes = {
  gridType: PropTypes.string.isRequired
}

const mapDispatchToProps = dispatch => ({
  dropLinkAction: (...params) => {
    dispatch(dropLinkAction(...params))
  }
})

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  selectedObjects: state.gridConfig.gridHierarchy,
  dropLinkMessage: state.dropLink.message,
  dropLinkError: state.dropLink.error,
  componentToDisplay: state.componentToDisplay.componentToDisplay,
  massActionResult: state.massActionResult.result,
  selectedGridRows: state.selectedGridRows.selectedGridRows,
  selectedGridId: state.selectedGridRows.gridId
})

export default connect(mapStateToProps, mapDispatchToProps)(DropLinkBetweenHoldingAndPerson)
