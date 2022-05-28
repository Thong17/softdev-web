import React, { ForwardRefRenderFunction, InputHTMLAttributes } from 'react'
import { Checkbox, CheckboxProps, FormControlLabel, styled } from '@mui/material'
import useTheme from 'hooks/useTheme'

interface ICheckboxField extends CheckboxProps {
	label?: string
	err?: string
	hint?: string
}

export const CheckboxField: ForwardRefRenderFunction<InputHTMLAttributes<HTMLInputElement>, ICheckboxField> = ({ label, err, hint, ...props }) => {
	const { theme } = useTheme()

	const CustomCheckbox = styled(Checkbox)({
		color: theme.text.quaternary
	})

	return (
		<FormControlLabel
			style={{
				color: theme.text.tertiary,
				textTransform: 'capitalize'
			}}
			label={label}
			control={
				<CustomCheckbox
					{...props}
				/>
			}
		/>
	)
}
