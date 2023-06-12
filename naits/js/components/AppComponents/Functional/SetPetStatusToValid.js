import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import { alertUser } from 'tibro-components'
import { Loading } from 'components/ComponentsIndex'
import * as config from 'config/config.js'
import { formatAlertType, strcmp } from 'functions/utils'
import style from '../ExecuteActions/ExecuteActionOnSelectedRows.module.css'

class SetPetStatusToValid extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      petStatus: ''
    }
  }

  componentDidMount () {
    this.getPetStatus()
  }

  getPetStatus = () => {
    let petStatus = 'null'
    this.props.componentStack.map(grid => {
      if (strcmp(grid.gridType, this.props.menuType)) {
        petStatus = grid.row[this.props.menuType + '.STATUS']
      }
    })
    this.setState({ petStatus })
  }

  setStatusToValid = () => {
    this.setState({ loading: true })
    const { session, objectId, menuType } = this.props
    const data = { objectId, tableName: menuType }
    const verbPath = config.svConfig.triglavRestVerbs.CHANGE_STATUS
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/VALID`
    const reqConfig = { method: 'post', url, data: JSON.stringify(data), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    axios(reqConfig).then(res => {
      this.setState({ loading: false })
      if (res.data) {
        const resType = formatAlertType(res.data)
        const title = this.context.intl.formatMessage({ id: res.data, defaultMessage: res.data })
        alertUser(true, resType, title)
        if (strcmp(resType, 'success')) {
          const refreshDataBtn = document.getElementById('refresh_data')
          if (refreshDataBtn) {
            refreshDataBtn.click()
          }
          this.setState({ petStatus: 'VALID' })
        }
      }
    }).catch(err => {
      console.error(err)
      this.setState({ loading: false })
      alertUser(true, 'error', err)
    })
  }

  setStatusToValidPrompt = () => {
    const promptLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.alert.set_pet_status_to_valid_prompt`,
      defaultMessage: `${config.labelBasePath}.alert.set_pet_status_to_valid_prompt`
    })
    const yesLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.yes`,
      defaultMessage: `${config.labelBasePath}.main.yes`
    })
    const noLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.no`,
      defaultMessage: `${config.labelBasePath}.main.no`
    })

    alertUser(true, 'warning', promptLabel, '', () => this.setStatusToValid(), () => { }, true, yesLabel, noLabel)
  }

  render () {
    const { petStatus } = this.state
    let component = null
    if (strcmp(petStatus, 'INACTIVE')) {
      component = (
        <div
          id='set_pet_status_to_valid'
          className={style.menuActivator}
          style={{ width: '200px' }}
          onClick={this.setStatusToValidPrompt}
        >
          <span id='set_pet_status_to_valid_text' className={style.actionText} style={{ width: '120px', marginLeft: '5px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.actions.set_pet_status_to_valid`,
              defaultMessage: `${config.labelBasePath}.actions.set_pet_status_to_valid`
            })}
          </span>
          <img id='move_img' className={style.actionImg}
            src='/naits/img/massActionsIcons/undo.png' />
        </div>
      )
    }

    return (
      <React.Fragment>
        {this.state.loading && <Loading />}
        {component}
      </React.Fragment>
    )
  }
}

SetPetStatusToValid.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(SetPetStatusToValid)
