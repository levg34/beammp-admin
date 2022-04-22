type UserType = {
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
    nbConnexions: number = 1
    guest: boolean

    constructor(userObject: UserType) {
        const {username, connected, lastConnexion, guest} = userObject
        this.username = username
        this.connected = connected
        this.lastConnexion = lastConnexion
        this.guest = guest
    }
}
