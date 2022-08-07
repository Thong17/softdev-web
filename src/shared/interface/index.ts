export interface IBody<T> {
  data: T
  status: 'SUCCESS' | 'LOADING' | 'FAILED' | 'INIT'
  count?: number
  hasMore?: boolean
}

export declare type StructureStatusType = 'vacant' | 'occupied' | 'reserved'
export declare type StructureSizeType = 'small' | 'medium' | 'large'
export declare type StructureDirectionType = 'row' | 'column'