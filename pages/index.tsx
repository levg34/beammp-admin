import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import AdminPage from '../components/AdminPage'
import Login from '../components/Login'

const Home: NextPage = () => {
  const [login, setLogin] = useState<string|null>(null)

  const checkLogin = () => {
    const localLogin = sessionStorage.getItem('login')
    if (localLogin) {
      setLogin(localLogin)
    } else {
      setLogin(null)
    }
  }

  useEffect(checkLogin,[])

  const logout = () => {
    sessionStorage.removeItem('login')
    setLogin(null)
  }

  const logIn = () => {
    sessionStorage.setItem('login','luc')
    setLogin('luc')
  }

  return (
    <Container>
      {login ? <AdminPage login={login} logout={logout}/> : <Login setLogin={setLogin} logIn={logIn}/>}
    </Container>
  )
}

export default Home
