import { Dispatch, SetStateAction } from "react"
import { Button, Card, Stack } from "react-bootstrap"

type Props = {
    setLogin: Dispatch<SetStateAction<string | null>>,
    logIn: () => void
}

const Login = ({setLogin, logIn}: Props) => <Card body>
    <Stack gap={3}>
        <span>Login</span>
        <span><Button onClick={logIn}>Login</Button></span>
    </Stack>
</Card>

export default Login
