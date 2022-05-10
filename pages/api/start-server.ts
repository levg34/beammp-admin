import type { NextApiRequest, NextApiResponse } from 'next'
import { SSHExecCommandResponse } from 'node-ssh'
import { getSSHClient } from '../../utils/sshUtils'
import { pino } from 'pino'

const logger = pino().child({file: 'start-server.ts'})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SSHExecCommandResponse>
) {
  const sshClient = await getSSHClient()

  const response: SSHExecCommandResponse = {
    stdout: 'stdout ignored, see Server.log',
    stderr: 'stderr redirected to logger.error',
    code: 0,
    signal: null
  }

  try {
    sshClient.exec('./BeamMP-Server-linux',[], {
      cwd: './beammp-server',
      onStderr(chunk) {
        logger.error('stderrChunk', chunk.toString('utf8'))
      }
    })
    logger.info({user: 'luc'}, 'server started')
  } catch (error) {
    logger.error(error)
  } finally {
    // pgrep BeamMP
    // kill -2 $(pgrep BeamMP)
  
    res.status(200).json(response)
  }

}
