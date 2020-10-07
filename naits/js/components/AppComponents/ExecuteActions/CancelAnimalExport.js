import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import * as config from 'config/config.js'
import style from './ExecuteActionOnSelectedRows.module.css'
import { alertUser } from 'tibro-components'
import { GridManager } from 'components/ComponentsIndex'
import { formatAlertType } from 'functions/utils'

class CancelAnimalExport extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null
    }
  }

  exportCertifiedAnimals = () => {
    const { svSession, objectId, showGrid, linkName } = this.props
    let server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs
    const restUrl = `${server}${verbPath.CANCEL_EXPORT_CERTIFICATE}/${svSession}/${objectId}`
    axios.get(restUrl).then((response) => {
      this.setState({
        alert: alertUser(
          true,
          formatAlertType(response.data),
          this.context.intl.formatMessage({
            id: response.data,
            defaultMessage: response.data
          }) || ' ',
          null,
          () => {
            this.setState({ alert: alertUser(false, 'info', '') })
            const gridId = linkName ? `${showGrid}_${objectId}_${linkName}` : `${showGrid}_${objectId}`
            GridManager.reloadGridData(gridId)
          }
        )
      })
    })
  }

  initiateAction = () => {
    function prompt (component, onConfirmCallback) {
      component.setState({
        alert: alertUser(
          true,
          'warning',
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.cancel_export_certificate`,
            defaultMessage: `${config.labelBasePath}.actions.cancel_export_certificate`
          }) + ' ?',
          null,
          onConfirmCallback,
          () => component.setState({alert: alertUser(false, 'info', '')}),
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
    prompt(this, this.exportCertifiedAnimals)
  }

  render () {
    const { objectId } = this.props
    let component = null
    if (objectId) {
      component = <div
        id='cancel_export_certificate'
        className={style.menuActivator}
        onClick={this.initiateAction}>
        {this.state.alert}
        <span id='selected_object_text' className={style.actionText}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.cancel_export_certificate`,
            defaultMessage: `${config.labelBasePath}.actions.cancel_export_certificate`
          })}
        </span>
        <img id='move_img' className={style.actionImg}
          src='/naits/img/massActionsIcons/undo.png' />
      </div>
    }
    return component
  }
}

CancelAnimalExport.contextTypes = {
  intl: PropTypes.object.isRequired
}

CancelAnimalExport.propTypes = {
  objectId: PropTypes.number.isRequired,
  showGrid: PropTypes.string.isRequired,
  linkName: PropTypes.string
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession
})

export default connect(mapStateToProps)(CancelAnimalExport)
