import { Context, ChangeEvent, createContext, ReactElement, useState, PropsWithChildren } from 'react'
import { IntlProvider } from 'react-intl'

// Languages
import English from '$/lang/translations/en.json'
import French from '$/lang/translations/fr.json'
import { getLangDetails } from '$/lang/util/getLangDetails'
import type { BrowserLanguage, Languages } from '$/lang/types'

// Types
export interface IContext {
  locale: string
  selectLanguage({ target }: ChangeEvent<HTMLSelectElement>): void
}

/*******
 * Setup
 *******/
export const LocaleContext: Context<IContext> = createContext({} as IContext)

// Determine the users default language.
const { lang }: BrowserLanguage = getLangDetails()

const languages: Record<Languages, Record<string, string>> = {
  en: English,
  fr: French,
}
// Set the language (default to English automatically).
const languageJSON: Record<string, string> = languages[lang]

/************
 * End Setup
 ************/

export const LocaleWrapper = ({ children }: PropsWithChildren): ReactElement => {
  const [locale, setLocale] = useState<string>(lang)
  const [messages, setMessages] = useState<Record<string, string>>(languageJSON)
  const selectLanguage = ({ target }: ChangeEvent<HTMLSelectElement>): void => {
    const newLocale: string = target.value

    setLocale(newLocale)
    setMessages(languages[newLocale])
  }

  return (
    <LocaleContext.Provider value={{ locale, selectLanguage }}>
      <IntlProvider messages={messages} locale={locale}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  )
}
