import axios from 'axios'

const API_HOST = process.env.REACT_APP_API_URL

export interface IMenuProduct {
  _id: string
  name: Record<string, string>
  price: number
  currency: string
  description?: string
  profile?: { filename: string }
  images?: { filename: string }[]
}

export interface IMenuCategory {
  _id: string
  name: Record<string, string>
  icon?: { filename: string }
  products: IMenuProduct[]
}

export const getMenu = () => {
  return axios.get<{ data: IMenuCategory[] }>(`${API_HOST}/public/menu`)
}
