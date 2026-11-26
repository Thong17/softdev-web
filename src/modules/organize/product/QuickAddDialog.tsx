import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import BrandForm from '../brand/Form'
import CategoryForm from '../category/Form'
import { initState as brandInitState } from '../brand/redux/constant'
import { initState as categoryInitState } from '../category/redux/constant'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'

export type QuickAddKind = 'brand' | 'category'

// Product form › Brand / Category: add one without leaving the product. The
// same forms as Organize › Brand / Category; the new one is handed back so the
// product form can select it.
export const QuickAddDialog = ({ kind, onClose, onAdded }: {
  kind: QuickAddKind | null
  onClose: () => void
  onAdded: (kind: QuickAddKind, record: any) => void
}) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const title = `${language['ADD']} ${kind === 'brand' ? language['BRAND'] : language['CATEGORY']}`

  return (
    <AlertDialog isOpen={!!kind} handleClose={onClose}>
      <DialogTitle title={title} onClose={onClose} />
      {/* Dialogs render outside the page, so the theme text colour is set here */}
      <div style={{ width: 'min(760px, 92vw)', padding: '0 20px 10px', boxSizing: 'border-box', color: theme.text.primary }}>
        {kind === 'brand' && (
          <BrandForm defaultValues={brandInitState} onCancel={onClose} onSaved={(record) => onAdded('brand', record)} />
        )}
        {kind === 'category' && (
          <CategoryForm defaultValues={categoryInitState} onCancel={onClose} onSaved={(record) => onAdded('category', record)} />
        )}
      </div>
    </AlertDialog>
  )
}
