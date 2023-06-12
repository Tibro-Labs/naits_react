import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import { format } from 'date-fns'
import { enUS, ka } from 'date-fns/locale'
import { ComponentManager, FormManager, Loading } from 'components/ComponentsIndex'
import { EditQuestionnaireFormWrapper } from 'containers/InputWrappers'
import * as config from 'config/config'
import { strcmp, isValidArray, formatAlertType, flattenObject, jsonToURI } from 'functions/utils'
import mainStyle from './Questionnaire.module.css'
import style from 'components/AppComponents/Functional/Messaging/Messaging.module.css'

class QuestionnaireGrid extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      dateLocale: undefined,
      questionnaires: undefined,
      tableHeadings: [
        'main.questionnaire.title', 'main.questionnaire.created_by', 'main.questionnaire.num_of_questions', 'main.questionnaire.date',
        'main.questionnaire.target', 'main.questionnaire.export_labels', 'main.questionnaire.report', 'main.questionnaire.edit', 'main.questionnaire.delete'
      ],
      questionnaireModal: undefined,
      questionnaireId: '',
      editQuestionnaireModal: undefined,
      editQuestionnaireId: ''
    }
  }

  componentDidMount () {
    this.getQuestionnaires()
    if (this.props.locale) {
      this.setDateLocale(this.props.locale)
    }
  }

  getQuestionnaires = () => {
    this.setState({ loading: true })
    const { session } = this.props
    const verbPath = config.svConfig.triglavRestVerbs.GET_QUESTIONNAIRES
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}`
    axios.get(url).then(res => {
      if (res.data) {
        this.setState({ questionnaires: res.data, loading: false })
      }
    }).catch(err => {
      console.error(err)
      this.setState({ loading: false })
    })
  }

  setDateLocale = locale => {
    strcmp(locale, 'en-US') ? this.setState({ dateLocale: enUS }) : this.setState({ dateLocale: ka })
  }

  generateTable = questionnaires => {
    return <div className={`${style['table-data-container']}`} style={{ height: '95%' }}>
      <table className={`table ${style['table']}`}>
        <thead><tr>{this.generateTableHeadings()}</tr></thead>
        <tbody className={style['table-body']}>{this.generateTableRows(questionnaires)}</tbody>
      </table>
    </div>
  }

  generateTableHeadings = () => {
    return this.state.tableHeadings.map(label => (
      <th key={label} className={style['cell-heading']}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.${label}`,
          defaultMessage: `${config.labelBasePath}.${label}`
        })}
      </th>
    ))
  }

  generateTableRows = questionnaires => {
    return questionnaires.map((questionnaire, index) => (
      <tr key={index + 1} id={`questionnaire_${index + 1}`} className={style['single-row']} onClick={() => {
        this.onClick(questionnaire.LABEL_CODE, questionnaire.OBJECT_ID)
      }}>
        {questionnaire.QUESTIONNAIRE_TITLE
          ? <td key={questionnaire.QUESTIONNAIRE_TITLE} className={style['single-cell']}>{questionnaire.QUESTIONNAIRE_TITLE}</td>
          : <td key='QUESTIONNAIRE_TITLE_NOT_FOUND' className={style['single-cell']} />
        }
        {questionnaire.QUESTIONNAIRE_CREATOR
          ? <td key={questionnaire.QUESTIONNAIRE_CREATOR + index} className={style['single-cell']}>{questionnaire.QUESTIONNAIRE_CREATOR}</td>
          : <td key='QUESTIONNAIRE_CREATOR_NOT_FOUND' className={style['single-cell']} />
        }
        {questionnaire.NUMBER_OF_QUESTIONS
          ? <td key={questionnaire.NUMBER_OF_QUESTIONS + index} className={style['single-cell']}>{questionnaire.NUMBER_OF_QUESTIONS}</td>
          : <td key='NUMBER_OF_QUESTIONS_NOT_FOUND' className={style['single-cell']} />
        }
        {questionnaire.DT_INSERT
          ? <td key={questionnaire.DT_INSERT + index + Math.random()} className={style['single-cell']}>
            {format(new Date(questionnaire.DT_INSERT), 'do MMMM yyyy', { locale: this.state.dateLocale })}
          </td>
          : <td key={`QUESTIONNAIRE_DT_INSERT_NOT_FOUND_${index}`} className={style['single-cell']} />
        }
        {questionnaire.SCOPE
          ? <td key={questionnaire.SCOPE + index} className={style['single-cell']}>{questionnaire.SCOPE}</td>
          : <td key='SCOPE_NOT_FOUND' className={style['single-cell']} />
        }
        <td key={`EXPORT_LABELS_${index}`} className={style['single-cell']}>
          <i
            className={`fa fa-download ${mainStyle['export-labels-icon']}`}
            title={this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.questionnaire.export_labels`,
              defaultMessage: `${config.labelBasePath}.main.questionnaire.export_labels`
            })}
            onClick={(e) => this.exportLabels(e, questionnaire.OBJECT_ID)}
          />
        </td>
        <td key={`GENERATE_REPORT_${index}`} className={style['single-cell']}>
          <i
            className={`fa fa-file-excel-o ${mainStyle['export-labels-icon']}`}
            style={{ marginRight: '1vh' }}
            title={this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.questionnaire.report_excel`,
              defaultMessage: `${config.labelBasePath}.main.questionnaire.report_excel`
            })}
            onClick={(e) => this.generateReport(e, questionnaire.OBJECT_ID, 'EXCEL', 'questionnaire_answers')}
          />
          <i
            className={`fa fa-file-pdf-o ${mainStyle['export-labels-icon']}`}
            title={this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.questionnaire.report_pdf`,
              defaultMessage: `${config.labelBasePath}.main.questionnaire.report_pdf`
            })}
            onClick={(e) => this.generateReport(e, questionnaire.OBJECT_ID, 'PDF', 'questionnaire_with_answers')}
          />
        </td>
        <td key={`EDIT_QUESTIONNAIRE_${index}`} className={style['single-cell']}>
          <i
            className={`fa fa-edit ${mainStyle['edit-icon']}`}
            title={this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.questionnaire.edit`,
              defaultMessage: `${config.labelBasePath}.main.questionnaire.edit`
            })}
            onClick={(e) => this.displayEditQuestionnaireFormModal(e, questionnaire.LABEL_CODE, questionnaire.OBJECT_ID)}
          />
        </td>
        <td key={`DELETE_QUESTIONNAIRE_${index}`} className={style['single-cell']}>
          <i
            className={`fa fa-trash ${mainStyle['trash-icon']}`}
            title={this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.questionnaire.delete`,
              defaultMessage: `${config.labelBasePath}.main.questionnaire.delete`
            })}
            onClick={(e) => this.deleteQuestionnairePrompt(e, questionnaire.OBJECT_ID)}
          />
        </td>
      </tr>
    ))
  }

  exportLabels (e, objectId) {
    e.stopPropagation()
    const { session } = this.props
    const verbPath = config.svConfig.triglavRestVerbs.EXPORT_QUESTIONNAIRE
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${objectId}`
    window.open(url, '_blank')
  }

  generateReport (e, objectId, type, name) {
    e.stopPropagation()
    const { session } = this.props
    let verbPath = config.svConfig.triglavRestVerbs.GENERATE_PDF_OR_EXCEL
    verbPath = verbPath.replace('%sessionId', session)
    verbPath = verbPath.replace('%objectId', objectId)
    verbPath = verbPath.replace('%printType', type)
    verbPath = verbPath.replace('%customDate', null)
    verbPath = verbPath.replace('%customDate2', null)
    verbPath = verbPath.replace('%campaignId', null)
    verbPath = verbPath.replace('%reportName', name)
    const url = `${config.svConfig.restSvcBaseUrl}/${verbPath}`
    window.open(url, '_blank')
  }

  displayEditQuestionnaireFormModal = (e, labelCode, objectId) => {
    e.stopPropagation()
    const { session } = this.props
    const params = [{
      PARAM_NAME: 'objectId',
      PARAM_VALUE: objectId
    }, {
      PARAM_NAME: 'parentId',
      PARAM_VALUE: 0
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: session
    }, {
      PARAM_NAME: 'labelCode',
      PARAM_VALUE: labelCode
    }]
    let formId = `${encodeURIComponent(labelCode).toUpperCase()}_QUESTIONNAIRE_EDIT_FORM`
    formId = formId.replace(/['()*]/g, c => '%' + c.charCodeAt(0).toString(16))
    const form = FormManager.generateForm(
      formId, formId, params, 'formData', 'GET_EDIT_QUESTIONNAIRE_JSON_SCHEMA', 'GET_EDIT_QUESTIONNAIRE_UI_SCHEMA', 'GET_QUESTIONNAIRE_FORM_DATA',
      this.closeEditQuestionnaireFormModal, (e) => this.submitEditQuestionnaire(e, session), null, null, 'questionnaire-form', null, 'closeAndDelete',
      () => this.closeEditQuestionnaireFormModal(), undefined, undefined, undefined, EditQuestionnaireFormWrapper
    )
    const editQuestionnaireModal = <div id='form_modal' className='modal' style={{ display: 'block' }}>
      <div id='form_modal_content' className='modal-content'>
        <div className='modal-header'>
          <button id='modal_close_btn' type='button' className='close' onClick={this.closeEditQuestionnaireFormModal} data-dismiss='modal'>&times;</button>
        </div>
        <div id='form_modal_body' className='modal-body edit-questionnaire-form-modal-body' style={{ marginTop: '1rem', height: '95%' }}>
          {form}
        </div>
      </div>
    </div>

    this.setState({ editQuestionnaireModal, editQuestionnaireId: formId })
  }

  closeEditQuestionnaireFormModal = () => {
    this.setState({ editQuestionnaireModal: undefined, editQuestionnaireId: '' })
  }

  submitEditQuestionnaire = (e, session) => {
    if (jsonToURI(flattenObject(e.formData)).length > 0) {
      const formData = {}
      // Get each form data key & append the label prefix to it
      const newKeys = Object.keys(e.formData).map(k => {
        const newKey = `naits.form_labels.${k}`
        return newKey
      })
      // Assign the new form data properties with the existing data as values to a new object (defined above)
      Object.values(e.formData).forEach((v, i) => Reflect.set(formData, newKeys[i], v['New question']))
      // Finally, convert the plain object to URI
      const data = jsonToURI(formData)
      const verbPath = config.svConfig.triglavRestVerbs.EDIT_QUESTIONS_IN_QUESTIONNAIRE
      const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}`
      const reqConfig = { method: 'post', url, data }
      axios(reqConfig).then(res => {
        if (res.data) {
          const responseType = formatAlertType(res.data)
          const responseLabel = this.context.intl.formatMessage({ id: res.data, defaultMessage: res.data })
          alertUser(true, responseType, responseLabel, null, () => this.resetEditSaveState())
          if (strcmp(responseType, 'success')) {
            this.closeEditQuestionnaireFormModal()
            this.getQuestionnaires()
          }
        }
      }).catch(err => {
        console.error(err)
        alertUser(true, 'error', err, null, () => this.resetEditSaveState())
      })
    } else {
      const enterValuesLabel = this.context.intl.formatMessage({
        id: `${config.labelBasePath}.main.questionnaire.enter_some_values`,
        defaultMessage: `${config.labelBasePath}.main.questionnaire.enter_some_values`
      })
      alertUser(true, 'info', enterValuesLabel, null, () => this.resetEditSaveState())
    }
  }

  resetEditSaveState = () => {
    ComponentManager.setStateForComponent(this.state.editQuestionnaireId, null, { saveExecuted: false })
  }

  deleteQuestionnairePrompt = (e, objectId) => {
    e.stopPropagation()
    const deleteQuestionnairePromptLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.delete_prompt`,
      defaultMessage: `${config.labelBasePath}.main.questionnaire.delete_prompt`
    })
    const yesLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.yes`,
      defaultMessage: `${config.labelBasePath}.main.yes`
    })
    const noLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.no`,
      defaultMessage: `${config.labelBasePath}.main.no`
    })
    const { session } = this.props
    const verbPath = config.svConfig.triglavRestVerbs.DELETE_QUESTIONNAIRE
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}/${objectId}`
    alertUser(true, 'warning', deleteQuestionnairePromptLabel, null, () => this.deleteQuestionnaire(url), () => { }, true, yesLabel, noLabel)
  }

  deleteQuestionnaire = url => {
    this.setState({ loading: true })
    axios.get(url).then(res => {
      this.setState({ loading: false })
      if (res.data) {
        const resType = formatAlertType(res.data)
        const resLabel = this.context.intl.formatMessage({ id: res.data, defaultMessage: res.data })
        alertUser(true, resType, resLabel)
        if (strcmp(resType, 'success')) {
          this.getQuestionnaires()
        }
      }
    }).catch(err => {
      this.setState({ loading: false })
      console.error(err)
      alertUser(true, 'error', err)
    })
  }

  onClick = (labelCode, objectId) => {
    const { session } = this.props
    const params = [{
      PARAM_NAME: 'objectId',
      PARAM_VALUE: objectId
    }, {
      PARAM_NAME: 'parentId',
      PARAM_VALUE: 0
    }, {
      PARAM_NAME: 'session',
      PARAM_VALUE: session
    }, {
      PARAM_NAME: 'labelCode',
      PARAM_VALUE: labelCode
    }]
    let formId = `${encodeURIComponent(labelCode).toUpperCase()}_QUESTIONNAIRE_FORM`
    formId = formId.replace(/['()*]/g, c => '%' + c.charCodeAt(0).toString(16))
    const form = FormManager.generateForm(
      formId, formId, params, 'formData', 'GET_QUESTIONNAIRE_JSON_SCHEMA', 'GET_QUESTIONNAIRE_UI_SCHEMA', 'GET_QUESTIONNAIRE_FORM_DATA',
      this.closeQuestionnaireModal, () => { }, null, null, 'questionnaire-form', null, true, () => this.closeQuestionnaireModal(),
      undefined, undefined, undefined
    )

    const questionnaireModal = <div id='form_modal' className='modal' style={{ display: 'block' }}>
      <div id='form_modal_content' className='modal-content'>
        <div className='modal-header'>
          <button id='modal_close_btn' type='button' className='close' onClick={this.closeQuestionnaireModal} data-dismiss='modal'>&times;</button>
        </div>
        <div id='form_modal_body' className='modal-body questionnaire-form-modal-body' style={{ marginTop: '1rem', height: '95%' }}>
          {form}
        </div>
      </div>
    </div>

    this.setState({ questionnaireModal, questionnaireId: formId })
  }

  closeQuestionnaireModal = () => {
    this.setState({ questionnaireModal: undefined, questionnaireId: '' })
  }

  render () {
    const { questionnaires, questionnaireModal, editQuestionnaireModal, loading } = this.state
    const noDataLabel = this.context.intl.formatMessage({
      id: `${config.labelBasePath}.main.questionnaire.no_data`,
      defaultMessage: `${config.labelBasePath}.main.questionnaire.no_data`
    })

    return <React.Fragment>
      {isValidArray(questionnaires, 1) ? this.generateTable(questionnaires) : <h1 className={mainStyle['no-data-heading']}>{noDataLabel}</h1>}
      {questionnaireModal}
      {editQuestionnaireModal}
      {loading && <Loading />}
    </React.Fragment>
  }
}

QuestionnaireGrid.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession,
  locale: state.intl.locale
})

export default connect(mapStateToProps)(QuestionnaireGrid)
