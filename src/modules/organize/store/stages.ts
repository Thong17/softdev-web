// Breadcrumb for the store pages: Organize › Store › Info › Payment ›
// Printing › Features, each linking to the others
export type StorePage = 'info' | 'payment' | 'printing' | 'features'

export const storeStages = (language: any, id: string | undefined, current: StorePage) => {
  const pages: { key: StorePage, title: string, path: string }[] = [
    { key: 'info', title: language['INFO'], path: `/organize/store/update/${id}` },
    { key: 'payment', title: language['PAYMENT'], path: `/organize/store/${id}/payment` },
    { key: 'printing', title: 'Printing', path: `/organize/store/${id}/printing` },
    { key: 'features', title: 'Features', path: `/organize/store/${id}/features` },
  ]
  return [
    { title: language['ORGANIZE'], path: '/organize' },
    { title: language['STORE'], path: '/organize/store' },
    ...pages.map((page) => (page.key === current ? { title: page.title } : { title: page.title, path: page.path })),
  ]
}
