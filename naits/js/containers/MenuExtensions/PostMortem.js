import React from 'react'
import PropTypes from 'prop-types'
import * as config from 'config/config.js'
import sideMenuStyle from 'modulesCSS/SideMenu.module.css'
/**
 * Menu extension module.
 * @module containers/MenuExtensions
 * @exports containers/MenuExtensions/index.js
 * Post mortem extension - displayas an additional data form
 * Selected item state and form/grid generator functions are inherited from parent (side menu)
 * KNI 29.11.2018
 */
export default class PostMortem extends React.Component {
  render () {
    const { isActive, listItemId, highlightActivatedElement, generateGrid } = this.props
    return (
      <li
        id='postMortem'
        key='postMortem'
        type='button'
        {...isActive && listItemId === 'postMortem'
          ? { className: `list-group-item ${sideMenuStyle.li_item} ${sideMenuStyle.li_item_clicked}` }
          : { className: `list-group-item ${sideMenuStyle.li_item}` }
        }
        onClick={() => {
          highlightActivatedElement('postMortem')
          generateGrid({varType: 'POST_SLAUGHT_FORM'})
        }}
      >
        {this.context.intl.formatMessage({
          id: `${config.labelBasePath}.main.postmortem`,
          defaultMessage: `${config.labelBasePath}.main.postmortem`
        })}
      </li>
    )
  }
}

PostMortem.contextTypes = {
  intl: PropTypes.object.isRequired
}

PostMortem.propTypes = {
  isActive: PropTypes.bool,
  listItemId: PropTypes.string,
  highlightActivatedElement: PropTypes.func.isRequired,
  generateForm: PropTypes.func.isRequired,
  generateGrid: PropTypes.func.isRequired
}
