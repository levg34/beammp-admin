import { getSSHClient } from './sshUtils';
import { definitions } from '../types/supabase';
import getDBClient from './dbUtils';
import UserList from '../classes/UserList';

async function extractUsersToDb() {
    const ssh = await getSSHClient()
    const supabase = getDBClient()
    const response = await ssh.execCommand('ls logs/')

    const files: string[] = response.stdout.split('\n');
    
    for (const file of files) {
        const {stdout: logs} = await ssh.execCommand('cat logs/'+file)
        const userList = UserList.fromLogs(logs)
        const { data, error } = await supabase.from<definitions['user']>('user').insert(userList.getUsers().map(user => {
            const { username, guest, lastConnexion, nbConnexions } = user
            return {
                username, guest, last_connexion: lastConnexion, nb_connexions: nbConnexions
            }
        }))
        if (error) throw error
    
        await supabase.from<definitions['logfiles']>('logfiles').insert({ filename: file, imported_at: new Date() })
    }

    return {}
}

export default extractUsersToDb
