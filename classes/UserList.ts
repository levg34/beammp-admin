import ConnexionEvent from "./ConnexionEvent";
import User from "./User";

export default class UserList {
    users: User[]

    constructor(events: ConnexionEvent[]) {
        this.users = []
        events.forEach(e => {
            if (this.containsName(e.username)) {
                const user = this.getUser(e.username);
                user.connected = e.connected
                if (e.connected) {
                    user.lastConnexion = e.date
                    user.nbConnexions += 1
                }
            } else {
                this.users.push(new User({
                    username: e.username,
                    connected: e.connected,
                    lastConnexion: e.date,
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
}
