import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { FormManager, Loading, GridInModalLinkObjects } from 'components/ComponentsIndex'
import Message from './Message'
import * as config from 'config/config'
import { isValidArray, formatAlertType, insertSpaceAfterAChar } from 'functions/utils'
import style from './Messaging.module.css'

class MessagesHolder extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: undefined,
      loading: false,
      additionalInfo: false,
      recipients: undefined,
      recipientsObjIds: undefined,
      ccRecipients: undefined,
      ccRecipientsObjIds: undefined,
      bccRecipients: undefined,
      bccRecipientsObjIds: undefined,
      containedMessages: undefined,
      showReplyTextarea: false,
      showAttachmentsSelectors: false,
      showAnimalsModal: false,
      showAnimalForm: undefined,
      showHoldingsModal: false,
      showHoldingForm: undefined,
      showHoldingResponsiblesModal: false,
      showHoldingResponsibleForm: undefined,
      selectedAnimal: [],
      selectedHolding: [],
      selectedHoldingResponsible: [],
      replyText: ''
    }
  }

  componentDidMount () {
    const { selectedMessage } = this.props
    if (selectedMessage) {
      this.getRecipients(selectedMessage)
      if (selectedMessage.SUBJECT.object_id) {
        this.getAllMessages(selectedMessage.SUBJECT.object_id)
      }
    }
  }

  getRecipients = selectedMessage => {
    let recipients = []
    let recipientsObjIds = []
    let ccRecipients = []
    let ccRecipientsObjIds = []
    let bccRecipients = []
    let bccRecipientsObjIds = []
    if (selectedMessage && selectedMessage.MSG_TO && selectedMessage.MSG_TO.items && isValidArray(selectedMessage.MSG_TO.items, 1)) {
      selectedMessage.MSG_TO.items.forEach(recipient => {
        recipients.push(recipient.USER_NAME)
        recipientsObjIds.push(recipient.object_id)
      })
      this.setState({ recipients, recipientsObjIds })
    }
    if (selectedMessage && selectedMessage.MSG_CC && selectedMessage.MSG_CC.items && isValidArray(selectedMessage.MSG_CC.items, 1)) {
      selectedMessage.MSG_CC.items.forEach(ccRecipient => {
        ccRecipients.push(ccRecipient.USER_NAME)
        ccRecipientsObjIds.push(ccRecipient.object_id)
      })
      this.setState({ ccRecipients, ccRecipientsObjIds })
    }
    if (selectedMessage && selectedMessage.MSG_BCC && selectedMessage.MSG_BCC.items && isValidArray(selectedMessage.MSG_BCC.items, 1)) {
      selectedMessage.MSG_BCC.items.forEach(bccRecipient => {
        bccRecipients.push(bccRecipient.USER_NAME)
        bccRecipientsObjIds.push(bccRecipient.object_id)
      })
      this.setState({ bccRecipients, bccRecipientsObjIds })
    }
  }

  getAllMessages = selectedMessageParentId => {
    this.setState({ loading: true })
    const server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.GET_BYPARENTID_2
    verbPath = verbPath.replace('%session', this.props.session)
    verbPath = verbPath.replace('%parentId', selectedMessageParentId)
    verbPath = verbPath.replace('%tableName', 'MESSAGE')
    verbPath = verbPath.replace('%orderByField', 'PKID')
    verbPath = verbPath.replace('%orderAscDesc', 'DESC')
    let url = `${server}${verbPath}`
    axios.get(url).then(res => {
      if (res.data) {
        this.setState({ loading: false, containedMessages: undefined }, () => this.setState({ containedMessages: res.data }))
      }
    }).catch(err => {
      console.error(err)
      this.setState({ loading: false })
    })
  }

  showReplyTextarea = () => {
    this.setState({ showReplyTextarea: !this.state.showReplyTextarea })
    if (this.state.showAttachmentsSelectors) {
      this.setState({ showAttachmentsSelectors: false })
    }
  }

  handleReplyChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  showAttachmentSelectors = () => {
    if (this.state.showAttachmentsSelectors) {
      if (isValidArray(this.state.selectedAnimal, 1) || isValidArray(this.state.selectedHolding, 1) ||
        isValidArray(this.state.selectedHoldingResponsible, 1)) {
        this.setState({
          alert: alertUser(true, 'warning', this.context.intl.formatMessage({
            id: `${config.labelBasePath}.message.remove_attachments_prompt`,
            defaultMessage: `${config.labelBasePath}.message.remove_attachments_prompt`
          }), null, () => this.setState({
            selectedAnimal: [],
            selectedHolding: [],
            selectedHoldingResponsible: [],
            showAttachmentsSelectors: false
          }), () => this.setState({ alert: false }), true,
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.yes`,
            defaultMessage: `${config.labelBasePath}.main.yes`
          }),
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.no`,
            defaultMessage: `${config.labelBasePath}.main.no`
          }))
        })
      } else {
        this.setState({ showAttachmentsSelectors: false })
      }
    } else {
      this.setState({ showAttachmentsSelectors: true })
    }
  }

  handleAnimalsModal = () => {
    this.setState({ showAnimalsModal: !this.state.showAnimalsModal })
  }

  chooseAnimal = () => {
    let selectedAnimal = []
    selectedAnimal.push(...this.state.selectedAnimal, store.getState()['ANIMAL'].rowClicked)
    this.setState({ showAnimalsModal: false, selectedAnimal })
  }

  removeSelectedAnimalPrompt = index => {
    this.setState({
      alert: alertUser(true, 'warning', this.context.intl.formatMessage({
        id: `${config.labelBasePath}.message.remove_animal_prompt`,
        defaultMessage: `${config.labelBasePath}.message.remove_animal_prompt`
      }), null, () => this.removeSelectedAnimal(index),
      () => this.setState({ alert: false }), true,
      this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.yes`,
        defaultMessage: `${config.labelBasePath}.main.yes`
      }),
      this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.no`,
        defaultMessage: `${config.labelBasePath}.main.no`
      }))
    })
  }

  removeSelectedAnimal = index => {
    let selectedAnimal = []
    if (index === 0 && this.state.selectedAnimal.length === 1) {
      this.setState({ selectedAnimal: [] })
    } else {
      this.state.selectedAnimal.splice(index, 1)
      selectedAnimal.push(...this.state.selectedAnimal)
      this.setState({ selectedAnimal })
    }
  }

  showAnimalForm = animalObjId => {
    const formId = `ANIMAL_DETAILS_FORM_${animalObjId}`
    const params = []
    params.push({
      PARAM_NAME: 'formWeWant',
      PARAM_VALUE: 'ANIMAL'
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: this.props.session
    }, {
      PARAM_NAME: 'table_name',
      PARAM_VALUE: 'ANIMAL'
    }, {
      PARAM_NAME: 'object_id',
      PARAM_VALUE: animalObjId
    })

    const animalDetailsForm = FormManager.generateForm(
      formId, formId, params, 'formData',
      'GET_FORM_BUILDER', 'GET_UISCHEMA', 'GET_TABLE_FORMDATA',
      this.closeAnimalsForm, null, null, null, null, null, true,
      () => this.closeAnimalsForm(), undefined, undefined,
      undefined, undefined, undefined
    )
    this.setState({ showAnimalForm: undefined }, () => {
      this.setState({ showAnimalForm: animalDetailsForm })
    })
  }

  closeAnimalsForm = () => {
    this.setState({ showAnimalForm: undefined })
  }

  handleHoldingsModal = () => {
    this.setState({ showHoldingsModal: !this.state.showHoldingsModal })
  }

  chooseHolding = () => {
    let selectedHolding = []
    selectedHolding.push(...this.state.selectedHolding, store.getState()['HOLDING'].rowClicked)
    this.setState({ showHoldingsModal: false, selectedHolding })
  }

  removeSelectedHoldingPrompt = index => {
    this.setState({
      alert: alertUser(true, 'warning', this.context.intl.formatMessage({
        id: `${config.labelBasePath}.message.remove_holding_prompt`,
        defaultMessage: `${config.labelBasePath}.message.remove_holding_prompt`
      }), null, () => this.removeSelectedHolding(index),
      () => this.setState({ alert: false }),
      true, this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.yes`,
        defaultMessage: `${config.labelBasePath}.main.yes`
      }), this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.no`,
        defaultMessage: `${config.labelBasePath}.main.no`
      }))
    })
  }

  removeSelectedHolding = index => {
    let selectedHolding = []
    if (index === 0 && this.state.selectedHolding.length === 1) {
      this.setState({ selectedHolding: [] })
    } else {
      this.state.selectedHolding.splice(index, 1)
      selectedHolding.push(...this.state.selectedHolding)
      this.setState({ selectedHolding })
    }
  }

  showHoldingForm = holdingObjId => {
    const formId = `HOLDING_DETAILS_FORM_${holdingObjId}`
    const params = []
    params.push({
      PARAM_NAME: 'formWeWant',
      PARAM_VALUE: 'HOLDING'
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: this.props.session
    }, {
      PARAM_NAME: 'table_name',
      PARAM_VALUE: 'HOLDING'
    }, {
      PARAM_NAME: 'object_id',
      PARAM_VALUE: holdingObjId
    })

    const holdingDetailsForm = FormManager.generateForm(
      formId, formId, params, 'formData',
      'GET_FORM_BUILDER', 'GET_UISCHEMA', 'GET_TABLE_FORMDATA',
      this.closeHoldingForm, null, null, null, null, null, true,
      () => this.closeHoldingForm(), undefined, undefined,
      undefined, undefined, undefined
    )
    this.setState({ showHoldingForm: holdingDetailsForm })
  }

  closeHoldingForm = () => {
    this.setState({ showHoldingForm: false })
  }

  handleHoldingResponsiblesModal = () => {
    this.setState({ showHoldingResponsiblesModal: !this.state.showHoldingResponsiblesModal })
  }

  chooseHoldingResponsible = () => {
    let selectedHoldingResponsible = []
    selectedHoldingResponsible.push(...this.state.selectedHoldingResponsible, store.getState()['HOLDING_RESPONSIBLE'].rowClicked)
    this.setState({ showHoldingResponsiblesModal: false, selectedHoldingResponsible })
  }

  removeSelectedHoldingResponsiblePrompt = index => {
    this.setState({
      alert: alertUser(true, 'warning', this.context.intl.formatMessage({
        id: `${config.labelBasePath}.message.remove_holding_responsible_prompt`,
        defaultMessage: `${config.labelBasePath}.message.remove_holding_responsible_prompt`
      }), null, () => this.removeSelectedHoldingResponsible(index),
      () => this.setState({ alert: false }),
      true, this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.yes`,
        defaultMessage: `${config.labelBasePath}.main.yes`
      }), this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.no`,
        defaultMessage: `${config.labelBasePath}.main.no`
      }))
    })
  }

  removeSelectedHoldingResponsible = index => {
    let selectedHoldingResponsible = []
    if (index === 0 && this.state.selectedHoldingResponsible.length === 1) {
      this.setState({ selectedHoldingResponsible: [] })
    } else {
      this.state.selectedHoldingResponsible.splice(index, 1)
      selectedHoldingResponsible.push(...this.state.selectedHoldingResponsible)
      this.setState({ selectedHoldingResponsible })
    }
  }

  showHoldingResponsibleForm = holdingResponsibleObjId => {
    const formId = `HOLDING_RESPONSIBLE_DETAILS_FORM_${holdingResponsibleObjId}`
    const params = []
    params.push({
      PARAM_NAME: 'formWeWant',
      PARAM_VALUE: 'HOLDING_RESPONSIBLE'
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: this.props.svSession
    }, {
      PARAM_NAME: 'table_name',
      PARAM_VALUE: 'HOLDING_RESPONSIBLE'
    }, {
      PARAM_NAME: 'object_id',
      PARAM_VALUE: holdingResponsibleObjId
    })

    const holdingResponsibleDetailsForm = FormManager.generateForm(
      formId, formId, params, 'formData',
      'GET_FORM_BUILDER', 'GET_UISCHEMA', 'GET_TABLE_FORMDATA',
      this.closeHoldingResponsibleForm, null, null, null, null, null, true,
      () => this.closeHoldingResponsibleForm(), undefined, undefined,
      undefined, undefined, undefined
    )
    this.setState({ showHoldingResponsibleForm: holdingResponsibleDetailsForm })
  }

  closeHoldingResponsibleForm = () => {
    this.setState({ showHoldingResponsibleForm: undefined })
  }

  sendReply = selectedMessage => {
    const { currentUserObjId } = this.props
    const {
      containedMessages, recipientsObjIds, ccRecipientsObjIds, bccRecipientsObjIds,
      selectedAnimal, selectedHolding, selectedHoldingResponsible
    } = this.state
    let recipientsToSend = []
    if (recipientsObjIds.length === 1 && recipientsObjIds.includes(parseInt(currentUserObjId))) {
      containedMessages.forEach(message => {
        if (parseInt(message['MESSAGE.USER_ID']) !== parseInt(currentUserObjId)) {
          recipientsToSend = [parseInt(message['MESSAGE.USER_ID'])]
        }
      })
    } else {
      recipientsToSend = recipientsObjIds
    }
    const ccRecipientsToSend = isValidArray(ccRecipientsObjIds, 1) ? ccRecipientsObjIds : []
    const bccRecipientsToSend = isValidArray(bccRecipientsObjIds, 1) ? bccRecipientsObjIds : []
    let msgAttachment = []
    if (isValidArray(selectedAnimal, 1)) {
      selectedAnimal.forEach(animal => msgAttachment.push({
        NAME: animal['ANIMAL.ANIMAL_ID'],
        ATCH_OBJ_ID: animal['ANIMAL.OBJECT_ID'],
        ATCH_OBJ_TYPE: animal['ANIMAL.OBJECT_TYPE']
      }))
      msgAttachment = [...msgAttachment]
    }
    if (isValidArray(selectedHolding, 1)) {
      selectedHolding.forEach(holding => msgAttachment.push({
        NAME: holding['HOLDING.PIC'],
        ATCH_OBJ_ID: holding['HOLDING.OBJECT_ID'],
        ATCH_OBJ_TYPE: holding['HOLDING.OBJECT_TYPE']
      }))
      msgAttachment = [...msgAttachment]
    }
    if (isValidArray(selectedHoldingResponsible, 1)) {
      selectedHoldingResponsible.forEach(holdingResponsible => msgAttachment.push({
        NAME: holdingResponsible['HOLDING_RESPONSIBLE.NAT_REG_NUMBER'],
        ATCH_OBJ_ID: holdingResponsible['HOLDING_RESPONSIBLE.OBJECT_ID'],
        ATCH_OBJ_TYPE: holdingResponsible['HOLDING_RESPONSIBLE.OBJECT_TYPE']
      }))
      msgAttachment = [...msgAttachment]
    }
    this.setState({ loading: true })
    let data = new URLSearchParams()
    data.append('SUBJECT_OBJ_ID', selectedMessage.SUBJECT.object_id)
    data.append('SUBJECT_TITLE', '')
    data.append('SUBJECT_PRIORITY', '')
    data.append('MSG_PRIORITY', '')
    data.append('SUBJECT_CATEGORY', '')
    data.append('SUBJECT_MODULE_NAME', '')
    data.append('MSG_TEXT', this.state.replyText)
    data.append('MSG_TO', JSON.stringify(recipientsToSend))
    data.append('MSG_CC', JSON.stringify(ccRecipientsToSend))
    data.append('MSG_BCC', JSON.stringify(bccRecipientsToSend))
    data.append('MSG_ATTACHMENT', JSON.stringify(msgAttachment))
    data.append('ORG_UNIT_OBJ_ID', 0)

    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.CUSTOM_CREATE_MESSAGE
    let url = `${server}${verbPath}`
    url = url.replace('%session', this.props.session)
    const reqConfig = { method: 'post', url, data }
    axios(reqConfig).then(res => {
      const resType = formatAlertType(res.data)
      const resLabel = this.context.intl.formatMessage({
        id: res.data, defaultMessage: res.data
      })
      this.setState({
        alert: alertUser(true, resType, resLabel, null, () => {
          this.getAllMessages(selectedMessage.SUBJECT.object_id)
          this.setState({
            showReplyTextarea: false,
            replyText: '',
            showAttachmentsSelectors: false,
            selectedAnimal: [],
            selectedHolding: [],
            selectedHoldingResponsible: []
          })
        }),
        loading: false
      })
    }).catch(err => {
      console.error(err)
      this.setState({ alert: alertUser(true, 'error', err), loading: false })
    })
  }

  render () {
    const { selectedMessage } = this.props
    const {
      loading, recipients, ccRecipients, bccRecipients,
      containedMessages, showReplyTextarea, replyText, showAttachmentsSelectors
    } = this.state

    return (
      <div className={style['message-holder']}>
        <button
          className={`btn ${style['back-btn']}`} style={{ marginTop: '1.5rem' }}
          onClick={() => this.props.handleBackButton()}
        >&lt;</button>
        {selectedMessage &&
          <div id='subjectInfo'>
            <div id='subjectTitle'>
              <h1 className={style['subject-title']}>{selectedMessage.SUBJECT.TITLE}</h1>
            </div>
            <hr style={{ marginTop: '0', marginBottom: '5px' }} />
            <div id='additionalInfo' className={style['flex-container']}>
              <h4 className={style['flex-container-item']}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.subject.category`,
                  defaultMessage: `${config.labelBasePath}.main.subject.category`
                })}&#58; <strong>{selectedMessage.SUBJECT.CATEGORY}</strong>
              </h4>
              <h4 className={style['flex-container-item']}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.subject.priority`,
                  defaultMessage: `${config.labelBasePath}.main.subject.priority`
                })}&#58; <strong className={`${style['priority-heading-' + selectedMessage.SUBJECT.PRIORITY.toLowerCase()]}`}>
                  {selectedMessage.SUBJECT.PRIORITY}
                </strong>
              </h4>
              <h4 className={style['flex-container-item']}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.subject.module_name`,
                  defaultMessage: `${config.labelBasePath}.main.subject.module_name`
                })}&#58; <strong>{selectedMessage.SUBJECT.MODULE_NAME}</strong>
              </h4>
            </div>
            {recipients && isValidArray(recipients, 1) &&
              <div id='recipientsInfo' className={style['flex-container']}>
                <h4 className={style['flex-container-item']}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.grid_labels.message.assigned_to`,
                    defaultMessage: `${config.labelBasePath}.grid_labels.message.assigned_to`
                  })}&#58; <strong>{insertSpaceAfterAChar(recipients.toString(), ',')}</strong>
                </h4>
              </div>
            }
            {ccRecipients && isValidArray(ccRecipients, 1) &&
              <div id='ccRecipientsInfo' className={style['flex-container']}>
                <h4 className={style['flex-container-item']}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.message.cc`,
                    defaultMessage: `${config.labelBasePath}.message.cc`
                  })}&#58; <strong>{insertSpaceAfterAChar(ccRecipients.toString(), ',')}</strong>
                </h4>
              </div>
            }
            {bccRecipients && isValidArray(bccRecipients, 1) &&
              <div id='bccRecipientsInfo' className={style['flex-container']}>
                <h4 className={style['flex-container-item']}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.message.bcc`,
                    defaultMessage: `${config.labelBasePath}.message.bcc`
                  })}&#58; <strong>{insertSpaceAfterAChar(bccRecipients.toString(), ',')}</strong>
                </h4>
              </div>
            }
          </div>
        }
        {containedMessages && <div className={style['messages']} style={{ maxHeight: showReplyTextarea ? '30vh' : '45vh' }}>
          {containedMessages.map((message, index) => {
            return <Message key={index + 1} message={message} index={index + 1} />
          })}
        </div>}
        {!showReplyTextarea && <button className={`btn ${style['reply-btn']}`} onClick={() => this.showReplyTextarea()}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.message.reply`,
            defaultMessage: `${config.labelBasePath}.message.reply`
          })}
        </button>}
        <br />
        {showReplyTextarea && <div style={{ display: 'inline-grid', color: '#ffffff' }}>
          <textarea
            name='replyText' id='replyText' className={style['reply-textarea']}
            onChange={this.handleReplyChange} value={replyText}
            placeholder={this.context.intl.formatMessage({
              id: `${config.labelBasePath}.message.type_your_message_here`,
              defaultMessage: `${config.labelBasePath}.message.type_your_message_here`
            })}
          />
          <div id='attachments_icon_container' className={style['flex-container']} style={{ marginRight: 'auto' }}>
            {!showAttachmentsSelectors
              ? <i
                className={`fa fa-paperclip ${style['attachment-icon']}`}
                aria-hidden='true'
                style={{ cursor: 'pointer', fontSize: 'xxx-large', marginTop: '5px' }}
                onClick={this.showAttachmentSelectors}
                title={this.context.intl.formatMessage({
                  id: config.labelBasePath + '.message.click_here_to_add_attachments',
                  defaultMessage: config.labelBasePath + '.message.click_here_to_add_attachments'
                })}
              />
              : <i
                className={`fa fa-trash ${style['attachment-icon']}`}
                aria-hidden='true'
                style={{ cursor: 'pointer', fontSize: 'xxx-large', marginTop: '5px' }}
                onClick={this.showAttachmentSelectors}
                title={this.context.intl.formatMessage({
                  id: config.labelBasePath + '.message.click_here_to_remove_attachments',
                  defaultMessage: config.labelBasePath + '.message.click_here_to_remove_attachments'
                })}
              />
            }
            {showAttachmentsSelectors && <div className={style['attachment-selectors']} style={{ marginLeft: '1rem' }}>
              {!isValidArray(this.state.selectedAnimal, 1)
                ? <p className={style['attachment-selector']} onClick={this.handleAnimalsModal}>
                  {this.context.intl.formatMessage({
                    id: config.labelBasePath + '.message.attach_animal',
                    defaultMessage: config.labelBasePath + '.message.attach_animal'
                  })}
                </p>
                : <div style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                  {this.context.intl.formatMessage({
                    id: config.labelBasePath + '.main.animal',
                    defaultMessage: config.labelBasePath + '.main.animal'
                  })}: {this.state.selectedAnimal.map((animal, index) => (
                    <React.Fragment>
                      <p
                        key={index} id={index}
                        className={style['attachment-link']} style={{ marginLeft: '5px' }}
                        onClick={() => this.showAnimalForm(animal['ANIMAL.OBJECT_ID'])}
                        title={this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.click_here_for_animal_details',
                          defaultMessage: config.labelBasePath + '.message.click_here_for_animal_details'
                        })}
                      >
                        {animal['ANIMAL.ANIMAL_ID']}
                      </p>
                      <i
                        className={`fa fa-trash ${style['attachment-icon']}`}
                        aria-hidden='true'
                        style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                        onClick={() => this.removeSelectedAnimalPrompt(index)}
                        title={this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.click_here_to_remove_attached_animal',
                          defaultMessage: config.labelBasePath + '.message.click_here_to_remove_attached_animal'
                        })}
                      />
                    </React.Fragment>
                  ))}
                  {!isValidArray(this.state.selectedAnimal, 5) &&
                    <i
                      className={`fa fa-plus ${style['attachment-icon']}`}
                      aria-hidden='true'
                      style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                      onClick={this.handleAnimalsModal}
                      title={this.context.intl.formatMessage({
                        id: config.labelBasePath + '.message.click_here_to_attach_another_animal',
                        defaultMessage: config.labelBasePath + '.message.click_here_to_attach_another_animal'
                      })}
                    />
                  }
                </div>
              }
              {!isValidArray(this.state.selectedHolding, 1)
                ? <p className={style['attachment-selector']} onClick={this.handleHoldingsModal}>
                  {this.context.intl.formatMessage({
                    id: config.labelBasePath + '.message.attach_holding',
                    defaultMessage: config.labelBasePath + '.message.attach_holding'
                  })}
                </p>
                : <div style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                  {this.context.intl.formatMessage({
                    id: config.labelBasePath + '.main.holding.general',
                    defaultMessage: config.labelBasePath + '.main.holding.general'
                  })}: {this.state.selectedHolding.map((holding, index) => (
                    <React.Fragment>
                      <p
                        key={index} id={index}
                        className={style['attachment-link']} style={{ marginLeft: '5px' }}
                        onClick={() => this.showHoldingForm(holding['HOLDING.OBJECT_ID'])}
                        title={this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.click_here_for_holding_details',
                          defaultMessage: config.labelBasePath + '.message.click_here_for_holding_details'
                        })}
                      >
                        {holding['HOLDING.PIC']}
                      </p>
                      <i
                        className={`fa fa-trash ${style['attachment-icon']}`}
                        aria-hidden='true'
                        style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                        onClick={() => this.removeSelectedHoldingPrompt(index)}
                        title={this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.click_here_to_remove_attached_holding',
                          defaultMessage: config.labelBasePath + '.message.click_here_to_remove_attached_holding'
                        })}
                      />
                    </React.Fragment>
                  ))}
                  {!isValidArray(this.state.selectedHolding, 5) &&
                    <i
                      className={`fa fa-plus ${style['attachment-icon']}`}
                      aria-hidden='true'
                      style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                      onClick={this.handleHoldingsModal}
                      title={this.context.intl.formatMessage({
                        id: config.labelBasePath + '.message.click_here_to_attach_another_holding',
                        defaultMessage: config.labelBasePath + '.message.click_here_to_attach_another_holding'
                      })}
                    />
                  }
                </div>
              }
              {!isValidArray(this.state.selectedHoldingResponsible, 1)
                ? <p className={style['attachment-selector']} onClick={this.handleHoldingResponsiblesModal}>
                  {this.context.intl.formatMessage({
                    id: config.labelBasePath + '.message.attach_holding_responsible',
                    defaultMessage: config.labelBasePath + '.message.attach_holding_responsible'
                  })}
                </p>
                : <div style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                  {this.context.intl.formatMessage({
                    id: config.labelBasePath + '.main.holding_responsible.general',
                    defaultMessage: config.labelBasePath + '.main.holding_responsible.general'
                  })}: {this.state.selectedHoldingResponsible.map((holdingResponsible, index) => (
                    <React.Fragment>
                      <p
                        key={index} id={index}
                        className={style['attachment-link']} style={{ marginLeft: '5px' }}
                        onClick={() => this.showHoldingResponsibleForm(holdingResponsible['HOLDING_RESPONSIBLE.OBJECT_ID'])}
                        title={this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.click_here_for_holding_responsible_details',
                          defaultMessage: config.labelBasePath + '.message.click_here_for_holding_responsible_details'
                        })}
                      >
                        {holdingResponsible['HOLDING_RESPONSIBLE.NAT_REG_NUMBER']}
                      </p>
                      <i
                        className={`fa fa-trash ${style['attachment-icon']}`}
                        aria-hidden='true'
                        style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                        onClick={() => this.removeSelectedHoldingResponsiblePrompt(index)}
                        title={this.context.intl.formatMessage({
                          id: config.labelBasePath + '.message.click_here_to_remove_attached_holding_responsible',
                          defaultMessage: config.labelBasePath + '.message.click_here_to_remove_attached_holding_responsible'
                        })}
                      />
                    </React.Fragment>
                  ))}
                  {!isValidArray(this.state.selectedHoldingResponsible, 5) &&
                    <i
                      className={`fa fa-plus ${style['attachment-icon']}`}
                      aria-hidden='true'
                      style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                      onClick={this.handleHoldingResponsiblesModal}
                      title={this.context.intl.formatMessage({
                        id: config.labelBasePath + '.message.click_here_to_attach_another_holding_responsible',
                        defaultMessage: config.labelBasePath + '.message.click_here_to_attach_another_holding_responsible'
                      })}
                    />
                  }
                </div>
              }
            </div>}
          </div>
          <div style={{ display: 'inline-flex' }}>
            <button
              className={`btn btn-sm ${style['send-reply-btn']}`}
              style={{ width: '40%', marginRight: '1rem', marginLeft: '5rem' }}
              onClick={() => this.setState({ showReplyTextarea: false, replyText: '' })}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.forms.cancel`,
                defaultMessage: `${config.labelBasePath}.main.forms.cancel`
              })}
            </button>
            <button
              className={`btn btn-sm ${style['send-reply-btn']}`}
              style={{ width: '40%' }}
              disabled={!replyText}
              onClick={() => this.sendReply(this.props.selectedMessage)}
            >
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.message.send_reply`,
                defaultMessage: `${config.labelBasePath}.message.send_reply`
              })}
            </button>
          </div>
        </div>}
        {loading && <Loading />}
        {this.state.showAnimalsModal && <GridInModalLinkObjects
          loadFromParent
          key='ANIMAL_ATTACHMENT_GRID'
          linkedTable='ANIMAL'
          onRowSelect={this.chooseAnimal}
          closeModal={this.handleAnimalsModal}
        />}
        {this.state.showAnimalForm && <div id='form_modal' className='modal' style={{ display: 'block', color: '#ffffff', textAlign: 'center' }}>
          <div id='form_modal_content' className='modal-content'>
            <div className='modal-header'>
              <button id='modal_close_btn' type='button' className='close' onClick={this.closeAnimalsForm} data-dismiss='modal'>&times;</button>
            </div>
            <div id='form_modal_body' className='modal-body'>
              {this.state.showAnimalForm}
            </div>
          </div>
        </div>}
        {this.state.showHoldingsModal && <GridInModalLinkObjects
          loadFromParent
          key='HOLDING_ATTACHMENT_GRID'
          linkedTable='HOLDING'
          onRowSelect={this.chooseHolding}
          closeModal={this.handleHoldingsModal}
          gridTypeCall='GET_TABLE_WITH_LIKE_FILTER_2'
        />}
        {this.state.showHoldingForm && <div id='form_modal' className='modal' style={{ display: 'block', color: '#ffffff', textAlign: 'center' }}>
          <div id='form_modal_content' className='modal-content'>
            <div className='modal-header'>
              <button id='modal_close_btn' type='button' className='close' onClick={this.closeHoldingForm} data-dismiss='modal'>&times;</button>
            </div>
            <div id='form_modal_body' className='modal-body'>
              {this.state.showHoldingForm}
            </div>
          </div>
        </div>}
        {this.state.showHoldingResponsiblesModal && <GridInModalLinkObjects
          loadFromParent
          key='HOLDING_RESPONSIBLE_ATTACHMENT_GRID'
          linkedTable='HOLDING_RESPONSIBLE'
          onRowSelect={this.chooseHoldingResponsible}
          closeModal={this.handleHoldingResponsiblesModal}
        />}
        {this.state.showHoldingResponsibleForm && <div id='form_modal' className='modal' style={{ display: 'block', color: '#ffffff', textAlign: 'center' }}>
          <div id='form_modal_content' className='modal-content'>
            <div className='modal-header'>
              <button id='modal_close_btn' type='button' className='close' onClick={this.closeHoldingResponsibleForm} data-dismiss='modal'>&times;</button>
            </div>
            <div id='form_modal_body' className='modal-body'>
              {this.state.showHoldingResponsibleForm}
            </div>
          </div>
        </div>}
      </div>
    )
  }
}

MessagesHolder.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  locale: state.intl.locale
})

export default connect(mapStateToProps)(MessagesHolder)
