import { Method, RawAxiosRequestHeaders } from "axios";

export interface IAxiosProps {
  method: Method,
  url: string,
  body?: Object,
  params?: URLSearchParams,
  // A plain { name: value } object (axios 1's AxiosRequestHeaders is a class)
  headers?: RawAxiosRequestHeaders
}