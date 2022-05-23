import { NextPage } from 'next'
import Link from 'next/link'
import { SSHExecCommandResponse } from 'node-ssh'
import { Button, Card, Container, Form, FormControl, InputGroup } from 'react-bootstrap'
import useSWR from 'swr'
import { fetcher } from '../utils/swrUtils'
import { useEffect, useState } from 'react'
import ServerConfig, { ServerConfigType } from '../classes/ServerConfig'

const ConfigPage: NextPage = () => {
    const {data: configResponse} = useSWR<SSHExecCommandResponse>('/api/config',fetcher)
    const configString = configResponse?.stdout
    const [config, setParsedConfig] = useState<ServerConfig>(new ServerConfig())

    useEffect(() => {
        if (configString) {
            setParsedConfig(new ServerConfig(configString))
        }
    },[configString])

    const saveConfig = async () => {
        const response = await fetcher('/api/save-config', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: config.toJSON()
        })
        console.log(response)
    }

    return <Container>
        <Link href={'/'} passHref><Button>Return to server monitoring page</Button></Link>
        <br/><br/>
        <Form as={Card} body>
            {Object.keys(config.configObject()).map(confItem => {
                const configValue = config.configObject()[confItem];
                return <InputGroup key={confItem} className="mt-2">
                    <InputGroup.Text>{confItem}</InputGroup.Text>
                    {typeof configValue === 'string' && <FormControl type="text" value={configValue}/>}
                    {typeof configValue === 'number' && <FormControl type="number" value={configValue}/>}
                    {typeof configValue === 'boolean' && <div className="d-flex align-items-center"><Form.Check className="ms-3" type="switch" checked={configValue}/></div>}
                </InputGroup>
            })}
            <InputGroup className="mt-2">
                <Button variant="success" onClick={saveConfig}>Save config</Button>{' '}
                <Button variant="warning" disabled>Restore config</Button>
            </InputGroup>
        </Form>
        <br/>
        <Card body as="pre" style={{
            backgroundColor:'black',
            color: '#7FFF00'
        }}>{configString}</Card>
    </Container>
}

export default ConfigPage