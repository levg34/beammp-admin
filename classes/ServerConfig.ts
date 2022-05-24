import toml from 'toml'
import _ from 'lodash'
import json2toml from 'json2toml'

type ServerConfigValue = string | number | boolean

export type ServerConfigType = {
    General: Record<string,ServerConfigValue>
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

    toTOML(): string {
        return json2toml(this.config, { indent: 0, newlineAfterSection: true })
    }

    editConfig(key: string, value: ServerConfigValue): ServerConfig {
        const editedConfig = new ServerConfig()
        editedConfig.config = {...this.config}
        const confVal = editedConfig.config.General[key]

        if (typeof confVal === 'string') {
            editedConfig.config.General[key] = value
        } else if (typeof confVal === 'number') {
            const numberValue = Number(value)
            if (value !== '' && Number.isInteger(numberValue)) {
                editedConfig.config.General[key] = numberValue
            }
        } else if (typeof confVal === 'boolean') {
            editedConfig.config.General[key] = value
        } else {
            editedConfig.config.General[key] = value
        }
        return editedConfig
    }
}
