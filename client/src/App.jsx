import { useState, createContext, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import DisplayRegForm from './views/DisplayRegForm'
import DisplayDashboard from './views/DisplayDashboard'
import DisplayCreateTrip from './views/DisplayCreateTrip'
import DisplayEditTrip from './views/DisplayEditTrip'
import DisplayOneTrip from './views/DisplayOneTrip'
import useToken from './components/UseToken'
import DisplayLogin from './views/DisplayLogin'
import DisplayCreateJournalEntry from './views/DisplayCreateJournalEntry'
import DisplayEditEntry from './views/DisplayEditEntry'
import ProtectedRoute from './components/ProtectedRoute'

export const LoggedInUserContext = createContext(undefined)

function App() {
  const { token, setToken, removeToken } = useToken()
  const [loggedUser, setLoggedUser] = useState({"userId": "", "email": "", "token": ""})
  const [loading, setLoading] = useState(true)

  // Load user data from localStorage
  useEffect(() => {
    const activeUser = localStorage.getItem("loggedUser")
    if (activeUser) {
      const userData = JSON.parse(activeUser)
      // console.log("Loaded user from localStorage:", userData)
      setLoggedUser(userData)
      setToken(userData.token)
    }
    setLoading(false) // Loading is set to false after localStorage is checked
  }, [])

  if (loading) {
    return <div>App is loading...</div>
  }

  return (
    <>
        <LoggedInUserContext.Provider value={{loggedUser, setLoggedUser, token, setToken, removeToken}}>
          <Routes>
            <Route path="/" element={<DisplayRegForm />} />
            <Route path="/login" element={<DisplayLogin />} />
            <Route path="/dashboard/:user_id" element={<DisplayDashboard />} />
            <Route path="/trips/new" element={
              <ProtectedRoute>
                <DisplayCreateTrip />
              </ProtectedRoute>
              }
            />
            <Route path="/trips/:tripId" element={
              <ProtectedRoute>
                <DisplayOneTrip />
              </ProtectedRoute>
              } 
            />
            <Route path="/trips/:tripId/edit" element={
              <ProtectedRoute>
                <DisplayEditTrip />
              </ProtectedRoute>
            } />
            <Route path="/trips/:tripId/newentry" element={
              <ProtectedRoute>
                <DisplayCreateJournalEntry />
              </ProtectedRoute>
            } />
            <Route path="trips/:tripId/entries/:entryId/edit" element={
              <ProtectedRoute>
                <DisplayEditEntry />
              </ProtectedRoute>
            } />
          </Routes>
        </LoggedInUserContext.Provider>
    </>
  )
}

export default App
