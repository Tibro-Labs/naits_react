import React from 'react'
import collapsibleStyle from './CollapsibleStyle.module.css'

export function CollapsibleFieldLeft (TargetComponent) {
  class WrapInCollapse extends React.Component {
    render () {
      return (
        <div>
          <input type='checkbox' id='collapse' className={collapsibleStyle.collapse} defaultChecked />
          <label htmlFor='collapse' id='collapse_lbl' className={collapsibleStyle.collapseLbl} />
          <div id='collapse_div' className={collapsibleStyle.collapseField}>
            <TargetComponent {...this.props} />
            {/* <ul id='collapse_list' className={collapsibleStyle.collapseList}>
              <li>icon1</li>
              <li>icon2</li>
              <li>icon3</li>
              <li>icon4</li>
            </ul> */ }
          </div>
        </div>
      )
    }
  }
  return WrapInCollapse
}

export function CollapsibleFieldRight (TargetComponent) {
  class WrapInCollapse extends React.Component {
    render () {
      return (
        <div>
          <input type='checkbox_right' id='collapse_right' className={collapsibleStyle.collapse} />
          <label htmlFor='collapse_right' id='collapse_lbl_right' className={collapsibleStyle.collapseLbl} />
          <div id='collapse_div_right' className={collapsibleStyle.collapseField}>
            <TargetComponent {...this.props} />
            {/* <ul id='collapse_list' className={collapsibleStyle.collapseList}>
              <li>icon1</li>
              <li>icon2</li>
              <li>icon3</li>
              <li>icon4</li>
            </ul> */}
          </div>
        </div>
      )
    }
  }
  return WrapInCollapse
}
