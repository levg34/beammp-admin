import { signIn } from "next-auth/react"
import { Button, Card, Stack } from "react-bootstrap"

const Login = () => <Card body>
    <Stack direction="horizontal" gap={2}>
        <span>Login</span>
        <span className="ms-auto"><Button onClick={() => signIn()}>Login</Button></span>
    </Stack>
</Card>

export default Login
