import type { NextApiRequest, NextApiResponse } from 'next'
import { SSHExecCommandResponse } from 'node-ssh'
import { getSession } from 'next-auth/react'
import { getSSHClient } from '../../utils/sshUtils'
import { logDateToISODate } from '../../utils/dateUtils'
import { getSedFilterString } from '../../utils/configUtils'
import { getLogger } from '../../utils/loggerUtils'

import usersConfig from '../../config/usersConfig.json'

const logger = getLogger('log-rotate.ts')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SSHExecCommandResponse | {error: any}>
) {
  try {
    const session = await getSession({ req })

    if (!session) return res.status(401).json({error: 'Unauthorized'})

    if (!session.user?.email || !usersConfig.admins.includes(session.user?.email)) return res.status(403).json({error: 'Forbidden'})

    const sshClient = await getSSHClient()
  
    const {stdout: bashDate, stderr} = await sshClient.execCommand(`tail -1 beammp-server/Server.log | awk -F'[][]' '{print $2}'`)
  
    const date = logDateToISODate(bashDate)
  
    const response = await sshClient.execCommand(`sed '${getSedFilterString()}' ./beammp-server/Server.log > ./logs/${date}_Server.log`)
  
    response.stdout += `copied ./beammp-server/Server.log to ./logs/${date}_Server.log`

    logger.info({from:'./beammp-server/Server.log', to: `./logs/${date}_Server.log`, response, user: session.user.email},'log rotated')
  
    res.status(200).json(response)
  } catch (error) {
    logger.error(error)
    res.status(500).json({error})
  }
}
