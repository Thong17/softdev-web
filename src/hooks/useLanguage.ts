import { useContext } from "react"
import { LanguageContext } from "contexts/language/LanguageContext"

const useLanguage = () => useContext(LanguageContext)

export default useLanguage