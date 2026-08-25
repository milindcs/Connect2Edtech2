import { Navigate, useLocation } from 'react-router-dom'
import { useUserAuth } from '../../context/UserAuthContext.jsx'

function UserProtectedRoute({ children }) {
  const { isAuthenticated } = useUserAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default UserProtectedRoute
