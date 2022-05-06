import filtersConfig from '../config/filtersConfig.json'
import getDBClient from './dbUtils'
import { definitions } from '../types/supabase'

function getFilters(): string[] {
    return filtersConfig.filters ?? []
}

function getSedFilterString(): string {
    const filters = getFilters()
    return filters.map(f => `/${f}/d`).join(';')
}

async function saveConfigToDb(config: definitions['config']) {
    const supabase = getDBClient()
    const res = supabase.from<definitions['config']>('config').insert([config])
    return res
}

export {
    getFilters,
    getSedFilterString,
    saveConfigToDb
}
