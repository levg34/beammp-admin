// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { SSHExecCommandResponse } from 'node-ssh'
import { getSSHClient } from '../../utils/sshUtils'
import { logDateToISODate } from '../../utils/dateUtils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SSHExecCommandResponse>
) {
  const sshClient = await getSSHClient()

  const {stdout: bashDate, stderr} = await sshClient.execCommand(`tail -1 beammp-server/Server.log | awk -F'[][]' '{print $2}'`)

  const date = logDateToISODate(bashDate)

  const response = await sshClient.execCommand(`sed '/Backend response failed to parse as valid json/d' ./beammp-server/Server.log > ./logs/${date}_Server.log`)

  response.stdout += `copied ./beammp-server/Server.log to ./logs/${date}_Server.log`

  res.status(200).json(response)
}
