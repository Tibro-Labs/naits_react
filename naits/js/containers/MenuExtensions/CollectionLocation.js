import React from 'react'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import sideMenuStyle from 'modulesCSS/SideMenu.module.css'

export default class CollectionLocation extends React.Component {
  render () {
    const { isActive, listItemId, highlightActivatedElement, generateGrid } = this.props
    return (
      <li
        id='collectionLocation'
        key='collectionLocation'
        type='button'
        {...isActive && listItemId === 'collectionLocation'
          ? { className: `list-group-item ${sideMenuStyle.li_item} ${sideMenuStyle.li_item_clicked}` }
          : { className: `list-group-item ${sideMenuStyle.li_item}` }
        }
        onClick={() => {
          highlightActivatedElement('collectionLocation')
          generateGrid({
            varType: 'STRAY_PET_LOCATION',
            customWs: 'GET_TABLE_WITH_MULTIPLE_FILTERS',
            customId: 'COLLECTION_LOCATION',
            disableFormEdit: 'delete'
          })
        }}
      >
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.collected_pets`,
          defaultMessage: `${config.labelBasePath}.main.collected_pets`
        })}
      </li>
    )
  }
}

CollectionLocation.contextTypes = {
  intl: PropTypes.object.isRequired
}

CollectionLocation.propTypes = {
  isActive: PropTypes.bool,
  listItemId: PropTypes.string,
  highlightActivatedElement: PropTypes.func.isRequired,
  generateForm: PropTypes.func.isRequired,
  generateGrid: PropTypes.func.isRequired
}
