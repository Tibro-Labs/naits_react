import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './Loading.module.css'

class Loading extends React.Component {
  render () {
    return (
      <div id='loaderPosition' className={styles.loaderPosition}>
        <div id='loading' style={{
          position: 'absolute', top: '50%', left: 'calc(50% - 40px)', overflow: 'hidden', zIndex: '999'
        }}
        >
          <div className={styles['lds-ripple']}><div /><div /></div>
        </div>
      </div>
    )
  }
}

export default CSSModules(Loading, styles, { allowMultiple: true, handleNotFoundStyleName: 'log' })
