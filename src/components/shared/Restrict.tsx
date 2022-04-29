import { Link } from "react-router-dom"

const Restrict = ({redirect}) => {
  return (
    <div>You don't have permission to access this page, Please go to <Link to="/login" state={redirect}>Login</Link></div>
  )
}

export default Restrict