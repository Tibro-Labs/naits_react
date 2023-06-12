import React from 'react'
import PropTypes from 'prop-types'
import { alertUser } from 'tibro-components'
import * as config from 'config/config.js'
import style from 'components/AppComponents/Functional/RFIDFile.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

export default class RFIDFileInfo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: undefined,
      uploadedFileName: ''
    }
  }

  componentDidMount () {
    this.getUploadedFileName()
  }

  getUploadedFileName = () => {
    if (this.props.componentStack) {
      this.props.componentStack.forEach(grid => {
        if (grid.active && grid.gridType === 'RFID_INPUT') {
          if (grid.row['RFID_INPUT.FILE_NAME']) {
            this.setState({ uploadedFileName: grid.row['RFID_INPUT.FILE_NAME'] })
          }
        }
      })
    }
  }

  downloadFilePrompt = () => {
    this.setState({
      alert: alertUser(
        true,
        'info',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.download_file_prompt`,
          defaultMessage: `${config.labelBasePath}.main.download_file_prompt`
        }),
        null,
        () => this.downloadFile(),
        () => this.setState({ alert: alertUser(false, 'info', '') }), true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.yes`,
          defaultMessage: `${config.labelBasePath}.main.yes`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.no`,
          defaultMessage: `${config.labelBasePath}.main.no`
        }), true, null, true
      )
    })
  }

  downloadFile = () => {
    let url = `${config.svConfig.restSvcBaseUrl}${config.svConfig.triglavRestVerbs.DOWNLOAD_ATTACHED_FILE}`
    url = url.replace('%session', this.props.svSession)
    url = url.replace('%objectId', this.props.objectId)
    url = url.replace('%objectType', this.props.parentTypeId)
    url = url.replace('%fieldName', 'FILE_EAR_TAGS')
    url = url.replace('%fileName', this.state.uploadedFileName)
    window.open(url, '_blank')
  }

  render () {
    const { uploadedFileName } = this.state
    let finalFileName = ''
    let splitFileName = uploadedFileName.split('.')
    if (splitFileName[0].length > 22) {
      splitFileName[0] = `${splitFileName[0].substring(0, 18)}...`
    }
    finalFileName = splitFileName.join('.')
    return (
      <div
        id='rfid_file_info_container'
        className={`${styles.container} ${style.fileInfo}`}
        style={{ display: 'flex', cursor: uploadedFileName ? 'pointer' : null }}
        title={uploadedFileName && this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.click_here_to_download_file`,
          defaultMessage: `${config.labelBasePath}.main.click_here_to_download_file`
        })}
        onClick={() => uploadedFileName ? this.downloadFilePrompt() : null}
      >
        {uploadedFileName ? <div
          id='rfid_file_info_icon'
          style={{ marginLeft: '3.5rem', marginTop: '12px' }}
          className={`${styles['gauge-container']}`}
        >
          <svg viewBox='0 0 490 490' fill='#ffffff'>
            <g>
              <g>
                <path d='M320.45,0H64.95v490h360.1V112L320.45,0z M254.35,428.2h-124.4c-5.4,0-10.1-4.3-10.1-10.1c0-5.4,4.3-10.1,10.1-10.1h124.4
                c5.4,0,10.1,4.3,10.1,10.1C264.45,423.5,260.25,428.2,254.35,428.2z M360.15,364.4h-230.2c-5.4,0-10.1-4.3-10.1-10.1
                c0-5.4,4.3-10.1,10.1-10.1h230.2c5.4,0,10.1,4.3,10.1,10.1C370.25,360.1,365.65,364.4,360.15,364.4z M360.15,301h-230.2
                c-5.4,0-10.1-4.3-10.1-10.1c0-5.4,4.3-10.1,10.1-10.1h230.2c5.4,0,10.1,4.3,10.1,10.1C370.25,296.7,365.65,301,360.15,301z
                M360.15,237.6h-230.2c-5.4,0-10.1-4.3-10.1-10.1s4.3-10.1,10.1-10.1h230.2c5.4,0,10.1,4.3,10.1,10.1S365.65,237.6,360.15,237.6z
                M360.15,173.8h-230.2c-5.4,0-10.1-4.3-10.1-10.1c0-5.4,4.3-10.1,10.1-10.1h230.2c5.4,0,10.1,4.3,10.1,10.1
                C370.25,169.6,365.65,173.8,360.15,173.8z M300.25,131.8v-112l104.6,112H300.25z' />
              </g><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g />
            </g>
          </svg>
        </div> : null}
        <div
          id='rfid_file_info'
          style={{ marginLeft: !uploadedFileName ? '2rem' : null, marginTop: !uploadedFileName ? '0.5rem' : null }}
        >
          {uploadedFileName
            ? <h5 style={{ color: '#ffffff' }} className={style.fileInfoHeader}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.download_file`,
                defaultMessage: `${config.labelBasePath}.main.download_file`
              })}
            </h5> : null}
          {uploadedFileName
            ? <React.Fragment>
              <p className={style.boldParagraph} title={uploadedFileName}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.file_name`,
                  defaultMessage: `${config.labelBasePath}.main.file_name`
                })}:
                <br />
                {finalFileName}
              </p>
            </React.Fragment>
            : <p className={style.noFileParagraph}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.no_file_uploaded`,
                defaultMessage: `${config.labelBasePath}.main.no_file_uploaded`
              })}
            </p>}
        </div>
      </div>
    )
  }
}

RFIDFileInfo.contextTypes = {
  intl: PropTypes.object.isRequired
}
