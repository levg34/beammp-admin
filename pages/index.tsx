import type { NextPage } from 'next'
import { Container } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import AdminPage from '../components/AdminPage'
import Login from '../components/Login'

const Home: NextPage = () => {
  const { data: session } = useSession()

  return (
    <Container>
      {session ? <AdminPage/> : <Login/>}
    </Container>
  )
}

export default Home
