import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import { gaEventTracker } from 'functions/utils'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import MassAnimalForm from 'components/AppComponents/Functional/AnimalMassGenerator/MassAnimalForm'

class AnimalMassGenerator extends React.Component {
  constructor (props) {
    super(props)
    this.form = null
    this.state = {
      form: null
    }
    this.closeModal = this.closeModal.bind(this)
    this.onAlertClose = this.onAlertClose.bind(this)
  }

  generateForm () {
    const form = <MassAnimalForm svSession={this.props.svSession} closeModal={this.closeModal} onAlertClose={this.onAlertClose} />
    this.setState({
      form: form
    })
  }

  closeModal () {
    this.setState({ form: null })
  }

  onAlertClose () {
    this.setState({ form: null })
  }

  render () {
    const { gridType, selectedObjects } = this.props
    const { form } = this.state
    let btn = null
    // double active flag hack
    if (gridType) {
      selectedObjects.map(singleObj => {
        if (singleObj.active) {
          btn = <div>
            <button
              id='animal_mass_generator'
              className={styles.container}
              style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
              onClick={() => {
                this.generateForm()
                gaEventTracker(
                  'GENERATE',
                  'Clicked the Generate mass animal button',
                  `HOLDING  | ${config.version} (${config.currentEnv})`
                )
              }}
            >
              <span
                id='accept_holding'
                className={style.actionText}
                style={{ marginLeft: '-7%', marginTop: '0.5%', cursor: 'pointer' }}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.generate_mass_animal`,
                  defaultMessage: `${config.labelBasePath}.generate_mass_animal`
                })}
              </span>
              <img id='animal_mass_img' src='/naits/img/massActionsIcons/lamb.png' />
            </button>
            {form}
          </div>
        }
      })
    }
    return btn
  }
}

AnimalMassGenerator.contextTypes = {
  intl: PropTypes.object.isRequired
}

AnimalMassGenerator.propTypes = {
  gridType: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  selectedObjects: state.gridConfig.gridHierarchy,
  massActionResult: state.massActionResult.result,
  componentToDisplay: state.componentToDisplay.componentToDisplay
})

export default connect(mapStateToProps)(AnimalMassGenerator)
