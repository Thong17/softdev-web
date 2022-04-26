export interface INotify {
  severity: 'error' | 'warning' | 'info' | 'success'
  message: string
  open: boolean,
  duration: number,
  horizontal: 'left' | 'center' | 'right',
  vertical: 'top' | 'bottom'
}
