import React from 'react'
import PropTypes from 'prop-types'
import style from './item.module.css'
import UserProfilePopup from 'components/AppComponents/Functional/UserProfile/UserProfile'
import animations from './animations.module.css'
import * as config from 'config/config.js'

export default class UserProfileCircle extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      toggleUserProfilePopup: false
    }
  }

  handleUserProfileClick = () => {
    this.setState({ toggleUserProfilePopup: !this.state.toggleUserProfilePopup })
  }

  render () {
    return (
      <div className={animations.fadeIn}>
        <div
          onClick={this.handleUserProfileClick}
          className={style.mainDiv}
          data-tip={this.context.intl.formatMessage({ id: `${config.labelBasePath}.main.show_user_profile`, defaultMessage: `${config.labelBasePath}.main.show_user_profile` })}
          data-effect='float'
          data-event-off='mouseout'
        >
          <svg style={{ transform: 'scale(0.65)' }}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 512 512'>
            <path fill='#f2f2f2' d='M512 396.063v63.14c0 5.89-4.768 10.667-10.666 10.667h-260.34c-5.9 0-10.667-4.778-10.667-10.666V410.44H200.74c-.523.085-1.067.128-1.62.128H10.665C4.768 410.568 0 405.8 0 399.903v-63.14c0-31.636 25.182-57.49 56.55-58.61.352-.03.704-.052 1.067-.052 23.145 0 42.28-17.51 44.86-39.98-20.084-14.6-34.76-40.41-38.983-71.44-.768-.86-1.42-1.86-1.888-2.99-1.696-4.15-3.136-8.5-4.256-12.91-11.21-43.92 9.525-88.28 46.215-98.88 3.67-1.05 7.477-1.76 11.37-2.09 10.41-5.08 21.417-7.65 32.765-7.65 43.89 0 79.588 38.42 79.588 85.64 0 12.28-2.368 24.14-7.03 35.24-.49 1.17-1.172 2.2-1.983 3.08-2.656 20.16-9.802 38.79-20.82 53.7-5.45 7.37-11.594 13.53-18.26 18.38 2.613 22.45 21.726 39.94 44.86 39.94.405 0 .79.03 1.173.08 7.22.27 14.26 1.88 20.766 4.65 6.506 2.775 12.5 6.71 17.652 11.66l.064-.06c11.082 10.665 17.993 25.65 17.993 42.214v1.237c1.707-.21 3.434-.35 5.184-.413.34-.03.693-.05 1.056-.05 23.145 0 42.28-17.5 44.86-39.97-4.48-3.245-8.735-7.05-12.67-11.415-9.227-10.25-16.5-23.23-21.247-37.67-1.216 1.71-2.325 3.46-3.178 4.87-2.058 3.36-5.823 5.324-9.738 5.08-3.936-.236-7.423-2.625-9.066-6.21-5.152-11.275-8.64-23.41-10.378-36.094-.65-4.42-1.045-9.07-1.205-14.1-.94-29.76 7.72-58.12 24.41-79.86 17.17-22.37 40.75-35.146 66.38-35.97 12.41-.392 24.46 2.03 35.86 7.2.47-.03 3.41-.14 4.58-.083 22.2.216 43.15 10.477 59.02 28.918 15.5 18.006 24.48 42 25.3 67.56.83 26.06-6.9 50.93-21.78 70.04-2.06 2.65-5.18 4.12-8.41 4.12-1.05 0-2.12-.16-3.15-.48-3.42-1.054-6.02-3.74-7.05-7.07-7.09 17.354-17.86 31.614-30.93 41.13 2.57 22.482 21.71 40.02 44.87 40.02.37 0 .72.02 1.07.052 31.37 1.108 56.55 26.97 56.55 58.607zm-21.332 52.476v-52.48c0-20.59-16.745-37.33-37.33-37.33-.352 0-.704-.02-1.056-.06-3.67-.12-7.263-.52-10.772-1.21-9.27 30.42-37.608 52.11-70.34 52.11-32.745 0-61.084-21.7-70.352-52.12-3.498.69-7.103 1.09-10.772 1.2-.352.03-.704.05-1.056.05-2.496 0-4.928.24-7.285.71-8.5 1.68-15.967 6.27-21.332 12.67-4.02 4.79-6.858 10.61-8.063 16.99-.427 2.25-.65 4.57-.65 6.95v52.48h239.008zm-35.71-225.97c3.35-10.06 4.93-20.99 4.566-32.25-.66-20.71-7.818-40-20.148-54.33-11.84-13.75-27.187-21.39-43.207-21.5-.16 0-5.64.25-5.84.25-1.76.05-3.58-.31-5.14-1.1-14.03-7.07-27.79-6.31-28.42-6.28-19.13.6-36.93 10.43-50.13 27.63-13.7 17.84-20.8 41.34-20.01 66.18.14 4.23.47 8.09 1 11.79.58 4.31 1.42 8.52 2.46 12.63 8.93-9.61 23.14-17.62 31.6-20.81 8.56-3.19 17.55-4.95 26.78-5.25 1.87-.05 3.78-.05 5.66.01 12.52.44 23.78-5.5 29.36-15.49 1.97-3.53 3.7-7.277 5.12-11.106 1-2.73 3.09-4.93 5.76-6.09 2.66-1.15 5.69-1.177 8.37-.047 21.18 8.91 38.51 25.88 48.81 47.79 1.23 2.605 2.35 5.25 3.37 7.94zm-26.95-5.6c.03-.33.074-.64.127-.96-6.25-10.25-14.57-18.7-24.297-24.69-.544 1.06-1.11 2.13-1.696 3.18-9.503 16.99-28.126 27.1-48.72 26.4-1.41-.06-2.838-.06-4.246-.02-6.91.22-13.63 1.53-19.966 3.89-4.512 1.71-8.81 3.93-12.863 6.64 7.317 33.73 29.662 57.6 54.77 57.6 13.587 0 26.802-7.02 37.233-19.77 11.04-13.48 18.025-32.06 19.657-52.3zm-56.84 171.28c23.69 0 44.157-16.01 50.322-38.27-15.785-9.02-27.54-24.33-31.816-42.49-5.962 1.86-12.17 2.87-18.558 2.87-6.26 0-12.458-.99-18.462-2.87-4.277 18.16-16.02 33.47-31.816 42.49 6.164 22.26 26.632 38.27 50.33 38.27zm-110.795-43.38v-8.25c0-7.61-2.293-14.69-6.218-20.6-.235-.26-.427-.51-.63-.79-6.996-9.9-18.408-15.82-30.514-15.82-.35 0-.7-.02-1.05-.06-7.68-.24-15.04-1.78-21.85-4.43l-50.5 72.88c-1.98 2.88-5.27 4.59-8.77 4.59s-6.77-1.72-8.76-4.6l-50.49-72.87c-6.81 2.64-14.17 4.19-21.85 4.42-.35.03-.7.05-1.05.05-20.58 0-37.33 16.745-37.33 37.33v52.48H82.6v-.13h148.14c2.26-19.005 13.64-35.26 29.637-44.23zm-77.508-226.99c8.65 0 16.628 2.88 23.038 7.73-1.024-34.47-26.728-62.16-58.203-62.16-8.618 0-17.012 2.11-24.937 6.27-1.387.72-2.912 1.14-4.48 1.21-3.04.14-5.994.62-8.8 1.43-24.273 7.01-38.203 36.6-32.668 67.52 6.9-8.27 11.988-18 14.708-28.45 1.365-5.26 5.92-9.03 11.338-9.37 5.38-.34 10.37 2.79 12.39 7.8.88 2.17 2.33 4.06 4.23 5.48 2.21 1.64 4.84 2.51 7.63 2.51h55.77zm-2.57 89.23c11.422-15.47 17.736-36.17 17.81-58.32-2.75-5.66-8.532-9.58-15.24-9.58h-55.77c-7.414 0-14.464-2.34-20.394-6.76-.03-.03-.06-.06-.1-.08-5.27 11.43-12.8 21.78-22.12 30.32 2.32 18.27 9 34.9 19.13 47.26 10.43 12.74 23.66 19.76 37.24 19.76 14.68 0 28.69-8.03 39.47-22.61zM140.83 343.03l40.83-58.92c-10.943-9.076-18.92-21.597-22.302-35.87-5.984 1.858-12.19 2.818-18.526 2.818-6.367 0-12.564-.99-18.505-2.847-3.38 14.3-11.36 26.82-22.313 35.9l40.817 58.92z' />
            <path fill='#deaa87' fillOpacity='.91' d='M490.668 396.063v52.476h-239.01v-52.48c0-2.38.225-4.71.652-6.96 1.205-6.38 4.042-12.21 8.063-16.99 5.365-6.4 12.83-10.99 21.332-12.67 2.357-.47 4.79-.72 7.285-.72.352 0 .704-.02 1.056-.06 3.67-.12 7.274-.52 10.772-1.21 9.27 30.42 37.608 52.11 70.35 52.11 32.734 0 61.073-21.7 70.342-52.12 3.51.69 7.103 1.09 10.772 1.2.352.03.704.05 1.056.05 20.585 0 37.33 16.74 37.33 37.33z' opacity='.26' />
            <path fill='#d9ff97' fillOpacity='.527' d='M260.373 336.633v8.245c-16 8.97-27.38 25.225-29.64 44.23H82.585v.13H21.332V336.76c0-20.584 16.745-37.33 37.33-37.33.352 0 .704-.02 1.056-.052 7.68-.235 15.04-1.78 21.854-4.426l50.492 72.88c1.994 2.88 5.27 4.596 8.767 4.596 3.5 0 6.79-1.717 8.77-4.597l50.5-72.87c6.82 2.65 14.18 4.19 21.86 4.43.35.03.71.06 1.06.06 12.11 0 23.52 5.92 30.52 15.82.21.28.4.54.63.79 3.93 5.91 6.22 12.99 6.22 20.6z' opacity='.256' />
          </svg>

        </div>
        {this.state.toggleUserProfilePopup && <UserProfilePopup toggle={this.handleUserProfileClick} />}
      </div>
    )
  }
}

UserProfileCircle.contextTypes = {
  intl: PropTypes.object.isRequired
}