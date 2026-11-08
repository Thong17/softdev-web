// Shown under a field; the shared `hint` prop is drawn over the floating label.
// It sits in the 20px space TextField keeps under the input for its error
// message, so callers hide it while the field has an error.
export const HelperText = ({ theme, children }: any) => (
  <div style={{ fontSize: 12, color: theme.text.quaternary, marginTop: -18, paddingLeft: 7 }}>
    {children}
  </div>
)
