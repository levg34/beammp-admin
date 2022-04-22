export default class ConnexionEvent {
    connected: boolean
    date: string
    username: string
    constructor(logLine: string) {
        this.date = logLine.substring(1,18)

        if (logLine.includes(' : Connected')) {
            this.connected = true
            this.username = logLine.substring(27).split(':')[0].trim()
        } else if (logLine.includes(' Connection Terminated')) {
            this.connected = false
            this.username = logLine.substring(27).split('Connection')[0].trim()
        } else {
            throw Error('Could not parse status')
        }
    }
}
