// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { SSHExecCommandResponse } from 'node-ssh'
import { getSSHClient } from '../../utils/sshUtils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SSHExecCommandResponse | {error: any}>
) {
  try {
    const sshClient = await getSSHClient()
  
    const response = await sshClient.execCommand('pgrep BeamMP')
  
    res.status(200).json(response)
  } catch (error) {
    console.error(error)
    res.status(500).json({error})
  }
}
