import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import * as config from 'config/config.js'
import { GridManager, ComponentManager, Loading } from 'components/ComponentsIndex'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import { formatAlertType, isValidArray } from 'functions/utils'

class ReturnPetToSourceHolding extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      loading: false
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

  returnPetPrompt = () => {
    if (isValidArray(this.props.selectedGridRows, 1)) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.return_pet_to_source_holding_prompt`,
            defaultMessage: `${config.labelBasePath}.actions.return_pet_to_source_holding_prompt`
          }) + ' ' + '?',
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
    this.setState({ loading: true })
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
        ),
        loading: false
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
        ),
        loading: false
      })
    }
  }

  close = () => {
    this.setState({ alert: false })
  }

  render () {
    return (
      <div
        id='collect_pets_container'
        className={styles.container}
        style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
        onClick={this.returnPetPrompt}
      >
        <p style={{ marginTop: '9px', marginLeft: '7px' }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.collect_pets`,
            defaultMessage: `${config.labelBasePath}.main.collect_pets`
          })}
        </p>
        <div id='collect_pets' className={styles['gauge-container']} style={{ width: '59px' }}>
          <img
            id='change_status_img' className={style.actionImg}
            style={{ height: '45px', marginTop: '7%', marginLeft: '14px' }}
            src='/naits/img/massActionsIcons/undo.png'
          />
        </div>
        {this.state.loading && <Loading />}
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
