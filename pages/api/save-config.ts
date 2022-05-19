import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { saveConfigToDb } from '../../utils/configUtils'
import { definitions } from '../../types/supabase'
import { getLogger } from '../../utils/loggerUtils'

import usersConfig from '../../config/usersConfig.json'

const logger = getLogger('save-config.ts')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req })

    if (!session) return res.status(401).json({error: 'Unauthorized'})

    if (!session.user?.email || !usersConfig.admins.includes(session.user?.email)) return res.status(403).json({error: 'Forbidden'})

    const config: definitions['config'] = req.body
    const result = await saveConfigToDb(config)
  
    logger.info({config, result, user: session.user.email}, 'save config')

    res.status(200).json(result)
  } catch (error) {
    logger.error(error)
    res.status(500).json({error})
  }
}
