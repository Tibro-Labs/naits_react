import React from 'react'
import PropTypes from 'prop-types'
import { TextFieldGroup } from 'containers/ContainersIndex'
import registrationStyle from './RegistrationFormStyle.module.css'
import validateInput from 'components/validateInput.js'
import Loading from 'components/Loading'
import { alertUser } from 'tibro-components'
import { dataToRedux } from 'tibro-redux'
import createHashHistory from 'history/createHashHistory'
import { connect } from 'react-redux'
import * as config from 'config/config.js'
import { formatAlertType } from 'functions/utils'

class PasswordReset extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      errors: {},
      alert: undefined,
      disableButton: false,
      loading: false
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.trimAllWhiteSpacesLeftAndRight = this.trimAllWhiteSpacesLeftAndRight.bind(this)
    this.hashHistory = createHashHistory()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.lastError instanceof Error) {
      const regErrorText = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.register.error_text`,
        defaultMessage: `${config.labelBasePath}.register.error_text`
      })
      this.setState({
        alert: alertUser(
          true, 'error', regErrorText, null,
          () => this.setState({ username: '', alert: alertUser(false) }, this.setState({ disableButton: false, loading: false }))
        )
      })
    }
  }

  /* validator for login forms - client side f.r */
  isValid () {
    const { errors, isValid } = validateInput(this.state, 'PASSWORD_RESET')
    if (!isValid) {
      this.setState({ errors })
    }
    return isValid
  }

  onSubmit (e) {
    e.preventDefault()
    if (this.isValid()) {
      // purge redux state of any unneeded errors
      dataToRedux(null, 'security', 'lastError', undefined)
      // main login dispatch, first argument is a callback
      this.setState({ disableButton: true, loading: true })
      dataToRedux(
        (response) => {
          const responseType = formatAlertType(response)
          const msg = this.context.intl.formatMessage({ id: response, defaultMessage: response })
          this.setState({
            alert: alertUser(
              true, responseType, msg, null, () => this.setState({ alert: alertUser(false) }, this.hashHistory.push('/login'))
            ),
            loading: false
          })
        },
        'security', 'lastError', 'MAIN_RECOVERPASS', this.state.username.toUpperCase()
      )
    }
  }

  onChange (e) {
    // dynamically change component and field state, depending on user input
    this.setState({ [e.target.name]: e.target.value })
    const targetName = e.target.name
    const errObj = this.state.errors
    delete errObj[targetName]
    this.setState({ errors: errObj })
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

    const labels = this.context.intl
    const onChange = this.onChange
    const trimAllWhiteSpacesLeftAndRight = this.trimAllWhiteSpacesLeftAndRight
    const state = this.state

    const showFields = (element) => {
      const formFields = (<TextFieldGroup
        key={`Reg${element}`}
        field={element}
        value={state[element]}
        placeholder={labels.formatMessage({ id: `${config.labelBasePath}.register.${[element]}`, defaultMessage: `${config.labelBasePath}.register.${element}` })}
        type={element}
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
        <div id='mainPasswordRecoverComp' className={`${registrationStyle.mainRegisterComp} ${registrationStyle.fadeIn}`}>
          <div className={`text-right ${registrationStyle.langPaddingRight}`}>
            <button className={registrationStyle.language} onClick={this.props.toggleLangImgs('ka-GE')}>KA</button>
            <button className={registrationStyle.language} onClick={this.props.toggleLangImgs('en-US')}>EN</button>
          </div>
          <form className={registrationStyle.topForm}>
            <h2 className={registrationStyle.h2}>
              <span className={registrationStyle.imgNaits}>
                {this.props.locale === 'ka-GE' ? <img src='img/login/georgia/naitsge_trans_grey.png' /> : <img src='img/login/georgia/naitsen_trans_grey.png' />}
              </span>
            </h2>
          </form>
          <form id='submit_form' className={registrationStyle.bottomForm} action=''>

            {showFields('username')}

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

        </div>
      </div>
    )
  }
}

PasswordReset.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  lastError: state.security.lastError,
  locale: state.intl.locale
})

export default connect(mapStateToProps)(PasswordReset)
