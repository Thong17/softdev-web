export declare type LanguageOptions = 'English' | 'Khmer'

export interface ILanguage {
  TEST: string
}

export interface ILanguageContext {
  lang: LanguageOptions
  language: ILanguage
  changeLanguage: Function
}
