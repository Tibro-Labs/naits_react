import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { alertUser } from 'tibro-components'
import { Loading } from 'components/ComponentsIndex'
import * as config from 'config/config.js'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import { setInputFilter, calcDifference, formatAlertType } from 'functions/utils'

class CheckRangeValidity extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: undefined,
      loading: false,
      showForm: false,
      checkValidityForm: undefined,
      tagTypes: ['7', '1', '6', '4', '3', '2', '5'],
      tagTypesLabels: ['pet_rfid', 'cattle', 'pet', 'pig_tag', 'sheep_tag', 'small_ruminants', 'ungulates'],
      selectedTagType: '',
      rangeFromInput: '',
      rangeToInput: ''
    }
  }

  componentDidMount () {
    this.setState({ selectedTagType: '7' })
  }

  componentDidUpdate (nextProps, nextState) {
    if (this.state.showForm !== nextState.showForm) {
      const rangeFromInput = document.getElementById('rangeFromInput')
      const rangeToInput = document.getElementById('rangeToInput')
      if (rangeFromInput) {
        setInputFilter(rangeFromInput, function (value) {
          return /^\d*$/.test(value)
        })
      }
      if (rangeToInput) {
        setInputFilter(rangeToInput, function (value) {
          return /^\d*$/.test(value)
        })
      }
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  showForm = () => {
    const { tagTypes, tagTypesLabels } = this.state

    const checkValidityForm = (
      <div id='form_modal' className='modal' style={{ display: 'block' }}>
        <div id='form_modal_content' className='modal-content disable_scroll_bar'>
          <div className='modal-header'>
            <button id='modal_close_btn' type='button' className='close' onClick={this.closeForm}>&times;</button>
          </div>
          <div id='form_modal_body' className='modal-body'>
            <div
              id='check_range_validity_form'
              className='form-test custom-modal-content disable_scroll_bar container'
              style={{ color: '#ffffff' }}
            >
              <div className='form-group field field-object' style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <fieldset>
                  <legend>
                    {this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.form_labels.transfer_range.info`,
                      defaultMessage: `${config.labelBasePath}.form_labels.transfer_range.info`
                    })}
                  </legend>
                  <div className='form-group field field-string'>
                    <label htmlFor='rangeFromInput'>
                      {this.context.intl.formatMessage({
                        id: `${config.labelBasePath}.main.range_from`,
                        defaultMessage: `${config.labelBasePath}.main.range_from`
                      })}*
                    </label>
                    <input
                      type='text'
                      id='rangeFromInput'
                      name='rangeFromInput'
                      onChange={this.handleChange}
                      className='form-control'
                      style={{ width: '163px', marginTop: '2px' }}
                    />
                  </div>
                  <div className='form-group field field-string'>
                    <label htmlFor='rangeToInput'>
                      {this.context.intl.formatMessage({
                        id: `${config.labelBasePath}.main.range_to`,
                        defaultMessage: `${config.labelBasePath}.main.range_to`
                      })}*
                    </label>
                    <input
                      type='text'
                      id='rangeToInput'
                      name='rangeToInput'
                      onChange={this.handleChange}
                      className='form-control'
                      style={{ width: '163px', marginTop: '2px' }}
                    />
                  </div>
                  <div className='form-group field field-string'>
                    <label htmlFor='tagType'>
                      {this.context.intl.formatMessage(
                        {
                          id: `${config.labelBasePath}.main.inv_item_tag_type`,
                          defaultMessage: `${config.labelBasePath}.main.inv_item_tag_type`
                        }
                      )}*
                    </label>
                    <select
                      id='tagType'
                      className='form-control'
                      style={{
                        backgroundColor: '#e3eedd',
                        color: '#000000',
                        marginTop: '2px',
                        width: 'auto'
                      }}
                      name='selectedTagType'
                      onChange={this.handleChange}
                    >
                      {tagTypes.map((tag, index) => {
                        return <option key={tag} value={tag}>
                          {this.context.intl.formatMessage(
                            {
                              id: `${config.labelBasePath}.tag.${tagTypesLabels[index]}`,
                              defaultMessage: `${config.labelBasePath}.tag.${tagTypesLabels[index]}`
                            }
                          )}
                        </option>
                      })}
                    </select>
                  </div>
                </fieldset>
              </div>
              <div style={{ float: 'right', marginRight: '5px' }}>
                <button id='checkRangeValidity' className='btn-success btn_save_form' onClick={this.checkRangeValidityPrompt}>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.check_range_validity`,
                    defaultMessage: `${config.labelBasePath}.main.check_range_validity`
                  })}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

    this.setState({ showForm: true, checkValidityForm })
  }

  closeForm = () => {
    this.setState({
      showForm: false,
      checkValidityForm: undefined,
      rangeFromInput: '',
      rangeToInput: '',
      selectedTagType: '7'
    })
  }

  checkRangeValidityPrompt = () => {
    const { rangeFromInput, rangeToInput } = this.state
    if ((!rangeFromInput && !rangeToInput) || !rangeFromInput || !rangeToInput) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.add_value_for_all_inputs_with_asterisk`,
            defaultMessage: `${config.labelBasePath}.alert.add_value_for_all_inputs_with_asterisk`
          }), null, () => { this.close() }
        )
      })
    } else if (parseInt(rangeToInput) < parseInt(rangeFromInput)) {
      this.setState({
        alert: alertUser(
          true,
          'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.error.startTagIdCannotBeLargerThanEndTagId`,
            defaultMessage: `${config.labelBasePath}.error.startTagIdCannotBeLargerThanEndTagId`
          }), null, () => { this.close() }
        )
      })
    } else {
      const rangeDiff = calcDifference(parseInt(rangeToInput), parseInt(rangeFromInput))
      if (rangeDiff > 2000) {
        this.setState({
          alert: alertUser(
            true,
            'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.error.checkValidityRangeIsOverLimit`,
              defaultMessage: `${config.labelBasePath}.error.checkValidityRangeIsOverLimit`
            }), null, () => this.setState({ alert: alertUser(false, 'info', '') })
          )
        })
      } else {
        this.setState({
          alert: alertUser(
            true,
            'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.check_range_validity`,
              defaultMessage: `${config.labelBasePath}.alert.check_range_validity`
            }), null, () => { this.checkRangeValidity() }, () => { this.close() }, true,
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.yes`,
              defaultMessage: `${config.labelBasePath}.main.yes`
            }),
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.no`,
              defaultMessage: `${config.labelBasePath}.main.no`
            })
          )
        })
      }
    }
  }

  checkRangeValidity = () => {
    this.setState({ loading: true })
    const { rangeFromInput, rangeToInput, selectedTagType } = this.state
    let url = config.svConfig.triglavRestVerbs.CHECK_RANGE_VALIDITY
    url = url.replace('%session', this.props.session)
    url = url.replace('%orgUnitId', this.props.parentId)
    url = url.replace('%startTagId', rangeFromInput)
    url = url.replace('%endTagId', rangeToInput)
    url = url.replace('%tagType', selectedTagType)
    axios.get(`${config.svConfig.restSvcBaseUrl}${url}`).then(res => {
      if (res.data) {
        const resType = formatAlertType(res.data)
        if (res.data.includes('naits.error.senderDoesNotHaveInventoryItemsDefinedInTheRange')) {
          const splitRes = res.data.split('[')
          this.setState({
            alert: alertUser(
              true, resType, this.context.intl.formatMessage({
                id: splitRes[0],
                defaultMessage: splitRes[0]
              }), splitRes[1].slice(0, -1)
            ),
            loading: false
          })
        } else {
          this.setState({
            alert: alertUser(
              true, resType, this.context.intl.formatMessage({
                id: res.data,
                defaultMessage: res.data
              })
            ),
            loading: false
          })
        }
      }
    }).catch(err => {
      console.error(err)
      this.setState({
        alert: alertUser(true, 'error', err)
      })
    })
  }

  render () {
    return (
      <React.Fragment>
        <div
          id='check_range_validity_container'
          className={styles.container}
          style={{ cursor: 'pointer', marginRight: '7px', color: 'white', width: '155px' }}
          onClick={() => this.showForm()}
        >
          <p style={{ marginLeft: '13px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.check_range_validity`,
              defaultMessage: `${config.labelBasePath}.main.check_range_validity`
            })}
          </p>
          <div id='check_range_validity' className={styles['gauge-container']} style={{ marginRight: '-18px', width: '75px' }}>
            <img
              id='check_range_validity_img' className={style.actionImg} style={{ height: '45px', marginTop: '7%' }}
              src='/naits/img/massActionsIcons/accept.png'
            />
          </div>
        </div>
        {this.state.loading && <Loading />}
        {this.state.showForm && ReactDOM.createPortal(this.state.checkValidityForm, document.getElementById('app'))}
      </React.Fragment>
    )
  }
}

CheckRangeValidity.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(CheckRangeValidity)
