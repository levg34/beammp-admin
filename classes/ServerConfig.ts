import toml from 'toml'
import _ from 'lodash'

export type ServerConfigType = {
    General: Record<string,string | number | boolean>
}

export default class ServerConfig {
    config: ServerConfigType
    filename?: string

    constructor(config?: string, filename?: string) {
        if (config) {
            this.config = toml.parse(config)
        } else {
            this.config = {
                General: {}
            }
        }
        this.filename = filename
    }

    toJSON(): string {
        return JSON.stringify(this.config.General)
    }

    equals(otherConfig: ServerConfig) {
        return _.isEqual(this.config.General, otherConfig.config.General)
    }

    configObject(): ServerConfigType['General'] {
        return this.config.General
    }
}
