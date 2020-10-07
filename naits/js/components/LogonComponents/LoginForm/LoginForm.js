import React from 'react'
import PropTypes from 'prop-types'
import LogInAction from './LogInAction'
import { TextFieldGroup } from 'containers/ContainersIndex'
import loginStyle from './LoginFormStyle.module.css'
import validateInput from 'components/validateInput.js'
import { alertUser } from 'tibro-components'
import * as config from 'config/config.js'
import { gaEventTracker } from 'functions/utils'
import { connect } from 'react-redux'

class LoginForm extends React.Component {
  static propTypes = {
    login: PropTypes.func.isRequired
  }
  constructor (props) {
    super(props)
    this.state = {
      showGuide: false,
      username: '',
      password: '',
      errors: {},
      lang: this.props.locale,
      alert: undefined
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.trimAllWhiteSpacesLeftAndRight = this.trimAllWhiteSpacesLeftAndRight.bind(this)
  }

  /* validator for login forms - client side f.r */
  isValid () {
    const { errors, isValid } = validateInput(this.state, 'LOGIN')
    if (!isValid) {
      this.setState({ errors })
    }
    return isValid
  }

  onSubmit (e) {
    // does the login server call and redirect on submit if a session token is
    // assigned
    e.preventDefault()
    if (this.isValid()) {
      this.props.login(this.state.username, this.state.password)
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

  expandHelp () {
    // displays additional instruction manuals when clicked
    if (this.state.showGuide === false) {
      this.setState({ showGuide: true })
    } else {
      this.setState({ showGuide: false })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.lastError) {
      if (nextProps.lastError.toLowerCase().match(/^error/)) {
        const errorMsg = this.context.intl.formatMessage({ id: `${config.labelBasePath}.login.wrong_credentials`, defaultMessage: `${config.labelBasePath}.login.wrong_credentials` })
        this.setState({
          alert: alertUser(true, 'error', errorMsg, null, () => this.setState({
            username: '', password: '', alert: alertUser(false)
          }))
        })
      }
    }
  }

  render () {
    const {
      alert, errors, username, password
    } = this.state
    const labels = this.context.intl

    return (
      <div>
        {alert}
        <div id='mainLoginComp' className={`${loginStyle.mainLoginComp} ${loginStyle.fadeIn}`}>
          <div className={`text-right ${loginStyle.langPaddingRight}`}>
            <button className={loginStyle.language} onClick={this.props.toggleLangImgs('ka-GE')}>KA</button>
            <button className={loginStyle.language} onClick={this.props.toggleLangImgs('en-US')}>EN</button>
          </div>
          <form className={loginStyle.topForm}>
            <h2 className={loginStyle.h2}>
              <span className={loginStyle.imgNaits}>
                {this.props.locale === 'ka-GE' ? <img src='img/login/georgia/naitsge_trans_grey.png' /> : <img src='img/login/georgia/naitsen_trans_grey.png' />}
              </span>
            </h2>
          </form>
          <form id='submit_form' className={loginStyle.bottomForm} action=''>
            <TextFieldGroup
              field='username'
              value={username}
              placeholder={labels.formatMessage({ id: `${config.labelBasePath}.login.user_name`, defaultMessage: `${config.labelBasePath}.login.user_name` })}
              className={loginStyle.emailForm}
              label='username'
              error={errors.username}
              type='text'
              onChange={this.onChange}
              id='idbrLogin'
              onBlur={this.trimAllWhiteSpacesLeftAndRight}
            />

            <TextFieldGroup
              field='password'
              value={password}
              placeholder={labels.formatMessage({ id: `${config.labelBasePath}.login.password`, defaultMessage: `${config.labelBasePath}.login.password` })}
              type='password'
              id='passLogin'
              className={loginStyle.passForm}
              label='password'
              onChange={this.onChange}
              error={errors.password}
              onBlur={this.trimAllWhiteSpacesLeftAndRight}
            />

            <button
              id='login_submit'
              type='submit'
              className={loginStyle.btn}
              onClick={e => {
                this.onSubmit(e)
                gaEventTracker(
                  'AUTH',
                  'Clicked the log in button on the landing page',
                  `LANDING_PAGE | ${config.version} (${config.currentEnv})`
                )
              }}
            >
              <span>{labels.formatMessage({ id: `${config.labelBasePath}.login.login`, defaultMessage: `${config.labelBasePath}.login.login` })}</span>
            </button>
          </form>
          <div className={loginStyle.stripes} >
            <div>
              <a href='/naits/#/password_reset'>
                {labels.formatMessage({ id: `${config.labelBasePath}.login.reset_password`, defaultMessage: `${config.labelBasePath}.login.reset_password` })}
              </a>
            </div>
            <div>
              <a href='/naits/#/register'>
                {labels.formatMessage({ id: `${config.labelBasePath}.login.sign_up`, defaultMessage: `${config.labelBasePath}.login.sign_up` })}
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

LoginForm.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  locale: state.intl.locale
})

export default connect(mapStateToProps)(LogInAction(LoginForm))
