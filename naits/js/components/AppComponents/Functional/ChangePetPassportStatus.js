import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import * as config from 'config/config.js'
import { GridManager, ComponentManager } from 'components/ComponentsIndex'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import { formatAlertType, isValidArray, capitalizeFirstLetter } from 'functions/utils'

class ChangePetPassportStatus extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null
    }
  }

  componentDidUpdate (nextProps) {
    if (this.props.petPassportStatusHasChanged !== nextProps.petPassportStatusHasChanged) {
      let gridId = this.props.selectedGridId
      GridManager.reloadGridData(gridId)
      let altGridId = null
      altGridId = gridId.slice(0, -1)
      altGridId = `${altGridId}2`
      GridManager.reloadGridData(altGridId)
      store.dispatch({ type: 'CHANGE_PET_PASSPORT_STATUS_RESET' })
      ComponentManager.setStateForComponent(nextProps.selectedGridId)
      ComponentManager.setStateForComponent(nextProps.selectedGridId, 'selectedIndexes', [])
      ComponentManager.setStateForComponent(nextProps.selectedGridId, null, {
        selectedIndexes: []
      })
      store.dispatch({ type: 'UPDATE_SELECTED_GRID_ROWS', payload: [[], gridId] })
    }
  }

  changePetPassportStatusPrompt (status) {
    status = capitalizeFirstLetter(status)

    if (isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.change_pet_passport_status_prompt`,
            defaultMessage: `${config.labelBasePath}.actions.change_pet_passport_status_prompt`
          }) + ' ' + '"' + status + '"' + ' ? ',
          null,
          () => this.changePetPassportStatus(status),
          () => this.setState({
            alert: alertUser(false, 'info', '')
          }),
          true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.change`,
            defaultMessage: `${config.labelBasePath}.actions.change`
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

  changePetPassportStatus = async (status) => {
    const objectArray = this.props.selectedGridRows
    const tableName = 'HEALTH_PASSPORT'
    const actionType = 'UPDATE_STATUS'

    const paramsArray = [{
      MASS_PARAM_TBL_NAME: tableName,
      MASS_PARAM_ACTION: actionType,
      MASS_PARAM_SUBACTION: status.toUpperCase()
    }]

    const verbPath = config.svConfig.triglavRestVerbs.MASS_OBJECT_HANDLER
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${this.props.session}`

    try {
      const res = await axios({
        method: 'post',
        url: url,
        data: JSON.stringify({ objectArray, paramsArray })
      })

      if (res.data.includes('error')) {
        store.dispatch({ type: 'CHANGE_PET_PASSPORT_STATUS_REJECTED', payload: res.data })
      } else if (res.data.includes('success')) {
        store.dispatch({ type: 'CHANGE_PET_PASSPORT_STATUS_FULFILLED', payload: res.data })
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
          <li id='change_pet_passport_status' key='change_pet_passport_status' className={style.li_item}>
            <div className={style.imgTxtHolder}>
              <span id='activity_text' style={{ marginTop: '2px' }} className={style.actionText}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.change_pet_passport_status`,
                  defaultMessage: `${config.labelBasePath}.actions.change_pet_passport_status`
                })}
              </span>
              <img id='activity_img' className={style.actionImg}
                src='/naits/img/massActionsIcons/change_status.png' />
            </div>
            <ul
              id='change_pet_passport_status_sublist'
              key='change_pet_passport_status_sublist'
            >
              <li id='sublist_item_0'
                key='sublist_item_0'
                {... { onClick: () => this.changePetPassportStatusPrompt('lost') }}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.lost`,
                  defaultMessage: `${config.labelBasePath}.actions.lost`
                })}
              </li>
              <li id='sublist_item_1'
                key='sublist_item_1'
                {... { onClick: () => this.changePetPassportStatusPrompt('damaged') }}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.damaged`,
                  defaultMessage: `${config.labelBasePath}.actions.damaged`
                })}
              </li>
              <li id='sublist_item_2'
                key='sublist_item_2'
                {... { onClick: () => this.changePetPassportStatusPrompt('invalid') }}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.actions.invalid`,
                  defaultMessage: `${config.labelBasePath}.actions.invalid`
                })}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    )
  }
}

ChangePetPassportStatus.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  selectedGridRows: state.selectedGridRows.selectedGridRows,
  selectedGridId: state.selectedGridRows.gridId,
  petPassportStatusHasChanged: state.petPassportStatusChange.petPassportStatusHasChanged
})

export default connect(mapStateToProps)(ChangePetPassportStatus)
