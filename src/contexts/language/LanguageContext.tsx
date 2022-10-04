import { createContext, useEffect, useMemo, useState } from 'react'
import { LanguageOptions, ILanguageContext, ILanguage } from './interface'
import { languages } from './constant'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import Axios from 'constants/functions/Axios'

const initState: LanguageOptions = 'English'

export const LanguageContext = createContext<ILanguageContext>({
  lang: initState,
  language: languages[initState],
  changeLanguage: (language: LanguageOptions) => {},
})

const LanguageProvider = ({ children }) => {
  const { user } = useAuth()
  const [lang, setLang] = useState<LanguageOptions>(user?.language || initState)
  const { notify } = useNotify()

  useEffect(() => {
    const userLang: LanguageOptions = user?.language || initState
    setLang(userLang)
  }, [user?.language])

  const language = useMemo<ILanguage>(() => languages[lang], [lang])

  const changeLanguage = async (language: LanguageOptions) => {
    const response = await Axios({
      method: 'POST',
      url: `/user/language/change`,
      body: { language },
    })

    if (response?.data?.code !== 'SUCCESS') {
      return notify(response.data.msg, 'error')
    }
    setLang(response.data.language)
  }

  return (
    <LanguageContext.Provider value={{ lang, language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageProvider
