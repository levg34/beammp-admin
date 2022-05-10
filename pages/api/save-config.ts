import type { NextApiRequest, NextApiResponse } from 'next'
import { saveConfigToDb } from '../../utils/configUtils'
import { definitions } from '../../types/supabase'
import { getLogger } from '../../utils/loggerUtils'

const logger = getLogger('save-config.ts')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const config: definitions['config'] = req.body
    const result = await saveConfigToDb(config)
  
    logger.info({config, result, user: 'luc'}, 'save config')

    res.status(200).json(result)
  } catch (error) {
    logger.error(error)
    res.status(500).json({error})
  }
}
