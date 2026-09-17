import { Routes, Route, Navigate } from 'react-router'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import NotificationsPage from './pages/NotificationsPage'
import CallPage from './pages/CallPage'
import ChatPage from './pages/ChatPage'
import OnboardingPage from './pages/OnboardingPage'
import Layout from './components/Layout'
import FriendsPage from './pages/FriendsPage'


import { Toaster } from 'react-hot-toast'
import PageLoader from './components/PageLoader'
import useAuthUser from './hooks/useAuthUser'
import EditProfilePage from './pages/EditProfilePage'

const App = () => {

  const { authUser, isLoading } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;


  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  return (
    <div className=' h-screen' data-theme="forest">
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate
                to={!isAuthenticated ? "/login" : "/onboarding"}
              />
            )
          }
        />


        {/* SIGN UP */}
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate
                to={!isOnboarded ? "/onboarding" : "/"}
              />
            )
          }
        />


        {/* LOGIN */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate
                to={!isOnboarded ? "/onboarding" : "/"}
              />
            )
          }
        />


        {/* NOTIFICATIONS */}
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        {/* FRIENDS */}
        <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate
                to={!isAuthenticated ? "/login" : "/onboarding"}
              />
            )
          }
        />


        {/* CALL */}
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        {/* CHAT */}
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />


        {/* ONBOARDING */}
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* EDIT PROFILE */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              isOnboarded ? (
                <EditProfilePage />
              ) : (
                <Navigate to="/onboarding" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

      </Routes>
      <Toaster />
    </div>
  )
}

export default App