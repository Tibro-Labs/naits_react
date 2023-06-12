import React from 'react'
import Loading from 'components/Loading'

export default class InputCampaignSecondLevelWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      testTypeFieldName: 'root_campaign.info_CAMPAIGN_TEST_TYPE',
      activityTypeDropdownName: 'root_campaign.info_ACTIVITY_TYPE',
      diseaseDropdownName: 'root_campaign.info_DISEASE',
      activitySubTypeDropdownName: 'root_campaign.info_ACTIVITY_SUBTYPE',
      scopeDropdownName: 'root_campaign.info_CAMPAIGN_SCOPE'
    }
  }

  componentDidMount () {
    const testTypeInput = document.getElementById(this.state.testTypeFieldName)
    if (testTypeInput && testTypeInput.value) {
      this.setState({ loading: true })
      testTypeInput.setAttribute('disabled', '')
      setTimeout(this.disableDropdowns, 1000)
    }
  }

  disableDropdowns = () => {
    const activityTypeDropdown = document.getElementById(this.state.activityTypeDropdownName)
    if (activityTypeDropdown) {
      activityTypeDropdown.setAttribute('disabled', '')
    }

    const diseaseDropdown = document.getElementById(this.state.diseaseDropdownName)
    if (diseaseDropdown) {
      diseaseDropdown.setAttribute('disabled', '')
    }

    const activitySubTypeDropdown = document.getElementById(this.state.activitySubTypeDropdownName)
    if (activitySubTypeDropdown) {
      activitySubTypeDropdown.setAttribute('disabled', '')
    }

    const scopeDropdown = document.getElementById(this.state.scopeDropdownName)
    if (scopeDropdown) {
      scopeDropdown.setAttribute('disabled', '')
    }

    if (activityTypeDropdown && diseaseDropdown && activitySubTypeDropdown && scopeDropdown) {
      this.setState({ loading: false })
    }
  }

  render () {
    return (
      <React.Fragment>
        {this.state.loading && <Loading />}
        {this.props.children}
      </React.Fragment>
    )
  }
}
