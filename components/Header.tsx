import { DefaultSession } from "next-auth"
import { signOut } from "next-auth/react"
import { Button, Card, Image, Stack } from "react-bootstrap"

type Props = {
    user: DefaultSession['user']
}

const Header = ({ user }: Props) => <Card body>
    <Stack direction="horizontal" gap={2}>
        <span><span className="d-none d-sm-inline">Logged in as </span>{user?.name ?? 'Luc'}</span>
        <Image src={user?.image ?? 'https://avatars.githubusercontent.com/u/137276?v=4'} roundedCircle style={{height: 35}} alt="avatar"/>
        <Button onClick={() => signOut()} className="ms-auto">Log out</Button>
    </Stack>
</Card>

export default Header