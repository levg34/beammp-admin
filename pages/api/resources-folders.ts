import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getLogger } from '@utils/loggerUtils'
import { getSSHClient } from '@utils/sshUtils'

import usersConfig from '@config/usersConfig.json'

const logger = getLogger('resources-folders.ts')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[] | {error:any}>
) {
  try {
    const session = await getSession({ req })
    if (!session) return res.status(401).json({error: 'Unauthorized'})
    if (!session.user?.email || !usersConfig.admins.includes(session.user?.email)) return res.status(403).json({error: 'Forbidden'})

    const sshClient = await getSSHClient()
  
    const response = await sshClient.execCommand(`cd beammp-server; ls -d */ | cut -f1 -d'/' | grep Resources`)

    logger.info({response, user: session.user.email}, 'list resources folders')
  
    res.status(200).json(response.stdout.split('\n'))
  } catch (error) {
    logger.error(error)
    res.status(500).json({error})
  }
}
