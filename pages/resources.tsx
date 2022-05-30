import { useState } from 'react'
import { Container, FormControl, InputGroup, Button, Form, ListGroup, Alert, Spinner, Stack, DropdownButton, Dropdown } from 'react-bootstrap'
import useSWR, { useSWRConfig } from 'swr'
import { fetcher } from '../utils/swrUtils'
import { ResourceItem } from './api/resources/list/[folder]'

const ResourcesPage = () => {
    const {data: resourcesFolders} = useSWR<string[]>('/api/resources-folders',fetcher)
    const {data: resources} = useSWR<ResourceItem[]>('/api/resources/list/Resources',fetcher)

    type Resource = {
        url: string
        folder: string
    }

    type Feedback = {
        variant: 'success' | 'warning' | 'danger',
        text: string
    }

    const [resource, setResource] = useState<Resource>({
        url: '',
        folder: 'Resources'
    })

    const [feedback, setFeedback] = useState<Feedback>()
    const [downloading, setDownloading] = useState<boolean>(false)

    const { mutate } = useSWRConfig()

    const uploadResource = async () => {
        setFeedback(undefined)
        setDownloading(true)
        try {
            const response = await fetcher('/api/resources/download/'+resource.folder, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                redirect: 'follow',
                body: JSON.stringify({
                    url: resource.url
                })
            })
            console.log(response)
            if (response.stderr.includes('saved') || response.stdout.includes('saved')) {
                const savedFile = response.stderr.split('\n').filter((l: string) => l.includes('saved'))
                setFeedback({
                    text: 'Resource uploaded to server successfully: '+savedFile,
                    variant: 'success'
                })
            } else {
                setFeedback({
                    text: 'Maybe an error occured. Check in the list for your resource, or try again. '+
                    'Server said: '+response.stderr,
                    variant: 'warning'
                })
            }
            setResource({
                ...resource,
                url: ''
            })
        } catch (error) {
            console.error(error)
            setFeedback({
                text: 'Failed to save resource to server: '+String(error),
                variant: 'danger'
            })
        } finally {
            setDownloading(false)
            mutate('/api/resources/list/Resources')
        }
    }

    type RenamedResource = {
        file: string,
        newName: string
    }

    const [renaming, setRenaming] = useState<RenamedResource>()

    const deleteResource = async (file: string) => {
        setFeedback(undefined)
        try {
            const response = await fetcher('/api/resources/delete/'+resource.folder, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                redirect: 'follow',
                body: JSON.stringify({
                    file
                })
            })
            console.log(response)
            setFeedback({
                text: `Deleted resource from server: ${file}`,
                variant: 'success'
            })
        } catch (error) {
            console.error(error)
            setFeedback({
                text: 'Failed to delete resource from server: '+String(error),
                variant: 'danger'
            })
        } finally {
            mutate('/api/resources/list/Resources')
        }
    }

    const handleRename = async (e: {key: string}) => {
        if (e.key === 'Enter') {
            if (!renaming) return
            try {
                const response = await fetcher('/api/resources/rename/'+resource.folder, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    redirect: 'follow',
                    body: JSON.stringify({
                        file: renaming.file,
                        newName: renaming.newName
                    })
                })
                console.log(response)
                setFeedback({
                    text: `Renamed resource on server: ${renaming.file} --> ${renaming.newName}`,
                    variant: 'success'
                })
                setRenaming(undefined)
            } catch (error) {
                console.error(error)
                setFeedback({
                    text: 'Failed to delete resource from server: '+String(error),
                    variant: 'danger'
                })
            } finally {
                mutate('/api/resources/list/Resources')
            }
        }
    }

    return <Container>
        {feedback && <Alert variant={feedback.variant}>{feedback.text}</Alert>}
        <InputGroup>
            <FormControl placeholder="Resource URL" value={resource.url} onChange={e => setResource({
                ...resource,
                url: e.target.value
            })}/>
            <Form.Select aria-label="Resources folder" style={{maxWidth: '150px'}} value={resource.folder} onChange={e => setResource({
                ...resource,
                folder: e.target.value
            })}>
                {(resourcesFolders ?? []).map(folder => <option key={folder}>{folder}</option>)}
            </Form.Select>
            <Button variant="outline-primary" onClick={uploadResource} disabled={downloading || !resource.url}>{downloading ? <Spinner animation="border" variant="primary"/> :'Download'}</Button>
        </InputGroup>
        <ListGroup className="mt-3">
            {(resources ?? []).map(resource => <ListGroup.Item key={resource.file}>
                <Stack direction="horizontal" gap={2}>
                    {renaming?.file === resource.file ? <Form.Control value={renaming.newName} onChange={e => setRenaming({
                        ...renaming,
                        newName: e.target.value
                    })} onKeyPress={handleRename}/> :<span>{resource.file} ({resource.size})</span>}
                    <DropdownButton title="Action" className="ms-auto" variant="outline-primary">
                        <Dropdown.Item onClick={() => deleteResource(resource.file)}>Delete</Dropdown.Item>
                        <Dropdown.Item onClick={() => setRenaming({file: resource.file, newName: resource.file})}>Rename</Dropdown.Item>
                    </DropdownButton>
                </Stack>
            </ListGroup.Item>)}
        </ListGroup>
    </Container>
}

export default ResourcesPage