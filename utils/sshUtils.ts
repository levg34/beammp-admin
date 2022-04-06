import { NodeSSH, SSHExecCommandResponse } from 'node-ssh'


let sshClient: NodeSSH | null = null

export async function getSSHClient(): Promise<NodeSSH> {
    if (!sshClient) {
        const ssh = new NodeSSH()
        const { HOST, USERNAME, PRIVATE_KEY } = process.env
        sshClient = await ssh.connect({
            host: HOST,
            username: USERNAME,
            privateKey: PRIVATE_KEY
        })
    }

    return sshClient
}

export async function resetSSHClient(): Promise<NodeSSH> {
    sshClient = null
    return await getSSHClient()
}
