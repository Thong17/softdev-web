import { createContext, useMemo, useState } from 'react'
import { LanguageOptions, ILanguageContext, ILanguage } from './interface'
import { languages } from './constant'
import useAuth from 'hooks/useAuth'

const initState: LanguageOptions = 'english'

export const LanguageContext = createContext<ILanguageContext>({
  lang: initState,
  language: languages[initState],
  changeLanguage: (language: LanguageOptions) => {}
})

const LanguageProvider = ({ children }) => {
  const { user } = useAuth()
  const [lang, setLang] = useState<LanguageOptions>(user?.language || initState)

  const language = useMemo<ILanguage>(() => languages[lang], [lang])  

  const changeLanguage = (language: LanguageOptions) => {
    setLang(language)
  }

  return (
    <LanguageContext.Provider value={{ lang, language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageProvider
