import { AxiosRequestHeaders, Method } from "axios";

export interface IAxiosProps {
  method: Method,
  url: string,
  body?: Object,
  params?: URLSearchParams,
  headers?: AxiosRequestHeaders 
}