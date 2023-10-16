import type { NextApiRequest, NextApiResponse } from 'next'
import { SSHExecCommandResponse } from 'node-ssh'
import { getSession } from 'next-auth/react'
import { getLogger } from '@utils/loggerUtils'
import { getSSHClient } from '@utils/sshUtils'

import usersConfig from '@config/usersConfig.json'

const logger = getLogger('rename-config.ts')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SSHExecCommandResponse | {error:any}>
) {
  try {
    const session = await getSession({ req })
    if (!session) return res.status(401).json({error: 'Unauthorized'})
    if (!session.user?.email || !usersConfig.admins.includes(session.user?.email)) return res.status(403).json({error: 'Forbidden'})

    const sshClient = await getSSHClient()

    const { configFile, newName } = req.body
  
    const response = await sshClient.execCommand(`cd beammp-server; mv ${configFile} ${newName}`)

    logger.info({response, configFile, newName, user: session.user.email}, 'rename config')
  
    res.status(200).json(response)
  } catch (error) {
    logger.error(error)
    res.status(500).json({error})
  }
}
