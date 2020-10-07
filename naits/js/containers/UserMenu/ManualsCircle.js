import React from 'react'
import PropTypes from 'prop-types'
import style from './popup.module.css'
import mainStyle from './main.module.css'
import animations from './animations.module.css'
import * as config from 'config/config.js'

export default class ManualsCircle extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showIcon: true,
      showList: false
    }
  }

  render () {
    const labels = this.context.intl
    if (this.state.showIcon) {
      return (
        <div className={animations.fadeIn}>
          <div id='showManuals'
            className={style.backDiv + ' ' + mainStyle.searchBoxFade}
            data-tip={labels.formatMessage({ id: `${config.labelBasePath}.main.show_manuals`, defaultMessage: `${config.labelBasePath}.main.show_manuals` })}
            data-effect='float'
            data-event-off='mouseout'>
            <svg xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
              version='1.1'
              viewBox='0 0 512 512'
              xmlSpace='preserve'
              style={{ transform: 'scale(0.65)' }}
              onClick={() => this.setState({ showIcon: false, showList: true })}>
              <g>
                <g>
                  <g>
                    <path d='M352.459,220c0-11.046-8.954-20-20-20h-206c-11.046,0-20,8.954-20,20s8.954,20,20,20h206     C343.505,240,352.459,231.046,352.459,220z' fill='#FFFFFF' />
                    <path d='M126.459,280c-11.046,0-20,8.954-20,20c0,11.046,8.954,20,20,20H251.57c11.046,0,20-8.954,20-20c0-11.046-8.954-20-20-20     H126.459z' fill='#FFFFFF' />
                    <path d='M173.459,472H106.57c-22.056,0-40-17.944-40-40V80c0-22.056,17.944-40,40-40h245.889c22.056,0,40,17.944,40,40v123     c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20V80c0-44.112-35.888-80-80-80H106.57c-44.112,0-80,35.888-80,80v352     c0,44.112,35.888,80,80,80h66.889c11.046,0,20-8.954,20-20C193.459,480.954,184.505,472,173.459,472z' fill='#FFFFFF' />
                    <path d='M467.884,289.572c-23.394-23.394-61.458-23.395-84.837-0.016l-109.803,109.56c-2.332,2.327-4.052,5.193-5.01,8.345     l-23.913,78.725c-2.12,6.98-0.273,14.559,4.821,19.78c3.816,3.911,9,6.034,14.317,6.034c1.779,0,3.575-0.238,5.338-0.727     l80.725-22.361c3.322-0.92,6.35-2.683,8.79-5.119l109.573-109.367C491.279,351.032,491.279,312.968,467.884,289.572z        M333.776,451.768l-40.612,11.25l11.885-39.129l74.089-73.925l28.29,28.29L333.776,451.768zM439.615,346.13l-3.875,3.867       l-28.285-28.285l3.862-3.854c7.798-7.798,20.486-7.798,28.284,0C447.399,325.656,447.399,338.344,439.615,346.13z' fill='#FFFFFF' />
                    <path d='M332.459,120h-206c-11.046,0-20,8.954-20,20s8.954,20,20,20h206c11.046,0,20-8.954,20-20S343.505,120,332.459,120z' fill='#FFFFFF' />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )
    } else if (this.state.showList) {
      return (
        <div
          id='manualsList'
          className={`${style.popupBoxRight} ${style.showDiv} ${style.radius} ${style.manualsBox} ${
            this.state.lastNotificationRadius ? style.lastRadius : null
          }`}
        >
          <div
            id='closeList'
            onClick={() => this.setState({ showIcon: true, showList: false })}
            className='js-components-AppComponents-Functional-GridInModalLinkObjects-module-closeNotificationList'
          />
          <a id='doc_1' href={`/UserManuals/${config.labelBasePath}.manual.main_screen.pdf`} target='_blank'>
            {
              labels.formatMessage({
                id: `${config.labelBasePath}.manual.main_screen.pdf`,
                defaultMessage: `${config.labelBasePath}.manual.main_screen.pdf`
              })
            }
          </a>
          <br />
          <a id='doc_2' href={`/UserManuals/${config.labelBasePath}.manual.air.pdf`} target='_blank'>
            {
              labels.formatMessage({
                id: `${config.labelBasePath}.manual.air.pdf`,
                defaultMessage: `${config.labelBasePath}.manual.air.pdf`
              })
            }
          </a>
          <br />
          <a id='doc_3' href={`/UserManuals/${config.labelBasePath}.manual.food_safety.pdf`} target='_blank'>
            {
              labels.formatMessage({
                id: `${config.labelBasePath}.manual.food_safety.pdf`,
                defaultMessage: `${config.labelBasePath}.manual.food_safety.pdf`
              })
            }
          </a>
          <br />
          <a id='doc_4' href={`/UserManuals/${config.labelBasePath}.manual.movements.pdf`} target='_blank'>
            {
              labels.formatMessage({
                id: `${config.labelBasePath}.manual.movements.pdf`,
                defaultMessage: `${config.labelBasePath}.manual.movements.pdf`
              })
            }
          </a>
          <br />
          <a id='doc_5' href={`/UserManuals/${config.labelBasePath}.manual.animal_health.pdf`} target='_blank'>
            {
              labels.formatMessage({
                id: `${config.labelBasePath}.manual.animal_health.pdf`,
                defaultMessage: `${config.labelBasePath}.manual.animal_health.pdf`
              })
            }
          </a>
          <br />
          <a id='doc_6' href={`/UserManuals/${config.labelBasePath}.manual.total.pdf`} target='_blank'>
            {
              labels.formatMessage({
                id: `${config.labelBasePath}.manual.total.pdf`,
                defaultMessage: `${config.labelBasePath}.manual.total.pdf`
              })
            }
          </a>
          <br />
          <a id='naits_youtube_channel' href='https://www.youtube.com/channel/UC1QAB7WQTRFa_JOW3_dMLMA' target='_blank'>
            {
              labels.formatMessage({
                id: `${config.labelBasePath}.manual.video`,
                defaultMessage: `${config.labelBasePath}.manual.video`
              })
            }
          </a>
        </div>
      )
    }
  }
}

ManualsCircle.contextTypes = {
  intl: PropTypes.object.isRequired
}
