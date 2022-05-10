import type { NextApiRequest, NextApiResponse } from 'next'
import { SSHExecCommandResponse } from 'node-ssh'
import { getLogger } from '../../utils/loggerUtils'
import { resetSSHClient } from '../../utils/sshUtils'

const logger = getLogger('reset-ssh.ts')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SSHExecCommandResponse | {error: any}>
) {
  try {
    const sshClient = await resetSSHClient()
  
    const response = await sshClient.execCommand('echo ok')

    logger.info({response, user: 'luc'}, 'reset ssh connection')
  
    res.status(200).json(response)
  } catch (error) {
    logger.error(error)
    res.status(500).json({error})
  }
}
