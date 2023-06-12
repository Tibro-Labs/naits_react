import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { format } from 'date-fns'
import { enUS, ka } from 'date-fns/locale'
import { FormManager, Loading } from 'components/ComponentsIndex'
import * as config from 'config/config'
import { strcmp, isValidArray, formatAlertType } from 'functions/utils'
import { getNumOfUnreadMessages } from './utils'
import style from './Messaging.module.css'

class Message extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      dateLocale: undefined,
      attachments: undefined,
      detailsForm: undefined
    }
  }

  componentDidMount () {
    const { locale, message } = this.props
    if (locale) this.setDateLocale(locale)
    if (message['MESSAGE.OBJECT_ID'] && message['MESSAGE.HAS_ATTACHMENT']) {
      this.getAttachments(message['MESSAGE.OBJECT_ID'])
    }
    this.updateMessageLinkStatus(message['MESSAGE.OBJECT_ID'])
  }

  setDateLocale = locale => {
    strcmp(locale, 'en-US') ? this.setState({ dateLocale: enUS }) : this.setState({ dateLocale: ka })
  }

  getAttachments = selectedMessageObjectId => {
    this.setState({ loading: true })
    const server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.GET_TABLE_WITH_FILTER_2
    verbPath = verbPath.replace('%session', this.props.session)
    verbPath = verbPath.replace('%table_name', 'MSG_ATTACHEMENT')
    verbPath = verbPath.replace('%searchBy', 'MSG_ID')
    verbPath = verbPath.replace('%searchForValue', selectedMessageObjectId)
    verbPath = verbPath.replace('%no_rec', 100)
    const url = `${server}${verbPath}`
    let attachments = []
    axios.get(url).then(res => {
      if (res.data) {
        res.data.forEach(attachment => {
          this.getAttachmentObjectType(attachment['MSG_ATTACHEMENT.ATCH_OBJ_TYPE']).then(objectType => {
            Object.assign(attachment, { OBJECT_TYPE: objectType })
          })
          attachments.push(attachment)
        })
        this.setState({ attachments, loading: false })
      }
    }).catch(err => {
      console.error(err)
      this.setState({ loading: false })
    })
  }

  getAttachmentObjectType = async objectTypeId => {
    this.setState({ loading: true })
    const server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.GET_TRANSLATED_OBJECT_TYPE
    verbPath = verbPath.replace('%session', this.props.session)
    verbPath = verbPath.replace('%objectTypeId', objectTypeId)
    const url = `${server}${verbPath}`
    const response = await axios.get(url)
    return response.data
  }

  updateMessageLinkStatus = objectId => {
    const { session } = this.props
    const server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.UPDATE_MSG_LINK_STATUS
    verbPath = verbPath.replace('%session', session)
    verbPath = verbPath.replace('%messageObjId', objectId)
    const url = `${server}${verbPath}`
    axios.get(url).then(res => {
      if (res.data) {
        const resType = formatAlertType(res.data)
        if (strcmp(resType, 'success')) {
          getNumOfUnreadMessages(session)
        }
      }
    }).catch(err => console.error(err))
  }

  additionalDateInfo = (dateOfCreation, dateLocale) => {
    return <React.Fragment>
      <h4 className={style['flex-container-item']}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.select_date`,
          defaultMessage: `${config.labelBasePath}.main.select_date`
        })}&#58; <strong>{format(new Date(dateOfCreation), 'do MMMM yyyy', { locale: dateLocale })}</strong>
      </h4>
      <h4 className={style['flex-container-item']}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.message.time`,
          defaultMessage: `${config.labelBasePath}.message.time`
        })}&#58; <span id={`hours_${this.props.index}`}>
          <strong>{format(new Date(dateOfCreation), 'k', { locale: dateLocale })}&#58;</strong>
        </span>
        <span id={`minutes_${this.props.index}`}>
          <strong>{format(new Date(dateOfCreation), 'mm', { locale: dateLocale })}</strong>
        </span>
      </h4>
    </React.Fragment>
  }

  showAttachmentDetailsForm = (type, objectId, attachmentIndex) => {
    const formId = `${type}_${attachmentIndex}_DETAILS_${objectId}_FORM`
    const params = []
    params.push({
      PARAM_NAME: 'formWeWant',
      PARAM_VALUE: type
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: this.props.session
    }, {
      PARAM_NAME: 'table_name',
      PARAM_VALUE: type
    }, {
      PARAM_NAME: 'object_id',
      PARAM_VALUE: objectId
    })

    const detailsForm = FormManager.generateForm(
      formId, formId, params, 'formData',
      'GET_FORM_BUILDER', 'GET_UISCHEMA', 'GET_TABLE_FORMDATA',
      this.closeAnimalsForm, null, null, null, null, null, true,
      () => this.closeAnimalsForm(), undefined, undefined,
      undefined, undefined, undefined
    )
    this.setState({ detailsForm })
  }

  closeDetailsForm = () => {
    this.setState({ detailsForm: undefined })
  }

  openObjectInNewTab = (type, attachmentName) => {
    let searchCriterion = ''
    if (strcmp(type, 'HOLDING')) {
      searchCriterion = 'PIC'
    } else if (strcmp(type, 'HOLDING_RESPONSIBLE')) {
      searchCriterion = 'NAT_REG_NUMBER'
    } else if (strcmp(type, 'ANIMAL')) {
      searchCriterion = 'ANIMAL_ID'
    }

    const server = window.location.origin
    const url = `${server}/naits/#/main/dynamic/${type.toLowerCase()}?c=${searchCriterion}&v=${attachmentName}`
    window.open(url, '_blank')
  }

  render () {
    const { message, index: messageIndex } = this.props
    const { loading, dateLocale, attachments, detailsForm } = this.state

    return (
      <div key={messageIndex} className={style['single-message']}>
        {loading && <Loading />}
        <div className={style['flex-container']}>
          {dateLocale && this.additionalDateInfo(message['MESSAGE.DT_INSERT'], dateLocale)}
        </div>
        <div className={style['flex-container-column']}>
          <h3 style={{ color: '#ffffff' }}><strong>{message['MESSAGE.CREATED_BY_USERNAME']}</strong>&#58;</h3>
          <h3 className={style['flex-container-column-item']}>{message['MESSAGE.TEXT']}</h3>
        </div>
        <div className={style['flex-container']}>
          {attachments && isValidArray(attachments, 1) &&
            <div className={style['attachments-info']}>
              <span className={style['attachments-title']}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.message.attachments`,
                  defaultMessage: `${config.labelBasePath}.message.attachments`
                })}&#58;
              </span>
              {attachments.map((attachment, index) => (
                <React.Fragment key={`attachment_${index}_message_${messageIndex}`}>
                  <p key={`attachment_${index}_message_${messageIndex}`}
                    id={`attachment_${index}_message_${messageIndex}`}
                    className={style['single-attachment']}
                    title={this.context.intl.formatMessage({
                      id: config.labelBasePath + `.message.click_here_for_details`,
                      defaultMessage: config.labelBasePath + `.message.click_here_for_details`
                    })}
                    onClick={() => this.showAttachmentDetailsForm(attachment['OBJECT_TYPE'], attachment['MSG_ATTACHEMENT.ATCH_OBJ_ID'], index)}
                  >
                    {attachment['MSG_ATTACHEMENT.NAME']}
                  </p>
                  <i
                    key={`attachment_icon_${index}_message_${messageIndex}`}
                    className={`fa fa-external-link ${style['external-link-icon']}`}
                    aria-hidden='true'
                    title={this.context.intl.formatMessage({
                      id: config.labelBasePath + `.message.open_attachment_in_new_tab`,
                      defaultMessage: config.labelBasePath + `.message.open_attachment_in_new_tab`
                    })}
                    onClick={() => this.openObjectInNewTab(attachment['OBJECT_TYPE'], attachment['MSG_ATTACHEMENT.NAME'])}
                  />
                  <span
                    key={`attachment_comma_${index}_message_${messageIndex}`}
                    style={{ color: '#ffffff' }}
                  >
                    {index === (attachments.length - 1) ? '' : ', '}
                  </span>
                </React.Fragment>
              ))}
            </div>
          }
        </div>
        {detailsForm && <div id='form_modal' className='modal' style={{ display: 'block', color: '#ffffff', textAlign: 'center' }}>
          <div id='form_modal_content' className='modal-content'>
            <div className='modal-header'>
              <button id='modal_close_btn' type='button' className='close' onClick={this.closeDetailsForm} data-dismiss='modal'>&times;</button>
            </div>
            <div id='form_modal_body' className='modal-body'>
              {detailsForm}
            </div>
          </div>
        </div>}
      </div>
    )
  }
}

Message.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  locale: state.intl.locale
})

export default connect(mapStateToProps)(Message)
