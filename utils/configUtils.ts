import filtersConfig from '../config/filtersConfig.json'

function getFilters(): string[] {
    return filtersConfig.filters ?? []
}

function getSedFilterString(): string {
    const filters = getFilters()
    return filters.map(f => `/${f}/d`).join(';')
}

export {
    getFilters,
    getSedFilterString
}