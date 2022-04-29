export type UserType = {
    username: string
    connected: boolean
    lastConnexion: string
    nbConnexions?: number
    guest: boolean
}

export default class User {
    username: string
    connected: boolean
    lastConnexion: string
    nbConnexions: number
    guest: boolean

    constructor(userObject: UserType) {
        const {username, connected, lastConnexion, guest, nbConnexions} = userObject
        this.username = username
        this.connected = connected
        this.lastConnexion = lastConnexion
        this.guest = guest
        if (nbConnexions) {
            this.nbConnexions = nbConnexions
        } else {
            this.nbConnexions = 1
        }
    }

    merge(user: UserType): User {
        if (this.username !== user.username) throw Error('Cannot merge different users')
        if (this.lastConnexion < user.lastConnexion) {
            this.lastConnexion = user.lastConnexion
            this.connected = user.connected
        }
        if (user.nbConnexions) {
            this.nbConnexions += user.nbConnexions
        }
        return this
    }
}
