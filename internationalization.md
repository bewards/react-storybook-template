# Internationalization

## Overview
You may need to add internationalization (i18n) to your React project. We have found the best way to do this is to use
a library called `react-intl` aka `format.js`. Full documentation can be found [here](https://formatjs.io/).

### Getting started
1. Install
```shell
npm i -B react-intl
```
or
```shell
yarn add react-intl
```
2. Setup your desired language translation json files. Here we are setting up English and French.
```
src
|____lang
| |____types.ts
| |____translations
| | |____en.json
| | |____fr.json

```
3. Create a Wrapper for context (LocaleWrapper)
```typescript jsx
import React, { ChangeEvent, createContext, ReactChild, ReactElement, useState } from 'react'
import { IntlProvider } from 'react-intl'

// Languages
import English from 'lang/translations/en.json'
import French from 'lang/translations/fr.json'

// Types
export interface IContext {
   locale: string
   selectLanguage({ target }: ChangeEvent<HTMLSelectElement>): void
}

/*******
 * Setup
 *******/
export const Context = createContext({} as IContext)
const { language }: { language: string } = navigator

// Determine the users default language.
const languages = {
   en: English,
   fr: French,
}
// Set the language (default to English).
const languageJSON: Record<string, string> = languages[language] || English

/************
 * End Setup
 ************/

export const LocaleWrapper = ({ children }: { children: ReactChild }): ReactElement => {
   const [locale, setLocale] = useState<string>(language)
   const [messages, setMessages] = useState<Record<string, string>>(languageJSON)
   const selectLanguage = ({ target }: ChangeEvent<HTMLSelectElement>): void => {
      const newLocale: string = target.value

      setLocale(newLocale)
      setMessages(languages[newLocale])
   }

   return (
       <Context.Provider value={{ locale, selectLanguage }}>
          <IntlProvider messages={messages} locale={locale}>
             {children}
          </IntlProvider>
       </Context.Provider>
   )
}

```

3. Wrap you `<App />` with the `LocaleWrapper` you just created.
```typescript jsx
// StatusColumn.tsx
const renderApp = storePromise => {
  storePromise.then(store => {
    const markup = (
      <Provider store={store}>
        <LocaleWrapper> {/* <- Wrap here */}
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LocaleWrapper>
      </Provider>
    )
    const container = document.getElementById('root')
    const root = createRoot(container)
    root.render(markup)
  })
}
```

4. Create a local `messages.json` for as a sibling to the component you're using i18n.
```typescript
import { defineMessages } from 'react-intl'

// **NOTE**: This scope MUST be unique per file. A good practice is to keep the directory structure.
const scope = 'react-best-practices.components.SomeComponent'

export default defineMessages({
  someMessageKey: {
    id: `${scope}.someMessageKey`,
    defaultMessage: 'Project By Status',
  },
  someMessageOtherKey: {
    id: `${scope}.someMessageOtherKey`,
    defaultMessage: 'Project Detail',
  },
})

```


5. Use your i18n intl.
- There are many ways to this. Please refer to `react-intl` [documentation](https://formatjs.io/) for other examples.
```typescript jsx
// SomeComponent.tsx
import { useIntl } from 'react-intl'
import messages from './messages'

const SomeComponent = () => {
  const intl = useIntl()

  return (
    <div>{intl.formatMessage(messages.someMessageKey)}</div>
  )
}
```
