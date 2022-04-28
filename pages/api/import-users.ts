// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { SSHExecCommandResponse } from 'node-ssh'
import extractUsersToDb from '../../utils/extractUsersToDb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const inserted = await extractUsersToDb()

  res.status(200).json(inserted)
}
