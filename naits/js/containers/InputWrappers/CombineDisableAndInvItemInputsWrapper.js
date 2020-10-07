import React from 'react'
import DisableInvItemInputsWrapper from './DisableInvItemInputsWrapper.js'
import DisableEventsInputWrapper from './DisableEventsInputWrapper.js'

const CombineDisableAndInvItemInputsWrapper = (props) => {
  return (
    <DisableEventsInputWrapper {...props}>
      <DisableInvItemInputsWrapper {...props}>
        {props.children}
      </DisableInvItemInputsWrapper>
    </DisableEventsInputWrapper>
  )
}

export default CombineDisableAndInvItemInputsWrapper
