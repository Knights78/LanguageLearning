import React from 'react'
import { Routes } from 'react-router'
import { Route } from 'react-router'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import OnBoardingPage from './pages/onBoardingPage' 
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import NotificationsPage from './pages/NotificationsPage'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios'
import { Navigate } from 'react-router'
const App = () => {
  const { data:authData, isLoading, error } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me')
      return res.data
    },
    retry: false,//this is doing to stop retrying the request if it fails
  })
  const authUser = authData?.user

  //console.log(data)
  return (
    <div data-theme="light">
      <button onClick={() => toast.success("HELLO WOLRD")}>Button</button>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <LoginPage />} />
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/onboarding" element={authUser ? <OnBoardingPage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/call" element={authUser ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to="/login" />} />
      </Routes>
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <p>Copyright © 2023 - All right reserved by ACME Industries Ltd</p>
        </div>
      </footer>
    </div>
  )
}

export default App