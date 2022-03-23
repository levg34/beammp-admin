import { NextPage } from "next";
import Link from "next/link";
import { SSHExecCommandResponse } from "node-ssh";
import { Card, Container, Form, FormControl, InputGroup } from "react-bootstrap";
import useSWR from "swr";
import { fetcher } from "../utils/swrUtils";
import toml from 'toml';
import { useEffect, useState } from "react";

type ServerConfig = {
    General: Record<string,string | number | boolean>
}

const ConfigPage: NextPage = () => {
    const {data: configResponse} = useSWR<SSHExecCommandResponse>('/api/config',fetcher)
    const config = configResponse?.stdout
    const [parsedConfig, setParsedConfig] = useState<ServerConfig>({General:{}})

    useEffect(() => {
        if (config) {
            setParsedConfig(toml.parse(config))
        }
    },[config])

    return <Container>
        <br/>
        <Form as={Card} body>
            {Object.keys(parsedConfig.General).map(confItem => {
                const configValue = parsedConfig.General[confItem];
                return <InputGroup key={confItem} className="mt-2">
                    <InputGroup.Text>{confItem}</InputGroup.Text>
                    {typeof configValue === 'string' && <FormControl type="text" value={configValue}/>}
                    {typeof configValue === 'number' && <FormControl type="number" value={configValue}/>}
                    {typeof configValue === 'boolean' && <div className="d-flex align-items-center"><Form.Check className="ms-3" type="switch" checked={configValue}/></div>}
                </InputGroup>
            })}
        </Form>
        <br/>
        <Card body as="pre" style={{
            backgroundColor:'black',
            color: '#7FFF00'
        }}>{config}</Card>
        <Link href={'/'}>Return to server monitoring page</Link>
    </Container>
}

export default ConfigPage