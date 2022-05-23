import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { SSHExecCommandResponse } from 'node-ssh'
import usersConfig from '../../config/usersConfig.json'
import { getLogger } from '../../utils/loggerUtils'
import { getSSHClient } from '../../utils/sshUtils'

const logger = getLogger('switch-config.ts')

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SSHExecCommandResponse|{error: any}>
) {
    const session = await getSession({ req })
    if (!session) return res.status(401).json({error: 'Unauthorized'})
    if (!session.user?.email || !usersConfig.admins.includes(session.user?.email)) return res.status(403).json({error: 'Forbidden'})

    const sshClient = await getSSHClient()

    const { selected, saveCurrent }: { selected: string, saveCurrent: boolean } = req.body

    if (saveCurrent) {
        await sshClient.execCommand('cp beammp-server/ServerConfig.toml beammp-server/ServerConfigUnsaved.toml')
    }
  
    const response = await sshClient.execCommand(`cp beammp-server/${selected} beammp-server/ServerConfig.toml`)

    logger.info({selected, response, user: session.user.email}, 'switch config')
  
    res.status(200).json(response)
}
