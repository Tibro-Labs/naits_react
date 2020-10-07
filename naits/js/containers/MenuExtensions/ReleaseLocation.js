import React from 'react'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import sideMenuStyle from 'modulesCSS/SideMenu.module.css'

export default class ReleaseLocation extends React.Component {
  render () {
    const { isActive, listItemId, highlightActivatedElement, generateGrid } = this.props
    return (
      <li
        id='releaseLocation'
        key='releaseLocation'
        type='button'
        {...isActive && listItemId === 'releaseLocation'
          ? { className: `list-group-item ${sideMenuStyle.li_item} ${sideMenuStyle.li_item_clicked}` }
          : { className: `list-group-item ${sideMenuStyle.li_item}` }
        }
        onClick={() => {
          highlightActivatedElement('releaseLocation')
          generateGrid({
            varType: 'STRAY_PET_LOCATION',
            customWs: 'GET_TABLE_WITH_MULTIPLE_FILTERS',
            customId: 'RELEASE_LOCATION'
          })
        }}
      >
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.released_pets`,
          defaultMessage: `${config.labelBasePath}.main.released_pets`
        })}
      </li>
    )
  }
}

ReleaseLocation.contextTypes = {
  intl: PropTypes.object.isRequired
}

ReleaseLocation.propTypes = {
  isActive: PropTypes.bool,
  listItemId: PropTypes.string,
  highlightActivatedElement: PropTypes.func.isRequired,
  generateForm: PropTypes.func.isRequired,
  generateGrid: PropTypes.func.isRequired
}
