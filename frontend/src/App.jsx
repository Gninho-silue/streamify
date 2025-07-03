import {Navigate, Route, Routes} from 'react-router'
import {Toaster} from 'react-hot-toast';

import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import CallPage from './pages/CallPage.jsx'
import NotificationPage from './pages/NotificationPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import FriendsPage from './pages/FriendsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import BlockedUsersPage from './pages/BlockedUsersPage.jsx';
import UsersPage from './pages/UsersPage';
import LandingPage from './pages/LandingPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import GroupsPage from './pages/GroupsPage.jsx';
import CreateGroupPage from './pages/CreateGroupPage.jsx';
import GroupDetailPage from './pages/GroupDetailPage.jsx';
import MyGroupsPage from './pages/MyGroupsPage.jsx';
import GroupCallPage from './pages/GroupCallPage.jsx';

import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import Layout from './components/Layout.jsx';
import {useThemeStore} from './store/useThemeStore.js';
import UpdateGroupPage from "./pages/UpdateGroupPage.jsx";


const App = () =>  {

  const { isLoading, authUser } = useAuthUser();

  const { theme } = useThemeStore();
  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.isOnBoarded;

  if (isLoading) {
    return <PageLoader />
  }


  return (
    <div className='h-screen' data-theme={theme}>
      <Routes>
        <Route path='/' element={
          isAuthenticated && isOnBoarded ?(
            <Navigate to="/home" />
          ) : (
            <LandingPage />
          )} />
        <Route path='/home' element={
          isAuthenticated && isOnBoarded ?(
            <Layout showSidebar={true}>
              <HomePage />
            </Layout>
          ) : isAuthenticated && !isOnBoarded ? (
            <Navigate to="/onboarding" />
          ) : (
            <Navigate to="/login" />
          )} />

        <Route path='/signup' element={!isAuthenticated ? <SignUpPage /> :
            <Navigate to={`${isOnBoarded ? "/home" : "/onboarding"}`} />} />
            
        <Route path='/login' element={!isAuthenticated ? <LoginPage /> : 
                <Navigate to={`${isOnBoarded ? "/home" : "/onboarding"}`} />} />

        <Route path='/onboarding' element={
          isAuthenticated && isOnBoarded ? (
            <Navigate to="/"/>
          ): isAuthenticated && !isOnBoarded ? (
                 <OnboardingPage />
            ):(
              
            <Navigate to="/login"/>
        )} /> 

        <Route path='/chat/:id' element={isAuthenticated && isOnBoarded ? (
          <Layout showSidebar={true}>
            <ChatPage />
          </Layout>
        ) : (
          <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
        )


        } />
        <Route path='/call/:id' element={isAuthenticated && isOnBoarded ? (
          <Layout showSidebar={false}>
            <CallPage />
          </Layout>
        ) : (
          <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
        )} />
        <Route path='/notifications' element={isAuthenticated  && isOnBoarded ? (
          <Layout showSidebar={true}>
            <NotificationPage />
          </Layout>
        ) : (
          <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
        )} />

        <Route path='/profile' element={isAuthenticated && isOnBoarded ? (
          <Layout showSidebar={true}>
            <ProfilePage />
          </Layout>
        ) : (
          <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
        )} />

        <Route path='/friends' element={isAuthenticated && isOnBoarded ? (
          <Layout showSidebar={true}>
            <FriendsPage />
          </Layout>
        ) : (
          <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
        )} />

        <Route path='/settings' element={isAuthenticated && isOnBoarded ? (
          <Layout showSidebar={true}>
            <SettingsPage />
          </Layout>
        ) : (
          <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
        )} />

        <Route path='/blocked-users' element={isAuthenticated && isOnBoarded ? (
          <Layout showSidebar={true}>
            <BlockedUsersPage />
          </Layout>
        ) : (
          <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
        )} />

        <Route path="/users" element={ isAuthenticated && isOnBoarded ? (
            <Layout showSidebar={true}>
              <UsersPage />
            </Layout>
        ) :(
            <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
        )} />

        <Route path="/users/:id" element={ isAuthenticated && isOnBoarded ? (
            <Layout showSidebar={true}>
              <UserProfilePage />
            </Layout>
        ) :(
            <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
        )} />

        <Route path="/groups" element={ isAuthenticated && isOnBoarded ? (
            <Layout showSidebar={true}>
              <GroupsPage />
            </Layout>
        ) :(
            <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
        )} />


        <Route path="/groups/create" element={ isAuthenticated && isOnBoarded ? (
            <Layout showSidebar={true}>
              <CreateGroupPage />
            </Layout>
        ) :(
            <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
        )} />

          <Route path="/groups/:id/edit" element={ isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
                  <UpdateGroupPage />
              </Layout>
          ) :(
              <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
          )} />

        <Route path="/groups/:id" element={ isAuthenticated && isOnBoarded ? (
            <Layout showSidebar={true}>
              <GroupDetailPage />
            </Layout>
        ) :(
            <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
        )} />

        <Route path="/groups/:id/call" element={ isAuthenticated && isOnBoarded ? (
            <GroupCallPage />
        ) :(
            <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
        )} />

        <Route path="/groups/:id/call/:callType" element={ isAuthenticated && isOnBoarded ? (
            <GroupCallPage />
        ) :(
            <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
        )} />

        <Route path="/my-groups" element={ isAuthenticated && isOnBoarded ? (
            <Layout showSidebar={true}>
              <MyGroupsPage />
            </Layout>
        ) :(
          <Navigate to={`${isAuthenticated ? "/onboarding" : "/login"}`} />
        )} />

      </Routes>

      <Toaster />
    </div>
  )
}

export default App
