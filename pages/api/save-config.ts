import type { NextApiRequest, NextApiResponse } from 'next'
import { saveConfigToDb } from '../../utils/configUtils'
import { definitions } from '../../types/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const config: definitions['config'] = req.body
  const result = await saveConfigToDb(config)

  res.status(200).json(result)
}
