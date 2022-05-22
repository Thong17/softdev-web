import { languages } from 'contexts/language/constant'
import { Section } from '../Section'
import { TextInput } from '.'
import useWeb from 'hooks/useWeb'

export const LocaleInput = ({ name, describe, ...prop }) => {
    const { device } = useWeb()
  const langs = Object.keys(languages)
  let columns = ''
  langs.map(() => (columns += ' 1fr'))

  return (
    <Section describe={describe}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: device === 'mobile' ? '1fr' : columns,
          gridGap: device === 'mobile' ? 0:  20,
        }}
      >
        {langs.map((language, index) => {
          return (
            <TextInput
              key={index}
              type='text'
              label={language}
              name={`${name}.${language}`}
              {...prop}
            />
          )
        })}
      </div>
    </Section>
  )
}
