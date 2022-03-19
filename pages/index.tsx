import type { NextPage } from 'next'
import { useState } from 'react'
import { Badge, Button, ButtonGroup, Card, Container } from 'react-bootstrap'
import { GetServerSideProps } from 'next'
import * as fsOld from 'fs'

const fs = fsOld.promises

type ServerState = 'started' | 'stopped' | 'error'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const logs = await fs.readFile('logs/Server.log', 'utf-8')
  return {
    props: {
      logs
    }
  }
}

interface Props {
  logs: string
}

const Home: NextPage<Props> = ({logs}) => {
  const [serverState, setServerState] = useState<ServerState>('stopped')

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
