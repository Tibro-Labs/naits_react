import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { store } from 'tibro-redux'
import * as config from 'config/config.js'
import { alertUser } from 'tibro-components'
import { formatAlertType } from 'functions/utils'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class UserGroupNote extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      userGroupNote: null,
      userGroupNoteValue: ''
    }
  }

  componentDidMount () {
    this.getUserGroupNote()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.addedANewNote !== nextProps.addedANewNote) {
      this.getUserGroupNote()
    }
  }

  getUserGroupNote = async () => {
    let url = `${config.svConfig.restSvcBaseUrl}${config.svConfig.triglavRestVerbs.GET_NOTE_DESC}`
    url = url.replace('%sessionId', this.props.svSession)
    url = url.replace('%objectId', this.props.objectId)
    url = url.replace('%noteName', 'GROUP_DESCRIPTION')
    const res = await axios.get(url)
    this.setState({ userGroupNote: res.data })
    store.dispatch({ type: 'SET_NOTE_DESCRIPTION_RESET' })
  }

  showuserGroupNote (userGroupNote) {
    return (
      <div id='previewData' className='show-data'>
        {userGroupNote}
      </div>
    )
  }

  close = () => {
    this.setState({ alert: false, userGroupNoteValue: '' })
  }

  handleInputChange = (event) => {
    this.setState({ userGroupNoteValue: event.target.value })
  }

  setUserGroupNote = async (props) => {
    let url = `${config.svConfig.restSvcBaseUrl}${config.svConfig.triglavRestVerbs.SET_NOTE_DESC}`
    let noteText = ''
    let noteObject
    noteText = this.state.userGroupNoteValue
    if (noteText === '' || !noteText) {
      this.close()
    } else {
      noteObject = {
        noteText
      }
      url = url.replace('%sessionId', props.svSession)
      url = url.replace('%objectId', props.objectId)
      url = url.replace('%noteName', 'GROUP_DESCRIPTION')
      try {
        const res = await axios({
          method: 'POST',
          url,
          data: JSON.stringify(noteObject),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })

        if (res.data.includes('error')) {
          store.dispatch({ type: 'SET_NOTE_DESCRIPTION_REJECTED', payload: res.data })
        } else if (res.data.includes('success')) {
          store.dispatch({ type: 'SET_NOTE_DESCRIPTION_FULFILLED', payload: res.data })
        }

        this.setState({
          alert: alertUser(
            true,
            formatAlertType(res.data),
            this.context.intl.formatMessage({
              id: res.data,
              defaultMessage: res.data
            }),
            null, null,
            () => {
              this.setState({ userGroupNoteValue: '' })
              this.close()
            }
          )
        })
      } catch (err) {
        this.setState({
          alert: alertUser(
            true,
            'error',
            this.context.intl.formatMessage({
              id: err,
              defaultMessage: err
            }),
            null, null,
            () => {
              this.setState({ userGroupNoteValue: '' })
              this.close()
            }
          )
        })
      }
    }
  }

  showAlert = () => {
    let wrapper = document.createElement('div')
    ReactDOM.render(
      <div style={{ marginLeft: '12px' }}>
        <label
          className='usergroup_label'
          htmlFor='usergroup_note'
          style={{ marginRight: '8px', marginBottom: '1rem' }}
        >
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.usergroup_note_label`,
            defaultMessage: `${config.labelBasePath}.main.usergroup_note_label`
          })}
        </label>
        <textarea
          style={{ minWidth: '400px' }}
          maxLength='500'
          id='usergroup_note'
          name='usergroup_note'
          onChange={this.handleInputChange}
        />
        <br />
      </div>,
      wrapper
    )

    this.setState({
      alert: alertUser(
        true,
        'info',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.setUserGroupNote`,
          defaultMessage: `${config.labelBasePath}.main.setUserGroupNote`
        }),
        null,
        () => {
          this.setUserGroupNote(this.props)
          this.setState({ userGroupNoteValue: '' })
          this.close()
        },
        () => {
          this.setState({ userGroupNoteValue: '' })
          this.close()
        },
        true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.grids.add`,
          defaultMessage: `${config.labelBasePath}.main.grids.add`
        }),
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.forms.cancel`,
          defaultMessage: `${config.labelBasePath}.main.forms.cancel`
        }),
        true,
        null,
        true,
        wrapper
      )
    })
  }

  render () {
    const { userGroupNote } = this.state
    return (
      <React.Fragment>
        <div id='userGroupNote' className={styles.container}>
          <p>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.userGroupNote`,
              defaultMessage: `${config.labelBasePath}.main.userGroupNote`
            })}
          </p>
          <div id='showuserGroupNote' className={styles['gauge-container']}>
            <img
              id='information'
              className='actionImg'
              style={{ height: '45px', marginTop: '7%', marginLeft: '1rem' }}
              src='/naits/img/MainPalette/note2.png'
            />
            <div className={styles['show-dropdown']}>
              {this.showuserGroupNote(userGroupNote)}
            </div>
          </div>
        </div>
        <div
          id='createuserGroupNoteContainer'
          className={styles.container} style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
          onClick={this.showAlert}
        >
          <p>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.setUserGroupNote`,
              defaultMessage: `${config.labelBasePath}.main.setUserGroupNote`
            })}
          </p>
          <div id='createuserGroupNote' className={styles['gauge-container']}>
            <img
              id='change_status_img'
              className={style.actionImg}
              style={{ height: '45px', marginTop: '7%', marginLeft: '14px' }}
              src='/naits/img/MainPalette/note.png'
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

UserGroupNote.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  addedANewNote: state.noteDescription.addedANewNote
})

export default connect(mapStateToProps)(UserGroupNote)
