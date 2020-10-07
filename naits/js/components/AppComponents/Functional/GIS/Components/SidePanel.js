import React from 'react'
import PropTypes from 'prop-types'

const SidePanel = props => {
  const {content, style} = props
  return <div id='sidePanel' className='sidePanel' style={style} >
    {content}
  </div>
}

SidePanel.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]).isRequired,
  style: PropTypes.object
}

export default SidePanel
