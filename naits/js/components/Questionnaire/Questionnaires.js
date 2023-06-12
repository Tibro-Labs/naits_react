import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import { alertUser } from 'tibro-components'
import { Loading } from 'components/ComponentsIndex'
import YesNoQuestionnaireForm from './YesNoQuestionnaireForm'
import MultipleAnswersQuestionnaireForm from './MultipleAnswersQuestionnaireForm'
import QuestionnaireGrid from './QuestionnaireGrid'
import * as config from 'config/config'
import { strcmp, formatAlertType } from 'functions/utils'
import style from 'components/AppComponents/Functional/Messaging/Messaging.module.css'
import mainStyle from './Questionnaire.module.css'

class Questionnaires extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      sideMenuButtons: ['create_yes_no', 'create_multiple_answers', 'display'],
      sideMenuButtonsLabels: ['questionnaire.create_new_yes_no', 'questionnaire.create_new_multiple_answers', 'questionnaire.list'],
      selectedItemId: '',
      componentToRender: undefined
    }
  }

  generateSideMenuBtns = () => {
    const { sideMenuButtons, sideMenuButtonsLabels, selectedItemId } = this.state
    return sideMenuButtons.map((btnAction, index) => {
      return <button key={btnAction} id={btnAction} className={style.btn}
        style={{
          backgroundColor: selectedItemId && strcmp(selectedItemId, btnAction) && '#bf920d',
          color: selectedItemId && strcmp(selectedItemId, btnAction) && '#1f1f1f'
        }}
        onClick={() => this.handleSideMenuBtnClick(btnAction)}
      >
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.${sideMenuButtonsLabels[index]}`,
          defaultMessage: `${config.labelBasePath}.main.${sideMenuButtonsLabels[index]}`
        })}
      </button>
    })
  }

  handleSideMenuBtnClick = selectedItemId => {
    let componentToRender
    switch (selectedItemId) {
      case 'create_yes_no':
        componentToRender = <YesNoQuestionnaireForm />
        break
      case 'create_multiple_answers':
        componentToRender = <MultipleAnswersQuestionnaireForm />
        break
      case 'display':
        componentToRender = <QuestionnaireGrid />
        break
      default:
        componentToRender = undefined
        break
    }
    this.setState({ selectedItemId, componentToRender })
  }

  importFile = () => this.fileInput.click()

  importQuestionnaire = e => {
    const { session } = this.props
    const verbPath = config.svConfig.triglavRestVerbs.IMPORT_QUESTIONNAIRE
    const url = `${config.svConfig.restSvcBaseUrl}${verbPath}/${session}`
    const data = new FormData()
    data.append('file', e.target.files[0])
    const reqConfig = { method: 'post', url, data }
    axios(reqConfig).then(res => {
      if (res.data) {
        const resType = formatAlertType(res.data)
        const responseLabel = this.context.intl.formatMessage({ id: res.data, defaultMessage: res.data })
        alertUser(true, resType, responseLabel)
      }
    }).catch(err => {
      console.error(err)
      alertUser(true, 'error', err)
    })
  }

  render () {
    const { loading, componentToRender } = this.state

    return (
      <div id='questionnaires-container'>
        <div id='questionnaires-side-menu' className={style['messaging-side-menu']}>
          <div id='questionnaires-side-menu-btns' className={style['messaging-side-menu-btns']}>
            <button id='import-questionnaire' className={style.btn} onClick={this.importFile}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.questionnaire.import_questionnaire`,
                defaultMessage: `${config.labelBasePath}.questionnaire.import_questionnaire`
              })}
            </button>
            <input type='file' id='import-questionnaire-input' ref={fileInput => { this.fileInput = fileInput }}
              onInput={this.importQuestionnaire} style={{ display: 'none' }}
            />
            {this.generateSideMenuBtns()}
          </div>
        </div>
        <div id='questionnaires-data-holder' className={`${style['messaging-data-holder']} ${mainStyle['questionnaire-data-holder']}`}>
          {componentToRender}
        </div>
        {loading && <Loading />}
      </div>
    )
  }
}

Questionnaires.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(Questionnaires)
