import type { NextApiRequest, NextApiResponse } from 'next'
import { SSHExecCommandResponse } from 'node-ssh'
import { getSSHClient } from '../../utils/sshUtils'
import { pino } from 'pino'

const logger = pino().child({file: 'stop-server.ts'})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SSHExecCommandResponse | {error: any}>
) {
  try {
    const sshClient = await getSSHClient()
  
    const response = await sshClient.execCommand('kill -2 $(pgrep BeamMP)')
  
    logger.info({response, user: 'luc'}, 'server started')
    
    res.status(200).json(response)
  } catch (error) {
    logger.error(error)
    res.status(500).json({error})
  }
}
