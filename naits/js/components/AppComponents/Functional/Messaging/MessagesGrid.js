import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { format } from 'date-fns'
import { enUS, ka } from 'date-fns/locale'
import MessagesHolder from './MessagesHolder'
import * as config from 'config/config'
import style from './Messaging.module.css'
import { isValidArray, strcmp } from 'functions/utils'

class MessagesGrid extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dateLocale: undefined,
      showMessage: false,
      selectedMessage: undefined,
      inbox: [
        'main.message.created_by', 'main.subject.title', 'main.subject.category',
        'main.subject.priority', 'main.select_date', 'message.time'
      ],
      sent: [
        'main.message.assigned_to', 'main.subject.title', 'main.subject.category',
        'main.subject.priority', 'main.select_date', 'message.time'
      ],
      archived: [
        'main.message.created_by', 'main.message.assigned_to', 'main.subject.title',
        'main.subject.category', 'main.subject.priority', 'main.select_date', 'message.time'
      ],
      search: [
        'main.message.created_by', 'main.message.assigned_to', 'main.subject.title',
        'main.subject.category', 'main.subject.priority', 'main.select_date', 'message.time'
      ]
    }
  }

  componentDidMount () {
    if (this.props.locale) {
      this.setDateLocale(this.props.locale)
    }
  }

  setDateLocale = locale => {
    strcmp(locale, 'en-US') ? this.setState({ dateLocale: enUS }) : this.setState({ dateLocale: ka })
  }

  generateTable = messages => {
    const { selectedItemId } = this.props
    return <div className={`${style['table-data-container']}`}>
      <table className={`table ${style['table']}`}>
        <thead>
          <tr>
            {this.generateTableHeadings(selectedItemId)}
            {!strcmp(selectedItemId, 'archived') &&
              <th key='ARCHIVE_MESSAGE' className={style['cell-heading']}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.messages.archive`,
                  defaultMessage: `${config.labelBasePath}.messages.archive`
                })}
              </th>
            }
            {strcmp(selectedItemId, 'archived') &&
              <th key='UNARCHIVE_MESSAGE' className={style['cell-heading']}>
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.messages.unarchive`,
                  defaultMessage: `${config.labelBasePath}.messages.unarchive`
                })}
              </th>
            }
          </tr>
        </thead>
        <tbody className={style['table-body']}>{this.generateTableRows(messages)}</tbody>
      </table>
    </div>
  }

  generateTableHeadings = selectedItemId => {
    return this.state[selectedItemId].map(label => (
      <th key={label} className={style['cell-heading']}>
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.${label}`,
          defaultMessage: `${config.labelBasePath}.${label}`
        })}
      </th>
    ))
  }

  generateTableRows = (messages) => {
    const { selectedItemId } = this.props
    return messages.map((message, index) => (
      <tr
        key={index + 1} id={`${selectedItemId}_message_${index + 1}`}
        onClick={() => this.handleMessageSelection(message)}
        className={style['single-row']}
        style={{
          color: { ...message.SUBJECT.PRIORITY } && strcmp(message.SUBJECT.PRIORITY, 'HIGH') ? '#f50400'
            : strcmp(message.SUBJECT.PRIORITY, 'NORMAL') ? '#d6c199' : strcmp(message.SUBJECT.PRIORITY, 'LOW') ? '#f2f5ea' : '#ffffff',
          fontWeight: { ...message.LINK_STATUS } && strcmp(message.LINK_STATUS, 'UNSEEN') && 'bold',
          fontSize: { ...message.LINK_STATUS } && strcmp(message.LINK_STATUS, 'UNSEEN') && '1.8rem'
        }}
      >
        {!strcmp(selectedItemId, 'sent') && message.CREATED_BY_USERNAME &&
          <td key={`CREATED_BY_${message.CREATED_BY_USERNAME}_${index}`} className={style['single-cell']}>
            {message.CREATED_BY_USERNAME}
          </td>
        }
        {!strcmp(selectedItemId, 'inbox') && <React.Fragment>
          {message.MSG_TO && message.MSG_TO.items && message.MSG_TO.items.length === 1
            ? <td key={`ASSIGNED_TO_${message.MSG_TO.items[0].USER_NAME}_${index}`} className={style['single-cell']}>
              {message.MSG_TO.items[0].USER_NAME}
            </td>
            : <td key='MESSAGE_ASSIGNED_TO_USERNAME_NOT_FOUND' className={style['single-cell']}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.message.message_has_multiple_recipients`,
                defaultMessage: `${config.labelBasePath}.message.message_has_multiple_recipients`
              })}
            </td>
          }
        </React.Fragment>
        }
        {message.SUBJECT.TITLE
          ? <td key={message.SUBJECT.TITLE} className={style['single-cell']}>{message.SUBJECT.TITLE}</td>
          : <td key='MESSAGE_TITLE_NOT_FOUND' className={style['single-cell']} />
        }
        {message.SUBJECT.CATEGORY
          ? <td key={message.SUBJECT.CATEGORY + index} className={style['single-cell']}>{message.SUBJECT.CATEGORY}</td>
          : <td key='MESSAGE_CATEGORY_NOT_FOUND' className={style['single-cell']} />
        }
        {message.SUBJECT.PRIORITY
          ? <td key={message.SUBJECT.PRIORITY + index} className={style['single-cell']}>{message.SUBJECT.PRIORITY}</td>
          : <td key='MESSAGE_PRIORITY_NOT_FOUND' className={style['single-cell']} />
        }
        {message.DATE_OF_CREATION
          ? <td key={message.DATE_OF_CREATION + index + Math.random()} className={style['single-cell']}>
            {format(new Date(message.DATE_OF_CREATION), 'do MMMM yyyy', { locale: this.state.dateLocale })}
          </td>
          : <td key={`MESSAGE_DT_INSERT_NOT_FOUND_${index}`} className={style['single-cell']} />
        }
        {message.DATE_OF_CREATION
          ? <td key={message.DATE_OF_CREATION + index + Math.random()} className={style['single-cell']}>
            {format(new Date(message.DATE_OF_CREATION), 'k', { locale: this.state.dateLocale })}&#58;
            {format(new Date(message.DATE_OF_CREATION), 'mm', { locale: this.state.dateLocale })}
          </td>
          : <td key={`MESSAGE_DT_INSERT_NOT_FOUND_${index}`} className={style['single-cell']} />
        }
        {!strcmp(selectedItemId, 'archived') &&
          <td key={`ARCHIVE_${index}`} className={style['single-cell']}>
            <i
              className={`fa fa-archive ${style['archive-icon']}`}
              title={this.context.intl.formatMessage({
                id: `${config.labelBasePath}.message.archive_message`,
                defaultMessage: `${config.labelBasePath}.message.archive_message`
              })}
              onClick={(e) => this.props.archiveMessagePrompt(e, message.SUBJECT.object_id)}
            />
          </td>
        }
        {strcmp(selectedItemId, 'archived') &&
          <td key={`UNARCHIVE_${index}`} className={style['single-cell']}>
            <i
              className={`fa fa-folder-open ${style['archive-icon']}`}
              title={this.context.intl.formatMessage({
                id: `${config.labelBasePath}.message.unarchive_message`,
                defaultMessage: `${config.labelBasePath}.message.unarchive_message`
              })}
              onClick={(e) => this.props.unarchiveMessagePrompt(e, message.SUBJECT.object_id)}
            />
          </td>
        }
      </tr>
    ))
  }

  handleMessageSelection = selectedMessage => {
    this.setState({ selectedMessage, showMessage: true })
  }

  handleBackButton = () => {
    this.setState({ selectedMessage: undefined, showMessage: false })
    this.props.handleMainBtnClick(this.props.selectedItemId)
  }

  render () {
    const { messages, selectedItemId, currentUserObjId } = this.props
    const { showMessage, selectedMessage } = this.state

    return (
      <React.Fragment>
        {showMessage ? <MessagesHolder
          selectedMessage={selectedMessage}
          handleBackButton={this.handleBackButton}
          currentUserObjId={currentUserObjId}
        />
          : messages && isValidArray(messages, 1) ? this.generateTable(messages)
            : <h1 style={{ color: '#ffffff', marginTop: '2rem' }}>
              {strcmp(selectedItemId, 'sent') &&
                <React.Fragment>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.message.no_sent_messages_one`,
                    defaultMessage: `${config.labelBasePath}.message.no_sent_messages_one`
                  })}! <span
                    style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}
                    onClick={() => this.props.handleMainBtnClick('compose')}
                  >{this.context.intl.formatMessage({
                      id: `${config.labelBasePath}.message.send`,
                      defaultMessage: `${config.labelBasePath}.message.send`
                    })}</span> {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.message.no_sent_messages_two`,
                    defaultMessage: `${config.labelBasePath}.message.no_sent_messages_two`
                  })}!
                </React.Fragment>
              }
              {strcmp(selectedItemId, 'inbox') &&
                <React.Fragment>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.message.no_inbox_messages`,
                    defaultMessage: `${config.labelBasePath}.message.no_inbox_messages`
                  })}!
                </React.Fragment>
              }
              {strcmp(selectedItemId, 'search') &&
                <React.Fragment>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.message.no_messages_found`,
                    defaultMessage: `${config.labelBasePath}.message.no_messages_found`
                  })}
                </React.Fragment>
              }
              {strcmp(selectedItemId, 'archived') &&
                <React.Fragment>
                  {this.context.intl.formatMessage({
                    id: `${config.labelBasePath}.message.no_archived_messages_found`,
                    defaultMessage: `${config.labelBasePath}.message.no_archived_messages_found`
                  })}
                </React.Fragment>
              }
            </h1>
        }
      </React.Fragment>
    )
  }
}

MessagesGrid.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  locale: state.intl.locale
})

export default connect(mapStateToProps)(MessagesGrid)
