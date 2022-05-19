import { signIn } from "next-auth/react"
import { Button, Card, Stack } from "react-bootstrap"

const Login = () => <Card body>
    <Stack gap={3}>
        <span>Login</span>
        <span><Button onClick={() => signIn()}>Login</Button></span>
    </Stack>
</Card>

export default Login
