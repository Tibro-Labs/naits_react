import React from 'react'
import PropTypes from 'prop-types'

export default class PetPassportReadonlyInputWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      vetStationInput: 'root_pet_passport.basic_info_HOLDING_NAME',
      petIdInput: 'root_pet_passport.basic_info_PET_ID'
    }
  }

  componentDidMount () {
    const vetStationInput = document.getElementById(this.state.vetStationInput)
    const petIdInput = document.getElementById(this.state.petIdInput)
    vetStationInput.setAttribute('readonly', '')
    petIdInput.setAttribute('readonly', '')
  }

  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

PetPassportReadonlyInputWrapper.contextTypes = {
  intl: PropTypes.object.isRequired
}
