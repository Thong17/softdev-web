import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { useEffect, useState } from 'react'
import { CustomListContainer } from 'styles'

export const ListLayout = ({
  data,
  isLoading,
}: {
  data: Object[]
  isLoading?: boolean
}) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const [list, setList] = useState<Object[]>(data)

  useEffect(() => {
    setList(data)
  }, [data])

  return (
    <CustomListContainer
      loading={isLoading ? 'loading' : 'complete'}
      styled={theme}
      device={device}
    >
      {list.map((obj, index) => {
        return <div className='grid-item'></div>
      })}
    </CustomListContainer>
  )
}
