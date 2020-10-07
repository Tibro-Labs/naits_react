import React from 'react'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import sideMenuStyle from 'modulesCSS/SideMenu.module.css'
/**
 * Menu extension module.
 * @module containers/MenuExtensions
 * @exports containers/MenuExtensions/index.js
 * Pre mortem extension - displayas an additional data form
 * Selected item state and form/grid generator functions are inherited from parent (side menu)
 * KNI 29.11.2018
 */
export default class PreMortem extends React.Component {
  render () {
    const { isActive, listItemId, highlightActivatedElement, generateGrid } = this.props
    return (
      <li
        id='preMortem'
        key='preMortem'
        type='button'
        {...isActive && listItemId === 'preMortem'
          ? { className: `list-group-item ${sideMenuStyle.li_item} ${sideMenuStyle.li_item_clicked}` }
          : { className: `list-group-item ${sideMenuStyle.li_item}` }
        }
        onClick={() => {
          highlightActivatedElement('preMortem')
          generateGrid({varType: 'PRE_SLAUGHT_FORM', customDelete: 'DELETE_TABLE_OBJECT_WITH_SAVE_CHECK'})
        }}
      >
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.premortem`,
          defaultMessage: `${config.labelBasePath}.main.premortem`
        })}
      </li>
    )
  }
}

PreMortem.contextTypes = {
  intl: PropTypes.object.isRequired
}

PreMortem.propTypes = {
  isActive: PropTypes.bool,
  listItemId: PropTypes.string,
  highlightActivatedElement: PropTypes.func.isRequired,
  generateForm: PropTypes.func.isRequired,
  generateGrid: PropTypes.func.isRequired
}
