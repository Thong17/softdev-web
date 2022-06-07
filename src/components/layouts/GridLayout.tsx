import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { useEffect, useState } from 'react'
import { CustomGridContainer } from 'styles'
import DeleteIcon from '@mui/icons-material/Delete'
import EditRoundedIcon from '@mui/icons-material/EditRounded'

export const GridItem = ({
  id,
  title,
  subLeft,
  subRight,
  onEdit,
  onDelete,
  loading
}) => {
  return (
    <div className='grid-item'>
      <div className={`img ${loading && 'skeleton'}`}>
        {!loading && <div className='action'>
          <span onClick={() => onEdit(id)}>
            <EditRoundedIcon />
          </span>
          <span onClick={() => onDelete(id)}>
            <DeleteIcon />
          </span>
        </div>}
      </div>
      <div className='content'>
        <div className={`title ${loading && 'skeleton'}`} title={title}>
          <span>{title}</span>
        </div>
        <div className='sub-title'>
          <div className={`sub-left ${loading && 'skeleton'}`}>
            <span>{subLeft}</span>
          </div>
          <div className={`sub-right ${loading && 'skeleton'}`}>
            <span>{subRight}</span>
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

  isLoading = true

  useEffect(() => {
    setList(data)
  }, [data])

  const handleEdit = (id) => {
    console.log(id)
  }

  const handleDelete = (id) => {
    console.log(id)
  }

  return (
    <CustomGridContainer
      styled={theme}
      device={device}
    >
      {list.map((obj, index) => {
        return <div className='grid-item'></div>
      })}
      <GridItem
        id={3}
        title='Hello'
        subLeft='Left'
        subRight='Right'
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
      />
      <GridItem
        id={3}
        title='Hello'
        subLeft='Left'
        subRight='Right'
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
      />
      <GridItem
        id={3}
        title='Hello'
        subLeft='Left'
        subRight='Right'
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
      />
      <GridItem
        id={3}
        title='Hello'
        subLeft='Left'
        subRight='Right'
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
      />
      <GridItem
        id={3}
        title='Hello'
        subLeft='Left'
        subRight='Right'
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
      />
      <GridItem
        id={3}
        title='Hello'
        subLeft='Left'
        subRight='Right'
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
      />
      <GridItem
        id={3}
        title='Hello'
        subLeft='Left'
        subRight='Right'
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
      />
      <GridItem
        id={3}
        title='Hello'
        subLeft='Left'
        subRight='Right'
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
      />
    </CustomGridContainer>
  )
}
