import React from 'react'
import InputSearchCampaignWrapper from './InputSearchCampaignWrapper.js'
import DisableEventsInputWrapper from './DisableEventsInputWrapper.js'

const CombineDisableAndSearchWrappers = (props) => {
  return (
    <InputSearchCampaignWrapper {...props}>
      <DisableEventsInputWrapper {...props}>
        {props.children}
      </DisableEventsInputWrapper>
    </InputSearchCampaignWrapper>
  )
}

export default CombineDisableAndSearchWrappers
