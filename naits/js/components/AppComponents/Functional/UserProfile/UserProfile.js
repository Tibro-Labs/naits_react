import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import md5 from 'md5'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import validateInput from 'components/validateInput.js'
import { TextFieldGroup } from 'containers/ContainersIndex'
import { userInfoAction } from 'backend/userInfoAction'
import { formatAlertType } from 'functions/utils'
import style from './UserProfile.module.css'
import * as config from 'config/config.js'

class UserProfile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      street_type: '',
      street_name: '',
      house_number: '',
      state: '',
      fax: '',
      username: '',
      old_password: '',
      password: '',
      repeat_password: '',
      e_mail: '',
      first_name: '',
      pin_vat: '',
      last_name: '',
      phone_number: '',
      mobile_number: '',
      postal_code: '',
      city: '',
      errors: {},
      modalIsOpen: false,
      alert: undefined
    }
    this.onSubmitChangePass = this.onSubmitChangePass.bind(this)
    this.onSubmitEditSvarogUsersData = this.onSubmitEditSvarogUsersData.bind(this)
    this.onSubmitSaveContactData = this.onSubmitSaveContactData.bind(this)
    this.onChange = this.onChange.bind(this)
    this.trimAllWhiteSpacesLeftAndRight = this.trimAllWhiteSpacesLeftAndRight.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.setPresentReduxStateToFormField = this.setPresentReduxStateToFormField.bind(this)
  }

  componentDidMount () {
    this.props.userInfoAction(this.props.svSession, 'GET_BASIC')
    if (this.props.userObjId) {
      this.props.userInfoAction(this.props.svSession, 'GET_FULL', this.props.userObjId)
    }
    this.setState({ modalIsOpen: true })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.userObjId && this.props.userObjId !== nextProps.userObjId) {
      this.props.userInfoAction(this.props.svSession, 'GET_FULL', nextProps.userObjId)
    }

    if (this.props.userInfo !== nextProps.userInfo) {
      this.setPresentReduxStateToFormField(this.props.userInfo, nextProps.userInfo, 'e_mail', 'userEmail')
      this.setPresentReduxStateToFormField(this.props.userInfo, nextProps.userInfo, 'state', 'state')
      this.setPresentReduxStateToFormField(this.props.userInfo, nextProps.userInfo, 'fax', 'fax')
      this.setPresentReduxStateToFormField(this.props.userInfo, nextProps.userInfo, 'username', 'userName')
      this.setPresentReduxStateToFormField(this.props.userInfo, nextProps.userInfo, 'first_name', 'userFirstName')
      this.setPresentReduxStateToFormField(this.props.userInfo, nextProps.userInfo, 'pin_vat', 'pinNumber')
      this.setPresentReduxStateToFormField(this.props.userInfo, nextProps.userInfo, 'last_name', 'userLastName')
      this.setPresentReduxStateToFormField(this.props.userInfo, nextProps.userInfo, 'phone_number', 'phoneNumber')
      this.setPresentReduxStateToFormField(this.props.userInfo, nextProps.userInfo, 'mobile_number', 'mobilePhoneNumber')
      this.setPresentReduxStateToFormField(this.props.userInfo, nextProps.userInfo, 'postal_code', 'postalCode')
      this.setPresentReduxStateToFormField(this.props.userInfo, nextProps.userInfo, 'house_number', 'houseNumber')
      this.setPresentReduxStateToFormField(this.props.userInfo, nextProps.userInfo, 'street_name', 'streetName')
      this.setPresentReduxStateToFormField(this.props.userInfo, nextProps.userInfo, 'street_type', 'streetType')
      this.setPresentReduxStateToFormField(this.props.userInfo, nextProps.userInfo, 'city', 'city')
    }

    if (this.props.userInfo.info !== nextProps.userInfo.info) {
      this.props.userInfoAction(this.props.svSession, 'GET_FULL', nextProps.userObjId)
    }

    if (nextProps.userInfo.info) {
      const alertType = formatAlertType(nextProps.userInfo.info)
      this.setState({
        alert: alertUser(
          true, alertType,
          this.context.intl.formatMessage({
            id: nextProps.userInfo.info,
            defaultMessage: nextProps.userInfo.info
          }), null,
          () => {
            this.closeModal()
            this.setState({
              repeat_password: '',
              old_password: '',
              password: '',
              alert: alertUser(false)
            })
          }
        )
      })
    }

    if (nextProps.userInfo.error) {
      const alertType = formatAlertType(nextProps.userInfo.error)
      this.setState({
        alert: alertUser(
          true, alertType,
          this.context.intl.formatMessage({
            id: nextProps.userInfo.error,
            defaultMessage: nextProps.userInfo.error
          }), null,
          () => {
            this.closeModal()
            this.setState({
              repeat_password: '',
              old_password: '',
              password: '',
              alert: alertUser(false)
            })
          }
        )
      })
    }
  }

  openModal () {
    this.setState({ modalIsOpen: true })
  }

  closeModal () {
    this.setState({ modalIsOpen: false }, this.props.toggle)
  }
  /* validator for login forms - client side f.r */
  isValid (validationString) {
    const { errors, isValid } = validateInput(this.state, validationString)
    if (!isValid) {
      this.setState({ errors })
    }
    return isValid
  }

  onSubmitEditSvarogUsersData (e) {
    e.preventDefault()
    if (this.isValid('UPDATE_SVAROG_USERS')) {
      this.props.userInfoAction(this.props.svSession, 'EDIT', this.state.first_name, this.state.last_name)
    }
  }

  onSubmitChangePass (e) {
    e.preventDefault()
    if (this.isValid('CHANGE_PASSWORD')) {
      this.props.userInfoAction(
        this.props.svSession,
        'CHANGEPASS',
        md5(this.state.old_password),
        md5(this.state.password)
      )
    }
  }

  onSubmitSaveContactData (e) {
    e.preventDefault()
    if (this.isValid('UPDATE_CONTACT_DATA')) {
      this.props.userInfoAction(
        this.props.svSession,
        'SAVE',
        this.props.userObjId,
        'SVAROG_USERS',
        this.state.street_type,
        this.state.street_name,
        this.state.house_number,
        this.state.postal_code,
        this.state.city,
        this.state.state,
        this.state.phone_number,
        this.state.mobile_number,
        this.state.fax,
        this.state.e_mail,
        {
          street_type: this.state.street_type,
          street_name: this.state.street_name,
          house_number: this.state.house_number,
          postal_code: this.state.postal_code,
          city: this.state.city,
          state: this.state.state,
          phone_number: this.state.phone_number,
          mobile_number: this.state.mobile_number,
          fax: this.state.fax,
          e_mail: this.state.e_mail
        }
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

  setPresentReduxStateToFormField (props, nextProps, element, reduxElement) {
    if (props[reduxElement] !== nextProps[reduxElement]) {
      this.setState({ [element]: nextProps[reduxElement] })
    } else if (props[reduxElement]) {
      this.setState({ [element]: props[reduxElement] })
    } else {
      this.setState({ [element]: '' })
    }
  }

  render () {
    const { errors } = this.state
    const { forcePassChange } = this.props

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
        className={style[element]}
        label={element}
        onChange={onChange}
        error={errors[element]}
        onBlur={trimAllWhiteSpacesLeftAndRight}
      />)
      return formFields
    }

    let overlayClassName = {
      base: null
    }
    if (!forcePassChange) {
      overlayClassName = {
        base: style.overlay,
        afterOpen: 'myOverlayClass_after-open',
        beforeClose: 'myOverlayClass_before-close'
      }
    }

    return (
      <Modal
        ariaHideApp={false}
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={!this.props.hideCloseButton}
        className={{
          base: style.main,
          afterOpen: 'myClass_after-open',
          beforeClose: 'myClass_before-close'
        }}
        contentLabel='User Profile'
        overlayClassName={overlayClassName}
      >
        {!forcePassChange &&
          <form id='submit_form1' className={style.bottomForm} action=''>
            <div className={`form-inline ${style.form1}`}>
              {showFields('username', true)}
              {showFields('first_name')}
              {showFields('last_name')}
            </div>

            <button id='register_submit1' type='submit' className={style.btn} onClick={this.onSubmitEditSvarogUsersData}>
              <span>{labels.formatMessage({ id: `${config.labelBasePath}.register.update_profile`, defaultMessage: `${config.labelBasePath}.register.update_profile` })}</span>
            </button>
          </form>
        }
        {!forcePassChange &&
          <form id='submit_form2' className={style.bottomForm} action=''>

            <div className={`form-inline ${style.form2}`}>
              {showFields('pin_vat', true)}
              {showFields('e_mail')}
            </div>

            <div className={`form-inline ${style.form4}`}>
              {showFields('phone_number')}
              {showFields('mobile_number')}
              {showFields('fax')}
            </div>

            <div className={`form-inline ${style.form4}`}>
              {showFields('city')}
              {showFields('postal_code')}
              {showFields('state')}
            </div>

            <div className={`form-inline ${style.form4}`}>
              {showFields('street_type')}
              {showFields('street_name')}
              {showFields('house_number')}
            </div>

            <button id='register_submit2' type='submit' className={style.btn} onClick={this.onSubmitSaveContactData}>
              <span>{labels.formatMessage({ id: `${config.labelBasePath}.register.update_contact_data`, defaultMessage: `${config.labelBasePath}.register.update_contact_data` })}</span>
            </button>
          </form>
        }

        <form id='submit_form3' className={style.bottomForm} action=''>
          {forcePassChange &&
            <label style={{ color: 'white', marginBottom: '15px' }}>
              {labels.formatMessage({
                id: `${config.labelBasePath}.main.enforce_pass_change`,
                defaultMessage: `${config.labelBasePath}.main.enforce_pass_change`
              })}
            </label>
          }
          <div className={`form-inline ${style.form4}`}>
            {showFields('old_password')}
            {showFields('password')}
            {showFields('repeat_password')}
          </div>

          <button id='register_submit3' type='submit' className={style.btn} onClick={this.onSubmitChangePass}>
            <span>{labels.formatMessage({ id: `${config.labelBasePath}.register.update_password`, defaultMessage: `${config.labelBasePath}.register.update_password` })}</span>
          </button>
        </form>
        {this.state.alert}
        {!this.props.hideCloseButton &&
          <div onClick={this.closeModal} className={style.close} id='closeModalForm' />
        }
      </Modal>
    )
  }
}

UserProfile.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  userObjId: state.userInfoReducer.userObjId,
  userInfo: state.userInfoReducer
})

const mapDispatchToProps = dispatch => ({
  userInfoAction: (svSession, actionType, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, json) => {
    dispatch(userInfoAction(svSession, actionType, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, json))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile)
