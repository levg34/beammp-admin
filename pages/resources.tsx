import { useState } from 'react'
import { Container, FormControl, InputGroup, Button, Form, ListGroup, Alert, Spinner } from 'react-bootstrap'
import useSWR, { useSWRConfig } from 'swr'
import { fetcher } from '../utils/swrUtils'

const ResourcesPage = () => {
    const {data: resourcesFolders} = useSWR<string[]>('/api/resources-folders',fetcher)
    const {data: resources} = useSWR<string[]>('/api/list-resources/Resources',fetcher)

    type Resource = {
        url: string
        rename?: string
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
            const response = await fetcher('/api/download-resource/'+resource.folder, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                redirect: 'follow',
                body: JSON.stringify({
                    url: resource.url,
                    rename: resource.rename
                })
            })
            console.log(response)
            if (response.stderr.includes('saved') || response.stdout.includes('saved')) {
                setFeedback({
                    text: 'Resource uploaded to server successfully',
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
                rename: resource.rename !== undefined ? '' : undefined,
                url: ''
            })
        } catch (error) {
            console.log(error)
            setFeedback({
                text: 'Failed to save resource to server: '+String(error),
                variant: 'danger'
            })
        } finally {
            setDownloading(false)
            mutate('/api/list-resources/Resources')
        }
    }

    return <Container>
        {feedback && <Alert variant={feedback.variant}>{feedback.text}</Alert>}
        <InputGroup>
            <FormControl placeholder="Resource URL" value={resource.url} onChange={e => setResource({
                ...resource,
                url: e.target.value
            })}/>
            <FormControl placeholder="Rename (optional)" disabled value={resource.rename} onChange={e => setResource({
                ...resource,
                rename: e.target.value
            })}/>
            <Form.Select aria-label="Resources folder" value={resource.folder} onChange={e => setResource({
                ...resource,
                folder: e.target.value
            })}>
                {(resourcesFolders ?? []).map(folder => <option key={folder}>{folder}</option>)}
            </Form.Select>
            <Button variant="outline-primary" onClick={uploadResource} disabled={downloading || !resource.url}>{downloading ? <Spinner animation="border" variant="primary"/> :'Download'}</Button>
        </InputGroup>
        <ListGroup className="mt-3">
            {(resources ?? []).map(resource => <ListGroup.Item key={resource}>{resource}</ListGroup.Item>)}
        </ListGroup>
    </Container>
}

export default ResourcesPage