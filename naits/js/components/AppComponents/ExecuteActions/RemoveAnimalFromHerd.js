import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import { alertUser } from 'tibro-components'
import { updateSelectedRows } from 'tibro-redux'
import { ComponentManager, GridManager, Loading } from 'components/ComponentsIndex'
import * as config from 'config/config.js'
import { strcmp, isValidArray, formatAlertType } from 'functions/utils'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class RemoveAnimalFromHerd extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  onClick = () => {
    const { selectedGridRows } = this.props
    if (!isValidArray(selectedGridRows, 1)) {
      alertUser(true, 'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.alert.empty_selection`,
          defaultMessage: `${config.labelBasePath}.alert.empty_selection`
        })
      )
    } else {
      alertUser(true, 'warning',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.remove_animal_from_herd_prompt`,
          defaultMessage: `${config.labelBasePath}.main.remove_animal_from_herd_prompt`
        }), null, () => this.removeAnimalsFromHerd(selectedGridRows), () => { }, true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.yes`,
          defaultMessage: `${config.labelBasePath}.main.yes`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.no`,
          defaultMessage: `${config.labelBasePath}.main.no`
        })
      )
    }
  }

  removeAnimalsFromHerd = objectArray => {
    const { session, selectedObject, herdObjId, gridId } = this.props
    this.setState({ loading: true })
    const actionType = 'HERD_ACTIONS'
    const actionName = 'REMOVE_ANIMAL_FROM_HERD'
    const paramsArray = [{
      MASS_PARAM_TBL_NAME: selectedObject,
      MASS_PARAM_ACTION: actionType,
      MASS_PARAM_SUBACTION: actionName,
      MASS_PARAM_HERD_OBJ_ID: herdObjId
    }]
    const verbPath = config.svConfig.triglavRestVerbs.REMOVE_ANIMAL_FROM_HERD
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}`
    const reqConfig = { method: 'post', url, data: JSON.stringify({ objectArray, paramsArray }) }
    axios(reqConfig).then(res => {
      if (res.data) {
        this.setState({ loading: false })
        const resType = formatAlertType(res.data)
        alertUser(true, resType, this.context.intl.formatMessage({ id: res.data, defaultMessage: res.data }))
        if (strcmp(resType, 'success')) {
          this.props.updateSelectedRows([], null)
          ComponentManager.setStateForComponent(gridId, 'selectedIndexes', [])
          GridManager.reloadGridData(gridId)
        }
      }
    }).catch(err => {
      console.error(err)
      alertUser(true, 'error', err)
      this.setState({ loading: false })
    })
  }

  render () {
    const btnId = 'remove_animal_from_herd'
    return <React.Fragment>
      <button id={btnId} onClick={this.onClick} className={styles.container} style={{ cursor: 'pointer', marginRight: '7px', color: 'white', width: '165px' }}>
        <span id='remove_animal_from_herd_description' className={style.actionText} style={{ marginLeft: '3%', marginTop: '1px', width: '80px' }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.remove_animal_from_herd`,
            defaultMessage: `${config.labelBasePath}.main.remove_animal_from_herd`
          })}
        </span>
        <img id='remove_animal_from_herd_img' src='/naits/img/massActionsIcons/x-button.png' />
      </button>
      {this.state.loading && <Loading />}
    </React.Fragment>
  }
}

RemoveAnimalFromHerd.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  selectedGridRows: state.selectedGridRows.selectedGridRows
})

const mapDispatchToProps = dispatch => ({
  updateSelectedRows: (...params) => {
    dispatch(updateSelectedRows(...params))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(RemoveAnimalFromHerd)
