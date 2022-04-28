// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { SSHExecCommandResponse } from 'node-ssh'
import { getSSHClient } from '../../utils/sshUtils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SSHExecCommandResponse>
) {
  const sshClient = await getSSHClient()

  const response = await sshClient.execCommand(`sed '/Backend response failed to parse as valid json/d' ./beammp-server/Server.log`)

  res.status(200).json(response)
}
