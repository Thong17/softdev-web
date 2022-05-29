export interface IRoleBody {
  name: Object,
  description: string,
  privilege: Object
}

export const initState = {
  name: {},
  description: '',
  privilege: {}
}