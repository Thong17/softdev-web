import { createContext } from "react";

const getUser = () => {
  return localStorage.getItem('x-access-user')
}

export const UserContext: any = createContext(getUser())