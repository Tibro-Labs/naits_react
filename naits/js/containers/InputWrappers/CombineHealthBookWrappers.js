import React from 'react'
import InputSearchCampaignWrapper from './InputSearchCampaignWrapper.js'
import InputDisableDeleteHealthBookWrapper from './InputDisableDeleteHealthBookWrapper.js'

const CombineHealthBookWrappers = (props) => {
  return (
    <InputSearchCampaignWrapper {...props}>
      <InputDisableDeleteHealthBookWrapper {...props}>
        {props.children}
      </InputDisableDeleteHealthBookWrapper>
    </InputSearchCampaignWrapper>
  )
}

export default CombineHealthBookWrappers
