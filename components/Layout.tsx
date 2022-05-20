import { ReactElement } from 'react'
import { Container } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import Header from './Header'
import Login from './Login'

const Layout = ({ children }: { children: ReactElement }) => {
    const { data: session } = useSession()

    return <Container>
        {(session && session.user)? <Header user={session.user}/> : <Login/>}
        <br/>
        {session && children}
    </Container>
}

export default Layout