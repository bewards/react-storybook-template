import { ReactElement, useContext } from 'react'

// Components
import { LocaleContext, IContext } from '$/components/LocaleWrapper/LocaleWrapper'

// Util
import { getEnumValues } from '$/util/enum'

// Types
import { Languages } from '$/lang/types'

export const SelectIntl = (): ReactElement => {
  const languages: string[] = getEnumValues(Languages)
  const { locale, selectLanguage }: IContext = useContext(LocaleContext)

  return (
    <select className="custom-select w-auto" value={locale} data-testid="select-intl" onChange={selectLanguage}>
      {languages.map(
        (lang: string): ReactElement => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        )
      )}
    </select>
  )
}
