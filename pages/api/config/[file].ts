import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getLogger } from '@utils/loggerUtils'
import { getSSHClient } from '@utils/sshUtils'
import ServerConfig, { ServerConfigType } from '@classes/ServerConfig'

import usersConfig from '@config/usersConfig.json'

const logger = getLogger('config.ts')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ServerConfigType | {error: any}>
) {
  try {
    const session = await getSession({ req })
    if (!session) return res.status(401).json({error: 'Unauthorized'})
    if (!session.user?.email || !usersConfig.admins.includes(session.user?.email)) return res.status(403).json({error: 'Forbidden'})

    const sshClient = await getSSHClient()

    const { file } = req.query
    const response = await sshClient.execCommand(`cat beammp-server/${file}`)
    logger.info({response, user: session.user.email}, 'get config')
    const configString = response.stdout
    const config = new ServerConfig(configString)
    res.status(200).json(config.config)
  } catch (error) {
    logger.error(error)
    res.status(500).json({error})
  }
}
