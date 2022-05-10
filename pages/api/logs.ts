import type { NextApiRequest, NextApiResponse } from 'next'
import { SSHExecCommandResponse } from 'node-ssh'
import { getSedFilterString } from '../../utils/configUtils'
import { getSSHClient } from '../../utils/sshUtils'
import { pino } from 'pino'

const logger = pino().child({file: 'logs.ts'})

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
