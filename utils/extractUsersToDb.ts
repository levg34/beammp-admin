import { getSSHClient } from './sshUtils';
import { definitions } from '../types/supabase';
import getDBClient from './dbUtils';
import UserList, { MergeType } from '../classes/UserList';
import User from '../classes/User';

export type ExtractReport = Record<string,MergeType>

async function extractUsersToDb(): Promise<ExtractReport> {
    const ssh = await getSSHClient()
    const supabase = getDBClient()
    const res: ExtractReport = {}
    const response = await ssh.execCommand('ls logs/')

    const files: string[] = response.stdout.split('\n')
    const insertedFiles: string[] = (await supabase.from<definitions['logfiles']>('logfiles').select('filename')).data?.map(d => d.filename) ?? []
    
    for (const file of files.filter(f => !insertedFiles.includes(f))) {
        const {stdout: logs} = await ssh.execCommand('cat logs/'+file)

        const users = (await supabase.from<definitions['user']>('user').select('*')).data?.map(user => new User({
            username: user.username,
            connected: false,
            guest: user.guest,
            lastConnexion: user.last_connexion,
            nbConnexions: user.nb_connexions
        }))

        const userList = users ? UserList.fromUsers(users) : new UserList([])
        const { added, merged } = userList.mergeLogs(logs)

        res[file] = {added,merged}

        const userToDBUser = (user: User): { username: string; guest: boolean; last_connexion: string; nb_connexions: number; } => {
            const { username, guest, lastConnexion, nbConnexions } = user;
            return {
                username, guest, last_connexion: lastConnexion, nb_connexions: nbConnexions
            };
        };

        await supabase.from<definitions['user']>('user').insert(added.map(userToDBUser))

        for (const user of merged.map(userToDBUser)) {
            await supabase.from<definitions['user']>('user').update({ last_connexion: user.last_connexion, nb_connexions: user.nb_connexions }).eq('username', user.username)
        }
    
        await supabase.from<definitions['logfiles']>('logfiles').insert({ filename: file, imported_at: new Date() })
    }

    return res
}

export default extractUsersToDb
