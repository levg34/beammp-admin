import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { SSHExecCommandResponse } from 'node-ssh'
import { getLogger } from '@utils/loggerUtils'
import { getSSHClient } from '@utils/sshUtils'

import usersConfig from '@config/usersConfig.json'

const logger = getLogger('config.ts')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SSHExecCommandResponse | {error: any}>
) {
  try {
    const session = await getSession({ req })
    if (!session) return res.status(401).json({error: 'Unauthorized'})
    if (!session.user?.email || !usersConfig.admins.includes(session.user?.email)) return res.status(403).json({error: 'Forbidden'})

    const { file, config }: { file: string, config: string } = req.body

    const sshClient = await getSSHClient()
    const response = await sshClient.execCommand(`echo '${config}'> beammp-server/${file}`)
    logger.info({response, user: session.user.email}, 'get config')
    res.status(200).json(response)
  } catch (error) {
    logger.error(error)
    res.status(500).json({error})
  }
}
