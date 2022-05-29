import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import usersConfig from '../../../config/usersConfig.json'
import { getLogger } from '../../../utils/loggerUtils'
import { getSSHClient } from '../../../utils/sshUtils'

const logger = getLogger('list-configs.ts')

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string[]|{error: any}>
) {
    try {
        const session = await getSession({ req })
        if (!session) return res.status(401).json({error: 'Unauthorized'})
        if (!session.user?.email || !usersConfig.admins.includes(session.user?.email)) return res.status(403).json({error: 'Forbidden'})

        const { folder } = req.query

        const sshClient = await getSSHClient()
        
        const response = await sshClient.execCommand(`cd beammp-server/${folder}/Client; for FILE in \`ls -S\`; do du -sh $FILE ; done`)

        if (response.stderr) return res.status(500).json({error: response.stderr})
        
        logger.info({response, user: session.user.email}, 'list resources')
        
        res.status(200).json(response.stdout.split('\n'))
    } catch (error) {
        logger.error(error)
        res.status(500).json({error})
    }
}
