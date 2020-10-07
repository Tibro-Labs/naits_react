import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import axios from 'axios'
import { connect } from 'react-redux'
import { store } from 'tibro-redux'
import { alertUser } from 'tibro-components'
import { GridManager } from 'components/ComponentsIndex'
import { formatAlertType } from 'functions/utils'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'

class ReplacePetId extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: null,
      petId: '',
      petObjectId: '',
      selectedPetHasInventoryItem: null,
      newPetId: ''
    }
  }

  componentDidMount () {
    // Get the currently selected pet's id & object id
    this.getPetIdAndObjectId()
    // Check if the currently selected pet has an inventory item
    this.checkIfPetHasInvItem()
  }

  componentDidUpdate (nextProps) {
    if (this.props.petIdHasChanged !== nextProps.petIdHasChanged) {
      this.getPetIdAndObjectId()
    }
  }

  checkIfPetHasInvItem = async () => {
    let petObjectId
    this.props.gridHierarchy.map(singleGrid => {
      if (singleGrid.active && singleGrid.gridType === 'PET') {
        petObjectId = singleGrid.row['PET.OBJECT_ID']
      }
    })
    const server = config.svConfig.restSvcBaseUrl
    let verbPath = config.svConfig.triglavRestVerbs.CHECK_IF_PET_HAS_INVENTORY_ITEM
    verbPath = verbPath.replace('%sessionId', this.props.svSession)
    verbPath = verbPath.replace('%objectId', petObjectId)
    let url = `${server}${verbPath}`
    const res = await axios.get(url)
    this.setState({ selectedPetHasInventoryItem: res.data })
  }

  getPetIdAndObjectId = () => {
    this.props.gridHierarchy.map(singleGrid => {
      if (singleGrid.active && singleGrid.gridType === 'PET') {
        const petId = singleGrid.row['PET.PET_ID']
        const petObjectId = singleGrid.row['PET.OBJECT_ID']
        this.setState({ petId, petObjectId })
      }
    })
  }

  onChange = e => {
    this.setState({ newPetId: e.target.value })
  }

  showAlert = () => {
    let wrapper = document.createElement('div')
    ReactDOM.render(
      <div style={{ marginLeft: '12px' }}>
        <label htmlFor='oldPetId' style={{ marginRight: '8px' }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.pet.old_pet_id`,
            defaultMessage: `${config.labelBasePath}.main.pet.old_pet_id`
          })}
        </label>
        <br />
        <input
          style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1', marginBottom: '1rem' }}
          type='text'
          id='oldPetId'
          name='oldPetId'
          disabled
          value={this.state.petId}
        />
        <br />
        <label htmlFor='newPetId' style={{ marginRight: '8px', marginTop: '1rem' }}>
          {this.context.intl.formatMessage({
            id: `${config.labelBasePath}.main.pet.new_pet_id`,
            defaultMessage: `${config.labelBasePath}.main.pet.new_pet_id`
          })}
        </label>
        <br />
        <input
          style={{ border: 'none', height: '40px', color: '#000', backgroundColor: '#eff0f1' }}
          type='text'
          id='newPetId'
          name='newPetId'
          onChange={this.onChange}
        />
      </div>,
      wrapper
    )

    this.setState({
      alert: alertUser(
        true,
        'info',
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.replace_pet_id`,
          defaultMessage: `${config.labelBasePath}.main.replace_pet_id`
        }),
        null,
        () => {
          this.replacePetId()
          this.setState({ newPetId: '' })
        },
        () => {
          this.close()
          this.setState({ newPetId: '' })
        },
        true,
        this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.forms.replace`,
          defaultMessage: `${config.labelBasePath}.main.forms.replace`
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

  replacePetId = async () => {
    if (this.state.newPetId === '') {
      this.close()
    } else {
      let server = config.svConfig.restSvcBaseUrl
      let verbPath = config.svConfig.triglavRestVerbs.UPDATE_PET_ID
      let restUrl = `${server}${verbPath}`
      restUrl = restUrl.replace('%sessionId', this.props.svSession)
      restUrl = restUrl.replace('%objectId', this.state.petObjectId)
      restUrl = restUrl.replace('%updatedPetId', this.state.newPetId)
      try {
        const res = await axios.get(restUrl)
        if (res.data.includes('error')) {
          store.dispatch({ type: 'REPLACE_PET_ID_REJECTED', payload: res.data })
        } else if (res.data.includes('success')) {
          store.dispatch({ type: 'REPLACE_PET_ID_FULFILLED', payload: res.data })
        }
        const responseType = formatAlertType(res.data)
        this.setState({
          alert: alertUser(
            true,
            responseType,
            this.context.intl.formatMessage({
              id: res.data,
              defaultMessage: res.data
            }),
            null,
            () => {
              this.close()
              GridManager.reloadGridData(`INVENTORY_ITEM_${this.state.petObjectId}`)
              store.dispatch({ type: 'REPLACE_PET_ID_RESET' })
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
            null,
            () => {
              this.setState({ alert: false })
            }
          )
        })
      }
    }
  }

  close = () => {
    this.setState({ alert: false })
  }

  render () {
    return (
      <div style={{ display: this.state.selectedPetHasInventoryItem ? null : 'none' }}>
        <button
          id='pet_ear_tag_replacement'
          className={styles.container} style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
          onClick={() => this.showAlert()}
        >
          <span
            id='replace_ear_tag'
            className={style.actionText} style={{ padding: '4px', marginLeft: '-5%' }}
          >
            {this.context.intl.formatMessage({
              id: `${config.labelBasePath}.main.replace_pet_id`,
              defaultMessage: `${config.labelBasePath}.main.replace_pet_id`
            })}
          </span>
          <img id='animal_mass_img' src='/naits/img/massActionsIcons/replace.png' />
        </button>
      </div>
    )
  }
}

ReplacePetId.contextTypes = {
  intl: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  svSession: state.security.svSession,
  gridHierarchy: state.gridConfig.gridHierarchy,
  petIdHasChanged: state.replacePetId.petIdHasChanged
})

export default connect(mapStateToProps)(ReplacePetId)
