import type { NextApiRequest, NextApiResponse } from 'next'
import { SSHExecCommandResponse } from 'node-ssh'
import { getSedFilterString } from '../../utils/configUtils'
import { getLogger } from '../../utils/loggerUtils'
import { getSSHClient } from '../../utils/sshUtils'

const logger = getLogger('logs.ts')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SSHExecCommandResponse | {error:any}>
) {
  try {
    const sshClient = await getSSHClient()
  
    const response = await sshClient.execCommand(`sed '${getSedFilterString()}' ./beammp-server/Server.log`)

    logger.info({response, user: 'luc'}, 'get logs')
  
    res.status(200).json(response)
  } catch (error) {
    logger.error(error)
    res.status(500).json({error})
  }
}
