import { Container, ListGroup, Button, Stack } from 'react-bootstrap'
import useSWR from 'swr'
import { IconAlertTriangle } from '@tabler/icons'
import { fetcher } from '@utils/swrUtils'
import { ConfigList } from '@api/config/list'

const deleteConfig = async (configFile: string) => {
    // setFeedback(undefined)
    try {
        const response = await fetcher('/api/config/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify({
                configFile
            })
        })
        console.log(response)
        // setFeedback({
        //     text: `Deleted resource from server: ${file}`,
        //     variant: 'success'
        // })
    } catch (error) {
        console.error(error)
        // setFeedback({
        //     text: 'Failed to delete resource from server: '+String(error),
        //     variant: 'danger'
        // })
    } finally {
        // getResources()
    }
}

const renameConfig = async (configFile: string, newName: string) => {
    // if (!renaming) return
    try {
        const response = await fetcher('/api/config/rename', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify({
                configFile,
                newName
            })
        })
        console.log(response)
        // setFeedback({
        //     text: `Renamed resource on server: ${renaming.file} --> ${renaming.newName}`,
        //     variant: 'success'
        // })
        // setRenaming(undefined)
    } catch (error) {
        console.error(error)
        // setFeedback({
        //     text: 'Failed to delete resource from server: '+String(error),
        //     variant: 'danger'
        // })
    } finally {
        // getResources()
    }
}

const ConfigDisplay = ({config}: {config: string}) => <ListGroup.Item>
    <Stack direction="horizontal" gap ={2}> 
        {config}
        <Button variant="outline-secondary" className="ms-auto" onClick={() => renameConfig(config, 'ServerConfigRenamed.toml')}>Rename</Button>
        <Button variant="outline-danger" onClick={() => deleteConfig(config)}>Delete</Button>
    </Stack>
</ListGroup.Item>

const ConfigList = () => {
    const {data: configList} = useSWR<ConfigList>('/api/config/list',fetcher)
    return <Container>
        <h2><IconAlertTriangle/> Manage configs</h2>
        <ListGroup>
            {configList && configList.files.map(config => <ConfigDisplay key={config} config={config}/>)}
        </ListGroup>
    </Container>
}

export default ConfigList
