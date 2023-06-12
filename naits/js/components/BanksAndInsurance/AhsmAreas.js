import React from 'react'
import { connect } from 'react-redux'
import * as config from 'config/config'

class AhsmAreas extends React.Component {
  render () {
    const url = `naits_triglav_plugin/report/generatePdf/${this.props.session}/null/ahsm_areas`
    const src = `${config.svConfig.restSvcBaseUrl}/${url}`

    return (
      <iframe
        id='reportDisplayFrame'
        width={(window.innerWidth * 77) / 100}
        height={((window.innerHeight * 85) / 100) - 45}
        border='none'
        src={src}
      />
    )
  }
}

const mapStateToProps = state => ({
  session: state.security.svSession
})

export default connect(mapStateToProps)(AhsmAreas)
