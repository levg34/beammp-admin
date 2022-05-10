import type { NextApiRequest, NextApiResponse } from 'next'
import { SSHExecCommandResponse } from 'node-ssh'
import { getLogger } from '../../utils/loggerUtils'
import { getSSHClient } from '../../utils/sshUtils'

const logger = getLogger('config.ts')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SSHExecCommandResponse | {error: any}>
) {
  try {
    const sshClient = await getSSHClient()
    const response = await sshClient.execCommand('cat beammp-server/ServerConfig.toml')
    logger.info({response, user: 'luc'}, 'get config')
    res.status(200).json(response)
  } catch (error) {
    logger.error(error)
    res.status(500).json({error})
  }
}
