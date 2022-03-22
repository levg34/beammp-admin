import type { NextPage } from 'next'
import { useState } from 'react'
import { Badge, Button, ButtonGroup, Card, Container } from 'react-bootstrap'
import useSWR, { useSWRConfig } from 'swr'

const fetcher = (...args: [RequestInfo, RequestInit | undefined]) => fetch(...args).then(res => res.json())

type ServerState = 'started' | 'stopped' | 'error'

const Home: NextPage = () => {
  const [serverState, setServerState] = useState<ServerState>('stopped')
  const {data,error} = useSWR('/api/logs',fetcher)

  const { mutate } = useSWRConfig()

  const logs = data?.stdout

  const startServer = async () => {
    const res = await fetcher('/api/start-server',undefined)
    mutate('/api/logs')
    console.log(res)
    setServerState('started')
  }

  const stopServer = async () => {
    const res = await fetcher('/api/stop-server',undefined)
    mutate('/api/logs')
    console.log(res)
    setServerState('stopped')
  }

  // const restartServer = () => {
  //   setServerState('error')
  // }

  const refreshData = () => {
    mutate('/api/logs')
  }

  return (
    <Container>
      <br/>
      <Card body>
        BeamMP server status: <Badge bg={serverState === 'started' ? 'success' : 'danger'}>{serverState}</Badge>
      </Card>
      <br/>
      <ButtonGroup>
        <Button variant="success" disabled={serverState === 'started'} onClick={startServer}>Start</Button>
        <Button variant="danger" disabled={serverState === 'stopped'} onClick={stopServer}>Stop</Button>
        {/* <Button variant="warning" disabled={serverState === 'stopped'} onClick={restartServer}>Restart</Button> */}
      </ButtonGroup>{' '}
      <Button variant="primary" onClick={refreshData}>Refresh</Button>
      <br/>
      <br/>
      <Card body as="pre">{logs}</Card>
    </Container>
  )
}

export default Home
