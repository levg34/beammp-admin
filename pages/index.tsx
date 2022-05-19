import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import AdminPage from '../components/AdminPage'
import Login from '../components/Login'

const Home: NextPage = () => {
  const { data: session } = useSession()

  return (
    <Container>
      {session ? <AdminPage user={session.user}/> : <Login/>}
    </Container>
  )
}

export default Home
