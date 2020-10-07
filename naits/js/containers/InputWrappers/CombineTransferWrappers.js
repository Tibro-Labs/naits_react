import React from 'react'
import TransferOriginWrapper from './TransferOriginWrapper.js'
import RangeValidationWrapper from './RangeValidationWrapper.js'

const CombineTransferWrappers = (props) => {
  return (
    <TransferOriginWrapper {...props}>
      <RangeValidationWrapper {...props}>
        {props.children}
      </RangeValidationWrapper>
    </TransferOriginWrapper>
  )
}

export default CombineTransferWrappers
