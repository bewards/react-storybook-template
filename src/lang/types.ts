export type BrowserLanguage = {
  langAndRegion: string
  lang: string
  region: string
}

export interface AllBrowserNavigator extends Navigator {
  browserLanguage: string
  userLanguage: string
}

export enum Languages {
  EN = 'en',
  FR = 'fr',
}
