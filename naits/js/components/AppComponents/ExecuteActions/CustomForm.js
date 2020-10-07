import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { SearchStyles } from 'containers/ContainersIndex'
import * as config from 'config/config'
import axios from 'axios'
import { isValidArray } from 'functions/utils'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'

class CustomForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      codeList: [],
      movementReasonList: [],
      searchGrid: 'HOLDING'
    }
  }

  componentDidMount () {
    if (this.props.attachHandlers && this.props.attachHandlers instanceof Function) {
      this.props.attachHandlers()
    }
    let restUrl = config.svConfig.restSvcBaseUrl +
      config.svConfig.triglavRestVerbs['GET_TABLE_WITH_LIKE_FILTER']
    restUrl = restUrl.replace('%svSession', this.props.session)
    restUrl = restUrl.replace('%objectName', 'SVAROG_CODES')
    restUrl = restUrl.replace('%searchBy', 'PARENT_CODE_VALUE')
    restUrl = restUrl.replace('%searchForValue', 'MOVEMENT_TRANSPORT_TYPE')
    restUrl = restUrl.replace('%rowlimit', 10000)
    axios.get(restUrl).then((response) => {
      const array = response.data
      let data = []
      if (isValidArray(array, 1)) {
        for (let i = 0; i < array.length; i++) {
          data.push(
            <option
              key={array[i]['SVAROG_CODES.CODE_VALUE']}
              id={array[i]['SVAROG_CODES.CODE_VALUE']}
              value={array[i]['SVAROG_CODES.CODE_VALUE']}
            >
              {array[i]['SVAROG_CODES.LABEL_CODE']}
            </option>
          )
        }
        this.setState({ codeList: data })
      }
    }).catch((error) => {
      console.log(error)
    })
    let server = config.svConfig.restSvcBaseUrl +
      config.svConfig.triglavRestVerbs['GET_TABLE_WITH_LIKE_FILTER']
    server = server.replace('%svSession', this.props.session)
    server = server.replace('%objectName', 'SVAROG_CODES')
    server = server.replace('%searchBy', 'PARENT_CODE_VALUE')
    server = server.replace('%searchForValue', 'ADDITIONAL_MOVEMENT_REASON')
    server = server.replace('%rowlimit', 10000)
    axios.get(server).then((response) => {
      const array = response.data
      let data = []
      if (isValidArray(array, 1)) {
        for (let i = 0; i < array.length; i++) {
          data.push(
            <option
              key={array[i]['SVAROG_CODES.CODE_VALUE']}
              id={array[i]['SVAROG_CODES.CODE_VALUE']}
              value={array[i]['SVAROG_CODES.CODE_VALUE']}
            >
              {array[i]['SVAROG_CODES.LABEL_CODE']}
            </option>
          )
        }
        this.setState({ movementReasonList: data })
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  render () {
    return (
      <div id='popUpContainer2' className={style.popUpContainer}
        style={{ marginTop: '1rem' }}>
        <select
          id='transportType'
          className={'form-control ' + SearchStyles['simple-input']}>
          <option id='default' value='' disabled selected>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.transport_type`,
              defaultMessage: `${config.labelBasePath}.main.transport_type`
            })}
          </option>
          {this.state.codeList}
        </select>
        <input
          id='transporterLicense'
          placeholder={this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.transporter_license`,
            defaultMessage: `${config.labelBasePath}.main.transporter_license`
          })}
          className={'form-control ' + SearchStyles['simple-input']}
        />
        <select
          id='animalMvmReason'
          className={'form-control ' + SearchStyles['simple-input']}>
          <option id='default' value='' disabled selected>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.animalMvmReason`,
              defaultMessage: `${config.labelBasePath}.main.animalMvmReason`
            })}
          </option>
          {this.state.movementReasonList}
        </select>
        {this.props.children}
      </div>
    )
  }
}

CustomForm.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(CustomForm)
