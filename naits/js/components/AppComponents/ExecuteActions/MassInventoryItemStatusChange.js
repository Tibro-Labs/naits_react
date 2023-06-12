import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import { alertUser } from 'tibro-components'
import { store, updateSelectedRows } from 'tibro-redux'
import { ComponentManager, GridManager, Loading } from 'components/ComponentsIndex'
import * as config from 'config/config.js'
import { strcmp, isValidArray, formatAlertType } from 'functions/utils'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import consoleStyle from 'components/AppComponents/Functional/AdminConsole/AdminConsole.module.css'

class MassInventoryItemStatusChange extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      statuses: [],
      newStatus: ''
    }
  }

  componentDidMount () {
    this.getInvItemStatuses()
  }

  getInvItemStatuses = () => {
    const { session } = this.props
    const server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.GET_TABLE_WITH_LIKE_FILTER
    verbPath = verbPath.replace('%svSession', session)
    verbPath = verbPath.replace('%objectName', 'SVAROG_CODES')
    verbPath = verbPath.replace('%searchBy', 'PARENT_CODE_VALUE')
    verbPath = verbPath.replace('%searchForValue', 'TAG_STATUS')
    verbPath = verbPath.replace('%rowlimit', 10000)
    const url = `${server}${verbPath}`
    axios.get(url).then(res => {
      if (isValidArray(res.data, 1)) {
        let statuses = []
        res.data.forEach(status => {
          statuses.push({ name: status['SVAROG_CODES.LABEL_CODE'], value: status['SVAROG_CODES.CODE_VALUE'] })
        })
        this.setState({ statuses })
      }
    }).catch(err => {
      console.error(err)
    })
  }

  massInventoryItemStatusChangeAction = (selectedInventoryItems) => {
    const { session, selectedObject } = this.props
    const { newStatus } = this.state
    this.setState({ loading: true })
    const objectArray = selectedInventoryItems
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.MASS_INV_ITEM_STATUS_CHANGE
    const url = `${server}${verbPath}/${session}/${newStatus}`
    const reqConfig = { method: 'post', url, data: JSON.stringify({ objectArray }) }
    axios(reqConfig).then(res => {
      if (res.data) {
        this.setState({ loading: false })
        const resType = formatAlertType(res.data)
        alertUser(true, resType, this.context.intl.formatMessage({ id: res.data, defaultMessage: res.data }))
        if (strcmp(resType, 'success')) {
          this.setState({ newStatus: '' })
          store.dispatch(updateSelectedRows([], null))
          ComponentManager.setStateForComponent(selectedObject, 'selectedIndexes', [])
          GridManager.reloadGridData(selectedObject)
        }
      }
    }).catch(err => {
      console.error(err)
      this.setState({ loading: false })
      alertUser(true, 'error', err)
    })
  }

  disableOrEnableAlertBtn = () => {
    const newStatusDropdown = document.getElementById('newStatus')
    let newStatusDomValue
    if (newStatusDropdown) {
      newStatusDomValue = newStatusDropdown.value
    }

    const submitBtn = document.getElementsByClassName('swal-button swal-button--confirm')
    if ((strcmp(newStatusDomValue, ''))) {
      if (submitBtn) {
        submitBtn[0].setAttribute('disabled', '')
      }
    } else {
      if (submitBtn) {
        submitBtn[0].removeAttribute('disabled')
      }
    }
  }

  handleNewStatusSelection = e => {
    this.setState({ newStatus: e.target.value })
    this.disableOrEnableAlertBtn()
  }

  massInventoryItemStatusChangePrompt = () => {
    const { selectedGridRows, selectedObject } = this.props
    const { statuses } = this.state
    const promptLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.mass_inventory_status_change_prompt`,
      defaultMessage: `${config.labelBasePath}.alert.mass_inventory_status_change_prompt`
    })
    const yesLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.yes`,
      defaultMessage: `${config.labelBasePath}.main.yes`
    })
    const noLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.no`,
      defaultMessage: `${config.labelBasePath}.main.no`
    })

    if (!isValidArray(selectedGridRows, 1)) {
      alertUser(true, 'warning', this.context.intl.formatMessage({
        id: `${config.labelBasePath}.alert.empty_selection`,
        defaultMessage: `${config.labelBasePath}.alert.empty_selection`
      }))
    } else {
      let selectedInventoryItems = []
      selectedGridRows.forEach(row => selectedInventoryItems.push({ [`${selectedObject}.OBJECT_ID`]: row[`${selectedObject}.OBJECT_ID`] }))

      let wrapper = document.createElement('div')
      ReactDOM.render(
        <div style={{ marginLeft: '12px' }}>
          <label htmlFor='newStatus' style={{ padding: '0.9rem 2px' }}>
            {this.context.intl.formatMessage(
              {
                id: config.labelBasePath + '.form_labels.tag_status',
                defaultMessage: config.labelBasePath + '.form_labels.tag_status'
              }
            )}:
          </label>
          <select
            name='newStatus'
            id='newStatus'
            className={consoleStyle.campaignDropdown}
            style={{ marginLeft: '1rem' }}
            onClick={this.handleNewStatusSelection}
          >
            <option
              id='blankPlaceholder'
              key='blankPlaceholder'
              value={''}
              disabled selected hidden
            >
              {this.context.intl.formatMessage(
                {
                  id: config.labelBasePath + '.main.select_new_status',
                  defaultMessage: config.labelBasePath + '.main.select_new_status'
                }
              )}
            </option>
            {statuses.map(status => {
              return <option key={status.value} value={status.value}>
                {status.name}
              </option>
            })}
          </select>
        </div>,
        wrapper
      )
      alertUser(
        true, 'info', promptLabel, '', () => this.massInventoryItemStatusChangeAction(selectedInventoryItems), () => this.setState({ newStatus: '' }),
        true, yesLabel, noLabel, true, null, true, wrapper
      )

      const submitBtn = document.getElementsByClassName('swal-button swal-button--confirm')
      if (submitBtn) {
        submitBtn[0].setAttribute('disabled', '')
      }
    }
  }

  render () {
    const { loading } = this.state

    return (
      <React.Fragment>
        <div
          id='mass_inv_item_status_change_container'
          className={styles.container}
          style={{ cursor: 'pointer', marginRight: '7px', color: 'white', width: '180px' }}
          onClick={this.massInventoryItemStatusChangePrompt}
        >
          <p style={{ marginLeft: '13px', marginTop: '8px', width: '99px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.mass_inv_item_status_change`,
              defaultMessage: `${config.labelBasePath}.main.mass_inv_item_status_change`
            })}
          </p>
          <div id='mass_inv_item_status_change' className={styles['gauge-container']} style={{ marginRight: '-18px', width: '75px' }}>
            <img
              id='mass_inv_item_status_change_img' className={style.actionImg} style={{ height: '45px', marginTop: '7%' }}
              src='/naits/img/massActionsIcons/changeStatus.png'
            />
          </div>
        </div>
        {loading && <Loading />}
      </React.Fragment>
    )
  }
}

MassInventoryItemStatusChange.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  session: state.security.svSession,
  selectedGridRows: state.selectedGridRows.selectedGridRows
})

export default connect(mapStateToProps)(MassInventoryItemStatusChange)
