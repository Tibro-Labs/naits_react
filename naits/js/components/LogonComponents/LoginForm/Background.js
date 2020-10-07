import React from 'react'
import backgroundStyle from './Background.module.css'
import { connect } from 'react-redux'
import { getLabels } from 'client.js'

class Background extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      backgroundisVideo: false
    }
    this.toggleBackground = this.toggleBackground.bind(this)
  }

  toggleBackground () {
    if (this.state.backgroundisVideo === true) {
      this.setState({ backgroundisVideo: false })
    } else {
      this.setState({ backgroundisVideo: true })
    }
  }

  toggleLangImgs = (lang) => () => {
    if (this.props.locale === 'en-US') {
      getLabels(null, 'ka-GE')
    } else if (this.props.locale === 'ka-GE') {
      getLabels(null, 'en-US')
    }
  }

  render () {
    const video = (<video
      className={backgroundStyle.video}
      autoPlay='autoPlay'
      loop
      muted
    >
      <source src='img/cattle_vid.mp4' type='video/mp4' />
    </video>)
    const img = (<div className={backgroundStyle.video}>
      <img src='img/bg_anim/sheeps2.jpg' />
    </div>)

    const children = React.cloneElement(this.props.children, {
      toggleLangImgs: this.toggleLangImgs
    })

    return (
      <div id='bg' className={backgroundStyle.bg}>
        {
          this.state.backgroundisVideo ? video : img
        }

        <span onClick={this.toggleBackground} className={backgroundStyle.imgBackgroundSwitch}> <img src='img/login/camera-switch.png' /></span>
        <span className={backgroundStyle.imgGeorgia}> <img src='img/georgia_coat_of_arms.png' /></span>
        {children}
        <span className={backgroundStyle.imgSponsors}>
          {this.props.locale === 'ka-GE' ? <img src='img/login/georgia/represent1ge.png' /> : <img src='img/login/georgia/represent1.png' />}
        </span>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  locale: state.intl.locale
})

export default connect(mapStateToProps)(Background)
