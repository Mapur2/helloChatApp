import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import HomePages from './pages/HomePages'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import NotificationPage from './pages/NotificationPage'
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import OnboardingPage from './pages/OnboardingPage'
import toast, { Toaster } from 'react-hot-toast'
import PageLoader from './components/PageLoader.jsx'
import useAuthUser from './hooks/useAuthUser.js'
import Layout from './components/Layout.jsx'
import useThemeStore from './store/useThemeStore.js'
import FriendsPage from './pages/FriendsPage.jsx'

function App() {
  const { authUser, isLoading } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboardingComplete = authUser?.isOnboarded;
  if (isLoading) {
    return <div><PageLoader /></div>
  }

  return (
    <>
      <div className='h-screen' data-theme={theme}>
        <Routes>
          <Route path="/" element={isAuthenticated && isOnboardingComplete ?
            <Layout showSidebar={true}>
              <HomePages />
            </Layout> :
            <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : isOnboardingComplete ? <Navigate to="/" /> : <Navigate to="/onboarding" />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <SignUpPage />} />
          <Route path="/notifications" element={isAuthenticated ? <Layout showSidebar={true}><NotificationPage /> </Layout>: <Navigate to="/login" />} />
          <Route path="/friends" element={isAuthenticated && isOnboardingComplete ? <Layout showSidebar={true}>
            <FriendsPage />
          </Layout> : <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />} />
          <Route path="/chat/:id" element={isAuthenticated && isOnboardingComplete ? <Layout showSidebar={true}>
            <ChatPage />
          </Layout> : <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />} />
          <Route path="/call/:id" element={isAuthenticated && isOnboardingComplete ? <CallPage /> : <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />} />
          <Route path="/onboarding" element={isAuthenticated ? <OnboardingPage /> : <Navigate to="/login" />} />
          <Route path="*" element={<div className='flex justify-center items-center h-screen text-3xl font-semibold'>404 | Page Not Found</div>} />
        </Routes>
        <Toaster />
      </div>
    </>
  )
}

export default App
