export declare type LanguageOptions = 'english' | 'khmer'

export interface ILanguage {
  TEST: string
}

export interface ILanguageContext {
  lang: LanguageOptions
  language: ILanguage
  changeLanguage: Function
}
