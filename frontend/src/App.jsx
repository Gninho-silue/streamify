import { Navigate, Route, Routes } from 'react-router'
import { Toaster } from 'react-hot-toast';

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

import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import Layout from './components/Layout.jsx';
import { useThemeStore } from './store/useThemeStore.js';


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
            <Layout showSidebar={true}>
              <HomePage />
            </Layout>
          ) : isAuthenticated && !isOnBoarded ? (
            <Navigate to="/onboarding" />
          ) : (
            <Navigate to="/login" />
          )} />

        <Route path='/signup' element={!isAuthenticated ? <SignUpPage /> :
            <Navigate to={`${isOnBoarded ? "/" : "/onboarding"}`} />} />
            
        <Route path='/login' element={!isAuthenticated ? <LoginPage /> : 
                <Navigate to={`${isOnBoarded ? "/" : "/onboarding"}`} />} />

        <Route path='/onboarding' element={
          isAuthenticated && isOnBoarded ? (
            <Navigate to="/"/>
          ): isAuthenticated && !isOnBoarded ? (
                 <OnboardingPage />
            ):(
              
            <Navigate to="/login"/>
        )} /> 

        <Route path='/chat/:id' element={isAuthenticated && isOnBoarded ? (
          <Layout showSidebar={false}>
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

        <Route path="/users" element={<UsersPage />} />

      </Routes>

      <Toaster />
    </div>
  )
}

export default App
