import React, { useState } from 'react'
import { Form, Formik, FormikConfig, FormikValues } from 'formik'
import {
  Button,
  CircularProgress,
  Grid,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material'

export interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
  label: string
}

export const FormStep = ({ children }: FormikStepProps) => {
  return <>{children}</>
}

export const FormStepper = ({
  children,
  ...props
}: FormikConfig<FormikValues>) => {
  const childrenArray = React.Children.toArray(
    children
  ) as React.ReactElement<FormikStepProps>[]

  console.log(childrenArray);
  
  const [step, setStep] = useState(0)
  const currentChild = childrenArray[step]
  const [completed, setCompleted] = useState(false)

  const isLastStep = () => {
    return step === childrenArray.length - 1
  }

  return (
    <Formik
      validationSchema={currentChild.props.validationSchema}
      {...props}
      onSubmit={async (value, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(value, helpers)
          setCompleted(true)
        } else {
          setStep((s) => s + 1)
          helpers.setTouched({})
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form autoComplete='off'>
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step
                key={child.props.label}
                completed={step > index || completed}
              >
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {currentChild}

          <Grid container spacing={2}>
            {step > 0 ? (
              <Grid item>
                <Button
                  disabled={isSubmitting}
                  variant='contained'
                  color='primary'
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </Button>
              </Grid>
            ) : null}
            <Grid item>
              <Button
                startIcon={
                  isSubmitting ? <CircularProgress size='1rem' /> : null
                }
                disabled={isSubmitting}
                variant='contained'
                color='primary'
                type='submit'
              >
                {isSubmitting ? 'Submitting' : isLastStep() ? 'Submit' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}
