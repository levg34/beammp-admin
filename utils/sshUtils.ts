import { NodeSSH, SSHExecCommandResponse } from 'node-ssh'


let sshClient: NodeSSH | null = null

export async function getSSHClient(): Promise<NodeSSH> {
    if (!sshClient) {
        const ssh = new NodeSSH()
        const { HOST, USERNAME, PASSWORD } = process.env
        sshClient = await ssh.connect({
            host: HOST,
            username: USERNAME,
            password: PASSWORD
        })
    }

    return sshClient
}
