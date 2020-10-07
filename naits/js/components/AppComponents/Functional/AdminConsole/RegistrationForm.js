import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import md5 from 'md5'
import * as config from 'config/config.js'
import { alertUser } from 'tibro-components'
import { TextFieldGroup } from 'containers/ContainersIndex'
import { Loading, GridManager } from 'components/ComponentsIndex'
import validate from './utils/validate'
import { generateUserGroupsDropdown } from './utils/generateDropdownOptions'
import consoleStyle from './AdminConsole.module.css'
import { gaEventTracker } from 'functions/utils'

class RegistrationForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userName: '',
      password: '',
      repPassword: '',
      email: '',
      pinVat: '',
      firstName: '',
      lastName: '',
      userGroup: 'USERS',
      errors: {},
      alert: undefined,
      dropdownData: null
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onChangeDdl = this.onChangeDdl.bind(this)
    this.trimAllWhiteSpacesLeftAndRight = this.trimAllWhiteSpacesLeftAndRight.bind(this)
  }

  componentDidMount () {
    this.setState({
      dropdownData: generateUserGroupsDropdown(
        this.props.admConsoleRequests.userGroups, 'USERS'
      )
    })
  }

  isValid () {
    const { errors, isValid } = validate(this.state, 'REGISTER')
    if (!isValid) {
      this.setState({ errors })
    }
    return isValid
  }

  onSubmit (event) {
    event.preventDefault()
    const dataToValidate = {
      'password': this.state.password,
      'repPassword': this.state.repPassword,
      'email': this.state.email,
      'pinVat': this.state.pinVat,
      'firstName': this.state.firstName,
      'lastName': this.state.lastName,
      'userName': this.state.userName
    }
    const validatedData = validate(dataToValidate, 'REGISTER')
    if (validatedData.isValid) {
      this.setState({ loading: true })
      const data = {
        'USER.PASSWORD': md5(this.state.password),
        'USER.EMAIL': this.state.email,
        'USER.PIN': this.state.pinVat,
        'USER.FIRST_NAME': this.state.firstName,
        'USER.LAST_NAME': this.state.lastName,
        'USER.USER_GROUP': this.state.userGroup,
        'USER.USER_NAME': this.state.userName
      }
      let server = config.svConfig.restSvcBaseUrl
      let wsVerb = config.svConfig.triglavRestVerbs.ADMIN_REGISTER_USER
      let restUrl = `${server}${wsVerb}/${this.props.svSession}`

      axios({
        method: 'post',
        url: restUrl,
        data: JSON.stringify({ data }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then((response) => {
        let type = 'info'
        if (response.data.indexOf('naits.success') > -1) {
          type = 'success'
        } else if (response.data.indexOf('naits.error') > -1) {
          type = 'error'
        } else if (response.data.indexOf('naits.warning') > -1) {
          type = 'warning'
        }
        this.setState({
          loading: false,
          alert: alertUser(true, type,
            this.context.intl.formatMessage({
              id: response.data,
              defaultMessage: response.data
            }), null, this.closeAlert)
        })
      }).catch((error) => {
        this.setState({
          loading: false,
          alert: alertUser(true, 'error', error, null, this.closeAlert)
        })
      })
    } else {
      this.setState({ errors: validatedData.errors })
    }
  }

  closeAlert = () => {
    this.setState({ alert: alertUser(false, 'info', '') })
    GridManager.reloadGridData('SVAROG_USERS')
  }

  onChange (e) {
    // dynamically change component and field state, depending on user input
    this.setState({ [e.target.id]: e.target.value })
    const targetName = e.target.id
    const errObj = this.state.errors
    delete errObj[targetName]
    this.setState({ errors: errObj })
  }

  onChangeDdl (event) {
    const element = document.getElementById(event.target.id)
    const selectedOption = element.options[element.selectedIndex].text
    this.setState({ [event.target.id]: selectedOption })
  }

  trimAllWhiteSpacesLeftAndRight (e) {
    // trims all white spaces letf and right from string and saves state
    const valueToTrim = e.target.value
    const trimmedValue = valueToTrim.trim()
    e.target.value = trimmedValue
    this.onChange(e)
  }

  render () {
    const { alert, errors, loading } = this.state

    return (
      <div id='form_modal' className='customModal' style={{ display: 'block' }}>
        <div id='formContainer' className={consoleStyle.formContainer}>
          {alert}
          {loading && <Loading />}
          <form id='registerUser' className={consoleStyle.admConsoleForm}>
            <div className={'form-group' + ' ' + consoleStyle.formGroupInline}>
              <label htmlFor='firstName'>
                {this.context.intl.formatMessage({
                  id: config.labelBasePath + '.register.first_name',
                  defaultMessage: config.labelBasePath + '.register.first_name'
                })}
              </label>
              <TextFieldGroup
                id='firstName'
                error={errors.firstName}
                className='form-control'
                onChange={this.onChange}
                onBlur={this.trimAllWhiteSpacesLeftAndRight}
              />
            </div>
            <div className={'form-group' + ' ' + consoleStyle.formGroupInline}>
              <label htmlFor='lastName'>
                {this.context.intl.formatMessage({
                  id: config.labelBasePath + '.register.last_name',
                  defaultMessage: config.labelBasePath + '.register.last_name'
                })}
              </label>
              <TextFieldGroup
                id='lastName'
                error={errors.lastName}
                className='form-control'
                onChange={this.onChange}
                onBlur={this.trimAllWhiteSpacesLeftAndRight}
              />
            </div>

            <div className={'form-group' + ' ' + consoleStyle.formGroupInline}>
              <label htmlFor='userName'>
                {this.context.intl.formatMessage({
                  id: config.labelBasePath + '.login.user_name',
                  defaultMessage: config.labelBasePath + '.login.user_name'
                })}
              </label>
              <TextFieldGroup
                id='userName'
                error={errors.userName}
                className='form-control'
                onChange={this.onChange}
                onBlur={this.trimAllWhiteSpacesLeftAndRight}
              />
            </div>

            <div className={'form-group' + ' ' + consoleStyle.formGroupInline}>
              <label htmlFor='email'>
                {this.context.intl.formatMessage({
                  id: config.labelBasePath + '.register.e_mail',
                  defaultMessage: config.labelBasePath + '.register.e_mail'
                })}
              </label>
              <TextFieldGroup
                id='email'
                error={errors.email}
                type='email'
                className='form-control'
                onChange={this.onChange}
                onBlur={this.trimAllWhiteSpacesLeftAndRight}
              />
            </div>
            <div className={'form-group' + ' ' + consoleStyle.formGroupInline}>
              <label htmlFor='pinVat'>
                {this.context.intl.formatMessage({
                  id: config.labelBasePath + '.register.pin_vat',
                  defaultMessage: config.labelBasePath + '.register.pin_vat'
                })}
              </label>
              <TextFieldGroup
                id='pinVat'
                error={errors.pinVat}
                className='form-control'
                onChange={this.onChange}
                onBlur={this.trimAllWhiteSpacesLeftAndRight}
              />
            </div>
            <div className={'form-group' + ' ' + consoleStyle.formGroupInline}>
              <label htmlFor='password'>
                {this.context.intl.formatMessage({
                  id: config.labelBasePath + '.register.password',
                  defaultMessage: config.labelBasePath + '.register.password'
                })}
              </label>
              <TextFieldGroup
                id='password'
                error={errors.password}
                type='password'
                className='form-control'
                onChange={this.onChange}
                onBlur={this.trimAllWhiteSpacesLeftAndRight}
              />
            </div>
            <div className={'form-group' + ' ' + consoleStyle.formGroupInline}>
              <label htmlFor='repPassword'>
                {this.context.intl.formatMessage({
                  id: config.labelBasePath + '.register.repeat_password',
                  defaultMessage: config.labelBasePath + '.register.repeat_password'
                })}
              </label>
              <TextFieldGroup
                id='repPassword'
                error={errors.repPassword}
                type='password'
                className='form-control'
                onChange={this.onChange}
                onBlur={this.trimAllWhiteSpacesLeftAndRight}
              />
            </div>
            <div className={'form-group' + ' ' + consoleStyle.formGroupInline}>
              <label htmlFor='userGroup' style={{ marginTop: '1%' }}>
                {this.context.intl.formatMessage({
                  id: config.labelBasePath + '.main.user_groups',
                  defaultMessage: config.labelBasePath + '.main.user_groups'
                })}
              </label>
              <div className='form-group'>
                <select
                  id='userGroup'
                  error={errors.userGroup}
                  className='form-control'
                  onChange={this.onChangeDdl}
                  disabled
                >
                  {this.state.dropdownData}
                </select>
              </div>
            </div>
            <button
              id='submitInfo'
              className={'btn ' + consoleStyle.submitButton}
              onClick={e => {
                this.onSubmit(e)
                gaEventTracker(
                  'REGISTER',
                  'Clicked the Submit button for registering a new user in the admin console',
                  `ADMIN_CONSOLE | ${config.version} (${config.currentEnv})`
                )
              }}
            >
              {this.context.intl.formatMessage({
                id: config.labelBasePath + '.register.register',
                defaultMessage: config.labelBasePath + '.register.register'
              })}
            </button>
          </form>
        </div>
      </div>
    )
  }
}

RegistrationForm.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  admConsoleRequests: state.admConsoleRequests
})

export default connect(mapStateToProps)(RegistrationForm)
