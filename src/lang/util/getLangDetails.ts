import { AllBrowserNavigator, BrowserLanguage } from '../types'

export const getLangDetails = (): BrowserLanguage => {
  const { browserLanguage, language, languages, userLanguage } = navigator as AllBrowserNavigator

  // Preferred language setup by the user & other browser fallbacks.
  const langAndRegion: string | null = (languages ? languages[0] : null) || language || browserLanguage || userLanguage

  // Setup for splitting the language. For example, if the language is `en-US`
  // we want { fullLang: en-US, lang: en, region: US, }
  let lang: string | null = langAndRegion
  let region: string | null = langAndRegion

  // Split langAndRegion to get both if separated by `-`.
  if (lang.indexOf('-') !== -1) {
    const splitLang = lang.split('-')

    lang = splitLang[0]

    // Null check for length
    if (splitLang.length === 2) {
      region = splitLang[1]
    }
  }

  // Split langAndRegion to get both if separated by `_`.
  if (lang.indexOf('_') !== -1) {
    const splitLang = lang.split('_')

    lang = splitLang[0]
    // Null check for length
    if (splitLang.length === 2) {
      region = splitLang[1]
    }
  }

  return {
    langAndRegion,
    lang,
    region,
  }
}
