import { languages } from 'contexts/language/constant'
import { Section } from '../Section'
import { TextInput } from '.'
import { useState } from 'react'

export const LocaleInput = ({ name, onChange, describe, err, ...prop }) => {
  const [category, setCategory] = useState({})
  const langs = Object.keys(languages)

  const handleChange = (event) => {
    const props = event.target.name.split('.')
    const value = event.target.value
    const newCategory = {
      ...category,
      [props[1]]: value,
    }

    setCategory(newCategory)
    return onChange(newCategory)
  }

  return (
    <Section describe={describe}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))`,
          gridColumnGap: 20,
        }}
      >
        {langs.map((language, index) => {
          return (
            <TextInput
              err={err?.[language]?.message}
              onChange={handleChange}
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
