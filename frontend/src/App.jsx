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
import { Navigate } from 'react-router'
import PageLoader from './components/PageLoader'
import useAuthUser from './hooks/useAuthUser'
const App = () => {
  const {isLoading,authUser}=useAuthUser()
  const isAuthenticated=Boolean(authUser)
  //console.log(isAuthenticated)
  const isOnboarded=authUser?.isOnboarded
  if(isLoading)
  {
    return <PageLoader/>
  }
  //console.log(data)
  return (
    <div data-theme="light">
      <button onClick={() => toast.success("HELLO WOLRD")}>Button</button>
      <Routes>
        <Route path="/" element={authUser && isOnboarded ? <HomePage /> : <Navigate to = {!isAuthenticated ? "/login":"/onboarding"} />} />
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