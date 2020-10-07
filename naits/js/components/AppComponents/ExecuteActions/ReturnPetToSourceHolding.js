import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import * as config from 'config/config.js'
import { GridManager, ComponentManager } from 'components/ComponentsIndex'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import { formatAlertType, isValidArray } from 'functions/utils'

class ReturnPetToSourceHolding extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null
    }
  }

  componentDidUpdate (nextProps) {
    if (this.props.petHasBeenReturned !== nextProps.petHasBeenReturned) {
      let gridId = this.props.selectedGridId
      GridManager.reloadGridData(gridId)
      let altGridId = null
      altGridId = gridId.slice(0, -1)
      altGridId = `${altGridId}2`
      GridManager.reloadGridData(altGridId)
      store.dispatch({ type: 'RETURN_PET_ACTION_RESET' })
      ComponentManager.setStateForComponent(nextProps.selectedGridId)
      ComponentManager.setStateForComponent(nextProps.selectedGridId, 'selectedIndexes', [])
      ComponentManager.setStateForComponent(nextProps.selectedGridId, null, {
        selectedIndexes: []
      })
      store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], gridId] })
    }
  }

  returnPetPrompt () {
    if (isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.return_pet_to_source_holding_prompt`,
            defaultMessage: `${config.labelBasePath}.actions.return_pet_to_source_holding_prompt`
          }) + ' ' + ' ? ',
          null,
          () => this.returnPetToSourceHolding(),
          () => this.setState({
            alert: alertUser(false, 'info', '')
          }),
          true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.return`,
            defaultMessage: `${config.labelBasePath}.actions.return`
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
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.empty_selection`,
            defaultMessage: `${config.labelBasePath}.alert.empty_selection`
          }), null,
          () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    }
  }

  returnPetToSourceHolding = async () => {
    const objectArray = this.props.selectedGridRows
    const tableName = 'PET_MOVEMENT'
    const actionType = 'RETRUN_PET'

    const paramsArray = [{
      MASS_PARAM_TBL_NAME: tableName,
      MASS_PARAM_ACTION: actionType
    }]

    const verbPath = config.svConfig.triglavRestVerbs.MASS_PET_ACTION
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${this.props.session}`

    try {
      const res = await axios({
        method: 'post',
        url: url,
        data: JSON.stringify({ objectArray, paramsArray })
      })
      if (res.data.includes('error')) {
        store.dispatch({ type: 'RETURN_PET_ACTION_REJECTED', payload: res.data })
      } else if (res.data.includes('success')) {
        store.dispatch({ type: 'RETURN_PET_ACTION_FULFILLED', payload: res.data })
      }
      const responseType = formatAlertType(res.data)
      this.setState({
        alert: alertUser(
          true,
          responseType,
          this.context.intl.formatMessage({
            id: res.data,
            defaultMessage: res.data
          }),
          null
        )
      })
    } catch (err) {
      this.setState({
        alert: alertUser(
          true,
          'error',
          this.context.intl.formatMessage({
            id: err,
            defaultMessage: err
          }),
          null,
          () => {
            this.setState({ alert: false })
          }
        )
      })
    }
  }

  close = () => {
    this.setState({ alert: false, showAlert: false })
  }

  render () {
    return (
      <div id='activateMenu' className={style.menuActivator}>
        <div id='activateImgHolder' className={style.imgTxtHolder}>
          <span id='move_text' className={style.actionText}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.form_labels.flock.actions`,
              defaultMessage: `${config.labelBasePath}.form_labels.flock.actions`
            })}
          </span>
          <img id='move_img' className={style.actionImg}
            src='/naits/img/massActionsIcons/actions_general.png' />
        </div>
        <ul id='actionMenu' className={'list-group ' + style.ul_item} >
          <li id='return_pet_to_source_holding' key='return_pet_to_source_holding' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='activity_text' className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.return_pet`,
                  defaultMessage: `${config.labelBasePath}.actions.return_pet`
                })}
              </span>
              <img id='activity_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/undo.png' />
            </div>
            <ul
              id='return_pet_to_source_holding_sublist'
              key='return_pet_to_source_holding_sublist'
            >
              <li id='sublist_item_0'
                key='sublist_item_0'
                {... { onClick: () => this.returnPetPrompt() }}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.return_pet_to_source_holding`,
                  defaultMessage: `${config.labelBasePath}.actions.return_pet_to_source_holding`
                })}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    )
  }
}

ReturnPetToSourceHolding.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  selectedGridRows: state.selectedGridRows.selectedGridRows,
  selectedGridId: state.selectedGridRows.gridId,
  session: state.security.svSession,
  petHasBeenReturned: state.returnPetToSourceHolding.petHasBeenReturned
})

export default connect(mapStateToProps)(ReturnPetToSourceHolding)
