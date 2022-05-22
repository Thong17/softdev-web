import Container from 'components/shared/Container'
import React from 'react'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { StickyTable } from 'components/shared/table/StickyTable'
import { ITableColumn } from 'components/shared/table/StickyTable'
import Button from 'components/shared/Button'
import { useNavigate } from 'react-router'

const Header = () => {
  const navigate = useNavigate()
    return <><StoreBreadcrumbs page='category' /><Button onClick={() => navigate('/store/category/create')}>Create</Button></>
}

declare type ColumnHeader = 'name' | 'code' | 'population' | 'size' | 'density' 

const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'name', label: 'Name' },
  { id: 'code', label: 'ISO\u00a0Code' },
  {
    id: 'population',
    label: 'Population',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Size\u00a0(km\u00b2)',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'density',
    label: 'Density',
    format: (value: number) => value.toFixed(2),
  },
]
interface Data {
  name: string
  code: string
  population: number
  size: number
  density: number
}

const createData = (
  name: string,
  code: string,
  population: number,
  size: number
): Data => {
  const density = population / size
  return { name, code, population, size, density }
}

const rowData = [
  createData('India', 'IN', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019200, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126317000, 377973),
  createData('France', 'FR', 67022000, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 17098246),
  createData('Nigeria', 'NG', 200962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767),
]

export const Category = () => {
  return (
    <Container header={<Header />}><StickyTable columns={columnData} rows={rowData} /></Container>
  )
}
