export interface IBody<T> {
  data: T
  status: 'SUCCESS' | 'LOADING' | 'FAILED' | 'INIT'
}