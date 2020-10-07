import React from 'react'
import PropTypes from 'prop-types'
import { alertUser } from 'tibro-components'
import { dataToRedux } from 'tibro-redux'
import createHashHistory from 'history/createHashHistory'
import validateInput from 'components/validateInput.js'
import Loading from 'components/Loading'
import { TextFieldGroup } from 'containers/ContainersIndex'
import registrationStyle from './RegistrationFormStyle.module.css'
import { getLabels } from 'client.js'
import { formatAlertType } from 'functions/utils'
import md5 from 'md5'
import * as config from 'config/config.js'

class ValidateUser extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      svToken: new URLSearchParams(this.props.location.search).get('svToken'),
      UID: new URLSearchParams(this.props.location.search).get('UID'),
      action: new URLSearchParams(this.props.location.search).get('action'),
      username: new URLSearchParams(this.props.location.search).get('USER_NAME'),
      pin_vat: '',
      password: '',
      repeat_password: '',
      disableButton: false,
      errors: {},
      alert: undefined,
      loading: false
    }
    this.hashHistory = createHashHistory()
  }

  isValid = () => {
    const { errors, isValid } = validateInput(this.state, 'RECOVER_PASS')
    if (!isValid) {
      this.setState({ errors })
    }
    return isValid
  }
  onSubmit = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    if (this.isValid()) {
      dataToRedux(
        (response) => {
          const responseType = formatAlertType(response)
          const msg = this.context.intl.formatMessage({ id: response, defaultMessage: response })
          this.setState({
            alert: alertUser(
              true, responseType, msg, null, () => this.setState({ username: '', alert: alertUser(false) }, this.hashHistory.push('/login'))
            ),
            loading: false
          })
        },
        'security', 'lastError', 'MAIN_RECOVERMAIL', this.state.UID, this.state.username, this.state.pin_vat, md5(this.state.password)
      )
    }
  }
  onChange = (e) => {
    // dynamically change component and field state, depending on user input
    this.setState({ [e.target.name]: e.target.value })
    const targetName = e.target.name
    const errObj = this.state.errors
    delete errObj[targetName]
    this.setState({ errors: errObj })
  }
  trimAllWhiteSpacesLeftAndRight = (e) => {
    // trims all white spaces letf and right from string and saves state
    const valueToTrim = e.target.value
    const trimmedValue = valueToTrim.trim()
    e.target.value = trimmedValue
    this.onChange(e)
  }

  componentDidMount () {
    if (this.state.svToken) {
      dataToRedux(null, 'security', 'lastError', undefined)
      if (this.state.action === 'ACTIVATE_USER') {
        dataToRedux(
          (response) => {
            if (response.match(/^success/)) {
              const msg = this.context.intl.formatMessage({ id: `${config.labelBasePath}.register.success`, defaultMessage: `${config.labelBasePath}.register.success` })
              this.setState({ alert: alertUser(true, 'success', msg, null, () => this.setState({ alert: alertUser(false) }, this.hashHistory.push('/login'))) })
            } else if (response.match(/^error/)) {
              const regErrorText = this.context.intl.formatMessage({ id: `${config.labelBasePath}.register.error_text`, defaultMessage: `${config.labelBasePath}.register.error_text` })
              this.setState({ alert: alertUser(true, 'error', regErrorText, null, () => this.setState({ username: '', alert: alertUser(false) }, this.hashHistory.push('/login'))) })
            }
          },
          'security', 'lastError', 'MAIN_ACTIVATE', this.state.svToken
        )
      }
    }
  }

  render () {
    const { alert, action, errors, loading } = this.state
    const labels = this.context.intl
    const onChange = this.onChange
    const trimAllWhiteSpacesLeftAndRight = this.trimAllWhiteSpacesLeftAndRight
    const state = this.state

    const showFields = (element, readOnly) => {
      const formFields = (<TextFieldGroup
        readOnly={readOnly}
        key={`Reg${element}`}
        field={element}
        value={state[element]}
        placeholder={labels.formatMessage({ id: `${config.labelBasePath}.register.${[element]}`, defaultMessage: `${config.labelBasePath}.register.${element}` })}
        type={element.match(/^repeat_password|old_password/) ? 'password' : element}
        id={element}
        className={registrationStyle[element]}
        label={element}
        onChange={onChange}
        error={errors[element]}
        onBlur={trimAllWhiteSpacesLeftAndRight}
      />)
      return formFields
    }

    return (
      <div>
        {loading && <Loading />}
        {alert}
        {action === 'PASS_RECOVERY' ? <div id='mainPasswordRecoverComp' className={`${registrationStyle.mainRegisterComp} ${registrationStyle.fadeIn}`}>
          <div className={`text-right ${registrationStyle.langPaddingRight}`}>
            <button className={registrationStyle.language} onClick={() => getLabels(() => this.setState({ lang: 'ka-GE' }, this.props.toggleLangImgs('ka-GE')), 'ka-GE')}>KA</button>
            <button className={registrationStyle.language} onClick={() => getLabels(() => this.setState({ lang: 'en' }, this.props.toggleLangImgs('en')), 'en-US')}>EN</button>
          </div>
          <form className={registrationStyle.topForm}>
            <h2 className={registrationStyle.h2}>
              <span className={registrationStyle.imgNaits}>
                {this.state.lang === 'ka-GE' ? <img src='img/login/georgia/naitsge_trans_grey.png' /> : <img src='img/login/georgia/naitsen_trans_grey.png' />}
              </span>
            </h2>
          </form>
          <form id='submit_form' className={registrationStyle.bottomForm} action=''>
            <div className={`form-inline ${registrationStyle.form1}`}>
              {showFields('username', true)}
              {showFields('pin_vat')}
            </div>
            <div className={`form-inline ${registrationStyle.form1}`}>
              {showFields('password')}
              {showFields('repeat_password')}
            </div>
            <button id='register_submit' type='submit' disabled={this.state.disableButton} className={registrationStyle.btn} onClick={this.onSubmit}>
              <span>
                {labels.formatMessage({ id: `${config.labelBasePath}.login.reset_password`, defaultMessage: `${config.labelBasePath}.login.reset_password` })}
              </span>
            </button>
          </form>
          <div className={registrationStyle.stripes} >
            <div style={{ flex: '0 1 46%' }}>
              <a href='/naits/#/register'>
                {labels.formatMessage({ id: `${config.labelBasePath}.login.sign_up`, defaultMessage: `${config.labelBasePath}.login.sign_up` })}
              </a>
            </div>
            <div style={{ flex: '0 1 46%' }}>
              <a href='/naits/#/login'>
                {labels.formatMessage({ id: `${config.labelBasePath}.register.login`, defaultMessage: `${config.labelBasePath}.register.login` })}
              </a>
            </div>
          </div>

        </div> : null}
      </div>
    )
  }
}

ValidateUser.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default ValidateUser
