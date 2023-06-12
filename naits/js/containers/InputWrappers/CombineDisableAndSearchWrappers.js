import React from 'react'
import HoldingFormFirstLevelInputWrapper from './HoldingFormFirstLevelInputWrapper.js'
import InputSearchCampaignWrapper from './InputSearchCampaignWrapper.js'
import DisableEventsInputWrapper from './DisableEventsInputWrapper.js'

const CombineDisableAndSearchWrappers = (props) => {
  return (
    <HoldingFormFirstLevelInputWrapper {...props}>
      <InputSearchCampaignWrapper {...props}>
        <DisableEventsInputWrapper {...props}>
          {props.children}
        </DisableEventsInputWrapper>
      </InputSearchCampaignWrapper>
    </HoldingFormFirstLevelInputWrapper>
  )
}

export default CombineDisableAndSearchWrappers
