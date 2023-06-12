import React from 'react'
import PropTypes from 'prop-types'
import { holdingBookAction } from 'backend/holdingBookAction'
import { store } from 'tibro-redux'
import { globalSearchAction } from 'backend/globalSearchAction'
import { connect } from 'react-redux'
import axios from 'axios'
import { getAdditionalHoldingData, getObjectSummary } from 'backend/additionalDataActions'
import style from './BrowseHoldings.module.css'
import Loading from 'components/Loading'
import { selectObject } from 'functions/utils'
import * as config from 'config/config'

class BrowseHoldings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      userIsLinkedToOneHolding: false,
      userIsLinkedToTwoOrMoreHoldings: false
    }
  }

  getLinkedHoldingsForCurrentUser = async () => {
    const server = config.svConfig.restSvcBaseUrl
    const session = this.props.svSession
    const verbPath = config.svConfig.triglavRestVerbs.GET_LINKED_HOLDINGS_PER_USER
    let url = `${server}${verbPath}`
    url = url.replace('%session', session)
    try {
      const res = await axios.get(url)
      if (res.data && res.data instanceof Array) {
        if (res.data && res.data.length === 1) {
          store.dispatch({ type: 'USER_IS_LINKED_TO_ONE_HOLDING' })
          this.setState({ userIsLinkedToOneHolding: true, userIsLinkedToTwoOrMoreHoldings: false })
        } else if (res.data && res.data.length > 1) {
          store.dispatch({ type: 'USER_IS_LINKED_TO_TWO_OR_MORE_HOLDINGS' })
          this.setState({ userIsLinkedToOneHolding: false, userIsLinkedToTwoOrMoreHoldings: true })
        } else if (res.data.length === 0) {
          store.dispatch({ type: 'USER_IS_NOT_LINKED_TO_ANY_HOLDINGS' })
        }
      } else {
        store.dispatch({ type: 'USER_IS_NOT_LINKED_TO_ANY_HOLDINGS' })
      }
    } catch (err) {
      console.error(err)
    }
  }

  forwardOrBackwardPIC = (direction) => () => {
    const actionArguments = {
      holdingObjId: this.props.holdingObjId,
      direction: direction,
      callback: this.getRowDataBasedOnPIC
    }
    store.dispatch(holdingBookAction(actionArguments))
    store.dispatch({ type: 'CLOSE_QUESTIONNAIRES' })
    this.setState({ loading: true })
  }

  getRowDataBasedOnPIC = (picArgument) => {
    store.dispatch(
      globalSearchAction(
        this.props.svSession,
        'HOLDING',
        'PIC',
        picArgument,
        10000,
        (response) => this.dispatchNewState(response[0]),
        true
      )
    )
  }

  dispatchNewState = (responseObject) => {
    store.dispatch(
      {
        id: 'HOLDING',
        type: 'HOLDING/ROW_CLICKED',
        payload: responseObject
      }
    )
    store.dispatch(
      {
        type: 'REPLACE_ALL_SELECTED_ITEMS',
        payload: [
          {
            gridId: 'HOLDING',
            gridType: 'HOLDING',
            row: responseObject,
            active: true
          }
        ]
      }
    )
    selectObject('HOLDING', responseObject)
    store.dispatch(getAdditionalHoldingData(this.props.svSession, this.props.holdingObjId))
    store.dispatch(getObjectSummary(this.props.svSession, 'HOLDING', this.props.holdingObjId))
    this.props.clearReturnedComponent()
    this.setState({ loading: false })
  }

  render () {
    if ((this.state.userIsLinkedToOneHolding || this.state.userIsLinkedToTwoOrMoreHoldings) ||
      (this.props.userIsLinkedToOneHolding || this.props.userIsLinkedToTwoOrMoreHoldings)) {
      return null
    }
    return (
      <div id='BrowseHolding' className={style.block}>
        <ul className={'pager ' + style.pager}>
          <li className='previous'>
            <p
              style={{ float: 'left' }}
              className={style['link'] + ' ' + style['link--arrowed']}
              {...!this.state.loading && { onClick: this.forwardOrBackwardPIC('BACKWARD') }}
            >
              <svg className={style['arrow-icon']} xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>
                <g transform='rotate(-179.99998474121094 16.000000000000004,15.999999999999998)' fill='none' stroke='rgb(204, 136, 12)' strokeWidth='1.5' strokeLinejoin='round' strokeMiterlimit='10'>
                  <circle className={style['arrow-icon--circle']} cx='16' cy='16' r='15.12' />
                  <path className={style['arrow-icon--arrow']} d='M16.14 9.93L22.21 16l-6.07 6.07M8.23 16h13.98' />
                </g>
              </svg>
            </p>
          </li>
          <li>
            <p className={style.title}>
              {this.context.intl.formatMessage({
                id: `${config.labelBasePath}.main.holding_book`,
                defaultMessage: `${config.labelBasePath}.main.holding_book`
              })}
            </p>
          </li>
          <li className='next'>
            <p
              style={{ float: 'right' }}
              className={style['link'] + ' ' + style['link--arrowed']}
              {...!this.state.loading && { onClick: this.forwardOrBackwardPIC('FORWARD') }}
            >
              <svg className={style['arrow-icon']} xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>
                <g fill='none' stroke='rgb(204, 136, 12)' strokeWidth='1.5' strokeLinejoin='round' strokeMiterlimit='10'>
                  <circle className={style['arrow-icon--circle']} cx='16' cy='16' r='15.12' />
                  <path className={style['arrow-icon--arrow']} d='M16 10l6 6-6 6m-8-6h14' />
                </g>
              </svg>
            </p>
          </li>
        </ul>
        {this.state.loading && <Loading />}
      </div>
    )
  }
}

BrowseHoldings.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  userIsLinkedToOneHolding: state.linkedHolding.userIsLinkedToOneHolding,
  userIsLinkedToTwoOrMoreHoldings: state.linkedHolding.userIsLinkedToTwoOrMoreHoldings
})

export default connect(mapStateToProps)(BrowseHoldings)
