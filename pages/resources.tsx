import { Container, FormControl, InputGroup, Button, Form, ListGroup } from 'react-bootstrap'
import useSWR from 'swr'
import { fetcher } from '../utils/swrUtils'

const ResourcesPage = () => {
    const {data: resourcesFolders} = useSWR<string[]>('/api/resources-folders',fetcher)
    const {data: resources} = useSWR<string[]>('/api/list-resources/Resources',fetcher)

    return <Container>
        <InputGroup>
            <FormControl placeholder="Resource URL"/>
            <FormControl placeholder="Rename (optional)"/>
            <Form.Select aria-label="Resources folder">
                {(resourcesFolders ?? []).map(folder => <option key={folder}>{folder}</option>)}
            </Form.Select>
            <Button variant="outline-primary">Download</Button>
        </InputGroup>
        <ListGroup className="mt-3">
            {(resources ?? []).map(resource => <ListGroup.Item key={resource}>{resource}</ListGroup.Item>)}
        </ListGroup>
    </Container>
}

export default ResourcesPage