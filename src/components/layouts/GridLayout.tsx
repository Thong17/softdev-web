import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { useEffect, useState } from 'react'
import { CustomGridContainer } from 'styles'

export const GridItem = (props) => {
  const { title, picture, subLeft, subRight, action, status, loading } =
    props

  return (
    <div className='grid-item'>
      <div className={`img ${loading && 'skeleton'}`}>
        {!loading && (
          <>
            <div className='action'>
              {action}
            </div>
            <div className={`status ${status ? 'active' : 'inactive'}`}></div>
            <img
              src={`${process.env.REACT_APP_API_UPLOADS}${
                picture ? picture : 'default.jpg'
              }`}
              alt={picture}
            />
          </>
        )}
      </div>
      <div className='content'>
        <div className={`title ${loading && 'skeleton'}`} title={title}>
          <span>{title}</span>
        </div>
        <div className='sub-title'>
          <div className={`sub-left ${loading && 'skeleton'}`}>
            {subLeft}
          </div>
          <div className={`sub-right ${loading && 'skeleton'}`}>
            {subRight}
          </div>
        </div>
      </div>
    </div>
  )
}

export const GridLayout = ({
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
    <CustomGridContainer styled={theme} device={device}>
      {list.map((obj: any, index) => {
        return (
          <GridItem
            key={index}
            title={obj.name}
            picture={obj.profile}
            subLeft={obj.category}
            subRight={obj.price}
            action={obj.action}
            status={obj.status}
            loading={isLoading}
          />
        )
      })}
    </CustomGridContainer>
  )
}
