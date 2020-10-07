import React from 'react'
import style from './Footer.module.css'
import * as config from 'config/config.js'

export default class Footer extends React.Component {
  render () {
    return (
      <div id='footer' className={style.footer}>
        {config.version}
      </div>
    )
  }
}
