import React from 'react'
import { Layout } from 'components/layouts/Layout'
import Container from 'components/shared/Container'
import { BubblePull } from 'components/animation/BubblePull'
import useWeb from 'hooks/useWeb'
import { SocialNav } from 'components/shared/SocialNav'

export const Home = () => {
  const { width } = useWeb()
  return (
    <Layout>
      <Container>
        <SocialNav />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: width > 1024 ? '1fr 600px' : '1fr',
            height: '90%',
            width: '100%',
            position: 'absolute',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '0 50px',
            }}
          >
            <h1 style={{ fontWeight: 300 }}>
              Welcome to SoftDev Management System
            </h1>
            <br />
            <p>
              We develop and design a reliable and high performance web application for you business with a modern user interface base on your requirement.
            </p>
          </div>
          {width > 1024 && (
            <div>
              <BubblePull />
            </div>
          )}
        </div>
      </Container>
    </Layout>
  )
}
