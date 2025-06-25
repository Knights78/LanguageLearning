import { Routes } from 'react-router'
import { Route } from 'react-router'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import OnBoardingPage from './pages/onBoardingPage' 
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import NotificationsPage from './pages/NotificationsPage'
import { Navigate } from 'react-router'
import PageLoader from './components/PageLoader'
import useAuthUser from './hooks/useAuthUser'
import Layout from './components/Layout'
import { useThemeStore } from './store/useThemeStore.js'
const App = () => {
  const {isLoading,authUser}=useAuthUser()
  const isAuthenticated=Boolean(authUser)
  //console.log(isAuthenticated);
  //console.log(isAuthenticated)
  const {theme}=useThemeStore()
  const isOnboarded=authUser?.isOnboarded
  if(isLoading)
  {
    return <PageLoader/>
  }
  //console.log(data)

  return (
    <div data-theme={theme} className='h-screen'>
    
      <Routes>
        <Route path="/"
         element={isAuthenticated && isOnboarded ? 
          <Layout showSidebar={true}>
            <HomePage/>
          </Layout>
          

          :
           <Navigate to = {!isAuthenticated ? "/login":"/onboarding"} />}
          />
         <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to="/" />} />
         <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnBoardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/chat/:id" 
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
        <Route path="/call/:id"//a call is at channleId which is made between two users 
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <CallPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
         />
        <Route path="/notifications" element={
          isAuthenticated && isOnboarded ?(
            <Layout showSidebar={true}>
              <NotificationsPage />
            </Layout>
          ):(
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          ) 
        } />
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