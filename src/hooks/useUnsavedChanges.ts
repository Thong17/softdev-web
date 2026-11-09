import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { UNSAFE_NavigationContext } from 'react-router-dom'
import useAlert from './useAlert'

const discardAlert = {
  title: 'Discard unsaved changes?',
  description: 'You have changes that have not been saved. They will be lost if you continue.',
  variant: 'warning' as const,
}

// One history blocker shared by every form that has changes, so leaving a page
// asks once even when a page form and a dialog form both have changes, and the
// blocker isn't swapped out while its confirm dialog is open.
const formsWithChanges = new Set<symbol>()
let unblockHistory: null | (() => void) = null
let askToLeave: (options: typeof discardAlert) => Promise<void> = () => Promise.resolve()

const releaseHistory = () => {
  unblockHistory?.()
  unblockHistory = null
}

const syncHistoryBlock = (navigator: any) => {
  if (formsWithChanges.size === 0) return releaseHistory()
  if (unblockHistory || !navigator?.block) return
  unblockHistory = navigator.block((transition) => {
    askToLeave(discardAlert)
      .then(() => {
        // Leaving discards every form's changes
        formsWithChanges.clear()
        releaseHistory()
        transition.retry()
      })
      .catch(() => {})
  })
}

// Every field's current value inside a form, in order. Dropdown menus render in
// a portal outside the form, so their search boxes aren't included. Inputs
// marked data-unsaved-ignore (e.g. the map's place search) aren't form data.
const snapshotFields = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLInputElement>('input:not([data-unsaved-ignore]), textarea, select'))
    .map((field) => {
      if (field.type === 'checkbox' || field.type === 'radio') return String(field.checked)
      if (field.type === 'file') return String(field.files?.length || 0)
      return field.value
    })
    .join('\u0001')

interface IUnsavedChangesOptions {
  // react-hook-form's formState.isDirty, or any other "changed" flag
  isDirty?: boolean
  // e.g. only while a dialog form is open
  enabled?: boolean
}

// Asks before unsaved form changes are lost.
//
// Spread `trackChanges` on the <form> (or the dialog's wrapper). On the first
// key press or click inside it, the hook keeps a copy of every field's value;
// after each edit it compares again, so typing the original value back counts
// as unchanged. The copy is taken at first interaction rather than on mount
// because many forms fill in their values after loading (reset()).
//
// `isDirty` is only used as a hint: it triggers a re-check, and counts on its
// own only when the user hasn't touched the form (e.g. values set in code).
//
// While changed, leaving the page through the router asks first, and the
// browser warns on refresh or closing the tab (history.block does both). For
// dialogs, wrap the close handler with `guardClose`. After saving, call
// `markSaved` so the following navigation or close isn't blocked.
const useUnsavedChanges = ({ isDirty = false, enabled = true }: IUnsavedChangesOptions = {}) => {
  const confirm = useAlert()
  const { navigator } = useContext(UNSAFE_NavigationContext) as any
  const [touched, setTouched] = useState(false)
  const [saved, setSaved] = useState(false)
  const formId = useRef(Symbol('form')).current
  const containerRef = useRef<HTMLElement | null>(null)
  const baselineRef = useRef<string | null>(null)

  const hasChanges = enabled && !saved && (touched || (isDirty && baselineRef.current === null))

  // The alert's confirm function changes identity on every render; keep the
  // latest one for the shared blocker instead of re-registering it
  useEffect(() => {
    askToLeave = confirm
  }, [confirm])

  const release = useCallback(() => {
    formsWithChanges.delete(formId)
    syncHistoryBlock(navigator)
  }, [formId, navigator])

  useEffect(() => {
    if (!hasChanges) return release()
    formsWithChanges.add(formId)
    syncHistoryBlock(navigator)
    return release
  }, [hasChanges, formId, navigator, release])

  // Compare the fields with the copy taken before editing started
  const recheck = useCallback(() => {
    const container = containerRef.current
    if (!container || baselineRef.current === null) return
    const changed = snapshotFields(container) !== baselineRef.current
    setTouched(changed)
    if (changed) setSaved(false)
  }, [])

  const captureBaseline = useCallback((event: { currentTarget: any }) => {
    containerRef.current = event.currentTarget
    if (baselineRef.current === null) baselineRef.current = snapshotFields(event.currentTarget)
  }, [])

  const handleEdit = useCallback((event: { currentTarget: any }) => {
    containerRef.current = event.currentTarget
    // An edit without a key press/click first (rare): treat it as a change
    if (baselineRef.current === null) {
      setTouched(true)
      setSaved(false)
      return
    }
    recheck()
  }, [recheck])

  // Dropdown picks, toggles and image deletes update fields on the next render
  const handleClick = useCallback((event: { currentTarget: any }) => {
    containerRef.current = event.currentTarget
    setTimeout(recheck, 0)
  }, [recheck])

  // react-hook-form noticed a change (e.g. a select registered with it)
  useEffect(() => {
    recheck()
  }, [isDirty, recheck])

  const clear = useCallback(() => {
    release()
    baselineRef.current = null
    setTouched(false)
  }, [release])

  // A dialog that closed (e.g. after saving) starts fresh when it reopens
  useEffect(() => {
    if (enabled) return
    baselineRef.current = null
    setTouched(false)
    setSaved(false)
  }, [enabled])

  // Clears the changed state right away (synchronously unblocking navigation),
  // so it can be called just before navigate() after a successful save
  const markSaved = useCallback(() => {
    clear()
    setSaved(true)
  }, [clear])

  // Back to a fresh state, e.g. when a dialog form closes
  const resetChanges = useCallback(() => {
    clear()
    setSaved(false)
  }, [clear])

  const confirmDiscard = useCallback(
    () => (hasChanges ? confirm(discardAlert) : Promise.resolve()),
    [hasChanges, confirm]
  )

  // Wraps a dialog's close handler: asks first when there are changes. Pass
  // `enabled: dialog.open` so a closed dialog never blocks anything.
  const guardClose = useCallback(
    (close: (...args: any[]) => void) => (...args: any[]) => {
      confirmDiscard()
        .then(() => {
          resetChanges()
          close(...args)
        })
        .catch(() => {})
    },
    [confirmDiscard, resetChanges]
  )

  return {
    hasChanges,
    markSaved,
    resetChanges,
    confirmDiscard,
    guardClose,
    trackChanges: {
      // Capture phase is fine here: these don't update state
      onKeyDownCapture: captureBaseline,
      onPointerDownCapture: captureBaseline,
      // Bubble phase on purpose: React 17 flushes state between the capture and
      // bubble phases, so updating state in onInputCapture re-rendered the form
      // before a controlled field (e.g. LocaleField) saw the keystroke, and the
      // keystroke was lost
      onInput: handleEdit,
      onChange: handleEdit,
      onClickCapture: handleClick,
    },
  }
}

export default useUnsavedChanges
