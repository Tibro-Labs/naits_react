import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { alertUser } from 'tibro-components'
import { store, removeAsyncReducer, dataToRedux, updateSelectedRows } from 'tibro-redux'
import { ComponentManager, GridManager, Loading } from 'components/ComponentsIndex'
import * as config from 'config/config.js'
import { strcmp } from 'functions/utils'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import modalStyle from 'components/AppComponents/Functional/GridInModalLinkObjects.module.css'
import searchStyle from 'containers/SearchStyles.module.css'

class FilterTransfersByRange extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: undefined,
      showModal: false,
      renderGrid: false,
      rangeFrom: '',
      rangeTo: '',
      searchGrid: 'TRANSFER'
    }
  }

  handleRangeInputChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  showModal = () => {
    store.dispatch(updateSelectedRows([], null))
    const firstGridId = `${this.props.customGridId}_${this.props.parentId}_1`
    const secondGridId = `${this.props.customGridId}_${this.props.parentId}_2`
    ComponentManager.setStateForComponent(firstGridId, null, {
      selectedIndexes: []
    })
    ComponentManager.setStateForComponent(secondGridId, null, {
      selectedIndexes: []
    })
    this.setState({ showModal: true })
  }

  closeModal = () => {
    removeAsyncReducer(store, this.state.searchGrid)
    store.dispatch(updateSelectedRows([], null))
    this.setState({ showModal: false, rangeFrom: '', rangeTo: '', renderGrid: false })
  }

  handleSearch = () => {
    const { rangeFrom, rangeTo } = this.state
    if (!rangeFrom && !rangeTo) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_ranges_entered`,
            defaultMessage: `${config.labelBasePath}.alert.no_ranges_entered`
          }), null, () => { this.setState({ alert: false }) }
        )
      })
    } else if (!rangeFrom) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_range_from_entered`,
            defaultMessage: `${config.labelBasePath}.alert.no_range_from_entered`
          }), null, () => { this.setState({ alert: false }) }
        )
      })
    } else if (!rangeTo) {
      this.setState({
        alert: alertUser(true, 'warning',
          this.context.intl.formatMessage({
            id: `${config.labelBasePath}.alert.no_range_to_entered`,
            defaultMessage: `${config.labelBasePath}.alert.no_range_to_entered`
          }), null, () => { this.setState({ alert: false }) }
        )
      })
    } else {
      removeAsyncReducer(store, this.state.searchGrid)
      dataToRedux(null, 'componentIndex', this.state.searchGrid, '')
      localStorage.removeItem(`reduxPersist:${this.state.searchGrid}`)
      this.setState({ renderGrid: false }, () => this.setState({ renderGrid: true }))
    }
  }

  handleSearchByTheEnterKey = e => {
    if (e.keyCode === 13) {
      this.handleSearch()
    }
  }

  generateGrid = (state, props) => {
    const gridTypeCall = 'GET_TRANSFER_BY_RANGE'
    const transferType = props.customGridId.split('_').reverse().join('_')
    let skipCheck = false
    if (props.gridProps && props.gridProps.isSpecificType && props.gridProps.isSpecificType.ID && strcmp(props.gridProps.isSpecificType.ID, 'headquarter')) {
      skipCheck = true
    }
    const gridParams = []

    gridParams.push({
      PARAM_NAME: 'session',
      PARAM_VALUE: props.session
    }, {
      PARAM_NAME: 'gridConfigWeWant',
      PARAM_VALUE: state.searchGrid
    }, {
      PARAM_NAME: 'parentId',
      PARAM_VALUE: props.parentId
    }, {
      PARAM_NAME: 'rangeFrom',
      PARAM_VALUE: state.rangeFrom
    }, {
      PARAM_NAME: 'rangeTo',
      PARAM_VALUE: state.rangeTo
    }, {
      PARAM_NAME: 'transferType',
      PARAM_VALUE: transferType
    }, {
      PARAM_NAME: 'skipCheck',
      PARAM_VALUE: skipCheck
    })

    return GridManager.generateGrid(
      state.searchGrid, state.searchGrid, 'CUSTOM_GRID',
      gridTypeCall, gridParams, 'CUSTOM', null, false, true, this.onSelectChange
    )
  }

  onSelectChange = (selectedRows, gridId) => {
    store.dispatch(updateSelectedRows(selectedRows, gridId))
  }

  render () {
    const modal = (<div id='search_modal' className='modal' style={{ display: 'flex' }}>
      <div id='search_modal_content' className='modal-content' style={{ width: '100%' }}>
        <div className='modal-header' />
        <div id='search_modal_body' className='modal-body'>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
            <div>
              <input
                id='rangeFrom'
                name='rangeFrom'
                className={`${searchStyle.customInvItemInput} ${this.state.emptyInputClassName}`}
                style={{ marginRight: '1px', borderBottomLeftRadius: '5px', borderTopLeftRadius: '5px' }}
                onChange={(e) => this.handleRangeInputChange(e)}
                onKeyDown={(e) => this.handleSearchByTheEnterKey(e)}
                placeholder={
                  this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.range_from`, defaultMessage: `${config.labelBasePath}.main.range_from` })
                }
              />
              <input
                id='rangeTo'
                name='rangeTo'
                className={`${searchStyle.customInvItemInput} ${this.state.emptyInputClassName}`}
                onChange={(e) => this.handleRangeInputChange(e)}
                onKeyDown={(e) => this.handleSearchByTheEnterKey(e)}
                placeholder={
                  this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.range_to`, defaultMessage: `${config.labelBasePath}.main.range_to` })
                }
              />
              <button
                className={searchStyle.button}
                style={{ float: 'none' }}
                onClick={() => this.handleSearch()}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.main.search`,
                  defaultMessage: `${config.labelBasePath}.main.search`
                })}
              </button>
            </div>
          </div>
          {this.state.renderGrid && this.generateGrid(this.state, this.props)}
        </div>
      </div>
      <div id='modal_close_btn' type='button' className={modalStyle.close}
        style={{
          position: 'absolute',
          right: 'calc(11% - 9px)',
          top: '44px',
          width: '32px',
          height: '32px',
          opacity: '1'
        }}
        onClick={this.closeModal} data-dismiss='modal' />
    </div>)

    return (
      <React.Fragment>
        <div
          id='get_transfers_by_range_container'
          className={styles.container}
          style={{ cursor: 'pointer', marginRight: '7px', color: 'white', width: 'auto' }}
          onClick={this.showModal}
        >
          <p style={{ marginTop: '2px' }}>
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.filter_transfers_by_range`,
              defaultMessage: `${config.labelBasePath}.main.filter_transfers_by_range`
            })}
          </p>
          <div id='get_transfers_by_range' className={styles['gauge-container']} style={{ width: 'auto' }}>
            <img
              id='get_transfers_by_range_img' className={style.actionImg}
              style={{ height: '45px', marginTop: '7%', marginLeft: '14px' }}
              src='/naits/img/massActionsIcons/replace.png'
            />
          </div>
        </div>
        {this.props.isLoading && <Loading />}
        {this.state.showModal && ReactDOM.createPortal(modal, document.getElementById('app'))}
      </React.Fragment>
    )
  }
}

FilterTransfersByRange.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

const mapDispatchToProps = dispatch => ({
  updateSelectedRows: (...params) => {
    dispatch(updateSelectedRows(...params))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(FilterTransfersByRange)
