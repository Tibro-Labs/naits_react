import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import style from 'components/AppComponents/ExecuteActions/ExecuteActionOnSelectedRows.module.css'
import styles from 'components/AppComponents/Presentational/Badges/Badges.module.css'
import EarTagForm from 'components/AppComponents/Functional/EarTagReplacement/EarTagForm'

class EarTagReplacementAction extends React.Component {
  constructor (props) {
    super(props)
    this.form = null
    this.state = {
      form: null
    }
  }

  generateForm () {
    const form = <EarTagForm
      svSession={this.props.svSession}
      closeModal={this.closeModal}
      onAlertClose={this.onAlertClose}
      gridType={this.props.gridType}
    />
    this.setState({
      form: form
    })
  }

  closeModal = () => {
    this.setState({ form: null })
  }

  onAlertClose = () => {
    this.setState({ form: null })
  }

  render () {
    const { gridType, selectedObjects } = this.props
    const { form } = this.state
    let btn = null
    // double active flag hack
    if (gridType) {
      selectedObjects.map(singleObj => {
        const isActive = singleObj.active
        if (isActive) {
          btn = <div>
            <button
              id='ear_tag_replacement'
              className={styles.container} style={{ cursor: 'pointer', marginRight: '7px', color: 'white' }}
              onClick={() => this.generateForm()}
            >
              <span
                id='replace_ear_tag'
                className={style.actionText} style={{ padding: '4px', marginLeft: '-5%', marginTop: '5px' }}
              >
                {this.context.intl.formatMessage({
                  id: `${config.labelBasePath}.replace_ear_tag`,
                  defaultMessage: `${config.labelBasePath}.replace_ear_tag`
                })}
              </span>
              <img id='animal_mass_img' src='/naits/img/massActionsIcons/replace.png' />
            </button>
            {/* <div id='displayAllRecords' className='displayContent'> */}
            {form}
          </div>
        }
      })
    }
    return btn
  }
}

EarTagReplacementAction.contextTypes = {
  intl: PropTypes.object.isRequired
}

EarTagReplacementAction.propTypes = {
  gridType: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  selectedObjects: state.gridConfig.gridHierarchy,
  massActionResult: state.massActionResult.result,
  componentToDisplay: state.componentToDisplay.componentToDisplay
})

export default connect(mapStateToProps)(EarTagReplacementAction)
