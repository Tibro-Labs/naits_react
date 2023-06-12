import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as config from 'config/config.js'
import { GridManager, Loading } from 'components/ComponentsIndex'
import style from 'components/AppComponents/Functional/EarTagReplacement/EarTagReplacement.module.css'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { formatAlertType, strcmp } from 'functions/utils'
import { earTagReplacementAction, replaceEarTag } from 'backend/earTagReplacementAction.js'

class EarTagForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: undefined,
      loading: false,
      replacementReasons: ['REPLACED', 'DAMAGED', 'APPLIED_LOST', 'FAULTY', 'WRONG_ENTRY'],
      reasonLabels: ['replaced', 'damaged', 'lost', 'faulty_assigned', 'wrong_entry'],
      newEarTag: 'new_ear_tag',
      textInput: 'note',
      selectedReason: '',
      replacementDate: ''
    }
  }

  componentDidMount () {
    this.setState({ selectedReason: 'REPLACED' })
  }

  setDate = date => {
    this.setState({ replacementDate: date })
  }

  earTagReplacement = () => {
    const { newEarTag, replacementDate, textInput, selectedReason } = this.state
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
          () => {
            component.setState({ loading: true })
            onConfirmCallback()
          },
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
    if (replacementDate && inputNewEarTagContainer) {
      prompt(this, () => this.props.earTagReplacementAction(
        this.props.svSession, objectId, inputNewEarTagContainer, replacementDate,
        selectedReason || 'null', inputNoteContainer || 'null'
      ))
    } else {
      let message = ''
      if (!replacementDate) message = message + setReplacementDateLbl + ' '
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
      const responseType = formatAlertType(nextProps.earTagReplacementMessage)
      if (strcmp(responseType, 'success')) {
        this.props.onAlertClose()
      }
      this.setState({
        alert: alertUser(true, responseType, this.context.intl.formatMessage({
          id: nextProps.earTagReplacementMessage,
          defaultMessage: nextProps.earTagReplacementMessage
        }) || ' ', null,
        () => {
          store.dispatch(replaceEarTag())
        }),
        loading: false
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
        }),
        loading: false
      })
    }
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
            <div id='ear_tag_form' className='form-test custom-modal-content disable_scroll_bar'>
              <legend style={{ textAlign: 'center', marginTop: '1rem' }}>
                {this.context.intl.formatMessage({
                  id: config.labelBasePath + '.ear_tag_replacement',
                  defaultMessage: config.labelBasePath + '.ear_tag_replacement'
                })}
              </legend>
              <div className='form-group field field-object' style={{ textAlign: 'center' }}>
                <legend style={{ textAlign: 'center' }}>
                  {this.context.intl.formatMessage({
                    id: config.labelBasePath + '.form_labels.ear_tag_replc.basic_info',
                    defaultMessage: config.labelBasePath + '.form_labels.ear_tag_replc.basic_info'
                  })}
                </legend>
                <fieldset>
                  <div className='form-group field field-string'>
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
                      placeholder={this.context.intl.formatMessage({
                        id: `${config.labelBasePath}.register.must_be_integer`,
                        defaultMessage: `${config.labelBasePath}.register.must_be_integer`
                      })}
                    />
                  </div>
                  <div className='form-group field field-string' style={{ marginLeft: '0.5%' }}>
                    <label htmlFor='replacementReason'>
                      {this.context.intl.formatMessage({
                        id: config.labelBasePath + '.form_labels.reason',
                        defaultMessage: config.labelBasePath + '.form_labels.reason'
                      })}*
                    </label>
                    <select id='replacementReason' className='form-control' onChange={this.handleReasonSelection}>
                      {replacementReasons.map((reason, index) => {
                        return <option value={reason} key={index}>
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
                  <div className='form-group field field-string' style={{ marginLeft: '0.5%' }}>
                    <label htmlFor='replacementDate'>
                      {this.context.intl.formatMessage({
                        id: config.labelBasePath + '.replacementDate',
                        defaultMessage: config.labelBasePath + '.replacementDate'
                      })}*
                    </label>
                    <div id='CustomDateWithNowButton' className={style.CustomDate}>
                      <input type='date' className='form-control' name='replacementDate' id='replacementDate'
                        onChange={(e) => this.setDate(e.target.value)} value={replacementDate}
                      />
                      <button type='button' className='btn-success btn_save_form' id='setDateNowBtn'
                        onClick={() => this.setDate(new Date().toISOString().substr(0, 19).split('T')[0])}
                      >{nowBtnText}</button>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className='form-group field field-object' style={{ textAlign: 'center' }}>
                <legend style={{ textAlign: 'center', marginTop: '1rem' }}>
                  {this.context.intl.formatMessage({
                    id: config.labelBasePath + '.form_labels.ear_tag_replc.additional_info',
                    defaultMessage: config.labelBasePath + '.form_labels.ear_tag_replc.additional_info'
                  })}
                </legend>
                <fieldset>
                  <div className='form-group field field-string'>
                    <label htmlFor='note'>
                      {this.context.intl.formatMessage({
                        id: config.labelBasePath + '.note',
                        defaultMessage: config.labelBasePath + '.note'
                      })}
                    </label>
                    <textarea id='note' className='form-control' />
                  </div>
                </fieldset>
              </div>
              <div style={{ float: 'right', marginRight: '2rem' }}>
                <button id='earTagReplacement' className='btn-success btn_save_form' onClick={this.earTagReplacement}>
                  {this.context.intl.formatMessage({
                    id: config.labelBasePath + '.replace_ear_tag',
                    defaultMessage: config.labelBasePath + '.replace_ear_tag'
                  })}
                </button>
              </div>
            </div>
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
