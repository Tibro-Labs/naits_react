import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as config from 'config/config.js'
import { GridManager, Loading } from 'components/ComponentsIndex'
import consoleStyle from 'components/AppComponents/Functional/AdminConsole/AdminConsole.module.css'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { formatAlertType, convertToShortDate } from 'functions/utils'
import DatePicker from 'react-date-picker'
import { earTagReplacementAction, replaceEarTag } from 'backend/earTagReplacementAction.js'

class EarTagForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      replacementReasons: ['REPLACED', 'DAMAGED', 'APPLIED_LOST', 'FAULTY', 'WRONG_ENTRY'],
      reasonLabels: ['replaced', 'damaged', 'lost', 'faulty_assigned', 'wrong_entry'],
      newEarTag: 'new_ear_tag',
      textInput: 'note',
      selectedReason: '',
      replacementDate: null
    }
  }

  componentDidMount () {
    this.setState({ selectedReason: 'REPLACED' })
  }

  setDate = (date) => {
    this.setState({ replacementDate: date })
  }

  earTagReplacement = () => {
    const { newEarTag, replacementDate, textInput, selectedReason } = this.state
    const setReplacementDate = convertToShortDate(replacementDate, 'y-m-d')
    const inputNewEarTagContainer = document.getElementById(newEarTag).value
    const inputNoteContainer = document.getElementById(textInput).value
    let objectId
    if (this.props.selectedObjects.length > 0) {
      this.props.selectedObjects.forEach(grid => {
        if (grid.active) {
          objectId = grid.row['ANIMAL.OBJECT_ID']
        }
      })
    }
    function prompt (component, onConfirmCallback) {
      component.setState({
        alert: alertUser(
          true,
          'warning',
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.actions.prompt_text`,
            defaultMessage: `${config.labelBasePath}.actions.prompt_text`
          }) + ' ' + '"' +
          component.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.eartag_replacement`,
            defaultMessage: `${config.labelBasePath}.main.eartag_replacement`
          }) + '"' + '?',
          null,
          onConfirmCallback,
          () => component.setState({ alert: alertUser(false, 'info', '') }),
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

    const setReplacementDateLbl = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.replacementDate`,
      defaultMessage: `${config.labelBasePath}.replacementDate`
    })
    const inputNewEarTagContainerLbl = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.ear_tag_replacement.new_ear_tag`,
      defaultMessage: `${config.labelBasePath}.ear_tag_replacement.new_ear_tag`
    })
    if (setReplacementDate && inputNewEarTagContainer) {
      prompt(this, () => this.props.earTagReplacementAction(
        this.props.svSession, objectId, inputNewEarTagContainer, setReplacementDate,
        selectedReason || 'null', inputNoteContainer || 'null'
      ))
    } else {
      let message = ''
      if (!setReplacementDate) message = message + setReplacementDateLbl + ' '
      if (!inputNewEarTagContainer) message = message + inputNewEarTagContainerLbl + ' '
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.parameters_missing`,
            defaultMessage: `${config.labelBasePath}.alert.parameters_missing`
          }),
          message,
          () => this.setState({ alert: alertUser(false, 'info', '') }))
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if ((this.props.earTagReplacementMessage !== nextProps.earTagReplacementMessage) &&
      nextProps.earTagReplacementMessage) {
      this.setState({
        alert: alertUser(true, formatAlertType(nextProps.earTagReplacementMessage), this.context.intl.formatMessage({
          id: nextProps.earTagReplacementMessage,
          defaultMessage: nextProps.earTagReplacementMessage
        }) || ' ', null,
        () => {
          store.dispatch(replaceEarTag())
        })
      })
    }
    if ((this.props.earTagReplacementError !== nextProps.earTagReplacementError) &&
      nextProps.earTagReplacementError) {
      this.setState({
        alert: alertUser(true, 'error', this.context.intl.formatMessage({
          id: nextProps.earTagReplacementError,
          defaultMessage: nextProps.earTagReplacementError
        }) || ' ', null,
        () => {
          store.dispatch(replaceEarTag())
        })
      })
    }
    this.props.onAlertClose()
    const object = nextProps.selectedObjects.find((element) => {
      return (element.active && element.gridType === nextProps.gridType)
    })

    GridManager.reloadGridData('EAR_TAG_REPLC_' + object.row[nextProps.gridType + '.OBJECT_ID'])
    GridManager.reloadGridData('INVENTORY_ITEM_' + object.row[nextProps.gridType + '.OBJECT_ID'])
  }

  handleReasonSelection = e => {
    this.setState({ selectedReason: e.target.value })
  }

  render () {
    const { loading, replacementDate, replacementReasons, reasonLabels } = this.state
    const nowBtnText = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.now`,
      defaultMessage: `${config.labelBasePath}.main.now`
    })
    return (
      <div id='form_modal' className='modal' style={{ display: 'block' }}>
        <div id='form_modal_content' className='modal-content disable_scroll_bar'>
          {loading && <Loading />}
          <div className='modal-header'>
            <button id='modal_close_btn' type='button' className='close'
              onClick={this.props.closeModal} >&times;</button>
          </div>
          <div id='form_modal_body' className='modal-body'>
            <form
              id='ear_tag_form'
              className='form-test custom-modal-content disable_scroll_bar'
              style={{ height: '450px' }}
            >
              <p id='title' style={{ marginTop: '0.8%', fontSize: '150%' }}>{this.context.intl.formatMessage({
                id: config.labelBasePath + '.ear_tag_replacement',
                defaultMessage: config.labelBasePath + '.ear_tag_replacement'
              })} </p>
              <hr style={{ color: 'white' }} />
              <div
                className={'form-group' + ' ' + consoleStyle.formGroupInline}
                style={{ display: 'flex', marginLeft: '3rem' }}
              >
                <div style={{ marginLeft: '500px' }}>
                  <label htmlFor='new_ear_tag'>
                    {this.context.intl.formatMessage({
                      id: config.labelBasePath + '.ear_tag_replacement.new_ear_tag',
                      defaultMessage: config.labelBasePath + '.ear_tag_replacement.new_ear_tag'
                    })}*
                  </label>
                  <input
                    type='text'
                    id='new_ear_tag'
                    className='form-control'
                    style={{ width: '200px', marginTop: '2px' }}
                    placeholder={this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.register.must_be_integer`,
                      defaultMessage: `${config.labelBasePath}.register.must_be_integer`
                    })}
                  />
                </div>
                <div style={{ marginLeft: '90px' }}>
                  <label htmlFor='replacementReason'>
                    {this.context.intl.formatMessage(
                      {
                        id: `${config.labelBasePath}.form_labels.reason`,
                        defaultMessage: `${config.labelBasePath}.form_labels.reason`
                      }
                    )}
                  </label>
                  <select
                    id='replacementReason'
                    className='form-control'
                    style={{
                      backgroundColor: '#e3eedd',
                      color: '#000000',
                      marginTop: '2px',
                      width: '150px'
                    }}
                    onChange={this.handleReasonSelection}
                  >
                    {replacementReasons.map((reason, index) => {
                      return <option value={reason}>
                        {this.context.intl.formatMessage(
                          {
                            id: `${config.labelBasePath}.ear_tag_replc_reason.${reasonLabels[index]}`,
                            defaultMessage: `${config.labelBasePath}.ear_tag_replc_reason.${reasonLabels[index]}`
                          }
                        )}
                      </option>
                    })}
                  </select>
                </div>
                <div style={{ marginLeft: '90px', marginTop: '5px' }}>
                  <label
                    htmlFor='replacementDate'
                    style={{ position: 'absolute', color: 'white', marginTop: '-5px', marginLeft: '-30px' }}
                  >
                    {this.context.intl.formatMessage(
                      {
                        id: `${config.labelBasePath}.replacementDate`,
                        defaultMessage: `${config.labelBasePath}.replacementDate`
                      }
                    )}*
                  </label>
                  <br />
                  <DatePicker
                    key='replacementDate'
                    required
                    className='datePicker'
                    onChange={this.setDate}
                    value={replacementDate}
                    style={{ marginLeft: '23%', marginTop: '-2.9%' }}
                  />
                  <button
                    id='dateNow'
                    type='button'
                    className='btn-success'
                    style={{
                      position: 'absolute',
                      height: '40px',
                      padding: '7px 12px'
                    }}
                    onClick={() => this.setDate(new Date())} >
                    {nowBtnText}
                  </button>
                </div>
              </div>
              <br />
              <hr style={{ color: 'white' }} />
              <div
                className={'form-group' + ' ' + consoleStyle.formGroupInline}
                style={{ marginRight: '50px' }}
              >
                <label htmlFor='note' style={{ marginLeft: '5rem' }}>
                  {this.context.intl.formatMessage({
                    id: config.labelBasePath + '.note',
                    defaultMessage: config.labelBasePath + '.note'
                  })}
                </label>
                <textarea
                  id='note'
                  className='form-control'
                  style={{ width: '85%', marginLeft: '51px' }}
                />
              </div>
              <div className='form-group' style={{ marginTop: '2%' }}>
                <div
                  id='ear_tag_replacement'
                  className='btn_save_form'
                  onClick={() => this.earTagReplacement()}
                >
                  {this.context.intl.formatMessage({
                    id: config.labelBasePath + '.replace_ear_tag',
                    defaultMessage: config.labelBasePath + '.replace_ear_tag'
                  })}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  earTagReplacementAction: (...params) => {
    dispatch(earTagReplacementAction(...params))
  }
})

EarTagForm.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  selectedObjects: state.gridConfig.gridHierarchy,
  earTagReplacementMessage: state.earTagReplacement.message,
  earTagReplacementError: state.earTagReplacement.error
})

export default connect(mapStateToProps, mapDispatchToProps)(EarTagForm)
