import { Accordion, Badge, ListGroup, Stack } from "react-bootstrap"
import UserList from "../classes/UserList"
import UserDisplay from "./UserDisplay"

type Props = {
    userList: UserList
}

const UserListDisplay = ({userList}: Props) => <Accordion defaultActiveKey={['0']} flush alwaysOpen>
    <Accordion.Item eventKey="0">
        <Accordion.Header>
            <Stack direction="horizontal" gap={3}>
                Registered users:
                <Badge bg="primary">{userList.getRegisteredCount()}</Badge>
            </Stack>
        </Accordion.Header>
        <Accordion.Body>
            <ListGroup>
                {userList.getRegisteredUsers().map(u =><ListGroup.Item key={u.username}><UserDisplay user={u}/></ListGroup.Item>)}
            </ListGroup>
        </Accordion.Body>
    </Accordion.Item>
    <Accordion.Item eventKey="1">
        <Accordion.Header>
            <Stack direction="horizontal" gap={3}>
                Guests:
                <Badge bg="secondary">{userList.getGuestsCount()}</Badge>
            </Stack>
        </Accordion.Header>
        <Accordion.Body>
            <ListGroup>
                {userList.getGuests().map(u =><ListGroup.Item key={u.username}><UserDisplay user={u}/></ListGroup.Item>)}
            </ListGroup>
        </Accordion.Body>
    </Accordion.Item>
</Accordion>

export default UserListDisplay