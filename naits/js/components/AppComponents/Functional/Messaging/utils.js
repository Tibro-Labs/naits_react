import axios from 'axios'
import { store } from 'tibro-redux'
import * as config from 'config/config'

export function getNumOfUnreadMessages (session) {
  const server = config.svConfig.restSvcBaseUrl
  const verbPath = config.svConfig.triglavRestVerbs.GET_NUM_OF_UNREAD_INBOX_AND_ARCHIVED_MSGS
  const url = `${server}${verbPath}/${session}`
  axios.get(url).then(res => {
    if (!isNaN(res.data.NUMBER_OF_UNREAD_SUBJECTS_INBOX)) {
      store.dispatch({
        type: 'NUMBER_OF_UNREAD_INBOX_MESSAGES',
        payload: {
          numOfUnreadInboxMsgs: res.data.NUMBER_OF_UNREAD_SUBJECTS_INBOX
        }
      })
    }
    if (!isNaN(res.data.NUMBER_OF_UNREAD_SUBJECTS_ARCHIVED)) {
      store.dispatch({
        type: 'NUMBER_OF_UNREAD_ARCHIVED_MESSAGES',
        payload: {
          numOfUnreadArchivedMsgs: res.data.NUMBER_OF_UNREAD_SUBJECTS_ARCHIVED
        }
      })
    }
  }).catch(err => console.error(err))
}
