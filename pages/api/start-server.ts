// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { SSHExecCommandResponse } from 'node-ssh'
import { getSSHClient } from '../../utils/sshUtils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SSHExecCommandResponse>
) {
  const sshClient = await getSSHClient()

  const response: SSHExecCommandResponse = {
    stdout: 'stdout ignored, see Server.log',
    stderr: 'stderr redirected to console.error',
    code: 0,
    signal: null
  }

  sshClient.exec('./BeamMP-Server-linux',[], {
    cwd: './beammp-server',
    onStderr(chunk) {
      console.error('stderrChunk', chunk.toString('utf8'))
    }
  })

  // pgrep BeamMP
  // kill -2 $(pgrep BeamMP)

  res.status(200).json(response)
}
