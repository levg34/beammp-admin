import { logDateToDate } from "../utils/dateUtils";
import ConnexionEvent from "./ConnexionEvent";
import User, {UserType} from "./User";

export type MergeType = {
    merged: User[],
    added: User[]
}

export default class UserList {
    users: User[]

    constructor(events: ConnexionEvent[]) {
        this.users = []
        events.forEach(e => {
            if (this.containsName(e.username)) {
                const user = this.getUser(e.username)
                user.connected = e.connected
                if (e.connected) {
                    user.lastConnexion = logDateToDate(e.date).toISOString()
                    user.nbConnexions += 1
                }
            } else {
                this.users.push(new User({
                    username: e.username,
                    connected: e.connected,
                    lastConnexion: logDateToDate(e.date).toISOString(),
                    guest: e.username.startsWith('guest')
                }))
            }
        })
    }

    contains(user: User): boolean {
        return this.users.map(u => u.username).includes(user.username)
    }

    containsName(username: string):boolean {
        return this.users.map(u => u.username).includes(username)
    }

    getUser(username: string): User {
        const user = this.users.find(u => u.username === username);
        if (!user) throw Error('User '+username+' not found')
        return user
    }

    getConnected(): User[] {
        return this.users.filter(u => u.connected)
    }

    getUsers(): User[] {
        return [...this.users]
    }

    getRegisteredUsers(): User[] {
        return this.users.filter(u => !u.guest)
    }

    getGuestsCount(): number {
        return this.users.filter(u => u.guest).length
    }

    getConnectedCount(): number {
        return this.getConnected().length
    }

    getRegisteredCount(): number {
        return this.getRegisteredUsers().length
    }

    getUsersCount(): number {
        return this.getUsers().length
    }

    getGuests(): User[] {
        return this.users.filter(u => u.guest)
    }

    static fromLogs(logs?: string): UserList {
        if (!logs) return new UserList([])
        const logsArray = logs.split('\n')
        const connexionStream: ConnexionEvent[] = logsArray.filter(l => l.includes(' : Connected') || l.includes(' Connection Terminated')).map(l => new ConnexionEvent(l)) ?? []
        return new UserList(connexionStream)
    }

    static fromUsers(users: UserType[]): UserList {
        const userList = new UserList([])
        userList.users = users.map(u => new User(u))
        return userList
    }

    mergeUsers(users: UserType[]): MergeType {
        const res: MergeType = {
            added: [],
            merged: []
        }
        users.map(user => new User(user)).forEach(user => {
            if (this.containsName(user.username)) {
                res.merged.push(this.getUser(user.username).merge(user))
            } else {
                this.users.push(user)
                res.added.push(user)
            }
        })
        return res
    }

    mergeLogs(logs: string): MergeType {
        const usersToMerge = UserList.fromLogs(logs).getUsers()
        return this.mergeUsers(usersToMerge)
    }
}
