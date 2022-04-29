import { Badge, Stack } from "react-bootstrap";
import User from "../classes/User";
import { isoDateToLocalDate } from "../utils/dateUtils";

type Props = {
    user: User
}

const UserDisplay = ({user}: Props) => <Stack direction="horizontal" gap={2}>
    <b>{user.username}</b>
    <Badge bg="primary">{user.nbConnexions}</Badge>
    {user.guest && <Badge pill bg="secondary">guest</Badge>}
    <div className="vr"></div>
    {isoDateToLocalDate(user.lastConnexion)}
</Stack>

export default UserDisplay