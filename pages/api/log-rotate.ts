import type { NextApiRequest, NextApiResponse } from 'next'
import { SSHExecCommandResponse } from 'node-ssh'
import { getSSHClient } from '../../utils/sshUtils'
import { logDateToISODate } from '../../utils/dateUtils'
import { getSedFilterString } from '../../utils/configUtils'
import { getLogger } from '../../utils/loggerUtils'

const logger = getLogger('log-rotate.ts.ts')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SSHExecCommandResponse | {error: any}>
) {
  try {
    const sshClient = await getSSHClient()
  
    const {stdout: bashDate, stderr} = await sshClient.execCommand(`tail -1 beammp-server/Server.log | awk -F'[][]' '{print $2}'`)
  
    const date = logDateToISODate(bashDate)
  
    const response = await sshClient.execCommand(`sed '${getSedFilterString()}' ./beammp-server/Server.log > ./logs/${date}_Server.log`)
  
    response.stdout += `copied ./beammp-server/Server.log to ./logs/${date}_Server.log`

    logger.info({from:'./beammp-server/Server.log', to: `./logs/${date}_Server.log`, response, user: 'luc'},'log rotated')
  
    res.status(200).json(response)
  } catch (error) {
    logger.error(error)
    res.status(500).json({error})
  }
}
