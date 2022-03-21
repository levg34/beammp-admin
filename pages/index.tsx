import type { NextPage } from 'next'
import { useState } from 'react'
import { Badge, Button, ButtonGroup, Card, Container } from 'react-bootstrap'
import useSWR from 'swr'

const fetcher = (...args: [RequestInfo, RequestInit | undefined]) => fetch(...args).then(res => res.json())

type ServerState = 'started' | 'stopped' | 'error'

const Home: NextPage = () => {
  const [serverState, setServerState] = useState<ServerState>('stopped')
  const {data,error} = useSWR('/api/logs',fetcher)

  const logs = data?.stdout

  const startServer = () => {
    setServerState('started')
  }

  const stopServer = () => {
    setServerState('stopped')
  }

  const restartServer = () => {
    setServerState('error')
  }

  return (
    <Container>
      <br/>
      <Card body>
        Statut du serveur : <Badge bg={serverState === 'started' ? 'success' : 'danger'}>{serverState}</Badge>
      </Card>
      <br/>
      <ButtonGroup>
        <Button variant="success" disabled={serverState === 'started'} onClick={startServer}>Démarrer</Button>
        <Button variant="danger" disabled={serverState === 'stopped'} onClick={stopServer}>Arrêter</Button>
        <Button variant="warning" disabled={serverState === 'stopped'} onClick={restartServer}>Redémarrer</Button>
      </ButtonGroup>
      <br/>
      <br/>
      <Card body as="pre">{logs}</Card>
    </Container>
  )
}

export default Home
