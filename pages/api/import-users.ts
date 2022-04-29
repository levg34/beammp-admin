// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import extractUsersToDb, { ExtractReport } from '../../utils/extractUsersToDb'

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
    res.status(500).json({error})
  }

  res.status(200).json(inserted)
}
