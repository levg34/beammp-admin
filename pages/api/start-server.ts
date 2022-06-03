import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { SSHExecCommandResponse } from 'node-ssh'
import { getLogger } from '@utils/loggerUtils'
import { getSSHClient } from '@utils/sshUtils'

import usersConfig from '@config/usersConfig.json'

const logger = getLogger('start-server.ts')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SSHExecCommandResponse|{error:string}>
) {
  const sshClient = await getSSHClient()

  const response: SSHExecCommandResponse = {
    stdout: 'stdout ignored, see Server.log',
    stderr: 'stderr redirected to logger.error',
    code: 0,
    signal: null
  }

  try {
    const session = await getSession({ req })
    if (!session) return res.status(401).json({error: 'Unauthorized'})
    if (!session.user?.email || !usersConfig.admins.includes(session.user?.email)) return res.status(403).json({error: 'Forbidden'})

    sshClient.exec('./BeamMP-Server-linux',[], {
      cwd: './beammp-server',
      onStderr(chunk) {
        logger.error('stderrChunk', chunk.toString('utf8'))
      }
    })
    logger.info({response, user: session.user.email}, 'server started')
  } catch (error) {
    logger.error(error)
  } finally {
    // pgrep BeamMP
    // kill -2 $(pgrep BeamMP)
  
    res.status(200).json(response)
  }

}
