import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import { Loading } from 'components/ComponentsIndex'
import * as config from 'config/config.js'
import consoleStyle from 'components/AppComponents/Functional/AdminConsole/AdminConsole.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import inputStyle from 'components/AppComponents/Functional/RFIDFile.module.css'
import { formatAlertType } from 'functions/utils'

class RFIDFileUpload extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      showForm: false,
      selectedFile: null,
      isDragging: false,
      loading: false,
      uploadedFileName: '',
      uploadedFileNotes: '',
      uploadedFileSize: 0,
      reRender: false
    }
  }

  componentDidMount () {
    this.dragCounter = 0
    this.getUploadedFileNameAndSize()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.rfidStatusHasChanged !== nextProps.rfidStatusHasChanged) {
      this.setState({ reRender: true })
    }
  }

  showForm = () => {
    this.setState({ showForm: true })
  }

  closeForm = () => {
    this.setState({ alert: false, showForm: false, selectedFile: null })
    store.dispatch({ type: 'RESET_RFID_FILE_UPLOAD' })
  }

  close = () => {
    this.setState({ alert: false })
  }

  getUploadedFileNameAndSize = () => {
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.GET_SV_FILE_PER_DBO
    let url = `${server}${verbPath}`
    url = url.replace('%session', this.props.svSession)
    url = url.replace('%objectId', this.props.objectId)
    url = url.replace('%objectType', this.props.parentTypeId)
    axios.get(url).then(res => {
      if (res.data.FILE_NAME && res.data.FILE_NOTES && res.data.FILE_SIZE) {
        this.setState({
          uploadedFileName: res.data.FILE_NAME,
          uploadedFileNotes: res.data.FILE_NOTES,
          uploadedFileSize: res.data.FILE_SIZE
        })
      }
    }).catch(e => { console.error(e) })
  }

  handleFileSelection = e => {
    const regEx = /^.*\.(csv|CSV|txt|TXT)$/
    const fileName = e.target.files[0].name
    if (!regEx.exec(fileName)) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.only_csv_and_txt_files_allowed`,
            defaultMessage: `${config.labelBasePath}.alert.only_csv_and_txt_files_allowed`
          }), null, () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    } else {
      this.setState({ selectedFile: e.target.files[0] })
    }
  }

  handleDrag = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  handleDragIn = e => {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ isDragging: true })
    }
  }

  handleDragOut = e => {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter--
    if (this.dragCounter > 0) return
    this.setState({ isDragging: false })
  }

  handleDrop = e => {
    const regEx = /^.*\.(csv|CSV|txt|TXT)$/
    e.preventDefault()
    e.stopPropagation()
    this.setState({ isDragging: false })
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileName = e.dataTransfer.files[0].name
      if (!regEx.exec(fileName)) {
        this.setState({
          alert: alertUser(true, 'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.only_csv_and_txt_files_allowed`,
              defaultMessage: `${config.labelBasePath}.alert.only_csv_and_txt_files_allowed`
            }), null, () => this.setState({ alert: alertUser(false, 'info', '') })
          )
        })
      } else {
        this.setState({ selectedFile: e.dataTransfer.files[0] })
      }
      e.dataTransfer.clearData()
      this.dragCounter = 0
    }
  }

  handleSubmit = () => {
    if (!this.state.selectedFile) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_file_selected`,
            defaultMessage: `${config.labelBasePath}.alert.no_file_selected`
          }), null, () => this.setState({ alert: alertUser(false, 'info', '') })
        )
      })
    } else {
      if (!this.state.uploadedFileName) {
        this.setState({
          alert: alertUser(true, 'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.file_upload_prompt`,
              defaultMessage: `${config.labelBasePath}.alert.file_upload_prompt`
            }), null, () => this.uploadFile(), () => this.close(), true,
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
      } else {
        this.setState({
          alert: alertUser(true, 'warning',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.alert.file_upload_rewrite_prompt`,
              defaultMessage: `${config.labelBasePath}.alert.file_upload_rewrite_prompt`
            }), null, () => this.uploadFile(), () => this.close(), true,
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

  uploadFile = () => {
    this.setState({ loading: true })
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.FILE_UPLOAD
    let url = `${server}${verbPath}`
    url = url.replace('%session', this.props.svSession)
    url = url.replace('%objectId', this.props.objectId)
    const formData = new FormData()
    formData.append('file', this.state.selectedFile)
    axios.post(url, formData).then(res => {
      store.dispatch({ type: 'RFID_FILE_HAS_BEEN_UPLOADED' })
      const responseType = formatAlertType(res.data)
      this.setState({
        loading: false,
        alert: alertUser(
          true, responseType,
          this.context.intl.formatMessage({
            id: res.data,
            defaultMessage: res.data
          }), null, () => this.closeForm()
        )
      })
      this.getUploadedFileNameAndSize()
    }).catch(err => {
      this.setState({
        loading: false,
        alert: alertUser(
          true, 'error',
          this.context.intl.formatMessage({
            id: err,
            defaultMessage: err
          }), null, () => this.close()
        )
      })
    })
  }

  render () {
    const form = (
      <div
        id='form_modal'
        className='modal'
        style={{
          display: 'block',
          height: '55%',
          width: '40%',
          marginLeft: '30%',
          marginTop: '10rem',
          backgroundColor: 'transparent'
        }}
      >
        <div
          id='form_modal_content'
          className='modal-content disable_scroll_bar'
          onDragEnter={this.handleDragIn}
          onDragLeave={this.handleDragOut}
          onDragOver={this.handleDrag}
          onDrop={this.handleDrop}
        >
          <div className='modal-header'>
            <button id='modal_close_btn' type='button' className='close'
              onClick={this.closeForm} >&times;</button>
          </div>
          <div id='form_modal_body' className='modal-body'>
            <div
              id='rfid_file_upload_form'
              className='form-test custom-modal-content disable_scroll_bar'
              style={{ height: '400px', color: '#ffffff' }}
            >
              <p id='title' style={{ marginTop: '0.8%', fontSize: '150%', textAlign: 'center' }}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.rfid_file_upload`,
                  defaultMessage: `${config.labelBasePath}.main.rfid_file_upload`
                })}
              </p>
              <hr style={{ color: 'white' }} />
              <div
                className={`form-group ${consoleStyle.formGroupInline}`}
                style={{ display: 'flex', marginLeft: '13rem', marginTop: '2.5rem' }}
              >
                <div style={{ textAlign: 'center', marginTop: '1rem', height: 'fit-content' }}>
                  <input
                    type='file'
                    id='uploadFileInput'
                    name='uploadFileInput'
                    accept='.csv'
                    className={inputStyle.fileInput}
                    style={{ display: 'none' }}
                    onChange={this.handleFileSelection}
                  />
                  <label htmlFor='uploadFileInput'>
                    {this.state.selectedFile
                      ? <React.Fragment>
                        {this.context.intl.formatMessage({
                          id: `${config.labelBasePath}.main.file_name`,
                          defaultMessage: `${config.labelBasePath}.main.file_name`
                        })}: {this.state.selectedFile.name}
                        <br />
                        {this.context.intl.formatMessage({
                          id: `${config.labelBasePath}.main.file_size`,
                          defaultMessage: `${config.labelBasePath}.main.file_size`
                        })}: {(this.state.selectedFile.size / Math.pow(1024, 1)).toFixed(3)} KB
                      </React.Fragment>
                      : this.context.intl.formatMessage({
                        id: `${config.labelBasePath}.main.drop_or_click_to_select_file`,
                        defaultMessage: `${config.labelBasePath}.main.drop_or_click_to_select_file`
                      })
                    }
                  </label>
                </div>
              </div>
              <div style={{ marginTop: '2rem', textAlign: 'center', marginRight: '5px' }}>
                <button
                  id='uploadFile'
                  className='btn btn-success'
                  onClick={this.handleSubmit}
                >
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.main.upload_selected_file`,
                    defaultMessage: `${config.labelBasePath}.main.upload_selected_file`
                  })}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

    const currentRfidStatus = this.props.componentStack[0].row['RFID.STATUS']
    return (
      <React.Fragment>
        {this.state.loading && <Loading />}
        <div
          id='rfid_file_upload_container'
          className={styles.container}
          style={{
            cursor: 'pointer',
            marginRight: '7px',
            color: currentRfidStatus === 'PROCESSED' ? '#66717E' : '#FFFFFF',
            pointerEvents: currentRfidStatus === 'PROCESSED' ? 'none' : null,
            backgroundColor: currentRfidStatus === 'PROCESSED' ? '#333333' : 'rgba(36, 19, 8, 0.9)'
          }}
          onClick={this.showForm}
        >
          <p>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.rfid_file_upload`,
              defaultMessage: `${config.labelBasePath}.main.rfid_file_upload`
            })}
          </p>
          <div id='rfid_file_upload' className={styles['gauge-container']}>
            <svg
              viewBox='0 0 296.999 296.999'
              className={styles.svgUtil}
              style={{ fill: currentRfidStatus === 'PROCESSED' ? '#66717E' : '#ffffff' }}
            >
              <g>
                <g>
                  <path d='M222.312,58.625c-4.286,0-8.566,0.371-12.793,1.107c-15.427-23.63-41.682-38.013-70.246-38.013
                    c-35.722,0-67.176,22.489-79.004,55.563C26.591,79.937,0,108.191,0,142.539c0,36.096,29.366,65.462,65.461,65.462h39.6v57.177
                    c0,5.579,4.523,10.102,10.102,10.102h66.673c5.579,0,10.102-4.523,10.102-10.102v-57.177h30.373
                    c41.184,0,74.688-33.504,74.688-74.688S263.496,58.625,222.312,58.625z M181.838,155.066c-5.58,0-10.103,4.524-10.103,10.102
                    v89.908h-46.469v-89.908c0-5.579-4.523-10.102-10.102-10.102h-8.948l42.285-42.285l42.285,42.285H181.838z M222.312,187.797
                    h-30.373V175.27h23.235c4.086,0,7.77-2.461,9.334-6.236c1.563-3.775,0.698-8.12-2.19-11.01l-66.673-66.673
                    c-3.946-3.944-10.341-3.944-14.287,0l-66.673,66.673c-2.889,2.89-3.753,7.234-2.19,11.01c1.564,3.774,5.247,6.236,9.334,6.236
                    h23.235v12.527h-39.6c-24.955,0-45.257-20.303-45.257-45.258s20.302-45.257,45.257-45.257c0.636,0,1.267,0.024,1.898,0.049
                    c4.78,0.217,9.014-2.965,10.2-7.583c7.222-28.158,32.601-47.825,61.714-47.825c23.685,0,45.282,13.032,56.364,34.011
                    c2.23,4.222,7.11,6.303,11.702,4.997c4.889-1.395,9.926-2.101,14.973-2.101c30.043,0,54.484,24.441,54.484,54.484
                    C276.799,163.357,252.355,187.797,222.312,187.797z'
                  />
                </g></g><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g />
            </svg>
          </div>
        </div>
        {this.state.showForm &&
          ReactDOM.createPortal(form, document.getElementById('app'))
        }
      </React.Fragment>
    )
  }
}

RFIDFileUpload.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  rfidStatusHasChanged: state.rfidStatus.rfidStatusHasChanged
})

export default connect(mapStateToProps)(RFIDFileUpload)
