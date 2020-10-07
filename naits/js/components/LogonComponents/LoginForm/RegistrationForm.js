import React from 'react'
import PropTypes from 'prop-types'
import { TextFieldGroup } from 'containers/ContainersIndex'
import registrationStyle from './RegistrationFormStyle.module.css'
import validateInput from 'components/validateInput.js'
import { alertUser } from 'tibro-components'
import { dataToRedux } from 'tibro-redux'
import md5 from 'md5'
import createHashHistory from 'history/createHashHistory'
import * as config from 'config/config.js'
import { gaEventTracker } from 'functions/utils'
import { connect } from 'react-redux'

class RegistrationForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      // password: '',
      // repeat_password: '',
      e_mail: '',
      pin_vat: '',
      first_name: '',
      last_name: '',
      errors: {},
      alert: undefined
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.trimAllWhiteSpacesLeftAndRight = this.trimAllWhiteSpacesLeftAndRight.bind(this)
    this.hashHistory = createHashHistory()
  }

  /* validator for login forms - client side f.r */
  isValid () {
    const { errors, isValid } = validateInput(this.state, 'REGISTER')
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
      dataToRedux(
        (response) => {
          if (response.toString() === 'createUser.success') {
            const msg = this.context.intl.formatMessage({ id: `${config.labelBasePath}.register.success`, defaultMessage: `${config.labelBasePath}.register.success` })
            const msgText = this.context.intl.formatMessage({ id: `${config.labelBasePath}.register.success_text`, defaultMessage: `${config.labelBasePath}.register.success_text` })
            this.setState({ alert: alertUser(true, 'success', msg, msgText, () => this.setState({ alert: alertUser(false) }, this.hashHistory.push('/login'))) })
          } else {
            const regErrorText = this.context.intl.formatMessage({ id: `${config.labelBasePath}.register.error_text`, defaultMessage: `${config.labelBasePath}.register.error_text` })
            this.setState({
              alert: alertUser(true, 'error', response, regErrorText, () => this.setState({
                username: '', e_mail: '', alert: alertUser(false) /* , password: '', repeat_password: '' */
              }))
            })
          }
        },
        'security', 'svSessionMsg', 'MAIN_REGISTER',
        this.state.username, md5('naits123'), this.state.pin_vat,
        this.state.e_mail, this.state.first_name, this.state.last_name
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
    const { alert, errors } = this.state

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
        {alert}
        <div id='mainLoginComp' className={`${registrationStyle.mainRegisterComp} ${registrationStyle.fadeIn}`}>
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
            <div className={`form-inline ${registrationStyle.form1}`}>
              {showFields('first_name')}
              {showFields('last_name')}
            </div>
            <div className={`form-inline ${registrationStyle.form2}`}>
              {showFields('username')}
              {showFields('e_mail')}
            </div>
            <div className={`form-inline ${registrationStyle.form3}`}>
              {showFields('pin_vat')}
            </div>
            {/* <div className={`form-inline ${registrationStyle.form4}`}>
              {showFields('password')}
              {showFields('repeat_password')}
            </div> */}
            <button
              id='register_submit'
              type='submit'
              className={registrationStyle.btn}
              onClick={e => {
                this.onSubmit(e)
                gaEventTracker(
                  'AUTH',
                  'Clicked the submit button for registration on the landing page',
                  `LANDING_PAGE | ${config.version} (${config.currentEnv})`
                )
              }}
            >
              <span>{labels.formatMessage({ id: `${config.labelBasePath}.register.register`, defaultMessage: `${config.labelBasePath}.register.register` })}</span>
            </button>
          </form>
          <div className={registrationStyle.stripes} >
            <div>
              {labels.formatMessage({ id: `${config.labelBasePath}.register.already_registered`, defaultMessage: `${config.labelBasePath}.register.already_registered` })}
            </div>
            <div>
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

RegistrationForm.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  locale: state.intl.locale
})

export default connect(mapStateToProps)(RegistrationForm)
