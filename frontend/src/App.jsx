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
import { useQuery } from '@tanstack/react-query'
import axiosInstance from './lib/axio.js'

function App() {
  const { data:authData, isLoading, isError } = useQuery({
    queryKey:["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me')
      return res.data
    },
    retry:false
  })
  const authUser = authData?.user;

  return (
    <>
    <div className='h-screen' data-theme="forest">
      <Routes>
        <Route path="/" element={authUser?<HomePages />:<Navigate to="/login" />} />
        <Route path="/login" element={authUser?<Navigate to="/" />:<LoginPage />} />
        <Route path="/signup" element={authUser?<Navigate to="/" />:<SignUpPage />} />
        <Route path="/notifications" element={authUser?<NotificationPage />:<Navigate to="/login" />} />
        <Route path = "/chat" element={authUser?<ChatPage />:<Navigate to="/login" />} />
        <Route path = "/call" element={authUser?<CallPage />:<Navigate to="/login" />} />
        <Route path="/onboarding" element={authUser?<OnboardingPage />:<Navigate to="/login" />} />
        <Route path="*" element={<div className='flex justify-center items-center h-screen text-3xl font-semibold'>404 | Page Not Found</div>} />
      </Routes>
      <Toaster/>
    </div>
    </>
  )
}

export default App
