import React from 'react'
import PropTypes from 'prop-types'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import createHashHistory from 'history/createHashHistory'
import { documentsAction } from 'backend/documentsAction'
import StatusBadges from 'components/AppComponents/Presentational/StatusBadges'
import {
  LoginForm, Loading, AdminConsole, AuthorizeAccess,
  SelectedItem as WrapSelectedItem, Gis, ReportModule,
  SideMenuHOC, ExportCertificate, GenerateMenu, GroupedSearch,
  PublicAnimalLabels, PublicAnimalDetails, MessagingHolder,
  Questionnaires, BanksAndInsurance
} from 'components/ComponentsIndex'
import RegistrationForm from 'components/LogonComponents/LoginForm/RegistrationForm'
import WrapBackground from 'components/LogonComponents/LoginForm/Background'
import ValidateUser from 'components/LogonComponents/LoginForm/ValidateUser'
import PasswordReset from 'components/LogonComponents/LoginForm/PasswordReset'
import GridInModalLinkObjects from 'components/AppComponents/Functional/GridInModalLinkObjects'
import {
  NotFound as WrapNotFound,
  MainApp as WrapMainApp,
  UserMenu as WrapUserMenu,
  MainNavigation as WrapMainNavigation,
  EnforcePasswordChange
} from 'containers/ContainersIndex'
import { svSessionRegxp } from 'tibro-redux'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import DynamicRoutesHOC from './DynamicRoutesHOC'
import recordConfig from 'config/recordConfig'

import generateFieldWrappers from './generateFieldWrappers'
import { WrapConversation as WorkflowMessagingAssistant } from 'tibro-components'

const history = createHashHistory({ basename: '/' })
const UserIsNotAuthenticatedSoNeverEnter = connectedRouterRedirect({
  redirectPath: '/login',
  allowRedirectBack: false,
  authenticatedSelector: (state) => {
    if (!svSessionRegxp(state.security.svSession)) {
      localStorage.clear()
    }
    return svSessionRegxp(state.security.svSession)
  },
  authenticatingSelector: state => state.security.isBusy,
  // Want to redirect the user when they are done loading and authenticated
  wrapperDisplayName: 'UserIsNotAuthenticatedSoNeverEnter',
  AuthenticatingComponent: Loading
})

const UserIsAuthenticatedSoNeverEnter = connectedRouterRedirect({
  redirectPath: '/default',
  allowRedirectBack: false,
  authenticatedSelector: state => !svSessionRegxp(state.security.svSession),
  authenticatingSelector: state => state.security.isBusy,
  wrapperDisplayName: 'UserIsAuthenticatedSoNeverEnter',
  AuthenticatingComponent: Loading
})

const MainApp = UserIsNotAuthenticatedSoNeverEnter(SideMenuHOC(WrapMainApp))
const UserMenu = UserIsNotAuthenticatedSoNeverEnter(SideMenuHOC(WrapUserMenu))
const Background = UserIsAuthenticatedSoNeverEnter(WrapBackground)
const DynamicRoutes = DynamicRoutesHOC(MainApp)
const SelectedItem = UserIsNotAuthenticatedSoNeverEnter(WrapSelectedItem)
const MainNavigation = UserIsNotAuthenticatedSoNeverEnter(WrapMainNavigation)
const NotFound = UserIsNotAuthenticatedSoNeverEnter(WrapNotFound)

export default class Routes extends React.Component {
  render () {
    return (

      <Router history={history}>

        <Switch>
          <Redirect exact from='/' to='/login' />
          { /* Routes */}

          <Route
            exact
            path='/login'
            render={
              props =>
                (<Background {...props} >
                  <LoginForm {...props} />
                </Background>)
            }
          />

          <Route
            exact
            path='/register'
            render={
              props =>
                (<Background {...props} >
                  <RegistrationForm {...props} />
                </Background>)
            }
          />

          <Route
            exact
            path='/validate_user'
            render={
              props =>
                (<WrapBackground {...props} >
                  <ValidateUser {...props} />
                </WrapBackground>)
            }
          />

          <Route
            exact
            path='/password_reset'
            render={
              props =>
                (<Background {...props} >
                  <PasswordReset {...props} />
                </Background>)
            }
          />

          <Route
            exact
            path='/default'
            render={
              props => (
                <EnforcePasswordChange {...props} >
                  <UserMenu {...props} />
                </EnforcePasswordChange>
              )
            }
          />

          <Route
            exact
            path='/main/console'
            render={
              props =>
                (<MainApp {...props}>
                  <AuthorizeAccess {...props}>
                    <AdminConsole {...props} />
                  </AuthorizeAccess>
                </MainApp>)
            }
          />

          <Route
            path='/main/sv_data'
            render={
              props => (
                <MainApp {...props}>
                  <AuthorizeAccess {...props}>
                    <SelectedItem
                      documentsAction={documentsAction}
                      statusBadges={StatusBadges}
                      configuration={recordConfig}
                      gridInModal={GridInModalLinkObjects}
                      {...props}
                    />
                  </AuthorizeAccess>
                </MainApp>
              )
            }
          />

          <Route
            path='/main/dynamic'
            render={
              props =>
                (<DynamicRoutes showComponent={<MainNavigation {...props} />} jsonlist='SIDE_MENU_PALETTE' {...props} />)
            }
          />

          <Route
            path='/main/export_certificate'
            render={
              props =>
                (<MainApp {...props}>
                  <ExportCertificate {...props} />
                </MainApp>)
            }
          />

          <Route
            path='/main/export_cert'
            render={
              props => (
                <MainApp {...props}>
                  <GenerateMenu {...props} />
                </MainApp>
              )
            }
          />

          <Route
            path='/main/data'
            render={
              props =>
                (<DynamicRoutes
                  showComponent={
                    <SelectedItem
                      documentsAction={documentsAction}
                      statusBadges={StatusBadges}
                      configuration={recordConfig}
                      gridInModal={GridInModalLinkObjects}
                      {...props}
                    />
                  }
                  jsonlist='SIDE_MENU_PALETTE'
                  {...props}
                />)
            }
          />

          <Route
            path='/main/gis'
            render={
              props => (
                <MainApp {...props}>
                  <Gis {...props} />
                </MainApp>
              )
            }
          />

          <Route
            path='/main/reports'
            render={
              props => (
                <MainApp {...props}>
                  <ReportModule {...props} />
                </MainApp>
              )
            }
          />

          <Route
            path='/main/search'
            render={
              props => (
                <MainApp {...props}>
                  <GroupedSearch {...props} />
                </MainApp>
              )
            }
          />

          <Route
            exact
            path='/messages'
            render={
              props => (
                <MainApp {...props}>
                  <WorkflowMessagingAssistant {...props} onConvCreateClick={generateFieldWrappers} />
                </MainApp>
              )
            }
          />

          <Route
            exact
            path='/chats'
            render={
              props => (
                <MainApp {...props}>
                  <MessagingHolder {...props} />
                </MainApp>
              )
            }
          />

          <Route
            exact
            path='/questionnaires'
            render={
              props => (
                <MainApp {...props}>
                  <Questionnaires {...props} />
                </MainApp>
              )
            }
          />

          <Route
            exact
            path='/banks_and_insurance'
            render={
              props => (
                <MainApp {...props}>
                  <BanksAndInsurance {...props} />
                </MainApp>
              )
            }
          />

          {/* Public routes */}
          <Route
            exact
            path='/animal_labels'
            render={props => (<PublicAnimalLabels {...props} />)}
          />

          <Route
            exact
            path='/animal_details'
            render={props => (<PublicAnimalDetails {...props} />)}
          />

          <Route component={NotFound} status={404} />

        </Switch>

        { /* Catch all routes */}
      </Router>

    )
  }
}

Routes.contextTypes = {
  intl: PropTypes.object.isRequired
}
