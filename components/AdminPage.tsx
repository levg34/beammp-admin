import Link from 'next/link'
import { SSHExecCommandResponse } from 'node-ssh'
import { useEffect, useState } from 'react'
import { Accordion, Badge, Button, ButtonGroup, Card, Container, Image, ListGroup, Stack } from 'react-bootstrap'
import useSWR, { useSWRConfig } from 'swr'
import UserList from '../classes/UserList'
import UserDisplay from '../components/UserDisplay'
import UserListDisplay from '../components/UserListDisplay'
import { fetcher } from '../utils/swrUtils'

type ServerState = 'started' | 'stopped' | 'starting...' | 'stopping...'

type Props = {
    login: string,
    logout: () => void
}

const AdminPage = ({login,logout}: Props) => {
    const { mutate } = useSWRConfig()
  
    const [serverState, setServerState] = useState<ServerState>('stopped')
    const {data: logsResponse} = useSWR<SSHExecCommandResponse>('/api/logs',fetcher)
    const {data: statusResponse} = useSWR<SSHExecCommandResponse>('/api/server-status',fetcher)
  
    const serverPID = statusResponse?.stdout
  
    useEffect(() => {
      setServerState(serverPID ? 'started' : 'stopped')
    },[serverPID])
  
    const logs = logsResponse?.stdout
    const userList = UserList.fromLogs(logs)
  
    const startServer = async () => {
      if (logs) {
        const rotateRes = await fetcher('/api/log-rotate',undefined)
        console.log(rotateRes)
      }
      setServerState('starting...')
      const res = await fetcher('/api/start-server',undefined)
      refreshData()
      setTimeout(refreshData,1500)
      setTimeout(refreshData,3500)
      console.log(res)
      const insertRes = await fetcher('/api/import-users',undefined)
      console.log(insertRes)
    }
  
    const stopServer = async () => {
      setServerState('stopping...')
      const res = await fetcher('/api/stop-server',undefined)
      refreshData()
      setTimeout(refreshData,5000)
      setTimeout(refreshData,10000)
      console.log(res)
    }
  
    const refreshData = () => {
      mutate('/api/logs')
      mutate('/api/server-status')
    }
  
    const resetSSH = async () => {
      const res = await fetcher('/api/reset-ssh',undefined)
      refreshData()
      console.log(res.stdout === 'ok')
    }
  
    return (
      <Container>
        <Card body>
            <Stack direction="horizontal" gap={2}>
                <span>Logged in as {login}</span>
                <Image src="https://avatars.githubusercontent.com/u/137276?v=4" roundedCircle style={{height: 35}}/>
                <Button onClick={logout} className="ms-auto">Log out</Button>
            </Stack>
        </Card>
        <br/>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <Stack direction="horizontal" gap={2}>
                BeamMP server status:
                <Badge bg={serverState === 'started' ? 'success' : (serverState === 'stopped' ? 'danger' : 'warning')}>{serverState}</Badge>
              </Stack>
            </Accordion.Header>
            <Accordion.Body>
              <Stack direction="horizontal" gap={2}>
                <ButtonGroup>
                  <Button variant="success" disabled={serverState === 'started' || serverState === 'starting...'} onClick={startServer}>Start</Button>
                  <Button variant="danger" onClick={stopServer}>Stop</Button>
                </ButtonGroup>
                <Button variant="primary" onClick={refreshData}>Refresh</Button>
                <Button variant="warning" onClick={resetSSH}>Reset SSH connexion</Button>
                <Link href={'/config'} passHref><Button variant="outline-info">Edit configuration</Button></Link>
              </Stack>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <Stack direction="horizontal" gap={3}>
                Connected users:
                <Badge bg="info">{userList.getConnectedCount()}</Badge>
              </Stack>
            </Accordion.Header>
            <Accordion.Body>
              <ListGroup>
                {userList.getConnected().map(u =><ListGroup.Item key={u.username}><UserDisplay user={u}/></ListGroup.Item>)}
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <Stack direction="horizontal" gap={3}>
                All users:
                <Badge bg="info">{userList.getUsersCount()}</Badge>
                <Badge bg="primary">{userList.getRegisteredCount()}</Badge>
                <Badge bg="secondary">{userList.getGuestsCount()}</Badge>
              </Stack>
            </Accordion.Header>
            <Accordion.Body>
              <UserListDisplay userList={userList}/>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <br/>
        <Card body as="pre">{logs}</Card>
      </Container>
    )
  }

export default AdminPage
