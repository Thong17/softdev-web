import useNotify from "hooks/useNotify";

export const Role = () => {
  const { notify } = useNotify()

  return (
      <>
        <h1>Role</h1>
        <button onClick={() => notify('Hello', 'info')}>Notify</button>
        <button onClick={() => notify('Fucked', 'warning')}>Fuck</button>
      </>
  );
}
