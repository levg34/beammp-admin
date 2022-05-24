import { NextPage } from 'next'
import Link from 'next/link'
import { SSHExecCommandResponse } from 'node-ssh'
import { Alert, Button, Card, Container, Dropdown, DropdownButton, Form, FormControl, InputGroup } from 'react-bootstrap'
import useSWR from 'swr'
import _ from 'lodash'
import { IconAlertTriangle, IconDeviceFloppy } from '@tabler/icons'
import { fetcher } from '../utils/swrUtils'
import { useEffect, useState } from 'react'
import ServerConfig from '../classes/ServerConfig'
import levels from '../data/levels.json'

const ConfigPage: NextPage = () => {
    const {data: configResponse} = useSWR<SSHExecCommandResponse>('/api/config',fetcher)
    const configString = configResponse?.stdout
    const [config, setConfig] = useState<ServerConfig>(new ServerConfig())
    const [warning, setWarning] = useState<boolean>()

    useEffect(() => {
        if (configString && _.isEmpty(config.configObject())) {
            setConfig(new ServerConfig(configString))
        } else if (configString) {
            setWarning(true)
        }
    }, [configString])

    const saveConfig = async () => {
        setSuccess(undefined)
        const response = await fetcher('/api/save-config', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: config.toJSON()
        })
        console.log(response)
        if (!response.stderr) {
            setSuccess(`Config saved in the database.`)
        }
    }

    const getFilenameFromMapPath = (mapPath: string): string => {
        const matches = mapPath.match(/^\/[^/]+\/([^/]+)\//)
        const middleName = matches && matches[1] ? matches[1].split('_').map(m => _.capitalize(m)).join('') : 'New'
        return `ServerConfig${middleName}.toml`
    }

    const [success, setSuccess] = useState<string>()

    const applyConfig = async () => {
        setSuccess(undefined)
        const configToSave = {
            config: config.toTOML(),
            file: getFilenameFromMapPath(config.configObject().Map as string)
        }
        const response = await fetcher('/api/apply-config', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify(configToSave)
        })
        console.log(response)
        if (!response.stderr) {
            setSuccess(`Config saved on the server as ${getFilenameFromMapPath(config.configObject().Map as string)}.`)
        }
    }

    const reloadConfig = () => {
        setConfig(new ServerConfig(configString))
        setWarning(false)
    }

    const handleValueChange = (event: { target: { value: string } }, key: string) => {
        const { value } = event.target
        config.config
        setConfig(config.editConfig(key, value))
    }

    const handleCheckboxChange = (event: { target: { checked: boolean } }, key: string) => {
        const { checked } = event.target
        setConfig(config.editConfig(key, checked))
    }

    const selectMap = (prefix: string) => {
        setConfig(config.editConfig('Map', `/levels/${prefix}/info.json`))
    }

    return <Container>
        <Link href={'/'} passHref><Button>Return to server monitoring page</Button></Link>
        <br/>
        <br/>
        {warning && <Alert variant="warning"><IconAlertTriangle/> Config has been modified on the server. <Alert.Link onClick={reloadConfig}>Reload</Alert.Link> config from server?</Alert>}
        {success && <Alert variant="success"><IconDeviceFloppy/> {success}</Alert>}
        <DropdownButton id="dropdown-basic-button" title="Select map" variant="dark">
            {levels.filter(l => l.enable).map(level => <Dropdown.Item key={level.prefix} onClick={() => selectMap(level.prefix)}>{level.name ?? level.prefix}</Dropdown.Item>)}
        </DropdownButton>
        <span>Config file will be saved as: {config.configObject().Map ? getFilenameFromMapPath(config.configObject().Map as string) : `ServerConfigNew.toml`}</span>
        <Form as={Card} body>
            {Object.keys(config.configObject()).map(confItem => {
                const configValue = config.configObject()[confItem];
                return <InputGroup key={confItem} className="mt-2">
                    <InputGroup.Text>{confItem}</InputGroup.Text>
                    {typeof configValue === 'string' && <FormControl type="text" value={configValue} onChange={e => handleValueChange(e,confItem)}/>}
                    {typeof configValue === 'number' && <FormControl type="number" value={configValue} onChange={e =>handleValueChange(e,confItem)}/>}
                    {typeof configValue === 'boolean' && <div className="d-flex align-items-center"><Form.Check className="ms-3" type="switch" checked={configValue} onChange={e => handleCheckboxChange(e,confItem)}/></div>}
                </InputGroup>
            })}
            <InputGroup className="mt-2">
                <Button variant="warning" disabled>Restore config</Button>
                <Button variant="secondary" onClick={saveConfig}>Save to DB</Button>
                <Button variant="success" onClick={applyConfig}>Apply config</Button>{' '}
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