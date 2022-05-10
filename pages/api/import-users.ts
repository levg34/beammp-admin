import type { NextApiRequest, NextApiResponse } from 'next'
import extractUsersToDb, { ExtractReport } from '../../utils/extractUsersToDb'
import { getLogger } from '../../utils/loggerUtils'

const logger = getLogger('import-users.ts')

type ErrorReturnType = {
  error: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExtractReport | ErrorReturnType>
) {

  let inserted = {}
  try {
    inserted = await extractUsersToDb()
  } catch (error) {
    logger.error(error)
    res.status(500).json({error})
  }

  logger.info({users: inserted, user: 'luc'}, 'inserted users')

  res.status(200).json(inserted)
}
