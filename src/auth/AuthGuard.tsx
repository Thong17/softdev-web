import Profile from "components/shared/Profile"
import { Link } from "react-router-dom"
import { UserContext } from "contexts/UserContext"
import { useContext } from "react"

const AuthGuard = () => {
  const user = useContext(UserContext)
  
  return <>{user ? <Profile username={user} /> : <Link to="/login">Login</Link>}</>
}

export default AuthGuard