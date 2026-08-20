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

export interface IPublicBrand {
  _id: string
  name: Record<string, string>
  description?: string
  icon?: { filename: string }
}

export interface IPublicStore {
  _id: string
  name: string
  contact?: string
  address?: string
  logo?: { filename: string }
}

export const getMenu = () => {
  return axios.get<{ data: IMenuCategory[] }>(`${API_HOST}/public/menu`)
}

export const getBrands = () => {
  return axios.get<{ data: IPublicBrand[] }>(`${API_HOST}/public/brands`)
}

export const getStoreInfo = () => {
  return axios.get<{ data: IPublicStore }>(`${API_HOST}/public/store`)
}
