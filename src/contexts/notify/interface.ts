export interface INotify {
  severity: 'error' | 'warning' | 'info' | 'success'
  message: string
  open: boolean,
  horizontal: 'left' | 'center' | 'right',
  vertical: 'top' | 'bottom'
}
