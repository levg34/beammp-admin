// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { NodeSSH, SSHExecCommandResponse } from 'node-ssh'

const ssh = new NodeSSH()

const { HOST, USERNAME, PASSWORD } = process.env

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SSHExecCommandResponse>
) {
  const sshClient = await ssh.connect({
    host: HOST,
    username: USERNAME,
    password: PASSWORD
  })

  const response = await sshClient.execCommand('cat ../remy/beammp-server/Server.log')

  res.status(200).json(response)
}
