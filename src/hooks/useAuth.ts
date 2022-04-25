import { useContext } from "react";
import { AuthContext } from "contexts/auth/AuthContext";

const useAuth = () => useContext(AuthContext);

export default useAuth;
