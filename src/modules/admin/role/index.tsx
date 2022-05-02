import useNotify from 'hooks/useNotify'

export const Role = () => {
  const { notify } = useNotify()

  return (
    <>
      <h1>Role</h1>
      <button onClick={() => notify('Success', 'success')}>Notify</button>
      <button onClick={() => notify('Fucked', 'error')}>Fuck</button>
      <button onClick={() => notify('Wawrn', 'warning')}>Wawrn</button>
      <button
        onClick={() =>
          notify(
            'useForm, you will receive the following methods register, unregister, errors, watch, handleSubmit, reset, setError, clearError, setValue, getValues, triggerValidation, control and formState.',
            'info'
          )
        }
      >
        By invoking
      </button>
    </>
  )
}
