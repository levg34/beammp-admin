import type { NextPage } from 'next'
import Link from 'next/link'
import { SSHExecCommandResponse } from 'node-ssh'
import { useEffect, useState } from 'react'
import { Badge, Button, ButtonGroup, Card, Container } from 'react-bootstrap'
import useSWR, { useSWRConfig } from 'swr'
import { fetcher } from '../utils/swrUtils'

type ServerState = 'started' | 'stopped' | 'starting...' | 'stopping...'

const Home: NextPage = () => {
  const { mutate } = useSWRConfig()

  const [serverState, setServerState] = useState<ServerState>('stopped')
  const {data: logsResponse} = useSWR<SSHExecCommandResponse>('/api/logs',fetcher)
  const {data: statusResponse} = useSWR<SSHExecCommandResponse>('/api/server-status',fetcher)

  const serverPID = statusResponse?.stdout

  useEffect(() => {
    setServerState(serverPID ? 'started' : 'stopped')
  },[serverPID])

  const logs = logsResponse?.stdout

  const startServer = async () => {
    setServerState('starting...')
    const res = await fetcher('/api/start-server',undefined)
    refreshData()
    setTimeout(refreshData,2500)
    console.log(res)
  }

  const stopServer = async () => {
    setServerState('stopping...')
    const res = await fetcher('/api/stop-server',undefined)
    refreshData()
    setTimeout(refreshData,5000)
    console.log(res)
  }

  const refreshData = () => {
    mutate('/api/logs')
    mutate('/api/server-status')
  }

  return (
    <Container>
      <br/>
      <Card body>
        BeamMP server status: <Badge bg={serverState === 'started' ? 'success' : (serverState === 'stopped' ? 'danger' : 'warning')}>{serverState}</Badge>
      </Card>
      <br/>
      <ButtonGroup>
        <Button variant="success" disabled={serverState === 'started' || serverState === 'starting...'} onClick={startServer}>Start</Button>
        <Button variant="danger" onClick={stopServer}>Stop</Button>
      </ButtonGroup>{' '}
      <Button variant="primary" onClick={refreshData}>Refresh</Button>
      <br/>
      <br/>
      <Card body as="pre">{logs}</Card>
      <Link href={'/config'}>Edit configuration</Link>
    </Container>
  )
}

export default Home
