export interface ICategoryBody {
  name: Object,
  status: boolean,
  icon: any,
  description: string,
}

export const initState: ICategoryBody = {
  name: {},
  status: false,
  icon: null,
  description: ''
}