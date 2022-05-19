import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import extractUsersToDb, { ExtractReport } from '../../utils/extractUsersToDb'
import { getLogger } from '../../utils/loggerUtils'

import usersConfig from '../../config/usersConfig.json'

const logger = getLogger('import-users.ts')

type ErrorReturnType = {
  error: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExtractReport | ErrorReturnType>
) {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({error: 'Unauthorized'})
  if (!session.user?.email || !usersConfig.admins.includes(session.user?.email)) return res.status(403).json({error: 'Forbidden'})

  let inserted = {}
  try {
    inserted = await extractUsersToDb()
  } catch (error) {
    logger.error(error)
    res.status(500).json({error})
  }

  logger.info({users: inserted, user: session.user.email}, 'inserted users')

  res.status(200).json(inserted)
}
