import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import ServerConfig from '../../classes/ServerConfig'
import usersConfig from '../../config/usersConfig.json'
import { getLogger } from '../../utils/loggerUtils'
import { getSSHClient } from '../../utils/sshUtils'

const logger = getLogger('list-configs.ts')

export type ConfigList = {
    files: string[]
    current: string | null
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ConfigList|{error: any}>
) {
    const session = await getSession({ req })
    if (!session) return res.status(401).json({error: 'Unauthorized'})
    if (!session.user?.email || !usersConfig.admins.includes(session.user?.email)) return res.status(403).json({error: 'Forbidden'})

    const sshClient = await getSSHClient()
  
    const response = await sshClient.execCommand('cd beammp-server; ls ServerConfig*')

    logger.info({response, user: session.user.email}, 'list configs')

    const files = response.stdout.split('\n').filter(f => f !== 'ServerConfig.toml')

    const { stdout: mainConfStr } = await sshClient.execCommand('cat beammp-server/ServerConfig.toml')
    const mainConfig = new ServerConfig(mainConfStr)

    let current = null

    for (const configFile of files) {
        const { stdout: configString } = await sshClient.execCommand('cd beammp-server; cat '+configFile)
        const config = new ServerConfig(configString)
        if (config.equals(mainConfig)) {
            current = configFile
            break
        }
    }
  
    res.status(200).json({
        files,
        current
    })
}
