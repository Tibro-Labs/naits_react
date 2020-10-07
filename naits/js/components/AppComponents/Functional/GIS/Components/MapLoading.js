import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './MapLoading.module.css'

const msgList = [
  'Please wait',
  'Fetching geometry data',
  'Searching animal movements',
  'Animating movement lines',
  'Processing incoming animals',
  'Counting premises',
  'Locating villages',
  'Categorizing holdings',
  'Loading quarantined areas',
  'Indexing blacklisted locations',
  'Checking quarantine expiration dates',
  'Calculating quarantine surface',
  'Generating spatial identifier',
  'Tiling map images',
  'Clustering markers',
  'Transforming coordinates',
  'Re-projecting data points',
  'Calculating bounding box',
  'Beautifying points of interest',
  'Creating polygons',
  'Pinning markers',
  'Drawing circles',
  'Attaching events',
  'Grouping layers',
  'Simplifying geometry',
  'Processing requests',
  'Redrawing trees',
  'Building mountains',
  'Mapping rivers',
  'Calculating vegetation index'
]

class MapLoading extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      msg: '',
      idx: 0
    }
  }

  componentDidMount () {
    function getSampleMessage () {
      return msgList[Math.floor(Math.random() * msgList.length)]
    }
    // init default
    this.setState({msg: getSampleMessage()})
    // start clock
    let idx = setInterval(function (ref) {
      ref.setState({msg: getSampleMessage()})
    }, 5000, this)
    // set clock id
    this.setState({idx: idx})
  }

  componentWillUnmount () {
    // reset clock
    clearInterval(this.state.idx)
  }

  render () {
    return (
      <div id='loaderPosition' className={styles.loaderPosition}>
        <div id='loading' style={{
          position: 'absolute', top: '50%', left: 'calc(50% - 40px)', overflow: 'hidden', zIndex: '999'
        }}
        >
          <div id='mapLoading_label' className='mapLoading_label' >
            {this.state.msg}
          </div>
          <div className={styles['map-loading-ripple']}><div /><div /></div>
        </div>
      </div>
    )
  }
}

export default CSSModules(MapLoading, styles, { allowMultiple: true, handleNotFoundStyleName: 'log' })
