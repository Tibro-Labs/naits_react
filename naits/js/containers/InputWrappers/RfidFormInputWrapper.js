import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { alertUser } from 'tibro-components'
import { store } from 'tibro-redux'
import Loading from 'components/Loading'
import { formatAlertType } from 'functions/utils'
import * as config from 'config/config.js'
import { reloadCachedSelectedObjectsData } from 'backend/reloadCachedSelectedObjectsData'

class RfidFormInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: false,
      tagInfoSection: null,
      selectedFile: null,
      isDragging: false,
      loading: false,
      sectionName: 'FILE_EAR_TAGS',
      formSectionsClassName: 'form-group field field-object',
      earTagsTextareaId: 'root_rfid.tag_information_TEXT_EAR_TAGS',
      importTypeDropdownId: 'root_rfid.animal_type_info_IMPORT_TYPE',
      animalTypeDropdownId: 'root_rfid.animal_type_info_ANIMAL_TYPE',
      selectedImportType: '',
      fileName: '',
      selectedAnimalType: '',
      enteredEarTags: '',
      rfidObjId: 0,
      reRender: ''
    }
  }

  componentDidMount () {
    this.dragCounter = 0

    const fileUploadInput = document.getElementById('root_FILE_EAR_TAGS')
    if (fileUploadInput.parentElement.parentElement.parentElement) {
      fileUploadInput.style.display = 'none'
      fileUploadInput.onchange = this.handleFileSelection
      fileUploadInput.parentElement.parentElement.parentElement.id = 'fileUploadSection'
      fileUploadInput.parentElement.parentElement.parentElement.style.display = 'none'
      fileUploadInput.parentElement.parentElement.previousSibling.previousSibling.id = 'fileInputLabel'
      fileUploadInput.parentElement.parentElement.previousSibling.previousSibling.ondrag = this.handleDrag
      fileUploadInput.parentElement.parentElement.previousSibling.previousSibling.ondragleave = this.handleDragOut
      fileUploadInput.parentElement.parentElement.previousSibling.previousSibling.ondragover = this.handleDragIn
      fileUploadInput.parentElement.parentElement.previousSibling.previousSibling.ondrop = this.handleDrop
    }

    const importTypeDropdown = document.getElementById(this.state.importTypeDropdownId)
    if (importTypeDropdown) {
      importTypeDropdown.onchange = this.handleImportTypeSelection

      if (importTypeDropdown.value) {
        this.setState({ selectedImportType: importTypeDropdown.value })
      }
    }

    const animalTypeDropdown = document.getElementById(this.state.animalTypeDropdownId)
    if (animalTypeDropdown) {
      animalTypeDropdown.onchange = this.handleAnimalTypeSelection
    }

    const tagInfo = document.getElementById('root_rfid.tag_information__title')
    if (tagInfo && tagInfo.parentElement) {
      this.setState({ tagInfoSection: tagInfo.parentElement })
    }

    const earTagsTextarea = document.getElementById(this.state.earTagsTextareaId)
    if (earTagsTextarea) {
      earTagsTextarea.style.resize = 'none'
      earTagsTextarea.style.overflow = 'hidden'
      earTagsTextarea.style.height = `${earTagsTextarea.scrollHeight}px`
      earTagsTextarea.oninput = function () {
        earTagsTextarea.style.height = 'auto'
        earTagsTextarea.style.height = `${earTagsTextarea.scrollHeight}px`
      }
      earTagsTextarea.onchange = this.handleEarTagsInputChange

      if (earTagsTextarea.parentElement) {
        earTagsTextarea.parentElement.id = 'earTagsSection'
      }
    }

    if (this.props.gridHierarchy) {
      this.props.gridHierarchy.forEach(grid => {
        if (grid.active && grid.gridType === 'RFID_INPUT') {
          this.setState({ rfidObjId: grid.row['RFID_INPUT.OBJECT_ID'] })
          if (grid.row['RFID_INPUT.ANIMAL_TYPE']) {
            this.setState({ selectedAnimalType: grid.row['RFID_INPUT.ANIMAL_TYPE'] })
            if (animalTypeDropdown) {
              animalTypeDropdown.value = grid.row['RFID_INPUT.ANIMAL_TYPE']
            }
          }
          if (grid.row['RFID_INPUT.FILE_NAME']) {
            this.setState({ fileName: grid.row['RFID_INPUT.FILE_NAME'] })
          }
          if (grid.row['RFID_INPUT.IMPORT_TYPE']) {
            this.setState({ selectedImportType: grid.row['RFID_INPUT.IMPORT_TYPE'] })
            if (importTypeDropdown) {
              importTypeDropdown.value = grid.row['RFID_INPUT.IMPORT_TYPE']
            }
          }
          if (grid.row['RFID_INPUT.TEXT_EAR_TAGS']) {
            this.setState({ enteredEarTags: grid.row['RFID_INPUT.TEXT_EAR_TAGS'] })
            if (earTagsTextarea) {
              earTagsTextarea.value = grid.row['RFID_INPUT.TEXT_EAR_TAGS']
            }
          }
        }
      })
    }
  }

  handleEarTagsInputChange = e => {
    this.setState({ enteredEarTags: e.target.value })
  }

  handleSave = () => {
    this.setState({ loading: true })
    if (this.state.selectedImportType === 'VIA_FORM') {
      this.setState({ selectedFile: null })
    } else {
      this.setState({ enteredEarTags: '' })
    }
    const server = config.svConfig.restSvcBaseUrl
    const verbPath = config.svConfig.triglavRestVerbs.CUSTOM_CREATE_RFID_INPUT
    let url = `${server}${verbPath}/${this.props.session}/${this.state.rfidObjId}`
    let paramsArray = [{
      ...this.state.selectedAnimalType && { ANIMAL_TYPE: this.state.selectedAnimalType },
      ...this.state.selectedImportType && { IMPORT_TYPE: this.state.selectedImportType },
      ...this.state.enteredEarTags && { TEXT_EAR_TAGS: this.state.enteredEarTags }
    }]
    const data = new FormData()
    if (this.state.selectedFile) {
      data.append(this.state.selectedFile.name, this.state.selectedFile)
    }
    data.append('form-data', JSON.stringify(paramsArray))
    axios({
      method: 'post',
      data,
      url,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
      reloadCachedSelectedObjectsData()
      if (typeof res.data === 'string') {
        this.setState({
          alert: alertUser(true, formatAlertType(res.data),
            this.context.intl.formatMessage({
              id: res.data,
              defaultMessage: res.data
            }), null, () => this.setState({ alert: alertUser(false, 'info', '') })
          ),
          loading: false
        })
      } else if (typeof res.data === 'object') {
        this.setState({
          alert: alertUser(true, 'success',
            this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.forms.data_save_success`,
              defaultMessage: `${config.labelBasePath}.main.forms.data_save_success`
            }), null, () => {
              this.setState({ alert: alertUser(false, 'info', '') })
              document.getElementById('modal_close_btn') && document.getElementById('modal_close_btn').click()
            }
          ),
          loading: false
        })
        store.dispatch({ type: 'RFID_INPUT_FORM/SAVE_FORM_DATA', payload: res.data[0] })
      }
    }).catch(err => {
      reloadCachedSelectedObjectsData()
      this.setState({
        alert: alertUser(true, 'error',
          this.context.intl.formatMessage({
            id: err,
            defaultMessage: err
          }), null, () => this.setState({ alert: alertUser(false, 'info', '') })
        ),
        loading: false
      })
    })
  }

  componentDidUpdate (nextProps, nextState) {
    if (this.state.fileName !== nextState.fileName) {
      document.getElementById('reRenderBtnOne') && document.getElementById('reRenderBtnOne').click()
    }
    const saveBtn = document.getElementById('save_form_btn')
    if (saveBtn) {
      saveBtn.setAttribute('type', 'button')
      saveBtn.onclick = this.handleSave
    }
    const earTagsSection = document.getElementById('earTagsSection')
    const fileUploadInput = document.getElementById('fileUploadSection')
    const fileInputLabel = document.getElementById('fileInputLabel')
    const fileInfo = document.getElementsByClassName('file-info')
    if (nextState.selectedImportType === 'VIA_FILE') {
      if (fileUploadInput) {
        fileUploadInput.style.display = 'inline-table'
        fileInputLabel.style.fontSize = 'initial'
        fileInputLabel.style.border = '2px solid #ffffff'
        fileInputLabel.style.borderRadius = '2rem'
        fileInputLabel.style.padding = '2rem'
        fileInputLabel.style.paddingLeft = '3rem'
        fileInputLabel.style.cursor = 'pointer'
        if (nextState.selectedFile) {
          if (fileInfo && fileInfo.length > 0) {
            fileInfo[0].style.display = 'none'
          }
          fileInputLabel.innerHTML = `
            ${this.context.intl.formatMessage({
    id: `${config.labelBasePath}.main.file_name`,
    defaultMessage: `${config.labelBasePath}.main.file_name`
  })}: ${this.state.selectedFile.name}
            <br />
            ${this.context.intl.formatMessage({
    id: `${config.labelBasePath}.main.file_size`,
    defaultMessage: `${config.labelBasePath}.main.file_size`
  })}: ${(this.state.selectedFile.size / Math.pow(1024, 1)).toFixed(3)} KB
          `
        } else {
          fileInputLabel.innerHTML = this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.click_to_select_file`,
            defaultMessage: `${config.labelBasePath}.main.click_to_select_file`
          })
        }
      }

      if (earTagsSection) {
        earTagsSection.style.display = 'none'
      }
    } else if (nextState.selectedImportType === 'VIA_FORM') {
      if (fileUploadInput) {
        fileUploadInput.style.display = 'none'
      }

      if (earTagsSection) {
        earTagsSection.style.display = 'inline-table'
      }
    }
  }

  handleImportTypeSelection = e => {
    this.setState({ selectedImportType: e.target.value })
  }

  handleAnimalTypeSelection = e => {
    this.setState({ selectedAnimalType: e.target.value })
  }

  handleFileSelection = e => {
    this.setState({ selectedFile: e.target.files[0] })
  }

  handleDrop = e => {
    e.preventDefault()
    e.stopPropagation()
    const regEx = /^.*\.(csv|CSV|txt|TXT)$/
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

  render () {
    return (
      <React.Fragment>
        <button
          type='button'
          id='reRenderBtnOne'
          style={{ display: 'none' }}
          onClick={() => document.getElementById('reRenderBtnTwo') && document.getElementById('reRenderBtnTwo').click()}
        />
        <button
          type='button'
          id='reRenderBtnTwo'
          style={{ display: 'none' }}
          onClick={() => this.setState({ reRender: 'reRender' })}
        />
        {this.state.loading && <Loading />}
        {this.props.children}
      </React.Fragment>
    )
  }
}

RfidFormInputWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  gridHierarchy: state.gridConfig.gridHierarchy
})

export default connect(mapStateToProps)(RfidFormInputWrapper)
