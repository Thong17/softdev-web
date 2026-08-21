import axios from 'axios'

const API_HOST = process.env.REACT_APP_API_URL

export interface IMenuProduct {
  _id: string
  name: Record<string, string>
  price: number
  currency: string
  profile?: { filename: string }
  category?: { _id: string; name: Record<string, string> }
  salePrice?: number | null
  promotionLabel?: Record<string, string>
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
  icon?: { filename: string }
}

export interface IPublicStore {
  _id: string
  name: string
  contact?: string
  address?: string
  logo?: { filename: string }
}

export interface IPublicAnnouncement {
  _id: string
  title: Record<string, string>
  description?: Record<string, string>
  banner?: { filename: string }
  order: number
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

export const getAnnouncements = () => {
  return axios.get<{ data: IPublicAnnouncement[] }>(`${API_HOST}/public/announcements`)
}

export interface IGetProductsParams {
  page?: number
  limit?: number
  category?: string
}

export const getProducts = (params: IGetProductsParams = {}) => {
  return axios.get<{ data: IMenuProduct[]; length: number }>(`${API_HOST}/public/products`, { params })
}
