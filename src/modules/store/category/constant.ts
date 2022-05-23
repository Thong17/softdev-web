export interface ICategoryBody {
  category: Object,
  status: boolean,
  icon: any,
  description: string,
}

export const initState: ICategoryBody = {
  category: {},
  status: false,
  icon: null,
  description: ''
}