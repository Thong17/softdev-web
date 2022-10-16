import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from './schema'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import { useLocation, useNavigate } from 'react-router'
import { TextField } from 'components/shared/form'
import { CardContainer } from 'components/shared/container/CardContainer'
import useTheme from 'hooks/useTheme'
import { Button } from '@mui/material'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import useWeb from 'hooks/useWeb'
import Footer from 'components/shared/Footer'
import { useState } from 'react'
import useLanguage from 'hooks/useLanguage'

export const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) })
  const { login } = useAuth()
  const { notify } = useNotify()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()
  const [loading, setLoading] = useState(false)

  const particlesInit = async (main) => {
    await loadFull(main)
  }

  const form = async (data) => {
    setLoading(true)
    const response: any = await login(data)
    if (response?.code !== 'SUCCESS') {
      setLoading(false)
      return notify(response?.msg, 'error')
    }
    navigate(location.state ? (location.state as string) : '/home')
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        color: theme.text.secondary,
        fontWeight: theme.font.weight,
        fontFamily: theme.font.family,
      }}
    >
      {!loading && <Particles
        id='tsparticles'
        init={particlesInit}
        options={{
          background: {
            color: {
              value: theme.background.primary,
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: 'push',
              },
              onHover: {
                enable: true,
                mode: 'repulse',
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 2,
              },
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: theme.text.quaternary,
            },
            links: {
              color: theme.text.secondary,
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: {
                default: 'bounce',
              },
              random: false,
              speed: 3,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 20,
              max: 100
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />}
      <CardContainer title={language['LOGIN']}>
        <form
          onSubmit={handleSubmit(form)}
          style={{ padding: '20px 30px 40px 30px', width: device === 'mobile' ? 300 : 500 }}
        >
          <TextField
            label='Username'
            type='text'
            err={errors.username?.message}
            {...register('username')}
          />
          <TextField
            label='Password'
            type='password'
            err={errors.password?.message}
            {...register('password')}
          />
          <Button
            fullWidth
            style={{
              marginTop: 30,
              backgroundColor: `${theme.color.info}22`,
              color: theme.color.info,
            }}
            variant='contained'
            type='submit'
          >
            {language['LOGIN']}
          </Button>
          {/* <button onClick={() => navigate('/register')}>Register</button> */}
        </form>
      </CardContainer>
      <Footer style={{ position: 'absolute', right: 0, bottom: 0 }}>Footer</Footer>
    </div>
  )
}
