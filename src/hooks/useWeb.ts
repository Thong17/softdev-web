import { useContext } from "react";
import { WebContext } from "contexts/web/WebContext";

const useWeb = () => useContext(WebContext)

export default useWeb